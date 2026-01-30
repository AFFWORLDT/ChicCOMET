import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/lib/stripe'
import { headers } from 'next/headers'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import User from '@/lib/models/User'
import { sendOrderConfirmationEmail, sendOrderNotificationEmail } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = (await headers()).get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { success: false, error: 'No signature provided' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const webhookSecret = 'whsec_COoIOvyPdFwTIPD7EpiaJMvGIrbMdU44'

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (error: any) {
      console.error('Webhook signature verification failed:', error)
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 400 }
      )
    }

    await connectDB()

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as any
        console.log('Payment succeeded:', paymentIntent.id)

        const orderId = paymentIntent.metadata.orderId
        if (orderId && orderId !== 'N/A') {
          const updatedOrder = await Order.findByIdAndUpdate(orderId, {
            paymentStatus: 'paid',
            status: 'confirmed',
            $push: {
              statusHistory: {
                status: 'confirmed',
                timestamp: new Date(),
                note: `Payment confirmed via Stripe (PI: ${paymentIntent.id})`
              }
            }
          }, { new: true }).populate('user', 'name email').lean()

          if (updatedOrder) {
            console.log(`Order ${orderId} updated to paid/confirmed. Sending emails...`)

            // Send emails asynchronously
            const orderUser = updatedOrder.user as any
            // Get currency from order metadata or default to AED
            const orderMetadata = updatedOrder.metadata as Map<string, any> | undefined
            const currency = orderMetadata?.get?.('currency') || 'AED'
            const currencySymbol = orderMetadata?.get?.('currencySymbol') || 'AED'

            Promise.all([
              sendOrderConfirmationEmail({
                orderNumber: updatedOrder.orderNumber,
                customerName: orderUser?.name || updatedOrder.shippingAddress.name,
                customerEmail: orderUser?.email || paymentIntent.receipt_email,
                items: updatedOrder.items,
                subtotal: updatedOrder.subtotal,
                shipping: updatedOrder.shipping,
                tax: updatedOrder.tax,
                totalAmount: updatedOrder.totalAmount,
                shippingAddress: updatedOrder.shippingAddress,
                paymentMethod: updatedOrder.paymentMethod,
                trackingNumber: updatedOrder.trackingNumber,
                currency: currency,
                currencySymbol: currencySymbol
              }),
              sendOrderNotificationEmail({
                orderNumber: updatedOrder.orderNumber,
                customerName: orderUser?.name || updatedOrder.shippingAddress.name,
                customerEmail: orderUser?.email || paymentIntent.receipt_email,
                customerPhone: updatedOrder.shippingAddress.phone,
                items: updatedOrder.items,
                subtotal: updatedOrder.subtotal,
                shipping: updatedOrder.shipping,
                tax: updatedOrder.tax,
                totalAmount: updatedOrder.totalAmount,
                shippingAddress: updatedOrder.shippingAddress,
                paymentMethod: updatedOrder.paymentMethod,
                trackingNumber: updatedOrder.trackingNumber,
                currency: currency,
                currencySymbol: currencySymbol
              })
            ]).catch(err => console.error('Error sending webhook emails:', err))
          }
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const failedPayment = event.data.object as any
        console.log('Payment failed:', failedPayment.id)

        const orderId = failedPayment.metadata.orderId
        if (orderId && orderId !== 'N/A') {
          await Order.findByIdAndUpdate(orderId, {
            paymentStatus: 'failed',
            $push: {
              statusHistory: {
                status: 'pending',
                timestamp: new Date(),
                note: `Payment failed via Stripe (PI: ${failedPayment.id}): ${failedPayment.last_payment_error?.message || 'Unknown error'}`
              }
            }
          })
          console.log(`Order ${orderId} updated to payment failed`)
        }
        break
      }

      case 'checkout.session.completed': {
        const session = event.data.object as any
        console.log('Checkout session completed:', session.id)

        const orderId = session.metadata.orderId
        if (orderId && orderId !== 'N/A') {
          await Order.findByIdAndUpdate(orderId, {
            paymentStatus: 'paid',
            status: 'confirmed'
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ success: true, received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
