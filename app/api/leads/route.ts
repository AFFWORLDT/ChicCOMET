import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Lead from '@/lib/models/Lead'
import { sendLeadNotificationEmail } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { 
      name, 
      email, 
      phone, 
      company, 
      subject, 
      message, 
      source = 'website',
      pageUrl,
      utmSource,
      utmMedium,
      utmCampaign
    } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Get client metadata
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referrer = request.headers.get('referer') || 'direct'

    // Determine priority based on source and content
    let priority: 'low' | 'medium' | 'high' = 'medium'
    if (source === 'product-inquiry' || source === 'chatbot') {
      priority = 'high'
    } else if (message && message.length > 100) {
      priority = 'high'
    }

    // Create lead
    const lead = new Lead({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim(),
      company: company?.trim(),
      subject: subject?.trim(),
      message: message?.trim(),
      source,
      status: 'new',
      priority,
      metadata: {
        ipAddress,
        userAgent,
        referrer,
        pageUrl,
        utmSource,
        utmMedium,
        utmCampaign
      }
    })

    await lead.save()

    // Send notification email to admin (don't fail if email fails)
    try {
      await sendLeadNotificationEmail({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        subject: lead.subject,
        message: lead.message,
        source: lead.source
      })
    } catch (emailError) {
      console.error('Error sending lead notification email:', emailError)
      // Don't fail the lead creation if email fails
    }

    console.log(`New lead created: ${lead.email} from ${source}`)

    return NextResponse.json({
      success: true,
      message: 'Thank you for your interest! We will contact you soon.',
      data: {
        leadId: lead._id,
        status: lead.status
      }
    })

  } catch (error: any) {
    console.error('Lead creation error:', error)
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'A lead with this email already exists. We will contact you soon.' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to submit lead. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const source = searchParams.get('source')
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    // Build query
    const query: any = {}
    if (status) query.status = status
    if (source) query.source = source

    // Get leads
    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean()

    // Get total count
    const total = await Lead.countDocuments(query)

    return NextResponse.json({
      success: true,
      data: {
        leads,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

