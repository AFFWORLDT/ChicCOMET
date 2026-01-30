"use client"

import { useState, useEffect } from "react"
import { X, Mail, Phone, Building2, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface LeadCapturePopupProps {
  onClose: () => void
}

export function LeadCapturePopup({ onClose }: LeadCapturePopupProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          message: formData.message,
          subject: 'Inquiry from Popup',
          source: 'popup',
          pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Thank you! We'll contact you soon.")
        onClose()
        // Don't show popup again for this session
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('leadPopupShown', 'true')
        }
      } else {
        throw new Error(data.error || 'Failed to submit')
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to submit. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-3 xs:p-4 sm:p-6">
      <div className="relative bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-bounce-in-subtle hover-shadow-premium">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 text-gray-400 hover:text-gray-600 smooth-color-transition hover-scale-smooth button-press z-10 p-1"
          aria-label="Close popup"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="p-4 xs:p-5 sm:p-6 md:p-8">
          <div className="text-center mb-4 sm:mb-5 md:mb-6">
            <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Mail className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h2 className="text-xl xs:text-2xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 px-2">
              Get Exclusive Offers!
            </h2>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 px-2 sm:px-4 leading-relaxed">
              Subscribe to receive special discounts and updates on our premium hospitality linen products.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 xs:space-y-3.5 sm:space-y-4">
            <div>
              <Input
                id="popup-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                className="w-full h-10 xs:h-11 sm:h-12 text-sm sm:text-base"
              />
            </div>
            <div>
              <Input
                id="popup-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your Email"
                className="w-full h-10 xs:h-11 sm:h-12 text-sm sm:text-base"
              />
            </div>
            <div>
              <Input
                id="popup-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone (Optional)"
                className="w-full h-10 xs:h-11 sm:h-12 text-sm sm:text-base"
              />
            </div>
            <div>
              <Input
                id="popup-company"
                name="company"
                type="text"
                autoComplete="organization"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Company (Optional)"
                className="w-full h-10 xs:h-11 sm:h-12 text-sm sm:text-base"
              />
            </div>
            <div>
              <textarea
                id="popup-message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us about your requirements (Optional)"
                rows={3}
                autoComplete="off"
                className="w-full px-3 py-2 xs:px-3.5 xs:py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm sm:text-base min-h-[80px] xs:min-h-[90px] sm:min-h-[100px]"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 h-11 xs:h-12 sm:h-14 text-sm sm:text-base font-semibold btn-circular"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 xs:w-5 xs:h-5 mr-2 animate-spin" />
                  <span className="hidden xs:inline">Submitting...</span>
                  <span className="xs:hidden">Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 xs:w-5 xs:h-5 mr-2" />
                  Get Started
                </>
              )}
            </Button>
          </form>

          <p className="text-[10px] xs:text-xs text-gray-500 text-center mt-3 xs:mt-3.5 sm:mt-4 px-2 leading-relaxed">
            By submitting, you agree to receive marketing communications from Whitlin.
          </p>
        </div>
      </div>
    </div>
  )
}

// Hook to show popup after delay
export function useLeadPopup() {
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    // Check if popup was already shown in this session
    if (typeof window !== 'undefined' && sessionStorage.getItem('leadPopupShown')) {
      return
    }

    // Show popup after 30 seconds
    const timer = setTimeout(() => {
      setShowPopup(true)
    }, 30000)

    return () => clearTimeout(timer)
  }, [])

  return { showPopup, setShowPopup }
}

