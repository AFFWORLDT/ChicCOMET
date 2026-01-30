import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, customerEmail, customerName, orderId, paymentMethod } = await request.json()
    console.log('Creating Payment Intent for:', { amount, currency, orderId, paymentMethod })

    // Validate required fields
    if (!amount || !currency) {
      return NextResponse.json(
        { success: false, error: 'Amount and currency are required' },
        { status: 400 }
      )
    }

    // This line was added as per instruction, assuming connectDB is defined elsewhere
    // or will be added later.
    // await connectDB() 

    // Get Stripe secret key from environment
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY

    // Debug: Check if the key is coming from env
    if (stripeSecretKey) {
      console.log('Stripe debug - Secret key found in ENV. Length:', stripeSecretKey.length, 'Starts with:', stripeSecretKey.substring(0, 7), 'Ends with:', stripeSecretKey.substring(stripeSecretKey.length - 6))
    } else {
      console.log('Stripe debug - Secret key NOT found in ENV')
    }

    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY is not defined in environment variables')
      return NextResponse.json(
        { success: false, error: 'Stripe configuration error. Please contact administrator.' },
        { status: 500 }
      )
    }

    // Initialize Stripe with the environment key
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20' as any,
    })

    // Find or create customer
    let customerId = ''
    if (customerEmail) {
      const customers = await stripe.customers.list({ email: customerEmail, limit: 1 })
      if (customers.data.length > 0) {
        customerId = customers.data[0].id
      } else {
        const customer = await stripe.customers.create({
          email: customerEmail,
          name: customerName || undefined,
        })
        customerId = customer.id
      }
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      customer: customerId,
      payment_method_types: ['card'],
      metadata: {
        orderId: orderId || 'N/A',
        integration_check: 'accept_a_payment',
      },
    })

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error: any) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
