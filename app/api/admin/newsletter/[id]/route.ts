import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Newsletter from '@/lib/models/Newsletter'
import NewsletterSubscriber from '@/lib/models/NewsletterSubscriber'
import { sendNewsletterEmail } from '@/lib/email-service'

// GET - Get specific newsletter
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params

    const newsletter = await Newsletter.findById(id)
      .populate('metadata.createdBy', 'name email')

    if (!newsletter) {
      return NextResponse.json(
        { success: false, error: 'Newsletter not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: newsletter
    })

  } catch (error) {
    console.error('Error fetching newsletter:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch newsletter' },
      { status: 500 }
    )
  }
}

// PUT - Update newsletter
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params

    const body = await request.json()
    const {
      title,
      subject,
      content,
      htmlContent,
      type,
      scheduledDate,
      tags,
      segments,
      template
    } = body

    const newsletter = await Newsletter.findById(id)

    if (!newsletter) {
      return NextResponse.json(
        { success: false, error: 'Newsletter not found' },
        { status: 404 }
      )
    }

    // Update fields
    if (title) newsletter.title = title
    if (subject) newsletter.subject = subject
    if (content) newsletter.content = content
    if (htmlContent) newsletter.htmlContent = htmlContent
    if (type) newsletter.type = type
    if (scheduledDate) newsletter.scheduledDate = new Date(scheduledDate)
    if (tags) newsletter.tags = tags
    if (segments) newsletter.segments = segments
    if (template) newsletter.template = template

    newsletter.metadata.lastModifiedBy = 'admin' // In real app, get from auth

    await newsletter.save()

    return NextResponse.json({
      success: true,
      message: 'Newsletter updated successfully',
      data: newsletter
    })

  } catch (error) {
    console.error('Error updating newsletter:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update newsletter' },
      { status: 500 }
    )
  }
}

// DELETE - Delete newsletter
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params

    const newsletter = await Newsletter.findById(id)

    if (!newsletter) {
      return NextResponse.json(
        { success: false, error: 'Newsletter not found' },
        { status: 404 }
      )
    }

    // Don't allow deletion of sent newsletters
    if (newsletter.status === 'sent') {
      return NextResponse.json(
        { success: false, error: 'Cannot delete sent newsletters' },
        { status: 400 }
      )
    }

    await Newsletter.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: 'Newsletter deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting newsletter:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete newsletter' },
      { status: 500 }
    )
  }
}
