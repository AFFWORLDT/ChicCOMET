import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Fetch only necessary fields to minimize data transfer
    const products = await Product.find({}, 'name subCategory').lean()

    const categoryMap: Record<string, Set<string>> = {}

    products.forEach((p: any) => {
      // Ensure we have valid strings
      const subCategory = p.subCategory?.trim()
      const name = p.name?.trim()

      if (subCategory) {
        if (!categoryMap[subCategory]) {
          categoryMap[subCategory] = new Set()
        }
        if (name) {
          categoryMap[subCategory].add(name)
        }
      }
    })

    // Convert Sets to Arrays and sort
    const result: Record<string, string[]> = {}
    Object.keys(categoryMap).sort().forEach(key => {
      result[key] = Array.from(categoryMap[key]).sort()
    })

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Error fetching product metadata:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product metadata' },
      { status: 500 }
    )
  }
}
