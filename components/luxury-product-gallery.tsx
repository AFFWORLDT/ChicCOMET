"use client"

import { useState } from "react"
import Image from "next/image"
import { MobileProductGridImage } from "@/components/ui/mobile-optimized-image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Crown, 
  Sparkles, 
  Star, 
  Play, 
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Heart,
  ShoppingCart,
  Award,
  Gem,
  Zap
} from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/hooks/use-wishlist"
import { toast } from "sonner"
import { getProductSize, type NormalizedProduct } from "@/lib/product-utils"
import { useAuth } from "@/lib/auth-context"
import { Price } from "@/components/price"
import { useCurrency } from "@/components/currency-provider"

interface Product {
  id: string
  name: string
  description: string
  image: string
  price: number
  originalPrice?: number
  category: string
  features: string[]
  premium: boolean
  rating: number
  reviews: number
  images?: string[]
  sku?: string
  attributes?: any[]
}

interface LuxuryGalleryProps {
  categoryId: string
  categoryName: string
  categoryDescription: string
  categoryImage: string
  products: Product[]
  color: string
  gradient: string
  icon: React.ReactNode
}

export function LuxuryProductGallery({ 
  categoryId, 
  categoryName, 
  categoryDescription, 
  categoryImage, 
  products, 
  color, 
  gradient, 
  icon 
}: LuxuryGalleryProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { addItem } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { user } = useAuth()
  const { formatPrice } = useCurrency()

  const handleToggleWishlist = async (product: Product, event: React.MouseEvent) => {
    event.stopPropagation()
    await toggleWishlist(product)
  }

  const handleAddToCart = (product: Product, event?: React.MouseEvent) => {
    // Prevent event bubbling if clicked from card
    if (event) {
      event.stopPropagation()
    }
    
    // Normalize product data
    const normalizedProduct: NormalizedProduct = {
      _id: product.id,
      id: product.id,
      name: product.name || 'Product',
      price: product.price || 0,
      originalPrice: product.originalPrice,
      description: product.description || '',
      images: product.images || [product.image || '/placeholder.jpg'],
      image: product.image || product.images?.[0] || '/placeholder.jpg',
      sku: product.sku || `SKU-${product.id}`,
      category: typeof product.category === 'string' ? { name: product.category } : { name: product.category || 'General' },
      attributes: product.attributes || [],
      isActive: true,
      status: 'active',
      createdAt: new Date().toISOString()
    }
    
    const size = getProductSize(normalizedProduct)
    
    addItem({
      id: normalizedProduct.id,
      name: normalizedProduct.name,
      price: normalizedProduct.price,
      image: normalizedProduct.image,
      size: size,
      range: normalizedProduct.category.name,
    })
    
    toast.success(`${normalizedProduct.name} added to cart!`)
  }

  const nextImage = () => {
    if (selectedProduct) {
      setCurrentImageIndex((prev) => (prev + 1) % products.length)
    }
  }

  const prevImage = () => {
    if (selectedProduct) {
      setCurrentImageIndex((prev) => (prev - 1 + products.length) % products.length)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Category Hero */}
      <section className={`relative h-[70vh] overflow-hidden ${color}`}>
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0">
          <Image
            src={categoryImage}
            alt={categoryName}
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center mb-6">
              {icon}
              <h1 className="font-serif text-4xl md:text-6xl font-bold ml-4">
                {categoryName}
              </h1>
            </div>
            <p className="text-lg md:text-xl mb-8 text-white/90 max-w-3xl mx-auto">
              {categoryDescription}
            </p>
            <Badge className="bg-yellow-500 text-black font-bold px-4 py-2 text-lg">
              <Crown className="w-4 h-4 mr-2" />
              PREMIUM COLLECTION
            </Badge>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {categoryName} Products
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Professional-grade formulations for exceptional results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <Card 
                key={product.id}
                className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-0 bg-white/90 backdrop-blur-sm"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden w-full">
                  <MobileProductGridImage
                    src={product.image || '/placeholder.jpg'}
                    alt={product.name}
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
                  
                  {/* Premium Badge */}
                  {product.premium && (
                    <Badge className="absolute top-4 right-4 bg-yellow-500 text-black font-bold px-3 py-1">
                      <Crown className="w-3 h-3 mr-1" />
                      PREMIUM
                    </Badge>
                  )}

                  <div className="absolute top-4 left-4 z-20">
                    <button 
                      onClick={(e) => handleToggleWishlist(product, e)}
                      className="p-1.5 transition-all transform hover:scale-110 drop-shadow-md rounded-full rounded-tl-full rounded-tr-full rounded-bl-full rounded-br-full"
                    >
                      <Heart className={`w-6 h-6 ${isInWishlist(product.id) ? 'text-rose-500 fill-rose-500' : 'text-white stroke-[2.5px]'}`} />
                    </button>
                  </div>

                  {/* Zoom Button */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="icon" variant="outline" className="bg-white/90 hover:bg-white">
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-2 line-clamp-2 text-sm">
                    {product.description}
                  </p>
                  <p className="text-xs text-amber-600 font-semibold mb-4 uppercase tracking-wide">
                    {typeof product.category === 'string' ? product.category : (product.category as any)?.name || 'General'}
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.features.slice(0, 2).map((feature, index) => (
                      <Badge 
                        key={index}
                        variant="secondary"
                        className="text-xs bg-gray-100 text-gray-700"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <Price amount={product.price} originalAmount={product.originalPrice} showOriginal={true} />
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-semibold"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddToCart(product, e)
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-white rounded-lg overflow-hidden">
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white"
              onClick={() => setSelectedProduct(null)}
            >
              ×
            </Button>

            <div className="grid md:grid-cols-2 gap-0">
              {/* Image Section */}
              <div className="relative h-96 md:h-full overflow-hidden">
                <Image
                  src={selectedProduct.image || '/placeholder.jpg'}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                  <Button size="icon" variant="outline" onClick={prevImage} className="bg-white/90">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="outline" onClick={nextImage} className="bg-white/90">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Details Section */}
              <div className="p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(selectedProduct.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-gray-600 ml-2">
                    {selectedProduct.rating} ({selectedProduct.reviews} reviews)
                  </span>
                </div>

                <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">
                  {selectedProduct.name}
                </h2>
                <p className="text-gray-600 mb-6">
                  {selectedProduct.description}
                </p>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Key Features:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4 mb-6">
                  <Price amount={selectedProduct.price} originalAmount={selectedProduct.originalPrice} showOriginal={true} className="text-3xl" />
                  {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                    <Badge className="bg-red-500 text-white">
                      Save {formatPrice(selectedProduct.originalPrice - selectedProduct.price)}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-semibold py-3"
                    onClick={() => handleAddToCart(selectedProduct)}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add
                  </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className={`px-4 ${isInWishlist(selectedProduct.id) ? 'text-rose-500' : 'text-gray-400'}`}
                      onClick={(e) => handleToggleWishlist(selectedProduct, e)}
                    >
                      <Heart className={`w-5 h-5 ${isInWishlist(selectedProduct.id) ? 'fill-rose-500' : ''}`} />
                    </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
