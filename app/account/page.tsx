"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Mail, 
  Package, 
  Settings, 
  Heart,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  ShoppingBag,
  Star,
  Calendar,
  Loader2,
  Eye,
  Plus
} from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { ScrollAnimate } from "@/components/scroll-animate"

interface UserAccountData {
  profile: {
    name: string
    email: string
    phone: string
    joinDate: string
    totalOrders: number
    totalSpent: number
  }
  recentOrders: Array<{
    id: string
    date: string
    total: number
    status: string
    items: number
  }>
  wishlist: Array<{
    id: number
    name: string
    price: number
    image: string
  }>
  addresses: Array<{
    id: number
    type: string
    address: string
    isDefault: boolean
  }>
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed": return "bg-green-100 text-green-800"
    case "shipped": return "bg-blue-100 text-blue-800"
    case "pending": return "bg-yellow-100 text-yellow-800"
    default: return "bg-[#fafafa] text-[#1a1a1a]"
  }
}

export default function AccountPage() {
  const { user, logout, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [userData, setUserData] = useState<UserAccountData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push("/login")
      return
    }

    const fetchUserData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/user/account?userId=${user.id}`)
        const data = await response.json()
        
        if (data.success) {
          setUserData(data.data)
        } else {
          setError(data.error || 'Failed to fetch account data')
          toast.error(data.error || 'Failed to fetch account data')
        }
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError('An unexpected error occurred while fetching account data')
        toast.error('An unexpected error occurred while fetching account data')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user, router])

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading account data...</p>
        </div>
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || 'Failed to load account data'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#e1d7c6] text-[#1a1a1a] rounded-md hover:bg-[#d4c7b3] font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "settings", label: "Settings", icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-background page-fade">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <ScrollAnimate animation="fade-in-up-scale" delay={100}>
            <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Account</h1>
            <p className="text-muted-foreground">Manage your Whitlin account and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-0">
                  <div className="p-6 border-b">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[#e1d7c6] rounded-full flex items-center justify-center">
                        <span className="text-[#1a1a1a] text-lg font-bold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <nav className="p-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === tab.id 
                            ? "bg-[#e1d7c6] text-[#1a1a1a]" 
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <tab.icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{userData.profile.totalOrders}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">AED {userData.profile.totalSpent.toFixed(2)}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{userData.profile.joinDate}</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Orders */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Orders</CardTitle>
                      <CardDescription>Your latest purchases</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userData.recentOrders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <Link href={`/orders/${order.id}`} className="font-medium text-primary hover:underline">
                                {order.id}
                              </Link>
                              <div className="text-sm text-muted-foreground">{order.date} • {order.items} items</div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="font-medium">AED {order.total.toFixed(2)}</div>
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status}
                                </Badge>
                              </div>
                              <Link href={`/orders/${order.id}`}>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        View All Orders
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "orders" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>All your past and current orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userData.recentOrders.length > 0 ? (
                        <>
                          {userData.recentOrders.slice(0, 3).map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center space-x-4 flex-1">
                                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                  <Package className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div>
                                  <Link href={`/orders/${order.id}`} className="font-medium text-[#e1d7c6] hover:underline">
                                    {order.id}
                                  </Link>
                                  <div className="text-sm text-muted-foreground">{order.date} • {order.items} items</div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <div className="font-medium">AED {order.total.toFixed(2)}</div>
                                  <Badge className={getStatusColor(order.status)}>
                                    {order.status}
                                  </Badge>
                                </div>
                                <Link href={`/orders/${order.id}`}>
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4 mr-1" />
                                    View Details
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          ))}
                          <div className="text-center pt-4">
                            <Link href="/orders">
                              <Button variant="outline">
                                <Package className="h-4 w-4 mr-2" />
                                View All Orders
                              </Button>
                            </Link>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                          <p className="text-muted-foreground mb-4">
                            You haven't placed any orders yet
                          </p>
                          <Link href="/">
                            <Button>
                              <Package className="h-4 w-4 mr-2" />
                              Start Shopping
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "wishlist" && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Wishlist</CardTitle>
                      <CardDescription>Products you've saved for later</CardDescription>
                    </div>
                    <Link href="/wishlist">
                      <Button variant="outline" size="sm">
                        Go to Wishlist
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    {userData.wishlist.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {userData.wishlist.slice(0, 6).map((item) => (
                          <div key={item.id} className="group relative border rounded-lg overflow-hidden bg-accent/5">
                            <div className="aspect-square relative overflow-hidden">
                              <Image 
                                src={item.image || '/placeholder-product.png'} 
                                alt={item.name}
                                fill
                                className="object-cover transition-transform group-hover:scale-110"
                              />
                            </div>
                            <div className="p-3">
                              <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                              <p className="text-sm text-primary font-bold mt-1">AED {item.price.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
                        <p className="text-muted-foreground mb-4">
                          Explore our products and save your favorites
                        </p>
                        <Link href="/">
                          <Button>
                            Start Exploring
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === "addresses" && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Saved Addresses</CardTitle>
                      <CardDescription>Manage your shipping addresses</CardDescription>
                    </div>
                    <Link href="/addresses">
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    {userData.addresses.length > 0 ? (
                      <div className="space-y-4">
                        {userData.addresses.map((address) => (
                          <div key={address.id} className="flex items-start justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium capitalize">{address.type}</span>
                                {address.isDefault && (
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none text-[10px]">
                                    Default
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {address.address}
                              </p>
                            </div>
                            <MapPin className="h-5 w-5 text-muted-foreground ml-4" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No addresses saved</h3>
                        <p className="text-muted-foreground mb-4">
                          Add a shipping address for faster checkout
                        </p>
                        <Link href="/addresses">
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Address
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === "settings" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences and security</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Account Settings</h3>
                      <p className="text-muted-foreground mb-4">
                        Update your profile, change password, and manage preferences
                      </p>
                      <Link href="/settings">
                        <Button>
                          <Settings className="h-4 w-4 mr-2" />
                          Go to Settings
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          </ScrollAnimate>
        </div>
      </div>
    </div>
  )
}
