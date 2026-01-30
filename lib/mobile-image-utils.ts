// Mobile-specific image utilities

/**
 * Check if device is mobile
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  
  return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Get mobile-optimized image URL
 */
export function getMobileOptimizedImageUrl(
  src: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png'
  } = {}
) {
  if (!src.includes('cloudinary.com')) return src

  const url = new URL(src)
  const isMobile = isMobileDevice()
  
  // Mobile-specific optimizations
  if (isMobile) {
    // Lower quality for mobile
    url.searchParams.set('q', (options.quality || 75).toString())
    
    // Smaller dimensions for mobile
    if (options.width && options.width > 400) {
      url.searchParams.set('w', '400')
    }
    if (options.height && options.height > 400) {
      url.searchParams.set('h', '400')
    }
  } else {
    if (options.quality) url.searchParams.set('q', options.quality.toString())
    if (options.width) url.searchParams.set('w', options.width.toString())
    if (options.height) url.searchParams.set('h', options.height.toString())
  }
  
  if (options.format) url.searchParams.set('f', options.format)
  
  // Add auto optimization
  url.searchParams.set('f_auto', 'true')
  url.searchParams.set('q_auto', 'true')
  
  return url.toString()
}

/**
 * Preload images for mobile with lower quality
 */
export function preloadMobileImages(imageSources: string[]) {
  if (typeof window === 'undefined') return Promise.resolve()

  const promises = imageSources.map(src => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error(`Failed to preload mobile image: ${src}`))
      
      // Use mobile-optimized URL
      img.src = getMobileOptimizedImageUrl(src, { quality: 60 })
    })
  })
  
  return Promise.allSettled(promises)
}

/**
 * Get mobile-specific image sizes
 */
export function getMobileImageSizes(breakpoint: 'mobile' | 'tablet' | 'desktop' | 'all' = 'all') {
  const sizes = {
    mobile: '(max-width: 480px) 100vw, (max-width: 768px) 50vw',
    tablet: '(max-width: 1024px) 50vw, 33vw',
    desktop: '33vw',
    all: '(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
  }
  
  return sizes[breakpoint]
}

/**
 * Check if image should be prioritized on mobile
 */
export function shouldPrioritizeOnMobile(index: number, totalImages: number): boolean {
  const isMobile = isMobileDevice()
  
  if (!isMobile) return index < 2 // Desktop: prioritize first 2 images
  
  // Mobile: prioritize first 4 images for better UX
  return index < 4
}

/**
 * Get mobile-optimized loading strategy
 */
export function getMobileLoadingStrategy(index: number): 'eager' | 'lazy' {
  const isMobile = isMobileDevice()
  
  if (!isMobile) return index < 2 ? 'eager' : 'lazy'
  
  // Mobile: eager load first 6 images, then lazy load
  return index < 6 ? 'eager' : 'lazy'
}

/**
 * Mobile image error handler
 */
export function handleMobileImageError(event: React.SyntheticEvent<HTMLImageElement, Event>) {
  const img = event.currentTarget
  console.error('Mobile image failed to load:', img.src)
  
  // Try to load a lower quality version
  if (img.src.includes('cloudinary.com') && !img.src.includes('q_60')) {
    const url = new URL(img.src)
    url.searchParams.set('q', '60')
    url.searchParams.set('w', '300')
    img.src = url.toString()
    return
  }
  
  // Fallback to placeholder
  if (!img.src.includes('/placeholder.svg')) {
    img.src = '/placeholder.svg'
  }
}

/**
 * Mobile image loading state hook
 */
export function useMobileImageLoading(src: string) {
  const [loadingState, setLoadingState] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!src) {
      setLoadingState('error')
      setError('No image source provided')
      return
    }

    setLoadingState('loading')
    setError(null)

    const img = new Image()
    
    img.onload = () => {
      setLoadingState('loaded')
    }
    
    img.onerror = () => {
      setLoadingState('error')
      setError('Failed to load image')
    }
    
    // Use mobile-optimized URL
    img.src = getMobileOptimizedImageUrl(src, { quality: 80 })
  }, [src])

  return { loadingState, error, isLoading: loadingState === 'loading' }
}

// Import React hooks
import { useState, useEffect } from 'react'
