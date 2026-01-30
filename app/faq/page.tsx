"use client"

import { useState, useMemo } from "react"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollAnimate } from "@/components/scroll-animate"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Search,
  MessageCircle,
  Phone,
  Mail
} from "lucide-react"

import { faqDataPart1 } from "@/lib/faq-data-part1"
import { faqDataPart2 } from "@/lib/faq-data-part2"
import { faqDataPart3 } from "@/lib/faq-data-part3"
import { faqDataPart4 } from "@/lib/faq-data-part4"
import { faqDataPart5 } from "@/lib/faq-data-part5"

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

// Combine FAQ data at module level
const allFAQData: FAQItem[] = [
  ...faqDataPart1,
  ...faqDataPart2,
  ...faqDataPart3,
  ...faqDataPart4,
  ...faqDataPart5
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const faqData = allFAQData

  // Extract unique categories
  const categories = useMemo(() => {
    const categorySet = new Set<string>()
    faqData.forEach((faq) => categorySet.add(faq.category))
    const sortedCats = Array.from(categorySet).sort()
    return ["All", ...sortedCats]
  }, [faqData])

  // Global search - searches through both questions and answers across all FAQs
  const filteredFAQs = useMemo(() => {
    return faqData.filter(faq => {
      const searchLower = searchTerm.toLowerCase().trim()
      const matchesSearch = searchLower === "" || 
                           faq.question.toLowerCase().includes(searchLower) ||
                           faq.answer.toLowerCase().includes(searchLower)
      const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [faqData, searchTerm, selectedCategory])

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const { ref: heroRef, isVisible: heroAnimate } = useScrollAnimation({ threshold: 0.1 });

  return (
    <div className="min-h-screen page-entrance">
      
      <main>
        {/* Hero Section */}
        <section ref={heroRef} className={`bg-gradient-to-br from-amber-50 to-orange-50 py-20 ${heroAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700`}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-[#e1d7c6] text-[#171717] hover:bg-[#d4c7b3] font-semibold">
                <HelpCircle className="w-4 h-4 mr-2" />
                Frequently Asked Questions
              </Badge>
              <h1 className="text-5xl font-bold text-[#262626] mb-6">
                Find Answers to 
                <span className="text-[#e1d7c6]"> Your Questions</span>
              </h1>
              <p className="text-xl text-[#404040] mb-8 leading-relaxed">
                Get quick answers to {allFAQData.length}+ frequently asked questions about our hospitality linen products, 
                specifications, shipping, care, orders, and more. Can't find what you're looking for? Contact our support team.
              </p>
            </div>
          </div>
        </section>

        {/* Global Search */}
        <section className="py-8 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#737373] w-5 h-5 z-10" />
                <Input
                  placeholder={`Search all ${allFAQData.length} FAQs by question or answer...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg border-2 border-gray-200 focus:border-[#e1d7c6] rounded-lg"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#737373] hover:text-[#262626]"
                  >
                    ✕
                  </button>
                )}
              </div>
              {searchTerm && (
                <p className="mt-3 text-sm text-[#737373]">
                  Found {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} for "{searchTerm}"
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="py-4 bg-gray-50 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <span className="text-sm font-semibold text-[#404040] whitespace-nowrap">Filter by:</span>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-[#e1d7c6] hover:bg-[#d4c7b3] text-[#262626] whitespace-nowrap" : "whitespace-nowrap"}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Items */}
        <section className="py-8 bg-[#fafafa]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {filteredFAQs.length === 0 ? (
                <Card className="p-6 text-center">
                  <CardContent className="p-0">
                    <HelpCircle className="w-12 h-12 text-[#737373] mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-[#262626] mb-2">No FAQs Found</h3>
                    <p className="text-[#404040] mb-4 text-sm">
                      We couldn't find any FAQs matching your search. Try different keywords or browse all categories.
                    </p>
                    <Button 
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedCategory("All")
                      }}
                      size="sm"
                      className="bg-[#e1d7c6] hover:bg-[#d4c7b3] text-[#262626]"
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {filteredFAQs.map((faq, index) => (
                    <ScrollAnimate key={faq.id} animation="fade-in-up" delay={index * 0.02}>
                      <Card className="hover:shadow-sm transition-all hover-lift border border-gray-200">
                        <CardContent className="p-0">
                          <button
                            onClick={() => toggleExpanded(faq.id)}
                            className="w-full p-4 text-left flex items-start justify-between hover:bg-gray-50 transition-colors gap-3"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5">
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 h-5">
                                  {faq.category}
                                </Badge>
                              </div>
                              <h3 className="text-sm font-semibold text-[#262626] leading-snug pr-2">
                                {faq.question}
                              </h3>
                            </div>
                            <div className="flex-shrink-0 mt-1">
                              {expandedItems.includes(faq.id) ? (
                                <ChevronUp className="w-4 h-4 text-[#737373]" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-[#737373]" />
                              )}
                            </div>
                          </button>
                          {expandedItems.includes(faq.id) && (
                            <div className="px-4 pb-4">
                              <div className="border-t border-gray-100 pt-3">
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {faq.answer}
                                </p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </ScrollAnimate>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-[#262626] mb-6">
                  Still Have Questions?
                </h2>
                <p className="text-xl text-[#404040]">
                  Our customer support team is here to help you
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <ScrollAnimate animation="scale-in" delay={0.1}>
                  <Card className="p-8 text-center hover:shadow-lg transition-shadow hover-lift">
                    <CardContent className="p-0">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageCircle className="w-8 h-8 text-[#e1d7c6]" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#262626] mb-4">Live Chat</h3>
                      <p className="text-[#404040] mb-6">
                        Chat with our support team in real-time for instant help
                      </p>
                      <Button className="bg-[#e1d7c6] hover:bg-[#d4c7b3] text-[#262626]">
                        Start Chat
                      </Button>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="scale-in" delay={0.2}>
                  <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-8 h-8 text-[#e1d7c6]" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#262626] mb-4">Email Support</h3>
                      <p className="text-[#404040] mb-6">
                        Send us an email and we'll respond within 24 hours
                      </p>
                      <Button variant="outline" className="border-amber-600 text-[#e1d7c6] hover:bg-amber-50">
                        Send Email
                      </Button>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="scale-in" delay={0.3}>
                  <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Phone className="w-8 h-8 text-[#e1d7c6]" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#262626] mb-4">Phone Support</h3>
                      <p className="text-[#404040] mb-6">
                        Call us directly for immediate assistance
                      </p>
                      <Button variant="outline" className="border-amber-600 text-[#e1d7c6] hover:bg-amber-50">
                        Call Now
                      </Button>
                    </CardContent>
                  </Card>
                </ScrollAnimate>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
