import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    // Get user ID from query params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    // Get user (excluding password)
    const user = await User.findById(userId).select('-password').lean()
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    
    const { userId, profileData } = await request.json()
    
    if (!userId || !profileData) {
      return NextResponse.json(
        { success: false, error: 'User ID and profile data are required' },
        { status: 400 }
      )
    }
    
    // Prepare update data
    const updateData: any = {
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone
    }
    
    // Update preferences if provided
    if (profileData.preferences) {
      updateData.preferences = profileData.preferences
    }
    
    // Update user
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: '-password' }
    )
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update user profile' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB()
    
    const { userId, currentPassword, newPassword } = await request.json()
    
    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'User ID, current password, and new password are required' },
        { status: 400 }
      )
    }
    
    // Get user with password
    const user = await User.findById(userId)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect' },
        { status: 400 }
      )
    }
    
    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)
    
    // Update password
    await User.findByIdAndUpdate(userId, { password: hashedNewPassword })
    
    return NextResponse.json({
      success: true,
      message: 'Password updated successfully'
    })
  } catch (error) {
    console.error('Error updating password:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update password' },
      { status: 500 }
    )
  }
}
