// Cache optimization utilities

interface CacheConfig {
  maxAge: number
  staleWhileRevalidate?: number
  tags?: string[]
}

// In-memory cache for API responses
const memoryCache = new Map<string, { data: any; timestamp: number; config: CacheConfig }>()

export class CacheManager {
  private static instance: CacheManager
  private cache = memoryCache

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }

  set(key: string, data: any, config: CacheConfig = { maxAge: 300000 }): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      config
    })
  }

  get(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    const { data, timestamp, config } = cached
    const age = Date.now() - timestamp

    // Check if cache is expired
    if (age > config.maxAge) {
      this.cache.delete(key)
      return null
    }

    return data
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear()
      return
    }

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }

  // Cache with automatic revalidation
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    config: CacheConfig = { maxAge: 300000 }
  ): Promise<T> {
    const cached = this.get(key)
    if (cached) {
      // If stale but not expired, return cached and revalidate in background
      const { timestamp } = this.cache.get(key)!
      const age = Date.now() - timestamp
      
      if (age > (config.staleWhileRevalidate || config.maxAge * 0.8)) {
        // Revalidate in background
        fetcher().then(data => this.set(key, data, config)).catch(console.error)
      }
      
      return cached
    }

    // Fetch and cache
    const data = await fetcher()
    this.set(key, data, config)
    return data
  }
}

// React hook for cached data fetching
export function useCachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  config?: CacheConfig
) {
  const cacheManager = CacheManager.getInstance()
  
  return {
    get: () => cacheManager.get(key),
    set: (data: T) => cacheManager.set(key, data, config),
    invalidate: () => cacheManager.invalidate(key),
    getOrSet: () => cacheManager.getOrSet(key, fetcher, config)
  }
}

// API response caching middleware
export function withCache<T extends any[]>(
  fn: (...args: T) => Promise<any>,
  keyGenerator: (...args: T) => string,
  config?: CacheConfig
) {
  const cacheManager = CacheManager.getInstance()
  
  return async (...args: T) => {
    const key = keyGenerator(...args)
    return cacheManager.getOrSet(key, () => fn(...args), config)
  }
}

// Cache tags for better invalidation
export const CACHE_TAGS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  ORDERS: 'orders',
  USER: 'user',
  CART: 'cart'
} as const

// Utility to invalidate related caches
export function invalidateRelatedCaches(tag: string) {
  const cacheManager = CacheManager.getInstance()
  cacheManager.invalidate(tag)
}

// Browser storage cache (for client-side)
export class BrowserCache {
  private static isClient = typeof window !== 'undefined'

  static set(key: string, data: any, maxAge: number = 300000): void {
    if (!this.isClient) return

    const item = {
      data,
      timestamp: Date.now(),
      maxAge
    }
    
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(item))
    } catch (error) {
      console.warn('Failed to cache data:', error)
    }
  }

  static get(key: string): any | null {
    if (!this.isClient) return null

    try {
      const item = localStorage.getItem(`cache_${key}`)
      if (!item) return null

      const { data, timestamp, maxAge } = JSON.parse(item)
      const age = Date.now() - timestamp

      if (age > maxAge) {
        localStorage.removeItem(`cache_${key}`)
        return null
      }

      return data
    } catch (error) {
      console.warn('Failed to retrieve cached data:', error)
      return null
    }
  }

  static clear(): void {
    if (!this.isClient) return

    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        localStorage.removeItem(key)
      }
    })
  }
}
