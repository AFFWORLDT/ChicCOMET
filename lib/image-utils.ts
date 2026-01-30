// Image utility functions for better performance and reliability

export interface ImagePreloadOptions {
  priority?: boolean
  quality?: number
  sizes?: string
}

/**
 * Preload an image to improve loading performance
 */
export function preloadImage(src: string, options: ImagePreloadOptions = {}) {
  if (typeof window === 'undefined') return Promise.resolve()

  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`))
    
    // Add quality and size parameters for Cloudinary images
    if (src.includes('cloudinary.com')) {
      const url = new URL(src)
      if (options.quality) url.searchParams.set('q', options.quality.toString())
      if (options.sizes) {
        // Extract width from sizes string for Cloudinary
        const widthMatch = options.sizes.match(/(\d+)px/)
        if (widthMatch) {
          url.searchParams.set('w', widthMatch[1])
        }
      }
      img.src = url.toString()
    } else {
      img.src = src
    }
  })
}

/**
 * Preload multiple images
 */
export async function preloadImages(
  imageSources: string[], 
  options: ImagePreloadOptions = {}
) {
  const promises = imageSources.map(src => preloadImage(src, options))
  return Promise.allSettled(promises)
}

/**
 * Get optimized image URL for Cloudinary
 */
export function getOptimizedImageUrl(
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
  
  if (options.width) url.searchParams.set('w', options.width.toString())
  if (options.height) url.searchParams.set('h', options.height.toString())
  if (options.quality) url.searchParams.set('q', options.quality.toString())
  if (options.format) url.searchParams.set('f', options.format)
  
  // Add auto optimization
  url.searchParams.set('f_auto', 'true')
  url.searchParams.set('q_auto', 'true')
  
  return url.toString()
}

/**
 * Check if image URL is valid
 */
export function isValidImageUrl(url: string): boolean {
  try {
    new URL(url)
    return /\.(jpg|jpeg|png|gif|webp|avif|svg)(\?.*)?$/i.test(url)
  } catch {
    return false
  }
}

/**
 * Get responsive image sizes for different breakpoints
 */
export function getResponsiveSizes(breakpoint: 'mobile' | 'tablet' | 'desktop' | 'all' = 'all') {
  const sizes = {
    mobile: '(max-width: 768px) 100vw',
    tablet: '(max-width: 1200px) 50vw',
    desktop: '33vw',
    all: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  }
  
  return sizes[breakpoint]
}

/**
 * Generate blur data URL for placeholder
 */
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  const canvas = typeof window !== 'undefined' ? document.createElement('canvas') : null
  if (!canvas) return defaultBlurDataURL
  
  canvas.width = width
  canvas.height = height
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return defaultBlurDataURL
  
  // Create a simple gradient blur
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#f3f4f6')
  gradient.addColorStop(1, '#e5e7eb')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  return canvas.toDataURL('image/jpeg', 0.1)
}

const defaultBlurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="

/**
 * Image loading states
 */
export enum ImageLoadingState {
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error'
}

/**
 * Hook for managing image loading state
 */
export function useImageLoading(src: string) {
  const [state, setState] = useState<ImageLoadingState>(ImageLoadingState.LOADING)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!src) {
      setState(ImageLoadingState.ERROR)
      setError('No image source provided')
      return
    }

    setState(ImageLoadingState.LOADING)
    setError(null)

    preloadImage(src)
      .then(() => {
        setState(ImageLoadingState.LOADED)
      })
      .catch((err) => {
        setState(ImageLoadingState.ERROR)
        setError(err.message)
      })
  }, [src])

  return { state, error, isLoading: state === ImageLoadingState.LOADING }
}

// Import React hooks
import { useState, useEffect } from 'react'
