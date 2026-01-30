"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { ArrowLeft, Save, Loader2, Plus, Info, Layout, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { ImageUpload } from "@/components/ui/image-upload"
import { ProductAttributes } from "@/components/ui/product-attributes"
import { formatPrice } from "@/lib/utils"

interface Category {
  _id: string
  name: string
  slug: string
}

interface ProductAttribute {
  name: string
  value: string
  type: 'color' | 'size' | 'text' | 'number'
}

const PREDEFINED_WASHING_INSTRUCTIONS = [
  "Machine wash cold, gentle cycle. Tumble dry low. Do not bleach.",
  "Hand wash with mild detergent. Do not wring. Dry flat in shade.",
  "Professional dry clean only.",
  "Machine wash warm (40°C). Iron at medium temperature. Wash dark colors separately.",
  "Cool iron if needed. Do not tumble dry. Do not dry clean.",
  "Machine wash at 60°C. Suitable for industrial laundering.",
  "Do not wash. Sponge clean only."
]

const PRODUCT_CATEGORIES: Record<string, string[]> = {
  "Towel": ["Bath Towel", "Hand Towel", "Face Towel", "Pool Towel", "SPA Bath Towel", "SPA Hand Towel", "SPA Face Towel"],
  "Duvet": ["Single Duvet", "Double Duvet (Queen Size)", "Double Duvet (King Size)", "Single Duvet Cover", "Double Duvet Cover"],
  "Pillow Cover": ["Large Pillow Case", "Medium Pillow Case", "XXXLarge Pillow Case"],
  "Mattress": ["Mattress Protector Single", "Mattress Protector Double", "Mattress Single"],
  "Bed Runner": ["Bed Runner Single", "Bed Runner Queen & King Size"],
  "Bed Sheet": ["Bedsheet Single Bed", "Bedsheet King Size", "Bedsheet Queen Size"],
  "Chair": ["Chair Cover "]
}

