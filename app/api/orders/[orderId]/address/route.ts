import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await connectDB()
    
    const { orderId } = await params
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Get authenticated user
    const userData = getUserFromCookie(request)
    if (!userData || !userData.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required. Please log in to update order address.' },
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Find user in database
    const user = await User.findOne({ email: userData.email.toLowerCase().trim() })
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    const body = await request.json()
    const { name, address, city, state, zipCode, country, phone } = body
    
    // Validate required fields
    if (!name || !address || !city || !state || !zipCode || !country) {
      return NextResponse.json(
        { success: false, error: 'All address fields (name, address, city, state, zipCode, country) are required' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Try to find order by _id (MongoDB ObjectId) first, then by orderNumber
    let order = null
    let query: any = {}
    
    // Check if orderId is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(orderId)) {
      query = { _id: orderId, user: user._id }
    } else {
      query = { orderNumber: orderId, user: user._id }
    }
    
    // Find and update the order
    const updatedOrder = await Order.findOneAndUpdate(
      query,
      {
        $set: {
          'shippingAddress.name': name.trim(),
          'shippingAddress.address': address.trim(),
          'shippingAddress.city': city.trim(),
          'shippingAddress.state': state.trim(),
          'shippingAddress.zipCode': zipCode.trim(),
          'shippingAddress.country': country.trim(),
          'shippingAddress.phone': phone ? phone.trim() : '',
          updatedAt: new Date()
        }
      },
      { new: true }
    )
      .populate('user', 'name email')
      .lean()
    
    if (!updatedOrder) {
      console.log(`❌ Order not found: ${orderId} for user: ${user.email}`)
      return NextResponse.json(
        { success: false, error: 'Order not found or you do not have permission to update this order' },
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Verify ownership
    const orderUserId = typeof updatedOrder.user === 'object' && updatedOrder.user !== null 
      ? (updatedOrder.user as any)._id?.toString() 
      : updatedOrder.user?.toString()
    
    if (orderUserId !== user._id.toString()) {
      console.log(`❌ Unauthorized address update attempt: User ${user._id} tried to update order ${orderId} owned by ${orderUserId}`)
      return NextResponse.json(
        { success: false, error: 'Unauthorized access to this order' },
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    console.log(`✅ Shipping address updated successfully for order ${orderId} by user ${user.email}`)
    
    return NextResponse.json({
      success: true,
      message: 'Address updated successfully',
      data: {
        orderId: updatedOrder._id,
        shippingAddress: updatedOrder.shippingAddress
      }
    }, { headers: { 'Content-Type': 'application/json' } })
    
  } catch (error: any) {
    console.error('Error updating order address:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
