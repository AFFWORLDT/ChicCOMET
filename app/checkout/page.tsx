"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, CreditCard, Truck, Loader2, Check, Banknote } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ScrollAnimate } from "@/components/scroll-animate"
import { StripePayment } from "@/components/stripe-payment"
import { Price } from "@/components/price"
import { useCurrency } from "@/components/currency-provider"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function CheckoutPage() {
  const { state } = useCart()
  const { user } = useAuth()
  const { formatPrice, currency: selectedCurrency, currentCurrency } = useCurrency()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("stripe")
  const [showStripeModal, setShowStripeModal] = useState(false)
  const [orderCreated, setOrderCreated] = useState(false)
  const [createdOrderNumber, setCreatedOrderNumber] = useState("")
  const [createdOrderId, setCreatedOrderId] = useState("")
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "UAE"
  })

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/checkout')
      return
    }
    
    if (state.items.length === 0) {
      router.push('/cart')
      return
    }

    // Pre-fill user info
    setShippingInfo(prev => ({
      ...prev,
      firstName: user.name.split(' ')[0] || "",
      lastName: user.name.split(' ').slice(1).join(' ') || "",
      email: user.email || ""
    }))

    // Load saved address
    const loadSavedAddress = async () => {
      try {
        const response = await fetch(`/api/user/addresses?userId=${user._id}`)
        const data = await response.json()
        
        if (data.success && data.data.length > 0) {
          const defaultAddress = data.data.find((addr: any) => addr.isDefault) || data.data[0]
          
          setShippingInfo(prev => ({
            ...prev,
            firstName: defaultAddress.name.split(' ')[0] || prev.firstName,
            lastName: defaultAddress.name.split(' ').slice(1).join(' ') || prev.lastName,
            phone: defaultAddress.phone || prev.phone,
            address: defaultAddress.address || prev.address,
            city: defaultAddress.city || prev.city,
            state: defaultAddress.state || prev.state,
            zipCode: defaultAddress.zipCode || prev.zipCode,
            country: defaultAddress.country || prev.country
          }))
        }
      } catch (error) {
        console.error('Error loading saved address:', error)
      }
    }

    loadSavedAddress()
  }, [user, state.items.length, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.email || 
        !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city || 
        !shippingInfo.state || !shippingInfo.zipCode || !shippingInfo.country) {
      toast.error("Please fill in all shipping address fields")
      return
    }
    
    setLoading(true)
    
    // For Stripe, we create the order first in a pending state
    if (paymentMethod === 'stripe') {
      const orderResult = await createOrder("stripe", null, false)
      if (orderResult) {
        setCreatedOrderId(orderResult.orderId)
        setCreatedOrderNumber(orderResult.orderNumber) 
        setShowStripeModal(true)
      }
      setLoading(false)
      return
    }

    // For COD, proceed normally
    await createOrder("cash_on_delivery")
    setLoading(false)
  }

  const createOrder = async (method: string, paymentDetails?: any, shouldRedirect: boolean = true) => {
    try {
      // Create order
      const orderData = {
        userId: user?._id,
        items: state.items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: state.total * 1.05,
        subtotal: state.total,
        shipping: 0,
        tax: state.total * 0.05,
        shippingAddress: {
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
          phone: shippingInfo.phone
        },
        paymentMethod: method,
        paymentStatus: paymentDetails ? 'paid' : 'pending',
        notes: paymentDetails ? `Stripe Payment ID: ${paymentDetails.id || 'N/A'}` : '',
        currency: selectedCurrency,
        currencySymbol: currentCurrency.symbol
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()

      if (data.success) {
        if (shouldRedirect) {
          toast.success("Order placed successfully!")
          router.push(`/orders/${data.data.orderNumber}`)
        }
        return { orderId: data.data.orderId, orderNumber: data.data.orderNumber } // Return both ID and Number
      } else {
        toast.error(data.error || "Failed to place order")
        return null
      }
    } catch (error) {
      console.error('Order creation error:', error)
      toast.error("An unexpected error occurred while creating your order")
      return null
    }
  }

  const handleStripeSuccess = async (paymentIntent: any) => {
    // Update the order status to paid after successful Stripe payment
    try {
      const response = await fetch(`/api/orders/${createdOrderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentStatus: 'paid',
          paymentDetails: {
            id: paymentIntent.id,
            method: 'stripe',
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
          },
        }),
      })

      const data = await response.json()

      if (data.success) {
        setShowStripeModal(false)
        toast.success("Payment successful! Redirecting to order confirmation...")
        router.push(`/orders/${createdOrderNumber}`)
      } else {
        toast.error(data.error || "Failed to update order status after payment.")
        setLoading(false)
      }
    } catch (error) {
      console.error('Error updating order after Stripe payment:', error)
      toast.error("An unexpected error occurred while finalizing your order.")
      setLoading(false)
    }
  }

  if (!user || state.items.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#e1d7c6]" />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Shipping Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={shippingInfo.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={shippingInfo.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Emirate</Label>
                      <Input
                        id="state"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={setPaymentMethod}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <div className="relative">
                      <RadioGroupItem value="stripe" id="stripe" className="sr-only" />
                      <Label
                        htmlFor="stripe"
                        className={`relative flex flex-col items-center justify-center rounded-xl border-2 p-6 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all min-h-[140px] ${
                          paymentMethod === 'stripe' 
                            ? 'border-[#e1d7c6] bg-accent/50 ring-1 ring-[#e1d7c6] opacity-100' 
                            : 'border-muted opacity-60 hover:opacity-100'
                        }`}
                      >
                        <CreditCard className={`mb-3 h-8 w-8 ${paymentMethod === 'stripe' ? 'text-[#e1d7c6]' : 'text-muted-foreground'}`} />
                        <span className="font-semibold text-center">Credit/Debit Card</span>
                        <span className="text-xs text-muted-foreground mt-1 text-center">Secure payment by Stripe</span>
                        {paymentMethod === 'stripe' && (
                          <div className="absolute top-3 right-3">
                            <div className="bg-[#e1d7c6] rounded-full p-0.5">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          </div>
                        )}
                      </Label>
                    </div>

                    <div className="relative">
                      <RadioGroupItem value="cod" id="cod" className="sr-only" />
                      <Label
                        htmlFor="cod"
                        className={`relative flex flex-col items-center justify-center rounded-xl border-2 p-6 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all min-h-[140px] ${
                          paymentMethod === 'cod' 
                            ? 'border-[#e1d7c6] bg-accent/50 ring-1 ring-[#e1d7c6] opacity-100' 
                            : 'border-muted opacity-60 hover:opacity-100'
                        }`}
                      >
                        <Banknote className={`mb-3 h-8 w-8 ${paymentMethod === 'cod' ? 'text-[#e1d7c6]' : 'text-muted-foreground'}`} />
                        <span className="font-semibold text-center">Cash on Delivery</span>
                        <span className="text-xs text-muted-foreground mt-1 text-center">Pay when you receive yours</span>
                        {paymentMethod === 'cod' && (
                          <div className="absolute top-3 right-3">
                            <div className="bg-[#e1d7c6] rounded-full p-0.5">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          </div>
                        )}
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {state.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity}x <Price amount={item.price} showOriginal={false} className="inline" />
                          </p>
                        </div>
                        <Price amount={item.price * item.quantity} showOriginal={false} />
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(state.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (5%)</span>
                      <span>{formatPrice(state.total * 0.05)}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(state.total * 1.05)}</span>
                  </div>

                  {/* Currency Notice */}
                  {selectedCurrency !== 'AED' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
                      <p className="text-amber-800">
                        <strong>Note:</strong> Prices shown in {currentCurrency.name} are for reference only. Your order will be processed and charged in <strong>AED (UAE Dirham)</strong>.
                      </p>
                    </div>
                  )}
                  
                  <Button
                    type="submit"
                    className="w-full bg-[#e1d7c6] hover:bg-[#e1d7c6]/90 text-[#e1d7c6]-foreground"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      paymentMethod === 'stripe' ? (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay with Credit Card
                        </>
                      ) : (
                        <>
                          <Banknote className="h-4 w-4 mr-2" />
                          Confirm Cash Order
                        </>
                      )
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>

      <Dialog open={showStripeModal} onOpenChange={setShowStripeModal}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Complete Your Payment</DialogTitle>
          </DialogHeader>
          <StripePayment 
            amount={state.total * 1.05} 
            currency={selectedCurrency}
            customerEmail={shippingInfo.email}
            customerName={`${shippingInfo.firstName} ${shippingInfo.lastName}`}
            orderId={createdOrderId}
            onSuccess={handleStripeSuccess}
            onError={(err) => {
              console.error('Stripe error:', err)
              setLoading(false)
              // Keep modal open so user can try again or check message
            }}
          />
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}