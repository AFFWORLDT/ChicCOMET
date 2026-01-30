import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { executeWithRetry } from '@/lib/mongodb-operations'
import Product from '@/lib/models/Product'
import Order from '@/lib/models/Order'
import User from '@/lib/models/User'
import { createErrorResponse } from '@/lib/error-handler'
import { requireAdmin } from '@/lib/check-admin-auth'

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const authError = await requireAdmin(request)
    if (authError) return authError
    
    await connectDB()

    // Get current date and previous month for comparison
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Fetch all data in parallel with retry logic
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      recentOrders,
      topProducts,
      lastMonthProducts,
      lastMonthOrders,
      lastMonthUsers,
      lastMonthRevenue,
      thisMonthRevenue
    ] = await Promise.all([
      // Current totals with retry
      executeWithRetry(() => Product.countDocuments({ status: 'active' }), 'Product count', 5),
      executeWithRetry(() => Order.countDocuments(), 'Order count', 5),
      executeWithRetry(() => User.countDocuments(), 'User count', 5),
      
      // Recent orders (last 5) with retry
      executeWithRetry(
        () => Order.find()
          .populate('user', 'name email')
          .sort({ createdAt: -1 })
          .limit(5)
          .lean(),
        'Recent orders',
        5
      ),
      
      // Top products (best selling) with retry
      executeWithRetry(
        () => Product.aggregate([
          { $match: { status: 'active' } },
          { $lookup: {
            from: 'orderitems',
            localField: '_id',
            foreignField: 'product',
            as: 'orderItems'
          }},
          { $addFields: {
            totalSales: { $sum: '$orderItems.quantity' },
            totalRevenue: { $sum: { $multiply: ['$price', { $sum: '$orderItems.quantity' }] } }
          }},
          { $sort: { totalSales: -1 } },
          { $limit: 5 },
          { $project: {
            name: 1,
            price: 1,
            totalSales: 1,
            totalRevenue: 1,
            images: 1
          }}
        ]),
        'Top products',
        5
      ),

      // Last month data for comparison with retry
      executeWithRetry(
        () => Product.countDocuments({ 
          status: 'active',
          createdAt: { $lt: thisMonth }
        }),
        'Last month products',
        5
      ),
      executeWithRetry(
        () => Order.countDocuments({ 
          createdAt: { $lt: thisMonth }
        }),
        'Last month orders',
        5
      ),
      executeWithRetry(
        () => User.countDocuments({ 
          createdAt: { $lt: thisMonth }
        }),
        'Last month users',
        5
      ),
      
      // Revenue calculations with retry
      executeWithRetry(
        () => Order.aggregate([
          { $match: { 
            createdAt: { $gte: lastMonth, $lt: thisMonth },
            status: { $in: ['completed', 'shipped'] }
          }},
          { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]),
        'Last month revenue',
        5
      ),
      executeWithRetry(
        () => Order.aggregate([
          { $match: { 
            createdAt: { $gte: thisMonth },
            status: { $in: ['completed', 'shipped'] }
          }},
          { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]),
        'This month revenue',
        5
      )
    ])

    // Calculate growth percentages
    const productGrowth = lastMonthProducts > 0 
      ? Math.round(((totalProducts - lastMonthProducts) / lastMonthProducts) * 100)
      : 0

    const orderGrowth = lastMonthOrders > 0 
      ? Math.round(((totalOrders - lastMonthOrders) / lastMonthOrders) * 100)
      : 0

    const userGrowth = lastMonthUsers > 0 
      ? Math.round(((totalUsers - lastMonthUsers) / lastMonthUsers) * 100)
      : 0

    const lastMonthRevenueTotal = lastMonthRevenue[0]?.total || 0
    const thisMonthRevenueTotal = thisMonthRevenue[0]?.total || 0
    const revenueGrowth = lastMonthRevenueTotal > 0 
      ? Math.round(((thisMonthRevenueTotal - lastMonthRevenueTotal) / lastMonthRevenueTotal) * 100)
      : 0

    // Format recent orders
    const formattedRecentOrders = recentOrders.map(order => ({
      id: order.orderNumber || order._id.toString().slice(-8).toUpperCase(),
      customer: order.user?.name || order.shippingAddress?.name || 'Guest',
      amount: order.totalAmount,
      status: order.status,
      date: new Date(order.createdAt).toISOString().split('T')[0]
    }))

    // Format top products
    const formattedTopProducts = topProducts.map(product => ({
      name: product.name,
      sales: product.totalSales || 0,
      revenue: product.totalRevenue || 0,
      rating: 4.8 // Default rating, can be calculated from reviews later
    }))

    const dashboardData = {
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue: thisMonthRevenueTotal,
        productGrowth,
        orderGrowth,
        userGrowth,
        revenueGrowth
      },
      recentOrders: formattedRecentOrders,
      topProducts: formattedTopProducts
    }

    return NextResponse.json({
      success: true,
      data: dashboardData
    })

  } catch (error: any) {
    console.error('Dashboard API error:', error)
    return createErrorResponse(error, 'Failed to fetch dashboard data')
  }
}
