// Emergency fix for image loading issues
// This script will be injected to fix immediate image loading problems

export function emergencyImageFix() {
  if (typeof window === 'undefined') return

  console.log('🔧 Applying emergency image fixes...')

  // Fix 1: Ensure all images have proper error handling
  const images = document.querySelectorAll('img')
  images.forEach((img, index) => {
    if (!img.onerror) {
      img.onerror = function() {
        console.warn(`Image ${index} failed to load:`, this.src)
        
        // Try fallback strategies
        if (this.src.includes('cloudinary.com')) {
          // Try lower quality version
          const url = new URL(this.src)
          url.searchParams.set('q', '60')
          url.searchParams.set('w', '300')
          url.searchParams.set('h', '300')
          this.src = url.toString()
          return
        }
        
        // Use placeholder
        if (!this.src.includes('/placeholder.svg')) {
          this.src = '/placeholder.svg'
        }
      }
    }
  })

  // Fix 2: Add retry mechanism for failed images
  const failedImages = document.querySelectorAll('img[src*="placeholder.svg"]')
  failedImages.forEach((img, index) => {
    const originalSrc = img.dataset.originalSrc
    if (originalSrc && index < 3) { // Only retry first 3 failed images
      setTimeout(() => {
        console.log(`Retrying image ${index}:`, originalSrc)
        img.src = originalSrc
      }, 1000 * (index + 1)) // Stagger retries
    }
  })

  // Fix 3: Smart preloading for product images
  const productImages = document.querySelectorAll('[data-product-image]')
  if (productImages.length > 0) {
    console.log('Smart preloading product images...')
    productImages.forEach((element, index) => {
      const src = element.getAttribute('data-product-image')
      if (src && index < 4) { // Only preload first 4 visible images
        // Check if image exists before preloading
        const img = new Image()
        img.onload = () => {
          const link = document.createElement('link')
          link.rel = 'preload'
          link.as = 'image'
          link.href = src
          document.head.appendChild(link)
        }
        img.onerror = () => {
          console.warn(`Skipping preload for broken image: ${src}`)
        }
        img.src = src
      }
    })
  }

  // Fix 4: Add loading states for better UX
  const imageContainers = document.querySelectorAll('.aspect-square')
  imageContainers.forEach(container => {
    const img = container.querySelector('img')
    if (img && !img.complete) {
      container.classList.add('loading')
      
      img.onload = () => {
        container.classList.remove('loading')
        container.classList.add('loaded')
      }
      
      img.onerror = () => {
        container.classList.remove('loading')
        container.classList.add('error')
      }
    }
  })

  console.log('✅ Emergency image fixes applied')
}

// Auto-apply fixes when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', emergencyImageFix)
  } else {
    emergencyImageFix()
  }
}
