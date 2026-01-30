// Improved image utilities for better cross-device compatibility

import { useState, useEffect } from 'react'

/**
 * Better mobile device detection that works with SSR
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  
  // Check multiple indicators for better accuracy
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
  
  // Check screen width
  const isSmallScreen = window.innerWidth < 768
  
  // Check user agent
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(userAgent)
  
  // Check touch capability
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  
  return isSmallScreen || (isMobileUA && isTouchDevice)
}

/**
 * Get optimized image URL with better fallback handling
 */
export function getOptimizedImageUrl(
  src: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png'
    device?: 'mobile' | 'tablet' | 'desktop'
  } = {}
) {
  if (!src || !src.includes('cloudinary.com')) {
    return src
  }

  try {
    const url = new URL(src)
    const isMobile = options.device === 'mobile' || isMobileDevice()
    
    // Set quality based on device
    const quality = isMobile ? (options.quality || 75) : (options.quality || 85)
    url.searchParams.set('q', quality.toString())
    
    // Set dimensions
    if (options.width) {
      const width = isMobile ? Math.min(options.width, 400) : options.width
      url.searchParams.set('w', width.toString())
    }
    if (options.height) {
      const height = isMobile ? Math.min(options.height, 400) : options.height
      url.searchParams.set('h', height.toString())
    }
    
    // Set format with fallback
    if (options.format && options.format !== 'auto') {
      url.searchParams.set('f', options.format)
    } else {
      // Use auto format but ensure fallback
      url.searchParams.set('f_auto', 'true')
    }
    
    // Add optimization flags
    url.searchParams.set('q_auto', 'true')
    
    return url.toString()
  } catch (error) {
    console.error('Error optimizing image URL:', error)
    return src
  }
}

/**
 * Get device-specific image sizes
 */
export function getDeviceImageSizes(device?: 'mobile' | 'tablet' | 'desktop'): string {
  const detectedDevice = device || (isMobileDevice() ? 'mobile' : 'desktop')
  
  const sizes = {
    mobile: '(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw',
    tablet: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
    desktop: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  }
  
  return sizes[detectedDevice]
}

/**
 * Get loading strategy based on device and position
 */
export function getLoadingStrategy(index: number, device?: 'mobile' | 'tablet' | 'desktop'): 'eager' | 'lazy' {
  const detectedDevice = device || (isMobileDevice() ? 'mobile' : 'desktop')
  
  const strategies = {
    mobile: index < 6 ? 'eager' : 'lazy',    // Load more images eagerly on mobile
    tablet: index < 4 ? 'eager' : 'lazy',    // Medium strategy for tablets
    desktop: index < 2 ? 'eager' : 'lazy'    // Conservative for desktop
  }
  
  return strategies[detectedDevice]
}

/**
 * Enhanced image error handler with multiple fallback strategies
 */
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement, Event>) {
  const img = event.currentTarget
  const originalSrc = img.dataset.originalSrc || img.src
  
  console.error('Image failed to load:', originalSrc)
  
  // Strategy 1: Try lower quality version
  if (originalSrc.includes('cloudinary.com') && !img.src.includes('q_60')) {
    try {
      const url = new URL(originalSrc)
      url.searchParams.set('q', '60')
      url.searchParams.set('w', '300')
      url.searchParams.set('h', '300')
      img.src = url.toString()
      return
    } catch (error) {
      console.error('Error creating fallback URL:', error)
    }
  }
  
  // Strategy 2: Try JPEG format
  if (originalSrc.includes('cloudinary.com') && !img.src.includes('f_jpg')) {
    try {
      const url = new URL(originalSrc)
      url.searchParams.set('f', 'jpg')
      url.searchParams.set('q', '80')
      img.src = url.toString()
      return
    } catch (error) {
      console.error('Error creating JPEG fallback:', error)
    }
  }
  
  // Strategy 3: Use placeholder
  if (!img.src.includes('/placeholder.jpg')) {
    img.src = '/placeholder.jpg'
  }
}

/**
 * Hook for image loading state with better error handling
 */
export function useImageLoading(src: string) {
  const [loadingState, setLoadingState] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

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
      setError(null)
    }
    
    img.onerror = () => {
      if (retryCount < 2) {
        // Retry with different parameters
        setRetryCount(prev => prev + 1)
        const optimizedSrc = getOptimizedImageUrl(src, { 
          quality: 60, 
          format: 'jpeg',
          device: isMobileDevice() ? 'mobile' : 'desktop'
        })
        img.src = optimizedSrc
      } else {
        setLoadingState('error')
        setError('Failed to load image after retries')
      }
    }
    
    // Use optimized URL
    img.src = getOptimizedImageUrl(src, { 
      device: isMobileDevice() ? 'mobile' : 'desktop'
    })
  }, [src, retryCount])

  const retry = () => {
    setRetryCount(0)
    setLoadingState('loading')
    setError(null)
  }

  return { 
    loadingState, 
    error, 
    isLoading: loadingState === 'loading',
    retry
  }
}

/**
 * Preload critical images with better error handling
 */
export function preloadCriticalImages(imageSources: string[]): Promise<void[]> {
  if (typeof window === 'undefined') return Promise.resolve([])

  const promises = imageSources.map(src => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => resolve()
      img.onerror = () => {
        // Try fallback
        const fallbackSrc = getOptimizedImageUrl(src, { 
          quality: 60, 
          format: 'jpeg',
          device: isMobileDevice() ? 'mobile' : 'desktop'
        })
        
        const fallbackImg = new Image()
        fallbackImg.onload = () => resolve()
        fallbackImg.onerror = () => reject(new Error(`Failed to preload: ${src}`))
        fallbackImg.src = fallbackSrc
      }
      
      img.src = getOptimizedImageUrl(src, { 
        device: isMobileDevice() ? 'mobile' : 'desktop'
      })
    })
  })
  
  return Promise.allSettled(promises).then(results => 
    results.map(result => 
      result.status === 'fulfilled' ? Promise.resolve() : Promise.reject(result.reason)
    )
  )
}

/**
 * Check if image format is supported
 */
export function isFormatSupported(format: string): boolean {
  if (typeof window === 'undefined') return true
  
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  
  try {
    return canvas.toDataURL(`image/${format}`).indexOf(`data:image/${format}`) === 0
  } catch (error) {
    return false
  }
}

/**
 * Get best supported format for device
 */
export function getBestSupportedFormat(): 'webp' | 'jpeg' | 'png' {
  if (typeof window === 'undefined') return 'jpeg'
  
  if (isFormatSupported('webp')) return 'webp'
  if (isFormatSupported('jpeg')) return 'jpeg'
  return 'png'
}
