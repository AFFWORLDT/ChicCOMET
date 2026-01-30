/**
 * MongoDB connection with retry logic for handling transient SSL/TLS errors
 */

import connectDB from './mongodb'

const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

/**
 * Connects to MongoDB with retry logic for handling SSL/TLS errors
 */
export async function connectDBWithRetry(retries = MAX_RETRIES): Promise<typeof import('mongoose')> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await connectDB()
    } catch (error: any) {
      lastError = error

      // Check if it's an SSL/TLS error
      const isSSLError = error?.message?.includes('SSL') || 
                       error?.message?.includes('TLS') || 
                       error?.message?.includes('tlsv1') ||
                       error?.message?.includes('internal error')

      if (isSSLError && attempt < retries - 1) {
        // Wait before retrying with exponential backoff
        const delay = RETRY_DELAY * Math.pow(2, attempt)
        console.warn(`MongoDB SSL connection failed (attempt ${attempt + 1}/${retries}), retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }

      // If it's not an SSL error or we've exhausted retries, throw
      throw error
    }
  }

  // If all retries failed
  throw lastError || new Error('Failed to connect to MongoDB after retries')
}

