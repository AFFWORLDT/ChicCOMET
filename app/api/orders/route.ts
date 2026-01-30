import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { executeWithRetry } from '@/lib/mongodb-operations'
import Order from '@/lib/models/Order'
import Product from '@/lib/models/Product'
import User from '@/lib/models/User'
import { createErrorResponse } from '@/lib/error-handler'
import { sendOrderConfirmationEmail, sendOrderNotificationEmail } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    let requestBody
    try {
      requestBody = await request.json()
      console.log('Order API - Request body:', JSON.stringify(requestBody, null, 2))
    } catch (parseError) {
      console.error('Order API - Failed to parse request body:', parseError)
      return NextResponse.json(
        { success: false, error: 'Invalid request format. Please try again.' },
        { status: 400 }
      )
    }

    if (!requestBody || typeof requestBody !== 'object') {
      console.error('Order API - Invalid request body type:', typeof requestBody)
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      )
    }

    const {
      userId,
      items,
      subtotal,
      shipping,
      tax,
      totalAmount,
      shippingAddress,
      paymentMethod = 'cash_on_delivery',
      notes = '',
      currency = 'AED',
      currencySymbol = 'AED'
    } = requestBody

    console.log('Order API - Extracted data:', {
      userId,
      itemsCount: items?.length,
      shippingAddress,
      paymentMethod,
      notes
    })

    if (!userId || !items || !shippingAddress) {
      console.log('Order API - Missing required fields:', {
        hasUserId: !!userId,
        hasItems: !!items,
        hasShippingAddress: !!shippingAddress,
        shippingAddressType: typeof shippingAddress
      })
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, items, or shippingAddress' },
        { status: 400 }
      )
    }

    // Ensure shippingAddress is an object
    if (typeof shippingAddress !== 'object' || Array.isArray(shippingAddress)) {
      console.log('Order API - Invalid shippingAddress type:', typeof shippingAddress, shippingAddress)
      return NextResponse.json(
        { success: false, error: 'Invalid shipping address format' },
        { status: 400 }
      )
    }

    // Validate shipping address has all required fields
    console.log('Order API - Full shipping address received:', JSON.stringify(shippingAddress, null, 2))

    const requiredAddressFields = ['name', 'address', 'city', 'state', 'zipCode', 'country', 'phone']
    const missingFields = requiredAddressFields.filter(field => {
      const value = shippingAddress[field]
      // Check if field is missing, null, undefined, or empty after trimming
      if (value === null || value === undefined) return true
      if (typeof value !== 'string') return true
      if (value.trim() === '') return true
      return false
    })

    if (missingFields.length > 0) {
      console.log('Order API - Missing address fields:', missingFields)
      console.log('Order API - Field values:', requiredAddressFields.map(field => ({
        field,
        value: shippingAddress[field],
        type: typeof shippingAddress[field],
        isEmpty: !shippingAddress[field] || (typeof shippingAddress[field] === 'string' && shippingAddress[field].trim() === '')
      })))
      return NextResponse.json(
        {
          success: false,
          error: `Missing required address fields: ${missingFields.join(', ')}. Please fill in all fields.`,
          details: `Received values: ${JSON.stringify(shippingAddress)}`
        },
        { status: 400 }
      )
    }

    // Optimized: Validate user and products in parallel with retry
    const [user, products] = await Promise.all([
      executeWithRetry(
        () => User.findById(userId).select('_id name email').lean(),
        'User lookup',
        5
      ),
      executeWithRetry(
        () => Product.find({
          _id: { $in: items.map(item => item.productId) }
        }).select('_id name price stock image').lean(),
        'Product lookup',
        5
      )
    ])

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Create product map for faster lookup
    const productMap = new Map(products.map(p => [p._id.toString(), p]))

    // Validate products and calculate totals
    let calculatedSubtotal = 0
    let orderItems = []

    for (const item of items) {
      const product = productMap.get(item.productId)
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product ${item.productId} not found` },
          { status: 404 }
        )
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        )
      }

      const itemTotal = product.price * item.quantity
      calculatedSubtotal += itemTotal

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
        total: itemTotal
      })
    }

    // Calculate final totals
    const calculatedShipping = shipping || (calculatedSubtotal > 100 ? 0 : 10)
    const calculatedTax = tax || (calculatedSubtotal * 0.05)
    const calculatedTotal = (calculatedSubtotal + calculatedShipping + calculatedTax)

    // Transform shipping address to match Order model schema
    const transformedShippingAddress = {
      name: shippingAddress.name?.trim() || '',
      address: shippingAddress.address?.trim() || '',
      city: shippingAddress.city?.trim() || '',
      state: shippingAddress.state?.trim() || '',
      zipCode: shippingAddress.zipCode?.trim() || '',
      country: shippingAddress.country?.trim() || 'UAE',
      phone: shippingAddress.phone?.trim() || ''
    }

    // Validate transformed address
    if (!transformedShippingAddress.name || !transformedShippingAddress.address ||
      !transformedShippingAddress.city || !transformedShippingAddress.state ||
      !transformedShippingAddress.zipCode || !transformedShippingAddress.phone) {
      console.log('Order API - Invalid transformed address:', transformedShippingAddress)
      return NextResponse.json(
        {
          success: false,
          error: 'All address fields are required (name, address, city, state, zipCode, phone)'
        },
        { status: 400 }
      )
    }

    console.log('Order API - Transformed shipping address:', transformedShippingAddress)

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    // Create order
    const order = new Order({
      orderNumber,
      user: userId,
      items: orderItems,
      subtotal: subtotal || calculatedSubtotal,
      shipping: calculatedShipping,
      tax: calculatedTax,
      discount: 0,
      totalAmount: totalAmount || calculatedTotal,
      shippingAddress: transformedShippingAddress,
      paymentMethod,
      paymentStatus: requestBody.paymentStatus || (paymentMethod === 'cash_on_delivery' ? 'pending' : 'pending'),
      status: 'pending',
      priority: 'normal',
      source: 'website',
      notes,
      trackingNumber: `TRK-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      metadata: {
        currency: currency,
        currencySymbol: currencySymbol
      }
    })

    console.log('Order API - Order object before save:', {
      orderNumber: order.orderNumber,
      user: order.user,
      itemsCount: order.items.length,
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      status: order.status
    })

    // Save order with retry logic for critical operation
    await executeWithRetry(
      () => order.save(),
      'Order save',
      5
    )

    // Optimized: Update product stock and user in parallel with retry
    const stockUpdates = items.map(item =>
      executeWithRetry(
        () => Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } }
        ),
        `Stock update for product ${item.productId}`,
        5
      )
    )

    const userUpdate = executeWithRetry(
      () => User.findByIdAndUpdate(userId, {
        lastOrderDate: new Date()
      }),
      'User update',
      5
    )

    await Promise.all([...stockUpdates, userUpdate])

    console.log('Order created successfully:', {
      orderNumber: order.orderNumber,
      userId,
      totalAmount: order.totalAmount,
      itemsCount: orderItems.length
    })

    // Send emails asynchronously (don't wait for them to complete)
    // ONLY for non-Stripe orders (like COD). For Stripe, emails will be sent by the webhook after payment confirmation.
    if (paymentMethod !== 'stripe') {
      Promise.all([
        // Send confirmation email to customer
        sendOrderConfirmationEmail({
          orderNumber: order.orderNumber,
          customerName: user.name || shippingAddress.name,
          customerEmail: user.email,
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
          shippingAddress: transformedShippingAddress,
          paymentMethod: paymentMethod,
          trackingNumber: order.trackingNumber,
          currency: currency,
          currencySymbol: currencySymbol
        }).then(result => {
          if (result.success) {
            console.log('✅ Customer confirmation email sent successfully (COD):', result.messageId)
          } else {
            console.error('❌ Failed to send customer confirmation email (COD):', result.error, result.code)
          }
        }).catch(err => {
          console.error('❌ Error sending customer confirmation email (COD):', err)
        }),

        // Send notification email to admin
        sendOrderNotificationEmail({
          orderNumber: order.orderNumber,
          customerName: user.name || shippingAddress.name,
          customerEmail: user.email,
          customerPhone: transformedShippingAddress.phone,
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
          shippingAddress: transformedShippingAddress,
          paymentMethod: paymentMethod,
          trackingNumber: order.trackingNumber,
          currency: currency,
          currencySymbol: currencySymbol
        }).then(result => {
          if (result.success) {
            console.log('✅ Admin notification email sent successfully (COD):', result.messageId)
          } else {
            console.error('❌ Failed to send admin notification email (COD):', result.error, result.code)
          }
        }).catch(err => {
          console.error('❌ Error sending admin notification email (COD):', err)
        })
      ]).catch(err => {
        console.error('❌ Error sending order emails:', err)
      })
    } else {
      console.log(`Order ${order.orderNumber} placed with ${paymentMethod}. Confirmation emails will be sent after payment verification.`)
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        trackingNumber: order.trackingNumber
      },
      message: 'Order placed successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Order API - Error creating order:', error)

    // Log detailed error information
    if (error instanceof Error) {
      console.error('Order API - Error message:', error.message)
      console.error('Order API - Error stack:', error.stack)
    }

    // Check if it's a validation error
    if (error && typeof error === 'object' && 'errors' in error) {
      console.error('Order API - Validation errors:', error.errors)
    }

    // Use createErrorResponse for consistent error handling
    return createErrorResponse(error, 'Failed to create order. Please try again in a moment.')
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    let filter: any = {}

    if (userId) {
      filter.user = userId
    }

    if (status) {
      filter.status = status
    }

    const skip = (page - 1) * limit

    const [orders, totalOrders] = await Promise.all([
      executeWithRetry(
        () => Order.find(filter)
          .populate('user', 'name email')
          .populate('items.product', 'name image')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        'Order query',
        5
      ),
      executeWithRetry(
        () => Order.countDocuments(filter),
        'Order count',
        5
      )
    ])

    return NextResponse.json({
      success: true,
      data: {
        orders: orders || [],
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalOrders / limit),
          totalOrders,
          hasNext: page < Math.ceil(totalOrders / limit),
          hasPrev: page > 1
        }
      }
    })

  } catch (error: any) {
    console.error('Error fetching orders:', error)
    const errorMessage = error?.message || 'Failed to fetch orders'
    console.error('Error details:', {
      message: errorMessage,
      stack: error?.stack,
      name: error?.name
    })
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { details: error?.stack })
      },
      { status: 500 }
    )
  }
}