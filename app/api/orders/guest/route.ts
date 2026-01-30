import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { executeWithRetry } from '@/lib/mongodb-operations'
import Order from '@/lib/models/Order'
import User from '@/lib/models/User'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { createErrorResponse } from '@/lib/error-handler'
import { sendOrderConfirmationEmail, sendOrderNotificationEmail } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    console.log('Guest order API called')

    await connectDB()
    console.log('MongoDB connected')

    const body = await request.json()
    console.log('Request body:', body)

    const {
      email,
      firstName,
      lastName,
      phone,
      address,
      city,
      state,
      zipCode,
      country,
      items,
      totalAmount,
      paymentMethod = 'cod'
    } = body

    // Validate required fields
    if (!email || !firstName || !lastName || !phone || !address || !city || !state || !zipCode || !items || !totalAmount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('Validation passed')

    // Check if user exists with retry
    console.log('Looking up user with email:', email.toLowerCase().trim())
    let user = await executeWithRetry(
      () => User.findOne({ email: email.toLowerCase().trim() }),
      'User lookup',
      5
    )
    console.log('User lookup result:', user ? 'found' : 'not found')

    let isNewUser = false
    let generatedPassword = ''

    if (!user) {
      // Generate a random password
      generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase()
      const hashedPassword = await bcrypt.hash(generatedPassword, 12)

      // Create new user
      user = new User({
        email: email.toLowerCase().trim(),
        name: `${firstName.trim()} ${lastName.trim()}`,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        password: hashedPassword,
        role: 'customer',
        addresses: [{
          type: 'shipping',
          street: address,
          city: city,
          state: state,
          zipCode: zipCode,
          country: country || 'India',
          isDefault: true
        }]
      })

      console.log('Saving new user...')
      await executeWithRetry(
        () => user.save(),
        'User save',
        5
      )
      isNewUser = true
      console.log('New user created:', user._id)
    }

    // Create order items with proper structure
    const orderItems = items.map((item: any) => {
      // Validate product ID is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        throw new Error(`Invalid product ID: ${item.product}`)
      }

      return {
        product: new mongoose.Types.ObjectId(item.product),
        name: item.name || 'Product',
        quantity: item.quantity,
        price: item.price,
        image: item.image || 'https://via.placeholder.com/150',
        total: item.price * item.quantity
      }
    })

    // Calculate totals
    const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0)
    const shipping = subtotal > 1000 ? 0 : 100
    const tax = subtotal * 0.18
    const finalTotal = subtotal + shipping + tax

    // Create order
    console.log('Creating order with data:', {
      orderNumber: `KG${Date.now().toString().slice(-8)}`,
      user: user._id,
      items: orderItems,
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      totalAmount: finalTotal
    })

    const order = new Order({
      orderNumber: `KG${Date.now().toString().slice(-8)}`,
      user: user._id,
      items: orderItems,
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      discount: 0,
      totalAmount: finalTotal,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: paymentMethod,
      priority: 'normal',
      source: 'website',
      shippingAddress: {
        name: `${firstName} ${lastName}`,
        address: address,
        city: city,
        state: state,
        zipCode: zipCode,
        country: country || 'India',
        phone: phone
      },
      billingAddress: {
        name: `${firstName} ${lastName}`,
        address: address,
        city: city,
        state: state,
        zipCode: zipCode,
        country: country || 'India',
        phone: phone
      },
      tags: ['guest-order'],
      metadata: {
        isGuestOrder: true,
        originalEmail: email
      }
    })

    console.log('Saving order...')
    await executeWithRetry(
      () => order.save(),
      'Order save',
      5
    )
    console.log('Order created:', order._id)

    // Send emails asynchronously (don't wait for them to complete)
    // ONLY for non-Stripe orders (like COD). For Stripe, emails will be sent by the webhook after payment confirmation.
    if (paymentMethod !== 'stripe') {
      Promise.all([
        // Send confirmation email to customer
        sendOrderConfirmationEmail({
          orderNumber: order.orderNumber,
          customerName: `${firstName} ${lastName}`,
          customerEmail: email,
          items: orderItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image
          })),
          subtotal: order.subtotal,
          shipping: order.shipping,
          tax: order.tax,
          totalAmount: order.totalAmount,
          shippingAddress: {
            name: `${firstName} ${lastName}`,
            address: address,
            city: city,
            state: state,
            zipCode: zipCode,
            country: country || 'India',
            phone: phone
          },
          paymentMethod: paymentMethod,
          trackingNumber: order.trackingNumber
        }).then(result => {
          if (result.success) {
            console.log('✅ Customer confirmation email sent successfully:', result.messageId)
          } else {
            console.error('❌ Failed to send customer confirmation email:', result.error, result.code)
          }
        }).catch(err => {
          console.error('❌ Error sending customer confirmation email:', err)
        }),

        // Send notification email to admin
        sendOrderNotificationEmail({
          orderNumber: order.orderNumber,
          customerName: `${firstName} ${lastName}`,
          customerEmail: email,
          customerPhone: phone,
          items: orderItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image
          })),
          subtotal: order.subtotal,
          shipping: order.shipping,
          tax: order.tax,
          totalAmount: order.totalAmount,
          shippingAddress: {
            name: `${firstName} ${lastName}`,
            address: address,
            city: city,
            state: state,
            zipCode: zipCode,
            country: country || 'India',
            phone: phone
          },
          paymentMethod: paymentMethod,
          trackingNumber: order.trackingNumber
        }).then(result => {
          if (result.success) {
            console.log('✅ Admin notification email sent successfully:', result.messageId)
          } else {
            console.error('❌ Failed to send admin notification email:', result.error, result.code)
          }
        }).catch(err => {
          console.error('❌ Error sending admin notification email:', err)
        })
      ]).catch(err => {
        console.error('❌ Error sending order emails:', err)
      })
    } else {
      console.log(`Order ${order.orderNumber} placed with ${paymentMethod} by guest. Confirmation emails will be sent after payment verification.`)
    }

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      data: {
        _id: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentMethod: order.paymentMethod,
        email: email,
        isNewUser: isNewUser,
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      }
    })

  } catch (error) {
    console.error('Guest order creation error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })

    // Use createErrorResponse for consistent error handling
    return createErrorResponse(error, 'Failed to create order. Please try again in a moment.')
  }
}