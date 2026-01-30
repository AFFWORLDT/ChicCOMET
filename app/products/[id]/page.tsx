"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Loader2 } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { Footer } from "@/components/footer"
import { UniversalProductImage, UniversalProductThumbnail } from "@/components/ui/universal-image"
import { ScrollAnimate } from "@/components/scroll-animate"
import { Price } from "@/components/price"
import { useCurrency } from "@/components/currency-provider"

interface Product {
  _id: string
  name: string
  price: number
  originalPrice?: number
  description: string
  longDescription?: string
  images: string[]
  sku: string
  category: {
    name: string
  }
  attributes: Array<{
    name: string
    value: string
  }>
  isActive: boolean
  washingInstructions?: string[]
  subCategory?: string
  createdAt: string
}

export default function ProductDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [addingToWishlist, setAddingToWishlist] = useState(false)
  const { addItem } = useCart()
  const { user } = useAuth()
  const { formatPrice } = useCurrency()

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`)
        const data = await response.json()
        
        if (data.success) {
          setProduct(data.data)
        } else {
          setError(data.error || 'Product not found')
        }
      } catch (err) {
        console.error('Error fetching product:', err)
        setError('An unexpected error occurred while fetching product')
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user || !product) return

      try {
        const response = await fetch(`/api/user/wishlist?userId=${user.id}`)
        const data = await response.json()
        
        if (data.success) {
          console.log('Wishlist data for status check:', data.data)
          const isInWishlist = data.data.some((item: any) => item.id === product._id)
          console.log('Is product in wishlist:', isInWishlist)
          setIsInWishlist(isInWishlist)
        }
      } catch (err) {
        console.error('Error checking wishlist status:', err)
      }
    }

    checkWishlistStatus()
  }, [user, product])

  const handleAddToCart = () => {
    if (!product) {
      console.log('No product found')
      return
    }

    console.log('Adding to cart:', {
      id: product._id,
      name: product.name,
      price: product.price,
      quantity
    })

    const size = product.attributes.find(attr => attr.name.toLowerCase() === 'size')?.value || 'Standard'
    
    // Optimized: Add all items at once instead of loop
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg",
      size: size,
      range: product.category.name,
      quantity: quantity // Pass quantity directly
    })
    
    toast.success(`${quantity}x ${product.name} added to cart!`)
  }

  const handleBuyNow = () => {
    if (!product) {
      console.log('No product found')
      return
    }

    console.log('Buy now clicked:', {
      id: product._id,
      name: product.name,
      price: product.price,
      quantity
    })

    const size = product.attributes.find(attr => attr.name.toLowerCase() === 'size')?.value || 'Standard'
    
    // Add to cart first
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg",
      size: size,
      range: product.category.name,
      quantity: quantity
    })
    
    // Show success message
    toast.success(`${quantity}x ${product.name} added to cart! Redirecting to checkout...`)
    
    // Redirect to checkout after a short delay
    setTimeout(() => {
      router.push('/cart')
    }, 1000)
  }

  const handleAddToWishlist = async () => {
    if (!user) {
      toast.error("Please login to add items to wishlist")
      return
    }

    if (!product) return

    try {
      setAddingToWishlist(true)
      
      const response = await fetch('/api/user/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          productId: product._id
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        console.log('Product added to wishlist successfully')
        setIsInWishlist(true)
        toast.success(`${product.name} added to wishlist!`)
      } else {
        console.log('Failed to add to wishlist:', data.error)
        toast.error(data.error || 'Failed to add to wishlist')
      }
    } catch (err) {
      console.error('Error adding to wishlist:', err)
      toast.error('Failed to add to wishlist')
    } finally {
      setAddingToWishlist(false)
    }
  }

  const handleShare = async () => {
    if (!product) return

    const shareData = {
      title: product.name,
      text: `Check out this amazing product: ${product.name}`,
      url: window.location.href
    }

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        toast.success("Product shared successfully!")
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href)
        toast.success("Product link copied to clipboard!")
      }
    } catch (err) {
      console.error('Error sharing:', err)
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast.success("Product link copied to clipboard!")
      } catch (clipboardErr) {
        toast.error("Failed to share product")
      }
    }
  }

  const getProductAttribute = (name: string) => {
    return product?.attributes.find(attr => attr.name.toLowerCase() === name.toLowerCase())?.value || 'N/A'
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-destructive mb-3 sm:mb-4">Product Not Found</h1>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">{error}</p>
            <Button onClick={() => window.history.back()} className="text-sm sm:text-base">Go Back</Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          {/* Product Images */}
          <div className="space-y-4 sm:space-y-5">
            <div className="relative aspect-square overflow-hidden bg-white border border-gray-200 shadow-sm group cursor-pointer">
              {product.images && product.images.length > 0 ? (
                <div className="relative w-full h-full transition-transform duration-700 ease-in-out group-hover:scale-110">
                  <UniversalProductImage
                    key={selectedImage}
                    src={product.images[selectedImage] || product.images[0]}
                    alt={product.name}
                    priority={true}
                    quality={90}
                    className="transition-opacity duration-500"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="text-4xl sm:text-6xl text-gray-400 mb-2">📦</div>
                    <p className="text-sm sm:text-base text-gray-500">No image available</p>
                  </div>
                </div>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <Badge className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-red-500 text-white text-xs sm:text-sm font-semibold shadow-md animate-pulse">
                  Sale
                </Badge>
              )}
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3 sm:gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square overflow-hidden border-2 transition-all duration-300 bg-white group ${
                      selectedImage === index 
                        ? 'border-primary shadow-lg scale-110 ring-2 ring-primary/20' 
                        : 'border-gray-200 hover:border-primary/50 hover:shadow-md hover:scale-105'
                    }`}
                    style={{ 
                      clipPath: 'inset(0)',
                      borderRadius: '0'
                    }}
                  >
                    <div 
                      className="absolute inset-0 w-full h-full overflow-hidden transition-transform duration-500 group-hover:scale-110"
                      style={{
                        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                        borderRadius: '0',
                        maskImage: 'none'
                      }}
                    >
                      <UniversalProductThumbnail
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                      />
                    </div>
                    {selectedImage === index && (
                      <div className="absolute inset-0 border-2 border-primary pointer-events-none z-10 animate-pulse" />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none z-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-5 sm:space-y-6 animate-fade-in">
            <div className="animate-slide-up">
              <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                <Badge variant="outline" className="text-primary border-primary text-xs sm:text-sm font-medium hover:bg-primary hover:text-white transition-colors duration-300">
                  {product.subCategory || product.category?.name}
                </Badge>
                <Badge className="bg-green-50 text-green-700 border border-green-200 text-xs sm:text-sm font-medium animate-pulse">In Stock</Badge>
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-4 sm:mb-5 text-gray-900 leading-tight">{product.name}</h1>
              
              <div className="flex items-center gap-1 mb-4 sm:mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star
                      key={i}
                    className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 ${
                      i < 4 ? "fill-secondary text-secondary hover:scale-125" : "text-gray-300"
                    }`}
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
                <span className="text-xs sm:text-sm text-gray-600 ml-2 font-medium">(4.8) 124 reviews</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-5 sm:mb-6 pb-4 border-b border-gray-200">
                <Price amount={product.price} originalAmount={product.originalPrice} className="text-3xl sm:text-4xl" />
                {product.originalPrice && (
                  <Badge className="bg-red-50 text-red-700 border border-red-200 text-xs sm:text-sm font-semibold animate-bounce">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </Badge>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            <div className="bg-gray-50 p-4 sm:p-5 rounded-lg transition-all duration-300 hover:shadow-md hover:bg-gray-100">
              <h3 className="font-semibold mb-3 text-base sm:text-lg text-gray-900">Description</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {product.longDescription || product.description}
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-4 sm:p-5 rounded-lg transition-all duration-300 hover:shadow-lg hover:border-primary/20">
              <h3 className="font-semibold mb-4 text-base sm:text-lg text-gray-900">Product Details</h3>
              <div className="space-y-3">
                {product.attributes && product.attributes.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.attributes.map((attr, idx) => (
                      <div key={idx} className="flex justify-between py-2.5 border-b border-gray-100 transition-all duration-300 hover:bg-gray-50 hover:px-2 rounded">
                        <span className="text-gray-600 capitalize font-medium">{attr.name}:</span>
                        <span className="font-semibold text-gray-900 text-right">{attr.value}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-between py-2.5 border-b border-gray-100 transition-all duration-300 hover:bg-gray-50 hover:px-2 rounded">
                  <span className="text-gray-600 font-medium">SKU:</span>
                  <span className="font-semibold text-gray-900">{product.sku || 'N/A'}</span>
                </div>
              </div>
            </div>

            {product.washingInstructions && product.washingInstructions.length > 0 && (
              <div className="bg-blue-50/50 border border-blue-100 p-4 sm:p-5 rounded-lg transition-all duration-300 hover:shadow-lg hover:border-blue-200">
                <h3 className="font-semibold mb-3 text-base sm:text-lg text-blue-900 flex items-center gap-2">
                   <span>🧼</span> Washing Instructions
                </h3>
                <ul className="space-y-2">
                  {product.washingInstructions.map((instruction, idx) => (
                    <li key={idx} className="text-sm sm:text-base text-blue-800 leading-relaxed italic flex gap-2">
                      <span className="text-blue-400">•</span>
                      {instruction}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Separator className="my-6" />

            <div>
              <h3 className="font-semibold mb-4 text-base sm:text-lg text-gray-900">Quantity</h3>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-lg w-full sm:w-auto justify-center bg-white transition-all duration-300 hover:border-primary hover:shadow-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-12 w-12 hover:bg-gray-100 disabled:opacity-50 transition-all duration-300 hover:scale-110 active:scale-95"
                  >
                    -
                  </Button>
                  <span className="px-6 py-2 min-w-[3rem] text-center text-base font-semibold text-gray-900 transition-all duration-300">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-12 w-12 hover:bg-gray-100 transition-all duration-300 hover:scale-110 active:scale-95"
                  >
                    +
                  </Button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white text-sm sm:text-base h-12 font-semibold shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 transform"
                >
                  <ShoppingCart className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  className="flex-1 bg-secondary hover:bg-secondary/90 text-navy-900 font-semibold text-sm sm:text-base h-12 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 transform"
                >
                  <span className="inline-block transition-transform duration-300 hover:rotate-12">⚡</span> Buy Now
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="flex-1 border-2 border-gray-200 hover:border-red-300 h-11 font-medium transition-all duration-300 hover:bg-red-50 hover:scale-105 active:scale-95 text-gray-700 hover:text-red-700"
                onClick={handleAddToWishlist}
                disabled={addingToWishlist || isInWishlist}
              >
                {addingToWishlist ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Heart className={`h-4 w-4 mr-2 transition-all duration-300 ${isInWishlist ? 'fill-red-500 text-red-500 animate-pulse' : 'hover:scale-125'}`} />
                )}
                {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 border-2 border-gray-200 hover:border-primary h-11 font-medium transition-all duration-300 hover:bg-primary/5 hover:scale-105 active:scale-95 text-gray-700 hover:text-primary"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2 transition-transform duration-300 hover:rotate-12" />
                Share
              </Button>
            </div>

            <Separator className="my-6" />

            <div className="bg-gray-50 p-4 sm:p-5 rounded-lg space-y-4 transition-all duration-300 hover:shadow-md">
              <div className="flex items-start gap-4 transition-all duration-300 hover:translate-x-2 cursor-default">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 hover:bg-primary/20 hover:scale-110">
                  <Truck className="h-5 w-5 text-primary transition-transform duration-300 hover:scale-125" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Free Shipping</p>
                  <p className="text-sm text-gray-600">On orders over {formatPrice(200)}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 transition-all duration-300 hover:translate-x-2 cursor-default">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 hover:bg-primary/20 hover:scale-110">
                  <Shield className="h-5 w-5 text-primary transition-transform duration-300 hover:scale-125" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Secure Payment</p>
                  <p className="text-sm text-gray-600">100% secure checkout</p>
                </div>
              </div>
              <div className="flex items-start gap-4 transition-all duration-300 hover:translate-x-2 cursor-default">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 hover:bg-primary/20 hover:scale-110">
                  <RotateCcw className="h-5 w-5 text-primary transition-transform duration-300 hover:scale-125" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Easy Returns</p>
                  <p className="text-sm text-gray-600">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}