"use client"

import { useState } from "react"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  HelpCircle,
  BookOpen,
  Video,
  FileText,
  Users,
  Send,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "medium"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success("Support ticket created successfully! We'll get back to you soon.")
      setFormData({ name: "", email: "", subject: "", message: "", priority: "medium" })
    } catch (error) {
      toast.error("Failed to create support ticket. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-200">
                <HelpCircle className="w-4 h-4 mr-2" />
                Customer Support
              </Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                We're Here to 
                <span className="text-amber-600"> Help You</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Our dedicated support team is ready to assist you with any questions, concerns, 
                or issues you may have. Get help quickly and easily.
              </p>
            </div>
          </div>
        </section>

        {/* Support Options */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  How Can We Help You?
                </h2>
                <p className="text-xl text-gray-600">
                  Choose the support option that works best for you
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MessageCircle className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Live Chat</h3>
                    <p className="text-gray-600 mb-6">
                      Chat with our support team in real-time for instant help
                    </p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Available now</span>
                      </div>
                      <p className="text-sm text-gray-500">Average response: 2 minutes</p>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Start Chat
                    </Button>
                  </CardContent>
                </Card>

                <Card className="p-8 text-center hover:shadow-lg transition-shadow border-2 border-amber-200">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Phone className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Phone Support</h3>
                    <p className="text-gray-600 mb-6">
                      Speak directly with our customer support team
                    </p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Sun-Thu 9AM-6PM GST</span>
                      </div>
                      <p className="text-sm text-gray-500">Fri 10AM-4PM GST</p>
                    </div>
                    <Button className="w-full bg-amber-600 hover:bg-amber-700">
                      Call +971 45 754 785
                    </Button>
                  </CardContent>
                </Card>

                <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Mail className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Email Support</h3>
                    <p className="text-gray-600 mb-6">
                      Send us an email and we'll respond within 24 hours
                    </p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">24/7 available</span>
                      </div>
                      <p className="text-sm text-gray-500">Response within 24 hours</p>
                    </div>
                    <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                      Send Email
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Help Center */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Help Center
                </h2>
                <p className="text-xl text-gray-600">
                  Find answers and resources to help you get the most out of your products
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link href="/faq">
                  <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HelpCircle className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">FAQ</h3>
                      <p className="text-sm text-gray-600">
                        Find answers to common questions
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/shipping">
                  <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-0">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Shipping Info</h3>
                      <p className="text-sm text-gray-600">
                        Delivery times and shipping options
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/returns">
                  <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-0">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Returns</h3>
                      <p className="text-sm text-gray-600">
                        Return policy and process
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Video className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Video Tutorials</h3>
                    <p className="text-sm text-gray-600">
                      Step-by-step product guides
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Send Us a Message
                </h2>
                <p className="text-xl text-gray-600">
                  Can't find what you're looking for? Send us a message and we'll help you out.
                </p>
              </div>

              <Card className="p-8">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Create Support Ticket
                  </CardTitle>
                  <p className="text-gray-600">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </CardHeader>
                <CardContent className="p-0">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                          Subject *
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="What's this about?"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                          Priority
                        </label>
                        <select
                          id="priority"
                          name="priority"
                          value={formData.priority}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Please describe your issue or question in detail..."
                        rows={6}
                        className="w-full"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-amber-600 hover:bg-amber-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Creating Ticket...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Create Support Ticket
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Support Team */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Meet Our Support Team
                </h2>
                <p className="text-xl text-gray-600">
                  Our experienced team is here to provide you with the best possible support
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <Users className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Customer Success</h3>
                    <p className="text-gray-600 mb-4">
                      Our customer success team helps you get the most out of your products and ensures your complete satisfaction.
                    </p>
                    <Badge className="bg-blue-100 text-blue-800">
                      Product Experts
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <MessageCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Technical Support</h3>
                    <p className="text-gray-600 mb-4">
                      Our technical support team can help with product usage, troubleshooting, and technical questions.
                    </p>
                    <Badge className="bg-green-100 text-green-800">
                      Technical Experts
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <Phone className="w-10 h-10 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Order Support</h3>
                    <p className="text-gray-600 mb-4">
                      Our order support team handles shipping, returns, exchanges, and billing questions.
                    </p>
                    <Badge className="bg-purple-100 text-purple-800">
                      Order Experts
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
