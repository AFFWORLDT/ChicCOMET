import { NextRequest, NextResponse } from 'next/server'
import { testEmailConnection, sendNewUserNotification, sendWelcomeEmail, sendForgotPasswordEmail, sendOrderConfirmationEmail, sendOrderNotificationEmail } from '@/lib/email-service'

export async function GET(request: NextRequest) {
  try {
    // Test email connection
    const connectionTest = await testEmailConnection()
    
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: 'Email connection failed',
        details: connectionTest.error
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Email service is working correctly',
      details: connectionTest.message
    })
  } catch (error) {
    console.error('Email test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to test email service'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, userData } = body

    if (type === 'new-user') {
      // Test new user notification
      const result = await sendNewUserNotification({
        name: userData.name || 'Test User',
        email: userData.email || 'test@example.com',
        phone: userData.phone || '1234567890',
        registrationDate: new Date().toLocaleString()
      })

      return NextResponse.json({
        success: result.success,
        message: result.success ? 'New user notification sent successfully' : 'Failed to send notification',
        details: result
      })
    } else if (type === 'welcome') {
      // Test welcome email
      const result = await sendWelcomeEmail({
        name: userData.name || 'Test User',
        email: userData.email || 'test@example.com'
      })

      return NextResponse.json({
        success: result.success,
        message: result.success ? 'Welcome email sent successfully' : 'Failed to send welcome email',
        details: result
      })
    } else if (type === 'forgot-password') {
      // Test forgot password email
      const result = await sendForgotPasswordEmail({
        name: userData.name || 'Test User',
        email: userData.email || 'test@example.com',
        otp: userData.otp || '123456'
      })

      return NextResponse.json({
        success: result.success,
        message: result.success ? 'Forgot password email sent successfully' : 'Failed to send forgot password email',
        details: result
      })
    } else if (type === 'order-confirmation') {
      // Test order confirmation email
      const result = await sendOrderConfirmationEmail({
        orderNumber: userData.orderNumber || 'TEST-ORDER-001',
        customerName: userData.customerName || 'Test Customer',
        customerEmail: userData.customerEmail || 'test@example.com',
        items: userData.items || [
          { name: 'Test Product', quantity: 1, price: 100, image: 'https://via.placeholder.com/80' }
        ],
        subtotal: userData.subtotal || 100,
        shipping: userData.shipping || 10,
        tax: userData.tax || 5,
        totalAmount: userData.totalAmount || 115,
        shippingAddress: userData.shippingAddress || {
          name: 'Test Customer',
          address: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          country: 'UAE',
          phone: '1234567890'
        },
        paymentMethod: userData.paymentMethod || 'cash_on_delivery',
        trackingNumber: userData.trackingNumber || 'TRK-TEST-001'
      })

      return NextResponse.json({
        success: result.success,
        message: result.success ? 'Order confirmation email sent successfully' : 'Failed to send order confirmation email',
        details: result
      })
    } else if (type === 'order-notification') {
      // Test order notification email (to admin)
      const result = await sendOrderNotificationEmail({
        orderNumber: userData.orderNumber || 'TEST-ORDER-001',
        customerName: userData.customerName || 'Test Customer',
        customerEmail: userData.customerEmail || 'test@example.com',
        customerPhone: userData.customerPhone || '1234567890',
        items: userData.items || [
          { name: 'Test Product', quantity: 1, price: 100, image: 'https://via.placeholder.com/80' }
        ],
        subtotal: userData.subtotal || 100,
        shipping: userData.shipping || 10,
        tax: userData.tax || 5,
        totalAmount: userData.totalAmount || 115,
        shippingAddress: userData.shippingAddress || {
          name: 'Test Customer',
          address: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          country: 'UAE',
          phone: '1234567890'
        },
        paymentMethod: userData.paymentMethod || 'cash_on_delivery',
        trackingNumber: userData.trackingNumber || 'TRK-TEST-001'
      })

      return NextResponse.json({
        success: result.success,
        message: result.success ? 'Order notification email sent successfully' : 'Failed to send order notification email',
        details: result
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid test type. Use "new-user", "welcome", "forgot-password", "order-confirmation", or "order-notification"'
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Email test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to test email service'
    }, { status: 500 })
  }
}
