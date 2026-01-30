"use client"

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CreditCard, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useCurrency } from './currency-provider'

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

interface StripePaymentProps {
  amount: number
  currency?: string
  customerEmail?: string
  customerName?: string
  onSuccess?: (paymentIntent: any) => void
  onError?: (error: any) => void
  orderId?: string
}

function CheckoutForm({ 
  amount, 
  currency = 'AED', 
  onSuccess, 
  onError,
}: StripePaymentProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const { formatPrice } = useCurrency()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
    })

    if (error) {
      console.error('Payment failed:', error)
      toast.error(error.message || 'Payment failed')
      onError?.(error)
    } else {
      // For some payment methods like card, confirmPayment might not redirect
      // even if successful, depending on the setup. 
      // But typically it redirects.
      toast.success('Payment successful!')
      onSuccess?.(error)
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement 
        options={{
          layout: 'tabs',
        }}
      />
      <Button 
        type="submit" 
        disabled={!stripe || loading}
        className="w-full bg-primary hover:bg-primary/90"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4 mr-2" />
            Pay {formatPrice(amount)}
          </>
        )}
      </Button>
    </form>
  )
}

export function StripePayment(props: StripePaymentProps) {
  const { amount, currency = 'AED', customerEmail, customerName, orderId, onError } = props
  const [clientSecret, setClientSecret] = useState('')
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    setInitializing(true)
    // Create PaymentIntent as soon as the component mounts
    fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        currency,
        customerEmail,
        customerName,
        orderId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setClientSecret(data.clientSecret)
        } else {
          toast.error(data.error || 'Failed to create payment intent')
          onError?.(data.error)
        }
      })
      .catch((error) => {
        console.error('Error:', error)
        toast.error('Failed to initialize payment')
        onError?.(error)
      })
      .finally(() => {
        setInitializing(false)
      })
  }, [amount, currency, customerEmail, customerName, orderId, onError])

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Secure Payment
        </CardTitle>
        <CardDescription>
          Complete your payment securely with Stripe
        </CardDescription>
      </CardHeader>
      <CardContent>
        {initializing ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground font-medium animate-pulse">
              Initializing secure checkout...
            </p>
          </div>
        ) : clientSecret ? (
          <Elements 
            stripe={stripePromise} 
            options={{ 
              clientSecret,
              appearance: {
                theme: 'stripe',
                variables: {
                  colorPrimary: '#000000',
                },
              }
            }}
          >
            <CheckoutForm {...props} />
          </Elements>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
            <XCircle className="h-10 w-10 text-destructive" />
            <p className="text-sm font-medium">Failed to load payment form</p>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
