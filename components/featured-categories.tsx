"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { MobileProductGridImage } from "@/components/ui/mobile-optimized-image"
import { ArrowRight } from "lucide-react"
import { ScrollAnimate } from "@/components/scroll-animate"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const categories = [
  {
    name: "BED LINEN",
    image: "https://images.pexels.com/photos/33197282/pexels-photo-33197282.jpeg",
    href: "/products?category=bed-linen"
  },
  {
    name: "BATH LINEN",
    image: "https://images.pexels.com/photos/4177714/pexels-photo-4177714.jpeg",
    href: "/products?category=bath-linen"
  },
  {
    name: "PILLOWS & DUVETS",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop&auto=format&q=85",
    href: "/products?category=pillows-duvets"
  },
  {
    name: "HOTEL ESSENTIALS",
    image: "https://images.pexels.com/photos/7737410/pexels-photo-7737410.jpeg",
    href: "/products?category=hotel-essentials"
  },
  {
    name: "CURTAINS & SOFT FURNISHINGS",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=800&fit=crop&auto=format&q=85",
    href: "/products?category=curtains"
  }
]

export function FeaturedCategories() {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white relative overflow-hidden ethnic-pattern">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(78,106,154,0.08),transparent_50%)]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 relative z-10">
        <ScrollAnimate animation="fade-in-up">
          <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
            <div className="inline-block mb-2 sm:mb-3 md:mb-4">
              <span className="text-secondary text-[10px] xs:text-xs sm:text-sm font-semibold uppercase tracking-wider">Explore Collections</span>
            </div>
            <h2 className="font-serif text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-3 md:mb-4 text-navy-900 px-2 text-shadow-sm">
              Featured Products
            </h2>
            <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-[#404040] max-w-3xl mx-auto leading-relaxed px-3 sm:px-4">
              Discover our premium hospitality linen collections designed for luxury and comfort
            </p>
          </div>
        </ScrollAnimate>

        <div className="max-w-7xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {categories.map((category, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <Link href={category.href} className="h-full block w-full">
                    <Card className="group relative w-full h-full min-h-[240px] xs:min-h-[260px] sm:min-h-[300px] md:min-h-[340px] lg:min-h-[380px] xl:min-h-[420px] 2xl:min-h-[450px] overflow-hidden border-0 shadow-premium-lg hover:shadow-premium-xl transition-all duration-1000 cursor-pointer hover-lift card-premium-radius card-premium-hover flex flex-col">
                      <div className="absolute inset-0 w-full h-full">
                        <MobileProductGridImage
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/40 group-hover:from-black/85 group-hover:via-black/50 group-hover:to-black/20 transition-all duration-700 text-on-image-dark" />
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-all duration-700" />
                      </div>
                      <CardContent className="relative h-full flex flex-col justify-end p-3 xs:p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 z-10 flex-grow min-h-0">
                        <div className="flex items-end justify-between gap-2 xs:gap-2.5 sm:gap-3 md:gap-4 flex-shrink-0">
                          <h3 className="font-serif text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-white text-shadow-premium group-hover:scale-105 group-hover:translate-x-1 transition-all duration-500 leading-tight flex-1 pr-2">
                            {category.name}
                          </h3>
                          <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/35 group-hover:scale-110 transition-all duration-500 border border-white/40 flex-shrink-0 shadow-lg">
                            <ArrowRight className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-white group-hover:translate-x-1 icon-rotate-360" />
                          </div>
                        </div>
                        <div className="mt-2 xs:mt-2.5 sm:mt-3 md:mt-3.5 lg:mt-4 h-0.5 sm:h-1 w-0 bg-secondary group-hover:w-full transition-all duration-700 rounded-full flex-shrink-0" />
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
    </section>
  )
}

