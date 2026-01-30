"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ChevronLeft, ChevronRight, ShoppingCart, Heart } from "lucide-react"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"
import { useProducts } from "@/hooks/use-products"
import { getProductSize, getProductBadge, type NormalizedProduct } from "@/lib/product-utils"

export function InTheSpotlight() {
  // Use stable URL - cache bypassing is handled by the API
  // fallbackToAll: false - only show actual featured products, don't fallback to all products
  const { products, loading } = useProducts({
    url: '/api/products?featured=true&limit=8&noCache=true',
    fallbackToAll: false
  })
  const [currentIndex, setCurrentIndex] = useState(0)
  const { addItem } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  const handleToggleWishlist = async (product: NormalizedProduct, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    await toggleWishlist(product)
  }

  const handleAddToCart = (product: NormalizedProduct) => {
    const size = getProductSize(product)
    
    addItem({
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      image: product.image || product.images[0] || "/placeholder.svg",
      size: size,
      range: product.category?.name || 'General',
    })
    
    toast.success(`${product.name} added to cart!`)
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, products.length - 3))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, products.length - 3)) % Math.max(1, products.length - 3))
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex items-start justify-between mb-8">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex-shrink-0 w-72">
                <div className="bg-white border border-gray-100 p-4 h-80 animate-pulse">
                  <div className="h-48 bg-gray-200 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 w-1/2"></div>
                    <div className="h-4 bg-gray-200 w-3/4"></div>
                    <div className="h-4 bg-gray-200 w-1/3"></div>
                    <div className="h-3 bg-gray-200 w-1/4"></div>
                    <div className="h-8 bg-gray-200"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        {/* Header - Compact Layout */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            <div className="mb-2">
              <span className="text-sm font-bold text-gray-900 tracking-wider uppercase">
                IN THE SPOTLIGHT
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              New Arrivals
            </h2>
          </div>
          
          <Link href="/products" className="hidden md:block">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white border border-gray-300 hover:border-gray-900 hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-medium px-6 py-2 rounded-none transition-all duration-200"
            >
              View All
            </Button>
          </Link>
        </div>

        {/* Product Carousel - Compact Design */}
        <div className="relative">
          {/* Navigation Arrows */}
          {products.length > 4 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-20 bg-white border border-gray-300 hover:border-gray-900 hover:bg-gray-50 shadow-sm rounded-none"
                onClick={prevSlide}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-20 bg-white border border-gray-300 hover:border-gray-900 hover:bg-gray-50 shadow-sm rounded-none"
                onClick={nextSlide}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* Product Grid - Mobile First Design */}
          <div className="overflow-hidden">
            <div className="flex gap-2 md:gap-4 overflow-x-auto scrollbar-hide">
              {products.map((product) => {
                const productId = product._id || product.id
                const badge = getProductBadge(product)
                const imageUrl = product.image || product.images[0] || "/placeholder.jpg"
                
                return (
                  <div key={productId} className="flex-shrink-0 w-60 md:w-72">
                    <Card className="group bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 rounded-none">
                      {/* Product Image - Compact */}
                      <Link href={`/products/${product.sku || productId}`}>
                        <div className="relative h-40 md:h-48 bg-gray-50 overflow-hidden cursor-pointer">
                          <div className="relative w-full h-full">
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = '/placeholder.jpg'
                              }}
                            />
                          </div>
                          
                          {/* Badge - Compact */}
                          {badge && (
                            <Badge className="absolute top-2 left-2 bg-gray-800 text-white border-0 text-xs px-2 py-1 rounded-none">
                              {badge}
                            </Badge>
                          )}

                          {/* Wishlist Toggle */}
                          <div className="absolute top-2 right-2 z-10">
                            <button
                              onClick={(e) => handleToggleWishlist(product, e)}
                              className="p-1.5 transition-all transform hover:scale-110 drop-shadow-md rounded-full rounded-tl-full rounded-tr-full rounded-bl-full rounded-br-full"
                            >
                              <Heart className={`w-5 h-5 ${isInWishlist(productId) ? "text-rose-500 fill-rose-500" : "text-white stroke-[2.5px]"}`} />
                            </button>
                          </div>
                        </div>
                      </Link>

                      <CardContent className="p-4">
                        {/* Brand - Compact */}
                        <div className="text-xs font-bold text-amber-600 mb-1 uppercase tracking-wide">
                          {product.category?.name || 'General'}
                        </div>
                        
                        {/* Product Name - Compact */}
                        <Link href={`/products/${product.sku || productId}`}>
                          <h3 className="font-bold text-sm text-gray-900 mb-2 line-clamp-2 leading-tight cursor-pointer hover:text-gray-700 transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        
                        {/* Price - Compact */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg font-bold text-gray-900">
                            AED {product.price}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through">
                              AED {product.originalPrice}
                            </span>
                          )}
                        </div>
                        
                        {/* Rating - Compact */}
                        <div className="flex items-center gap-1 mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(product.rating || 4.8) ? "fill-gray-900 text-gray-900" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-600 font-medium">
                            {product.rating?.toFixed(1) || '4.8'} ({product.reviews || 127})
                          </span>
                        </div>
                        
                        {/* Add to Cart Button - Compact */}
                        <Button
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm py-2 rounded-none transition-all duration-200"
                        >
                          BUY PRODUCT
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
