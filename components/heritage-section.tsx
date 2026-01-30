"use client"

import { useState, useEffect, useRef } from "react"
import { ScrollAnimate } from "@/components/scroll-animate"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, Calendar, Globe, Heart, Sparkles, TrendingUp, Users, Building2 } from "lucide-react"
import Link from "next/link"

interface TimelineEvent {
  year: string
  title: string
  description: string
  icon: React.ElementType
  color: string
}

const timelineEvents: TimelineEvent[] = [
  {
    year: "1984",
    title: "Foundation",
    description: "WHITLIN L.L.C- FZ was established, beginning our journey in premium hospitality linen manufacturing and export.",
    icon: Building2,
    color: "from-secondary-200 to-secondary-300"
  },
  {
    year: "1990s",
    title: "Global Expansion",
    description: "Expanded our reach across the Middle East, establishing strong partnerships with leading hotels and hospitality chains.",
    icon: Globe,
    color: "from-secondary-300 to-secondary-400"
  },
  {
    year: "2000s",
    title: "Quality Excellence",
    description: "Achieved government certification and became the only manufacturer exporter providing official test lab reports confirming quality parameters.",
    icon: Award,
    color: "from-secondary-400 to-secondary-500"
  },
  {
    year: "2010s",
    title: "Innovation Era",
    description: "Introduced 100% Virgin Cotton Long Staple Yarn products with Dove Feather Standard softness and superior absorbency.",
    icon: Sparkles,
    color: "from-secondary-300 to-secondary-400"
  },
  {
    year: "2020s",
    title: "Digital Transformation",
    description: "Launched comprehensive B2B and B2C platforms, serving hotels, corporate clients, and individual customers worldwide.",
    icon: TrendingUp,
    color: "from-secondary-200 to-secondary-300"
  },
  {
    year: "Today",
    title: "Trusted Excellence",
    description: "40+ years of delivering premium quality linen, trusted by top hotels across the UAE and globally. Customer care team visits every six months.",
    icon: Heart,
    color: "from-secondary-100 to-secondary-200"
  }
]

export function HeritageSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed")
          }
        })
      },
      { threshold: 0.2 }
    )

    const items = timelineRef.current?.querySelectorAll(".timeline-item")
    items?.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-secondary/5 via-white to-secondary/10 relative overflow-hidden ethnic-pattern">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <ScrollAnimate animation="fade-in-up-scale" delay={100}>
          <div className="text-center mb-12 md:mb-16">
            <Badge className="mb-4 bg-secondary text-primary hover:bg-secondary/80 font-semibold text-sm sm:text-base">
              <Award className="w-4 h-4 mr-2" />
              Our Heritage
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-primary">
              40+ Years of Excellence
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From our foundation in 1984 to today, Whitlin has been at the forefront of premium hospitality linen manufacturing, 
              combining traditional craftsmanship with modern innovation.
            </p>
          </div>
        </ScrollAnimate>

        {/* Timeline */}
        <div ref={timelineRef} className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 sm:left-8 md:left-1/2 top-0 bottom-0 w-0.5 sm:w-1 bg-gradient-to-b from-secondary via-secondary-300 to-secondary transform md:-translate-x-1/2" />

            {/* Timeline items */}
            <div className="space-y-8 sm:space-y-12 md:space-y-16">
              {timelineEvents.map((event, index) => {
                const Icon = event.icon
                const isEven = index % 2 === 0
                
                return (
                  <div
                    key={index}
                    className={`timeline-item relative flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6 md:gap-8 ${
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {/* Year badge */}
                    <div className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${event.color} flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-500 z-10 border-4 border-white`}>
                      <span className="font-bold text-xs sm:text-sm md:text-base text-primary">{event.year}</span>
                    </div>

                    {/* Content card */}
                    <div className={`flex-1 bg-white/90 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-border hover:border-secondary/40 card-premium-hover ${
                      isEven ? "md:ml-8" : "md:mr-8"
                    }`}>
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${event.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-500`}>
                          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary icon-rotate-360" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-primary group-hover:text-secondary-600 transition-colors duration-500">
                            {event.title}
                          </h3>
                          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <ScrollAnimate animation="fade-in-up-scale" delay={800}>
          <div className="text-center mt-12 md:mt-16">
            <Link href="/about">
              <Button 
                size="lg" 
                className="bg-secondary hover:bg-secondary/90 text-primary font-semibold px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 text-base sm:text-lg md:text-xl transition-all duration-500 hover:scale-110 active:scale-95 shadow-xl hover:shadow-2xl button-premium hover-scale-premium"
              >
                <Users className="w-5 h-5 mr-2" />
                Learn More About Us
              </Button>
            </Link>
          </div>
        </ScrollAnimate>
      </div>
    </section>
  )
}

