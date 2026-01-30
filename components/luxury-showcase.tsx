"use client"

import { useState } from "react"
import Link from "next/link"
import { MobileProductGridImage } from "@/components/ui/mobile-optimized-image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Crown, 
  Sparkles, 
  Star, 
  Play, 
  ChevronRight,
  Award,
  Gem,
  Zap
} from "lucide-react"

interface ProductCategory {
  id: string
  name: string
  description: string
  image: string
  groupImage: string
  products: string[]
  color: string
  gradient: string
  icon: React.ReactNode
  features: string[]
  premium: boolean
}

const luxuryCategories: ProductCategory[] = [
  {
    id: "semi-luxury",
    name: "Semi Luxury Collection",
    description: "Premium quality hospitality products with 300 TC virgin cotton and quality materials. Perfect balance of luxury and value.",
    image: "https://images.unsplash.com/photo-1556911229-bb31c44d8251?w=800&h=800&fit=crop&auto=format&q=85",
    groupImage: "https://images.unsplash.com/photo-1556911229-bb31c44d8251?w=800&h=800&fit=crop&auto=format&q=85",
    products: [],
    color: "bg-gradient-to-br from-amber-600 to-orange-800",
    gradient: "from-amber-500/20 to-orange-600/20",
    icon: <Crown className="w-6 h-6" />,
    features: ["300 TC Cotton", "Virgin Cotton", "Premium Quality"],
    premium: true
  },
  {
    id: "upper-economy",
    name: "Upper Economy Collection", 
    description: "Quality economy products with 200-210 TC cotton and durable materials. Great value for hospitality establishments.",
    image: "https://images.unsplash.com/photo-1586105251267-828a5c76f6f1?w=800&h=800&fit=crop&auto=format&q=85",
    groupImage: "https://images.unsplash.com/photo-1586105251267-828a5c76f6f1?w=800&h=800&fit=crop&auto=format&q=85",
    products: [],
    color: "bg-gradient-to-br from-blue-600 to-cyan-800",
    gradient: "from-blue-500/20 to-cyan-600/20",
    icon: <Award className="w-6 h-6" />,
    features: ["200-210 TC", "Durable Materials", "Great Value"],
    premium: true
  },
  {
    id: "economy",
    name: "Economy Collection",
    description: "Budget-friendly hospitality products with polyester and recycled cotton materials. Reliable quality at affordable prices.",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=800&fit=crop&auto=format&q=85",
    groupImage: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=800&fit=crop&auto=format&q=85",
    products: [],
    color: "bg-gradient-to-br from-emerald-600 to-teal-800",
    gradient: "from-emerald-500/20 to-teal-600/20",
    icon: <Sparkles className="w-6 h-6" />,
    features: ["Polyester Blend", "Recycled Cotton", "Affordable"],
    premium: false
  },
  {
    id: "luxury",
    name: "Luxury Collection",
    description: "High-end linen with 400 TC virgin cotton and fusion/embroidery. Premium quality for luxury hotels and resorts.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop&auto=format&q=85",
    groupImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop&auto=format&q=85",
    products: [],
    color: "bg-gradient-to-br from-purple-600 to-indigo-800",
    gradient: "from-purple-500/20 to-indigo-600/20",
    icon: <Gem className="w-6 h-6" />,
    features: ["400 TC Cotton", "Fusion Details", "Luxury Grade"],
    premium: true
  },
  {
    id: "hyper-luxury",
    name: "Hyper Luxury Collection",
    description: "Ultra-premium linen with 600 TC virgin cotton. The ultimate in luxury hospitality linen excellence.",
    image: "https://images.unsplash.com/photo-1584622650111-993a573fbfb7?w=800&h=800&fit=crop&auto=format&q=85",
    groupImage: "https://images.unsplash.com/photo-1584622650111-993a573fbfb7?w=800&h=800&fit=crop&auto=format&q=85",
    products: [],
    color: "bg-gradient-to-br from-rose-600 to-pink-800",
    gradient: "from-rose-500/20 to-pink-600/20",
    icon: <Crown className="w-6 h-6" />,
    features: ["600 TC Cotton", "Ultra Premium", "Ultimate Luxury"],
    premium: true
  },
  {
    id: "bed-linen",
    name: "Bed Linen Collection",
    description: "Complete bed linen solutions including bedsheets, pillowcases, duvets, and duvet covers. All crafted from 100% Virgin Cotton.",
    image: "https://images.unsplash.com/photo-1556911229-bb31c44d8251?w=800&h=800&fit=crop&auto=format&q=85",
    groupImage: "https://images.unsplash.com/photo-1556911229-bb31c44d8251?w=800&h=800&fit=crop&auto=format&q=85",
    products: [],
    color: "bg-gradient-to-br from-amber-600 to-yellow-800",
    gradient: "from-yellow-500/20 to-amber-600/20",
    icon: <Star className="w-6 h-6" />,
    features: ["100% Virgin Cotton", "300 TC Quality", "Complete Range"],
    premium: true
  },
  {
    id: "bath-linen",
    name: "Bath Linen Collection",
    description: "Premium bath towels, hand towels, face towels, and bath mats. 550 GSM quality with superior absorbency.",
    image: "https://images.unsplash.com/photo-1544462815-739e5cee5343?w=800&h=800&fit=crop&auto=format&q=85",
    groupImage: "https://images.unsplash.com/photo-1544462815-739e5cee5343?w=800&h=800&fit=crop&auto=format&q=85",
    products: [],
    color: "bg-gradient-to-br from-blue-600 to-purple-800",
    gradient: "from-blue-500/20 to-purple-600/20",
    icon: <Sparkles className="w-6 h-6" />,
    features: ["550 GSM", "High Absorbency", "Spa Quality"],
    premium: true
  },
  {
    id: "pillows-duvets",
    name: "Pillows & Duvets Collection",
    description: "Comfortable pillows and luxurious duvets. Natural goose feather options and eco-friendly microfibre duvets available.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop&auto=format&q=85",
    groupImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop&auto=format&q=85",
    products: [],
    color: "bg-gradient-to-br from-green-600 to-emerald-800",
    gradient: "from-green-500/20 to-emerald-600/20",
    icon: <Award className="w-6 h-6" />,
    features: ["Natural Feather", "Eco-Friendly Options", "Hotel Quality"],
    premium: true
  }
]

