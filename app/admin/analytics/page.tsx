"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Eye,
  Star,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
import { normalizeAnalyticsData } from "@/lib/admin-utils"
import { fetchWithRetry } from "@/lib/admin-fetch-utils"

interface AnalyticsData {
  overview: {
    totalRevenue: number
    totalOrders: number
    totalUsers: number
    conversionRate: number
    avgOrderValue: number
  }
  salesData: Array<{
    month: string
    revenue: number
    orders: number
  }>
  topProducts: Array<{
    name: string
    sales: number
    revenue: number
    rating: number
  }>
  recentOrders: Array<{
    id: string
    customer: string
    total: number
    status: string
    createdAt: string
  }>
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      setError(null)
      
      const result = await fetchWithRetry(`/api/analytics?t=${Date.now()}`)
      
      if (result.success && result.data) {
        try {
          // result.data is the full API response { success: true, data: analyticsData }
          const analyticsData = result.data.data || result.data
          const normalizedData = normalizeAnalyticsData(analyticsData)
          setAnalyticsData(normalizedData)
          setError(null)
        } catch (err) {
          console.error('Error processing analytics:', err)
          const defaultData = normalizeAnalyticsData(null)
          setAnalyticsData(defaultData)
          setError('Error processing analytics data')
        }
      } else {
        // Set default empty data on error
        const defaultData = normalizeAnalyticsData(null)
        setAnalyticsData(defaultData)
        setError(result.error || 'Failed to fetch analytics data')
      }
      
      setLoading(false)
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  // Always show analytics with default data if needed
  const displayData = analyticsData || normalizeAnalyticsData(null)
  
  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">{error}</p>
        </div>
      )}
      
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track your store's performance and insights</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {displayData.overview.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              Total revenue from all orders
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayData.overview.totalOrders}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              Total number of orders
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayData.overview.totalUsers}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              Registered customers
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayData.overview.conversionRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              Orders per user ratio
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Monthly revenue and orders trend</CardDescription>
          </CardHeader>
          <CardContent>
            {displayData.salesData && displayData.salesData.length > 0 ? (
              <div className="space-y-4">
                {displayData.salesData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="text-sm font-medium">{data.month}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">AED {data.revenue.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{data.orders} orders</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No sales data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best performing products</CardDescription>
          </CardHeader>
          <CardContent>
            {displayData.topProducts && displayData.topProducts.length > 0 ? (
              <div className="space-y-4">
                {displayData.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground text-sm font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{product.name}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                          <span>{product.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{product.sales} sales</div>
                      <div className="text-xs text-muted-foreground">AED {product.revenue}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No product sales data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders from customers</CardDescription>
        </CardHeader>
        <CardContent>
          {displayData.recentOrders && displayData.recentOrders.length > 0 ? (
            <div className="space-y-4">
              {displayData.recentOrders.map((order, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="flex-1">
                    <p className="text-sm">Order {order.id} from {order.customer}</p>
                    <p className="text-xs text-muted-foreground">
                      AED {order.total} • {order.status} • {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No recent orders available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">AED {displayData.overview.avgOrderValue}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Average value per order
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Orders per User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{displayData.overview.totalUsers > 0 ? Math.round(displayData.overview.totalOrders / displayData.overview.totalUsers * 100) / 100 : 0}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Orders per customer ratio
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
