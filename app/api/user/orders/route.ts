import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import Product from '@/lib/models/Product'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    // Get user ID from query params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    // Get user's orders with populated product details
    const orders = await Order.find({ user: userId })
      .populate({
        path: 'items.product',
        select: 'name price image'
      })
      .sort({ createdAt: -1 })
      .lean()
    
    // Format orders for frontend
    const formattedOrders = orders.map(order => ({
      id: order.orderNumber,
      orderNumber: order.orderNumber,
      date: order.createdAt.toISOString().split('T')[0],
      status: order.status,
      total: order.totalAmount,
      items: order.items.map((item: any) => ({
        name: item.product?.name || 'Product not found',
        quantity: item.quantity,
        price: item.price,
        image: item.product?.image || '/placeholder.svg'
      })),
      shippingAddress: order.shippingAddress || 'Address not provided',
      trackingNumber: order.trackingNumber || null,
      estimatedDelivery: order.estimatedDelivery || null,
      paymentMethod: order.paymentMethod || 'Credit Card',
      orderId: order._id
    }))
    
    return NextResponse.json({
      success: true,
      data: formattedOrders
    })
  } catch (error) {
    console.error('Error fetching user orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
