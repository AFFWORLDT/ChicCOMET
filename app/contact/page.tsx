"use client"

import React from "react"
import { useState } from "react"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollAnimate } from "@/components/scroll-animate"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Loader2,
  ExternalLink
} from "lucide-react"
import { toast } from "sonner"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          source: 'contact-form',
          pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Message sent successfully! We'll get back to you soon.")
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        throw new Error(data.error || 'Failed to send message')
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const { ref: heroRef, isVisible: heroAnimate } = useScrollAnimation({ threshold: 0.1 });

  return (
    <div className="min-h-screen page-entrance">
      
      <main>
        {/* Hero Section */}
        <section ref={heroRef} className={`bg-gradient-to-br from-amber-50 to-orange-50 py-12 sm:py-16 md:py-20 ${heroAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700`}>
          <div className="container mx-auto px-3 sm:px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-3 sm:mb-4 bg-secondary text-navy-900 hover:bg-secondary/80 font-semibold text-xs sm:text-sm">
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Get in Touch
              </Badge>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 mb-4 sm:mb-6">
                We'd Love to 
                <span className="text-secondary"> Hear from You</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-[#404040] mb-6 sm:mb-8 leading-relaxed px-2">
                Have questions about our hospitality linen products? Need help with your order? 
                Our customer support team is here to help you every step of the way.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8 mb-16 items-stretch">
                <ScrollAnimate animation="scale-in" delay={0.1}>
                  <Card className="h-full flex flex-col text-center p-8 hover:shadow-2xl transition-all duration-700 hover-lift card-premium-hover group">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <CardContent className="p-0 flex flex-col flex-grow relative z-10">
                      <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                        <Mail className="w-8 h-8 text-navy-900 group-hover:rotate-360 transition-transform duration-700 ease-in-out" />
                      </div>
                      <h3 className="text-2xl font-bold text-navy-900 mb-4 group-hover:text-secondary transition-all duration-500 group-hover:scale-105">Email Us</h3>
                      <p className="text-[#404040] mb-4 flex-grow group-hover:text-[#262626] transition-all duration-500">
                        Send us an email and we'll respond within 24 hours
                      </p>
                      <a 
                        href="mailto:info@whitlin.com" 
                        className="text-secondary font-medium hover:text-secondary/80 transition-all duration-500 hover:scale-110 inline-block nav-link-premium"
                      >
                        info@whitlin.com
                      </a>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="scale-in" delay={0.2}>
                  <Card className="h-full flex flex-col text-center p-8 hover:shadow-2xl transition-all duration-700 hover-lift card-premium-hover group">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <CardContent className="p-0 flex flex-col flex-grow relative z-10">
                      <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                        <Phone className="w-8 h-8 text-navy-900 group-hover:rotate-360 transition-transform duration-700 ease-in-out" />
                      </div>
                      <h3 className="text-2xl font-bold text-navy-900 mb-4 group-hover:text-secondary transition-all duration-500 group-hover:scale-105">Call Us</h3>
                      <p className="text-[#404040] mb-4 flex-grow group-hover:text-[#262626] transition-all duration-500">
                        Speak directly with our customer support team
                      </p>
                      <div className="space-y-1">
                          <a 
                            href="tel:+971544389849" 
                            className="block text-secondary font-medium hover:text-secondary/80 transition-all duration-500 hover:scale-110 hover:translate-x-2 nav-link-premium"
                          >
                            +971 54 438 9849
                          </a>
                          <a 
                            href="tel:+971503961541" 
                            className="block text-secondary font-medium hover:text-secondary/80 transition-all duration-500 hover:scale-110 hover:translate-x-2 nav-link-premium"
                          >
                            +971 50 396 1541
                          </a>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="scale-in" delay={0.3}>
                  <Card className="h-full flex flex-col text-center p-8 hover:shadow-2xl transition-all duration-700 hover-lift card-premium-hover group">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <CardContent className="p-0 flex flex-col flex-grow relative z-10">
                      <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                        <MapPin className="w-8 h-8 text-navy-900 group-hover:rotate-360 transition-transform duration-700 ease-in-out" />
                      </div>
                      <h3 className="text-2xl font-bold text-navy-900 mb-4 group-hover:text-secondary transition-all duration-500 group-hover:scale-105">Visit Us</h3>
                      <p className="text-[#404040] mb-4 flex-grow group-hover:text-[#262626] transition-all duration-500">
                        Our headquarters and customer service center
                      </p>
                      <a 
                        href="https://maps.app.goo.gl/Q5CVsPpM9eMm7GMc7?g_st=aw" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-secondary font-medium not-italic group-hover:text-secondary/80 transition-all duration-500 hover:underline inline-block"
                      >
                        <address className="not-italic">
                          Al Ittihad Road<br />
                          Dubai, United Arab Emirates
                          <ExternalLink className="w-3 h-3 ml-1 inline opacity-70" />
                        </address>
                      </a>
                    </CardContent>
                  </Card>
                </ScrollAnimate>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <ScrollAnimate animation="slide-in-left" delay={0.1}>
                  <Card className="p-8 hover-lift">
                  <CardHeader>
                    <CardTitle className="text-3xl font-bold text-[#262626]">
                      Send us a Message
                    </CardTitle>
                    <p className="text-[#404040]">
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
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                          Message *
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell us how we can help you..."
                          rows={6}
                          className="w-full"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full bg-secondary hover:bg-secondary/90 text-navy-900 transition-all duration-500 hover:scale-105 hover:shadow-2xl button-premium hover-scale-premium"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 spinner-premium" />
                            Sending Message...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
                </ScrollAnimate>

                {/* Contact Information & Hours */}
                <ScrollAnimate animation="slide-in-right" delay={0.2}>
                  <div className="space-y-8">
                  <Card className="p-8">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-navy-900 flex items-center">
                        <Clock className="w-6 h-6 mr-3 text-secondary" />
                        Business Hours
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-700">Monday - Friday</span>
                          <span className="text-[#404040]">9:00 AM - 6:00 PM GST</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-700">Saturday</span>
                          <span className="text-[#404040]">10:00 AM - 4:00 PM GST</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="font-medium text-gray-700">Sunday</span>
                          <span className="text-[#404040]">Closed</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-8">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-[#262626]">
                        Follow Us
                      </CardTitle>
                      <p className="text-[#404040]">
                        Stay connected and get the latest updates
                      </p>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="flex flex-wrap gap-3">
                        <a 
                          href="https://www.instagram.com/whitlintrading/?igsh=MTBlcTZ1ZXd6N2V5dg%3D%3D#" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                          title="Follow us on Instagram"
                        >
                          <Instagram className="w-6 h-6" />
                        </a>
                        <a 
                          href="https://www.threads.com/@whitlintrading" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                          title="Follow us on TikTok"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 512 512"><path d="M105 0h302c57.75 0 105 47.25 105 105v302c0 57.75-47.25 105-105 105H105C47.25 512 0 464.75 0 407V105C0 47.25 47.25 0 105 0z"/><path fill="#fff" fillRule="nonzero" d="M337.36 243.58c-1.46-.7-2.95-1.38-4.46-2.02-2.62-48.36-29.04-76.05-73.41-76.33-25.6-.17-48.52 10.27-62.8 31.94l24.4 16.74c10.15-15.4 26.08-18.68 37.81-18.68h.4c14.61.09 25.64 4.34 32.77 12.62 5.19 6.04 8.67 14.37 10.39 24.89-12.96-2.2-26.96-2.88-41.94-2.02-42.18 2.43-69.3 27.03-67.48 61.21.92 17.35 9.56 32.26 24.32 42.01 12.48 8.24 28.56 12.27 45.26 11.35 22.07-1.2 39.37-9.62 51.45-25.01 9.17-11.69 14.97-26.84 17.53-45.92 10.51 6.34 18.3 14.69 22.61 24.73 7.31 17.06 7.74 45.1-15.14 67.96-20.04 20.03-44.14 28.69-80.55 28.96-40.4-.3-70.95-13.26-90.81-38.51-18.6-23.64-28.21-57.79-28.57-101.5.36-43.71 9.97-77.86 28.57-101.5 19.86-25.25 50.41-38.21 90.81-38.51 40.68.3 71.76 13.32 92.39 38.69 10.11 12.44 17.73 28.09 22.76 46.33l28.59-7.63c-6.09-22.45-15.67-41.8-28.72-57.85-26.44-32.53-65.1-49.19-114.92-49.54h-.2c-49.72.35-87.96 17.08-113.64 49.73-22.86 29.05-34.65 69.48-35.04 120.16v.24c.39 50.68 12.18 91.11 35.04 120.16 25.68 32.65 63.92 49.39 113.64 49.73h.2c44.2-.31 75.36-11.88 101.03-37.53 33.58-33.55 32.57-75.6 21.5-101.42-7.94-18.51-23.08-33.55-43.79-43.48zm-76.32 71.76c-18.48 1.04-37.69-7.26-38.64-25.03-.7-13.18 9.38-27.89 39.78-29.64 3.48-.2 6.9-.3 10.25-.3 11.04 0 21.37 1.07 30.76 3.13-3.5 43.74-24.04 50.84-42.15 51.84z"/></svg>
                        </a>
                        <a 
                          href="https://www.youtube.com/@WHITLINTRADING" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                          title="Follow us on YouTube"
                        >
                          <Youtube className="w-6 h-6" />
                        </a>
                        <a 
                          href="https://www.facebook.com/WhitlinTrading/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                          title="Follow us on Facebook"
                        >
                          <Facebook className="w-6 h-6" />
                        </a>
                        <a 
                          href="https://x.com/whitlintrading" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                          title="Follow us on X (Twitter)"
                        >
                          <Twitter className="w-6 h-6" />
                        </a>
                      </div>
                      <p className="text-xs text-[#404040] mt-4">
                        Visit our <a href="https://linktr.ee/WhitlinTrading" target="_blank" rel="noopener noreferrer" className="text-[#4e6a9a] hover:underline">Linktree</a> for all social media links
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="p-8 bg-gradient-to-br from-amber-50 to-orange-50">
                    <CardContent className="p-0">
                      <h3 className="text-xl font-bold text-[#262626] mb-4">
                        Need Immediate Help?
                      </h3>
                      <p className="text-[#404040] mb-6">
                        For urgent inquiries or order issues, please call our customer service line.
                      </p>
                      <Button className="w-full bg-secondary hover:bg-secondary/90 text-navy-900">
                        <Phone className="w-5 h-5 mr-2" />
                        Call Now: +971 45 754 785
                      </Button>
                    </CardContent>
                  </Card>
                  </div>
                </ScrollAnimate>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-secondary text-navy-900 font-semibold">
                  Quick Answers
                </Badge>
                <h2 className="text-4xl font-bold text-[#262626] mb-6">
                  Frequently Asked Questions
                </h2>
                <p className="text-xl text-[#404040]">
                  Find quick answers to common questions
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 items-stretch max-w-3xl mx-auto">
                <ScrollAnimate animation="fade-in-up" delay={0.1}>
                  <Card className="h-full flex flex-col p-6 hover-lift">
                    <CardContent className="p-0 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-[#262626] mb-3">
                        Branding is simply a more efficient way to sell things?
                      </h3>
                      <p className="text-[#404040] flex-grow">
                        Lorem ipsum dolor sit amet, consectetur a elit. In ut ullamcorper leo, eget euismod orci. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus musbulum ultricies aliquam convallis. Maecenas ut tellus mi. Proin tincidunt, lectus eu volutpat mattis, ante metus lacinia tellus, vitae condimentum nulla enim bibendum nibh. Praesent turpis risus, interdum nec venenatis id, pretium sit amet purus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam eu lorem nibh. Mauris ex dolor, rutrum in odio vel, suscipit ultrices nunc. Cras ipsum dolor, eleifend et nisl vel, tempor molestie nibh. In hac habitasse platea dictumst. Proin nec blandit ligula.
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="fade-in-up" delay={0.2}>
                  <Card className="h-full flex flex-col p-6">
                    <CardContent className="p-0 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-[#262626] mb-3">
                        It's better to be first in the mind than to be first in the marketplace?
                      </h3>
                      <p className="text-[#404040] flex-grow">
                        Lorem ipsum dolor sit amet, consectetur a elit. In ut ullamcorper leo, eget euismod orci. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus musbulum ultricies aliquam convallis. Maecenas ut tellus mi. Proin tincidunt, lectus eu volutpat mattis, ante metus lacini.
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="fade-in-up" delay={0.3}>
                  <Card className="h-full flex flex-col p-6">
                    <CardContent className="p-0 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-[#262626] mb-3">
                        Marketing is a company's ultimate objective?
                      </h3>
                      <p className="text-[#404040] flex-grow">
                        Lorem ipsum dolor sit amet, consectetur a elit. In ut ullamcorper leo, eget euismod orci. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus musbulum ultricies aliquam convallis. Maecenas ut tellus mi. Proin tincidunt, lectus eu volutpat mattis, ante metus lacinia tellus, vitae condimentum nulla enim bibendum nibh. Praesent turpis risus, interdum nec venenatis id, pretium sit amet purus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam eu lorem nibh. Mauris ex dolor, rutrum in odio vel, suscipit ultrices nunc. Cras ipsum dolor, eleifend et nisl vel, tempor molestie nibh. In hac habitasse platea dictumst. Proin nec blandit ligula.
                      </p>
                    </CardContent>
                  </Card>
                </ScrollAnimate>

                <ScrollAnimate animation="fade-in-up" delay={0.4}>
                  <Card className="h-full flex flex-col p-6">
                    <CardContent className="p-0 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-[#262626] mb-3">
                        Positioning is what you do to the mind of the prospect?
                      </h3>
                      <p className="text-[#404040] flex-grow">
                        Lorem ipsum dolor sit amet, consectetur a elit. In ut ullamcorper leo, eget euismod orci. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus musbulum ultricies aliquam convallis. Maecenas ut tellus mi. Proin tincidunt, lectus eu volutpat mattis, ante metus lacinia tellus, vitae condimentum nulla enim bibendum nibh. Praesent turpis risus, interdum nec venenatis id, pretium sit amet purus. Interdum et malesuada fames ac ante.
                      </p>
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
