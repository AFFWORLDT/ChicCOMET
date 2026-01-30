import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { executeWithRetry } from '@/lib/mongodb-operations'
import Product from '@/lib/models/Product'
import Category from '@/lib/models/Category'
import { createErrorResponse } from '@/lib/error-handler'
import { requireAdmin } from '@/lib/check-admin-auth'

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const authError = await requireAdmin(request)
    if (authError) return authError
    
    await connectDB()

    // Get all products for accurate statistics with retry
    let totalProducts = 0
    let activeProducts = 0
    let outOfStockProducts = 0
    let allProducts: any[] = []
    let categories: any[] = []

    try {
      const results = await Promise.all([
        executeWithRetry(() => Product.countDocuments({ status: 'active' }), 'Total products count', 5),
        executeWithRetry(() => Product.countDocuments({ status: 'active', stock: { $gt: 0 } }), 'Active products count', 5),
        executeWithRetry(() => Product.countDocuments({ status: 'active', stock: 0 }), 'Out of stock count', 5),
        executeWithRetry(() => Product.find({ status: 'active' }).lean(), 'All products', 5),
        executeWithRetry(() => Category.find({ active: true }).select('name slug').lean(), 'Categories', 5)
      ])
      
      totalProducts = results[0] || 0
      activeProducts = results[1] || 0
      outOfStockProducts = results[2] || 0
      allProducts = Array.isArray(results[3]) ? results[3] : []
      categories = Array.isArray(results[4]) ? results[4] : []
    } catch (error) {
      console.error('Error fetching basic stats:', error)
      // Continue with default values
    }

    // Calculate total stock value with null safety
    const totalStockValue = Array.isArray(allProducts) 
      ? allProducts.reduce((sum, product) => {
          const price = typeof product.price === 'number' ? product.price : 0
          const stock = typeof product.stock === 'number' ? product.stock : 0
          return sum + (price * stock)
        }, 0)
      : 0

    // Get category distribution with retry and error handling
    let categoryStats: any[] = []
    try {
      const result = await executeWithRetry(
        () => Product.aggregate([
          { $match: { status: 'active' } },
          { $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'categoryInfo'
          }},
          { $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true } },
          { $group: {
            _id: '$categoryInfo.name',
            count: { $sum: 1 },
            totalValue: { $sum: { $multiply: ['$price', '$stock'] } }
          }},
          { $sort: { count: -1 } }
        ]),
        'Category stats',
        5
      )
      categoryStats = Array.isArray(result) ? result : []
    } catch (error: any) {
      console.error('Error fetching category stats:', error?.message || error)
      categoryStats = []
    }

    // Get price range statistics with retry and error handling
    let priceStats: any[] = []
    try {
      const result = await executeWithRetry(
        () => Product.aggregate([
          { $match: { status: 'active' } },
          { $group: {
            _id: null,
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' },
            avgPrice: { $avg: '$price' }
          }}
        ]),
        'Price stats',
        5
      )
      priceStats = Array.isArray(result) ? result : []
    } catch (error: any) {
      console.error('Error fetching price stats:', error?.message || error)
      priceStats = []
    }

    const stats = {
      totalProducts: totalProducts || 0,
      activeProducts: activeProducts || 0,
      outOfStockProducts: outOfStockProducts || 0,
      totalStockValue: totalStockValue || 0,
      categoryStats: Array.isArray(categoryStats) ? categoryStats : [],
      priceStats: Array.isArray(priceStats) && priceStats.length > 0 
        ? priceStats[0] 
        : { minPrice: 0, maxPrice: 0, avgPrice: 0 },
      categories: Array.isArray(categories) 
        ? categories.map((cat: any) => ({ 
            name: cat?.name || '', 
            slug: cat?.slug || '' 
          }))
        : []
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error: any) {
    console.error('Products stats API error:', error?.message || error)
    console.error('Full error:', error)
    return createErrorResponse(error, 'Failed to fetch product statistics')
  }
}
