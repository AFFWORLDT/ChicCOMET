"use client"

import { useState, useEffect } from "react"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollAnimate } from "@/components/scroll-animate"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { 
  Crown, 
  Heart, 
  ArrowRight,
  Shield,
  Sparkles,
  Home,
  Package,
  Shirt,
  Leaf,
  Zap,
  Star,
  Loader2,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import { LuxuryShowcase } from "@/components/luxury-showcase"
import { FeaturedCategories } from "@/components/featured-categories"
import { MobileProductGridImage } from "@/components/ui/mobile-optimized-image"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import dynamic from "next/dynamic"

// Lazy load BestSellers component
const BestSellers = dynamic(() => import("@/components/best-sellers").then(mod => ({ default: mod.BestSellers })), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
})

interface Category {
  _id: string
  name: string
  description?: string
  slug: string
  image?: string
  isActive: boolean
  isFeatured?: boolean
}

const colorGradients = [
  "from-amber-400 to-orange-500",
  "from-blue-400 to-purple-500",
  "from-pink-400 to-rose-500",
  "from-green-400 to-emerald-500",
  "from-emerald-400 to-teal-500",
  "from-purple-400 to-indigo-500"
]

const defaultImages = [
  "https://images.unsplash.com/photo-1556911229-bb31c44d8251?w=800&h=800&fit=crop&auto=format&q=85",
  "https://images.unsplash.com/photo-1544462815-739e5cee5343?w=800&h=800&fit=crop&auto=format&q=85",
  "https://images.unsplash.com/photo-1584622650111-993a573fbfb7?w=800&h=800&fit=crop&auto=format&q=85",
  "https://images.unsplash.com/photo-1586105251267-828a5c76f6f1?w=800&h=800&fit=crop&auto=format&q=85",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=800&fit=crop&auto=format&q=85",
  "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=800&fit=crop&auto=format&q=85"
]

const getCategoryIcon = (name: string) => {
  const nameLower = name.toLowerCase()
  if (nameLower.includes('bed')) return Home
  if (nameLower.includes('bath')) return Shield
  if (nameLower.includes('duvet')) return Package
  if (nameLower.includes('pillow')) return Zap
  if (nameLower.includes('hotel')) return Leaf
  if (nameLower.includes('curtain')) return Star
  return Crown
}

const getCategoryGradient = (index: number) => {
  return colorGradients[index % colorGradients.length]
}

const getCategoryImage = (category: Category, index: number) => {
  return category.image || defaultImages[index % defaultImages.length]
}

