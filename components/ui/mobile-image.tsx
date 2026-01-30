'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useMobile } from '../mobile-optimizer'

interface MobileImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  onError?: () => void
}

export function MobileImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = '',
  priority = false,
  quality = 85,
  onError,
  ...props
}: MobileImageProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    setImageSrc(src)
    setHasError(false)
    setIsLoaded(false)
  }, [src])

  const handleError = () => {
    console.error('Mobile image failed to load:', imageSrc)
    setHasError(true)
    setImageSrc('/placeholder.svg')
    onError?.()
  }

  const handleLoad = () => {
    setIsLoaded(true)
    setHasError(false)
  }

  // Mobile-specific sizes
  const mobileSizes = isMobile 
    ? "(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
    : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

  // Fallback for broken images
  if (hasError && imageSrc === '/placeholder.svg') {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center p-4">
          <div className="text-4xl text-gray-400 mb-2">📦</div>
          <p className="text-gray-500 text-sm">Image not available</p>
        </div>
      </div>
    )
  }

  const imageProps = {
    src: imageSrc,
    alt,
    className: `${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`,
    quality: isMobile ? Math.min(quality, 80) : quality, // Lower quality on mobile for faster loading
    priority: priority || isMobile, // Prioritize on mobile
    loading: isMobile ? 'eager' : 'lazy', // Eager loading on mobile
    sizes: mobileSizes,
    onError: handleError,
    onLoad: handleLoad,
    ...props
  }

  if (fill) {
    return (
      <Image
        {...imageProps}
        fill
      />
    )
  }

  return (
    <Image
      {...imageProps}
      width={width || (isMobile ? 300 : 400)}
      height={height || (isMobile ? 200 : 300)}
    />
  )
}

// Specialized mobile product image component
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
    <MobileImage
      src={src}
      alt={alt}
      fill
      className={`object-cover ${className}`}
      priority={priority}
      quality={85}
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
    <MobileImage
      src={src}
      alt={alt}
      fill
      className={`object-cover group-hover:scale-105 transition-transform duration-500 ${className}`}
      quality={80}
    />
  )
}
