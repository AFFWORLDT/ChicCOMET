"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Loader2, Calendar, Tag } from "lucide-react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CategoryAttribute {
  name: string
  type: 'color' | 'size' | 'text' | 'number' | 'select'
  options: string[]
  required: boolean
}

interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  isActive: boolean
  sortOrder: number
  attributes: CategoryAttribute[]
  createdAt: string
  updatedAt: string
}

export default function ViewCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchCategory = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/categories/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        setCategory(data.data)
      } else {
        toast.error("Failed to fetch category")
        router.push('/admin/categories')
      }
    } catch (error) {
      console.error('Error fetching category:', error)
      toast.error("Error fetching category")
      router.push('/admin/categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategory()
  }, [params.id])

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/categories/${params.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Category deleted successfully")
        router.push('/admin/categories')
      } else {
        toast.error(data.error || "Failed to delete category")
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error("Error deleting category")
    }
  }

  const toggleStatus = async () => {
    if (!category) return

    try {
      const response = await fetch(`/api/categories/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !category.isActive }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`Category ${!category.isActive ? 'activated' : 'deactivated'} successfully`)
        fetchCategory()
      } else {
        toast.error(data.error || "Failed to update category")
      }
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error("Error updating category")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading category...
      </div>
    )
  }

  if (!category) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">Category not found</p>
        <Button onClick={() => router.push('/admin/categories')}>
          Back to Categories
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <p className="text-muted-foreground">Category Details</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/admin/categories/${category._id}/edit`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Category
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleStatus}>
                {category.isActive ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Category
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                  {category.image ? (
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-muted-foreground text-2xl font-bold">
                      {category.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{category.name}</h2>
                  <p className="text-muted-foreground">Slug: {category.slug}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant={category.isActive ? "default" : "secondary"}>
                      {category.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">
                      Sort Order: {category.sortOrder}
                    </Badge>
                  </div>
                </div>
              </div>

              {category.description && (
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(category.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attributes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Tag className="h-5 w-5" />
                <span>Category Attributes</span>
              </CardTitle>
              <CardDescription>
                Attributes that products in this category can have
              </CardDescription>
            </CardHeader>
            <CardContent>
              {category.attributes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No attributes defined for this category</p>
                  <p className="text-sm">Edit the category to add attributes</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {category.attributes.map((attribute, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{attribute.name}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{attribute.type}</Badge>
                          {attribute.required && (
                            <Badge variant="destructive">Required</Badge>
                          )}
                        </div>
                      </div>
                      
                      {attribute.type === 'select' && attribute.options.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Options:</p>
                          <div className="flex flex-wrap gap-2">
                            {attribute.options.map((option, optionIndex) => (
                              <Badge key={optionIndex} variant="secondary">
                                {option}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full" 
                onClick={() => router.push(`/admin/categories/${category._id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Category
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={toggleStatus}
              >
                {category.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/admin/products?category=' + category.name)}
              >
                View Products
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Attributes</span>
                <span className="font-medium">{category.attributes.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={category.isActive ? "default" : "secondary"}>
                  {category.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sort Order</span>
                <span className="font-medium">{category.sortOrder}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
