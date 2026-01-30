/**
 * Custom hook for fetching products with robust error handling
 */

import { useState, useEffect, useCallback } from 'react'
import { fetchProductsWithRetry, normalizeProducts, type NormalizedProduct } from '@/lib/product-utils'

interface UseProductsOptions {
  url: string
  dependencies?: any[]
  enabled?: boolean
  fallbackToAll?: boolean
}

interface UseProductsResult {
  products: NormalizedProduct[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  total?: number
  pages?: number
}

export function useProducts({
  url,
  dependencies = [],
  enabled = true,
  fallbackToAll = true
}: UseProductsOptions): UseProductsResult {
  const [products, setProducts] = useState<NormalizedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState<number>(0)
  const [pages, setPages] = useState<number>(0)

  const fetchProducts = useCallback(async () => {
    if (!enabled) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const result = await fetchProductsWithRetry(url)

      if (result.success && result.data.length > 0) {
        setProducts(result.data)
        setTotal(result.total || result.data.length)
        setPages(result.pages || 1)
      } else if (result.success && result.data.length === 0 && fallbackToAll) {
        // Fallback to all products if no results
        console.warn('No products found, falling back to all products')
        const fallbackResult = await fetchProductsWithRetry('/api/products?limit=12&sort=newest')
        
        if (fallbackResult.success && fallbackResult.data.length > 0) {
          setProducts(fallbackResult.data)
          setTotal(fallbackResult.total || fallbackResult.data.length)
          setPages(fallbackResult.pages || 1)
        } else {
          setProducts([])
          setError(result.error || 'No products available')
        }
      } else {
        setProducts([])
        setError(result.error || 'No products available')
      }
    } catch (err) {
      console.error('Error in useProducts:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [url, enabled, fallbackToAll, ...dependencies])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    total,
    pages
  }
}

