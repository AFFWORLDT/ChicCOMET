"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  Check,
  XCircle,
  Loader2,
  Edit,
  Download,
  Plus,
  Tag,
  AlertTriangle,
  Star,
  Calendar,
  Phone,
  Mail,
  Building,
  FileText,
  History,
  Eye,
  EyeOff
} from "lucide-react"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"

interface Order {
  _id: string
  orderNumber: string
  user: {
    _id: string
    name: string
    email: string
    phone?: string
  }
  items: Array<{
    product: {
      _id: string
      name: string
      image?: string
      sku: string
    }
    quantity: number
    price: number
    total: number
  }>
  totalAmount: number
  subtotal: number
  tax: number
  shipping: number
  discount: number
  status: 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned' | 'refunded'
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
  trackingNumber?: string
  carrier?: string
  estimatedDelivery?: string
  actualDelivery?: string
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    phone?: string
  }
  billingAddress?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  notes?: string
  internalNotes?: string
  statusHistory?: Array<{
    status: string
    timestamp: string
    note?: string
    updatedBy?: string
  }>
  priority: 'low' | 'normal' | 'high' | 'urgent'
  source: 'website' | 'mobile' | 'admin' | 'api'
  tags?: string[]
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

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent": return "bg-red-100 text-red-800"
    case "high": return "bg-orange-100 text-orange-800"
    case "normal": return "bg-blue-100 text-blue-800"
    case "low": return "bg-gray-100 text-gray-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "paid": return "bg-green-100 text-green-800"
    case "pending": return "bg-yellow-100 text-yellow-800"
    case "failed": return "bg-red-100 text-red-800"
    case "refunded": return "bg-gray-100 text-gray-800"
    case "partially_refunded": return "bg-orange-100 text-orange-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showInternalNotes, setShowInternalNotes] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [newInternalNote, setNewInternalNote] = useState("")
  const [statusNotes, setStatusNotes] = useState("")

  useEffect(() => {
    if (params.id) {
      fetchOrderDetails()
    }
  }, [params.id])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        setOrder(data.data)
      } else {
        setError(data.error || 'Failed to fetch order details')
        toast.error(data.error || 'Failed to fetch order details')
      }
    } catch (err) {
      console.error('Error fetching order details:', err)
      setError('An unexpected error occurred while fetching order details')
      toast.error('An unexpected error occurred while fetching order details')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (newStatus: string, note?: string) => {
    if (!order) return
    
    try {
      setUpdating(true)
      const response = await fetch(`/api/orders/${order._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          statusHistory: [
            ...(order.statusHistory || []),
            {
              status: newStatus,
              timestamp: new Date().toISOString(),
              note: note || statusNotes || '',
              updatedBy: 'admin'
            }
          ]
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setOrder({ ...order, status: newStatus as any, statusHistory: data.data.statusHistory })
        setStatusNotes("") // Clear notes after successful update
        toast.success(`Order status updated to ${getStatusText(newStatus)}`)
      } else {
        toast.error(data.error || 'Failed to update order status')
      }
    } catch (err) {
      console.error('Error updating order status:', err)
      toast.error('An unexpected error occurred while updating order status')
    } finally {
      setUpdating(false)
    }
  }

  const updatePaymentStatus = async (newPaymentStatus: string) => {
    if (!order) return

    try {
      setUpdating(true)
      const response = await fetch(`/api/orders/${order._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentStatus: newPaymentStatus,
          statusHistory: [
            ...(order.statusHistory || []),
            {
              status: order.status,
              timestamp: new Date().toISOString(),
              note: `Payment status updated to ${newPaymentStatus}`,
              updatedBy: 'admin'
            }
          ]
        }),
      })

      const data = await response.json()

      if (data.success) {
        setOrder({ ...order, paymentStatus: newPaymentStatus as any, statusHistory: data.data.statusHistory })
        toast.success(`Payment status updated to ${newPaymentStatus.replace('_', ' ').toUpperCase()}`)
      } else {
        toast.error(data.error || 'Failed to update payment status')
      }
    } catch (err) {
      console.error('Error updating payment status:', err)
      toast.error('An unexpected error occurred while updating payment status')
    } finally {
      setUpdating(false)
    }
  }

  const downloadInvoice = async () => {
    if (!order) return

    try {
      setUpdating(true)
      const response = await fetch(`/api/orders/${order._id}/invoice`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `invoice-${order.orderNumber}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Invoice downloaded successfully')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to download invoice')
      }
    } catch (err) {
      console.error('Error downloading invoice:', err)
      toast.error('An unexpected error occurred while downloading invoice')
    } finally {
      setUpdating(false)
    }
  }

  const updateOrderField = async (field: string, value: any) => {
    if (!order) return
    
    try {
      const response = await fetch(`/api/orders/${order._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: value }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setOrder({ ...order, [field]: value })
        toast.success(`${field} updated successfully`)
      } else {
        toast.error(data.error || `Failed to update ${field}`)
      }
    } catch (err) {
      console.error(`Error updating ${field}:`, err)
      toast.error(`An unexpected error occurred while updating ${field}`)
    }
  }

  const addTag = async () => {
    if (!newTag.trim() || !order) return
    
    const updatedTags = [...(order.tags || []), newTag.trim()]
    await updateOrderField('tags', updatedTags)
    setNewTag("")
  }

  const removeTag = async (tagToRemove: string) => {
    if (!order) return
    
    const updatedTags = (order.tags || []).filter(tag => tag !== tagToRemove)
    await updateOrderField('tags', updatedTags)
  }

  const addInternalNote = async () => {
    if (!newInternalNote.trim() || !order) return
    
    const updatedNotes = order.internalNotes 
      ? `${order.internalNotes}\n\n${new Date().toLocaleString()}: ${newInternalNote.trim()}`
      : `${new Date().toLocaleString()}: ${newInternalNote.trim()}`
    
    await updateOrderField('internalNotes', updatedNotes)
    setNewInternalNote("")
  }

  const getAllowedStatuses = (currentStatus: string) => {
    // Always provide comprehensive status options for maximum flexibility
    const allStatuses = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded']
    
    // Remove current status from options
    return allStatuses.filter(status => status !== currentStatus)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="text-center py-10">
        <p className="text-destructive mb-4">{error || 'Order not found'}</p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button onClick={() => router.back()} variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Order Details</h1>
            <p className="text-muted-foreground">Order #{order.orderNumber}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={downloadInvoice}
            disabled={updating}
          >
            {updating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Download Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status & Priority */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Order Status & Priority</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(order.status)}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(order.status)}
                      <span>{getStatusText(order.status)}</span>
                    </div>
                  </Badge>
                  <Badge className={getPriorityColor(order.priority)}>
                    <Star className="h-3 w-3 mr-1" />
                    {(order.priority || 'normal').toUpperCase()}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className='text-2xl font-bold'>{formatCurrency(order.totalAmount || 0)}</div>
                  <div className="text-sm text-muted-foreground">Total Amount</div>
                </div>
              </div>
              
              {/* Enhanced Status Management */}
              <div className="space-y-4">
                {/* Status Workflow Timeline */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Order Workflow</label>
                  <div className="flex items-center justify-between">
                    {['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered'].map((status, index) => {
                      const isActive = order.status === status
                      const isCompleted = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered'].indexOf(order.status) > index
                      const isAvailable = getAllowedStatuses(order.status).includes(status)
                      
                      return (
                        <div key={status} className="flex flex-col items-center space-y-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                            isActive 
                              ? 'bg-primary border-primary text-primary-foreground' 
                              : isCompleted 
                                ? 'bg-green-500 border-green-500 text-white' 
                                : isAvailable
                                  ? 'bg-muted border-muted-foreground text-muted-foreground cursor-pointer hover:bg-primary hover:border-primary hover:text-primary-foreground'
                                  : 'bg-muted border-muted text-muted'
                          }`}
                          onClick={() => isAvailable && updateOrderStatus(status)}
                          >
                            {isCompleted ? (
                              <Check className="h-4 w-4" />
                            ) : isActive ? (
                              getStatusIcon(status)
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-current" />
                            )}
                          </div>
                          <span className={`text-xs text-center max-w-16 ${
                            isActive ? 'font-medium text-primary' : 'text-muted-foreground'
                          }`}>
                            {getStatusText(status)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Special Statuses */}
                {['cancelled', 'returned', 'refunded'].includes(order.status) && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Special Status Actions</label>
                    <div className="flex space-x-2">
                      {getAllowedStatuses(order.status).map(status => (
                        <Button
                          key={status}
                          variant={status === 'confirmed' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateOrderStatus(status)}
                          disabled={updating}
                          className="flex items-center space-x-2"
                        >
                          {getStatusIcon(status)}
                          <span>{getStatusText(status)}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Status Actions */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Quick Actions</label>
                  <div className="grid grid-cols-2 gap-2">
                    {getAllowedStatuses(order.status).slice(0, 4).map(status => (
                      <Button
                        key={status}
                        variant="outline"
                        size="sm"
                        onClick={() => updateOrderStatus(status)}
                        disabled={updating}
                        className="justify-start"
                      >
                        {getStatusIcon(status)}
                        <span className="ml-2">{getStatusText(status)}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Advanced Status Update */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Advanced Status Update</label>
                  <div className="flex space-x-2">
                    <Select onValueChange={(value) => updateOrderStatus(value)}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select new status" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAllowedStatuses(order.status).map(status => (
                          <SelectItem key={status} value={status}>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(status)}
                              <span>{getStatusText(status)}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={() => updateOrderStatus(getAllowedStatuses(order.status)[0])}
                      disabled={updating || getAllowedStatuses(order.status).length === 0}
                      size="sm"
                    >
                      {updating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Edit className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Status Notes */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Status Notes</label>
                  <Textarea
                    placeholder="Add notes for this status change..."
                    className="min-h-[80px]"
                    onChange={(e) => setStatusNotes(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>{order.items.length} item(s) in this order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                      {item.product.image ? (
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground">SKU: {item.product.sku}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(item.price || 0)}</div>
                      <div className="text-sm text-muted-foreground">each</div>
                      <div className="text-sm font-medium text-primary">Total: {formatCurrency(item.total || 0)}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(order.subtotal || 0)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-{formatCurrency(order.discount || 0)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{formatCurrency(order.shipping || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>{formatCurrency(order.tax || 0)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(order.totalAmount || 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Notes */}
          {(order.notes || order.internalNotes) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order Notes</span>
                  {order.internalNotes && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowInternalNotes(!showInternalNotes)}
                    >
                      {showInternalNotes ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {showInternalNotes ? 'Hide' : 'Show'} Internal Notes
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.notes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Customer Notes</label>
                    <p className="text-sm mt-1 p-3 bg-muted rounded-md">{order.notes}</p>
                  </div>
                )}
                {order.internalNotes && showInternalNotes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Internal Notes</label>
                    <p className="text-sm mt-1 p-3 bg-muted rounded-md whitespace-pre-wrap">{order.internalNotes}</p>
                  </div>
                )}
                
                {/* Add Internal Note */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Add Internal Note</label>
                  <div className="flex space-x-2">
                    <Textarea
                      placeholder="Add internal note..."
                      value={newInternalNote}
                      onChange={(e) => setNewInternalNote(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={addInternalNote} disabled={!newInternalNote.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Status History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <History className="h-5 w-5" />
                <span>Status History & Timeline</span>
              </CardTitle>
              <CardDescription>
                Complete order lifecycle tracking with detailed notes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.statusHistory && order.statusHistory.length > 0 ? (
                  <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
                    
                    {order.statusHistory.map((history, index) => (
                      <div key={index} className="relative flex items-start space-x-4 pb-6">
                        {/* Timeline Dot */}
                        <div className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                          index === 0 
                            ? 'bg-primary border-primary text-primary-foreground' 
                            : 'bg-background border-border'
                        }`}>
                          {index === 0 ? (
                            getStatusIcon(history.status)
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge className={getStatusColor(history.status)}>
                              {getStatusIcon(history.status)}
                              <span className="ml-1">{getStatusText(history.status)}</span>
                            </Badge>
                            {history.updatedBy && (
                              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                by {history.updatedBy}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-xs text-muted-foreground mb-2">
                            {new Date(history.timestamp).toLocaleString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          
                          {history.note && (
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <p className="text-sm">{history.note}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No status history available</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Status changes will appear here with timestamps and notes
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Customer Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="font-medium">{order.user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm">{order.user.email}</p>
              </div>
              {order.user.phone && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-sm">{order.user.phone}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Shipping Address</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{order.shippingAddress.street}</p>
              <p className="text-sm">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p className="text-sm">{order.shippingAddress.country}</p>
              {order.shippingAddress.phone && (
                <p className="text-sm text-muted-foreground">Phone: {order.shippingAddress.phone}</p>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Payment Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                <p className="font-medium capitalize">{(order.paymentMethod || 'cash_on_delivery').replace('_', ' ')}</p>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">Payment Status</label>
                <div className="flex items-center space-x-3">
                  <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                    {(order.paymentStatus || 'pending').replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Payment Status Update */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Update Payment Status</label>
                <div className="flex space-x-2">
                  <Select onValueChange={(value) => updatePaymentStatus(value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      {['pending', 'paid', 'failed', 'refunded', 'partially_refunded'].map(status => (
                        <SelectItem key={status} value={status}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              status === 'paid' ? 'bg-green-500' :
                              status === 'failed' ? 'bg-red-500' :
                              status === 'refunded' ? 'bg-orange-500' :
                              status === 'partially_refunded' ? 'bg-yellow-500' :
                              'bg-gray-500'
                            }`}></div>
                            <span>{status.replace('_', ' ').toUpperCase()}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={() => updatePaymentStatus('paid')}
                    disabled={updating}
                    size="sm"
                    variant="outline"
                  >
                    {updating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Quick Payment Actions */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Quick Payment Actions</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updatePaymentStatus('paid')}
                    disabled={updating || order.paymentStatus === 'paid'}
                    className="justify-start"
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span>Mark as Paid</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updatePaymentStatus('failed')}
                    disabled={updating || order.paymentStatus === 'failed'}
                    className="justify-start"
                  >
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                    <span>Mark as Failed</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updatePaymentStatus('refunded')}
                    disabled={updating || order.paymentStatus === 'refunded'}
                    className="justify-start"
                  >
                    <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                    <span>Mark as Refunded</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updatePaymentStatus('partially_refunded')}
                    disabled={updating || order.paymentStatus === 'partially_refunded'}
                    className="justify-start"
                  >
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                    <span>Partial Refund</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-5 w-5" />
                <span>Tracking Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tracking Number</label>
                <div className="flex space-x-2">
                  <Input
                    value={order.trackingNumber || ''}
                    onChange={(e) => updateOrderField('trackingNumber', e.target.value)}
                    placeholder="Enter tracking number"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Carrier</label>
                <div className="flex space-x-2">
                  <Input
                    value={order.carrier || ''}
                    onChange={(e) => updateOrderField('carrier', e.target.value)}
                    placeholder="Enter carrier name"
                  />
                </div>
              </div>
              {order.estimatedDelivery && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estimated Delivery</label>
                  <p className="text-sm">{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                </div>
              )}
              {order.actualDelivery && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Actual Delivery</label>
                  <p className="text-sm">{new Date(order.actualDelivery).toLocaleDateString()}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Tag className="h-5 w-5" />
                <span>Order Tags</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {(order.tags || []).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{tag}</span>
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <XCircle className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button onClick={addTag} disabled={!newTag.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Order Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Order Source</label>
                <p className="text-sm capitalize">{order.source}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <p className="text-sm">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <p className="text-sm">{new Date(order.updatedAt).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}