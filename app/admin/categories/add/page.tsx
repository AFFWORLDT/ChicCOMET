"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface CategoryAttribute {
  name: string
  type: 'color' | 'size' | 'text' | 'number' | 'select'
  options: string[]
  required: boolean
}

export default function AddCategoryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [attributes, setAttributes] = useState<CategoryAttribute[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    isActive: true,
    sortOrder: 0
  })

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addAttribute = () => {
    setAttributes(prev => [...prev, {
      name: "",
      type: 'text',
      options: [],
      required: false
    }])
  }

  const updateAttribute = (index: number, field: keyof CategoryAttribute, value: any) => {
    setAttributes(prev => prev.map((attr, i) => 
      i === index ? { ...attr, [field]: value } : attr
    ))
  }

  const removeAttribute = (index: number) => {
    setAttributes(prev => prev.filter((_, i) => i !== index))
  }

  const addOption = (attributeIndex: number) => {
    setAttributes(prev => prev.map((attr, i) => 
      i === attributeIndex 
        ? { ...attr, options: [...attr.options, ""] }
        : attr
    ))
  }

  const updateOption = (attributeIndex: number, optionIndex: number, value: string) => {
    setAttributes(prev => prev.map((attr, i) => 
      i === attributeIndex 
        ? { 
            ...attr, 
            options: attr.options.map((opt, j) => j === optionIndex ? value : opt)
          }
        : attr
    ))
  }

  const removeOption = (attributeIndex: number, optionIndex: number) => {
    setAttributes(prev => prev.map((attr, i) => 
      i === attributeIndex 
        ? { 
            ...attr, 
            options: attr.options.filter((_, j) => j !== optionIndex)
          }
        : attr
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name.trim()) {
      toast.error("Category name is required")
      return
    }

    // Validate attributes
    const validAttributes = attributes.filter(attr => {
      if (!attr.name.trim()) return false
      if (attr.type === 'select' && attr.options.length === 0) return false
      if (attr.type === 'select' && attr.options.some(opt => !opt.trim())) return false
      return true
    })

    setLoading(true)

    try {
      const categoryData = {
        ...formData,
        attributes: validAttributes
      }

      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Category added successfully!")
        router.push('/admin/categories')
      } else {
        toast.error(data.error || "Failed to add category")
      }
    } catch (error) {
      console.error('Error adding category:', error)
      toast.error("Error adding category")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Category</h1>
          <p className="text-muted-foreground">Create a new product category</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Category Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Information</CardTitle>
                <CardDescription>
                  Basic information about the category
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter category name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter category description"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Category Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sortOrder">Sort Order</Label>
                    <Input
                      id="sortOrder"
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => handleInputChange('sortOrder', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Active Status</Label>
                      <p className="text-sm text-muted-foreground">
                        Category will be visible to users
                      </p>
                    </div>
                    <Switch
                      checked={formData.isActive}
                      onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Attributes */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Category Attributes</CardTitle>
                    <CardDescription>
                      Define attributes that products in this category can have
                    </CardDescription>
                  </div>
                  <Button type="button" onClick={addAttribute} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Attribute
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {attributes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No attributes added yet</p>
                    <p className="text-sm">Click "Add Attribute" to get started</p>
                  </div>
                ) : (
                  attributes.map((attribute, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Attribute {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAttribute(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Attribute Name *</Label>
                          <Input
                            value={attribute.name}
                            onChange={(e) => updateAttribute(index, 'name', e.target.value)}
                            placeholder="e.g., Color, Size"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Attribute Type *</Label>
                          <select
                            value={attribute.type}
                            onChange={(e) => updateAttribute(index, 'type', e.target.value)}
                            className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                          >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="color">Color</option>
                            <option value="size">Size</option>
                            <option value="select">Select (Dropdown)</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Required</Label>
                            <p className="text-sm text-muted-foreground">
                              Must be filled
                            </p>
                          </div>
                          <Switch
                            checked={attribute.required}
                            onCheckedChange={(checked) => updateAttribute(index, 'required', checked)}
                          />
                        </div>
                      </div>

                      {/* Options for select type */}
                      {attribute.type === 'select' && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Options</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addOption(index)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Option
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {attribute.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center space-x-2">
                                <Input
                                  value={option}
                                  onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                                  placeholder={`Option ${optionIndex + 1}`}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeOption(index, optionIndex)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Category Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  How your category will appear
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="w-full h-24 bg-muted rounded-md flex items-center justify-center">
                    {formData.image ? (
                      <img 
                        src={formData.image} 
                        alt="Category preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-muted-foreground">
                        {formData.name ? formData.name.charAt(0).toUpperCase() : "C"}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {formData.name || "Category Name"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {formData.description || "No description"}
                    </p>
                    <div className="flex space-x-2 mt-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        formData.isActive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {formData.isActive ? "Active" : "Inactive"}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {attributes.length} attributes
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Add Category
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
