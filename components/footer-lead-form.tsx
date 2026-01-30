"use client"

import { useState } from "react"
import { Mail, Send, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export function FooterLeadForm() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: email.split('@')[0], // Use email prefix as name
          email: email.trim(),
          source: 'footer-newsletter',
          pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        }),
      })

      const data = await response.json()

      if (data.success) {
        setIsSuccess(true)
        setEmail("")
        toast.success("Thank you for subscribing!")
        setTimeout(() => setIsSuccess(false), 3000)
      } else {
        throw new Error(data.error || 'Failed to subscribe')
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to subscribe. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white p-6 rounded-xl">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Stay Updated</h3>
          <p className="text-sm text-gray-400">Get the latest offers and news</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15"
          disabled={isSubmitting || isSuccess}
        />
        <Button
          type="submit"
          size="sm"
          className="bg-primary hover:bg-primary/90 text-white"
          disabled={isSubmitting || isSuccess}
        >
          {isSuccess ? (
            <CheckCircle className="w-5 h-5" />
          ) : isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </form>
    </div>
  )
}

