"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  Eye,
  Download,
  Calendar,
  MapPin,
  Loader2,
  RotateCcw
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface OrderItem {
  name: string
  quantity: number
  price: number
  image: string
}

interface Order {
  id: string
  date: string
  status: string
  total: number
  items: OrderItem[]
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  trackingNumber: string | null
  estimatedDelivery: string | null
  paymentMethod: string
  orderId: string
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed": return "bg-green-100 text-green-800"
    case "shipped": return "bg-blue-100 text-blue-800"
    case "pending": return "bg-yellow-100 text-yellow-800"
    case "cancelled": return "bg-red-100 text-red-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed": return <CheckCircle className="h-4 w-4" />
    case "shipped": return <Truck className="h-4 w-4" />
    case "pending": return <Clock className="h-4 w-4" />
    default: return <Package className="h-4 w-4" />
  }
}

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push("/login")
      return
    }

    const fetchOrders = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/user/orders?userId=${user.id}`)
        const data = await response.json()
        
        if (data.success) {
          console.log('Orders data:', data.data)
          console.log('First order shipping address:', data.data[0]?.shippingAddress)
          setOrders(data.data)
        } else {
          setError(data.error || 'Failed to fetch orders')
          toast.error(data.error || 'Failed to fetch orders')
        }
      } catch (err) {
        console.error('Error fetching orders:', err)
        setError('An unexpected error occurred while fetching orders')
        toast.error('An unexpected error occurred while fetching orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user, router])

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading your orders...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-destructive mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Order History</h1>
            <p className="text-muted-foreground">Track and manage your orders</p>
          </div>

          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        Placed on {order.date}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">AED {(order.total || 0).toFixed(2)}</div>
                      <Badge className={getStatusColor(order.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-medium mb-2">Items Ordered</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                                <Package className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <span>{item.name}</span>
                            </div>
                            <div className="text-right">
                              <div>Qty: {item.quantity}</div>
                              <div className="font-medium">AED {(item.price || 0).toFixed(2)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          Shipping Address
                        </h4>
                        <div className="text-sm text-muted-foreground">
                          <p>{order.shippingAddress?.name}</p>
                          <p>{order.shippingAddress?.address}</p>
                          <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                          <p>{order.shippingAddress?.country}</p>
                        </div>
                      </div>
                      
                      {order.trackingNumber && (
                        <div>
                          <h4 className="font-medium mb-2 flex items-center">
                            <Truck className="h-4 w-4 mr-1" />
                            Tracking Information
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Tracking #: {order.trackingNumber}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Estimated delivery: {order.estimatedDelivery}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Order Actions */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                      <Link href={`/orders/${order.orderId}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      
                      {order.trackingNumber && (
                        <Link href={`/orders/${order.orderId}/track`}>
                          <Button variant="outline" size="sm">
                            <Truck className="h-4 w-4 mr-2" />
                            Track Package
                          </Button>
                        </Link>
                      )}
                      
                      <Link href={`/orders/${order.orderId}/invoice`}>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download Invoice
                        </Button>
                      </Link>
                      
                      {order.status === "completed" && (
                        <Button variant="outline" size="sm">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reorder
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {orders.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't placed any orders yet. Start shopping to see your orders here.
                </p>
                <Button>Start Shopping</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
