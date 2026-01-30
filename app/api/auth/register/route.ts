import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { executeWithRetry } from '@/lib/mongodb-operations'
import User from '@/lib/models/User'
import bcrypt from 'bcryptjs'
import { authRateLimit } from '@/lib/rate-limit'
import { validateRequestBody, registerSchema } from '@/lib/validation'
import { sendNewUserNotification, sendWelcomeEmail } from '@/lib/email-service'
import { createErrorResponse } from '@/lib/error-handler'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = authRateLimit(request)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many registration attempts. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString()
          }
        }
      )
    }

    await connectDB()
    
    const body = await request.json()
    
    // Validate input
    const validation = validateRequestBody(registerSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: validation.error,
          details: validation.details
        },
        { status: 400 }
      )
    }
    
    const { name, email, password, phone } = validation.data
    
    // Check if user already exists with retry
    const existingUser = await executeWithRetry(
      () => User.findOne({ email: email.toLowerCase() }),
      'User lookup',
      5
    )
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 400 }
      )
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Create new user
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || '',
      role: 'customer',
      status: 'active'
    })
    
    // Save user with retry
    await executeWithRetry(
      () => newUser.save(),
      'User save',
      5
    )
    
    // Send email notifications
    try {
      // Send notification to admin
      await sendNewUserNotification({
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        registrationDate: new Date().toLocaleString()
      })
      
      // Send welcome email to user
      await sendWelcomeEmail({
        name: newUser.name,
        email: newUser.email
      })
      
      console.log('Email notifications sent successfully for new user:', newUser.email)
    } catch (emailError) {
      console.error('Error sending email notifications:', emailError)
      // Don't fail registration if email fails
    }
    
    // Return user data (without password)
    const userData = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status
    }
    
    return NextResponse.json({
      success: true,
      data: userData,
      message: 'User created successfully'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Registration error:', error)
    return createErrorResponse(error, 'Failed to create account. Please try again in a moment.')
  }
}
