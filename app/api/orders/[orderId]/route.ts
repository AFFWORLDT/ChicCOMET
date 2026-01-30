import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { executeWithRetry } from '@/lib/mongodb-operations'
import Order from '@/lib/models/Order'
import { createErrorResponse } from '@/lib/error-handler'

// GET single order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await connectDB()
    const { orderId } = await params

    const order = await executeWithRetry(
      () => Order.findById(orderId)
        .populate('user', 'name email phone')
        .populate('items.product', 'name image')
        .lean(),
      'Order fetch',
      5
    )

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: order
    })
  } catch (error) {
    console.error('Error fetching order:', error)
    return createErrorResponse(error, 'Failed to fetch order')
  }
}

// PUT/PATCH - Update order status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await connectDB()
    const { orderId } = await params
    
    const body = await request.json()
    const { status, paymentStatus, notes, trackingNumber } = body

    if (!status && !paymentStatus && !trackingNumber) {
      return NextResponse.json(
        { success: false, error: 'At least one field (status, paymentStatus, or trackingNumber) is required' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (status) {
      updateData.status = status
      updateData.updatedAt = new Date()
    }
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus
      updateData.updatedAt = new Date()
    }
    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber
      updateData.updatedAt = new Date()
    }
    if (notes !== undefined) {
      updateData.notes = notes
    }

    const order = await executeWithRetry(
      () => Order.findByIdAndUpdate(
        orderId,
        { $set: updateData },
        { new: true, runValidators: true }
      )
        .populate('user', 'name email phone')
        .populate('items.product', 'name image')
        .lean(),
      'Order update',
      5
    )

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
    return createErrorResponse(error, 'Failed to update order')
  }
}

// PATCH - Partial update (same as PUT)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  return PUT(request, { params })
}

