"use client"

import { useState, useEffect } from "react"
import { MobileProductGridImage } from "@/components/ui/mobile-optimized-image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Loader2 } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/hooks/use-wishlist"
import { toast } from "sonner"
import { useProducts } from "@/hooks/use-products"
import { getProductSize, getProductBadge, type NormalizedProduct } from "@/lib/product-utils"
import { Heart } from "lucide-react"
import { ScrollAnimate } from "@/components/scroll-animate"
import { Price } from "@/components/price"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

export function BestSellers() {
  // Use stable URL - cache bypassing is handled by the API
  // fallbackToAll: false - only show actual featured products, don't fallback to all products
  const { products, loading, error, refetch } = useProducts({
    url: '/api/products?limit=6&featured=true&noCache=true',
    fallbackToAll: false
  })
  const { addItem } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  
  const handleToggleWishlist = async (product: NormalizedProduct, event: React.MouseEvent) => {
    event.stopPropagation()
    event.preventDefault()
    await toggleWishlist(product)
  }
  const [api, setApi] = useState<CarouselApi>()
  const [isPaused, setIsPaused] = useState(false)

  // Auto-scroll functionality
  useEffect(() => {
    if (!api || isPaused || !products || products.length === 0) return

    const interval = setInterval(() => {
      if (api && !isPaused) {
        api.scrollNext()
      }
    }, 3000) // Auto-slide every 3 seconds

    return () => clearInterval(interval)
  }, [api, isPaused, products.length])

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

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(197,181,159,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(197,181,159,0.05),transparent_50%)]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <ScrollAnimate animation="fade-in-up">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block mb-4">
              <Badge className="bg-secondary/15 text-navy-900 border-secondary/40 px-6 py-2 text-sm font-medium rounded-full shadow-premium-sm">
                Featured Products
              </Badge>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-navy-900 text-shadow-sm">
              Best Sellers
            </h2>
            <p className="text-[#404040] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Our most loved products from every collection, trusted by hotels and hospitality professionals worldwide
            </p>
          </div>
        </ScrollAnimate>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center text-destructive py-10">
            <p className="mb-4">{error}</p>
            <Button onClick={refetch} variant="outline" className="mt-4">Retry</Button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            <p>No products available at the moment.</p>
            <p className="text-sm mb-4">Check back soon for our latest products!</p>
            <Button onClick={refetch} variant="outline">Refresh</Button>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <div
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {products.map((product, index) => {
                  const badge = getProductBadge(product)
                  const size = getProductSize(product)
                  const productId = product._id || product.id
                  
                  return (
                    <CarouselItem key={productId} className="pl-2 md:pl-4 basis-full xs:basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <Card className="group hover-shadow-premium smooth-color-transition overflow-hidden border-border hover-lift relative bg-white h-full card-premium-hover card-premium-radius">
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 via-secondary/0 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 gradient-flow-premium" />
                        <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/15 rounded-full -mr-12 -mt-12 group-hover:scale-150 group-hover:rotate-180 transition-all duration-1000" />
                        <Link href={`/products/${product.sku || productId}`}>
                          <div className="relative w-full aspect-square overflow-hidden cursor-pointer bg-[#fafafa]">
                            <div className="relative w-full h-full">
                            <MobileProductGridImage
                              src={product.image || product.images?.[0] || "/placeholder.jpg"}
                              alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                            />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            
                            {/* Wishlist Toggle Button */}
                            <div className="absolute top-3 left-3 z-20">
                              <button
                                onClick={(e) => handleToggleWishlist(product, e)}
                                className="transition-all transform hover:scale-110 drop-shadow-md rounded-full rounded-tl-full rounded-tr-full rounded-bl-full rounded-br-full"
                              >
                                <Heart className={`h-6 w-6 ${isInWishlist(productId) ? 'text-rose-500 fill-rose-500' : 'text-white stroke-[2.5px]'}`} />
                              </button>
                            </div>

                            {badge && (
                              <Badge className="absolute top-3 left-3 bg-secondary text-navy-900 shadow-premium-lg group-hover:scale-105 transition-all duration-500 z-10 badge-premium badge-rotate-360 rounded-full group-hover:opacity-0">
                                {badge}
                              </Badge>
                            )}
                            <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 group-hover:scale-105 transition-all duration-500 badge-rotate-360 z-10 shadow-premium-md">
                              {size}
                            </div>
                          </div>
                        </Link>

                        <CardContent className="p-6 relative z-10 bg-white">
                          <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 transition-all duration-300 ${
                                  i < Math.floor(product.rating || 4.8) 
                                    ? "fill-amber-400 text-amber-400 group-hover:scale-110" 
                                    : "text-gray-300"
                                }`}
                                style={{ transitionDelay: `${i * 50}ms` }}
                              />
                            ))}
                            <span className="text-sm text-[#404040] ml-1 font-medium">
                              ({product.rating?.toFixed(1) || '4.8'})
                            </span>
                          </div>

                          <Link href={`/products/${product.sku || productId}`}>
                            <h3 className="font-serif text-lg font-semibold mb-2 text-balance hover:text-secondary transition-colors cursor-pointer line-clamp-2 min-h-[3.5rem] text-navy-900 text-shadow-sm">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-xs text-secondary font-semibold mb-2 uppercase tracking-wide">
                            {product.category?.name || 'General'} Range
                          </p>
                          <p className="text-sm text-[#404040] mb-4 text-pretty line-clamp-2 min-h-[2.5rem]">
                            {product.description}
                          </p>

                          <div className="flex items-center justify-between pt-4 border-t border-border">
                            <div className="flex flex-col">
                              <Price amount={product.price} originalAmount={product.originalPrice} showOriginal={true} />
                            </div>
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-navy-600 text-white transition-all duration-500 hover:scale-110 hover:shadow-premium-lg shadow-premium-md font-semibold px-5 btn-diag"
                              onClick={() => handleAddToCart(product)}
                            >
                              <ShoppingCart className="h-4 w-4 mr-1 icon-rotate-360" />
                              Add
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 bg-white/90 backdrop-blur-sm border-2 border-border hover:border-primary shadow-premium-md hover:shadow-premium-lg rounded-full" />
              <CarouselNext className="hidden md:flex -right-12 bg-white/90 backdrop-blur-sm border-2 border-border hover:border-primary shadow-premium-md hover:shadow-premium-lg rounded-full" />
            </Carousel>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
