import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { executeWithRetry } from '@/lib/mongodb-operations'
import User from '@/lib/models/User'
import { createErrorResponse } from '@/lib/error-handler'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    
    // Build query
    let query: any = {}
    
    if (role && role !== 'all') {
      query.role = role
    }
    
    if (status && status !== 'all') {
      query.status = status
    }
    
    const users = await executeWithRetry(
      () => User.find(query)
        .select('-password') // Exclude password from response
        .sort({ createdAt: -1 })
        .lean(),
      'User query',
      5
    )
    
    return NextResponse.json({
      success: true,
      data: users || []
    })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return createErrorResponse(error, 'Failed to fetch users')
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { name, email, password, role = 'customer' } = body
    
    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 400 }
      )
    }
    
    // Create new user
    const user = new User({
      name,
      email,
      password,
      role,
      isActive: true
    })
    
    await user.save()
    
    // Return user without password
    const userResponse = user.toObject()
    delete userResponse.password
    
    return NextResponse.json({
      success: true,
      data: userResponse
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    )
  }
}