import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
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
    
    // Get user with wishlist populated
    const user = await User.findById(userId)
      .populate({
        path: 'wishlist',
        select: 'name price image description category inStock stock'
      })
      .lean()
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    console.log('User wishlist:', user.wishlist)
    
    // Format wishlist items
    const wishlistItems = user.wishlist?.map((item: any) => ({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      description: item.description,
      category: item.category,
      inStock: item.inStock,
      stock: item.stock,
      addedAt: new Date().toISOString() // TODO: Store actual added date
    })) || []
    
    console.log('Formatted wishlist items:', wishlistItems)
    
    return NextResponse.json({
      success: true,
      data: wishlistItems
    })
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { userId, productId } = await request.json()
    
    if (!userId || !productId) {
      return NextResponse.json(
        { success: false, error: 'User ID and Product ID are required' },
        { status: 400 }
      )
    }
    
    // Check if product exists
    const product = await Product.findById(productId)
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    console.log('Adding product to wishlist:', { userId, productId })
    
    // Add product to user's wishlist
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: productId } },
      { new: true }
    )
    
    console.log('Updated user wishlist:', user?.wishlist)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Product added to wishlist'
    })
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add product to wishlist' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const productId = searchParams.get('productId')
    
    if (!userId || !productId) {
      return NextResponse.json(
        { success: false, error: 'User ID and Product ID are required' },
        { status: 400 }
      )
    }
    
    // Remove product from user's wishlist
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: productId } },
      { new: true }
    )
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Product removed from wishlist'
    })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to remove product from wishlist' },
      { status: 500 }
    )
  }
}
