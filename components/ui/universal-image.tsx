'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { 
  getOptimizedImageUrl, 
  getDeviceImageSizes, 
  getLoadingStrategy, 
  handleImageError,
  useImageLoading,
  isMobileDevice,
  getBestSupportedFormat
} from '@/lib/improved-image-utils'

interface UniversalImageProps {
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
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  index?: number // For determining loading strategy
  device?: 'mobile' | 'tablet' | 'desktop'
}

const defaultBlurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="

export function UniversalImage({
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
  onLoad,
  placeholder = 'blur',
  blurDataURL = defaultBlurDataURL,
  index = 0,
  device,
  ...props
}: UniversalImageProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isClient, setIsClient] = useState(false)
  
  const { loadingState, error, retry } = useImageLoading(src)

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Update image source when src changes
  useEffect(() => {
    if (src && isClient) {
      setImageSrc(getOptimizedImageUrl(src, { 
        device: device || (isMobileDevice() ? 'mobile' : 'desktop'),
        quality,
        format: getBestSupportedFormat()
      }))
      setHasError(false)
      setIsLoaded(false)
    }
  }, [src, isClient, device, quality])

  const handleError = useCallback(() => {
    console.error('Universal image failed to load:', imageSrc)
    setHasError(true)
    handleImageError({ currentTarget: { src: imageSrc, dataset: { originalSrc: src } } } as any)
    onError?.()
  }, [imageSrc, src, onError])

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    setHasError(false)
    onLoad?.()
  }, [onLoad])

  // Get device-specific properties
  const isMobile = device === 'mobile' || (isClient && isMobileDevice())
  const deviceSizes = sizes || getDeviceImageSizes(device)
  const loadingStrategy = getLoadingStrategy(index, device)
  const finalPriority = priority || (isMobile && index < 4)

  // Fallback for broken images
  if (hasError && imageSrc === '/placeholder.jpg') {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center p-4">
          <div className="text-4xl text-gray-400 mb-2">📦</div>
          <p className="text-gray-500 text-sm">Image not available</p>
          {error && (
            <button 
              onClick={retry}
              className="mt-2 text-xs text-blue-500 hover:text-blue-700 underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    )
  }

  // Loading state
  if (loadingState === 'loading' && !isLoaded) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="animate-pulse">
          <div className="w-full h-full bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const imageProps = {
    src: imageSrc,
    alt,
    className: `${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`,
    quality: isMobile ? Math.min(quality, 80) : quality,
    priority: finalPriority,
    loading: finalPriority ? 'eager' : loadingStrategy,
    sizes: deviceSizes,
    placeholder,
    blurDataURL,
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

// Specialized components for different use cases
export function UniversalProductImage({ 
  src, 
  alt, 
  className = '', 
  priority = false,
  index = 0,
  device
}: {
  src: string
  alt: string
  className?: string
  priority?: boolean
  index?: number
  device?: 'mobile' | 'tablet' | 'desktop'
}) {
  return (
    <UniversalImage
      src={src}
      alt={alt}
      fill
      className={`object-cover transition-opacity duration-500 ease-in-out ${className}`}
      priority={priority}
      quality={85}
      index={index}
      device={device}
    />
  )
}

export function UniversalProductGridImage({ 
  src, 
  alt, 
  className = '',
  index = 0,
  device
}: {
  src: string
  alt: string
  className?: string
  index?: number
  device?: 'mobile' | 'tablet' | 'desktop'
}) {
  return (
    <UniversalImage
      src={src}
      alt={alt}
      fill
      className={`object-cover group-hover:scale-105 transition-transform duration-500 ${className}`}
      quality={80}
      index={index}
      device={device}
    />
  )
}

export function UniversalProductThumbnail({ 
  src, 
  alt, 
  className = '', 
  device
}: {
  src: string
  alt: string
  className?: string
  device?: 'mobile' | 'tablet' | 'desktop'
}) {
  return (
    <div 
      className="absolute inset-0 w-[150%] h-[150%] -left-[25%] -top-[25%] overflow-hidden"
      style={{
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        borderRadius: '0',
        maskImage: 'none'
      }}
    >
      <UniversalImage
        src={src}
        alt={alt}
        fill
        className={`object-cover object-center [clip-path:inset(0)] [border-radius:0] ${className}`}
        quality={75}
        device={device}
      />
    </div>
  )
}
