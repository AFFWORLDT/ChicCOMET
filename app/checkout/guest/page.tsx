"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  ShoppingCart, 
  CreditCard, 
  MapPin, 
  User,
  Mail,
  Phone,
  Loader2,
  CheckCircle,
  Package
} from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export default function GuestCheckoutPage() {
  const { state, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderData, setOrderData] = useState<any>(null)

  // Form data
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    paymentMethod: 'cod'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!state.items || state.items.length === 0) {
      router.push('/cart')
    }
  }, [state.items, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required'
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateTotals = () => {
    const subtotal = (state.items || []).reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shipping = subtotal > 1000 ? 0 : 100 // Free shipping above AED 1000
    const tax = subtotal * 0.18 // 18% GST
    const total = subtotal + shipping + tax

    return { subtotal, shipping, tax, total }
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const { subtotal, shipping, tax, total } = calculateTotals()

      const orderData = {
        // Guest user data
        email: formData.email.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        
        // Address fields (API expects these directly in body, not nested)
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        zipCode: formData.zipCode.trim(),
        country: formData.country || 'India',
        
        // Order items (include name and image for API)
        items: (state.items || []).map(item => ({
          product: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image || 'https://via.placeholder.com/150'
        })),
        
        // Order totals
        totalAmount: total,
        
        // Payment
        paymentMethod: formData.paymentMethod || 'cod'
      }

      // Debug logging
      console.log('Sending order data:', orderData)
      console.log('Cart items:', state.items)

      const response = await fetch('/api/orders/guest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `Server error: ${response.status} ${response.statusText}` }))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setOrderData(data.data)
        setOrderSuccess(true)
        clearCart()
        toast.success('Order placed successfully! Check your email for account details.')
      } else {
        // Show specific error message
        const errorMessage = data.error || 'Failed to place order'
        toast.error(errorMessage)
        
        // If it's a validation error, highlight the fields
        if (errorMessage.includes('Missing required fields') || errorMessage.includes('required')) {
          // Re-validate to show field-level errors
          validateForm()
        }
      }
    } catch (error) {
      console.error('Error placing order:', error)
      
      // Show more specific error message
      let errorMessage = 'An unexpected error occurred. Please try again.'
      
      if (error instanceof Error) {
        errorMessage = error.message
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        })
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const { subtotal, shipping, tax, total } = calculateTotals()

  if (orderSuccess && orderData) {
    return (
      <div className="min-h-screen bg-white py-4 sm:py-6 md:py-8">
        <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
          <div className="text-center mb-6 sm:mb-8">
            <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-3 sm:mb-4" />
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-2">Order Placed Successfully!</h1>
            <p className="text-sm sm:text-base text-[#404040]">Your order has been confirmed and account created</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-[#404040]">Order Number:</span>
                  <span className="font-semibold">{orderData.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#404040]">Total Amount:</span>
                  <span className="font-semibold">AED {orderData.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#404040]">Payment Method:</span>
                  <span className="font-semibold capitalize">{orderData.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#404040]">Status:</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Account Created
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Account Details Sent!</h3>
                  <p className="text-green-700 text-sm">
                    We've created your account and sent the login credentials to <strong>{orderData.email}</strong>
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-[#404040]">
                    <strong>Email:</strong> {orderData.email}
                  </p>
                  <p className="text-sm text-[#404040]">
                    <strong>Password:</strong> Check your email for the generated password
                  </p>
                </div>
                <Button 
                  onClick={() => router.push('/login')}
                  className="w-full"
                >
                  Login to Your Account
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button 
              onClick={() => router.push('/')}
              variant="outline"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-3 sm:px-4 max-w-6xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">Guest Checkout</h1>
            <p className="text-sm sm:text-base text-[#404040] mt-1">Complete your order without creating an account</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={errors.email ? 'border-red-500' : ''}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={errors.phone ? 'border-red-500' : ''}
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={errors.firstName ? 'border-red-500' : ''}
                      placeholder="John"
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={errors.lastName ? 'border-red-500' : ''}
                      placeholder="Doe"
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                <div>
                  <Label htmlFor="address" className="text-sm sm:text-base">Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`text-sm sm:text-base ${errors.address ? 'border-red-500' : ''}`}
                    placeholder="Street address, apartment, suite, etc."
                    rows={3}
                  />
                  {errors.address && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.address}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={errors.city ? 'border-red-500' : ''}
                      placeholder="Mumbai"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className={errors.state ? 'border-red-500' : ''}
                      placeholder="Maharashtra"
                    />
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      className={errors.zipCode ? 'border-red-500' : ''}
                      placeholder="400001"
                    />
                    {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-white">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="text-amber-600"
                    />
                    <div>
                      <div className="font-medium">Cash on Delivery (COD)</div>
                      <div className="text-sm text-[#737373]">Pay when your order arrives</div>
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                {(state.items || []).map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#fafafa] rounded-lg flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Package className="w-6 h-6 text-[#737373]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-[#737373] text-sm">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-medium">AED {(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>AED {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `AED ${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (GST)</span>
                    <span>AED {tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>AED {total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={loading || !state.items || state.items.length === 0}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-800 text-sm">
                    <strong>Account Creation:</strong> We'll create your account automatically and send login details to your email.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
