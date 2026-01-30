"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  role?: 'customer' | 'admin' | 'user'
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Helper function to set cookie with proper encoding
  const setAuthCookie = (userData: User) => {
    if (typeof window !== 'undefined') {
      const userDataString = JSON.stringify(userData)
      // URL encode the JSON string to handle special characters
      const encodedValue = encodeURIComponent(userDataString)
      const isProduction = window.location.hostname !== 'localhost'
      // Set cookie with 7 days expiration (604800 seconds)
      const cookieString = `chiccomet_user=${encodedValue}; path=/; max-age=604800; SameSite=Lax${isProduction ? '; Secure' : ''}`
      document.cookie = cookieString
    }
  }

  // Helper function to get cookie value
  const getCookie = (name: string): string | null => {
    if (typeof window === 'undefined') return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null
    }
    return null
  }

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      if (typeof window !== 'undefined') {
        setIsLoading(true)
        try {
          // First check localStorage
          const savedUser = localStorage.getItem("chiccomet_user")
          if (savedUser) {
            try {
              const userData = JSON.parse(savedUser)
              setUser(userData)
              // Ensure cookie is set for middleware
              setAuthCookie(userData)
              setIsLoading(false)
              return
            } catch (error) {
              console.error('Error parsing user data from localStorage:', error)
              localStorage.removeItem("chiccomet_user")
            }
          }

          // Also check cookie (in case localStorage was cleared but cookie exists)
          const cookieValue = getCookie('chiccomet_user')
          if (cookieValue) {
            try {
              const decodedValue = decodeURIComponent(cookieValue)
              const userData = JSON.parse(decodedValue)
              setUser(userData)
              // Sync to localStorage
              localStorage.setItem("chiccomet_user", JSON.stringify(userData))
              setIsLoading(false)
              return
            } catch (error) {
              console.error('Error parsing user data from cookie:', error)
              // Clear invalid cookie
              document.cookie = "chiccomet_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
            }
          }

          setIsLoading(false)
        } catch (error) {
          console.error('Error checking auth:', error)
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important: include cookies in request
      })

      const data = await response.json()

      if (data.success) {
        const userData = {
          id: data.data._id,
          name: data.data.name,
          email: data.data.email,
          role: data.data.role
        }
        setUser(userData)
        if (typeof window !== 'undefined') {
          // Store in localStorage
          localStorage.setItem("chiccomet_user", JSON.stringify(userData))
          // Set cookie for middleware (server should also set it, but ensure it's set client-side too)
          setAuthCookie(userData)
        }
        setIsLoading(false)
        return true
      } else {
        setIsLoading(false)
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
      return false
    }
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (data.success) {
        const userData = {
          id: data.data._id,
          name: data.data.name,
          email: data.data.email,
          role: data.data.role
        }
        setUser(userData)
        if (typeof window !== 'undefined') {
          localStorage.setItem("chiccomet_user", JSON.stringify(userData))
        }
        setIsLoading(false)
        return true
      } else {
        setIsLoading(false)
        return false
      }
    } catch (error) {
      console.error('Signup error:', error)
      setIsLoading(false)
      return false
    }
  }

  // Initialize with admin user for testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const users = JSON.parse(localStorage.getItem("chiccomet_users") || "[]")
      const adminExists = users.find((u: any) => u.email === "admin@chiccomet.com")

      if (!adminExists) {
        const adminUser = {
          id: "admin-001",
          email: "admin@chiccomet.com",
          password: "Rahul6375@@@",
          name: "Admin User",
        }
        users.push(adminUser)
        localStorage.setItem("chiccomet_users", JSON.stringify(users))
      }
    }
  }, [])

  const logout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem("chiccomet_user")
      // Clear cookie - set multiple variations to ensure it's cleared
      document.cookie = "chiccomet_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      document.cookie = "chiccomet_user=; path=/; max-age=0"
    }
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
