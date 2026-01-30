"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  DollarSign,
  Eye,
  Star,
  Loader2,
  Plus,
  BarChart3
} from "lucide-react"
import { normalizeDashboardData } from "@/lib/admin-utils"
import { fetchWithRetry } from "@/lib/admin-fetch-utils"
import { toast } from "sonner"

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  productGrowth: number
  orderGrowth: number
  userGrowth: number
  revenueGrowth: number
}

interface RecentOrder {
  id: string
  customer: string
  amount: number
  status: string
  date: string
}

interface TopProduct {
  name: string
  sales: number
  revenue: number
  rating: number
}

interface DashboardData {
  stats: DashboardStats
  recentOrders: RecentOrder[]
  topProducts: TopProduct[]
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed": return "bg-green-100 text-green-800"
    case "pending": return "bg-yellow-100 text-yellow-800"
    case "shipped": return "bg-blue-100 text-blue-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)
    
    const result = await fetchWithRetry(`/api/admin/dashboard?t=${Date.now()}`)
    
    if (result.success && result.data) {
      try {
        // result.data is the full API response { success: true, data: dashboardData }
        const dashboardData = result.data.data || result.data
        const normalizedData = normalizeDashboardData(dashboardData)
        setDashboardData(normalizedData)
        setError(null)
      } catch (err) {
        console.error('Error processing dashboard data:', err)
        const defaultData = normalizeDashboardData(null)
        setDashboardData(defaultData)
        setError('Error processing dashboard data')
      }
    } else {
      // Set default empty data on error so dashboard still renders
      const defaultData = normalizeDashboardData(null)
      setDashboardData(defaultData)
      setError(result.error || 'Failed to fetch dashboard data')
    }
    
    setLoading(false)
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const formatGrowth = (growth: number) => {
    const sign = growth >= 0 ? '+' : ''
    return `${sign}${growth}%`
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  // Always show dashboard with default data if needed, even on error
  // Don't block the entire dashboard on error
  const displayData = dashboardData || normalizeDashboardData(null)

  return (
    <div className="space-y-4 sm:space-y-6">
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
          <p className="text-yellow-800 text-sm">{error}</p>
          <Button 
            onClick={() => fetchDashboardData()} 
            variant="outline" 
            size="sm"
            className="ml-4"
          >
            Retry
          </Button>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={async () => {
              try {
                const response = await fetch('/api/admin/clear-cache', { method: 'POST' })
                if (response.ok) {
                  toast.success('Cache cleared successfully')
                  fetchDashboardData()
                } else {
                  toast.error('Failed to clear cache')
                }
              } catch (err) {
                toast.error('Error clearing cache')
              }
            }} 
            variant="outline" 
            size="sm"
            className="w-full sm:w-auto"
          >
            Clear Cache
          </Button>
          <Button onClick={fetchDashboardData} variant="outline" size="sm" className="w-full sm:w-auto">
            <TrendingUp className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayData.stats.totalProducts}</div>
            <p className={`text-xs ${getGrowthColor(displayData.stats.productGrowth)}`}>
              {formatGrowth(displayData.stats.productGrowth)} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayData.stats.totalOrders}</div>
            <p className={`text-xs ${getGrowthColor(displayData.stats.orderGrowth)}`}>
              {formatGrowth(displayData.stats.orderGrowth)} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayData.stats.totalUsers}</div>
            <p className={`text-xs ${getGrowthColor(displayData.stats.userGrowth)}`}>
              {formatGrowth(displayData.stats.userGrowth)} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {displayData.stats.totalRevenue.toLocaleString()}</div>
            <p className={`text-xs ${getGrowthColor(displayData.stats.revenueGrowth)}`}>
              {formatGrowth(displayData.stats.revenueGrowth)} from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from your customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayData.recentOrders && displayData.recentOrders.length > 0 ? (
                displayData.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.date}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-medium">AED {order.amount.toFixed(2)}</p>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No orders yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayData.topProducts && displayData.topProducts.length > 0 ? (
                displayData.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium truncate max-w-[200px]">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">AED {product.revenue.toFixed(2)}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        <span>{product.rating}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No sales data yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card 
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => router.push('/admin/products/add')}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Package className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-medium">Add Product</h3>
                    <p className="text-sm text-muted-foreground">Create a new product</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => router.push('/admin/products/bulk-import')}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Plus className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-medium">Bulk Import</h3>
                    <p className="text-sm text-muted-foreground">Import multiple products</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => router.push('/admin/users')}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-medium">Manage Users</h3>
                    <p className="text-sm text-muted-foreground">User management</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
