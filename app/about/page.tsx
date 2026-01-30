"use client"

import React from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollAnimate } from "@/components/scroll-animate"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import HeroSlider from "@/components/hero-slider"
import { 
  Heart, 
  Award, 
  Users, 
  Target, 
  Star, 
  Shield, 
  Leaf, 
  Sparkles,
  CheckCircle,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import { GlobalPresenceSection } from "@/components/global-presence-section"
import { HeritageSection } from "@/components/heritage-section"

export default function AboutPage() {
  const { ref: heroRef, isVisible: heroAnimate } = useScrollAnimation({ threshold: 0.1 });
  
  return (
    <div className="min-h-screen page-entrance">
      {/* Hero Carousel Section */}
      {/* <HeroSlider /> */}

      {/* Hero Section */}
        <section ref={heroRef} className={`bg-gradient-to-br from-[#f8f6f3] to-[#f0ebe4] py-12 sm:py-16 md:py-20 ${heroAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700`}>
          <div className="container mx-auto px-3 sm:px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-3 sm:mb-4 bg-[#e1d7c6] text-[#171717] hover:bg-[#d4c7b3] font-semibold text-xs sm:text-sm">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                About Whitlin
              </Badge>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#262626] mb-4 sm:mb-6">
                WHITLIN L.L.C- FZ
                <span className="text-[#e1d7c6] block text-xl sm:text-2xl md:text-3xl mt-1 sm:mt-2">Trusted Linen Excellence Since 1984</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-[#404040] mb-6 sm:mb-8 leading-relaxed px-2">
                Discover premium-quality linen crafted with care and expertise. From luxurious duvets, bed sheets, and duvet covers 
                to plush towels and more - Whitlin has been delivering comfort, style, and durability for over four decades around 
                the globe. We proudly serve both <strong>B2B and B2C markets</strong>, partnering with leading hotels, corporate clients, 
                and individual customers across the region. Experience the Whitlin standard - where quality meets elegance.
              </p>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm border border-[#e5e5e5]">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-[#262626]" />
                  <span className="font-medium text-xs sm:text-sm md:text-base text-[#262626]">Premium Quality</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm border border-[#e5e5e5]">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#262626]" />
                  <span className="font-medium text-xs sm:text-sm md:text-base text-[#262626]">100% Organic Cotton</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm border border-[#e5e5e5]">
                  <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-[#262626]" />
                  <span className="font-medium text-xs sm:text-sm md:text-base text-[#262626]">Hospitality Grade</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
                <ScrollAnimate animation="fade-in-up" delay={0.1}>
                  <div>
                    <Badge className="mb-3 sm:mb-4 bg-[#e1d7c6] text-[#171717] font-semibold text-xs sm:text-sm">
                      Our Story
                    </Badge>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#262626] mb-4 sm:mb-6">
                      Excellence in Hospitality Linen
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg text-[#404040] mb-4 sm:mb-6 leading-relaxed">
                      All our Bath & Bed Linen Products Are Crafted Out of 100% Virgin Cotton Long Staple Yarn Producing plush Extreme 
                      softness of Dove Feather Standard & Highly Absorbent Keeping us on the top amongst our Competition Globally. 
                      After Sale Support Services Are one & Only One Globally. Customer Care Team Visit Every Six Months Properties We Supply.
                    </p>
                    <p className="text-sm sm:text-base md:text-lg text-[#404040] mb-4 sm:mb-6 leading-relaxed">
                      We are the Only One Manufacturer Exporter of Hospitality Linen Who Provide Govt. (App.) test Lab report Confirming 
                      Contents & Quality Parameters we Commit & Supply. With a Strong Global distribution Network, we have warehouses, 
                      manufacturing facilities, headquarters and marketing offices.
                    </p>
                    <p className="text-sm sm:text-base md:text-lg text-[#404040] mb-6 sm:mb-8 leading-relaxed">
                      We proudly serve both <strong>B2B and B2C markets</strong>, partnering with leading hotels, corporate clients, 
                      and individual customers across the region. Experience the Whitlin standard - where quality meets elegance.
                    </p>
                    <div className="flex flex-wrap gap-2 sm:gap-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#737373] flex-shrink-0" />
                        <span className="text-xs sm:text-sm md:text-base text-[#262626]">40+ Years Experience (Since 1984)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#737373] flex-shrink-0" />
                        <span className="text-xs sm:text-sm md:text-base text-[#262626]">7,000+ Clients Worldwide</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#737373] flex-shrink-0" />
                        <span className="text-xs sm:text-sm md:text-base text-[#262626]">Global Distribution Network</span>
                      </div>
                    </div>
                  </div>
                </ScrollAnimate>
                <ScrollAnimate animation="fade-in-up" delay={0.2}>
                  <div className="relative">
                    <div className="bg-gradient-to-br from-[#f8f6f3] to-[#f0ebe4] rounded-2xl p-4 sm:p-6 md:p-8 border border-[#e5e5e5]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-stretch">
                        <Card className="h-full flex flex-col bg-white/90 backdrop-blur-sm border border-[#e5e5e5]">
                          <CardContent className="p-4 sm:p-6 text-center flex flex-col flex-grow">
                            <Award className="w-10 h-10 sm:w-12 sm:h-12 text-[#262626] mx-auto mb-3 sm:mb-4" />
                            <h3 className="font-bold text-base sm:text-lg mb-2 text-[#262626]">Award Winning</h3>
                            <p className="text-xs sm:text-sm text-[#404040] flex-grow">Premium Hospitality Linen</p>
                          </CardContent>
                        </Card>
                        <Card className="h-full flex flex-col bg-white/90 backdrop-blur-sm border border-[#e5e5e5]">
                          <CardContent className="p-4 sm:p-6 text-center flex flex-col flex-grow">
                            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-[#262626] mx-auto mb-3 sm:mb-4" />
                            <h3 className="font-bold text-base sm:text-lg mb-2 text-[#262626]">7,000+</h3>
                            <p className="text-xs sm:text-sm text-[#404040] flex-grow">Clients Worldwide</p>
                          </CardContent>
                        </Card>
                        <Card className="h-full flex flex-col bg-white/90 backdrop-blur-sm border border-[#e5e5e5]">
                          <CardContent className="p-4 sm:p-6 text-center flex flex-col flex-grow">
                            <Star className="w-10 h-10 sm:w-12 sm:h-12 text-[#262626] mx-auto mb-3 sm:mb-4" />
                            <h3 className="font-bold text-base sm:text-lg mb-2 text-[#262626]">4.9/5</h3>
                            <p className="text-xs sm:text-sm text-[#404040] flex-grow">Customer Rating</p>
                          </CardContent>
                        </Card>
                        <Card className="h-full flex flex-col bg-white/90 backdrop-blur-sm border border-[#e5e5e5]">
                          <CardContent className="p-4 sm:p-6 text-center flex flex-col flex-grow">
                            <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-[#262626] mx-auto mb-3 sm:mb-4" />
                            <h3 className="font-bold text-base sm:text-lg mb-2 text-[#262626]">100%</h3>
                            <p className="text-xs sm:text-sm text-[#404040] flex-grow">Satisfaction Guarantee</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </ScrollAnimate>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-20 bg-[#fafafa]">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ScrollAnimate animation="fade-in-up" delay={0.1}>
                <div className="text-center mb-16">
                  <Badge className="mb-4 bg-[#e1d7c6] text-[#262626]">
                    Our Mission
                  </Badge>
                  <h2 className="text-4xl font-bold text-[#262626] mb-6">
                    Why Whitlin?
                  </h2>
                  <p className="text-xl text-[#404040] max-w-3xl mx-auto">
                    Our commitment to excellence drives everything we do, from our vision to our core values.
                  </p>
                </div>
              </ScrollAnimate>

              <div className="grid md:grid-cols-3 gap-8 items-stretch">
                <ScrollAnimate animation="scale-in" delay={0.1}>
                  <Card className="h-full flex flex-col text-center p-8 hover:shadow-xl transition-all duration-300 hover-lift bg-gradient-to-br from-white to-[#f8f6f3] border border-[#e5e5e5]">
                    <CardContent className="p-0 flex flex-col flex-grow">
                      <div className="w-16 h-16 bg-[#e1d7c6] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                        <Sparkles className="w-8 h-8 text-[#262626] icon-rotate-360" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#262626] mb-4">Our Vision</h3>
                      <p className="text-[#404040] leading-relaxed flex-grow">
                        To be the world's most trusted and innovative linen brand, setting the benchmark for luxury, 
                        sustainability, and reliability in every space we touch — from five-star hotels to modern homes 
                        while enriching lives with comfort, elegance, and timeless quality.
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="scale-in" delay={0.2}>
                  <Card className="h-full flex flex-col text-center p-8 hover:shadow-xl transition-all duration-300 hover-lift bg-gradient-to-br from-white to-[#f8f6f3] border border-[#e5e5e5]">
                    <CardContent className="p-0 flex flex-col flex-grow">
                      <div className="w-16 h-16 bg-[#e1d7c6] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                        <Target className="w-8 h-8 text-[#262626] icon-rotate-360" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#262626] mb-4">Our Mission</h3>
                      <p className="text-[#404040] leading-relaxed flex-grow">
                        To deliver premium sustainable linen that blends luxury and durability serving hospitality 
                        and homes with comfort, elegance and trust.
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="scale-in" delay={0.3}>
                  <Card className="h-full flex flex-col text-center p-8 hover:shadow-xl transition-all duration-300 hover-lift bg-gradient-to-br from-white to-[#f8f6f3] border border-[#e5e5e5]">
                    <CardContent className="p-0 flex flex-col flex-grow">
                      <div className="w-16 h-16 bg-[#e1d7c6] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                        <Heart className="w-8 h-8 text-[#262626] icon-rotate-360" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#262626] mb-4">Core Values</h3>
                      <div className="text-[#404040] leading-relaxed text-left space-y-2 flex-grow">
                        <p><strong>Quality</strong> – Uncompromising excellence in product.</p>
                        <p><strong>Sustainability</strong> – Eco-friendly and responsible sourcing.</p>
                        <p><strong>Integrity</strong> – Trust and reliability in all relationships.</p>
                        <p><strong>Innovation</strong> – Modern solutions for evolving needs.</p>
                        <p><strong>Customer Focus</strong> – Comfort and satisfaction above all.</p>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollAnimate>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ScrollAnimate animation="fade-in-up" delay={0.1}>
                <div className="text-center mb-16">
                  <Badge className="mb-4 bg-[#e1d7c6] text-[#262626]">
                    Meet Our Team
                  </Badge>
                  <h2 className="text-4xl font-bold text-[#262626] mb-6">
                    Team Behind the Scenes
                  </h2>
                  <p className="text-xl text-[#404040] max-w-3xl mx-auto">
                    Meet the leadership team driving Whitlin's success and innovation in the hospitality linen industry.
                  </p>
                </div>
              </ScrollAnimate>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <ScrollAnimate animation="scale-in" delay={0.1}>
                  <Card className="text-center p-8 hover:shadow-2xl transition-all duration-700 hover-lift bg-gradient-to-br from-white to-amber-50/30 card-premium-hover group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e1d7c6]/0 to-[#e1d7c6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <CardContent className="p-0 relative z-10">
                      <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden shadow-xl border-4 border-[#e1d7c6] group-hover:scale-110 group-hover:rotate-6 group-hover:border-[#d4c7b3] transition-all duration-700 hover-scale-premium">
                        <Image
                          src="/images/team/JITENDER KUMAR SINGLA.png"
                          alt="Jitender Kumar Singla"
                          width={128}
                          height={128}
                          className="w-full h-full object-cover group-hover:scale-125 transition-all duration-1000 image-reveal-premium"
                        />
                      </div>
                      <h3 className="text-2xl font-bold text-[#262626] mb-2 group-hover:text-[#e1d7c6] transition-all duration-500 group-hover:scale-105">JITENDER KUMAR SINGLA</h3>
                      <p className="text-[#e1d7c6] font-semibold mb-4 text-lg group-hover:scale-110 transition-all duration-500">CHAIRMAN</p>
                      <p className="text-[#404040] leading-relaxed group-hover:text-[#262626] transition-all duration-500">
                        Leading Whitlin with strategic vision and decades of industry expertise, 
                        ensuring our commitment to excellence and innovation.
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="scale-in" delay={0.2}>
                  <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover-lift bg-gradient-to-br from-white to-amber-50/30">
                    <CardContent className="p-0">
                      <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden shadow-lg border-4 border-[#e1d7c6]">
                        <Image
                          src="/images/team/VIJAY KUMAR SAINI.png"
                          alt="Vijay Kumar Saini"
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-2xl font-bold text-[#262626] mb-2">VIJAY KUMAR SAINI</h3>
                      <p className="text-[#e1d7c6] font-semibold mb-4 text-lg">Chief Executive Officer</p>
                      <p className="text-[#404040] leading-relaxed">
                        Driving operational excellence and strategic growth, ensuring Whitlin 
                        continues to set industry standards in hospitality linen solutions.
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="scale-in" delay={0.3}>
                  <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover-lift bg-gradient-to-br from-white to-amber-50/30">
                    <CardContent className="p-0">
                      <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden shadow-lg border-4 border-[#e1d7c6]">
                        <Image
                          src="/images/team/VAIBHAV SINGLA.png"
                          alt="Vaibhav Singla"
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-2xl font-bold text-[#262626] mb-2">VAIBHAV SINGLA</h3>
                      <p className="text-[#e1d7c6] font-semibold mb-4 text-lg">Managing Director</p>
                      <p className="text-[#404040] leading-relaxed">
                        Overseeing business development and market expansion, building strategic 
                        partnerships with leading hospitality brands worldwide.
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                {/* <ScrollAnimate animation="scale-in" delay={0.4}>
                  <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover-lift bg-gradient-to-br from-white to-amber-50/30">
                    <CardContent className="p-0">
                      <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden shadow-lg border-4 border-[#e1d7c6]">
                        <Image
                          src="/images/team/MD SHIFAT ULLAH.png"
                          alt="Md Shifat Ullah"
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-2xl font-bold text-[#262626] mb-2">MD SHIFAT ULLAH</h3>
                      <p className="text-[#e1d7c6] font-semibold mb-4 text-lg">Chief Operating Officer</p>
                      <p className="text-[#404040] leading-relaxed">
                        Managing day-to-day operations and ensuring seamless execution of our 
                        commitment to quality and customer satisfaction.
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="scale-in" delay={0.5}>
                  <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover-lift bg-gradient-to-br from-white to-amber-50/30">
                    <CardContent className="p-0">
                      <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden shadow-lg border-4 border-[#e1d7c6]">
                        <Image
                          src="/images/team/MARJAN AKTER.png"
                          alt="Marjan Akter"
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-2xl font-bold text-[#262626] mb-2">MARJAN AKTER</h3>
                      <p className="text-[#e1d7c6] font-semibold mb-4 text-lg">Chief Technical Officer</p>
                      <p className="text-[#404040] leading-relaxed">
                        Leading innovation and technology initiatives, ensuring Whitlin stays 
                        at the forefront of textile manufacturing and product development.
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate> */}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ScrollAnimate animation="fade-in-up" delay={0.1}>
                <div className="text-center mb-16">
                  <Badge className="mb-4 bg-[#e1d7c6] text-[#171717] font-semibold">
                    Why Choose Whitlin
                  </Badge>
                  <h2 className="text-4xl font-bold text-[#262626] mb-6">
                    The Whitlin Difference
                  </h2>
                </div>
              </ScrollAnimate>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ScrollAnimate animation="scale-in" delay={0.1}>
                  <Card className="text-center p-6 bg-white/80 backdrop-blur-sm hover-lift">
                    <CardContent className="p-0">
                      <div className="w-12 h-12 bg-[#e1d7c6] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Award className="w-6 h-6 text-[#262626]" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Hospitality Grade</h3>
                      <p className="text-sm text-[#404040]">
                        Premium quality linens for hotels and resorts
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="scale-in" delay={0.2}>
                  <Card className="text-center p-6 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-0">
                      <div className="w-12 h-12 bg-[#e1d7c6] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Leaf className="w-6 h-6 text-[#262626]" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">100% Organic Cotton</h3>
                      <p className="text-sm text-[#404040]">
                        Long staple, single ply organic cotton
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="scale-in" delay={0.3}>
                  <Card className="text-center p-6 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-0">
                      <div className="w-12 h-12 bg-[#e1d7c6] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-6 h-6 text-[#262626]" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Durable & Elegant</h3>
                      <p className="text-sm text-[#404040]">
                        Designed for long-lasting performance and luxury
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="scale-in" delay={0.4}>
                  <Card className="text-center p-6 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-0">
                      <div className="w-12 h-12 bg-[#e1d7c6] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-6 h-6 text-[#262626]" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Customer First</h3>
                      <p className="text-sm text-[#404040]">
                        Dedicated support and satisfaction guarantee
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>
              </div>
            </div>
          </div>
        </section>
<ScrollAnimate animation="rotate-fade-in" delay={300}>
          <GlobalPresenceSection />
        </ScrollAnimate>

           <ScrollAnimate animation="fade-in-up-scale" delay={300}>
          <HeritageSection />
        </ScrollAnimate>
        {/* CTA Section */}
        <section className="py-20 bg-gray-900 text-white">
          <div className="container mx-auto px-4">
            <ScrollAnimate animation="fade-in-up" delay={0.1}>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-6">
                  Ready to Elevate Your Hospitality Experience?
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Join 7,000+ satisfied clients worldwide who trust Whitlin for their premium 
                  hospitality linen needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/products">
                    <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                      Shop Our Products
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#262626]">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollAnimate>
          </div>
        </section>
         
    </div>
  )
}
