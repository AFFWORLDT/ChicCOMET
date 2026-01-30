import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { 
      lineItems, 
      successUrl, 
      cancelUrl, 
      customerEmail, 
      customerName,
      currency = 'AED'
    } = await request.json()

    // Validate required fields
    if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Line items are required' },
        { status: 400 }
      )
    }

    if (!successUrl || !cancelUrl) {
      return NextResponse.json(
        { success: false, error: 'Success and cancel URLs are required' },
        { status: 400 }
      )
    }

    // Create customer if email provided
    let customerId = null
    if (customerEmail) {
      const customerResult = await stripe.customers.create({
        email: customerEmail,
        name: customerName,
      })
      customerId = customerResult.id
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer: customerId,
      currency: currency.toLowerCase(),
      locale: 'en',
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['AE', 'SA', 'QA', 'KW', 'BH', 'OM', 'US', 'GB', 'IN'],
      },
    })

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
