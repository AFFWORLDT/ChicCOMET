import { NextRequest, NextResponse } from 'next/server'
import { NewsletterAutomationService } from '@/lib/newsletter-automation'

// POST - Trigger automation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, email, data } = body

    if (!type || !email) {
      return NextResponse.json(
        { success: false, error: 'Type and email are required' },
        { status: 400 }
      )
    }

    let result

    switch (type) {
      case 'welcome':
        result = await NewsletterAutomationService.triggerWelcomeEmail(email, data?.name)
        break
      case 'abandoned_cart':
        result = await NewsletterAutomationService.triggerAbandonedCartEmail(email, data?.cartItems || [])
        break
      case 'product_launch':
        result = await NewsletterAutomationService.triggerProductLaunchEmail(data)
        break
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid automation type' },
          { status: 400 }
        )
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        data: result
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error triggering automation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to trigger automation' },
      { status: 500 }
    )
  }
}

// GET - Process scheduled newsletters (for cron jobs)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'process-scheduled') {
      const result = await NewsletterAutomationService.processScheduledNewsletters()
      return NextResponse.json(result)
    } else if (action === 'cleanup') {
      const result = await NewsletterAutomationService.cleanupOldData()
      return NextResponse.json(result)
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error processing automation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process automation' },
      { status: 500 }
    )
  }
}
