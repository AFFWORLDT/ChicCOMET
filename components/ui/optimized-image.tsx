'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  sizes?: string
  quality?: number
  priority?: boolean
  loading?: 'lazy' | 'eager'
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onError?: () => void
}

const defaultBlurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="

export function OptimizedImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = '',
  sizes,
  quality = 85,
  priority = false,
  loading = 'lazy',
  placeholder = 'blur',
  blurDataURL = defaultBlurDataURL,
  onError,
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    console.error('Image failed to load:', imageSrc)
    setHasError(true)
    setImageSrc('/placeholder.svg')
    onError?.()
  }

  const handleLoad = () => {
    setHasError(false)
  }

  // Fallback for broken images
  if (hasError && imageSrc === '/placeholder.svg') {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center">
          <div className="text-4xl text-gray-400 mb-2">📦</div>
          <p className="text-gray-500 text-sm">Image not available</p>
        </div>
      </div>
    )
  }

  const imageProps = {
    src: imageSrc,
    alt,
    className,
    quality,
    priority,
    loading,
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
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
      />
    )
  }

  return (
    <Image
      {...imageProps}
      width={width || 400}
      height={height || 300}
      sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
    />
  )
}

// Specialized components for different use cases
export function ProductImage({ src, alt, className = '', priority = false }: {
  src: string
  alt: string
  className?: string
  priority?: boolean
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      className={`object-cover ${className}`}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      quality={85}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
    />
  )
}

export function ProductThumbnail({ src, alt, className = '' }: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      className={`object-cover ${className}`}
      sizes="80px"
      quality={75}
      loading="lazy"
    />
  )
}

export function ProductGridImage({ src, alt, className = '' }: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      className={`object-cover group-hover:scale-105 transition-transform duration-500 ${className}`}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, (max-width: 1536px) 33vw, 25vw"
      quality={80}
      loading="lazy"
    />
  )
}
