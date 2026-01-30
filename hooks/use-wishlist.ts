"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

export interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
  inStock: boolean
  stock: number
  addedAt: string
}

export function useWishlist() {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const fetchWishlist = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      const response = await fetch(`/api/user/wishlist?userId=${user.id}`)
      const data = await response.json()

      if (data.success) {
        setWishlist(data.data)
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error)
    } finally {
      setLoading(false)
      setIsInitialized(true)
    }
  }, [user])

  useEffect(() => {
    if (user && !isInitialized) {
      fetchWishlist()
    }
  }, [user, isInitialized, fetchWishlist])

  const toggleWishlist = async (product: any) => {
    if (!user) {
      toast.error("Please login to manage your wishlist")
      return false
    }

    const productId = product.id || product._id
    const isInWishlist = wishlist.some(item => item.id === productId)

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch(`/api/user/wishlist?userId=${user.id}&productId=${productId}`, {
          method: "DELETE"
        })
        const data = await response.json()
        if (data.success) {
          setWishlist(prev => prev.filter(item => item.id !== productId))
          toast.success("Removed from wishlist")
          return true
        }
      } else {
        // Add to wishlist
        const response = await fetch("/api/user/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, productId })
        })
        const data = await response.json()
        if (data.success) {
          setWishlist(prev => [...prev, {
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image || product.images?.[0],
            description: product.description,
            category: product.category?.name || product.category,
            inStock: true,
            stock: product.stock || 0,
            addedAt: new Date().toISOString()
          }])
          toast.success("Added to wishlist")
          return true
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error)
      toast.error("Failed to update wishlist")
    }
    return false
  }

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId)
  }

  return {
    wishlist,
    loading,
    toggleWishlist,
    isInWishlist,
    refreshWishlist: fetchWishlist
  }
}
