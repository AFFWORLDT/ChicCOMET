// Cloudinary image loading fix for better compatibility

export function fixCloudinaryImages() {
  if (typeof window === 'undefined') return

  console.log('🔧 Fixing Cloudinary image loading...')

  // Fix 1: Add proper error handling to all images
  const images = document.querySelectorAll('img')
  images.forEach((img, index) => {
    // Skip if already has error handler
    if (img.dataset.errorHandled) return

    img.dataset.errorHandled = 'true'
    
    img.onerror = function() {
      console.warn(`Image ${index} failed to load:`, this.src)
      
      // Try multiple fallback strategies
      if (this.src.includes('cloudinary.com')) {
        const originalSrc = this.dataset.originalSrc || this.src
        
        // Strategy 1: Try lower quality
        if (!this.src.includes('q_60')) {
          const url = new URL(originalSrc)
          url.searchParams.set('q', '60')
          url.searchParams.set('w', '300')
          url.searchParams.set('h', '300')
          this.src = url.toString()
          return
        }
        
        // Strategy 2: Try JPEG format
        if (!this.src.includes('f_jpg')) {
          const url = new URL(originalSrc)
          url.searchParams.set('f', 'jpg')
          url.searchParams.set('q', '80')
          this.src = url.toString()
          return
        }
        
        // Strategy 3: Try without transformations
        if (originalSrc !== this.src) {
          this.src = originalSrc
          return
        }
      }
      
      // Final fallback: placeholder
      if (!this.src.includes('/placeholder.svg')) {
        this.src = '/placeholder.svg'
      }
    }

    // Store original src for fallback
    if (!img.dataset.originalSrc) {
      img.dataset.originalSrc = img.src
    }
  })

  // Fix 2: Add loading states
  const imageContainers = document.querySelectorAll('.aspect-square, [data-product-image]')
  imageContainers.forEach(container => {
    const img = container.querySelector('img')
    if (img) {
      // Add loading class
      container.classList.add('image-loading')
      
      img.onload = () => {
        container.classList.remove('image-loading')
        container.classList.add('image-loaded')
      }
      
      img.onerror = () => {
        container.classList.remove('image-loading')
        container.classList.add('image-error')
      }
    }
  })

  // Fix 3: Retry failed images after a delay
  setTimeout(() => {
    const failedImages = document.querySelectorAll('img[src*="placeholder.svg"]')
    failedImages.forEach((img, index) => {
      const originalSrc = img.dataset.originalSrc
      if (originalSrc && index < 3) { // Only retry first 3
        console.log(`Retrying failed image ${index}:`, originalSrc)
        
        // Try with different parameters
        if (originalSrc.includes('cloudinary.com')) {
          const url = new URL(originalSrc)
          url.searchParams.set('q', '70')
          url.searchParams.set('w', '400')
          url.searchParams.set('h', '400')
          url.searchParams.set('f', 'auto')
          img.src = url.toString()
        } else {
          img.src = originalSrc
        }
      }
    })
  }, 2000)

  console.log('✅ Cloudinary image fixes applied')
}

// Auto-apply fixes
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixCloudinaryImages)
  } else {
    fixCloudinaryImages()
  }
}
