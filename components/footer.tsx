"use client"

import { useState } from "react"
import { useI18n } from "@/components/language-provider"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { Instagram, Facebook, Twitter, Mail, Loader2, Phone, MapPin, Youtube, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)
  const { t } = useI18n()

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      toast.error("Please enter your email address")
      return
    }

    setIsSubscribing(true)

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim(),
          source: 'website'
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Successfully subscribed to our newsletter!")
        setEmail("")
      } else {
        toast.error(data.error || "Failed to subscribe to newsletter")
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <footer className="bg-white text-[#1a1a1a] relative overflow-hidden border-t border-[#e5e5e5] fade-in-premium section-entrance">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-200/50 to-transparent gradient-flow-premium" />
      
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 stagger-container">
          {/* Brand */}
          <div className="space-y-3 sm:space-y-4 hover-scale-premium transition-all duration-500">
            <div className="hover-scale-premium">
            <Logo size="lg" href="/" />
            </div>
            <p className="text-[#404040] text-xs sm:text-sm text-pretty transition-all duration-500 hover:text-[#262626]">
              <strong className="text-[#1a1a1a]">WHITLIN L.L.C- FZ</strong> - Trusted Linen Excellence Since 1984. Premium-quality linen for hotels, corporate clients, and individual customers. Where quality meets elegance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-black transition-all duration-500 hover:text-primary">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-black hover:text-primary transition-all duration-500 text-sm sm:text-base hover:translate-x-2 hover:scale-105 inline-block nav-link-premium">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-black hover:text-primary transition-all duration-500 text-sm sm:text-base hover:translate-x-2 hover:scale-105 inline-block nav-link-premium">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-black hover:text-primary transition-all duration-500 text-sm sm:text-base hover:translate-x-2 hover:scale-105 inline-block nav-link-premium">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-black hover:text-primary transition-all duration-500 text-sm sm:text-base hover:translate-x-2 hover:scale-105 inline-block nav-link-premium">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-serif text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-black">{t('footer.customerCare')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping" className="text-black hover:text-primary transition-all duration-300 text-sm sm:text-base hover:translate-x-1 inline-block">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-black hover:text-primary transition-all duration-300 text-sm sm:text-base hover:translate-x-1 inline-block">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-black hover:text-primary transition-all duration-300 text-sm sm:text-base hover:translate-x-1 inline-block">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-black hover:text-primary transition-all duration-300 text-sm sm:text-base hover:translate-x-1 inline-block">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-serif text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-black">{t('footer.contactUs')}</h3>
            <div className="space-y-3 mb-4 text-xs sm:text-sm text-[#404040]">
              <div>
                <p className="font-semibold mb-2 text-black">Dubai Office:</p>
                <a 
                  href="https://maps.app.goo.gl/Q5CVsPpM9eMm7GMc7?g_st=aw" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start text-black hover:text-[#4e6a9a] transition-colors group"
                >
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-black group-hover:text-primary" />
                  <span className="group-hover:underline">Al Ittihad Road, Dubai, United Arab Emirates</span>
                  <ExternalLink className="w-3 h-3 ml-1 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
              <div>
                <p className="font-semibold mb-2 text-black">Factory:</p>
                <p className="flex items-start text-black">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-black" />
                  <span>3044, N.H.B.C Panipat 132103, Harayana, India</span>
                </p>
              </div>
              <p className="flex items-center text-black">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0 text-black" />
                <a href="tel:+971544389849" className="text-black hover:text-primary transition-colors">+971 54 438 9849</a>
              </p>
              <p className="flex items-center text-black">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0 text-black" />
                <a href="tel:+971503961541" className="text-black hover:text-primary transition-colors">+971 50 396 1541</a>
              </p>
              <p className="flex items-center text-black">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0 text-black" />
                <a href="tel:+919992843000" className="text-black hover:text-primary transition-colors">+91 99928 43000</a>
                <span className="ml-2 text-xs text-black">(Global Helpline)</span>
              </p>
              <p className="flex items-center text-black">
                <Mail className="w-4 h-4 mr-2 flex-shrink-0 text-black" />
                <a href="mailto:info@whitlin.com" className="text-black hover:text-primary transition-colors">info@whitlin.com</a>
              </p>
            </div>
            <p className="text-black text-xs sm:text-sm mb-3 sm:mb-4">Get the latest updates on new products and exclusive offers.</p>
            <form onSubmit={handleNewsletterSubscribe} className="flex flex-col sm:flex-row gap-2 mb-3 sm:mb-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-[#e5e5e5] text-[#1a1a1a] placeholder:text-[#737373] text-sm sm:text-base flex-1 focus:border-[#e1d7c6] focus:ring-[#e1d7c6]"
                disabled={isSubscribing}
                required
              />
              <Button 
                type="submit"
                className="bg-gold-200 hover:bg-gold-300 text-black w-full sm:w-auto smooth-color-transition hover-scale-smooth button-press font-semibold btn-circular"
                disabled={isSubscribing}
              >
                {isSubscribing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
              </Button>
            </form>
            <div className="flex flex-wrap gap-2">
              <a 
                href="https://www.instagram.com/whitlintrading?igsh=MTBlcTZ1ZXd6N2V5dg==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-black hover:text-primary transition-all duration-300"
                title="Follow us on Instagram"
              >
                <Button variant="ghost" size="icon" className="text-black hover:text-primary h-8 w-8 sm:h-10 sm:w-10 smooth-color-transition hover:scale-105 button-press hover:bg-primary/10 btn-circular transition-all duration-300">
                  <Instagram className="h-4 w-4 sm:h-5 sm:w-5 icon-rotate-360 text-current" />
                </Button>
              </a>
              <a 
                href="https://www.threads.com/@whitlintrading" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-black hover:text-primary transition-all duration-300"
                title="Follow us on Threads"
              >
                <Button variant="ghost" size="icon" className="text-black hover:text-primary h-8 w-8 sm:h-10 sm:w-10 smooth-color-transition hover:scale-105 button-press hover:bg-primary/10 btn-circular transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 439.999 511.429"><path fillRule="nonzero" d="M342.382 237.037a175.843 175.843 0 00-6.707-3.045c-3.947-72.737-43.692-114.379-110.428-114.805-38.505-.256-72.972 15.445-94.454 48.041l36.702 25.178c15.265-23.159 39.221-28.097 56.864-28.097.203 0 .408 0 .61.003 21.973.139 38.555 6.528 49.287 18.987 7.81 9.071 13.034 21.606 15.62 37.425-19.482-3.312-40.552-4.329-63.077-3.039-63.449 3.656-104.24 40.661-101.5 92.081 1.39 26.083 14.384 48.522 36.586 63.18 18.773 12.391 42.95 18.451 68.078 17.08 33.183-1.819 59.214-14.48 77.376-37.631 13.793-17.579 22.516-40.362 26.368-69.068 15.814 9.543 27.535 22.103 34.007 37.2 11.007 25.665 11.648 67.84-22.764 102.222-30.15 30.121-66.392 43.151-121.164 43.554-60.757-.45-106.707-19.934-136.582-57.914-27.976-35.563-42.434-86.93-42.973-152.675.539-65.745 14.997-117.113 42.973-152.675 29.875-37.979 75.824-57.464 136.581-57.914 61.197.455 107.948 20.033 138.967 58.195 15.21 18.713 26.677 42.248 34.236 69.688l43.011-11.476c-9.163-33.775-23.581-62.881-43.203-87.017C357.031 25.59 298.872.519 223.935 0h-.3C148.851.518 91.343 25.683 52.709 74.794 18.331 118.498.598 179.308.002 255.534l-.002.18.002.18c.596 76.226 18.329 137.037 52.707 180.741 38.634 49.11 96.142 74.277 170.926 74.794h.3c66.487-.462 113.352-17.868 151.96-56.442 50.511-50.463 48.991-113.717 32.342-152.548-11.944-27.847-34.716-50.464-65.855-65.402zm-114.795 107.93c-27.809 1.566-56.7-10.917-58.124-37.652-1.056-19.823 14.108-41.942 59.83-44.577 5.237-.302 10.375-.45 15.422-.45 16.609 0 32.146 1.613 46.272 4.702-5.268 65.798-36.173 76.483-63.4 77.977z"/></svg>
                </Button>
              </a>
              <a 
                href="https://www.youtube.com/@WHITLINTRADING" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-black hover:text-primary transition-all duration-300"
                title="Follow us on YouTube"
              >
                <Button variant="ghost" size="icon" className="text-black hover:text-primary h-8 w-8 sm:h-10 sm:w-10 smooth-color-transition hover:scale-105 button-press hover:bg-primary/10 btn-circular transition-all duration-300">
                  <Youtube className="h-4 w-4 sm:h-5 sm:w-5 icon-rotate-360 text-current" />
                </Button>
              </a>
              <a 
                href="https://www.facebook.com/WhitlinTrading/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-black hover:text-primary transition-all duration-300"
                title="Follow us on Facebook"
              >
                <Button variant="ghost" size="icon" className="text-black hover:text-primary h-8 w-8 sm:h-10 sm:w-10 smooth-color-transition hover:scale-105 button-press hover:bg-primary/10 btn-circular transition-all duration-300">
                  <Facebook className="h-4 w-4 sm:h-5 sm:w-5 icon-rotate-360 text-current" />
                </Button>
              </a>
              <a 
                href="https://x.com/whitlintrading" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-black hover:text-primary transition-all duration-300"
                title="Follow us on X (Twitter)"
              >
                <Button variant="ghost" size="icon" className="text-black hover:text-primary h-8 w-8 sm:h-10 sm:w-10 smooth-color-transition hover:scale-105 button-press hover:bg-primary/10 btn-circular transition-all duration-300">
                  <Twitter className="h-4 w-4 sm:h-5 sm:w-5 icon-rotate-360 text-current" />
                </Button>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#e5e5e5] mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-black text-xs sm:text-sm px-2">
            © 2025 Whitlin. All rights reserved. |
            <Link href="/privacy" className="text-black hover:text-primary transition-colors ml-1">
              Privacy Policy
            </Link>{" "}
            |
            <Link href="/terms" className="text-black hover:text-primary transition-colors ml-1">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
