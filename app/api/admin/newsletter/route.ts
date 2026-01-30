import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Newsletter from '@/lib/models/Newsletter'
import NewsletterSubscriber from '@/lib/models/NewsletterSubscriber'
import { sendNewsletterEmail } from '@/lib/email-service'

// GET - List all newsletters
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const search = searchParams.get('search')

    // Build filter
    const filter: any = {}
    if (status) filter.status = status
    if (type) filter.type = type
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ]
    }

    // Get newsletters with pagination
    const newsletters = await Newsletter.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('metadata.createdBy', 'name email')

    const total = await Newsletter.countDocuments(filter)

    return NextResponse.json({
      success: true,
      data: {
        newsletters,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('Error fetching newsletters:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch newsletters' },
      { status: 500 }
    )
  }
}

// POST - Create new newsletter
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const {
      title,
      subject,
      content,
      htmlContent,
      type = 'manual',
      scheduledDate,
      tags = [],
      segments = [],
      template = 'default'
    } = body

    // Validate required fields
    if (!title || !subject || !content || !htmlContent) {
      return NextResponse.json(
        { success: false, error: 'Title, subject, content, and HTML content are required' },
        { status: 400 }
      )
    }

    // Create newsletter
    const newsletter = new Newsletter({
      title,
      subject,
      content,
      htmlContent,
      type,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
      status: scheduledDate ? 'scheduled' : 'draft',
      tags,
      segments,
      template,
      metadata: {
        createdBy: 'admin', // In real app, get from auth
        lastModifiedBy: 'admin'
      }
    })

    await newsletter.save()

    return NextResponse.json({
      success: true,
      message: 'Newsletter created successfully',
      data: newsletter
    })

  } catch (error) {
    console.error('Error creating newsletter:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create newsletter' },
      { status: 500 }
    )
  }
}
