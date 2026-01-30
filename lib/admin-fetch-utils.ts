/**
 * Admin Fetch Utilities - Provides retry logic for admin panel API calls
 * Prevents errors from blocking admin pages
 */

export interface FetchOptions {
  retries?: number
  delay?: number
  onRetry?: (attempt: number, retries: number) => void
}

/**
 * Fetches data from API with retry logic
 */
export async function fetchWithRetry<T>(
  url: string,
  options: FetchOptions = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  const { retries = 5, delay = 1000, onRetry } = options

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url)

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          // If response is not JSON, use default message
        }

        // If it's a database connection error and we have retries left, retry
        if (
          (errorMessage.includes('database') ||
            errorMessage.includes('connection') ||
            errorMessage.includes('SSL') ||
            errorMessage.includes('TLS') ||
            response.status === 500) &&
          attempt < retries - 1
        ) {
          const retryDelay = delay * Math.pow(2, attempt)
          console.warn(
            `API fetch failed (attempt ${attempt + 1}/${retries}), retrying in ${retryDelay}ms...`
          )
          if (onRetry) {
            onRetry(attempt + 1, retries)
          }
          await new Promise((resolve) => setTimeout(resolve, retryDelay))
          continue
        }

        throw new Error(errorMessage)
      }

      const data = await response.json()

      if (data.success) {
        // Return the full response object, not just data.data
        // This preserves pagination info (total, page, pages) and other metadata
        return { success: true, data: data }
      } else {
        return { success: false, error: data.error || 'Failed to fetch data' }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred'

      // If it's a database connection error and we have retries left, retry
      if (
        (errorMessage.includes('database') ||
          errorMessage.includes('connection') ||
          errorMessage.includes('SSL') ||
          errorMessage.includes('TLS')) &&
        attempt < retries - 1
      ) {
        const retryDelay = delay * Math.pow(2, attempt)
        console.warn(
          `API fetch failed (attempt ${attempt + 1}/${retries}), retrying in ${retryDelay}ms...`
        )
        if (onRetry) {
          onRetry(attempt + 1, retries)
        }
        await new Promise((resolve) => setTimeout(resolve, retryDelay))
        continue
      }

      // Provide user-friendly error message
      let userMessage = errorMessage
      if (
        errorMessage.includes('database') ||
        errorMessage.includes('connection') ||
        errorMessage.includes('SSL') ||
        errorMessage.includes('TLS')
      ) {
        userMessage = 'Unable to connect to the database. Please try again in a moment.'
      } else if (
        errorMessage.includes('HTTP error') ||
        errorMessage.includes('status: 500')
      ) {
        userMessage = 'Server error occurred. Please try again later.'
      }

      // If this was the last attempt, return error
      if (attempt === retries - 1) {
        return { success: false, error: userMessage }
      }
    }
  }

  return { success: false, error: 'Failed to fetch data after retries' }
}

