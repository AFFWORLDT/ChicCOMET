"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Package,
  Clock,
  CheckCircle,
  Truck,
  AlertTriangle,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  Filter,
  Download
} from "lucide-react"
import { 
  ORDER_STATUSES, 
  STATUS_CONFIG, 
  calculateOrderMetrics,
  getOrderNotifications 
} from "@/lib/order-management"

interface Order {
  _id: string
  orderNumber: string
  user: {
    name: string
    email: string
  }
  totalAmount: number
  status: string
  priority: string
  source: string
  paymentStatus: string
  createdAt: string
  updatedAt: string
}

interface OrderMetrics {
  total: number
  byStatus: Record<string, number>
  byPriority: Record<string, number>
  bySource: Record<string, number>
  totalRevenue: number
  averageOrderValue: number
  conversionRate: number
}

export default function OrderDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [metrics, setMetrics] = useState<OrderMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    fetchOrders()
  }, [timeRange])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/orders')
      const data = await response.json()
      
      if (data.success) {
        setOrders(data.data.orders || [])
        setMetrics(calculateOrderMetrics(data.data.orders || []))
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusCount = (status: string) => {
    return metrics?.byStatus[status] || 0
  }

  const getStatusPercentage = (status: string) => {
    if (!metrics || metrics.total === 0) return 0
    return Math.round((getStatusCount(status) / metrics.total) * 100)
  }

  const getRecentOrders = () => {
    return orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  }

  const getUrgentOrders = () => {
    return orders.filter(order => 
      order.priority === 'urgent' || order.priority === 'high'
    ).slice(0, 5)
  }

  const getOverdueOrders = () => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    return orders.filter(order => 
      order.status === ORDER_STATUSES.PENDING && 
      new Date(order.createdAt) < oneDayAgo
    ).slice(0, 5)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading order dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive order management overview</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {metrics?.totalRevenue.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {metrics?.averageOrderValue.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.conversionRate.toFixed(1) || '0.0'}%</div>
            <p className="text-xs text-muted-foreground">
              +2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Order Status Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.values(ORDER_STATUSES).map(status => {
                const config = STATUS_CONFIG[status]
                const count = getStatusCount(status)
                const percentage = getStatusPercentage(status)
                
                return (
                  <div key={status} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={config.color}>
                          {config.label}
                        </Badge>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Order Priority Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(metrics?.byPriority || {}).map(([priority, count]) => {
                const percentage = metrics ? Math.round((count / metrics.total) * 100) : 0
                const config = {
                  low: { label: 'Low', color: 'bg-gray-100 text-gray-800' },
                  normal: { label: 'Normal', color: 'bg-blue-100 text-blue-800' },
                  high: { label: 'High', color: 'bg-orange-100 text-orange-800' },
                  urgent: { label: 'Urgent', color: 'bg-red-100 text-red-800' }
                }[priority] || { label: priority, color: 'bg-gray-100 text-gray-800' }
                
                return (
                  <div key={priority} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={config.color}>
                          {config.label}
                        </Badge>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recent Orders</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getRecentOrders().map((order) => {
                const config = STATUS_CONFIG[order.status]
                return (
                  <div key={order._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">#{order.orderNumber}</span>
                        <Badge className={config.color}>
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">AED {order.totalAmount.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground capitalize">{order.priority}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Alerts & Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Urgent Orders */}
              {getUrgentOrders().length > 0 && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">
                      {getUrgentOrders().length} High Priority Orders
                    </span>
                  </div>
                  <p className="text-xs text-orange-600 mt-1">
                    Requires immediate attention
                  </p>
                </div>
              )}

              {/* Overdue Orders */}
              {getOverdueOrders().length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      {getOverdueOrders().length} Overdue Orders
                    </span>
                  </div>
                  <p className="text-xs text-red-600 mt-1">
                    Pending for more than 24 hours
                  </p>
                </div>
              )}

              {/* Failed Payments */}
              {orders.filter(o => o.paymentStatus === 'failed').length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      {orders.filter(o => o.paymentStatus === 'failed').length} Failed Payments
                    </span>
                  </div>
                  <p className="text-xs text-red-600 mt-1">
                    Requires customer contact
                  </p>
                </div>
              )}

              {/* No Alerts */}
              {getUrgentOrders().length === 0 && 
               getOverdueOrders().length === 0 && 
               orders.filter(o => o.paymentStatus === 'failed').length === 0 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      All Good!
                    </span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    No urgent issues to address
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Source Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Order Source Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(metrics?.bySource || {}).map(([source, count]) => {
              const percentage = metrics ? Math.round((count / metrics.total) * 100) : 0
              const sourceConfig = {
                website: { label: 'Website', icon: '🌐' },
                mobile: { label: 'Mobile App', icon: '📱' },
                admin: { label: 'Admin Panel', icon: '⚙️' },
                api: { label: 'API', icon: '🔌' }
              }[source] || { label: source, icon: '📊' }
              
              return (
                <div key={source} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl mb-2">{sourceConfig.icon}</div>
                  <div className="text-lg font-bold">{count}</div>
                  <div className="text-sm text-muted-foreground">{sourceConfig.label}</div>
                  <div className="text-xs text-muted-foreground">{percentage}%</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
