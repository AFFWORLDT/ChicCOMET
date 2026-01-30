import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import NewsletterSubscriber from '@/lib/models/NewsletterSubscriber'
import { sendWelcomeEmail } from '@/lib/email-service'
import { apiRateLimit } from '@/lib/rate-limit'
import { NewsletterAutomationService } from '@/lib/newsletter-automation'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = apiRateLimit(request)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    await connectDB()

    const body = await request.json()
    const { email, firstName, lastName, preferences, source = 'website' } = body

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email address is required' },
        { status: 400 }
      )
    }

    // Check if already subscribed
    const existingSubscriber = await NewsletterSubscriber.findOne({ 
      email: email.toLowerCase().trim() 
    })

    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return NextResponse.json(
          { success: false, error: 'Email is already subscribed to our newsletter' },
          { status: 400 }
        )
      } else if (existingSubscriber.status === 'unsubscribed') {
        // Reactivate subscription
        existingSubscriber.status = 'active'
        existingSubscriber.subscriptionDate = new Date()
        existingSubscriber.unsubscribeDate = undefined
        existingSubscriber.firstName = firstName || existingSubscriber.firstName
        existingSubscriber.lastName = lastName || existingSubscriber.lastName
        existingSubscriber.preferences = {
          productUpdates: preferences?.productUpdates ?? true,
          promotions: preferences?.promotions ?? true,
          tips: preferences?.tips ?? true,
          events: preferences?.events ?? true
        }
        existingSubscriber.source = source
        existingSubscriber.metadata = {
          ...existingSubscriber.metadata,
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
          userAgent: request.headers.get('user-agent'),
          referrer: request.headers.get('referer')
        }
        
        await existingSubscriber.save()

        // Send welcome email
        try {
          await sendWelcomeEmail({
            name: `${firstName || ''} ${lastName || ''}`.trim() || 'Valued Customer',
            email: email.toLowerCase().trim()
          })
        } catch (emailError) {
          console.error('Error sending welcome email:', emailError)
          // Don't fail the subscription if email fails
        }

        return NextResponse.json({
          success: true,
          message: 'Welcome back! You have been resubscribed to our newsletter.',
          data: {
            email: existingSubscriber.email,
            status: existingSubscriber.status
          }
        })
      }
    }

    // Create new subscriber
    const crypto = require('crypto')
    const newSubscriber = new NewsletterSubscriber({
      email: email.toLowerCase().trim(),
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      status: 'active',
      source: source,
      unsubscribeToken: crypto.randomBytes(32).toString('hex'),
      preferences: {
        productUpdates: preferences?.productUpdates ?? true,
        promotions: preferences?.promotions ?? true,
        tips: preferences?.tips ?? true,
        events: preferences?.events ?? true
      },
      metadata: {
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
        referrer: request.headers.get('referer')
      }
    })

    await newSubscriber.save()

    // Send welcome email using automation service
    try {
      await NewsletterAutomationService.triggerWelcomeEmail(
        email.toLowerCase().trim(),
        `${firstName || ''} ${lastName || ''}`.trim() || undefined
      )
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError)
      // Don't fail the subscription if email fails
    }

    console.log(`New newsletter subscriber: ${email}`)

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to our newsletter!',
      data: {
        email: newSubscriber.email,
        status: newSubscriber.status,
        unsubscribeToken: newSubscriber.unsubscribeToken
      }
    })

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
