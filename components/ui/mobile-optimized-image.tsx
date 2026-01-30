"use client"

import { useState, useCallback } from "react"
import Image from "next/image"

interface MobileOptimizedImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  sizes?: string
  onError?: () => void
  onLoad?: () => void
}

export function MobileOptimizedImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = '',
  priority = false,
  quality = 85,
  sizes,
  onError,
  onLoad
}: MobileOptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = useCallback(() => {
    // Silently handle image loading errors - don't log to console to avoid unhandled error warnings
    // Only set placeholder if it's not already the placeholder
    if (imageSrc !== '/placeholder.jpg' && imageSrc !== '/placeholder.svg') {
      setHasError(true)
      setImageSrc('/placeholder.jpg')
      onError?.()
    } else {
      // If placeholder also fails, show fallback UI
      setHasError(true)
      onError?.()
    }
  }, [imageSrc, onError])

  const handleLoad = useCallback(() => {
    setHasError(false)
    onLoad?.()
  }, [onLoad])

  // If we have an error and it's already the placeholder, show fallback UI
  if (hasError && imageSrc === '/placeholder.jpg') {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center p-4">
          <div className="text-2xl sm:text-4xl text-gray-400 mb-2">📦</div>
          <p className="text-gray-500 text-xs sm:text-sm">No image</p>
        </div>
      </div>
    )
  }

  const imageProps = {
    src: imageSrc,
    alt,
    className: `${className} transition-opacity duration-300`,
    quality: quality,
    priority: priority,
    sizes: sizes || "(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw",
    onError: handleError,
    onLoad: handleLoad,
  }

  if (fill) {
    return <Image {...imageProps} fill />
  }

  return (
    <Image
      {...imageProps}
      width={width}
      height={height}
    />
  )
}

// Specialized component for product images
export function MobileProductImage({ 
  src, 
  alt, 
  className = '', 
  priority = false 
}: {
  src: string
  alt: string
  className?: string
  priority?: boolean
}) {
  return (
    <MobileOptimizedImage
      src={src}
      alt={alt}
      fill
      className={`object-cover group-hover:scale-105 transition-transform duration-500 ${className}`}
      sizes="(max-width: 640px) 240px, (max-width: 768px) 288px, 320px"
      quality={85}
      priority={priority}
    />
  )
}

// Mobile product grid image
export function MobileProductGridImage({ 
  src, 
  alt, 
  className = '' 
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <MobileOptimizedImage
      src={src}
      alt={alt}
      fill
      className={`object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ${className}`}
      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
      quality={80}
    />
  )
}
