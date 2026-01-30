import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import Order from '@/lib/models/Order'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Get user ID from query params or headers
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get user data with wishlist populated
    const user = await User.findById(userId).populate({
      path: 'wishlist',
      model: 'Product',
      select: 'name price image'
    }) as any

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Get user's orders
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    // Calculate stats
    const totalOrders = orders.length
    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0)
    const memberSince = user.createdAt.toISOString().split('T')[0]

    // Format orders
    const recentOrders = orders.map(order => ({
      id: order.orderNumber,
      date: order.createdAt.toISOString().split('T')[0],
      total: order.totalAmount,
      status: order.status,
      items: order.items.length
    }))

    // Format wishlist items
    const wishlist = (user.wishlist || []).map((item: any) => ({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image
    }))

    // Use the addresses array from the model
    let rawAddresses = user.addresses || []

    // Migration: If array is empty but legacy address exists, migrate it
    if (rawAddresses.length === 0 && user.address && user.address.street) {
      const migratedAddress = {
        type: 'Home',
        street: user.address.street,
        city: user.address.city,
        state: user.address.state,
        zipCode: user.address.zipCode,
        country: user.address.country,
        isDefault: true
      }

      user.addresses.push(migratedAddress)
      await user.save()
      rawAddresses = user.addresses
    }

    const addresses = rawAddresses.map((addr: any) => ({
      id: addr._id,
      type: addr.type,
      address: `${addr.street || addr.address}, ${addr.city}, ${addr.state} ${addr.zipCode}, ${addr.country}`,
      isDefault: addr.isDefault
    }))

    return NextResponse.json({
      success: true,
      data: {
        profile: {
          name: user.name,
          email: user.email,
          phone: user.phone || 'Not provided',
          joinDate: memberSince,
          totalOrders,
          totalSpent
        },
        recentOrders,
        wishlist,
        addresses
      }
    })
  } catch (error) {
    console.error('Error fetching user account:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch account data' },
      { status: 500 }
    )
  }
}
