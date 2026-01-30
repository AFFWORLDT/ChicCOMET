"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Menu,
  X,
  LogOut,
  User,
  Tags,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useI18n } from "@/components/language-provider"
import { LanguageSwitcher } from "@/components/language-switcher"

const adminNavItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/categories", icon: Tags, label: "Collections" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/users", icon: Users, label: "Users" },
  // Hidden menu items: Newsletter, Analytics, Settings
  // { href: "/admin/newsletter", icon: Mail, label: "Newsletter" },
  // { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  // { href: "/admin/settings", icon: Settings, label: "Settings" },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user, logout, isLoading: authLoading } = useAuth()
  const router = useRouter()

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('adminSidebarCollapsed')
    if (savedState !== null) {
      setSidebarCollapsed(JSON.parse(savedState))
    }
  }, [])

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('adminSidebarCollapsed', JSON.stringify(sidebarCollapsed))
  }, [sidebarCollapsed])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  useEffect(() => {
    if (!authLoading) {
      setIsLoading(false)
      // If user is not logged in or not admin, redirect to login
      if (!user || user.role !== "admin") {
        router.push("/login?redirect=/admin")
      }
    }
  }, [user, authLoading, router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Show loading while checking authentication
  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Check if user is admin
  const isAdmin = user?.role === "admin"

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have permission to access this page.</p>
          <div className="space-y-2">
            <Button onClick={() => router.push("/login")} className="w-full">
              Login
            </Button>
            <Button variant="outline" onClick={() => router.push("/")} className="w-full">
              Go Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-card border-r border-border transform transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'w-16 lg:w-16' : 'w-64'
      } ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`} style={{ marginLeft: 0, paddingLeft: 0 }}>
        <div className="flex flex-col h-full">
          {/* Logo and Toggle */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!sidebarCollapsed && (
              <Logo size="md" href="/admin" />
            )}
            {sidebarCollapsed && (
              <div className="w-full flex justify-center">
                <Logo size="sm" href="/admin" />
              </div>
            )}
            <div className="flex items-center gap-2">
              {/* Collapse/Expand Button - Desktop */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex h-8 w-8"
                onClick={toggleSidebar}
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
              {/* Close Button - Mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-8 w-8"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2 flex flex-col">
              {adminNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block w-full flex items-center rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors ${
                    sidebarCollapsed 
                      ? 'justify-center px-2 py-3' 
                      : 'space-x-3 px-3 py-2'
                  }`}
                  onClick={() => {
                    setSidebarOpen(false)
                  }}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </Link>
              ))}
            </div>
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-border">
            {!sidebarCollapsed ? (
              <>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-full"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
      }`}>
        {/* Top bar */}
        <header className="bg-card border-b border-border py-3 sticky top-0 z-30">
          <div className="flex items-center justify-between px-3 sm:px-4 md:px-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex"
                onClick={toggleSidebar}
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-base sm:text-lg font-semibold">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/" target="_blank">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  View Site
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="px-3 sm:px-4 md:px-6 py-4 sm:py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
