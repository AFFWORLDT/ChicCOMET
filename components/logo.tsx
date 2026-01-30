"use client"

import { useState, useCallback } from "react"
import Link from "next/link"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  href?: string
  className?: string
  showText?: boolean
}

const sizeMap = {
  sm: { container: "h-8", width: "auto" },
  md: { container: "h-12 sm:h-14 md:h-16", width: "auto" },
  lg: { container: "h-20 sm:h-24", width: "auto" }
}

const logoPaths = [
  "/W_Logo_N.png",
  "/whitelin-logo.png",
  "/images/logonew.png",
  "/images/logo.png",
  "/placeholder-logo.png"
]

export function Logo({ size = "md", href = "/", className = "", showText = false }: LogoProps) {
  const [imageSrc, setImageSrc] = useState(logoPaths[0])
  const [imageError, setImageError] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleImageError = useCallback(() => {
    const nextIndex = currentIndex + 1

    if (nextIndex < logoPaths.length) {
      // Try next fallback image
      setCurrentIndex(nextIndex)
      setImageSrc(logoPaths[nextIndex])
      setImageError(false)
    } else {
      // All images failed
      setImageError(true)
    }
  }, [currentIndex])

  const sizes = sizeMap[size]
  const logoContent = (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`relative ${sizes.container} flex-shrink-0`} style={{ width: sizes.width }}>
        {!imageError ? (
          <img
            key={`${imageSrc}-${currentIndex}`}
            src={imageSrc}
            alt="ChicComet Logo"
            className="h-full w-auto object-contain object-center"
            style={{ maxWidth: '100%', height: '100%' }}
            onError={handleImageError}
            loading="eager"
          />
        ) : (
          <div className={`h-full w-auto bg-primary/10 rounded flex items-center justify-center ${sizes.container}`}>
            <span className="font-serif font-bold text-primary">W</span>
          </div>
        )}
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="flex items-center justify-center">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}

