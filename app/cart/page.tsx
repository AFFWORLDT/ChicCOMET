"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CreditCard, Truck, MapPin, Zap, Clock, Shield, CheckCircle, User, Edit, Banknote, Check, Loader2, Smartphone, Globe, Info } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { Footer } from "@/components/footer"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { ScrollAnimate } from "@/components/scroll-animate"
import { StripePayment } from "@/components/stripe-payment"
import { Price } from "@/components/price"
import { useCurrency } from "@/components/currency-provider"

interface ShippingAddress {
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
}

export default function CartPage() {
  const { state, updateQuantity, removeItem, clearCart } = useCart()
  const { user, isLoading: authLoading } = useAuth()
  const { formatPrice, currency: selectedCurrency, currentCurrency } = useCurrency()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [placingOrder, setPlacingOrder] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [expressCheckout, setExpressCheckout] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("stripe")
  const [showStripeModal, setShowStripeModal] = useState(false)
  const [createdOrderId, setCreatedOrderId] = useState("")
  const [createdOrderNumber, setCreatedOrderNumber] = useState("")
  const [showCurrencyConfirmation, setShowCurrencyConfirmation] = useState(false)
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: user?.name || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'UAE',
    phone: ''
  })
  const [notes, setNotes] = useState('')
  const [savedAddresses, setSavedAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [showAddressSelector, setShowAddressSelector] = useState(false)
  const [orderProgress, setOrderProgress] = useState(0)
  const [showEditAddressDialog, setShowEditAddressDialog] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editAddressForm, setEditAddressForm] = useState<ShippingAddress>({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'UAE',
    phone: ''
  })

  // Memoized calculations for better performance
  const subtotal = useMemo(() => {
    return state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }, [state.items])

  const shipping = useMemo(() => {
    return subtotal > 100 ? 0 : 10 // Free shipping over AED 100
  }, [subtotal])

  const tax = useMemo(() => {
    return subtotal * 0.05 // 5% tax
  }, [subtotal])

  const total = useMemo(() => {
    return subtotal + shipping + tax
  }, [subtotal, shipping, tax])

  const canExpressCheckout = useMemo(() => {
    return true // Express checkout is always available for logged-in users
  }, [])

  const selectedAddress = useMemo(() => {
    if (selectedAddressId) {
      return savedAddresses.find(addr => addr._id === selectedAddressId)
    }
    return savedAddresses.find(addr => addr.isDefault) || savedAddresses[0] || null
  }, [savedAddresses, selectedAddressId])

  useEffect(() => {
    if (user?.name) {
      setShippingAddress(prev => ({
        ...prev,
        name: user.name
      }))
    }
    // Populate phone if available and not already set
    if ((user as any)?.phone) {
      setShippingAddress(prev => {
        // Only update if phone is empty
        if (!prev.phone || prev.phone.trim() === '') {
          return {
            ...prev,
            phone: (user as any).phone
          }
        }
        return prev
      })
    }
  }, [user])

  useEffect(() => {
    const fetchSavedAddresses = async () => {
      // Robust userId check
      const userId = user?.id || (user as any)?._id || (user as any)?.userId;
      if (!userId) {
        console.log('Cart: No userId available for fetching addresses', user);
        return;
      }
      
      try {
        console.log('Cart: Fetching addresses for userId:', userId);
        const response = await fetch(`/api/user/addresses?userId=${userId}`)
        const data = await response.json()
        
        if (data.success && data.data && data.data.length > 0) {
          console.log('Cart: Fetched addresses:', data.data.length);
          // Remove duplicates based on address content
          const uniqueAddresses = data.data.filter((addr: any, index: number, self: any[]) => 
            index === self.findIndex((a: any) => 
              a.address === addr.address && 
              a.city === addr.city && 
              a.zipCode === addr.zipCode
            )
          )
          
          setSavedAddresses(uniqueAddresses)
          setShowAddressForm(false) // Hide form if we have saved addresses
          
          // Set default address if available
          const defaultAddress = uniqueAddresses.find((addr: any) => addr.isDefault) || uniqueAddresses[0]
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress._id)
            
            // Pre-fill form with default address
            setShippingAddress({
              name: defaultAddress.name,
              address: defaultAddress.address,
              city: defaultAddress.city,
              state: defaultAddress.state,
              zipCode: defaultAddress.zipCode,
              country: defaultAddress.country || 'UAE',
              phone: defaultAddress.phone || (user as any)?.phone || shippingAddress.phone || '' // Prioritize address phone
            })
          }
        } else {
          console.log('Cart: No saved addresses found or fetch failed', data);
        }
      } catch (err) {
        console.error('Error fetching saved addresses:', err)
      }
    }

    if (user) {
      fetchSavedAddresses()
    }
  }, [user])

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  const handleCheckout = () => {
    if (state.items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    setShowCheckout(true)
  }

  const handleGuestCheckout = () => {
    if (state.items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    router.push('/checkout/guest')
  }

  // Super fast express checkout
  const handleExpressCheckout = useCallback(async () => {
    // Wait for auth to finish loading
    if (authLoading) {
      toast.info("Please wait, checking authentication...")
      return
    }

    // Check if user is signed in (with fallback to localStorage)
    let userId = user?.id || (user as any)?._id || (user as any)?.userId;
    if (!userId && typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem("whitlin_user")
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          userId = userData.id || userData._id || userData.userId;
        }
      } catch (err) {
        // Ignore errors
      }
    }

    if (!userId) {
      toast.error("Please sign in to place order")
      router.push('/login')
      return
    }

    if (state.items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    // Check if we have a complete address - use shippingAddress state which contains form edits
    const currentAddress = shippingAddress
    const hasCompleteAddress = currentAddress.name && currentAddress.address && currentAddress.city && 
                               currentAddress.state && currentAddress.zipCode && currentAddress.phone

    // If no complete address, show the edit address dialog
    if (!hasCompleteAddress) {
      // Pre-fill the edit form with existing data
      setEditAddressForm({
        name: currentAddress.name || user?.name || '',
        address: currentAddress.address || '',
        city: currentAddress.city || '',
        state: currentAddress.state || '',
        zipCode: currentAddress.zipCode || '',
        country: currentAddress.country || 'UAE',
        phone: currentAddress.phone || (user as any)?.phone || ''
      })
      setShowEditAddressDialog(true)
      return
    }

    setExpressCheckout(true)
    setOrderProgress(0)

    try {
      // Step 1: Prepare final address
      setOrderProgress(25)
      const finalAddress = {
        name: currentAddress.name?.trim() || '',
        address: currentAddress.address?.trim() || '',
        city: currentAddress.city?.trim() || '',
        state: currentAddress.state?.trim() || '',
        zipCode: currentAddress.zipCode?.trim() || '',
        country: currentAddress.country?.trim() || 'UAE',
        phone: currentAddress.phone?.trim() || ''
      }

      // Final validation before sending
      if (!finalAddress.name || !finalAddress.address || !finalAddress.city || 
          !finalAddress.state || !finalAddress.zipCode || !finalAddress.phone) {
        toast.error("Please provide a complete shipping address")
        setExpressCheckout(false)
        setOrderProgress(0)
        return
      }

      // Step 2: Create order data
      setOrderProgress(50)
      
      // Validate user and items first - with fallback to localStorage
      let userId = user?.id || (user as any)?._id
      
      // Fallback: Try to get user from localStorage if user object is missing id
      if (!userId && typeof window !== 'undefined') {
        try {
          const savedUser = localStorage.getItem("whitlin_user")
          if (savedUser) {
            const userData = JSON.parse(savedUser)
            userId = userData.id || userData._id
            console.log('Express checkout - Got userId from localStorage:', userId)
          }
        } catch (err) {
          console.error('Express checkout - Error reading localStorage:', err)
        }
      }
      
      if (!userId) {
        console.error('Express checkout - No userId found. User object:', user)
        console.error('Express checkout - localStorage check:', typeof window !== 'undefined' ? localStorage.getItem("whitlin_user") : 'N/A')
        toast.error("Please sign in to place order. If you're already signed in, please refresh the page.")
        setExpressCheckout(false)
        setOrderProgress(0)
        return
      }
      
      if (!user) {
        console.warn('Express checkout - User object is null but userId found:', userId)
      }

      if (!state.items || state.items.length === 0) {
        console.error('Express checkout - No items in cart:', state.items)
        toast.error("Your cart is empty")
        setExpressCheckout(false)
        setOrderProgress(0)
        return
      }

      // Ensure all address fields are trimmed and non-empty
      const cleanedAddress = {
        name: finalAddress.name?.trim() || '',
        address: finalAddress.address?.trim() || '',
        city: finalAddress.city?.trim() || '',
        state: finalAddress.state?.trim() || '',
        zipCode: finalAddress.zipCode?.trim() || '',
        country: finalAddress.country?.trim() || 'UAE',
        phone: finalAddress.phone?.trim() || ''
      }

      // Final validation before sending
      if (!cleanedAddress.name || !cleanedAddress.address || !cleanedAddress.city || 
          !cleanedAddress.state || !cleanedAddress.zipCode || !cleanedAddress.phone) {
        console.error('Express checkout - Invalid address:', cleanedAddress)
        toast.error("Please fill in all address fields (Name, Phone, Address, City, State, ZIP Code)")
        setExpressCheckout(false)
        setOrderProgress(0)
        setShowCheckout(true)
        return
      }

      // Map items and validate
      const orderItems = state.items.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))

      if (orderItems.length === 0) {
        console.error('Express checkout - No valid items:', state.items)
        toast.error("No valid items in cart")
        setExpressCheckout(false)
        setOrderProgress(0)
        return
      }

      const orderData = {
        userId: userId, // Use the validated userId
        items: orderItems,
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        totalAmount: total,
        shippingAddress: cleanedAddress,
        paymentMethod: 'cash_on_delivery',
        notes: 'Express Checkout'
      }

      // Final validation of orderData
      if (!orderData.userId || !orderData.items || orderData.items.length === 0 || !orderData.shippingAddress) {
        console.error('Express checkout - Invalid orderData:', {
          hasUserId: !!orderData.userId,
          hasItems: !!orderData.items,
          itemsLength: orderData.items?.length,
          hasShippingAddress: !!orderData.shippingAddress,
          shippingAddress: orderData.shippingAddress
        })
        toast.error("Invalid order data. Please try again.")
        setExpressCheckout(false)
        setOrderProgress(0)
        return
      }

      console.log('Express checkout - Sending order data:', {
        userId: orderData.userId,
        itemsCount: orderData.items.length,
        shippingAddress: orderData.shippingAddress,
        totalAmount: orderData.totalAmount
      })
      console.log('Express checkout - Full order data JSON:', JSON.stringify(orderData, null, 2))

      // Step 3: Place order
      setOrderProgress(75)

      // Handle Stripe flow
      if (paymentMethod === 'stripe') {
        const createOrderResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...orderData, paymentStatus: 'pending' })
        })
        const createOrderData = await createOrderResponse.json()
        if (createOrderData.success) {
          setCreatedOrderId(createOrderData.data.orderId)
          setCreatedOrderNumber(createOrderData.data.orderNumber)
          setShowStripeModal(true)
          setExpressCheckout(false)
          setOrderProgress(0)
          return
        } else {
          throw new Error(createOrderData.error || "Failed to initiate Stripe order")
        }
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      const data = await response.json()
      console.log('Express checkout - API response:', data)

      if (data.success) {
        setOrderProgress(100)
        toast.success("🚀 Order placed in seconds! Thank you!")
        clearCart()
        setTimeout(() => {
          router.push(`/orders/${data.data.orderId}`)
        }, 500)
      } else {
        console.error('Express checkout - API error response:', data)
        const errorMsg = data.error || data.details || "Failed to place order"
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('Express checkout error:', error)
      const errorMessage = error instanceof Error ? error.message : "Express checkout failed. Please try again."
      toast.error(errorMessage)
    } finally {
      if (paymentMethod !== 'stripe' && paymentMethod !== 'upi') {
        setExpressCheckout(false)
        setOrderProgress(0)
      }
    }
  }, [user, authLoading, state.items, shippingAddress, selectedAddress, subtotal, shipping, tax, total, clearCart, router, paymentMethod])

  // Handle saving address from dialog and continuing with express checkout
  const handleSaveAddressFromDialog = useCallback(async () => {
    // Validate address form
    if (!editAddressForm.name || !editAddressForm.address || !editAddressForm.city || 
        !editAddressForm.state || !editAddressForm.zipCode || !editAddressForm.phone) {
      toast.error("Please fill in all required address fields")
      return
    }

    try {
      // Update shipping address state
      setShippingAddress(editAddressForm)
      
      // Save address to user's saved addresses if user is logged in
      if (user?.id) {
        const userId = user.id || (user as any)?._id
        const response = await fetch('/api/user/addresses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: userId,
            addressData: {
              name: editAddressForm.name,
              address: editAddressForm.address,
              city: editAddressForm.city,
              state: editAddressForm.state,
              zipCode: editAddressForm.zipCode,
              country: editAddressForm.country || 'UAE',
              phone: editAddressForm.phone,
              type: 'Home'
            }
          })
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            // Refresh saved addresses
            const addressesResponse = await fetch(`/api/user/addresses?userId=${userId}`)
            const addressesData = await addressesResponse.json()
            if (addressesData.success) {
              setSavedAddresses(addressesData.data)
              // Select the newly saved address
              if (data.data._id) {
                setSelectedAddressId(data.data._id)
              }
            }
          }
        }
      }

      // Close dialog
      setShowEditAddressDialog(false)
      
      // Continue with express checkout after state is updated
      toast.success("Address saved! Proceeding with express checkout...")
      
      // Small delay to ensure state is updated, then trigger express checkout
      setTimeout(async () => {
        // Re-check if we have complete address now
        const hasCompleteAddress = editAddressForm.name && editAddressForm.address && 
          editAddressForm.city && editAddressForm.state && 
          editAddressForm.zipCode && editAddressForm.phone
        
        if (hasCompleteAddress) {
          // Trigger express checkout
          setExpressCheckout(true)
          setOrderProgress(0)
          
          try {
            // Get userId
            let userId = user?.id || (user as any)?._id
            if (!userId && typeof window !== 'undefined') {
              try {
                const savedUser = localStorage.getItem("whitlin_user")
                if (savedUser) {
                  const userData = JSON.parse(savedUser)
                  userId = userData.id || userData._id
                }
              } catch (err) {
                // Ignore errors
              }
            }
            
            if (!userId) {
              toast.error("Please sign in to place order")
              setExpressCheckout(false)
              return
            }
            
            if (state.items.length === 0) {
              toast.error("Your cart is empty")
              setExpressCheckout(false)
              return
            }
            
            // Use the saved address
            const finalAddress = editAddressForm
            
            // Create order data
            setOrderProgress(50)
            const orderItems = state.items.map(item => ({
              productId: item.id,
              quantity: item.quantity
            }))
            
            const orderData = {
              userId: userId,
              items: orderItems,
              subtotal: subtotal,
              shipping: shipping,
              tax: tax,
              totalAmount: total,
              shippingAddress: finalAddress,
              paymentMethod: 'cash_on_delivery',
              notes: 'Express Checkout'
            }
            
            // Place order
            setOrderProgress(75)
            const response = await fetch('/api/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(orderData)
            })
            
            const data = await response.json()
            
            if (data.success) {
              setOrderProgress(100)
              toast.success("🚀 Order placed in seconds! Thank you!")
              clearCart()
              setTimeout(() => {
                router.push(`/orders/${data.data.orderId}`)
              }, 500)
            } else {
              const errorMsg = data.error || data.details || "Failed to place order"
              throw new Error(errorMsg)
            }
          } catch (error) {
            console.error('Express checkout error:', error)
            const errorMessage = error instanceof Error ? error.message : "Express checkout failed. Please try again."
            toast.error(errorMessage)
            setExpressCheckout(false)
            setOrderProgress(0)
          }
        }
      }, 200)
    } catch (error) {
      console.error('Error saving address:', error)
      toast.error("Failed to save address. Please try again.")
    }
  }, [editAddressForm, user, state.items, subtotal, shipping, tax, total, savedAddresses, clearCart, router, paymentMethod])

  const handlePlaceOrder = async () => {
    // Wait for auth to finish loading
    if (authLoading) {
      toast.info("Please wait, checking authentication...")
      return
    }

    // Check if user is signed in (with fallback to localStorage)
    let userId = user?.id || (user as any)?._id || (user as any)?.userId;
    if (!userId && typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem("whitlin_user")
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          userId = userData.id || userData._id || userData.userId;
        }
      } catch (err) {
        // Ignore errors
      }
    }

    if (!userId) {
      toast.error("Please sign in to place order")
      router.push('/login')
      return
    }

    // Validate shipping address - use shippingAddress state which contains form edits
    const currentAddress = shippingAddress
    if (!currentAddress.name || !currentAddress.address || !currentAddress.city || 
        !currentAddress.state || !currentAddress.zipCode || !currentAddress.phone) {
      toast.error("Please fill in all shipping address fields (Name, Phone, Address, City, State, ZIP Code)")
      setShowAddressForm(true) // Show the form so they can see what is missing
      return
    }

    setPlacingOrder(true)
    setOrderProgress(0)

    try {
      // Step 1: Save address
      setOrderProgress(20)
      if (!selectedAddress || 
          selectedAddress.address !== shippingAddress.address ||
          selectedAddress.city !== shippingAddress.city ||
          selectedAddress.state !== shippingAddress.state ||
          selectedAddress.zipCode !== shippingAddress.zipCode) {
        
        try {
          await fetch(`/api/user/addresses?userId=${userId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userId: userId,
              addressData: {
                type: 'Home',
                name: shippingAddress.name,
                address: shippingAddress.address,
                city: shippingAddress.city,
                state: shippingAddress.state,
                zipCode: shippingAddress.zipCode,
                country: shippingAddress.country,
                phone: shippingAddress.phone || ''
              }
            })
          })
        } catch (err) {
          console.error('Error saving address:', err)
          // Continue with order even if address saving fails
        }
      }

      // Step 2: Prepare order data
      setOrderProgress(50)
      
      // Validate user and items first - with fallback to localStorage
      let currentUserId = user?.id || (user as any)?._id
      
      // Fallback: Try to get user from localStorage if user object is missing id
      if (!currentUserId && typeof window !== 'undefined') {
        try {
          const savedUser = localStorage.getItem("whitlin_user")
          if (savedUser) {
            const userData = JSON.parse(savedUser)
            currentUserId = userData.id || userData._id
            console.log('Place order - Got userId from localStorage:', currentUserId)
          }
        } catch (err) {
          console.error('Place order - Error reading localStorage:', err)
        }
      }
      
      if (!currentUserId) {
        console.error('Place order - No userId found. User object:', user)
        console.error('Place order - localStorage check:', typeof window !== 'undefined' ? localStorage.getItem("whitlin_user") : 'N/A')
        toast.error("Please sign in to place order. If you're already signed in, please refresh the page.")
        setPlacingOrder(false)
        setOrderProgress(0)
        return
      }
      
      if (!user) {
        console.warn('Place order - User object is null but userId found:', userId)
      }

      if (!state.items || state.items.length === 0) {
        console.error('Place order - No items in cart:', state.items)
        toast.error("Your cart is empty")
        setPlacingOrder(false)
        setOrderProgress(0)
        return
      }
      
      // Clean and validate address
      const cleanedAddress = {
        name: shippingAddress.name?.trim() || '',
        address: shippingAddress.address?.trim() || '',
        city: shippingAddress.city?.trim() || '',
        state: shippingAddress.state?.trim() || '',
        zipCode: shippingAddress.zipCode?.trim() || '',
        country: shippingAddress.country?.trim() || 'UAE',
        phone: shippingAddress.phone?.trim() || ''
      }

      // Final validation
      if (!cleanedAddress.name || !cleanedAddress.address || !cleanedAddress.city || 
          !cleanedAddress.state || !cleanedAddress.zipCode || !cleanedAddress.phone) {
        console.error('Place order - Invalid address:', cleanedAddress)
        toast.error("Please fill in all address fields")
        setPlacingOrder(false)
        setOrderProgress(0)
        setShowAddressForm(true)
        return
      }

      // Map items and validate
      const orderItems = state.items.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))

      if (orderItems.length === 0) {
        console.error('Place order - No valid items:', state.items)
        toast.error("No valid items in cart")
        setPlacingOrder(false)
        setOrderProgress(0)
        return
      }

      const orderData = {
        userId: currentUserId, // Use the validated userId
        items: orderItems,
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        totalAmount: total,
        shippingAddress: cleanedAddress,
        paymentMethod: paymentMethod, // Use the selected method
        notes
      }

      // Final validation of orderData
      if (!orderData.userId || !orderData.items || orderData.items.length === 0 || !orderData.shippingAddress) {
        console.error('Place order - Invalid orderData:', {
          hasUserId: !!orderData.userId,
          hasItems: !!orderData.items,
          itemsLength: orderData.items?.length,
          hasShippingAddress: !!orderData.shippingAddress,
          shippingAddress: orderData.shippingAddress
        })
        toast.error("Invalid order data. Please try again.")
        setPlacingOrder(false)
        setOrderProgress(0)
        return
      }

      console.log('Place order - Sending order data:', {
        userId: orderData.userId,
        itemsCount: orderData.items.length,
        shippingAddress: orderData.shippingAddress,
        totalAmount: orderData.totalAmount
      })
      console.log('Place order - Full order data JSON:', JSON.stringify(orderData, null, 2))

      // Step 3: Place order
      setOrderProgress(80)

      // Handle Stripe flow
      if (paymentMethod === 'stripe') {
        const createOrderResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...orderData, paymentStatus: 'pending' })
        })
        const createOrderData = await createOrderResponse.json()
        if (createOrderData.success) {
          setCreatedOrderId(createOrderData.data.orderId)
          setCreatedOrderNumber(createOrderData.data.orderNumber)
          setShowStripeModal(true)
          setPlacingOrder(false)
          setOrderProgress(0)
          return
        } else {
          throw new Error(createOrderData.error || "Failed to initiate Stripe order")
        }
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      const data = await response.json()
      console.log('Place order - API response:', data)

      if (data.success) {
        setOrderProgress(100)
        toast.success("Order placed successfully!")
        clearCart()
        setTimeout(() => {
          router.push(`/orders/${data.data.orderId}`)
        }, 500)
      } else {
        console.error('Cart - Order failed:', data.error, data.details)
        const errorMsg = data.error || data.details || "Failed to place order"
        toast.error(errorMsg)
      }
    } catch (error) {
      console.error('Error placing order:', error)
      const errorMessage = error instanceof Error ? error.message : "Failed to place order"
      toast.error(errorMessage)
    } finally {
      if (paymentMethod !== 'stripe') {
        setPlacingOrder(false)
        setOrderProgress(0)
      }
    }
  }

  const handleStripeSuccess = (paymentIntent: any) => {
    setShowStripeModal(false)
    toast.success("Payment successful! Redirecting to order confirmation...")
    clearCart()
    router.push(`/orders/${createdOrderNumber || 'success'}`)
  }

  const handleClearCart = () => {
    clearCart()
    toast.success("Cart cleared")
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-white page-fade">
        <ScrollAnimate animation="bounce-in-subtle" delay={100}>
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <ShoppingBag className="h-16 w-16 sm:h-24 sm:w-24 text-[#737373] mx-auto mb-4" />
                <h1 className="text-2xl sm:text-3xl font-bold text-[#262626] mb-2">Your Cart is Empty</h1>
                <p className="text-sm sm:text-base text-[#525252] mb-6 sm:mb-8 px-4">
                  Looks like you haven't added any items to your cart yet.
                </p>
                <Link href="/products">
                  <Button size="lg" className="bg-[#4e6a9a] hover:bg-[#3f567f] text-white w-full sm:w-auto button-press smooth-color-transition font-bold">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </ScrollAnimate>
        <ScrollAnimate animation="fade-in" delay={300}>
          <Footer />
        </ScrollAnimate>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 page-fade">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <ScrollAnimate animation="fade-in-up-scale" delay={100}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Link href="/products" className="w-full sm:w-auto">
                <Button variant="outline" size="sm" className="w-full sm:w-auto border-[#4e6a9a] text-[#4e6a9a] hover:bg-[#4e6a9a]/5">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#262626]">Shopping Cart</h1>
            </div>
            <Button 
              variant="outline" 
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-700 w-full sm:w-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          </div>
          </ScrollAnimate>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <ShoppingBag className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>Cart Items ({state.items.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg">
                      <div className="relative w-full sm:w-20 h-48 sm:h-20 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0 w-full sm:w-auto">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-medium text-[#262626] text-sm sm:text-base flex-1">{item.name}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700 sm:hidden flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Price amount={item.price} className="text-sm text-[#929292] mb-3" />
                        <div className="flex items-center justify-between sm:justify-start gap-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={loading}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={loading}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="sm:hidden">
                            <p className="font-medium text-[#262626] text-lg">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="hidden sm:flex flex-col items-end justify-between text-right w-24">
                        <p className="font-medium text-[#262626]">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary & Checkout */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  {shipping === 0 && (
                    <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                      <Shield className="h-3 w-3 inline mr-1" />
                      Free shipping on orders over {formatPrice(100)}
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  
                  {!showCheckout ? (
                    <div className="space-y-3">
                      {user ? (
                        <>
                          {/* Express Checkout Button - Only for logged in users */}
                          <Button 
                            onClick={handleExpressCheckout}
                            disabled={expressCheckout || !canExpressCheckout}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
                            size="lg"
                          >
                            {expressCheckout ? (
                              <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Express Checkout...
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <Zap className="h-5 w-5 mr-2" />
                                Express Checkout
                              </div>
                            )}
                          </Button>
                          
                          <div className="text-center">
                            <Badge variant="secondary" className="text-xs break-words px-2">
                              <Zap className="h-3 w-3 mr-1 inline" />
                              <span className="inline-block max-w-full break-words">
                                {selectedAddress ? `Using: ${selectedAddress.name}` : 'Address confirmation required'}
                              </span>
                            </Badge>
                          </div>

                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                              <span className="bg-white px-2 text-[#929292]">or</span>
                            </div>
                          </div>
                          
                          <Button 
                            onClick={() => setShowCurrencyConfirmation(true)}
                            className="w-full bg-[#4e6a9a] hover:bg-[#3f567f] text-white font-bold"
                            size="lg"
                          >
                            <CreditCard className="h-5 w-5 mr-2" />
                            Regular Checkout
                          </Button>
                        </>
                      ) : (
                        <>
                          {/* Guest Checkout - For non-logged in users */}
                          <Button 
                            onClick={() => setShowCurrencyConfirmation(true)}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
                            size="lg"
                          >
                            <div className="flex items-center">
                              <User className="h-5 w-5 mr-2" />
                              Continue as Guest
                            </div>
                          </Button>
                          
                          <div className="text-center">
                            <p className="text-xs sm:text-sm text-[#929292] mb-2 px-2">
                              No account needed • We'll create one for you
                            </p>
                          </div>

                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                              <span className="bg-white px-2 text-[#929292]">or</span>
                            </div>
                          </div>
                          
                          <Button 
                            onClick={() => router.push('/login')}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                            size="lg"
                          >
                            <CreditCard className="h-5 w-5 mr-2" />
                            Sign In to Checkout
                          </Button>
                        </>
                      )}
                      
                      {/* Trust Signals */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-[#525252]">
                        <div className="flex items-center justify-center p-2 bg-[#fafafa] rounded">
                          <Shield className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">Secure</span>
                        </div>
                        <div className="flex items-center justify-center p-2 bg-[#fafafa] rounded">
                          <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">Fast Delivery</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Progress Bar */}
                      {(placingOrder || expressCheckout) && orderProgress > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Processing Order...</span>
                            <span>{orderProgress}%</span>
                          </div>
                          <div className="w-full bg-[#e5e5e5] rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${orderProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      {/* Express Checkout Button - Show when form is visible */}
                      {user && (
                        <Button 
                          onClick={handleExpressCheckout}
                          disabled={expressCheckout || placingOrder}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
                          size="lg"
                        >
                          {expressCheckout ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Express Checkout...
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Zap className="h-5 w-5 mr-2" />
                              Express Checkout
                            </div>
                          )}
                        </Button>
                      )}
                      
                      <div className="space-y-3 pt-2">
                        <Label className="text-sm font-semibold text-[#262626]">Payment Method</Label>
                        <RadioGroup 
                          value={paymentMethod} 
                          onValueChange={setPaymentMethod}
                          className="grid grid-cols-2 gap-3"
                        >
                          <div className="relative">
                            <RadioGroupItem value="stripe" id="stripe-cart" className="sr-only" />
                            <Label
                              htmlFor="stripe-cart"
                              className={`relative flex flex-col items-center justify-center rounded-lg border p-3 hover:bg-gray-50 cursor-pointer transition-all min-h-[80px] ${
                                paymentMethod === 'stripe' 
                                  ? 'border-[#e1d7c6] bg-[#e1d7c6]/10 ring-1 ring-[#e1d7c6]' 
                                  : 'border-gray-200 opacity-70'
                              }`}
                            >
                              <CreditCard className={`mb-1 h-5 w-5 ${paymentMethod === 'stripe' ? 'text-[#e1d7c6]' : 'text-gray-400'}`} />
                              <span className="text-[10px] font-medium text-center">Card</span>
                              {paymentMethod === 'stripe' && (
                                <div className="absolute top-1.5 right-1.5">
                                  <div className="bg-[#e1d7c6] rounded-full p-0.5">
                                    <Check className="h-2 w-2 text-white" />
                                  </div>
                                </div>
                              )}
                            </Label>
                          </div>

                          <div className="relative">
                            <RadioGroupItem value="cod" id="cod-cart" className="sr-only" />
                            <Label
                              htmlFor="cod-cart"
                              className={`relative flex flex-col items-center justify-center rounded-lg border p-3 hover:bg-gray-50 cursor-pointer transition-all min-h-[80px] ${
                                paymentMethod === 'cod' 
                                  ? 'border-[#e1d7c6] bg-[#e1d7c6]/10 ring-1 ring-[#e1d7c6]' 
                                  : 'border-gray-200 opacity-70'
                              }`}
                            >
                              <Banknote className={`mb-1 h-5 w-5 ${paymentMethod === 'cod' ? 'text-[#e1d7c6]' : 'text-gray-400'}`} />
                              <span className="text-[10px] font-medium text-center">Cash</span>
                              {paymentMethod === 'cod' && (
                                <div className="absolute top-1.5 right-1.5">
                                  <div className="bg-[#e1d7c6] rounded-full p-0.5">
                                    <Check className="h-2 w-2 text-white" />
                                  </div>
                                </div>
                              )}
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <Button 
                        onClick={handlePlaceOrder}
                        disabled={placingOrder || expressCheckout}
                        className={`w-full text-white font-semibold ${
                          paymentMethod === 'stripe'
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                        size="lg"
                      >
                        {placingOrder ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </div>
                        ) : (
                          paymentMethod === 'stripe' ? (
                            <><CreditCard className="h-5 w-5 mr-2" /> Pay with Card</>
                          ) : (
                            <><Banknote className="h-5 w-5 mr-2" /> Confirm COD Order</>
                          )
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Address Selector */}
              {showCheckout && savedAddresses.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <CardTitle className="flex items-center text-base sm:text-lg">
                        <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                        <span>Saved Addresses</span>
                      </CardTitle>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {!showAddressForm && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-9 px-3 text-xs"
                            onClick={() => setShowAddressForm(true)}
                          >
                            <Edit className="h-3.5 w-3.5 mr-1.5" />
                            Edit Details
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-9 px-3 text-xs"
                          onClick={() => setShowAddressSelector(!showAddressSelector)}
                        >
                          {showAddressSelector ? (
                            <>Hide List</>
                          ) : (
                            <>Change</>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {/* Selected Address Summary */}
                  {!showAddressSelector && !showAddressForm && selectedAddress && (
                    <CardContent className="pb-2">
                       <div className="p-3 border rounded-lg bg-gray-50/50">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium text-[#262626]">{selectedAddress.name}</div>
                            <div className="text-sm text-[#525252] mt-1">
                              {selectedAddress.address}<br />
                              {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}<br />
                              {selectedAddress.country}
                            </div>
                            <div className="text-sm text-[#525252] mt-1">
                              {selectedAddress.phone}
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                            Selected
                          </Badge>
                        </div>
                       </div>
                    </CardContent>
                  )}

                  {showAddressSelector && (
                    <CardContent className="space-y-3">
                      {savedAddresses.map((address, index) => (
                        <div
                          key={`${address._id}-${index}-${address.address}-${address.city}`}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedAddressId === address._id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => {
                            setSelectedAddressId(address._id)
                            setShippingAddress({
                              name: address.name,
                              address: address.address,
                              city: address.city,
                              state: address.state,
                              zipCode: address.zipCode,
                              country: address.country || 'UAE',
                              phone: address.phone || (user as any)?.phone || shippingAddress.phone || ''
                            })
                            setShowAddressSelector(false)
                            setShowAddressForm(false) // Hide form when selecting new address
                          }}
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm sm:text-base">{address.name}</div>
                              <div className="text-xs sm:text-sm text-[#525252] break-words">
                                {address.address}, {address.city}, {address.state} {address.zipCode}
                              </div>
                              <div className="text-xs text-[#929292]">{address.country}</div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {address.isDefault && (
                                <Badge variant="secondary" className="text-xs">
                                  Default
                                </Badge>
                              )}
                              {selectedAddressId === address._id && (
                                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  )}
                </Card>
              )}

              {/* Shipping Address Form */}
              {showCheckout && (showAddressForm || savedAddresses.length === 0) && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center text-base sm:text-lg">
                      <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span>{savedAddresses.length > 0 ? 'Edit Address' : 'Shipping Address'}</span>
                    </CardTitle>
                    {savedAddresses.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAddressForm(false)}
                        className="text-gray-500 hover:text-gray-700 h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={shippingAddress.name}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Textarea
                        id="address"
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Enter your complete address"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={shippingAddress.state}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                          placeholder="State"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zipCode">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          value={shippingAddress.zipCode}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                          placeholder="ZIP Code"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Input
                          id="country"
                          value={shippingAddress.country}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, country: e.target.value }))}
                          placeholder="Country"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">Order Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any special instructions for your order"
                        rows={2}
                      />
                    </div>

                    {/* Save Address Option */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-[#fafafa] rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">Save this address</div>
                        <div className="text-xs text-[#525252]">Save for future orders</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={async () => {
                          if (!user?.id) return
                          try {
                            const response = await fetch(`/api/user/addresses`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json'
                              },
                              body: JSON.stringify({
                                userId: user.id,
                                addressData: {
                                  type: 'Home',
                                  name: shippingAddress.name,
                                  address: shippingAddress.address,
                                  city: shippingAddress.city,
                                  state: shippingAddress.state,
                                  zipCode: shippingAddress.zipCode,
                                  country: shippingAddress.country,
                                  isDefault: savedAddresses.length === 0 // Set as default if first address
                                }
                              })
                            })
                            
                            if (response.ok) {
                              toast.success('Address saved successfully!')
                              // Refresh addresses
                              const data = await response.json()
                              if (data.success) {
                                setSavedAddresses(prev => {
                                  // Check if address already exists to avoid duplicates
                                  const exists = prev.some(addr => 
                                    addr.address === data.data.address && 
                                    addr.city === data.data.city && 
                                    addr.zipCode === data.data.zipCode
                                  )
                                  if (exists) {
                                    return prev // Don't add duplicate
                                  }
                                  return [...prev, data.data]
                                })
                                if (savedAddresses.length === 0) {
                                  setSelectedAddressId(data.data._id)
                                }
                              }
                            } else {
                              const errorData = await response.json()
                              toast.error(errorData.error || 'Failed to save address')
                            }
                          } catch (error) {
                            toast.error('Failed to save address')
                          }
                        }}
                        disabled={!shippingAddress.name || !shippingAddress.address || !shippingAddress.city}
                      >
                        Save Address
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Edit Address Dialog for Express Checkout */}
      <Dialog open={showEditAddressDialog} onOpenChange={setShowEditAddressDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Shipping Address
            </DialogTitle>
            <DialogDescription>
              Please fill in your shipping address to continue with express checkout
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input
                id="edit-name"
                value={editAddressForm.name}
                onChange={(e) => setEditAddressForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-address">Street Address *</Label>
              <Input
                id="edit-address"
                value={editAddressForm.address}
                onChange={(e) => setEditAddressForm(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter street address"
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-city">City *</Label>
                <Input
                  id="edit-city"
                  value={editAddressForm.city}
                  onChange={(e) => setEditAddressForm(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Enter city"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-state">State *</Label>
                <Input
                  id="edit-state"
                  value={editAddressForm.state}
                  onChange={(e) => setEditAddressForm(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="Enter state"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-zipCode">ZIP Code *</Label>
                <Input
                  id="edit-zipCode"
                  value={editAddressForm.zipCode}
                  onChange={(e) => setEditAddressForm(prev => ({ ...prev, zipCode: e.target.value }))}
                  placeholder="Enter ZIP code"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-country">Country *</Label>
                <Input
                  id="edit-country"
                  value={editAddressForm.country}
                  onChange={(e) => setEditAddressForm(prev => ({ ...prev, country: e.target.value }))}
                  placeholder="Enter country"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-phone">Phone Number *</Label>
              <Input
                id="edit-phone"
                value={editAddressForm.phone}
                onChange={(e) => setEditAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
                className="mt-1"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditAddressDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAddressFromDialog}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Zap className="h-4 w-4 mr-2" />
              Save & Continue Checkout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showStripeModal} onOpenChange={setShowStripeModal}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Complete Your Payment</DialogTitle>
          </DialogHeader>
                <StripePayment 
                  amount={total}
                  currency={selectedCurrency}
                  customerEmail={user?.email || ''}
                  customerName={user?.name || shippingAddress.name || ''}
                  orderId={createdOrderId}
                  onSuccess={handleStripeSuccess}
                  onError={() => {
                    setPlacingOrder(false)
                    setOrderProgress(0)
                  }}
                />
        </DialogContent>
      </Dialog>

      <Footer />
      {/* Currency Confirmation Dialog */}
      <Dialog open={showCurrencyConfirmation} onOpenChange={setShowCurrencyConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#f1a748]" />
              Confirm Your Currency
            </DialogTitle>
            <DialogDescription>
              Please confirm your order details and selected currency
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-[#f1a748]/10 border border-[#f1a748]/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">Selected Currency:</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[#f1a748]">{selectedCurrency}</span>
                  <Badge variant="secondary" className="bg-[#f1a748]/20 text-[#f1a748] border-[#f1a748]/30">
                  {currentCurrency.symbol}
                  </Badge>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Order Total:</span>
                <span className="text-2xl font-bold text-gray-900">{formatPrice(total)}</span>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800 flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>You have selected <strong>{selectedCurrency}</strong> for display. However, your order will be processed and charged in <strong>AED (UAE Dirham)</strong>. The prices shown are converted for your convenience only.</span>
              </p>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCurrencyConfirmation(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowCurrencyConfirmation(false)
                if (user) {
                  handleCheckout()
                } else {
                  handleGuestCheckout()
                }
              }}
              className="w-full sm:w-auto bg-[#f1a748] hover:bg-[#e09638] text-white"
            >
              Confirm & Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}