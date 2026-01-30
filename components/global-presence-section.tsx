"use client"

import { useState, useEffect } from "react"
import { ScrollAnimate } from "@/components/scroll-animate"
import { Globe, MapPin, Building2 } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

const countries = [
  "Australia", "Bangladesh", "Botswana", "Canada", "England", 
  "Israel", "Europe", "Japan", "Kuwait", "Mauritius", 
  "South Africa", "United States of America", "United Arab Emirates"
]

export function GlobalPresenceSection() {
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

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(225,215,198,0.06),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(225,215,198,0.04),transparent_50%)]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <ScrollAnimate animation="fade-in-up">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block mb-4">
              <span className="text-secondary text-sm font-semibold uppercase tracking-wider">Worldwide Reach</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-navy-900">
              Global Presence
            </h2>
            <p className="text-lg md:text-xl text-[#404040] max-w-3xl mx-auto leading-relaxed">
              With a Strong Global distribution Network, we have warehouses, manufacturing facilities, 
              headquarters and marketing offices across multiple continents. Australia, Bangladesh, Botswana, 
              Canada, England, Israel, Europe, Japan, Kuwait, Mauritius, South Africa, United States of America, 
              United Arab Emirates and many more...
            </p>
          </div>
        </ScrollAnimate>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-200/5 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-200/5 rounded-full -ml-32 -mb-32" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gold-200/20 to-gold-200/10 rounded-2xl flex items-center justify-center shadow-lg">
                  <Globe className="w-8 h-8 sm:w-10 sm:h-10 text-navy-800" />
                </div>
              </div>
              
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
                  {countries.map((country, index) => (
                    <CarouselItem key={country} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                      <div className="bg-white p-3 sm:p-4 rounded-xl text-center hover:bg-muted hover:shadow-2xl transition-all duration-700 border border-border hover:border-secondary/40 hover-lift group h-full flex flex-col items-center justify-center card-premium-hover">
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-navy-800 mx-auto mb-2 icon-rotate-360 relative z-10" />
                        <p className="text-xs sm:text-sm md:text-base font-semibold text-[#1a1a1a] group-hover:text-secondary transition-all duration-500 group-hover:scale-110 relative z-10">
                          {country}
                        </p>
                      </div>
                    </CarouselItem>
                  ))}
                  <CarouselItem className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                    <div className="bg-gradient-to-br from-secondary/10 to-primary/5 p-3 sm:p-4 rounded-xl text-center hover:bg-muted hover:shadow-lg transition-all duration-300 border-2 border-dashed border-secondary/30 hover:border-secondary hover-lift group h-full flex flex-col items-center justify-center">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-navy-800 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300 icon-rotate-360" />
                      <p className="text-xs sm:text-sm md:text-base font-semibold text-[#1a1a1a] group-hover:text-secondary transition-colors duration-300 italic">
                        and many more...
                      </p>
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-12 bg-white/90 backdrop-blur-sm border-2 border-border hover:border-primary shadow-premium-md hover:shadow-premium-lg" />
                <CarouselNext className="hidden md:flex -right-12 bg-white/90 backdrop-blur-sm border-2 border-border hover:border-primary shadow-premium-md hover:shadow-premium-lg" />
              </Carousel>
              </div>
              
              <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
                  <div className="p-4 sm:p-6 bg-muted rounded-xl">
                    <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-navy-800 mx-auto mb-2 sm:mb-3" />
                    <h3 className="font-bold text-sm sm:text-base text-[#1a1a1a] mb-1 sm:mb-2">Warehouses</h3>
                    <p className="text-xs sm:text-sm text-[#404040]">Strategic locations worldwide</p>
                  </div>
                  <div className="p-4 sm:p-6 bg-muted rounded-xl">
                    <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-navy-800 mx-auto mb-2 sm:mb-3" />
                    <h3 className="font-bold text-sm sm:text-base text-[#1a1a1a] mb-1 sm:mb-2">Manufacturing</h3>
                    <p className="text-xs sm:text-sm text-[#404040]">State-of-the-art facilities</p>
                  </div>
                  <div className="p-4 sm:p-6 bg-muted rounded-xl">
                    <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-navy-800 mx-auto mb-2 sm:mb-3" />
                    <h3 className="font-bold text-sm sm:text-base text-[#1a1a1a] mb-1 sm:mb-2">Offices</h3>
                    <p className="text-xs sm:text-sm text-[#404040]">Global headquarters & branches</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

