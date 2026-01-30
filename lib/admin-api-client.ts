/**
 * Robust API client for admin panel with retry logic and error handling
 */

interface ApiOptions {
  retries?: number
  retryDelay?: number
  timeout?: number
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  details?: any
}

/**
 * Fetches data from API with retry logic and comprehensive error handling
 */
export async function fetchAdminApi<T>(
  url: string,
  options: RequestInit = {},
  apiOptions: ApiOptions = {}
): Promise<ApiResponse<T>> {
  const {
    retries = 3,
    retryDelay = 1000,
    timeout = 30000
  } = apiOptions

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      })

      clearTimeout(timeoutId)

      // Handle non-OK responses
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorData.message || errorMessage
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage
        }

        // Don't retry on client errors (4xx)
        if (response.status >= 400 && response.status < 500) {
          return {
            success: false,
            error: errorMessage
          }
        }

        // Retry on server errors (5xx) or network errors
        throw new Error(errorMessage)
      }

      // Parse response
      const data = await response.json()

      // Validate response structure
      if (data === null || data === undefined) {
        throw new Error('Empty response from server')
      }

      return {
        success: true,
        data: data as T
      }

    } catch (error: any) {
      lastError = error

      // Don't retry on abort (timeout)
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timeout. Please try again.'
        }
      }

      // Don't retry on last attempt
      if (attempt < retries) {
        const delay = retryDelay * Math.pow(2, attempt) // Exponential backoff
        console.warn(`API call failed (attempt ${attempt + 1}/${retries + 1}), retrying in ${delay}ms...`, error.message)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
    }
  }

  // All retries failed
  const errorMessage = lastError?.message || 'Failed to fetch data after multiple attempts'
  console.error('API call failed after all retries:', errorMessage)

  return {
    success: false,
    error: errorMessage,
    details: lastError
  }
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch {
    return fallback
  }
}

/**
 * Safe number conversion with fallback
 */
export function safeNumber(value: any, fallback: number = 0): number {
  if (typeof value === 'number' && !isNaN(value)) {
    return value
  }
  const parsed = parseFloat(value)
  return isNaN(parsed) ? fallback : parsed
}

/**
 * Safe string conversion with fallback
 */
export function safeString(value: any, fallback: string = ''): string {
  if (typeof value === 'string') {
    return value
  }
  if (value === null || value === undefined) {
    return fallback
  }
  return String(value)
}

/**
 * Safe array conversion with fallback
 */
export function safeArray<T>(value: any, fallback: T[] = []): T[] {
  if (Array.isArray(value)) {
    return value
  }
  return fallback
}

/**
 * Safe object conversion with fallback
 */
export function safeObject<T>(value: any, fallback: T): T {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as T
  }
  return fallback
}

