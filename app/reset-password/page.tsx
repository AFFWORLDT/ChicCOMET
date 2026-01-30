"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Lock, Loader2, Eye, EyeOff, CheckCircle } from "lucide-react"
import { toast } from "sonner"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [otp, setOtp] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get email and OTP from URL params first
    let email = searchParams.get("email")
    let otpCode = searchParams.get("otp")
    
    // If not in URL, try sessionStorage (backup from verify-otp page)
    if (!email || !otpCode) {
      const storedEmail = sessionStorage.getItem('resetEmail')
      const storedOTP = sessionStorage.getItem('resetOTP')
      
      if (storedEmail && storedOTP) {
        email = storedEmail
        otpCode = storedOTP
        console.log(`📧 Using OTP from sessionStorage`)
      }
    }
    
    if (!email || !otpCode) {
      toast.error("Missing email or OTP. Please start the password reset process again.")
      router.push("/forgot-password")
      return
    }
    
    // Decode URL-encoded values
    const decodedEmail = decodeURIComponent(email)
    const decodedOTP = decodeURIComponent(otpCode)
    
    console.log(`📧 Reset password page - Email: ${decodedEmail}, OTP: ${decodedOTP} (length: ${decodedOTP.length})`)
    
    setUserEmail(decodedEmail)
    setOtp(decodedOTP)
  }, [searchParams, router])

  const validatePassword = (password: string) => {
    const minLength = password.length >= 6
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    
    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers
    }
  }

  const passwordValidation = validatePassword(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!password.trim()) {
      toast.error("Please enter a new password")
      return
    }

    if (!passwordValidation.isValid) {
      toast.error("Password must be at least 6 characters with uppercase, lowercase, and numbers")
      return
    }

    setIsLoading(true)
    
    try {
      console.log(`🔄 Sending reset password request - Email: ${userEmail}, OTP: ${otp}`)
      
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: userEmail.trim(),
          otp: String(otp).trim(),
          newPassword: password 
        }),
      })

      // Read response body once
      const contentType = response.headers.get('content-type')
      let responseText = ''
      
      try {
        responseText = await response.text()
      } catch (readError) {
        console.error('Error reading response:', readError)
        toast.error("Error reading server response. Please try again.")
        return
      }

      // Check response status
      if (!response.ok) {
        console.error('Reset password API error (non-OK status):', {
          status: response.status,
          statusText: response.statusText,
          body: responseText.substring(0, 500)
        })
        
        let errorData: any = {}
        try {
          if (responseText.trim()) {
            errorData = JSON.parse(responseText)
          } else {
            errorData = { error: `HTTP ${response.status}: ${response.statusText}` }
          }
        } catch {
          errorData = { error: responseText || `HTTP ${response.status}: ${response.statusText}` }
        }
        
        const errorMessage = errorData.error || errorData.message || "Failed to reset password"
        toast.error(errorMessage)
        
        // If OTP is invalid/expired, redirect back to forgot-password
        if (errorMessage.includes('Invalid or expired OTP') || errorMessage.includes('invalid')) {
          setTimeout(() => {
            router.push("/forgot-password")
          }, 3000)
        }
        return
      }

      // Parse JSON response
      let data: any = {}
      
      try {
        if (responseText.trim()) {
          data = JSON.parse(responseText)
        } else {
          console.error('Empty response body')
          toast.error("Empty response from server. Please try again.")
          return
        }
      } catch (parseError: any) {
        console.error('Error parsing JSON response:', parseError)
        console.error('Response text:', responseText.substring(0, 500))
        toast.error("Invalid response format from server. Please try again.")
        return
      }

      // Validate data structure
      if (!data || typeof data !== 'object') {
        console.error('Invalid data structure:', data)
        toast.error("Invalid response format. Please try again.")
        return
      }

      if (data.success) {
        setIsSuccess(true)
        toast.success("Password reset successfully!")
        console.log(`✅ Password reset successful for ${userEmail}`)
        
        // Clear localStorage and sessionStorage
        localStorage.removeItem("resetEmail")
        sessionStorage.removeItem("resetEmail")
        sessionStorage.removeItem("resetOTP")
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        console.error('Reset password failed:', data)
        const errorMessage = data.error || data.message || "Failed to reset password"
        toast.error(errorMessage)
        
        // If OTP is invalid/expired, redirect back to forgot-password
        if (errorMessage.includes('Invalid or expired OTP') || errorMessage.includes('invalid')) {
          setTimeout(() => {
            router.push("/forgot-password")
          }, 3000)
        }
      }
    } catch (error: any) {
      console.error("Reset password error:", error)
      const errorMessage = error?.message || "An unexpected error occurred. Please try again."
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Password Reset Successfully!</CardTitle>
            <CardDescription>
              Your password has been updated. Redirecting to login...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => router.push("/login")}
              className="w-full"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>
            Enter your new password for <strong>{userEmail}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {/* Password Requirements */}
              {password && (
                <div className="space-y-1 text-xs">
                  <div className={`flex items-center space-x-2 ${passwordValidation.minLength ? 'text-green-600' : 'text-red-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${passwordValidation.minLength ? 'bg-green-600' : 'bg-red-600'}`} />
                    <span>At least 6 characters</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-red-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${passwordValidation.hasUpperCase ? 'bg-green-600' : 'bg-red-600'}`} />
                    <span>One uppercase letter</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-red-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${passwordValidation.hasLowerCase ? 'bg-green-600' : 'bg-red-600'}`} />
                    <span>One lowercase letter</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${passwordValidation.hasNumbers ? 'text-green-600' : 'text-red-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${passwordValidation.hasNumbers ? 'bg-green-600' : 'bg-red-600'}`} />
                    <span>One number</span>
                  </div>
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !passwordValidation.isValid}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Reset Password
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Button 
              variant="ghost" 
              onClick={() => router.push("/login")}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
