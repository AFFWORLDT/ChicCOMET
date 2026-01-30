import { NextRequest, NextResponse } from 'next/server'
import { NewsletterAutomationService } from '@/lib/newsletter-automation'

// This endpoint should be called by a cron job service (like Vercel Cron, GitHub Actions, etc.)
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from a legitimate cron service
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key'
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Starting newsletter automation cron job...')

    // Process scheduled newsletters
    const scheduledResult = await NewsletterAutomationService.processScheduledNewsletters()
    console.log('Scheduled newsletters result:', scheduledResult)

    // Clean up old data (run once per day)
    const now = new Date()
    const shouldCleanup = now.getHours() === 2 && now.getMinutes() < 5 // Run cleanup at 2 AM
    
    let cleanupResult = null
    if (shouldCleanup) {
      cleanupResult = await NewsletterAutomationService.cleanupOldData()
      console.log('Cleanup result:', cleanupResult)
    }

    return NextResponse.json({
      success: true,
      message: 'Newsletter automation cron job completed',
      data: {
        scheduled: scheduledResult,
        cleanup: cleanupResult,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Newsletter automation cron job error:', error)
    return NextResponse.json(
      { success: false, error: 'Cron job failed' },
      { status: 500 }
    )
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

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
    console.error('Manual automation trigger error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to trigger automation' },
      { status: 500 }
    )
  }
}
