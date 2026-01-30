import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import { authRateLimit } from '@/lib/rate-limit'
import { verifyOTP } from '@/lib/otp-store'

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
          error: 'Too many OTP verification attempts. Please try again later.',
          retryAfter
        },
        { 
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'Content-Type': 'application/json'
          }
        }
      )
    }

    await connectDB()
    
    let body: any
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('Error parsing request body:', parseError)
      return NextResponse.json(
        { success: false, error: 'Invalid request format' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    const { email, otp } = body
    
    // Validate input
    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and OTP are required' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() })
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or OTP' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Normalize email
    const normalizedEmail = email.toLowerCase().trim()
    const normalizedOTP = String(otp).trim()
    
    console.log(`🔐 Verifying OTP for email: ${normalizedEmail}`)
    console.log(`🔐 OTP received: "${normalizedOTP}" (length: ${normalizedOTP.length}, type: ${typeof otp})`)
    
    // Import getAllOTPs for debugging
    const { getAllOTPs } = await import('@/lib/otp-store')
    const allOTPs = await getAllOTPs()
    console.log(`📋 Current OTP store size: ${allOTPs.size}`)
    if (allOTPs.size > 0) {
      console.log(`📋 Stored OTPs:`, Array.from(allOTPs.entries()).map(([email, data]) => ({
        email,
        otp: data.otp,
        otpLength: String(data.otp).length,
        expiresAt: data.expiresAt.toISOString(),
        isUsed: data.isUsed,
        isExpired: new Date() > data.expiresAt,
        timeUntilExpiry: Math.max(0, Math.floor((data.expiresAt.getTime() - Date.now()) / 1000))
      })))
    }
    
    // Verify OTP using database store
    const isValidOTP = await verifyOTP(normalizedEmail, normalizedOTP)
    
    if (!isValidOTP) {
      console.log(`❌ OTP verification failed for ${normalizedEmail}`)
      
      // Get more details about why it failed
      const { getOTP } = await import('@/lib/otp-store')
      const otpData = await getOTP(normalizedEmail)
      
      let errorMessage = 'Invalid or expired OTP. Please check the code and try again, or request a new one.'
      
      if (!otpData) {
        errorMessage = 'OTP not found. It may have expired or you may need to request a new one.'
        console.log(`❌ No OTP data found for ${normalizedEmail}`)
      } else if (otpData.isUsed) {
        errorMessage = 'This OTP has already been used. Please request a new one.'
        console.log(`❌ OTP already used for ${normalizedEmail}`)
      } else if (new Date() > otpData.expiresAt) {
        errorMessage = 'OTP has expired. Please request a new one.'
        console.log(`❌ OTP expired for ${normalizedEmail}`)
      } else {
        console.log(`❌ OTP mismatch - Stored: "${otpData.otp}", Provided: "${normalizedOTP}"`)
        errorMessage = 'Invalid OTP code. Please check and try again.'
      }
      
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    console.log(`✅ OTP verified successfully for ${normalizedEmail}`)
    
    return NextResponse.json(
      {
        success: true,
        message: 'OTP verified successfully. You can now reset your password.',
        data: {
          email: user.email,
          name: user.name
        }
      },
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
    
  } catch (error: any) {
    console.error('Verify OTP error:', error)
    const errorMessage = error?.message || 'Internal server error'
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
