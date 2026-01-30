import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { executeWithRetry } from '@/lib/mongodb-operations'
import User from '@/lib/models/User'
import bcrypt from 'bcryptjs'
import { createErrorResponse } from '@/lib/error-handler'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { name, email, password } = await request.json()
    
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email and password are required' },
        { status: 400 }
      )
    }
    
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
      role: 'customer',
      status: 'active'
    })
    
    // Save user with retry
    await executeWithRetry(
      () => newUser.save(),
      'User save',
      5
    )
    
    // Return user data (without password)
    const userData = {
      id: newUser._id,
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
    console.error('Signup error:', error)
    return createErrorResponse(error, 'Failed to create account. Please try again in a moment.')
  }
}
