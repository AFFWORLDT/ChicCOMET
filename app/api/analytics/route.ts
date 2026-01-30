import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { executeWithRetry } from '@/lib/mongodb-operations'
import Order from '@/lib/models/Order'
import User from '@/lib/models/User'
import Product from '@/lib/models/Product'
import { createErrorResponse } from '@/lib/error-handler'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    // Get total counts with retry
    const [totalUsers, totalOrders, totalProducts] = await Promise.all([
      executeWithRetry(() => User.countDocuments({ role: 'customer' }), 'User count', 5),
      executeWithRetry(() => Order.countDocuments(), 'Order count', 5),
      executeWithRetry(() => Product.countDocuments({ status: 'active' }), 'Product count', 5)
    ])
    
    // Get total revenue with retry
    const revenueResult = await executeWithRetry(
      () => Order.aggregate([
        { $match: { status: { $in: ['delivered', 'shipped', 'processing'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      'Revenue calculation',
      5
    )
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0
    
    // Get recent orders with retry
    const recentOrders = await executeWithRetry(
      () => Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      'Recent orders',
      5
    )
    
    // Get top products (based on order items) with retry
    const topProductsResult = await executeWithRetry(
      () => Order.aggregate([
        { $unwind: '$items' },
        { $group: { 
            _id: '$items.product', 
            totalQuantity: { $sum: '$items.quantity' },
            totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
          } 
        },
        { $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        { $project: {
            name: '$product.name',
            sales: '$totalQuantity',
            revenue: '$totalRevenue',
            rating: '$product.rating'
          }
        },
        { $sort: { sales: -1 } },
        { $limit: 4 }
      ]),
      'Top products',
      5
    )
    
    // Get monthly sales data (last 4 months) with retry
    const monthlySales = await executeWithRetry(
      () => Order.aggregate([
        { $match: { status: { $in: ['delivered', 'shipped', 'processing'] } } },
        { $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            revenue: { $sum: '$totalAmount' },
            orders: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 4 }
      ]),
      'Monthly sales',
      5
    )
    
    // Format monthly data
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const salesData = monthlySales.map(item => ({
      month: monthNames[item._id.month - 1],
      revenue: item.revenue,
      orders: item.orders
    }))
    
    // Calculate conversion rate (simplified)
    const conversionRate = totalUsers > 0 ? ((totalOrders / totalUsers) * 100).toFixed(1) : 0
    
    // Calculate average order value
    const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0
    
    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalRevenue,
          totalOrders,
          totalUsers,
          conversionRate: parseFloat(conversionRate),
          avgOrderValue: parseFloat(avgOrderValue)
        },
        salesData,
        topProducts: topProductsResult,
        recentOrders: recentOrders.map(order => ({
          id: order.orderNumber,
          customer: order.user?.name || 'Unknown',
          total: order.totalAmount,
          status: order.status,
          createdAt: order.createdAt
        }))
      }
    })
  } catch (error: any) {
    console.error('Error fetching analytics:', error)
    return createErrorResponse(error, 'Failed to fetch analytics data')
  }
}
