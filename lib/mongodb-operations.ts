/**
 * MongoDB operations with retry logic for critical operations like order placement
 */

import mongoose from 'mongoose'

const MAX_RETRIES = 5
const RETRY_DELAY = 1000 // 1 second

/**
 * Checks if an error is a transient SSL/TLS error that should be retried
 */
function isTransientError(error: any): boolean {
  if (!error) return false
  
  const message = (error.message || '').toLowerCase()
  const name = (error.name || '').toLowerCase()
  
  return (
    message.includes('ssl') ||
    message.includes('tls') ||
    message.includes('tlsv1') ||
    message.includes('internal error') ||
    message.includes('connection pool') ||
    message.includes('connection') ||
    message.includes('network') ||
    message.includes('operation interrupted') ||
    message.includes('client was closed') ||
    message.includes('connection closed') ||
    name === 'mongoservererror' ||
    name === 'mongoerror'
  )
}

/**
 * Executes a MongoDB operation with retry logic for transient errors
 */
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  operationName: string = 'MongoDB operation',
  maxRetries: number = MAX_RETRIES
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      // Check if it's a transient error that should be retried
      if (isTransientError(error) && attempt < maxRetries - 1) {
        const delay = RETRY_DELAY * Math.pow(2, attempt)
        console.warn(`${operationName} failed (attempt ${attempt + 1}/${maxRetries}) due to transient error, retrying in ${delay}ms...`, error.message)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }

      // If it's not a transient error or we've exhausted retries, throw
      throw error
    }
  }

  // If all retries failed
  throw lastError || new Error(`${operationName} failed after ${maxRetries} attempts`)
}

/**
 * Executes multiple MongoDB operations in a transaction with retry logic
 */
export async function executeTransactionWithRetry<T>(
  operations: (session: mongoose.ClientSession) => Promise<T>,
  operationName: string = 'MongoDB transaction',
  maxRetries: number = MAX_RETRIES
): Promise<T> {
  return executeWithRetry(async () => {
    const session = await mongoose.startSession()
    session.startTransaction()
    
    try {
      const result = await operations(session)
      await session.commitTransaction()
      return result
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }, operationName, maxRetries)
}

