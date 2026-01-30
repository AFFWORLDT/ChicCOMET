import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import NewsletterSubscriber from '@/lib/models/NewsletterSubscriber'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { email, token } = body

    if (!email && !token) {
      return NextResponse.json(
        { success: false, error: 'Email or unsubscribe token is required' },
        { status: 400 }
      )
    }

    let subscriber

    if (token) {
      // Unsubscribe by token
      subscriber = await NewsletterSubscriber.findOne({ 
        unsubscribeToken: token,
        status: 'active'
      })
    } else if (email) {
      // Unsubscribe by email
      subscriber = await NewsletterSubscriber.findOne({ 
        email: email.toLowerCase().trim(),
        status: 'active'
      })
    }

    if (!subscriber) {
      return NextResponse.json(
        { success: false, error: 'Subscriber not found or already unsubscribed' },
        { status: 404 }
      )
    }

    // Update subscriber status
    subscriber.status = 'unsubscribed'
    subscriber.unsubscribeDate = new Date()
    await subscriber.save()

    console.log(`Newsletter unsubscribed: ${subscriber.email}`)

    return NextResponse.json({
      success: true,
      message: 'You have been successfully unsubscribed from our newsletter.',
      data: {
        email: subscriber.email,
        status: subscriber.status,
        unsubscribeDate: subscriber.unsubscribeDate
      }
    })

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    if (!token && !email) {
      return NextResponse.json(
        { success: false, error: 'Token or email parameter is required' },
        { status: 400 }
      )
    }

    let subscriber

    if (token) {
      subscriber = await NewsletterSubscriber.findOne({ 
        unsubscribeToken: token,
        status: 'active'
      })
    } else if (email) {
      subscriber = await NewsletterSubscriber.findOne({ 
        email: email.toLowerCase().trim(),
        status: 'active'
      })
    }

    if (!subscriber) {
      return NextResponse.json(
        { success: false, error: 'Subscriber not found or already unsubscribed' },
        { status: 404 }
      )
    }

    // Update subscriber status
    subscriber.status = 'unsubscribed'
    subscriber.unsubscribeDate = new Date()
    await subscriber.save()

    console.log(`Newsletter unsubscribed via GET: ${subscriber.email}`)

    // Return HTML page for direct link unsubscription
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Unsubscribed - Whitlin</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
          .container { max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .success { color: #10b981; font-size: 24px; margin-bottom: 20px; }
          .message { color: #666; margin-bottom: 30px; }
          .button { background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success">✓ Unsubscribed Successfully</div>
          <div class="message">
            You have been unsubscribed from our newsletter. We're sorry to see you go!
          </div>
          <a href="/" class="button">Return to Homepage</a>
        </div>
      </body>
      </html>
    `

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    })

  } catch (error) {
    console.error('Newsletter unsubscribe GET error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
