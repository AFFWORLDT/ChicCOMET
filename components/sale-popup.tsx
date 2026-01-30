"use client"

import { useState, useEffect } from "react"
import { X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const POPUP_INTERVAL = 2.5 * 60 * 1000 // 2.5 minutes in milliseconds
const STORAGE_KEY = "sale-popup-last-shown"

export function SalePopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    const checkAndShowPopup = () => {
      const lastShown = localStorage.getItem(STORAGE_KEY)
      const now = Date.now()

      if (!lastShown) {
        // First visit - show after a short delay for better UX
        setTimeout(() => {
          setIsVisible(true)
          setHasAnimated(true)
          localStorage.setItem(STORAGE_KEY, now.toString())
        }, 1000) // 1 second delay on first visit
        return
      }

      const timeSinceLastShown = now - parseInt(lastShown, 10)

      if (timeSinceLastShown >= POPUP_INTERVAL) {
        // Enough time has passed - show popup
        setIsVisible(true)
        setHasAnimated(true)
        localStorage.setItem(STORAGE_KEY, now.toString())
      }
    }

    // Check on mount
    checkAndShowPopup()

    // Set up interval to check every 30 seconds
    const interval = setInterval(checkAndShowPopup, 30 * 1000)

    return () => clearInterval(interval)
  }, [])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsVisible(false)
      setIsClosing(false)
      setHasAnimated(false)
      // Update last shown time when manually closed
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, Date.now().toString())
      }
    }, 500) // Match animation duration
  }

  const handleImageClick = () => {
    // Optional: Navigate to a sale page or product page
    // window.location.href = '/products?sale=true'
  }

  if (!isVisible) return null

  // Generate sparkle positions
  const sparkles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
    duration: `${1 + Math.random() * 1.5}s`,
  }))

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md transition-opacity duration-500 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleClose}
    >
      {/* Animated Background Sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute animate-sparkle"
            style={{
              top: sparkle.top,
              left: sparkle.left,
              animationDelay: sparkle.delay,
              animationDuration: sparkle.duration,
            }}
          >
            <Sparkles className="w-4 h-4 text-secondary opacity-80" />
          </div>
        ))}
      </div>

      <div
        className={`relative mx-4 max-w-5xl w-full ${
          hasAnimated && !isClosing ? "animate-festive-entrance" : ""
        } ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sale Image Container with Festive Animations */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] rounded-xl overflow-hidden shadow-2xl cursor-pointer group border-4 border-white/20 animate-festive-glow">
          {/* Floating Animation Layer */}
          <div className="absolute inset-0 animate-festive-float pointer-events-none">
            <Image
              src="/images/sale.jpeg"
              alt="Special Sale Offer - Limited Time Deal"
              fill
              className="object-contain transition-transform duration-500"
              priority
              onClick={handleImageClick}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            />
          </div>

          {/* Decorative Sparkles Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-4 w-3 h-3 bg-secondary rounded-full animate-festive-pulse opacity-80" />
            <div className="absolute top-8 right-8 w-2 h-2 bg-white rounded-full animate-sparkle opacity-90" style={{ animationDelay: "0.5s" }} />
            <div className="absolute bottom-6 left-8 w-2.5 h-2.5 bg-secondary rounded-full animate-festive-pulse opacity-75" style={{ animationDelay: "1s" }} />
            <div className="absolute bottom-4 right-6 w-2 h-2 bg-white rounded-full animate-sparkle opacity-85" style={{ animationDelay: "1.5s" }} />
          </div>

          {/* Close Button - Overlay on Image */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-white/90 hover:bg-white rounded-full shadow-xl hover:scale-110 transition-transform btn-circular backdrop-blur-sm animate-festive-bounce"
            aria-label="Close popup"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800" />
          </Button>

          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
        </div>

        {/* Additional Decorative Elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-secondary/30 rounded-full animate-festive-float blur-sm pointer-events-none" style={{ animationDelay: "0.3s" }} />
        <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-secondary/30 rounded-full animate-festive-float blur-sm pointer-events-none" style={{ animationDelay: "0.6s" }} />
        <div className="absolute top-1/2 -right-6 w-4 h-4 bg-white/40 rounded-full animate-festive-pulse pointer-events-none" style={{ animationDelay: "0.9s" }} />
        <div className="absolute top-1/4 -left-6 w-5 h-5 bg-secondary/40 rounded-full animate-festive-float pointer-events-none" style={{ animationDelay: "1.2s" }} />
      </div>
    </div>
  )
}

