import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'

export async function GET() {
  try {
    await connectDB()
    
    // Get a few products to test
    const products = await Product.find({ status: 'active' })
      .populate('category', 'name slug')
      .limit(5)
      .lean()
    
    console.log('Test products:', products.map(p => ({
      name: p.name,
      image: p.image,
      images: p.images,
      hasImage: !!p.image,
      hasImages: p.images && p.images.length > 0
    })))
    
    return NextResponse.json({
      success: true,
      data: products.map(product => ({
        ...product,
        images: product.images && product.images.length > 0 
          ? product.images 
          : (product.image ? [product.image] : [])
      }))
    })
  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch test products' },
      { status: 500 }
    )
  }
}