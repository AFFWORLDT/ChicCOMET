"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  Truck,
  Package,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  CreditCard,
  ArrowLeft
} from "lucide-react"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"
import { normalizeAdminOrder, normalizeApiResponse } from "@/lib/admin-utils"
import { fetchWithRetry } from "@/lib/admin-fetch-utils"

interface Order {
  _id: string
  orderNumber: string
  user: {
    name: string
    email: string
  }
  items: Array<{
    product: {
      name: string
    }
    quantity: number
    price: number
  }>
  totalAmount: number
  status: 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned' | 'refunded'
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  createdAt: string
  updatedAt: string
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered": return "bg-green-100 text-green-800"
    case "pending": return "bg-yellow-100 text-yellow-800"
    case "confirmed": return "bg-blue-100 text-blue-800"
    case "processing": return "bg-indigo-100 text-indigo-800"
    case "packed": return "bg-purple-100 text-purple-800"
    case "shipped": return "bg-cyan-100 text-cyan-800"
    case "out_for_delivery": return "bg-orange-100 text-orange-800"
    case "cancelled": return "bg-red-100 text-red-800"
    case "returned": return "bg-pink-100 text-pink-800"
    case "refunded": return "bg-gray-100 text-gray-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered": return <CheckCircle className="h-4 w-4" />
    case "pending": return <Clock className="h-4 w-4" />
    case "confirmed": return <CheckCircle className="h-4 w-4" />
    case "processing": return <Package className="h-4 w-4" />
    case "packed": return <Package className="h-4 w-4" />
    case "shipped": return <Truck className="h-4 w-4" />
    case "out_for_delivery": return <Truck className="h-4 w-4" />
    case "cancelled": return <XCircle className="h-4 w-4" />
    case "returned": return <ArrowLeft className="h-4 w-4" />
    case "refunded": return <CreditCard className="h-4 w-4" />
    default: return <Package className="h-4 w-4" />
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "delivered": return "Delivered"
    case "pending": return "Pending"
    case "confirmed": return "Confirmed"
    case "processing": return "Processing"
    case "packed": return "Packed"
    case "shipped": return "Shipped"
    case "out_for_delivery": return "Out for Delivery"
    case "cancelled": return "Cancelled"
    case "returned": return "Returned"
    case "refunded": return "Refunded"
    default: return "Unknown"
  }
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError(null)
      
      const result = await fetchWithRetry(`/api/orders?t=${Date.now()}`)
      
      if (result.success && result.data) {
        try {
          // result.data is the full API response { success: true, data: { orders: [...], pagination: {...} } }
          // Extract the actual orders array
          const responseData = result.data.data || result.data
          const ordersData = Array.isArray(responseData)
            ? responseData
            : responseData.orders || responseData.data || []
          
          const normalized = normalizeApiResponse<Order>({ success: true, data: ordersData }, 'data')
          
          if (normalized.success) {
            // Normalize all orders with error handling
            const normalizedOrders = (normalized.data || [])
              .map(o => {
                try {
                  return normalizeAdminOrder(o)
                } catch (err) {
                  console.warn('Error normalizing order:', err, o)
                  return null
                }
              })
              .filter(o => o !== null) as Order[]
            
            setOrders(normalizedOrders)
          } else {
            setError(normalized.error || 'Failed to fetch orders')
            setOrders([])
          }
        } catch (err) {
          console.error('Error processing orders:', err)
          setError('Error processing orders data')
          setOrders([])
        }
      } else {
        setError(result.error || 'Failed to fetch orders')
        setOrders([])
      }
      
      setLoading(false)
    }

    fetchOrders()
  }, [])

  const filteredOrders = (orders || []).filter(order => {
    if (!order) return false
    try {
      const orderNumber = (order.orderNumber || '').toLowerCase()
      const userName = (order.user?.name || '').toLowerCase()
      const userEmail = (order.user?.email || '').toLowerCase()
      const searchLower = searchTerm.toLowerCase()
      
      const matchesSearch = orderNumber.includes(searchLower) ||
                           userName.includes(searchLower) ||
                           userEmail.includes(searchLower)
      const matchesStatus = selectedStatus === "all" || order.status === selectedStatus
      return matchesSearch && matchesStatus
    } catch (err) {
      console.warn('Error filtering order:', err, order)
      return false
    }
  })

  const statuses = ["all", "pending", "confirmed", "processing", "packed", "shipped", "out_for_delivery", "delivered", "cancelled", "returned", "refunded"]

  const totalRevenue = (orders || [])
    .filter(order => order.status === "delivered")
    .reduce((sum, order) => sum + order.totalAmount, 0)

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      
      // Check if response is OK and is JSON
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      // Check content type
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Non-JSON response:', text.substring(0, 200))
        throw new Error('Server returned non-JSON response')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus as any } : order
        ))
        toast.success(`Order status updated to ${getStatusText(newStatus)}`)
      } else {
        toast.error(data.error || 'Failed to update order status')
      }
    } catch (err: any) {
      console.error('Error updating order status:', err)
      const errorMessage = err?.message || 'An unexpected error occurred while updating order status'
      toast.error(errorMessage)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders and fulfillment</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === "pending").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Orders</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.status === "processing").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRevenue)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === "all" ? "All Statuses" : getStatusText(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
          <CardDescription>
            Showing {filteredOrders.length} of {orders.length} orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center text-destructive py-10">
              <p>{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">Retry</Button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              <p>No orders found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-mono font-medium">{order.orderNumber}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.user.name}</div>
                        <div className="text-sm text-muted-foreground">{order.user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{order.items.length}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(order.totalAmount)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(order.status)}
                          <span>{getStatusText(order.status)}</span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="relative z-10"
                            onClick={(e) => {
                              e.stopPropagation()
                            }}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          align="end" 
                          className="z-50"
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                        >
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/admin/orders/${order._id}`)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {order.status === "pending" && (
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation()
                                updateOrderStatus(order._id, "confirmed")
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Confirmed
                            </DropdownMenuItem>
                          )}
                          {order.status === "confirmed" && (
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation()
                                updateOrderStatus(order._id, "processing")
                              }}
                            >
                              <Package className="h-4 w-4 mr-2" />
                              Mark as Processing
                            </DropdownMenuItem>
                          )}
                          {order.status === "processing" && (
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation()
                                updateOrderStatus(order._id, "packed")
                              }}
                            >
                              <Package className="h-4 w-4 mr-2" />
                              Mark as Packed
                            </DropdownMenuItem>
                          )}
                          {order.status === "packed" && (
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation()
                                updateOrderStatus(order._id, "shipped")
                              }}
                            >
                              <Truck className="h-4 w-4 mr-2" />
                              Mark as Shipped
                            </DropdownMenuItem>
                          )}
                          {order.status === "shipped" && (
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation()
                                updateOrderStatus(order._id, "out_for_delivery")
                              }}
                            >
                              <Truck className="h-4 w-4 mr-2" />
                              Mark as Out for Delivery
                            </DropdownMenuItem>
                          )}
                          {order.status === "out_for_delivery" && (
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation()
                                updateOrderStatus(order._id, "delivered")
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Delivered
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