export default function ShowcasePage() {
  const { ref: heroRef, isVisible: heroAnimate } = useScrollAnimation({ threshold: 0.1 });
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!carouselApi || isPaused || !categories || categories.length === 0) return
    const interval = setInterval(() => {
      carouselApi.scrollNext()
    }, 4000)
    return () => clearInterval(interval)
  }, [carouselApi, isPaused, categories.length])

  useEffect(() => {
    const fetchCategories = async (retries = 5) => {
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          setLoading(true)
          setError(null)
          
          const response = await fetch(`/api/categories?active=true&t=${Date.now()}`)
          
          if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`
            try {
              const errorData = await response.json()
              errorMessage = errorData.error || errorMessage
            } catch {
              // If response is not JSON, use default message
            }
            
            if ((errorMessage.includes('database') || errorMessage.includes('connection') || response.status === 500) && attempt < retries - 1) {
              const delay = 1000 * Math.pow(2, attempt)
              console.warn(`Categories fetch failed (attempt ${attempt + 1}/${retries}), retrying in ${delay}ms...`)
              await new Promise(resolve => setTimeout(resolve, delay))
              continue
            }
            
            throw new Error(errorMessage)
          }
          
          const data = await response.json()
          
          if (data.success) {
            setCategories(data.data || [])
            setError(null)
            setLoading(false)
            return
          } else {
            setError(data.error || 'Failed to fetch categories')
            setLoading(false)
            return
          }
        } catch (err) {
          console.error('Error fetching categories:', err)
          const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
          
          if ((errorMessage.includes('database') || errorMessage.includes('connection')) && attempt < retries - 1) {
            const delay = 1000 * Math.pow(2, attempt)
            await new Promise(resolve => setTimeout(resolve, delay))
            continue
          }
          
          setError(errorMessage)
          setLoading(false)
          
          if (attempt === retries - 1) {
            return
          }
        }
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="min-h-screen page-entrance">
      <main>
        {/* Hero Section */}
        <section ref={heroRef} className={`bg-gradient-to-br from-[#f8f6f3] to-[#f0ebe4] py-20 ${heroAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700`}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-secondary text-navy-900 hover:bg-secondary/80 font-semibold">
                <Crown className="w-4 h-4 mr-2" />
                Premium Collections
              </Badge>
              <h1 className="text-5xl font-bold text-navy-900 mb-6">
                Discover Our 
                <span className="text-secondary"> Premium Collections</span>
              </h1>
              <p className="text-xl text-[#404040] mb-8 leading-relaxed">
                Each collection is carefully curated for hospitality excellence, 
                featuring premium organic cotton and Egyptian cotton linens for hotels, resorts, and serviced residences.
              </p>
            </div>
          </div>
        </section>

        {/* Product Type Collections - Carousel */}
        {/* <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-[#262626] mb-6">
                  Our Product Collections
                </h2>
                <p className="text-xl text-[#404040]">
                  Browse our complete range of premium hospitality linen collections
                </p>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="text-center text-destructive py-10">
                  <p className="mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">Retry</Button>
                </div>
              ) : categories.length > 0 ? (
                <div
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  <Carousel
                    setApi={setCarouselApi}
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-2 md:-ml-4">
                      {categories.map((category, index) => {
                        const categoryImage = getCategoryImage(category, index)
                        const categoryName = category.name.toUpperCase()
                        return (
                          <CarouselItem key={category._id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                            <Link href={`/products?category=${category.slug}`}>
                              <Card className="group relative w-full h-[500px] md:h-[600px] overflow-hidden border-0 rounded-2xl cursor-pointer hover-lift">
                                <div className="absolute inset-0 w-full h-full">
                                  <MobileProductGridImage
                                    src={categoryImage}
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
                                </div>
                                <CardContent className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-3xl md:text-4xl font-bold text-white">
                                      {categoryName}
                                    </h3>
                                    <Button
                                      size="icon"
                                      className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-full w-12 h-12 md:w-14 md:h-14 transition-all duration-300 group-hover:scale-110"
                                    >
                                      <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          </CarouselItem>
                        )
                      })}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex -left-12 bg-white/90 backdrop-blur-sm border-2 border-[#e5e5e5] hover:border-[#4e6a9a] shadow-lg w-12 h-12 rounded-full" />
                    <CarouselNext className="hidden md:flex -right-12 bg-white/90 backdrop-blur-sm border-2 border-[#e5e5e5] hover:border-[#4e6a9a] shadow-lg w-12 h-12 rounded-full" />
                  </Carousel>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <p>No collections available at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </section> */}

        {/* Featured Products Section */}
        <ScrollAnimate animation="card-entrance" delay={200}>
        <FeaturedCategories />

        </ScrollAnimate>

        {/* Luxury Showcase Content */}
        <ScrollAnimate animation="fade-in-up-scale" delay={300}>
          <LuxuryShowcase />
        </ScrollAnimate>

        {/* Collection Benefits */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-[#262626] mb-6">
                  Why Choose Our Collections?
                </h2>
                <p className="text-xl text-[#404040]">
                  Each collection is designed to meet the demanding standards of the hospitality industry
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <ScrollAnimate animation="scale-in" delay={0.1}>
                  <Card className="text-center p-8 hover:shadow-lg transition-shadow hover-lift">
                    <CardContent className="p-0">
                      <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Crown className="w-8 h-8 text-secondary" />
                      </div>
                      <h3 className="text-2xl font-bold text-navy-900 mb-4">Hospitality Grade</h3>
                      <p className="text-[#404040] leading-relaxed">
                        Premium quality linens that meet the demanding standards of top-tier hotels, resorts, and serviced residences.
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="scale-in" delay={0.2}>
                  <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-8 h-8 text-secondary" />
                      </div>
                      <h3 className="text-2xl font-bold text-navy-900 mb-4">Premium Materials</h3>
                      <p className="text-[#404040] leading-relaxed">
                        Crafted from 100% organic, long staple cotton for bed linen and 100% Egyptian cotton for bath linen.
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="scale-in" delay={0.3}>
                  <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart className="w-8 h-8 text-secondary" />
                      </div>
                      <h3 className="text-2xl font-bold text-navy-900 mb-4">Five-Star Experience</h3>
                      <p className="text-[#404040] leading-relaxed">
                        Deliver exceptional guest experiences with soft, breathable, durable, and elegant linens.
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-navy-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Elevate Your Hospitality Experience?
              </h2>
              <p className="text-xl text-secondary/90 mb-8">
                Explore our collections and find the perfect linen solutions for your hotel, resort, or serviced residence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <Button size="lg" className="bg-secondary text-navy-900 hover:bg-secondary/90">
                    Shop All Products
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-navy-900">
                    Contact Our Team
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
