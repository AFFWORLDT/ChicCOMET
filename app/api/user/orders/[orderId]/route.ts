import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import Product from '@/lib/models/Product'
import User from '@/lib/models/User'
import mongoose from 'mongoose'

// Helper to get user from cookie
function getUserFromCookie(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie')
    if (!cookieHeader) return null
    
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      if (key && value) {
        acc[key] = decodeURIComponent(value)
      }
      return acc
    }, {} as Record<string, string>)
    
    const userCookie = cookies['whitlin_user']
    if (!userCookie) return null
    
    const userData = JSON.parse(userCookie)
    return userData
  } catch (error) {
    console.error('Error parsing user cookie:', error)
    return null
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await connectDB()
    
    const { orderId } = await params
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      )
    }
    
    // Get authenticated user from cookie
    const userData = getUserFromCookie(request)
    if (!userData || !userData.email) {
      console.log('No user cookie found or invalid cookie')
      return NextResponse.json(
        { success: false, error: 'Authentication required. Please log in to view your orders.' },
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Find user in database
    const user = await User.findOne({ email: userData.email.toLowerCase().trim() })
    if (!user) {
      console.log(`User not found in database: ${userData.email}`)
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    console.log(`Fetching order ${orderId} for user: ${user.email}`)
    
    // Try to find order by _id (MongoDB ObjectId) first, then by orderNumber
    let order = null
    
    // Check if orderId is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(orderId)) {
      order = await Order.findOne({ 
        _id: orderId,
        user: user._id // Ensure order belongs to the user
      })
        .populate('user', 'name email')
        .populate({
          path: 'items.product',
          select: 'name image price',
          model: 'Product'
        })
        .lean()
    }
    
    // If not found by _id, try orderNumber
    if (!order) {
      order = await Order.findOne({ 
        orderNumber: orderId,
        user: user._id // Ensure order belongs to the user
      })
        .populate('user', 'name email')
        .populate({
          path: 'items.product',
          select: 'name image price',
          model: 'Product'
        })
        .lean()
    }
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }
    
    // Double-check ownership (security)
    const orderUserId = typeof order.user === 'object' && order.user !== null 
      ? (order.user as any)._id?.toString() 
      : order.user?.toString()
    
    if (orderUserId !== user._id.toString()) {
      console.log(`❌ Unauthorized access attempt: User ${user._id} tried to access order ${orderId} owned by ${orderUserId}`)
      return NextResponse.json(
        { success: false, error: 'Unauthorized access to this order' },
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Format order items to ensure consistent structure
    const formattedOrder = {
      ...order,
      items: order.items.map((item: any) => {
        const product = item.product
        return {
          ...item,
          name: product?.name || item.name || 'Product',
          image: product?.image || item.image || '/placeholder.svg',
          price: item.price || 0,
          quantity: item.quantity || 0,
          total: (item.price || 0) * (item.quantity || 0)
        }
      })
    }
    
    console.log(`✅ Order ${orderId} fetched successfully for user ${user.email}`)
    
    return NextResponse.json({
      success: true,
      data: formattedOrder
    }, { headers: { 'Content-Type': 'application/json' } })
    
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await connectDB()
    
    const { orderId } = await params
    const { status, paymentStatus, notes } = await request.json()
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      )
    }
    
    const updateData: any = {}
    if (status) updateData.status = status
    if (paymentStatus) updateData.paymentStatus = paymentStatus
    if (notes !== undefined) updateData.notes = notes
    
    const order = await Order.findOneAndUpdate(
      { orderNumber: orderId },
      updateData,
      { new: true }
    )
      .populate('user', 'name email')
      .populate('items.product', 'name image')
      .lean()
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order updated successfully'
    })
    
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    )
  }
}