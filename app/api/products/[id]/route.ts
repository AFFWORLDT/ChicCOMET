import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import mongoose from 'mongoose'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await params
    let query = {}
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id }
    } else {
      query = { sku: id }
    }

    const product = await Product.findOne(query).populate('category', 'name slug').lean()

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Ensure images and washing instructions are properly formatted
    const p = product as any
    const formattedProduct = {
      ...p,
      images: p.images && p.images.length > 0
        ? p.images
        : (p.image ? [p.image] : []),
      washingInstructions: Array.isArray(p.washingInstructions) ? p.washingInstructions : [],
      subCategory: p.subCategory || ""
    }

    return NextResponse.json({
      success: true,
      data: formattedProduct
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await params
    const body = await request.json()

    console.log(`[API:PUT] Received request for product ${id}`)
    console.log(`[API:PUT] Body keys:`, Object.keys(body))
    console.log(`[API:PUT] washingInstructions in body:`, body.washingInstructions)

    // Ensure images array is properly synced with image field
    let updateData = { ...body, updatedAt: new Date() }

    // If image is provided, ensure it's in the images array
    if (body.image) {
      if (Array.isArray(body.images) && body.images.length > 0) {
        // If images array exists, ensure the new image is at the first position
        if (!body.images.includes(body.image)) {
          updateData.images = [body.image, ...body.images.filter((img: string) => img !== body.image)]
        } else {
          // Move the image to first position if it exists
          updateData.images = [body.image, ...body.images.filter((img: string) => img !== body.image)]
        }
      } else {
        // If no images array, create one with the image
        updateData.images = [body.image]
      }
    } else if (body.images && Array.isArray(body.images) && body.images.length > 0) {
      // If images array is provided but no image field, set image to first image
      updateData.image = body.images[0]
    }

    console.log(`[API:PUT] updateData.washingInstructions before DB:`, updateData.washingInstructions)
    console.log(`[API:PUT] Full updateData keys:`, Object.keys(updateData))

    // Use direct MongoDB update to bypass Mongoose model issues
    const db = mongoose.connection.db

    if (!db) {
      console.error('[API:PUT] Database connection not available')
      throw new Error('Database connection not available')
    }

    // Perform direct MongoDB update
    const updateResult = await db.collection('products').updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: updateData }
    )

    console.log(`[API:PUT] Direct MongoDB update - modified:`, updateResult.modifiedCount)

    // Fetch the updated product
    const product = await Product.findById(id).lean()

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    console.log(`[API:PUT] Product fetched after update`)
    console.log(`[API:PUT] washingInstructions from DB:`, product.washingInstructions)

    // Ensure the response includes properly formatted images and instructions
    const formattedProduct = {
      ...product,
      images: product.images && product.images.length > 0
        ? product.images
        : (product.image ? [product.image] : []),
      washingInstructions: Array.isArray(product.washingInstructions) ? product.washingInstructions : []
    }

    return NextResponse.json({
      success: true,
      data: formattedProduct
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await params
    const product = await Product.findByIdAndDelete(id)

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}