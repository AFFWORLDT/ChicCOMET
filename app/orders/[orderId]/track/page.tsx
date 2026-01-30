"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  MapPin, 
  Clock,
  CheckCircle,
  Circle,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { Footer } from "@/components/footer"

interface Order {
  _id: string
  orderNumber: string
  user: {
    _id: string
    name: string
    email: string
  }
  items: Array<{
    product: string
    name: string
    price: number
    quantity: number
    image: string
    total: number
  }>
  totalAmount: number
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    phone: string
  }
  paymentMethod: string
  paymentStatus: string
  status: string
  notes: string
  trackingNumber: string
  createdAt: string
  updatedAt: string
}

interface TrackingEvent {
  id: string
  status: string
  description: string
  location: string
  timestamp: string
  completed: boolean
}

export default function OrderTrackingPage() {
  const params = useParams()
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const orderId = params.orderId as string

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/user/orders/${orderId}`)
        const data = await response.json()
        
        if (data.success) {
          setOrder(data.data)
          generateTrackingEvents(data.data)
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

  const generateTrackingEvents = (order: Order) => {
    const orderDate = new Date(order.createdAt)
    const events: TrackingEvent[] = [
      {
        id: '1',
        status: 'Order Placed',
        description: 'Your order has been placed successfully',
        location: 'Online Store',
        timestamp: orderDate.toISOString(),
        completed: true
      },
      {
        id: '2',
        status: 'Order Confirmed',
        description: 'Your order has been confirmed and is being prepared',
        location: 'Warehouse',
        timestamp: new Date(orderDate.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
        completed: order.status !== 'pending'
      },
      {
        id: '3',
        status: 'Processing',
        description: 'Your order is being processed and packed',
        location: 'Warehouse',
        timestamp: new Date(orderDate.getTime() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours later
        completed: ['processing', 'shipped', 'delivered'].includes(order.status)
      },
      {
        id: '4',
        status: 'Shipped',
        description: 'Your order has been shipped and is on its way',
        location: 'Shipping Center',
        timestamp: new Date(orderDate.getTime() + 24 * 60 * 60 * 1000).toISOString(), // 1 day later
        completed: ['shipped', 'delivered'].includes(order.status)
      },
      {
        id: '5',
        status: 'Out for Delivery',
        description: 'Your order is out for delivery',
        location: order.shippingAddress.city,
        timestamp: new Date(orderDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days later
        completed: order.status === 'delivered'
      },
      {
        id: '6',
        status: 'Delivered',
        description: 'Your order has been delivered successfully',
        location: order.shippingAddress.address,
        timestamp: new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days later
        completed: order.status === 'delivered'
      }
    ]
    
    setTrackingEvents(events)
  }

  const getStatusIcon = (event: TrackingEvent) => {
    if (event.completed) {
      return <CheckCircle className="h-6 w-6 text-green-500" />
    }
    return <Circle className="h-6 w-6 text-gray-300" />
  }

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading tracking information...</p>
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
              <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Tracking Not Found</h1>
              <p className="text-gray-600 mb-8">
                {error || "The tracking information you're looking for doesn't exist."}
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
              <Link href={`/orders/${order._id}`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Order
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
                <p className="text-gray-600">Order #{order.orderNumber}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge className={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
              <p className="text-sm text-gray-600 mt-1">
                Tracking: {order.trackingNumber}
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Order Details</h4>
                  <p className="text-sm text-gray-600">Order Number: {order.orderNumber}</p>
                  <p className="text-sm text-gray-600">Total Amount: AED {order.totalAmount.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Items: {order.items.length}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                  <p className="text-sm text-gray-600">{order.shippingAddress.name}</p>
                  <p className="text-sm text-gray-600">{order.shippingAddress.address}</p>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                  <p className="text-sm text-gray-600">{order.user.email}</p>
                  <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Tracking Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {trackingEvents.map((event, index) => (
                  <div key={event.id} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(event)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium ${event.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                          {event.status}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {formatDate(event.timestamp)}
                        </span>
                      </div>
                      <p className={`text-sm mt-1 ${event.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                        {event.description}
                      </p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {event.location}
                      </div>
                    </div>
                    {index < trackingEvents.length - 1 && (
                      <div className="absolute left-6 mt-8 w-0.5 h-12 bg-gray-200"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Estimated Delivery */}
          <Card className="mt-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Clock className="h-8 w-8 text-yellow-500" />
                  <div>
                    <h3 className="font-semibold text-lg">Estimated Delivery</h3>
                    <p className="text-gray-600">
                      {order.status === 'delivered' 
                        ? 'Delivered on ' + formatDate(order.updatedAt)
                        : 'Expected delivery within 3-5 business days'
                      }
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <Link href={`/orders/${order._id}`}>
              <Button variant="outline">
                <Package className="h-4 w-4 mr-2" />
                View Order Details
              </Button>
            </Link>
            <Link href={`/orders/${order._id}/invoice`}>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}