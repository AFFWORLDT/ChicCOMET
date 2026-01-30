import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User, { IUser } from '@/lib/models/User'

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

    // Get user
    const user = await User.findById(userId).lean() as IUser | null

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Use the addresses array from the model
    let addresses = user.addresses || []

    // Migration/Fallback: If array is empty but legacy address exists, migrate it
    if (addresses.length === 0 && user.address && user.address.street) {
      const migratedAddress = {
        _id: user._id, // Temporary ID
        type: 'Home',
        street: user.address.street,
        city: user.address.city,
        state: user.address.state,
        zipCode: user.address.zipCode,
        country: user.address.country,
        isDefault: true
      }

      // Update DB to include this in the array for future
      await User.findByIdAndUpdate(userId, {
        $push: { addresses: migratedAddress }
      })

      addresses = [migratedAddress]
    }

    // Format for frontend
    const formattedAddresses = addresses.map((addr: any) => ({
      id: addr._id.toString(),
      _id: addr._id.toString(),
      type: addr.type || 'Home',
      name: addr.name || user.name,
      address: addr.street || addr.address, // Handle both naming conventions
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode,
      country: addr.country,
      phone: addr.phone || user.phone || '',
      isDefault: addr.isDefault || false,
      createdAt: user.createdAt
    }))

    return NextResponse.json({
      success: true,
      data: formattedAddresses
    })
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch addresses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { userId, addressData } = await request.json()

    if (!userId || !addressData) {
      return NextResponse.json(
        { success: false, error: 'User ID and address data are required' },
        { status: 400 }
      )
    }

    // Prepare new address object matching the schema
    const newAddress = {
      type: addressData.type || 'Home',
      name: addressData.name,
      street: addressData.address,
      city: addressData.city,
      state: addressData.state,
      zipCode: addressData.zipCode,
      country: addressData.country,
      phone: addressData.phone || '', // Store the phone as well
      isDefault: false
    }

    // Check if user exists and if this is their first address
    const user = await User.findById(userId) as any
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    // If no addresses exist, make this the default
    if (!user.addresses || user.addresses.length === 0) {
      newAddress.isDefault = true
    }

    // Push to addresses array
    user.addresses.push(newAddress)

    // Also update legacy address field for backward compatibility if needed
    if (newAddress.isDefault) {
      user.address = {
        street: newAddress.street,
        city: newAddress.city,
        state: newAddress.state,
        zipCode: newAddress.zipCode,
        country: newAddress.country
      }
    }

    await user.save()

    return NextResponse.json({
      success: true,
      message: 'Address added successfully',
      data: user.addresses[user.addresses.length - 1]
    })
  } catch (error) {
    console.error('Error adding address:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add address' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB()

    const { userId, addressId, addressData } = await request.json()

    if (!userId || !addressId || !addressData) {
      return NextResponse.json(
        { success: false, error: 'User ID, address ID, and address data are required' },
        { status: 400 }
      )
    }

    const user = await User.findById(userId) as any
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    // Find and update the specific address in the array
    const addressIndex = user.addresses.findIndex((addr: any) => addr._id.toString() === addressId)

    if (addressIndex === -1) {
      return NextResponse.json({ success: false, error: 'Address not found' }, { status: 404 })
    }

    // Update fields
    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex].toObject(),
      type: addressData.type,
      name: addressData.name,
      street: addressData.address,
      city: addressData.city,
      state: addressData.state,
      zipCode: addressData.zipCode,
      country: addressData.country,
      phone: addressData.phone || user.addresses[addressIndex].phone
    }

    // Update legacy field if this was the default address
    if (user.addresses[addressIndex].isDefault) {
      user.address = {
        street: addressData.address,
        city: addressData.city,
        state: addressData.state,
        zipCode: addressData.zipCode,
        country: addressData.country
      }
    }

    await user.save()

    return NextResponse.json({
      success: true,
      message: 'Address updated successfully',
      data: user.addresses[addressIndex]
    })
  } catch (error) {
    console.error('Error updating address:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update address' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const addressId = searchParams.get('addressId')

    if (!userId || !addressId) {
      return NextResponse.json(
        { success: false, error: 'User ID and address ID are required' },
        { status: 400 }
      )
    }

    const user = await User.findById(userId) as any
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    // Pull the address from the array
    user.addresses = user.addresses.filter((addr: any) => addr._id.toString() !== addressId)

    // If we deleted the default address, make someone else default if list not empty
    if (user.addresses.length > 0 && !user.addresses.some((addr: any) => addr.isDefault)) {
      user.addresses[0].isDefault = true
    }

    // Update legacy field
    const defaultAddr = user.addresses.find((addr: any) => addr.isDefault)
    if (defaultAddr) {
      user.address = {
        street: defaultAddr.street,
        city: defaultAddr.city,
        state: defaultAddr.state,
        zipCode: defaultAddr.zipCode,
        country: defaultAddr.country
      }
    } else {
      user.address = undefined
    }

    await user.save()

    return NextResponse.json({
      success: true,
      message: 'Address removed successfully'
    })
  } catch (error) {
    console.error('Error removing address:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to remove address' },
      { status: 500 }
    )
  }
}
