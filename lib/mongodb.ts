import mongoose from 'mongoose'

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB(retries = 5): Promise<typeof import('mongoose')> {
  // MongoDB connection string
  const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://info_db_user:GaB2FhLOZYuuVeSQ@dubaicluster0.vhpvzim.mongodb.net/whitlin-ecommerce-new'

  if (!process.env.MONGODB_URI) {
    console.warn('MONGODB_URI not found in environment variables, using hardcoded fallback. Please add MONGODB_URI to .env.local')
  }

  let lastError: Error | null = null

  // Extract database name from MONGO_URI
  const dbNameMatch = MONGO_URI.match(/\/([^?]+)/)
  const targetDbName = dbNameMatch ? dbNameMatch[1] : null

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Check if we have a cached connection
      if (cached.conn) {
        // Check if the database name matches - if not, disconnect and reconnect
        const currentDbName = mongoose.connection.db?.databaseName
        if (currentDbName && targetDbName && currentDbName !== targetDbName) {
          console.log(`Database name changed from "${currentDbName}" to "${targetDbName}", reconnecting...`)
          await mongoose.disconnect()
          cached.conn = null
          cached.promise = null
        }

        // Verify connection is still alive
        // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
        const readyState = mongoose.connection.readyState as number
        if (readyState === 1 && cached.conn) {
          // Connection is connected and ready
          console.log(`MongoDB connected to database: ${mongoose.connection.db?.databaseName || 'unknown'}`)
          return cached.conn
        } else if (readyState === 2 || readyState === 3) {
          // Connection is connecting or disconnecting, wait a bit
          console.log(`MongoDB connection state: ${readyState} (${readyState === 2 ? 'connecting' : 'disconnecting'}), waiting...`)
          await new Promise(resolve => setTimeout(resolve, 1000))
          if ((mongoose.connection.readyState as number) === 1 && cached.conn) {
            return cached.conn
          }
        }
        // Connection is dead (readyState === 0), clear cache
        console.warn('MongoDB connection is dead, clearing cache')
        cached.conn = null
        cached.promise = null
      }

      if (!cached.promise) {
        const opts: mongoose.ConnectOptions = {
          bufferCommands: false,
          serverSelectionTimeoutMS: 30000, // 30 seconds
          socketTimeoutMS: 60000, // 60 seconds
          connectTimeoutMS: 30000, // 30 seconds
          maxPoolSize: 10, // Increased pool size for better connection management
          minPoolSize: 2, // Maintain minimum connections to avoid reconnections
          maxIdleTimeMS: 300000, // Keep connections alive for 5 minutes
          retryWrites: true,
          retryReads: true,
          // Auto-reconnect options
          autoIndex: false, // Disable auto index creation in production
          // Connection pool options
          family: 4, // Use IPv4, skip trying IPv6
        }

        cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
          const dbName = mongoose.connection.db?.databaseName || 'unknown'
          console.log(`MongoDB connected successfully to database: ${dbName}`)

          // Handle connection events - set up once globally
          if (!mongoose.connection.listeners('error').length) {
            mongoose.connection.on('error', (err) => {
              console.error('MongoDB connection error:', err)
              // Only clear cache on critical errors that require reconnection
              if (err.message?.includes('connection closed') ||
                err.message?.includes('topology was destroyed') ||
                err.message?.includes('connection timeout')) {
                console.warn('Critical MongoDB error detected, clearing cache for reconnection')
                cached.conn = null
                cached.promise = null
              }
            })

            mongoose.connection.on('disconnected', () => {
              console.warn('MongoDB disconnected - will attempt to reconnect automatically')
              // Don't clear cache immediately - mongoose will try to reconnect
              // Only clear if still disconnected after a delay
              setTimeout(() => {
                if ((mongoose.connection.readyState as number) === 0) {
                  console.warn('MongoDB still disconnected after 10s, clearing cache for fresh connection')
                  cached.conn = null
                  cached.promise = null
                }
              }, 10000)
            })

            mongoose.connection.on('reconnected', () => {
              console.log('MongoDB reconnected successfully')
              cached.conn = mongoose
            })

            mongoose.connection.on('connected', () => {
              console.log('MongoDB connected - readyState:', mongoose.connection.readyState)
              cached.conn = mongoose
            })

            mongoose.connection.on('connecting', () => {
              console.log('MongoDB connecting...')
            })
          }

          return mongoose
        }).catch((error) => {
          console.error('MongoDB connection error in promise:', error)
          cached.promise = null
          cached.conn = null
          throw error
        })
      }

      cached.conn = await cached.promise

      // Verify connection is actually ready (1 = connected)
      const readyState = mongoose.connection.readyState as number
      if (readyState !== 1) {
        console.warn(`MongoDB connection promise resolved but readyState is ${readyState} (expected 1), waiting...`)
        // Wait up to 5 seconds for connection to be ready
        for (let i = 0; i < 5; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          if ((mongoose.connection.readyState as number) === 1 && cached.conn) {
            return cached.conn
          }
        }
        throw new Error(`MongoDB connection established but not ready after waiting (readyState: ${mongoose.connection.readyState})`)
      }

      return cached.conn
    } catch (e: any) {
      lastError = e
      cached.promise = null
      cached.conn = null

      // Check if it's a transient error that we should retry
      const isTransientError = e?.message?.includes('SSL') ||
        e?.message?.includes('TLS') ||
        e?.message?.includes('tlsv1') ||
        e?.message?.includes('internal error') ||
        e?.message?.includes('Connection pool') ||
        e?.message?.includes('ETIMEDOUT') ||
        e?.message?.includes('ENOTFOUND') ||
        e?.message?.includes('ECONNREFUSED') ||
        e?.message?.includes('serverSelectionTimeoutMS') ||
        e?.code === 'ETIMEDOUT' ||
        e?.code === 'ENOTFOUND' ||
        e?.code === 'ECONNREFUSED'

      if (isTransientError && attempt < retries - 1) {
        // Wait before retrying with exponential backoff
        const delay = 1000 * Math.pow(2, attempt)
        console.warn(`MongoDB connection failed (attempt ${attempt + 1}/${retries}), retrying in ${delay}ms...`)
        console.warn('Error details:', e?.message || e)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }

      // If it's not a transient error or we've exhausted retries, log and throw
      console.error('MongoDB connection failed after retries:', {
        message: e?.message || 'Unknown error',
        code: e?.code,
        name: e?.name,
        stack: e?.stack
      })

      if (isTransientError) {
        throw new Error(`Database connection failed after ${retries} attempts. This may be a temporary network issue. Please try again in a moment.`)
      }

      throw new Error(`Database connection failed: ${e?.message || 'Unknown error'}`)
    }
  }

  // If all retries failed
  throw lastError || new Error('Failed to connect to MongoDB after retries')
}

export default connectDB
