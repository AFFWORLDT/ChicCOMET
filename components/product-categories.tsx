"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { MobileProductGridImage } from "@/components/ui/mobile-optimized-image"
import { Loader2 } from "lucide-react"
import { ScrollAnimate } from "@/components/scroll-animate"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

interface Category {
  _id: string
  name: string
  description: string
  slug: string
  image?: string
  isActive: boolean
  createdAt: string
}

const colorGradients = [
  "from-red-600 to-red-800",
  "from-pink-500 to-rose-600", 
  "from-purple-600 to-violet-700",
  "from-purple-600 to-pink-600",
  "from-yellow-600 to-amber-700",
  "from-amber-600 to-yellow-700",
  "from-gray-800 to-black",
  "from-teal-500 to-cyan-600"
]

const defaultImages = [
  "/images/refresh/bedding-detail-1.jpg",
  "/images/refresh/bedding-detail-2.jpg",
  "/images/refresh/istock-pillows.jpg",
  "/images/refresh/hero-interior.jpg",
  "/images/refresh/hero-bedroom.jpg",
  "/images/refresh/istock-white-bed.jpg",
  "/images/refresh/hero-lifestyle.jpg",
  "/images/refresh/bedding-detail-1.jpg" // Loop back or use another
]

export function ProductCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [api, setApi] = useState<CarouselApi>()
  const [isPaused, setIsPaused] = useState(false)

  // Auto-scroll functionality
  useEffect(() => {
    if (!api || isPaused) return

    const interval = setInterval(() => {
      api.scrollNext()
    }, 3000) // Auto-slide every 3 seconds

    return () => clearInterval(interval)
  }, [api, isPaused])

  // Fetch categories from API with retry logic
  useEffect(() => {
    const fetchCategories = async (retries = 5) => {
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          setLoading(true)
          setError(null)
          
          // Add timestamp to bypass cache
          const response = await fetch(`/api/categories?active=true&t=${Date.now()}`)
          
          if (!response.ok) {
            // Try to get error message from response
            let errorMessage = `HTTP error! status: ${response.status}`
            try {
              const errorData = await response.json()
              errorMessage = errorData.error || errorMessage
            } catch {
              // If response is not JSON, use default message
            }
            
            // If it's a database connection error and we have retries left, retry
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
          const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred while fetching categories'
          
          // If it's a database connection error and we have retries left, retry
          if ((errorMessage.includes('database') || errorMessage.includes('connection') || errorMessage.includes('SSL') || errorMessage.includes('TLS')) && attempt < retries - 1) {
            const delay = 1000 * Math.pow(2, attempt)
            console.warn(`Categories fetch failed (attempt ${attempt + 1}/${retries}), retrying in ${delay}ms...`)
            await new Promise(resolve => setTimeout(resolve, delay))
            continue
          }
          
          // Provide user-friendly error message
          if (errorMessage.includes('database') || errorMessage.includes('connection') || errorMessage.includes('SSL') || errorMessage.includes('TLS')) {
            setError('Unable to connect to the database. Please try again in a moment.')
          } else if (errorMessage.includes('HTTP error') || errorMessage.includes('status: 500')) {
            setError('Server error occurred. Please try again later.')
          } else {
            setError(errorMessage)
          }
          
          // Set loading to false even on error so the component can render
          setLoading(false)
          
          // If this was the last attempt, stop retrying
          if (attempt === retries - 1) {
            return
          }
        }
      }
    }

    fetchCategories()
  }, [])

  const getCategoryColor = (index: number) => {
    return colorGradients[index % colorGradients.length]
  }

  const getCategoryImage = (category: Category, index: number) => {
    return category.image || defaultImages[index % defaultImages.length] || "/placeholder.svg"
  }

  const getCategoryCode = (category: Category) => {
    // Generate a code from the category name
    const words = category.name.split(' ')
    if (words.length >= 2) {
      return words.map(word => word.charAt(0)).join('').toUpperCase()
    }
    return category.name.substring(0, 2).toUpperCase()
  }

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(225,215,198,0.05),transparent_70%)]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <ScrollAnimate animation="fade-in-up">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="inline-block mb-3 sm:mb-4">
              <span className="text-secondary text-xs sm:text-sm font-semibold uppercase tracking-wider">Complete Range</span>
            </div>
            <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-navy-900">
              Our Product Collections
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#404040] max-w-3xl mx-auto leading-relaxed px-2">
              Discover our complete range of premium hospitality linen, from bed linen to bath linen, each designed for luxury and comfort
            </p>
          </div>
        </ScrollAnimate>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gold-200 mb-4" />
            <p className="text-[#404040] text-sm">Loading categories...</p>
          </div>
        ) : error ? (
          <div className="text-center text-destructive py-10">
            <p className="mb-4">{error}</p>
            <button 
              onClick={() => {
                setLoading(true)
                setError(null)
                const fetchCategories = async () => {
                  try {
                    const response = await fetch(`/api/categories?active=true&t=${Date.now()}`)
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
                    const data = await response.json()
                    if (data.success) {
                      setCategories(data.data || [])
                      setError(null)
                    } else {
                      setError(data.error || 'Failed to fetch categories')
                    }
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Failed to fetch categories')
                  } finally {
                    setLoading(false)
                  }
                }
                fetchCategories()
              }} 
              className="mt-4 px-4 py-2 border border-destructive rounded-md hover:bg-destructive/10 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            <p>No categories available at the moment.</p>
            <p className="text-sm mb-4">Check back soon for our latest product ranges!</p>
            <button 
              onClick={() => {
                setLoading(true)
                const fetchCategories = async () => {
                  try {
                    const response = await fetch(`/api/categories?active=true&t=${Date.now()}`)
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
                    const data = await response.json()
                    if (data.success) {
                      setCategories(data.data || [])
                    }
                  } catch (err) {
                    console.error('Error fetching categories:', err)
                  } finally {
                    setLoading(false)
                  }
                }
                fetchCategories()
              }}
              className="px-4 py-2 border border-muted-foreground rounded-md hover:bg-muted transition-colors"
            >
              Refresh
            </button>
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
                {categories.map((category, index) => (
                  <CarouselItem key={category._id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                    <Link href={`/products?category=${category.slug}`} className="h-full block">
                      <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-border overflow-hidden hover-lift rounded-xl sm:rounded-2xl bg-white h-full flex flex-col">
                        <div className="relative h-40 xs:h-48 sm:h-56 md:h-64 overflow-hidden flex-shrink-0">
                          <MobileProductGridImage
                            src={getCategoryImage(category, index)}
                            alt={category.name}
                            className="group-hover:scale-125 transition-transform duration-1000 ease-out"
                          />
                          <div
                            className={`absolute inset-0 bg-gradient-to-t ${getCategoryColor(index)} opacity-30 group-hover:opacity-50 transition-opacity duration-700`}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-700" />
                          <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 bg-white/95 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full shadow-lg border border-white/50 group-hover:scale-110 transition-transform duration-300 badge-rotate-360">
                            <span className="font-bold text-[10px] xs:text-xs sm:text-sm text-gray-800">{getCategoryCode(category)}</span>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                        <CardContent className="p-3 sm:p-4 md:p-6 bg-white flex flex-col flex-grow">
                          <h3 className="font-serif text-base xs:text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 group-hover:text-primary transition-colors text-balance leading-tight">
                            {category.name}
                          </h3>
                          <p className="text-[#404040] text-xs sm:text-sm md:text-base text-pretty leading-relaxed line-clamp-3 flex-grow">{category.description}</p>
                          <div className="mt-2 sm:mt-3 md:mt-4 pt-2 sm:pt-3 md:pt-4 border-t border-border">
                            <span className="text-[10px] xs:text-xs text-primary font-semibold uppercase tracking-wider group-hover:tracking-widest transition-all duration-300">
                              Explore Collection →
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 bg-white/90 backdrop-blur-sm border-2 border-border hover:border-primary shadow-premium-md hover:shadow-premium-lg" />
              <CarouselNext className="hidden md:flex -right-12 bg-white/90 backdrop-blur-sm border-2 border-border hover:border-primary shadow-premium-md hover:shadow-premium-lg" />
            </Carousel>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
