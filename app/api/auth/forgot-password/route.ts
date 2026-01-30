import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import { authRateLimit } from '@/lib/rate-limit'
import { sendForgotPasswordEmail } from '@/lib/email-service'
import { storeOTP, clearOTP } from '@/lib/otp-store'

// Generate 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = authRateLimit(request)
    if (!rateLimitResult.success) {
      const retryAfter = rateLimitResult.resetTime 
        ? Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        : 60
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many password reset attempts. Please try again later.',
          retryAfter
        },
        { 
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString()
          }
        }
      )
    }

    await connectDB()
    
    const body = await request.json()
    const { email } = body
    
    // Validate input
    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase().trim() })
    
    if (!user) {
      // For security, don't reveal if email exists or not
      return NextResponse.json({
        success: true,
        message: 'If an account with this email exists, a password reset OTP has been sent.'
      }, { headers: { 'Content-Type': 'application/json' } })
    }
    
    // Generate OTP and set expiration (10 minutes from now)
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    
    // Normalize email for consistent storage
    const normalizedEmail = user.email.toLowerCase().trim()
    
    // Clear any existing OTP for this email before storing new one
    await clearOTP(normalizedEmail)
    
    // Store OTP in database (use normalized email)
    await storeOTP(normalizedEmail, otp, expiresAt)
    
    // Verify OTP was stored correctly
    const { getOTP } = await import('@/lib/otp-store')
    const storedOTPData = await getOTP(normalizedEmail)
    if (storedOTPData) {
      console.log(`✅ OTP confirmed stored in database: ${storedOTPData.otp} for ${normalizedEmail}`)
    } else {
      console.error(`❌ CRITICAL: OTP was not stored correctly for ${normalizedEmail}`)
    }
    
    console.log(`📧 Attempting to send password reset OTP to ${normalizedEmail}`)
    console.log(`💾 OTP stored: ${otp}, expires at: ${expiresAt.toISOString()}`)
    
    // Send OTP email (non-blocking - don't wait for it to complete)
    // This ensures the API responds quickly while email is sent in background
    sendForgotPasswordEmail({
      name: user.name || 'User',
      email: user.email,
      otp: otp
    }).then((emailResult) => {
      if (emailResult.success) {
        console.log(`✅ Password reset OTP sent successfully to ${normalizedEmail}`)
        console.log(`📝 OTP: ${otp} (for testing purposes - remove in production)`)
      } else {
        console.error(`❌ Failed to send password reset OTP to ${normalizedEmail}:`, emailResult.error)
        console.error(`❌ Error code:`, emailResult.code)
        console.error(`❌ Error response:`, emailResult.response)
      }
    }).catch((error) => {
      console.error(`❌ Error in email sending promise:`, error)
    })
    
    // Return success immediately (security best practice - don't reveal if email exists)
    // Email is sent asynchronously in the background
    return NextResponse.json({
      success: true,
      message: 'If an account with this email exists, a password reset OTP has been sent.'
    }, { headers: { 'Content-Type': 'application/json' } })
    
  } catch (error: any) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
