// Simple in-memory cache (in production, use Redis)
interface CacheItem {
  value: any
  expires: number
}

class MemoryCache {
  private cache = new Map<string, CacheItem>()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes

  set(key: string, value: any, ttl: number = this.defaultTTL): void {
    const expires = Date.now() + ttl
    this.cache.set(key, { value, expires })
  }

  get(key: string): any | null {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }
    
    if (Date.now() > item.expires) {
      this.cache.delete(key)
      return null
    }
    
    return item.value
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key)
      }
    }
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }
}

export const cache = new MemoryCache()

// Cache key generators
export const cacheKeys = {
  user: (id: string) => `user:${id}`,
  product: (id: string) => `product:${id}`,
  products: (filters: string) => `products:${filters}`,
  category: (id: string) => `category:${id}`,
  categories: (active?: boolean) => `categories:${active ? 'active' : 'all'}`,
  order: (id: string) => `order:${id}`,
  orders: (userId: string) => `orders:${userId}`,
  analytics: (type: string) => `analytics:${type}`
}

// Cache TTL constants
export const cacheTTL = {
  user: 10 * 60 * 1000, // 10 minutes
  product: 30 * 60 * 1000, // 30 minutes
  products: 5 * 60 * 1000, // 5 minutes
  category: 60 * 60 * 1000, // 1 hour
  categories: 30 * 60 * 1000, // 30 minutes
  order: 5 * 60 * 1000, // 5 minutes
  orders: 2 * 60 * 1000, // 2 minutes
  analytics: 5 * 60 * 1000 // 5 minutes
}

// Utility functions
export function withCache<T>(
  key: string,
  ttl: number,
  fn: () => Promise<T>
): Promise<T> {
  const cached = cache.get(key)
  if (cached !== null) {
    return Promise.resolve(cached)
  }

  return fn().then(result => {
    cache.set(key, result, ttl)
    return result
  })
}

export function invalidateCache(pattern: string): void {
  const stats = cache.getStats()
  const keysToDelete = stats.keys.filter(key => key.includes(pattern))
  
  keysToDelete.forEach(key => cache.delete(key))
}

// Cleanup expired entries every 5 minutes
setInterval(() => {
  cache.cleanup()
}, 5 * 60 * 1000)
