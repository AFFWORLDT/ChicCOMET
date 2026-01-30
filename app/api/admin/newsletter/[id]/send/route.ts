import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Newsletter from '@/lib/models/Newsletter'
import NewsletterSubscriber from '@/lib/models/NewsletterSubscriber'
import { sendNewsletterEmail } from '@/lib/email-service'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params

    const body = await request.json()
    const { testEmail, targetSegments = [] } = body

    const newsletter = await Newsletter.findById(id)

    if (!newsletter) {
      return NextResponse.json(
        { success: false, error: 'Newsletter not found' },
        { status: 404 }
      )
    }

    if (newsletter.status === 'sent') {
      return NextResponse.json(
        { success: false, error: 'Newsletter has already been sent' },
        { status: 400 }
      )
    }

    // Test email
    if (testEmail) {
      try {
        await sendNewsletterEmail({
          to: testEmail,
          subject: `[TEST] ${newsletter.subject}`,
          htmlContent: newsletter.htmlContent,
          newsletterId: newsletter._id.toString(),
          subscriberId: 'test'
        })

        return NextResponse.json({
          success: true,
          message: 'Test email sent successfully',
          data: { testEmail }
        })
      } catch (error) {
        console.error('Error sending test email:', error)
        return NextResponse.json(
          { success: false, error: 'Failed to send test email' },
          { status: 500 }
        )
      }
    }

    // Get target subscribers
    const filter: any = { status: 'active' }
    
    if (targetSegments.length > 0) {
      filter.tags = { $in: targetSegments }
    }

    if (newsletter.segments.length > 0) {
      filter.tags = { $in: newsletter.segments }
    }

    const subscribers = await NewsletterSubscriber.find(filter)
    const recipientCount = subscribers.length

    if (recipientCount === 0) {
      return NextResponse.json(
        { success: false, error: 'No active subscribers found for the specified criteria' },
        { status: 400 }
      )
    }

    // Update newsletter status
    newsletter.status = 'sending'
    newsletter.recipientCount = recipientCount
    await newsletter.save()

    // Send emails in batches
    const batchSize = 10
    let sentCount = 0
    let failedCount = 0

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize)
      
      const emailPromises = batch.map(async (subscriber) => {
        try {
          await sendNewsletterEmail({
            to: subscriber.email,
            subject: newsletter.subject,
            htmlContent: newsletter.htmlContent,
            newsletterId: newsletter._id.toString(),
            subscriberId: subscriber._id.toString()
          })

          // Update subscriber's last email sent date
          subscriber.lastEmailSent = new Date()
          await subscriber.save()

          sentCount++
        } catch (error) {
          console.error(`Error sending email to ${subscriber.email}:`, error)
          failedCount++
        }
      })

      await Promise.all(emailPromises)

      // Add delay between batches to avoid rate limiting
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    // Update newsletter status
    newsletter.status = 'sent'
    newsletter.sentDate = new Date()
    await newsletter.save()

    console.log(`Newsletter sent: ${sentCount} successful, ${failedCount} failed`)

    return NextResponse.json({
      success: true,
      message: 'Newsletter sent successfully',
      data: {
        recipientCount,
        sentCount,
        failedCount,
        newsletterId: newsletter._id
      }
    })

  } catch (error) {
    console.error('Error sending newsletter:', error)
    
    // Update newsletter status to failed
    try {
      await connectDB()
      const newsletter = await Newsletter.findById(id)
      if (newsletter) {
        newsletter.status = 'failed'
        await newsletter.save()
      }
    } catch (updateError) {
      console.error('Error updating newsletter status:', updateError)
    }

    return NextResponse.json(
      { success: false, error: 'Failed to send newsletter' },
      { status: 500 }
    )
  }
}
