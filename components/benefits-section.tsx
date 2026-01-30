"use client"

import { Droplets, Shield, Wind, Thermometer, Heart, Sparkles } from "lucide-react"
import { ScrollAnimate } from "@/components/scroll-animate"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const benefits = [
  {
    icon: Droplets,
    title: "100% Virgin Cotton",
    description: "Crafted from 100% Virgin Cotton Long Staple Yarn producing plush extreme softness of Dove Feather Standard with high absorbency"
  },
  {
    icon: Shield,
    title: "Government Certified",
    description: "We are the only manufacturer exporter of hospitality linen who provide Govt. test lab report confirming contents & quality parameters"
  },
  {
    icon: Wind,
    title: "Highly Absorbent",
    description: "Superior absorbency keeping us on top amongst our competition globally with premium quality towels and bath linen"
  },
  {
    icon: Thermometer,
    title: "After Sale Support",
    description: "Customer Care Team visits every six months to properties we supply - one and only one globally providing exceptional service"
  },
  {
    icon: Heart,
    title: "Extreme Softness",
    description: "Dove feather standard softness with long staple yarn for ultimate comfort and luxury feel"
  },
  {
    icon: Sparkles,
    title: "Professional Grade",
    description: "Hospitality grade linen trusted by hotels and professionals worldwide for over four decades"
  }
]

export function BenefitsSection() {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(163,154,140,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(163,154,140,0.05),transparent_50%)]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <ScrollAnimate animation="fade-in-up">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block mb-4">
              <span className="text-secondary text-sm font-semibold uppercase tracking-wider">Why Choose Us</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-navy-900">
              Why Choose Whitlin
            </h2>
            <p className="text-lg md:text-xl text-[#404040] max-w-3xl mx-auto leading-relaxed">
              Welcome to a New Standard of Bed Linen Excellence. Hotel-quality bed linen designed for comfort, durability, and elegance. 
              Trusted by top hotels across the UAE, our products elevate guest experiences with premium quality you can feel, 
              and performance you can rely on.
            </p>
          </div>
        </ScrollAnimate>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {benefits.map((benefit, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="h-full p-2">
                    <ScrollAnimate 
                      animation="scale-in" 
                      delay={index * 100}
                    >
                      <div className="h-full flex flex-col bg-white/80 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-700 border border-border hover:border-secondary/40 group hover-lift relative overflow-hidden card-premium-hover">
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 via-secondary/0 to-secondary/8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 gradient-flow-premium" />
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/8 rounded-full -mr-16 -mt-16 group-hover:scale-150 group-hover:rotate-180 transition-all duration-1000 animate-float" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/5 rounded-full -ml-12 -mb-12 group-hover:scale-125 group-hover:rotate-90 transition-all duration-1000" />
                        <div className="relative z-10 flex flex-col items-center text-center flex-grow">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-secondary/20 via-secondary/10 to-secondary/5 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:from-secondary/30 group-hover:to-secondary/15 transition-all duration-500 group-hover:scale-105 shadow-lg group-hover:shadow-xl">
                            <benefit.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-navy-800 icon-rotate-360" />
                          </div>
                          <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-[#1a1a1a] group-hover:text-secondary transition-all duration-500 group-hover:scale-105">
                            {benefit.title}
                          </h3>

                        </div>
                      </div>
                    </ScrollAnimate>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="-left-12 border-secondary/20 hover:border-secondary hover:bg-secondary/10 text-navy-900" />
              <CarouselNext className="-right-12 border-secondary/20 hover:border-secondary hover:bg-secondary/10 text-navy-900" />
            </div>
            {/* Mobile Navigation Controls */}
            <div className="flex justify-center gap-4 mt-8 md:hidden">
              <CarouselPrevious className="static transform-none border-secondary/20 hover:border-secondary hover:bg-secondary/10 text-navy-900" />
              <CarouselNext className="static transform-none border-secondary/20 hover:border-secondary hover:bg-secondary/10 text-navy-900" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  )
}