export function LuxuryShowcase() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Collections Grid */}
      <section id="collections" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4 sm:mb-6">
              Our Premium Collections
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-[#404040] max-w-3xl mx-auto px-4">
              Each collection is meticulously crafted with premium 100% Virgin Cotton Long Staple Yarn, designed for luxury and durability in the hospitality industry
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {luxuryCategories.map((category) => (
              <Card 
                key={category.id}
                className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border border-[#e5e5e5] bg-white h-auto sm:h-[520px] flex flex-col rounded-xl shadow-lg hover:shadow-2xl"
              >
                <div className={`relative h-48 sm:h-56 md:h-64 ${category.color} overflow-hidden flex-shrink-0 w-full`}>
                  <MobileProductGridImage
                    src={category.groupImage || category.image || '/placeholder.jpg'}
                    alt={category.name}
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  
                  {/* Premium Badge */}
                  {category.premium && (
                    <Badge className="absolute top-4 right-4 bg-[#e1d7c6] text-[#1a1a1a] font-bold px-3 py-1">
                      <Crown className="w-3 h-3 mr-1" />
                      PREMIUM
                    </Badge>
                  )}

                  {/* Category Icon */}
                  <div className="absolute bottom-4 left-4 text-white">
                    {category.icon}
                  </div>
                </div>

                <CardContent className="p-4 sm:p-6 flex flex-col flex-grow min-h-0 bg-white">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#262626] mb-2 sm:mb-3 line-clamp-2 leading-tight">
                    {category.name}
                  </h3>
                  <p className="text-sm sm:text-base text-[#262626] mb-3 sm:mb-4 line-clamp-3 leading-relaxed min-h-[3.5rem]">
                    {category.description}
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4 min-h-[2.5rem]">
                    {category.features.slice(0, 3).map((feature, index) => (
                      <Badge 
                        key={index}
                        variant="secondary"
                        className="text-xs font-semibold bg-[#f8f6f3] text-[#262626] border border-[#e5e5e5]"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <Link href={`/products?category=${category.id}`}>
                      <Button 
                        className="w-full bg-[#e1d7c6] hover:bg-[#d4c7b3] text-[#1a1a1a] font-semibold"
                      >
                        Explore Collection
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <Button
              variant="outline"
              size="icon"
              className="absolute -top-12 right-0 text-white border-white hover:bg-white hover:text-black"
              onClick={() => setIsVideoPlaying(false)}
            >
              ×
            </Button>
            <div className="aspect-video bg-[#1a1a1a] rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Video Player Placeholder</p>
                <p className="text-sm opacity-75">Add your product demonstration video here</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
