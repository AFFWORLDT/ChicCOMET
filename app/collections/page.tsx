"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollAnimate } from "@/components/scroll-animate"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { 
  Sparkles, 
  Crown, 
  Heart, 
  Star, 
  ArrowRight,
  Shield,
  Leaf,
  Zap,
  Home,
  Package,
  Shirt,
  Loader2
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { MobileProductGridImage } from "@/components/ui/mobile-optimized-image"

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

export default function CollectionsPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const { ref: heroRef, isVisible: heroAnimate } = useScrollAnimation({ threshold: 0.1 });

  return (
    <div className="min-h-screen page-entrance">
      
      <main>
        {/* Hero Section */}
        <section ref={heroRef} className={`bg-gradient-to-br from-[#f8f6f3] to-[#f0ebe4] py-24 md:py-32 ${heroAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700`}>
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <Badge className="mb-6 bg-secondary text-navy-900 hover:bg-secondary/80 font-semibold text-base px-4 py-2">
                <Crown className="w-5 h-5 mr-2" />
                Our Product Collections
              </Badge>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-navy-900 mb-6 leading-tight">
                Discover Our Complete Range
              </h1>
              <p className="text-xl md:text-2xl text-[#404040] mb-8 leading-relaxed max-w-3xl mx-auto">
                Premium hospitality linen collections carefully curated for excellence, 
                featuring organic cotton and Egyptian cotton linens for hotels, resorts, and serviced residences.
              </p>
            </div>
          </div>
        </section>

        {/* All Collections Grid */}
        <section className="py-20 bg-[#fafafa]">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-[#262626] mb-6">
                  All Collections
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
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categories.length > 0 ? (
                    categories.map((category, index) => {
                      const IconComponent = getCategoryIcon(category.name)
                      const gradient = getCategoryGradient(index)
                      const categoryImage = getCategoryImage(category, index)
                      return (
                        <ScrollAnimate key={category._id} animation="scale-in" delay={index * 0.1}>
                          <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover-lift">
                            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                              <MobileProductGridImage
                                src={categoryImage}
                                alt={category.name}
                                className="w-full h-full object-cover opacity-50"
                              />
                              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-40`} />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                  <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                                    <IconComponent className="w-8 h-8 text-white" />
                                  </div>
                                  <h3 className="text-xl font-bold text-[#262626]">
                                    {category.name}
                                  </h3>
                                  {category.isFeatured && (
                                    <Badge className={`bg-gradient-to-r ${gradient} text-white border-0 text-xs mt-2`}>
                                      Featured
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <CardContent className="p-6">
                              <p className="text-[#404040] mb-4 text-sm leading-relaxed">
                                {category.description || `Explore our premium ${category.name.toLowerCase()} collection.`}
                              </p>
                                <div className="flex items-center justify-end">
                                <Link href={`/products?category=${category.slug}`}>
                                  <Button size="sm" className="bg-secondary hover:bg-secondary/90 text-navy-900">
                                    View Products
                                    <ArrowRight className="w-3 h-3 ml-1" />
                                  </Button>
                                </Link>
                              </div>
                            </CardContent>
                          </Card>
                        </ScrollAnimate>
                      )
                    })
                  ) : (
                    <div className="col-span-3 text-center py-10 text-muted-foreground">
                      <p>No collections available at the moment.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

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
