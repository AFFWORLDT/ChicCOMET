import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import bcrypt from 'bcryptjs'
import { authRateLimit } from '@/lib/rate-limit'
import { verifyOTP, markOTPAsUsed } from '@/lib/otp-store'

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
    
    const { email, otp, newPassword } = body
    
    // Validate input
    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Email, OTP, and new password are required' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Normalize inputs
    const normalizedEmail = email.toLowerCase().trim()
    const normalizedOTP = String(otp).trim()
    
    console.log(`🔐 Reset password request for email: ${normalizedEmail}`)
    console.log(`🔐 OTP provided: "${normalizedOTP}" (length: ${normalizedOTP.length}, type: ${typeof otp})`)
    
    // Find user
    const user = await User.findOne({ email: normalizedEmail })
    
    if (!user) {
      console.log(`❌ User not found for email: ${normalizedEmail}`)
      return NextResponse.json(
        { success: false, error: 'Invalid email or OTP' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
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
      return NextResponse.json(
        { success: false, error: 'Invalid or expired OTP. Please request a new password reset.' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    console.log(`✅ OTP verified successfully for ${normalizedEmail}`)
    
    // Hash new password
    let hashedPassword: string
    try {
      hashedPassword = await bcrypt.hash(newPassword, 12)
    } catch (hashError) {
      console.error('Error hashing password:', hashError)
      return NextResponse.json(
        { success: false, error: 'Error processing password. Please try again.' },
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Update user password
    try {
      await User.findByIdAndUpdate(user._id, {
        password: hashedPassword
      })
    } catch (updateError) {
      console.error('Error updating user password:', updateError)
      return NextResponse.json(
        { success: false, error: 'Error updating password. Please try again.' },
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Mark OTP as used in database
    const { markOTPAsUsed } = await import('@/lib/otp-store')
    await markOTPAsUsed(normalizedEmail)
    
    console.log(`✅ Password reset successful for user: ${user.email}`)
    
    return NextResponse.json(
      {
        success: true,
        message: 'Password has been reset successfully. You can now login with your new password.'
      },
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
    
  } catch (error: any) {
    console.error('Reset password error:', error)
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
