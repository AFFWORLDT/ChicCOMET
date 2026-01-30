"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Loader2,
  MoreHorizontal
} from "lucide-react"
import { toast } from "sonner"
import { normalizeAdminCategory, normalizeApiResponse } from "@/lib/admin-utils"
import { fetchWithRetry } from "@/lib/admin-fetch-utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  isActive: boolean
  sortOrder: number
  attributes: {
    name: string
    type: 'color' | 'size' | 'text' | 'number' | 'select'
    options?: string[]
    required?: boolean
  }[]
  createdAt: string
  updatedAt: string
}

export default function CategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])

  const fetchCategories = async () => {
    setLoading(true)
    setError(null)
    
    const result = await fetchWithRetry(`/api/categories?t=${Date.now()}`)
    
    if (result.success && result.data) {
      try {
        // result.data is the full API response { success: true, data: [...] }
        // Extract the actual data array
        const categoriesData = Array.isArray(result.data.data) 
          ? result.data.data 
          : Array.isArray(result.data) 
            ? result.data 
            : []
        const normalized = normalizeApiResponse<Category>({ success: true, data: categoriesData }, 'data')
        
        if (normalized.success) {
          // Normalize all categories with error handling
          const normalizedCategories = (normalized.data || [])
            .map(cat => {
              try {
                return normalizeAdminCategory(cat)
              } catch (err) {
                console.warn('Error normalizing category:', err, cat)
                return null
              }
            })
            .filter(cat => cat !== null) as Category[]
          
          setCategories(normalizedCategories)
          setFilteredCategories(normalizedCategories)
        } else {
          setError(normalized.error || "Failed to fetch categories")
          setCategories([])
          setFilteredCategories([])
        }
      } catch (err) {
        console.error('Error processing categories:', err)
        setError('Error processing categories data')
        setCategories([])
        setFilteredCategories([])
      }
    } else {
      setError(result.error || "Failed to fetch categories")
      setCategories([])
      setFilteredCategories([])
    }
    
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (!Array.isArray(categories)) {
      setFilteredCategories([])
      return
    }
    
    const filtered = categories.filter(category =>
      category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category?.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCategories(filtered)
  }, [searchTerm, categories])

  const handleDelete = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Category deleted successfully")
        fetchCategories()
      } else {
        toast.error(data.error || "Failed to delete category")
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error("Error deleting category")
    }
  }

  const toggleStatus = async (categoryId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`Category ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
        fetchCategories()
      } else {
        toast.error(data.error || "Failed to update category")
      }
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error("Error updating category")
    }
  }

  const stats = {
    total: categories?.length || 0,
    active: categories?.filter(cat => cat?.isActive).length || 0,
    inactive: categories?.filter(cat => !cat?.isActive).length || 0,
    withAttributes: categories?.filter(cat => cat?.attributes && Array.isArray(cat.attributes) && cat.attributes.length > 0).length || 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Collections</h1>
          <p className="text-muted-foreground">Manage your product collections</p>
        </div>
        <Button onClick={() => router.push('/admin/categories/add')} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Collection
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Attributes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.withAttributes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>Collection List</CardTitle>
          <CardDescription>
            Showing {filteredCategories.length} of {categories.length} collections
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading collections...
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No collections found</p>
              <Button onClick={() => router.push('/admin/categories/add')}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Collection
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCategories.map((category) => (
                <div key={category._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      {category.image ? (
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-muted-foreground text-lg font-bold">
                          {category.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {category.description || "No description"}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={category.isActive ? "default" : "secondary"}>
                          {category.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">
                          {category.attributes && Array.isArray(category.attributes) ? category.attributes.length : 0} attributes
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Sort: {category.sortOrder}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/admin/categories/${category._id}`)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/admin/categories/${category._id}/edit`)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleStatus(category._id, category.isActive)}>
                          {category.isActive ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(category._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
