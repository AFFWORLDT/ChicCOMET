import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import NewsletterSubscriber from '@/lib/models/NewsletterSubscriber'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status')
    const source = searchParams.get('source')
    const search = searchParams.get('search')

    // Build filter
    const filter: any = {}
    if (status) filter.status = status
    if (source) filter.source = source
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ]
    }

    // Get subscribers with pagination
    const subscribers = await NewsletterSubscriber.find(filter)
      .sort({ subscriptionDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    const total = await NewsletterSubscriber.countDocuments(filter)

    return NextResponse.json({
      success: true,
      data: {
        subscribers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('Error fetching subscribers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscribers' },
      { status: 500 }
    )
  }
}
