"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Shield, Loader2, Clock } from "lucide-react"
import { toast } from "sonner"

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const [isVerified, setIsVerified] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get email from URL params
    const email = searchParams.get("email")
    if (email) {
      setUserEmail(email)
      localStorage.setItem("resetEmail", email)
    } else {
      // If no email in URL, try localStorage
      const storedEmail = localStorage.getItem("resetEmail")
      if (storedEmail) {
        setUserEmail(storedEmail)
      } else {
        router.push("/forgot-password")
      }
    }
  }, [searchParams, router])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent multiple characters
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const newOtp = [...otp]
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }
    
    setOtp(newOtp)
    
    // Focus the next empty input or the last one
    const nextIndex = Math.min(pastedData.length, 5)
    inputRefs.current[nextIndex]?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const otpString = otp.join("").trim()
    if (otpString.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP")
      return
    }

    if (!userEmail || !userEmail.trim()) {
      toast.error("Email address is required")
      return
    }

    setIsLoading(true)
    
    try {
      console.log(`🔐 Verifying OTP for ${userEmail.trim()}`)
      console.log(`🔐 OTP being sent: "${otpString}" (length: ${otpString.length})`)
      
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: userEmail.trim(),
          otp: otpString 
        }),
      }).catch((fetchError) => {
        console.error('Fetch error:', fetchError)
        throw new Error(`Network error: ${fetchError.message}`)
      })

      // Read response body once
      let responseText = ''
      try {
        responseText = await response.text()
        console.log(`📥 Response status: ${response.status} ${response.statusText}`)
        console.log(`📥 Response body length: ${responseText.length}`)
        console.log(`📥 Response body preview: ${responseText.substring(0, 200)}`)
      } catch (readError) {
        console.error('Error reading response:', readError)
        toast.error("Error reading server response. Please try again.")
        setOtp(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
        return
      }

      // Check if response is OK first
      if (!response.ok) {
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
        
        const errorMessage = errorData.error || errorData.message || `Server error (${response.status})`
        
        // Don't log as error if it's a user-facing error (400, etc.)
        if (response.status >= 500) {
          console.error(`❌ API returned error status: ${response.status} ${response.statusText}`)
          console.error(`❌ Response body:`, responseText)
          console.error('Verify OTP API error:', errorData)
        } else {
          console.log(`ℹ️ API returned status: ${response.status} - ${errorMessage}`)
        }
        
        toast.error(errorMessage)
        setOtp(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
        return
      }

      // Parse JSON response for successful responses
      let data: any = {}
      
      try {
        if (responseText.trim()) {
          data = JSON.parse(responseText)
        } else {
          console.error('Empty response body from successful request')
          toast.error("Empty response from server. Please try again.")
          setOtp(["", "", "", "", "", ""])
          inputRefs.current[0]?.focus()
          return
        }
      } catch (parseError: any) {
        console.error('Error parsing JSON response:', parseError)
        console.error('Response text:', responseText.substring(0, 500))
        toast.error("Invalid response format from server. Please try again.")
        setOtp(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
        return
      }

      // Check if response indicates success
      if (!data || typeof data !== 'object') {
        console.error('Invalid data structure:', data)
        toast.error("Invalid response format. Please try again.")
        setOtp(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
        return
      }

      if (!data.success) {
        // Use console.log instead of console.error for user-facing errors to avoid triggering error handlers
        console.log('ℹ️ Verify OTP API returned success=false:', data)
        const errorMessage = data.error || data.message || "Invalid or expired OTP. Please try again or request a new one."
        
        // If OTP not found, suggest requesting a new one (likely server restart in dev mode)
        if (errorMessage.includes('not found') || errorMessage.includes('expired')) {
          toast.error(errorMessage + " If you just requested the OTP, the server may have restarted. Please request a new OTP.")
        } else {
          toast.error(errorMessage)
        }
        
        setOtp(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
        return
      }

      // Success case
      setIsVerified(true)
      toast.success("OTP verified successfully!")
      console.log(`✅ OTP verified for ${userEmail.trim()}`)
      
      // Store OTP in sessionStorage as backup (in case URL encoding causes issues)
      sessionStorage.setItem('resetOTP', otpString)
      sessionStorage.setItem('resetEmail', userEmail.trim())
      
      // Redirect to reset password page
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(userEmail.trim())}&otp=${otpString}`)
      }, 1000)
    } catch (error: any) {
      console.error("Verify OTP error:", error)
      const errorMessage = error?.message || "An unexpected error occurred. Please try again."
      toast.error(errorMessage)
      // Clear OTP inputs on error
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!userEmail || !userEmail.trim()) {
      toast.error("Email address is required")
      return
    }

    setIsLoading(true)
    
    try {
      console.log(`🔄 Resending OTP to ${userEmail}`)
      
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail.trim() }),
      })

      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Resend OTP API error:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Check content type
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Non-JSON response:', text.substring(0, 200))
        throw new Error('Server returned non-JSON response')
      }

      const data = await response.json()

      if (data.success) {
        setTimeLeft(600) // Reset timer to 10 minutes
        toast.success("New OTP sent to your email! Please check your inbox.")
        setOtp(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
        console.log(`✅ Resend OTP successful for ${userEmail}`)
      } else {
        toast.error(data.error || "Failed to resend OTP")
        console.error('Resend OTP failed:', data)
      }
    } catch (error: any) {
      console.error("Resend OTP error:", error)
      const errorMessage = error?.message || "An unexpected error occurred. Please try again."
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">OTP Verified!</CardTitle>
            <CardDescription>
              Redirecting you to reset your password...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Enter Verification Code</CardTitle>
          <CardDescription>
            We sent a 6-digit code to <strong>{userEmail}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label>Enter 6-digit OTP</Label>
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-lg font-semibold"
                    disabled={isLoading}
                  />
                ))}
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Code expires in {formatTime(timeLeft)}</span>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading || otp.join("").length !== 6}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Verify OTP
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 space-y-3">
            <Button 
              variant="outline" 
              onClick={handleResendOTP}
              disabled={isLoading || timeLeft > 540} // Can resend after 1 minute
              className="w-full"
            >
              Resend OTP {timeLeft > 540 && `(${formatTime(timeLeft - 540)})`}
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => router.push("/forgot-password")}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Forgot Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
