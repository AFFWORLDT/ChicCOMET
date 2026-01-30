"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  CheckCircle, 
  Package, 
  Truck, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  ArrowLeft,
  Download,
  Eye,
  ShoppingBag,
  Edit
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { Footer } from "@/components/footer"

interface OrderItem {
  product: string
  name: string
  price: number
  quantity: number
  image: string
  total: number
}

interface ShippingAddress {
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
}

interface Order {
  _id: string
  orderNumber: string
  user: {
    _id: string
    name: string
    email: string
  }
  items: OrderItem[]
  totalAmount: number
  shippingAddress: ShippingAddress
  paymentMethod: string
  paymentStatus: string
  status: string
  notes: string
  trackingNumber: string
  createdAt: string
  updatedAt: string
}

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false)
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false)
  const [editAddress, setEditAddress] = useState<ShippingAddress>({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  })

  const orderId = params.orderId as string

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/user/orders/${orderId}`)
        const data = await response.json()
        
        if (data.success) {
          console.log('Order data:', data.data)
          console.log('Shipping address:', data.data.shippingAddress)
          setOrder(data.data)
        } else {
          setError(data.error || 'Failed to fetch order details')
          toast.error(data.error || 'Failed to fetch order details')
        }
      } catch (err) {
        console.error('Error fetching order:', err)
        setError('An unexpected error occurred')
        toast.error('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-purple-100 text-purple-800'
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleEditAddress = () => {
    if (order && order.shippingAddress) {
      setEditAddress({
        name: order.shippingAddress.name || '',
        address: order.shippingAddress.address || '',
        city: order.shippingAddress.city || '',
        state: order.shippingAddress.state || '',
        zipCode: order.shippingAddress.zipCode || '',
        country: order.shippingAddress.country || '',
        phone: order.shippingAddress.phone || ''
      })
      setIsEditAddressOpen(true)
    } else {
      toast.error('Order or shipping address not found')
    }
  }

  const handleUpdateAddress = async () => {
    if (!order) return

    // Validate required fields
    if (!editAddress.name || !editAddress.address || !editAddress.city || !editAddress.state || !editAddress.zipCode || !editAddress.country) {
      toast.error('Please fill in all required address fields')
      return
    }

    try {
      setIsUpdatingAddress(true)
      console.log(`🔄 Updating address for order ${order._id}`)
      console.log(`📝 Address data:`, editAddress)
      
      const response = await fetch(`/api/orders/${order._id}/address`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editAddress),
      })

      // Read response body
      let responseText = ''
      try {
        responseText = await response.text()
      } catch (readError) {
        console.error('Error reading response:', readError)
        toast.error('Error reading server response')
        return
      }

      // Parse JSON response
      let data: any = {}
      try {
        if (responseText.trim()) {
          data = JSON.parse(responseText)
        } else {
          toast.error('Empty response from server')
          return
        }
      } catch (parseError) {
        console.error('Error parsing response:', parseError)
        console.error('Response text:', responseText.substring(0, 500))
        toast.error('Invalid response from server')
        return
      }

      if (!response.ok || !data.success) {
        const errorMessage = data.error || data.message || 'Failed to update address'
        console.error('Address update failed:', data)
        toast.error(errorMessage)
        return
      }

      // Update local state with the response data
      if (data.data && data.data.shippingAddress) {
        setOrder(prev => prev ? { ...prev, shippingAddress: data.data.shippingAddress } : null)
      } else {
        setOrder(prev => prev ? { ...prev, shippingAddress: editAddress } : null)
      }
      
      setIsEditAddressOpen(false)
      toast.success('Address updated successfully!')
      console.log(`✅ Address updated successfully for order ${order._id}`)
      
    } catch (err: any) {
      console.error('Error updating address:', err)
      const errorMessage = err?.message || 'An unexpected error occurred'
      toast.error(errorMessage)
    } finally {
      setIsUpdatingAddress(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading order details...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
              <p className="text-gray-600 mb-8">
                {error || "The order you're looking for doesn't exist or you don't have permission to view it."}
              </p>
              <Link href="/orders">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Orders
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href="/orders">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Orders
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
                <p className="text-gray-600">Order #{order.orderNumber}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Link href={`/orders/${order._id}/invoice`}>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Invoice
                </Button>
              </Link>
              <Link href={`/orders/${order._id}/track`}>
                <Button variant="outline" size="sm">
                  <Truck className="h-4 w-4 mr-2" />
                  Track
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Status */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <h3 className="font-semibold text-lg">Order Placed Successfully!</h3>
                    <p className="text-gray-600">Your order has been confirmed and is being processed.</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-1">
                    Payment: <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </Badge>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Order Items ({order.items.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.items.map((item: any, index: number) => {
                    const itemName = item.name || (item.product && typeof item.product === 'object' ? item.product.name : 'Product') || 'Product'
                    const itemImage = item.image || (item.product && typeof item.product === 'object' ? item.product.image : '/placeholder.svg') || '/placeholder.svg'
                    const itemPrice = item.price || 0
                    const itemQuantity = item.quantity || 0
                    const itemTotal = item.total || (itemPrice * itemQuantity)
                    
                    return (
                      <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={itemImage}
                            alt={itemName}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900">{itemName}</h3>
                          <p className="text-sm text-gray-500">AED {itemPrice.toFixed(2)} each</p>
                          <p className="text-sm text-gray-500">Quantity: {itemQuantity}</p>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            AED {itemTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Order Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Order Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Order Number</p>
                      <p className="text-gray-900">{order.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tracking Number</p>
                      <p className="text-gray-900 font-mono">{order.trackingNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Order Date</p>
                      <p className="text-gray-900">{formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Payment Method</p>
                      <p className="text-gray-900 capitalize">
                        {order.paymentMethod.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  
                  {order.notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Order Notes</p>
                      <p className="text-gray-900">{order.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary & Shipping */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>AED {order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>AED {order.totalAmount.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Shipping Address
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditAddress}
                      className="text-xs"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                  <p className="text-gray-600">{order.shippingAddress.address}</p>
                  <p className="text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p className="text-gray-600">{order.shippingAddress.country}</p>
                  <p className="text-gray-600 flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {order.shippingAddress.phone}
                  </p>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="font-medium text-gray-900">{order.user.name}</p>
                  <p className="text-gray-600 flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {order.user.email}
                  </p>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Link href="/products" className="block">
                  <Button className="w-full" variant="outline">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
                <Link href="/orders" className="block">
                  <Button className="w-full" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View All Orders
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Address Modal */}
      <Dialog open={isEditAddressOpen} onOpenChange={setIsEditAddressOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Shipping Address</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={editAddress.name}
                onChange={(e) => setEditAddress(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
              />
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={editAddress.address}
                onChange={(e) => setEditAddress(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter address"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={editAddress.city}
                  onChange={(e) => setEditAddress(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Enter city"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={editAddress.state}
                  onChange={(e) => setEditAddress(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="Enter state"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={editAddress.zipCode}
                  onChange={(e) => setEditAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                  placeholder="Enter ZIP code"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={editAddress.country}
                  onChange={(e) => setEditAddress(prev => ({ ...prev, country: e.target.value }))}
                  placeholder="Enter country"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={editAddress.phone}
                onChange={(e) => setEditAddress(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditAddressOpen(false)}
                disabled={isUpdatingAddress}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateAddress}
                disabled={isUpdatingAddress}
              >
                {isUpdatingAddress ? 'Updating...' : 'Update Address'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}