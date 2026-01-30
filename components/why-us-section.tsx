"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Award, Users, Package, TrendingUp } from "lucide-react"
import { ScrollAnimate } from "@/components/scroll-animate"

const stats = [
  {
    icon: Users,
    value: "7,000+",
    label: "Clients Worldwide"
  },
  {
    icon: Package,
    value: "5000+",
    label: "Ready to Deliver SKUs"
  },
  {
    icon: TrendingUp,
    value: "100%",
    label: "Client Satisfaction"
  },
  {
    icon: Award,
    value: "40+",
    label: "Years of Excellence (Since 1984)"
  }
]

export function WhyUsSection() {
  return (
    <section className="py-16 md:py-20 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }} />
      </div>
      
      {/* Subtle gradient accents */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gold-200/5 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-200/3 rounded-full blur-3xl opacity-30" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <ScrollAnimate animation="fade-in-up">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-[#1a1a1a]">
                Why Us?
              </h2>
              <p className="text-lg md:text-xl text-[#404040] max-w-3xl mx-auto leading-relaxed">
                Welcome to a New Standard of Bed Linen Excellence. At Whitlin, we deliver hotel-quality bed linen designed for 
                comfort, durability, and elegance. Trusted by top hotels across the UAE, our products are made to elevate guest 
                experiences and simplify operations - with premium quality you can feel, and performance you can rely on. All our 
                Bath & Bed Linen Products Are Crafted Out of 100% Virgin Cotton Long Staple Yarn Producing plush Extreme softness 
                of Dove Feather Standard & Highly Absorbent.
              </p>
            </div>
          </ScrollAnimate>

          {/* Stats Grid */}
          <div className="mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat, index) => (
                <ScrollAnimate key={index} animation="scale-in" delay={index * 100}>
                  <div className="h-full flex flex-col bg-white p-6 rounded-lg border border-border text-center hover:bg-muted transition-all duration-300 hover-lift hover:border-secondary/40 relative overflow-hidden group shadow-sm hover:shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10 flex flex-col flex-grow">
                      <div className="w-12 h-12 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <stat.icon className="w-6 h-6 text-primary group-hover:text-secondary group-hover:scale-110 transition-all duration-300 icon-rotate-360" />
                      </div>
                      <div className="text-3xl md:text-4xl font-bold text-navy-900 mb-2 group-hover:scale-110 transition-transform duration-300">
                        {stat.value}
                      </div>
                      <div className="text-sm md:text-base text-[#404040] flex-grow">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </ScrollAnimate>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <ScrollAnimate animation="fade-in-up" delay={400}>
            <div className="text-center">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-navy-600 hover:to-navy-600/90 text-white font-bold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
                >
                  Shop Now!
                </Button>
              </Link>
            </div>
          </ScrollAnimate>
        </div>
      </div>
    </section>
  )
}

