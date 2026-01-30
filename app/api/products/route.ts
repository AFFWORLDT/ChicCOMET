import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { executeWithRetry } from '@/lib/mongodb-operations'
import Product from '@/lib/models/Product'
import Category from '@/lib/models/Category'
import { withCache, cacheKeys, cacheTTL } from '@/lib/cache'
import { createErrorResponse } from '@/lib/error-handler'
import { CacheManager, CACHE_TAGS } from '@/lib/cache-optimizer'
import mongoose from 'mongoose'

// Frontend category to product keyword mapping
const frontendCategoryKeywords: Record<string, string[]> = {
  'bed-linen': ['bed', 'bedsheet', 'sheet', 'bed sheet', 'pillow', 'duvet', 'comforter', 'quilt', 'bedding', 'mattress', 'bed runner', 'bed skirt'],
  'bath-linen': ['towel', 'bath', 'bath towel', 'hand towel', 'face towel', 'bath mat', 'spa towel', 'bathroom'],
  'duvets': ['duvet', 'duvet cover', 'comforter', 'quilt'],
  'towels': ['towel', 'bath towel', 'hand towel', 'face towel', 'beach towel', 'spa towel'],
  'homeware': ['curtain', 'cushion', 'throw', 'blanket', 'rug', 'carpet', 'tablecloth', 'napkin', 'placemat', 'home', 'furniture'],
  'collections': [] // Collections will be handled separately
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const featured = searchParams.get('featured')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const noCache = searchParams.get('noCache') === 'true' // Allow bypassing cache

    // Create cache key
    const cacheKey = cacheKeys.products(
      `${category || 'all'}-${search || ''}-${sort || 'newest'}-${minPrice || ''}-${maxPrice || ''}-${featured || 'false'}-${page}-${limit}`
    )

    // Fetch function (used with or without cache)
    const fetchProducts = async () => {
      try {
        // connectDB now has built-in retry logic for SSL/TLS errors
        await connectDB()

        // Verify connection is still alive before proceeding
        if (mongoose.connection.readyState !== 1) {
          throw new Error('Database connection is not ready')
        }
      } catch (dbError: any) {
        // Handle connection errors specifically
        if (dbError?.message?.includes('Operation interrupted') ||
          dbError?.message?.includes('client was closed') ||
          dbError?.message?.includes('connection closed')) {
          console.error('Database connection error, will retry:', dbError.message)
          // Force reconnection by clearing cache
          const mongoose = await import('mongoose')
          if (mongoose.default.connection.readyState !== 0) {
            await mongoose.default.disconnect()
          }
          // Retry connection once
          await connectDB()
        } else {
          throw dbError
        }
      }

      // Build filter object
      const filter: any = { status: 'active' }

      // Filter out B2B products for public website (unless specifically requested/admin)
      // We only show B2C and BOTH types on the public portal
      filter.businessType = { $ne: 'B2B' }

      // Handle featured products - only use fields that exist in the Product model
      if (featured === 'true') {
        // Use $and to combine status with featured conditions
        filter.$and = [
          { status: 'active' },
          {
            $or: [
              { isBestSeller: true },
              { isNewProduct: true }
            ]
          }
        ]
        // Remove status from top level since it's in $and
        delete filter.status
      }

      if (category && category !== 'all') {
        // Check if it's a frontend category (has keyword mapping)
        const frontendKeywords = frontendCategoryKeywords[category.toLowerCase()]

        if (frontendKeywords && frontendKeywords.length > 0) {
          // Frontend category - filter by product name/description keywords
          const keywordConditions = frontendKeywords.flatMap(keyword => [
            { name: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } }
          ])

          const keywordFilter = { $or: keywordConditions }

          if (featured === 'true') {
            // Combine featured filter with keyword search
            filter.$and = [
              { status: 'active' },
              {
                $or: [
                  { isBestSeller: true },
                  { isNewProduct: true }
                ]
              },
              keywordFilter
            ]
            delete filter.status
          } else {
            // Add keyword search to filter
            filter.$and = [
              { status: 'active' },
              keywordFilter
            ]
            delete filter.status
          }
        } else {
          // Backend category - find category by slug or name with retry
          const categoryDoc = await executeWithRetry(
            () => Category.findOne({
              $or: [
                { slug: category },
                { name: category }
              ]
            }),
            'Category lookup',
            5
          )

          if (categoryDoc) {
            // If featured filter is active, add category to $and array
            if (featured === 'true' && filter.$and && Array.isArray(filter.$and)) {
              filter.$and.push({ category: categoryDoc._id })
            } else if (featured === 'true') {
              // If $and doesn't exist yet, create it
              filter.$and = [
                { status: 'active' },
                {
                  $or: [
                    { isBestSeller: true },
                    { isNewProduct: true }
                  ]
                },
                { category: categoryDoc._id }
              ]
              delete filter.status
            } else {
              // If not featured, just add category to filter
              filter.category = categoryDoc._id
            }
          }
        }
      }

      if (search) {
        const searchFilter = {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { sku: { $regex: search, $options: 'i' } }
          ]
        }

        if (featured === 'true') {
          // When both featured and search are present, use $and to combine conditions
          // Check if $and already exists (from featured filter)
          if (filter.$and && Array.isArray(filter.$and)) {
            // Add search filter to existing $and array
            filter.$and.push(searchFilter)
          } else {
            // Create new $and array with status, featured, and search
            filter.$and = [
              { status: 'active' },
              {
                $or: [
                  { isBestSeller: true },
                  { isNewProduct: true }
                ]
              },
              searchFilter
            ]
            delete filter.$or
            delete filter.status
          }
        } else {
          // If not featured, just add search filter
          if (filter.$or && Array.isArray(filter.$or)) {
            // Merge with existing $or conditions
            filter.$or = [...filter.$or, ...searchFilter.$or]
          } else {
            filter.$or = searchFilter.$or
          }
        }
      }

      if (minPrice || maxPrice) {
        filter.price = {}
        if (minPrice) filter.price.$gte = parseFloat(minPrice)
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice)
      }

      // Build sort object
      let sortObj: any = { createdAt: -1 } // Default sort by newest

      // If featured is true and no explicit sort, prioritize best sellers
      if (featured === 'true' && !sort) {
        sortObj = { isBestSeller: -1, isNewProduct: -1, createdAt: -1 }
      } else {
        switch (sort) {
          case 'price-low':
            sortObj = { price: 1 }
            break
          case 'price-high':
            sortObj = { price: -1 }
            break
          case 'rating':
            sortObj = { rating: -1 }
            break
          case 'newest':
            sortObj = { createdAt: -1 }
            break
          case 'featured':
            sortObj = { isBestSeller: -1, isNewProduct: -1, createdAt: -1 }
            break
        }
      }

      // Calculate pagination
      const skip = (page - 1) * limit

      // Execute query with retry and connection check
      let products = await executeWithRetry(
        async () => {
          // Verify connection before query
          if (mongoose.connection.readyState !== 1) {
            console.warn('Connection not ready before query, reconnecting...')
            await connectDB()
          }

          // Execute query with timeout protection
          return await Promise.race([
            Product.find(filter)
              .populate('category', 'name slug')
              .sort(sortObj)
              .skip(skip)
              .limit(limit)
              .lean(),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Query timeout')), 30000)
            )
          ]) as any
        },
        'Product query',
        5
      )

      // Removed fallback - only show actual featured products (isBestSeller or isNewProduct)
      // If no featured products exist, return empty array

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

      // Ensure images array is properly formatted and all required fields exist
      const formattedProducts = products.map((product: any) => {
        // Filter and validate images
        let images: string[] = []

        // First, try to get images from images array
        if (Array.isArray(product.images) && product.images.length > 0) {
          images = product.images
            .filter((img: string) => isValidImageUrl(img))
            .map((img: string) => img.trim())
        }

        // If no valid images from array, try single image field
        if (images.length === 0 && product.image && isValidImageUrl(product.image)) {
          images = [product.image.trim()]
        }

        // If still no valid images, use placeholder
        if (images.length === 0) {
          images = ['/placeholder.jpg']
        }

        // Ensure category exists
        const category = product.category || { name: 'General' }

        // Ensure attributes array exists
        const attributes = Array.isArray(product.attributes)
          ? product.attributes.filter((attr: any) => attr && attr.name && attr.value)
          : []

        return {
          ...product,
          _id: product._id || product.id || `product-${Date.now()}`,
          id: product._id || product.id || `product-${Date.now()}`,
          name: product.name || 'Product',
          price: typeof product.price === 'number' && product.price >= 0 ? product.price : 0,
          description: product.description || 'Premium quality product',
          images: images,
          image: images[0] || '/placeholder.jpg',
          category: typeof category === 'string' ? { name: category } : category,
          attributes: attributes,
          isActive: product.isActive !== undefined ? product.isActive : (product.status === 'active'),
          status: product.status || 'active',
          sku: product.sku || `SKU-${product._id || Date.now()}`,
          rating: typeof product.rating === 'number' ? product.rating : 4.5,
          reviews: typeof product.reviews === 'number' ? product.reviews : 0,
          washingInstructions: Array.isArray(product.washingInstructions) ? product.washingInstructions : [],
          subCategory: product.subCategory || "",
          createdAt: product.createdAt || new Date().toISOString()
        }
      })

      // Get total count with retry and connection check
      let total = await executeWithRetry(
        async () => {
          // Verify connection before count
          if (mongoose.connection.readyState !== 1) {
            console.warn('Connection not ready before count, reconnecting...')
            await connectDB()
          }
          return await Product.countDocuments(filter)
        },
        'Product count',
        5
      )

      return {
        products: formattedProducts,
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    }

    // Use cache or fetch directly
    const result = noCache
      ? await fetchProducts()
      : await withCache(cacheKey, cacheTTL.products, fetchProducts)

    return NextResponse.json({
      success: true,
      data: result.products,
      total: result.total,
      page: result.page,
      pages: result.pages
    })
  } catch (error: any) {
    // Handle specific MongoDB connection errors
    if (error?.message?.includes('Operation interrupted') ||
      error?.message?.includes('client was closed') ||
      error?.message?.includes('connection closed')) {
      console.error('MongoDB connection error in products API:', error.message)
      // Return a more helpful error response
      return NextResponse.json({
        success: false,
        error: 'Database connection issue. Please try again.',
        retryable: true
      }, { status: 503 }) // Service Unavailable
    }

    return createErrorResponse(error, 'Failed to fetch products')
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newProduct = new Product(body)
    await newProduct.save()

    return NextResponse.json({
      success: true,
      data: newProduct
    }, { status: 201 })
  } catch (error) {
    return createErrorResponse(error, 'Failed to create product')
  }
}
