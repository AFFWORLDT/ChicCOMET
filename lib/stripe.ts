import Stripe from 'stripe'

// Default Stripe configuration
const defaultSecretKey = process.env.STRIPE_SECRET_KEY || '';
const defaultPublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

// Initialize Stripe with default key (will be updated from settings)
let stripe = new Stripe(defaultSecretKey, {
  apiVersion: '2024-06-20' as any, // Standard stable version
  typescript: true,
})

// Function to update Stripe configuration
export const updateStripeConfig = (secretKey: string, publishableKey: string) => {
  stripe = new Stripe(secretKey, {
    apiVersion: '2024-06-20' as any,
    typescript: true,
  })
}

export default stripe

// Client-side Stripe initialization
export const getStripe = (publishableKey?: string) => {
  if (typeof window !== 'undefined') {
    const { loadStripe } = require('@stripe/stripe-js')
    return loadStripe(publishableKey || defaultPublishableKey)
  }
  return null
}

// Payment intent creation
export const createPaymentIntent = async (amount: number, currency: string = 'AED') => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        integration_check: 'accept_a_payment',
      },
    })

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    }
  } catch (error: any) {
    console.error('Error creating payment intent:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Create customer
export const createCustomer = async (email: string, name?: string) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    })

    return {
      success: true,
      customerId: customer.id,
    }
  } catch (error: any) {
    console.error('Error creating customer:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Create checkout session
export const createCheckoutSession = async (
  lineItems: Array<{
    price_data: {
      currency: string
      product_data: {
        name: string
        description?: string
        images?: string[]
      }
      unit_amount: number
    }
    quantity: number
  }>,
  successUrl: string,
  cancelUrl: string,
  customerEmail?: string
) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      currency: 'aed',
      locale: 'en',
    })

    return {
      success: true,
      sessionId: session.id,
      url: session.url,
    }
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Verify webhook signature
export const verifyWebhookSignature = (payload: string, signature: string, secret: string) => {
  try {
    const event = stripe.webhooks.constructEvent(payload, signature, secret)
    return {
      success: true,
      event,
    }
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}
