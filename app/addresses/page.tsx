"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  MapPin,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Loader2,
  Home,
  Building,
  Check
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface Address {
  id: string
  type: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
  createdAt?: string
}

interface AddressFormData {
  type: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export default function AddressesPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<AddressFormData>({
    type: 'Home',
    name: user?.name || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'UAE'
  })

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push("/login")
      return
    }

    const fetchAddresses = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/user/addresses?userId=${user.id}`)
        const data = await response.json()
        
        if (data.success) {
          setAddresses(data.data)
        } else {
          setError(data.error || 'Failed to fetch addresses')
          toast.error(data.error || 'Failed to fetch addresses')
        }
      } catch (err) {
        console.error('Error fetching addresses:', err)
        setError('An unexpected error occurred while fetching addresses')
        toast.error('An unexpected error occurred while fetching addresses')
      } finally {
        setLoading(false)
      }
    }

    fetchAddresses()
  }, [user, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return

    try {
      setSaving(true)
      
      const url = editingAddress 
        ? `/api/user/addresses?userId=${user.id}&addressId=${editingAddress}`
        : `/api/user/addresses?userId=${user.id}`
      
      const method = editingAddress ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          addressId: editingAddress,
          addressData: formData
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(editingAddress ? 'Address updated successfully' : 'Address added successfully')
        
        // Refetch addresses to get updated data
        const refreshResponse = await fetch(`/api/user/addresses?userId=${user.id}`)
        const refreshData = await refreshResponse.json()
        
        if (refreshData.success) {
          setAddresses(refreshData.data)
        }
        
        setShowForm(false)
        setEditingAddress(null)
        setFormData({
          type: 'Home',
          name: user.name || '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'UAE'
        })
      } else {
        toast.error(data.error || 'Failed to save address')
      }
    } catch (err) {
      console.error('Error saving address:', err)
      toast.error('Failed to save address')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (address: Address) => {
    setFormData({
      type: address.type,
      name: address.name,
      address: address.address,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country
    })
    setEditingAddress(address.id)
    setShowForm(true)
  }

  const handleDelete = async (addressId: string) => {
    if (!user) return
    
    if (!confirm('Are you sure you want to delete this address?')) {
      return
    }

    try {
      const response = await fetch(`/api/user/addresses?userId=${user.id}&addressId=${addressId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('Address deleted successfully')
        
        // Refetch addresses to get updated data
        const refreshResponse = await fetch(`/api/user/addresses?userId=${user.id}`)
        const refreshData = await refreshResponse.json()
        
        if (refreshData.success) {
          setAddresses(refreshData.data)
        }
      } else {
        toast.error(data.error || 'Failed to delete address')
      }
    } catch (err) {
      console.error('Error deleting address:', err)
      toast.error('Failed to delete address')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingAddress(null)
    setFormData({
      type: 'Home',
      name: user?.name || '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'UAE'
    })
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading your addresses...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-destructive mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/account">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Account
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                  <MapPin className="h-8 w-8 mr-3 text-primary" />
                  Saved Addresses
                </h1>
                <p className="text-muted-foreground">
                  Manage your shipping addresses for faster checkout
                </p>
              </div>
              <Button 
                onClick={() => setShowForm(true)}
                className="hidden sm:flex"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            </div>
          </div>

          {/* Add Address Button for Mobile */}
          <div className="sm:hidden mb-6">
            <Button 
              onClick={() => setShowForm(true)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Address
            </Button>
          </div>

          {/* Address Form */}
          {showForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </CardTitle>
                <CardDescription>
                  {editingAddress ? 'Update your address information' : 'Add a new shipping address'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Address Type</Label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-input rounded-md bg-background"
                      >
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="state">State/Emirate</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="country">Country</Label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-input rounded-md bg-background"
                    >
                      <option value="UAE">United Arab Emirates</option>
                      <option value="SA">Saudi Arabia</option>
                      <option value="KW">Kuwait</option>
                      <option value="QA">Qatar</option>
                      <option value="BH">Bahrain</option>
                      <option value="OM">Oman</option>
                    </select>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={saving}>
                      {saving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      {saving ? 'Saving...' : (editingAddress ? 'Update Address' : 'Add Address')}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Addresses List */}
          {addresses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((address) => (
                <Card key={address.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {address.type === 'Home' ? (
                          <Home className="h-5 w-5 text-primary" />
                        ) : address.type === 'Work' ? (
                          <Building className="h-5 w-5 text-primary" />
                        ) : (
                          <MapPin className="h-5 w-5 text-primary" />
                        )}
                        <CardTitle className="text-lg">{address.type}</CardTitle>
                      </div>
                      {address.isDefault && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium">{address.name}</p>
                      <p className="text-muted-foreground">{address.address}</p>
                      <p className="text-muted-foreground">
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                      <p className="text-muted-foreground">{address.country}</p>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(address)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(address.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No addresses saved</h3>
                <p className="text-muted-foreground mb-6">
                  Add your first address to make checkout faster and easier.
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Address
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
