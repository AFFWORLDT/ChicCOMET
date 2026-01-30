import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { executeWithRetry } from '@/lib/mongodb-operations'
import Category from '@/lib/models/Category'
import { createErrorResponse } from '@/lib/error-handler'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')
    const parent = searchParams.get('parent')

    // Build filter object
    const filter: any = {}

    if (active === 'true') {
      filter.isActive = true
    }

    if (parent) {
      filter.parent = parent
    } else {
      filter.parent = null // Only top-level categories
    }

    const categories = await executeWithRetry(
      () => Category.find(filter)
        .sort({ sortOrder: 1, name: 1 })
        .lean(),
      'Category query',
      5
    )

    return NextResponse.json({
      success: true,
      data: categories || []
    })
  } catch (error: any) {
    console.error('Error fetching categories:', error)
    return createErrorResponse(error, 'Failed to fetch categories')
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      )
    }
    
    const newCategory = new Category(body)
    await newCategory.save()
    
    return NextResponse.json({
      success: true,
      data: newCategory
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
