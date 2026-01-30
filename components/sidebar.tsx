"use client"

import { useState, memo, useCallback, useEffect } from "react"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Home,
  Package,
  Crown,
  Users,
  Info,
  Mail,
  Heart,
  Settings,
  BarChart3,
  ShoppingCart
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { LanguageSwitcher } from "@/components/language-switcher"
import { useI18n } from "@/components/language-provider"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export const Sidebar = memo(function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { state } = useCart()
  const { user, logout } = useAuth()
  const { t } = useI18n()
  const pathname = usePathname()

  const handleLogout = useCallback(() => {
    logout()
  }, [logout])

  // Auto-close sidebar on route change for mobile/tablet
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      if (isOpen) onToggle()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const handleNavSelect = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      onToggle()
    }
  }

  const navigationItems = [
    { href: "/", label: t('nav.home', 'Home'), icon: Home },
    { href: "/products", label: t('nav.products', 'Products'), icon: Package },
    { href: "/showcase", label: t('nav.premium', 'Premium Collections'), icon: Crown },
    { href: "/collections", label: t('nav.collections', 'Collections'), icon: Package },
    { href: "/about", label: t('nav.about', 'About'), icon: Info },
    { href: "/contact", label: t('nav.contact', 'Contact'), icon: Mail },
  ]

  const userItems = user ? [
    { href: "/account", label: "My Account", icon: User },
    { href: "/orders", label: "Order History", icon: ShoppingCart },
    { href: "/wishlist", label: "Wishlist", icon: Heart },
    ...(user?.role === "admin" ? [{ href: "/admin", label: "Admin Panel", icon: BarChart3 }] : []),
  ] : [
    { href: "/login", label: "Sign In", icon: User },
    { href: "/signup", label: "Sign Up", icon: User },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 transition-all duration-300 ease-in-out",
        "lg:translate-x-0 lg:static lg:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "w-80 lg:w-72"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <Logo size="md" href="/" className="text-white" />
            
            {/* Mobile Close Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-700"
              onClick={onToggle}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6">
            <div className="px-6">
              {/* Main Navigation */}
              <div className="mb-8">
                <h3 className="block w-full text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 whitespace-normal break-words">image.png
                  Navigation
                </h3>
                <div className="space-y-1 flex flex-col">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleNavSelect}
                      className="block w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 group"
                    >
                      <Icon className="h-5 w-5 group-hover:text-white flex-shrink-0" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}
                </div>
              </div>

              {/* User Section */}
              <div className="mb-8">
                <h3 className="block w-full text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 whitespace-normal break-words">
                  Account
                </h3>
                <div className="space-y-1 flex flex-col">
                {userItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleNavSelect}
                      className="block w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 group"
                    >
                      <Icon className="h-5 w-5 group-hover:text-white flex-shrink-0" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}
                
                {user && (
                  <button 
                    onClick={handleLogout}
                    className="block w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all duration-200 group text-left cursor-pointer"
                  >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                )}
                </div>
              </div>
            </div>
          </nav>

          {/* Footer Actions */}
          <div className="p-6 border-t border-slate-700 space-y-4">
            {/* Language Switcher - temporarily hidden */}
            {/* <div className="flex justify-start">
              <LanguageSwitcher />
            </div> */}

            {/* Search */}
            <Button 
              variant="ghost" 
              className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50"
            >
              <Search className="h-5 w-5 mr-3" />
              Search Products
            </Button>

            {/* Cart */}
            <Link href="/cart" onClick={handleNavSelect}>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50 relative"
              >
                <ShoppingBag className="h-5 w-5 mr-3" />
                <span>Cart</span>
                {state.itemCount > 0 && (
                  <Badge className="ml-auto h-6 w-6 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-yellow-500 to-yellow-600 text-black">
                    {state.itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Info */}
            {user && (
              <div className="pt-4 border-t border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-black" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
})

