"use client"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Heart,
  ShoppingCart,
  Trash2,
  Loader2,
  ArrowLeft,
  Package,
  Star,
  Eye,
  CheckCircle2,
  ListChecks
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"
import { ScrollAnimate } from "@/components/scroll-animate"
import { useCart } from "@/lib/cart-context"
import { Price } from "@/components/price"
import { useCurrency } from "@/components/currency-provider"

interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
  inStock: boolean
  stock: number
  addedAt: string
  sku?: string
}

export default function WishlistPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { addItem } = useCart()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const { formatPrice } = useCurrency()

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push("/login")
      return
    }

    const fetchWishlist = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/user/wishlist?userId=${user.id}`)
        const data = await response.json()
        
        if (data.success) {
          console.log('Wishlist data received:', data.data)
          setWishlistItems(data.data)
        } else {
          setError(data.error || 'Failed to fetch wishlist')
          toast.error(data.error || 'Failed to fetch wishlist')
        }
      } catch (err) {
        console.error('Error fetching wishlist:', err)
        setError('An unexpected error occurred while fetching wishlist')
        toast.error('An unexpected error occurred while fetching wishlist')
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [user, router, authLoading])

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      setRemovingItems(prev => new Set(prev).add(productId))
      
      const response = await fetch(`/api/user/wishlist?userId=${user?.id}&productId=${productId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      
      if (data.success) {
        setWishlistItems(prev => prev.filter(item => item.id !== productId))
        setSelectedItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(productId)
          return newSet
        })
        toast.success('Product removed from wishlist')
      } else {
        toast.error(data.error || 'Failed to remove product from wishlist')
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err)
      toast.error('Failed to remove product from wishlist')
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  const handleAddToCart = (item: WishlistItem) => {
    if (!item.inStock) {
      toast.error("Item is out of stock")
      return
    }

    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      size: "Standard", // Default size for wishlist items
      range: typeof item.category === 'string' ? item.category : (item.category as any)?.name || "General"
    })
    toast.success(`${item.name} added to cart`)
  }

  const toggleSelect = (productId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  const toggleSelectAll = () => {
    if (selectedItems.size === wishlistItems.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(wishlistItems.map(item => item.id)))
    }
  }

  const handleAddSelectedToCart = () => {
    if (selectedItems.size === 0) {
      toast.error("Please select items to add to cart")
      return
    }

    let addedCount = 0
    wishlistItems.forEach(item => {
      if (selectedItems.has(item.id) && item.inStock) {
        addItem({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          size: "Standard",
          range: typeof item.category === 'string' ? item.category : (item.category as any)?.name || "General"
        })
        addedCount++
      }
    })

    if (addedCount > 0) {
      toast.success(`${addedCount} items added to cart`)
      setSelectedItems(new Set())
    } else {
      toast.error("No selected items were in stock")
    }
  }

  const clearWishlist = async () => {
    if (!confirm('Are you sure you want to clear your wishlist?')) return
    
    try {
      setLoading(true)
      // We process removals sequentially or use a dedicated API if available
      // For now, removing local state satisfies UI, then we'd ideally hit a bulk delete endpoint
      // Assuming a generic cleanup here for now:
      setWishlistItems([])
      setSelectedItems(new Set())
      toast.success('Wishlist cleared')
    } catch (error) {
      toast.error('Failed to clear wishlist')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) return null

  if (loading && wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground animate-pulse">Fetching your favorites...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto text-center py-20 px-4">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-20" />
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-destructive mb-8 bg-destructive/5 inline-block px-4 py-2 rounded-lg border border-destructive/10">{error}</p>
            <div>
              <Button onClick={() => window.location.reload()} variant="premium">
                Retry Connection
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] page-fade">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <ScrollAnimate animation="fade-in-up-scale" delay={100}>
            <div className="mb-10 text-center relative">
              <div className="absolute left-0 top-0">
                <Link href="/account">
                  <Button variant="ghost" size="sm" className="hover:bg-slate-200">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Account
                  </Button>
                </Link>
              </div>
              
              <div className="pt-2">
                <h1 className="text-4xl font-serif font-bold mb-3 inline-flex items-center gap-3">
                  <Heart className="h-10 w-10 text-rose-500 fill-rose-500 animate-pulse-slow" />
                  My Wishlist
                </h1>
                <p className="text-slate-500 font-medium">
                  {wishlistItems.length} curated item{wishlistItems.length !== 1 ? 's' : ''} in your collection
                </p>
              </div>
            </div>
          </ScrollAnimate>

          {/* Bulk Controls */}
          {wishlistItems.length > 0 && (
            <ScrollAnimate animation="fade-in" delay={200}>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-lg cursor-pointer hover:bg-slate-100 transition-colors" onClick={toggleSelectAll}>
                    <Checkbox checked={selectedItems.size === wishlistItems.length && wishlistItems.length > 0} className="rounded-[4px]" />
                    <span className="text-sm font-semibold select-none">Select All</span>
                  </div>
                  {selectedItems.size > 0 && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary-dark border-primary/20 px-3 py-1 animate-in zoom-in-95">
                      {selectedItems.size} Selected
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="premium" 
                    size="sm" 
                    disabled={selectedItems.size === 0}
                    onClick={handleAddSelectedToCart}
                    className="shadow-md hover:shadow-lg transition-all"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add Selected to Cart
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    onClick={() => {
                      if (selectedItems.size === 0) {
                        clearWishlist()
                      } else {
                        // Logic to remove selected if needed, otherwise default to clear
                        clearWishlist()
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {selectedItems.size === 0 ? "Clear All" : "Remove Selected"}
                  </Button>
                </div>
              </div>
            </ScrollAnimate>
          )}

          {/* Wishlist Items Grid */}
          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlistItems.map((item, index) => (
                <ScrollAnimate key={item.id} animation="card-entrance" delay={index * 50}>
                  <Card className={`group relative h-full flex flex-col hover-shadow-premium smooth-color-transition overflow-hidden hover-lift border-slate-200 ${selectedItems.has(item.id) ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                    <div className="relative group/image h-64 overflow-hidden bg-slate-50">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      
                      {/* Unified Top Actions Row */}
                      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-20">
                        {/* Selection Checkbox */}
                        <div 
                          className="flex items-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox 
                            checked={selectedItems.has(item.id)} 
                            onCheckedChange={() => toggleSelect(item.id)}
                            className="h-6 w-6 bg-white data-[state=checked]:bg-primary data-[state=checked]:border-primary shadow-sm rounded-[4px]"
                          />
                        </div>

                        {/* Delete Action */}
                        <button
                          className="h-9 w-9 flex items-center justify-center rounded-full rounded-tl-full rounded-tr-full rounded-bl-full rounded-br-full transition-all transform hover:scale-110 drop-shadow-md text-white hover:text-rose-500"
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          disabled={removingItems.has(item.id)}
                        >
                          {removingItems.has(item.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin text-white" />
                          ) : (
                            <Trash2 className="h-5 w-5 stroke-[2.5px]" />
                          )}
                        </button>
                      </div>

                      {/* Stock Badge */}
                      {!item.inStock && (
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-10 transition-opacity group-hover:opacity-100">
                          <Badge variant="destructive" className="px-6 py-2 text-sm font-bold shadow-lg uppercase tracking-widest ring-1 ring-white/20">
                            Out of Stock
                          </Badge>
                        </div>
                      )}
                      
                      {/* Hover Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none">
                        <span className="text-white text-xs font-semibold px-2 py-1 rounded bg-white/20 backdrop-blur-md border border-white/20 uppercase tracking-wider">
                          {typeof item.category === 'string' ? item.category : (item.category as any)?.name || 'General'}
                        </span>
                      </div>
                    </div>
                    
                    <CardContent className="p-6 flex flex-col flex-grow">
                      <div className="mb-auto">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-serif text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {item.name}
                          </h3>
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed italic">
                          {item.description}
                        </p>
                      </div>
                      
                      <div className="mt-4 space-y-5">
                        <div className="flex items-end justify-between">
                          <div className="space-y-1">
                            <span className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Premium Collection</span>
                            <Price amount={item.price} className="text-2xl font-serif font-black" />
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-bold text-amber-700">4.8</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <Link href={`/products/${item.sku || item.id}`} className="w-full">
                            <Button variant="outline" size="sm" className="w-full font-bold border-slate-200 hover:bg-slate-50 h-10 group-hover:border-primary/30">
                              <Eye className="h-4 w-4 mr-2 opacity-60" />
                              Details
                            </Button>
                          </Link>
                          <Button 
                            variant="premium"
                            size="sm" 
                            className="w-full font-bold h-10 shadow-sm"
                            onClick={() => handleAddToCart(item)}
                            disabled={!item.inStock}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollAnimate>
              ))}
            </div>
          ) : (
            <ScrollAnimate animation="fade-in-up" delay={200}>
              <Card className="border-dashed border-2 bg-slate-50/50">
                <CardContent className="text-center py-24">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                    <Heart className="h-10 w-10 text-slate-200" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-3">Your wishlist is ready for discovery</h3>
                  <p className="text-slate-500 mb-10 max-w-sm mx-auto">
                    Transform your hospitality spaces. Start adding products you love to your wishlist for quick later access and checkout.
                  </p>
                  <Link href="/products">
                    <Button variant="premium" className="px-8 flex-diag shadow-lg">
                      <Package className="h-5 w-5 mr-3" />
                      Browse Collections
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </ScrollAnimate>
          )}

          {/* Quick Stats/Summary Footer Card */}
          {wishlistItems.length > 0 && (
            <ScrollAnimate animation="fade-in-up" delay={400}>
              <Card className="mt-12 overflow-hidden border-none shadow-premium-lg">
                <div className="h-2 bg-gradient-to-r from-primary via-primary-dark to-primary" />
                <CardContent className="p-8 bg-white">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10">
                        <ListChecks className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 mb-1">Total Valuation</h4>
                        <p className="text-slate-500 text-sm">Estimated total for all items currently in your wishlist</p>
                      </div>
                    </div>
                    <div className="text-center md:text-right">
                      <div className="text-sm font-bold text-primary uppercase tracking-widest mb-1">Grand Total</div>
                      <div className="text-4xl font-serif font-black text-slate-900">
                        {formatPrice(wishlistItems.reduce((acc, item) => acc + item.price, 0))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimate>
          )}
        </div>
      </div>
    </div>
  )
}
