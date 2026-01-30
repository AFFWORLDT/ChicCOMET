"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Download, 
  ArrowLeft, 
  FileText, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  Package
} from "lucide-react"
import Link from "next/link"
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

export default function InvoicePage() {
  const params = useParams()
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
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

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Create a printable version
    const printWindow = window.open('', '_blank')
    if (printWindow && order) {
      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice - ${order.orderNumber}</title>
          <style>
            @page { margin: 0.5in; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 0; 
              padding: 20px; 
              color: #333;
              line-height: 1.6;
            }
            .header { 
              text-align: center; 
              margin-bottom: 40px; 
              border-bottom: 3px solid #f59e0b;
              padding-bottom: 20px;
            }
            .company-name { 
              font-size: 32px; 
              font-weight: bold; 
              color: #f59e0b; 
              margin-bottom: 5px;
            }
            .company-tagline {
              font-size: 14px;
              color: #666;
              margin-bottom: 10px;
            }
            .invoice-title { 
              font-size: 24px; 
              margin: 10px 0; 
              color: #1f2937;
            }
            .invoice-number {
              font-size: 18px;
              color: #6b7280;
            }
            .invoice-details { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 40px; 
              background: #f9fafb;
              padding: 20px;
              border-radius: 8px;
            }
            .section { 
              margin-bottom: 30px; 
            }
            .section h3 { 
              border-bottom: 2px solid #f59e0b; 
              padding-bottom: 8px; 
              color: #1f2937;
              font-size: 18px;
              margin-bottom: 15px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0; 
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            th, td { 
              border: 1px solid #e5e7eb; 
              padding: 12px; 
              text-align: left; 
            }
            th { 
              background-color: #f59e0b; 
              color: white; 
              font-weight: 600;
            }
            tr:nth-child(even) {
              background-color: #f9fafb;
            }
            .total { 
              font-weight: bold; 
              font-size: 18px; 
              background-color: #fef3c7 !important;
            }
            .footer { 
              margin-top: 40px; 
              text-align: center; 
              color: #6b7280;
              border-top: 2px solid #e5e7eb;
              padding-top: 20px;
            }
            .payment-info {
              background: #f0f9ff;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #0ea5e9;
            }
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
            }
            .status-paid { background: #dcfce7; color: #166534; }
            .status-pending { background: #fef3c7; color: #92400e; }
            .shipping-address {
              background: #f9fafb;
              padding: 15px;
              border-radius: 6px;
              border-left: 4px solid #10b981;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">Whitlin</div>
            <div class="company-tagline">Premium Hospitality Linen Since 1984</div>
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-number">Order #${order.orderNumber}</div>
          </div>
          
          <div class="invoice-details">
            <div>
              <strong style="color: #1f2937; font-size: 16px;">Bill To:</strong><br><br>
              <strong>${typeof order.user === 'object' && order.user !== null ? (order.user as any).name || 'Customer' : 'Customer'}</strong><br>
              ${typeof order.user === 'object' && order.user !== null ? (order.user as any).email || '' : ''}
            </div>
            <div>
              <strong style="color: #1f2937; font-size: 16px;">Invoice Details:</strong><br><br>
              <strong>Invoice Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}<br>
              <strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}<br>
              <strong>Due Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          ${order.shippingAddress ? `
          <div class="section">
            <h3>Shipping Address</h3>
            <div class="shipping-address">
              ${order.shippingAddress.name ? `<strong>${order.shippingAddress.name}</strong><br>` : ''}
              ${order.shippingAddress.address || ''}<br>
              ${[order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.zipCode].filter(Boolean).join(', ')}<br>
              ${order.shippingAddress.country || ''}<br>
              ${order.shippingAddress.phone ? `<strong>Phone:</strong> ${order.shippingAddress.phone}` : ''}
            </div>
          </div>
          ` : ''}
          
          <div class="section">
            <h3>Order Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map((item: any) => {
                  const itemName = item.name || (item.product && typeof item.product === 'object' ? item.product.name : 'Product') || 'Product'
                  const itemPrice = item.price || 0
                  const itemQuantity = item.quantity || 0
                  const itemTotal = item.total || (itemPrice * itemQuantity)
                  return `
                  <tr>
                    <td><strong>${itemName}</strong></td>
                    <td>AED ${itemPrice.toFixed(2)}</td>
                    <td style="text-align: center;">${itemQuantity}</td>
                    <td style="text-align: right;">AED ${itemTotal.toFixed(2)}</td>
                  </tr>
                `
                }).join('')}
              </tbody>
              <tfoot>
                <tr class="total">
                  <td colspan="3" style="text-align: right;"><strong>Total Amount:</strong></td>
                  <td style="text-align: right;">AED ${order.totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div class="section">
            <h3>Payment Information</h3>
            <div class="payment-info">
              <p><strong>Payment Method:</strong> ${order.paymentMethod.replace('_', ' ').toUpperCase()}</p>
              <p><strong>Payment Status:</strong> 
                <span class="status-badge ${order.paymentStatus === 'paid' ? 'status-paid' : 'status-pending'}">
                  ${order.paymentStatus.toUpperCase()}
                </span>
              </p>
              <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
              <p><strong>Order Status:</strong> 
                <span class="status-badge ${order.status === 'delivered' ? 'status-paid' : 'status-pending'}">
                  ${order.status.toUpperCase()}
                </span>
              </p>
            </div>
          </div>
          
          ${order.notes ? `
          <div class="section">
            <h3>Order Notes</h3>
            <div style="background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #6b7280;">
              ${order.notes}
            </div>
          </div>
          ` : ''}
          
          <div class="footer">
            <p style="font-size: 16px; margin-bottom: 10px;"><strong>Thank you for your business!</strong></p>
            <p>Whitlin - Premium Hospitality Linen Since 1984</p>
            <p style="font-size: 12px; margin-top: 15px;">
              For any queries, please contact us at support@whitlin.com
            </p>
          </div>
        </body>
        </html>
      `
      printWindow.document.write(invoiceHTML)
      printWindow.document.close()
      printWindow.print()
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
              <p className="text-gray-600">Loading invoice...</p>
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
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Invoice Not Found</h1>
              <p className="text-gray-600 mb-8">
                {error || "The invoice you're looking for doesn't exist."}
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
                <h1 className="text-3xl font-bold text-gray-900">Invoice</h1>
                <p className="text-gray-600">Order #{order.orderNumber}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handlePrint} variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button onClick={handleDownload} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>

          {/* Invoice Content */}
          <div className="bg-white rounded-lg shadow-lg p-8 print:shadow-none print:p-4">
            {/* Invoice Header */}
            <div className="text-center mb-8 border-b pb-8">
              <h1 className="text-4xl font-bold text-yellow-600 mb-2">Whitlin</h1>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">INVOICE</h2>
              <p className="text-gray-600">Premium Hospitality Linen Since 1984</p>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-lg mb-4 text-gray-900">Bill To:</h3>
                <div className="space-y-1">
                  <p className="font-medium">
                    {typeof order.user === 'object' && order.user !== null 
                      ? (order.user as any).name || user?.name || 'Customer'
                      : user?.name || 'Customer'}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {typeof order.user === 'object' && order.user !== null 
                      ? (order.user as any).email || user?.email || ''
                      : user?.email || ''}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4 text-gray-900">Invoice Details:</h3>
                <div className="space-y-1">
                  <p className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="font-medium">Invoice Date:</span>
                    <span className="ml-2">{formatDate(order.createdAt)}</span>
                  </p>
                  <p className="flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    <span className="font-medium">Order Number:</span>
                    <span className="ml-2">{order.orderNumber}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4 text-gray-900 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Shipping Address:
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                {order.shippingAddress?.name && (
                  <p className="font-medium">{order.shippingAddress.name}</p>
                )}
                {order.shippingAddress?.address && (
                  <p className="text-gray-600">{order.shippingAddress.address}</p>
                )}
                {(order.shippingAddress?.city || order.shippingAddress?.state || order.shippingAddress?.zipCode) && (
                  <p className="text-gray-600">
                    {[order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.zipCode].filter(Boolean).join(', ')}
                  </p>
                )}
                {order.shippingAddress?.country && (
                  <p className="text-gray-600">{order.shippingAddress.country}</p>
                )}
                {order.shippingAddress?.phone && (
                  <p className="text-gray-600 flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {order.shippingAddress.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4 text-gray-900">Order Items:</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-yellow-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Item</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Price</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Qty</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item: any, index: number) => {
                      const itemName = item.name || (item.product && typeof item.product === 'object' ? item.product.name : 'Product') || 'Product'
                      const itemImage = item.image || (item.product && typeof item.product === 'object' ? item.product.image : '/placeholder.svg') || '/placeholder.svg'
                      const itemPrice = item.price || 0
                      const itemQuantity = item.quantity || 0
                      const itemTotal = item.total || (itemPrice * itemQuantity)
                      
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">
                            <div className="flex items-center space-x-3">
                              <div className="relative w-12 h-12 flex-shrink-0">
                                <Image
                                  src={itemImage}
                                  alt={itemName}
                                  fill
                                  className="object-cover rounded"
                                />
                              </div>
                              <span className="font-medium">{itemName}</span>
                            </div>
                          </td>
                          <td className="border border-gray-300 px-4 py-2">AED {itemPrice.toFixed(2)}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">{itemQuantity}</td>
                          <td className="border border-gray-300 px-4 py-2 text-right font-medium">
                            AED {itemTotal.toFixed(2)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-yellow-50 font-bold">
                      <td colSpan={3} className="border border-gray-300 px-4 py-2 text-right">
                        Total Amount:
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right text-lg">
                        AED {order.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Payment Information */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4 text-gray-900">Payment Information:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><span className="font-medium">Payment Method:</span> {order.paymentMethod.replace('_', ' ').toUpperCase()}</p>
                  <p><span className="font-medium">Payment Status:</span> 
                    <Badge className={`ml-2 ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {order.paymentStatus.toUpperCase()}
                    </Badge>
                  </p>
                </div>
                <div>
                  <p><span className="font-medium">Tracking Number:</span> {order.trackingNumber}</p>
                  <p><span className="font-medium">Order Status:</span> 
                    <Badge className={`ml-2 ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {order.status.toUpperCase()}
                    </Badge>
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">Order Notes:</h3>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{order.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="text-center pt-8 border-t">
              <p className="text-gray-600 mb-2">Thank you for your business!</p>
              <p className="text-sm text-gray-500">
                Whitlin - Premium Hospitality Linen Since 1984
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}