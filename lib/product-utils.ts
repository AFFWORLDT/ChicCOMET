/**
 * Product Utilities - Ensures products always have valid data
 * This prevents errors and ensures products are always visible
 */

export interface NormalizedProduct {
  _id: string
  id: string
  name: string
  price: number
  originalPrice?: number
  description: string
  images: string[]
  image: string
  sku: string
  category: {
    _id?: string
    name: string
    slug?: string
  }
  attributes: Array<{
    name: string
    value: string
  }>
  isActive: boolean
  status?: string
  createdAt: string
  isNewProduct?: boolean
  isBestSeller?: boolean
  isFeatured?: boolean
  rating?: number
  reviews?: number
  stock?: number
  inStock?: boolean
}

const DEFAULT_PLACEHOLDER_IMAGE = "/placeholder.jpg"
const DEFAULT_PRODUCT_NAME = "Product"
const DEFAULT_DESCRIPTION = "Premium quality product"
const DEFAULT_PRICE = 0
const DEFAULT_CATEGORY = "General"
const DEFAULT_SKU = "SKU-000"

/**
 * Normalizes product data to ensure all required fields exist
 */
export function normalizeProduct(product: any): NormalizedProduct {
  if (!product) {
    return createDefaultProduct()
  }

  // Helper function to validate image URL
  const isValidImageUrl = (url: string): boolean => {
    if (!url || typeof url !== 'string') return false
    const trimmed = url.trim()
    if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined') return false
    // Check if it's a valid URL (http/https) or a valid path (/...)
    return trimmed.startsWith('http://') || 
           trimmed.startsWith('https://') || 
           trimmed.startsWith('/') ||
           trimmed.startsWith('data:image/')
  }

  // Filter and validate images
  let images: string[] = []
  
  // First, try to get images from images array
  if (Array.isArray(product.images) && product.images.length > 0) {
    images = product.images
      .filter(img => isValidImageUrl(img))
      .map(img => img.trim())
  }
  
  // If no valid images from array, try single image field
  if (images.length === 0 && product.image && isValidImageUrl(product.image)) {
    images = [product.image.trim()]
  }
  
  // If still no valid images, use placeholder
  if (images.length === 0) {
    images.push(DEFAULT_PLACEHOLDER_IMAGE)
  }

  // Normalize category
  const category = product.category 
    ? (typeof product.category === 'string' 
        ? { name: product.category }
        : {
            _id: product.category._id || product.category.id,
            name: product.category.name || DEFAULT_CATEGORY,
            slug: product.category.slug
          })
    : { name: DEFAULT_CATEGORY }

  // Normalize attributes
  const attributes = Array.isArray(product.attributes)
    ? product.attributes.filter(attr => attr && attr.name && attr.value)
    : []

  return {
    _id: product._id || product.id || `product-${Date.now()}`,
    id: product._id || product.id || `product-${Date.now()}`,
    name: product.name || DEFAULT_PRODUCT_NAME,
    price: typeof product.price === 'number' && product.price >= 0 ? product.price : DEFAULT_PRICE,
    originalPrice: typeof product.originalPrice === 'number' && product.originalPrice > 0 ? product.originalPrice : undefined,
    description: product.description || DEFAULT_DESCRIPTION,
    images: images,
    image: images[0] || DEFAULT_PLACEHOLDER_IMAGE,
    sku: product.sku || DEFAULT_SKU,
    category: category,
    attributes: attributes,
    isActive: product.isActive !== undefined ? product.isActive : (product.status === 'active'),
    status: product.status || 'active',
    createdAt: product.createdAt || new Date().toISOString(),
    isNewProduct: product.isNewProduct || false,
    isBestSeller: product.isBestSeller || false,
    isFeatured: product.isFeatured || false,
    rating: typeof product.rating === 'number' ? product.rating : 4.5,
    reviews: typeof product.reviews === 'number' ? product.reviews : 0,
    stock: typeof product.stock === 'number' ? product.stock : 0,
    inStock: product.inStock !== undefined ? product.inStock : (product.stock > 0 || product.status === 'active')
  }
}

/**
 * Normalizes an array of products
 */
export function normalizeProducts(products: any[]): NormalizedProduct[] {
  if (!Array.isArray(products)) {
    return []
  }

  return products
    .filter(product => product !== null && product !== undefined)
    .map(product => normalizeProduct(product))
}

/**
 * Creates a default product when data is missing
 */
function createDefaultProduct(): NormalizedProduct {
  return {
    _id: `default-${Date.now()}`,
    id: `default-${Date.now()}`,
    name: DEFAULT_PRODUCT_NAME,
    price: DEFAULT_PRICE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_PLACEHOLDER_IMAGE],
    image: DEFAULT_PLACEHOLDER_IMAGE,
    sku: DEFAULT_SKU,
    category: { name: DEFAULT_CATEGORY },
    attributes: [],
    isActive: true,
    status: 'active',
    createdAt: new Date().toISOString(),
    isNewProduct: false,
    isBestSeller: false,
    isFeatured: false,
    rating: 4.5,
    reviews: 0,
    stock: 0,
    inStock: true
  }
}

/**
 * Fetches products with retry logic and error handling
 */
export async function fetchProductsWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries: number = 3,
  retryDelay: number = 1000
): Promise<{ success: boolean; data: NormalizedProduct[]; error?: string; total?: number; pages?: number }> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && Array.isArray(data.data)) {
        return {
          success: true,
          data: normalizeProducts(data.data),
          total: data.total || data.data.length,
          pages: data.pages || 1
        }
      } else if (data.success && !Array.isArray(data.data)) {
        // Handle case where data is not an array
        return {
          success: true,
          data: [],
          total: 0,
          pages: 0
        }
      } else {
        throw new Error(data.error || 'Failed to fetch products')
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')
      
      if (attempt < maxRetries - 1) {
        // Wait before retrying with exponential backoff
        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)))
      }
    }
  }

  // If all retries failed, return empty array with error
  console.error('Failed to fetch products after retries:', lastError)
  
  // Provide user-friendly error messages
  let errorMessage = 'Failed to fetch products'
  if (lastError?.message) {
    const message = lastError.message.toLowerCase()
    if (message.includes('database connection') || message.includes('connection') || message.includes('ssl') || message.includes('tls') || message.includes('keepalive')) {
      errorMessage = 'Unable to connect to the database. Please try again in a moment.'
    } else if (message.includes('http error') || message.includes('status: 500')) {
      errorMessage = 'Server error occurred. Please try again later.'
    } else if (message.includes('network') || message.includes('fetch')) {
      errorMessage = 'Network error. Please check your connection and try again.'
    } else {
      errorMessage = 'Unable to load products. Please try again later.'
    }
  }
  
  return {
    success: false,
    data: [],
    error: errorMessage,
    total: 0,
    pages: 0
  }
}

/**
 * Gets product size from attributes
 */
export function getProductSize(product: NormalizedProduct): string {
  if (!product.attributes || !Array.isArray(product.attributes)) {
    return 'Standard'
  }
  
  const sizeAttr = product.attributes.find(
    attr => attr && attr.name && attr.name.toLowerCase() === 'size'
  )
  
  return sizeAttr?.value || 'Standard'
}

/**
 * Gets product badge text
 */
export function getProductBadge(product: NormalizedProduct): string | null {
  if (product.originalPrice && product.originalPrice > product.price) {
    return "Sale"
  }
  if (product.isNewProduct) {
    return "New"
  }
  if (product.isBestSeller) {
    return "Best Seller"
  }
  if (product.isFeatured) {
    return "Featured"
  }
  return null
}