export default function AddProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [availableCategories, setAvailableCategories] = useState<Record<string, string[]>>(PRODUCT_CATEGORIES)
  const [isAddingNewName, setIsAddingNewName] = useState(false)
  const [isAddingNewSubCategory, setIsAddingNewSubCategory] = useState(false)
  const [isAddingNewCollection, setIsAddingNewCollection] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState("")
  const [attributes, setAttributes] = useState<ProductAttribute[]>([])
  const [currentStep, setCurrentStep] = useState(1)
  const [selectKey, setSelectKey] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subCategory: "",
    stock: "",
    sku: "",
    image: "",
    isBestSeller: false,
    isNewProduct: false,
    rating: "4.5",
    businessType: "BOTH",
    washingInstructions: [] as string[]
  })

  const totalSteps = 4

  const nextStep = () => {
    if (currentStep < totalSteps) {
      // Basic validation for Step 1
      if (currentStep === 1) {
        if (!formData.name || !formData.category || !formData.description) {
          toast.error("Please fill in Name, Collection and Description")
          return
        }
      }
      // Validation for Step 2
      if (currentStep === 2) {
        if (!formData.price || !formData.stock) {
          toast.error("Please fill in Price and Stock")
          return
        }
      }
      setCurrentStep(prev => prev + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      window.scrollTo(0, 0)
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?active=true')
        const data = await response.json()

        if (data.success) {
          setCategories(data.data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    const fetchProductMetadata = async () => {
      try {
        const response = await fetch('/api/products/metadata')
        const data = await response.json()

        if (data.success) {
          // Merge dynamic data with predefined constants
          // We use a functional update or just a variable since PRODUCT_CATEGORIES is const
          // But since PRODUCT_CATEGORIES is const outside component, we need a state to hold the *combined* list
        }
        return data.data
      } catch (error) {
        console.error('Error fetching product metadata:', error)
        return {}
      }
    }

    const initializeData = async () => {
      await fetchCategories()
      const dynamicData = await fetchProductMetadata()

      // Merge logic: Start with predefined
      const combined = { ...PRODUCT_CATEGORIES }

      // Merge dynamic
      if (dynamicData) {
        Object.keys(dynamicData).forEach(cat => {
          if (!combined[cat]) {
            combined[cat] = dynamicData[cat]
          } else {
            // Add unique names that aren't in predefined
            const existing = new Set(combined[cat])
            dynamicData[cat].forEach((name: string) => existing.add(name))
            combined[cat] = Array.from(existing)
          }
        })
      }
      setAvailableCategories(combined)
    }

    initializeData()
  }, [])

  const addWashingInstruction = (instruction: string) => {
    if (!instruction) return
    console.log(`[UI:Add] Adding instruction: "${instruction}"`)
    if (!formData.washingInstructions.includes(instruction)) {
      setFormData(prev => ({
        ...prev,
        washingInstructions: [...prev.washingInstructions, instruction]
      }))
      setSelectKey(prev => prev + 1)
      toast.success(`Added instruction: ${instruction.substring(0, 20)}...`)
    } else {
      console.log(`[UI:Add] Instruction already exists.`)
    }
  }

  const removeWashingInstruction = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      washingInstructions: prev.washingInstructions.filter((_, i) => i !== idx)
    }))
  }

  const handleManualInstruction = (instruction: string) => {
    if (!instruction.trim()) return
    addWashingInstruction(instruction.trim())
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    if (field === 'category') {
      const category = categories.find(c => c.name === value)
      if (category) {
        setSelectedCategoryId(category._id)
      } else {
        setSelectedCategoryId("")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Final Validation
    if (!formData.name || !formData.price || !formData.category || !formData.stock || !formData.description) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)

    try {
      // Generate SKU if missing
      let finalSku = formData.sku
      if (!finalSku) {
        finalSku = `PROD-${Date.now()}`
      }

      const images = formData.image ? [formData.image] : []

      let productData = {
        ...formData,
        sku: finalSku,
        category: selectedCategoryId, // Will be updated if new collection created below
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        rating: parseFloat(formData.rating),
        images: images,
        attributes: attributes.filter(attr => attr.name && attr.value),
        washingInstructions: formData.washingInstructions
      }

      console.log('[UI:Add] Final product data being sent to API:', productData)

      // If adding a new collection that doesn't exist yet/has no ID
      if (isAddingNewCollection && formData.category && !selectedCategoryId) {
        try {
          console.log(`[UI:Add] Creating new collection: ${formData.category}`)
          const catResponse = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: formData.category,
              slug: formData.category.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
              isActive: true
            })
          })
          const catData = await catResponse.json()
          if (catData.success && catData.data._id) {
            productData.category = catData.data._id
          } else {
            throw new Error(catData.error || "Failed to create new collection")
          }
        } catch (err: any) {
          toast.error(err.message)
          setLoading(false)
          return
        }
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Product created successfully!")
        router.push('/admin/products')
      } else {
        toast.error(data.error || "Failed to create product")
      }
    } catch (error) {
      console.error('Error creating product:', error)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">Add New Product</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Create a new product listing</p>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 sm:h-2 w-8 sm:w-12 rounded-full transition-all duration-300 ${currentStep > i + 1
                ? "bg-primary"
                : currentStep === i + 1
                  ? "bg-primary w-12 sm:w-20 shadow-sm"
                  : "bg-muted"
                }`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg border border-border/50">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
            {currentStep}
          </div>
          <span className="font-bold text-xl">
            {currentStep === 1 && "Basic Information"}
            {currentStep === 2 && "Pricing & Inventory"}
            {currentStep === 3 && "Media & Attributes"}
            {currentStep === 4 && "Settings & Review"}
          </span>
        </div>
        <span className="text-sm text-muted-foreground font-medium">Step {currentStep} of {totalSteps}</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Product Information</CardTitle>
                  <CardDescription>Basic information about the product</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subCategory" className="text-base font-bold">Product Category *</Label>
                      {!isAddingNewSubCategory ? (
                        <div className="space-y-2">
                          <select
                            id="subCategory"
                            value={formData.subCategory}
                            onChange={(e) => {
                              if (e.target.value === "ADD_NEW_SUB_CATEGORY") {
                                setIsAddingNewSubCategory(true)
                                setFormData(prev => ({ ...prev, subCategory: "", name: "" })) // Clear name when category changes
                              } else {
                                handleInputChange('subCategory', e.target.value)
                                setFormData(prev => ({ ...prev, name: "" })) // Clear name when category changes
                              }
                            }}
                            className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            required
                          >
                            <option value="">Select a category</option>
                            {Object.keys(availableCategories).map((cat, idx) => (
                              <option key={idx} value={cat}>{cat}</option>
                            ))}
                            <option value="ADD_NEW_SUB_CATEGORY" className="font-bold text-primary italic">+ Add New Category</option>
                          </select>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              id="subCategory"
                              value={formData.subCategory}
                              onChange={(e) => handleInputChange('subCategory', e.target.value)}
                              placeholder="Enter new category"
                              className="flex-1"
                              autoFocus
                              required={isAddingNewSubCategory}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setIsAddingNewSubCategory(false)
                                setFormData(prev => ({ ...prev, subCategory: "" }))
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {(formData.subCategory && (availableCategories[formData.subCategory] || isAddingNewSubCategory)) && (
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-base font-bold">Product Name *</Label>
                        {!isAddingNewName ? (
                          <div className="space-y-2">
                            <select
                              id="name"
                              value={formData.name}
                              onChange={(e) => {
                                if (e.target.value === "ADD_NEW_PRODUCT_NAME") {
                                  setIsAddingNewName(true)
                                  setFormData(prev => ({ ...prev, name: "" }))
                                } else {
                                  handleInputChange('name', e.target.value)
                                }
                              }}
                              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                              required
                            >
                              <option value="">Select a product name</option>
                              {/* If Custom Category, we don't have predefined names, so start empty or rely on custom add */}
                              {availableCategories[formData.subCategory]?.map((name, idx) => (
                                <option key={idx} value={name}>{name}</option>
                              ))}
                              <option value="ADD_NEW_PRODUCT_NAME" className="font-bold text-primary italic">+ Add New Product Name</option>
                            </select>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Enter specific product name"
                                className="flex-1"
                                required={isAddingNewName}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setIsAddingNewName(false)
                                  setFormData(prev => ({ ...prev, name: "" }))
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Show manual input if it's a new product name OR if user selected Add New Category */}
                    {(isAddingNewName || (isAddingNewSubCategory)) && (
                      null /* Cleaned up redundant manual input block since inputs are inline now, or simplistic fallback if needed. The above blocks handle inputs inline. */
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="sku" className="text-base font-bold">SKU</Label>
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => handleInputChange('sku', e.target.value)}
                        placeholder="Product SKU (Optional)"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-base font-bold">Collection *</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => {
                        if (e.target.value === "ADD_NEW_COLLECTION") {
                          setIsAddingNewCollection(true)
                          setFormData(prev => ({ ...prev, category: "" }))
                          setSelectedCategoryId("")
                        } else {
                          handleInputChange('category', e.target.value)
                        }
                      }}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      required
                    >
                      <option value="">Select a collection</option>
                      {categories.map(category => (
                        <option key={category._id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                      <option value="ADD_NEW_COLLECTION" className="font-bold text-primary italic">+ Add New Collection</option>
                    </select>
                    {isAddingNewCollection && (
                      <div className="mt-2 flex gap-2">
                        <Input
                          value={formData.category}
                          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                          placeholder="Enter new collection name"
                          className="flex-1"
                          autoFocus
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsAddingNewCollection(false)
                            setFormData(prev => ({ ...prev, category: "" }))
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessType" className="text-base font-bold">Business Type *</Label>
                    <Select
                      value={formData.businessType}
                      onValueChange={(val) => handleInputChange('businessType', val)}
                    >
                      <SelectTrigger id="businessType" className="w-full bg-background border px-3 py-2 rounded-md">
                        <SelectValue placeholder="Select Business Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BOTH">Both B2B & B2C</SelectItem>
                        <SelectItem value="B2B">B2B Only</SelectItem>
                        <SelectItem value="B2C">B2C Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-base font-bold">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter product description"
                      className="h-32"
                      required
                    />
                  </div>
                </CardContent>
                <div className="p-6 pt-0 flex justify-end">
                  <Button type="button" onClick={nextStep} className="px-8 h-11">
                    Next: Pricing & Stock
                  </Button>
                </div>
              </Card>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Pricing & Stock</CardTitle>
                  <CardDescription>Set the price and inventory levels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-base font-bold">Price *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock" className="text-base font-bold">Stock Quantity *</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => handleInputChange('stock', e.target.value)}
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rating" className="text-base font-bold">Rating</Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => handleInputChange('rating', e.target.value)}
                      placeholder="4.5"
                    />
                    <p className="text-xs text-muted-foreground">Initial product rating (0-5)</p>
                  </div>
                </CardContent>
                <div className="p-6 pt-0 flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep} className="h-11">
                    Back: Basic Info
                  </Button>
                  <Button type="button" onClick={nextStep} className="px-8 h-11">
                    Next: Media & Attributes
                  </Button>
                </div>
              </Card>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">Product Media</CardTitle>
                    <CardDescription>Upload product images</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label className="text-base font-bold">Product Image</Label>
                      <ImageUpload
                        value={formData.image}
                        onChange={(url) => handleInputChange('image', url)}
                        onRemove={() => handleInputChange('image', '')}
                      />
                    </div>
                  </CardContent>
                </Card>

                <ProductAttributes
                  categoryId={selectedCategoryId}
                  attributes={attributes}
                  onChange={setAttributes}
                />

                <div className="flex justify-between items-center bg-white p-6 rounded-lg border shadow-sm">
                  <Button type="button" variant="outline" onClick={prevStep} className="h-11">
                    Back: Pricing & Stock
                  </Button>
                  <Button type="button" onClick={nextStep} className="px-8 h-11">
                    Next: Final Review
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">Visibility & Tags</CardTitle>
                    <CardDescription>Configure product settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* <div className="flex items-center justify-between p-5 border rounded-xl bg-white shadow-sm hover:border-primary/30 transition-all duration-300">
                      <div className="space-y-1">
                        <Label className="text-base font-bold text-[#151b2a]">Best Seller</Label>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Mark as best selling product to highlight on home page
                        </p>
                      </div>
                      <Switch
                        checked={formData.isBestSeller}
                        onCheckedChange={(checked) => handleInputChange('isBestSeller', checked)}
                        className="data-[state=unchecked]:bg-slate-300 border-2 border-transparent transition-colors shadow-inner"
                      />
                    </div> */}

                    <div className="flex items-center justify-between p-5 border rounded-xl bg-white shadow-sm hover:border-primary/30 transition-all duration-300">
                      <div className="space-y-1">
                        <Label className="text-base font-bold text-navy-900">New Product</Label>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Mark as new arrival to show "New" badge
                        </p>
                      </div>
                      <Switch
                        checked={formData.isNewProduct}
                        onCheckedChange={(checked) => handleInputChange('isNewProduct', checked)}
                        className="data-[state=unchecked]:bg-slate-300 border-2 border-transparent transition-colors shadow-inner"
                      />
                    </div>

                    <Card className="border-primary/20 bg-primary/[0.02]">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                          <span>🧼</span> Washing Instructions
                        </CardTitle>
                        <CardDescription>Add one or more care instructions</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <Label className="text-base font-bold">Step 1: Choose from Templates</Label>
                          <Select
                            key={selectKey}
                            onValueChange={(val) => {
                              if (val !== "custom") {
                                addWashingInstruction(val)
                              }
                            }}
                          >
                            <SelectTrigger className="bg-white h-12 border-primary/20">
                              <SelectValue placeholder="Click to see standard instructions..." />
                            </SelectTrigger>
                            <SelectContent>
                              {PREDEFINED_WASHING_INSTRUCTIONS.map((instruction, idx) => (
                                <SelectItem key={idx} value={instruction}>
                                  {instruction}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-base font-bold">Step 2: Or Add Custom Instruction</Label>
                          <div className="flex gap-2">
                            <Input
                              id="customInstruction"
                              placeholder="Type your own instruction here..."
                              className="bg-white h-12 border-primary/20"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault()
                                  const input = e.currentTarget as HTMLInputElement
                                  handleManualInstruction(input.value)
                                  input.value = ""
                                }
                              }}
                            />
                            <Button
                              type="button"
                              className="h-12 px-6"
                              onClick={() => {
                                const input = document.getElementById('customInstruction') as HTMLInputElement
                                if (input.value) {
                                  handleManualInstruction(input.value)
                                  input.value = ""
                                }
                              }}
                            >
                              Add
                            </Button>
                          </div>
                        </div>

                        {formData.washingInstructions.length > 0 ? (
                          <div className="mt-6 space-y-3">
                            <Label className="text-sm font-extrabold text-primary uppercase tracking-wider">
                              Added Instructions ({formData.washingInstructions.length})
                            </Label>
                            <div className="space-y-2">
                              {formData.washingInstructions.map((inst, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between gap-4 bg-white border-l-4 border-l-primary border-y border-r border-primary/10 p-4 rounded-r-lg shadow-sm animate-in slide-in-from-left-2 duration-300"
                                >
                                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                                    {inst}
                                  </p>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeWashingInstruction(idx)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 shrink-0"
                                  >
                                    <Plus className="h-5 w-5 rotate-45" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-6 p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center text-center space-y-2 opacity-60">
                            <div className="text-2xl">🧼</div>
                            <p className="text-sm font-medium text-slate-500">No instructions added yet</p>
                            <p className="text-xs text-slate-400">Select a template or type above to add</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">Final Review</CardTitle>
                    <CardDescription>Check if everything is correct before adding</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Name</p>
                        <p className="font-semibold">{formData.name || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Category</p>
                        <p className="font-semibold">{formData.subCategory || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Collection</p>
                        <p className="font-semibold">{formData.category || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Price</p>
                        <p className="font-semibold">{formatPrice(parseFloat(formData.price) || 0)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Stock</p>
                        <p className="font-semibold">{formData.stock || "0"} units</p>
                      </div>
                      <div className="space-y-1 col-span-2 border-t pt-2">
                        <p className="text-muted-foreground">Washing Instructions</p>
                        <p className="font-semibold">{formData.washingInstructions.length} instructions added</p>
                      </div>
                    </div>
                  </CardContent>
                  <div className="p-6 pt-0 border-t mt-4 flex justify-between items-center bg-muted/5">
                    <Button type="button" variant="outline" onClick={prevStep} className="h-11">
                      Back: Media
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-primary hover:bg-primary/90 px-12 h-12 text-lg font-bold shadow-premium"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5 mr-2" />
                          Confirm & Add Product
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Preview</CardTitle>
                <CardDescription>How your product will appear</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 space-y-4 shadow-sm bg-white">
                  <div className="w-full aspect-square bg-muted rounded-md flex items-center justify-center overflow-hidden border">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Product preview"
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center space-y-2 opacity-50">
                        <Save className="h-8 w-8 text-muted-foreground" />
                        <span className="text-xs font-medium">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                        {formData.category || "Collection"}
                      </p>
                      <div className="flex space-x-1">
                        {/* {formData.isBestSeller && (
                          <span className="px-1.5 py-0.5 bg-orange-100 text-orange-800 text-[8px] font-bold rounded uppercase">
                            Bestseller
                          </span>
                        )} */}
                        {formData.isNewProduct && (
                          <span className="px-1.5 py-0.5 bg-green-100 text-green-800 text-[8px] font-bold rounded uppercase">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                    <h3 className="font-serif text-lg font-bold line-clamp-1">
                      {formData.name || "Product Name"}
                    </h3>
                    <p className="font-bold text-lg text-primary">
                      {formatPrice(parseFloat(formData.price) || 0)}
                    </p>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <div key={s} className={`h-3 w-3 ${s <= Math.floor(parseFloat(formData.rating)) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`}>
                          ★
                        </div>
                      ))}
                      <span className="text-[10px] text-muted-foreground ml-1">({formData.rating})</span>
                    </div>
                  </div>
                </div>
                {/* Sidebar buttons removed in favor of in-card navigation */}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
