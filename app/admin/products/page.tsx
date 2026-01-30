"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  Loader2,
  AlertCircle,
  Upload,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { normalizeAdminProduct, normalizeApiResponse, getCategoryName } from "@/lib/admin-utils"
import { fetchWithRetry } from "@/lib/admin-fetch-utils"

interface Product {
  _id: string
  id: string
  name: string
  description: string
  price: number
  category: string | { _id: string; name: string }
  stock: number
  sku: string
  image: string
  images?: string[]
  isBestSeller: boolean
  isNewProduct: boolean
  rating: number
  status: string
  createdAt: string
  updatedAt: string
  attributes?: Array<{ name: string; value: string }>
}

interface ProductsResponse {
  success: boolean
  data: Product[]
  total: number
  page: number
  pages: number
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-green-100 text-green-800"
    case "out_of_stock": return "bg-red-100 text-red-800"
    case "inactive": return "bg-gray-100 text-gray-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "active": return "Active"
    case "out_of_stock": return "Out of Stock"
    case "inactive": return "Inactive"
    default: return "Unknown"
  }
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [categories, setCategories] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    outOfStock: 0,
    totalValue: 0
  })
  const router = useRouter()

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    
    const params = new URLSearchParams()
    if (searchTerm) params.append('search', searchTerm)
    if (selectedCategory !== 'all') params.append('category', selectedCategory)
    params.append('page', currentPage.toString())
    params.append('limit', itemsPerPage.toString())
    
    // Add noCache parameter for admin to bypass cache
    params.append('noCache', 'true')
    
    const result = await fetchWithRetry<ProductsResponse>(`/api/products?${params.toString()}`)
    
    if (result.success && result.data) {
      try {
        // result.data is the full API response { success: true, data: [...], total: ..., page: ..., pages: ... }
        const productsData = Array.isArray(result.data.data) ? result.data.data : result.data.data || []
        const normalized = normalizeApiResponse<Product>({ success: true, data: productsData, total: result.data.total, page: result.data.page, pages: result.data.pages }, 'data')
        
        if (normalized.success) {
          // Normalize all products with error handling
          const normalizedProducts = (normalized.data || [])
            .map(p => {
              try {
                return normalizeAdminProduct(p)
              } catch (err) {
                console.warn('Error normalizing product:', err, p)
                return null
              }
            })
            .filter(p => p !== null) as Product[]
          
          setProducts(normalizedProducts)
          setTotalProducts(result.data.total || normalized.total || 0)
          setTotalPages(result.data.pages || normalized.pages || Math.ceil((result.data.total || normalized.total || 0) / itemsPerPage))
          
          // Extract unique categories from current page data with error handling
          try {
            const uniqueCategories = Array.from(new Set(normalizedProducts.map(p => getCategoryName(p)).filter(Boolean)))
            setCategories(uniqueCategories)
          } catch (err) {
            console.warn('Error extracting categories:', err)
            setCategories([])
          }
        } else {
          setError(normalized.error || "Failed to fetch products")
          setProducts([])
        }
      } catch (err) {
        console.error('Error processing products:', err)
        setError("Error processing products data")
        setProducts([])
      }
    } else {
      setError(result.error || "Failed to fetch products")
      setProducts([])
    }
    
    setLoading(false)
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/products/stats')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success && data.data) {
        setStats({
          total: data.data.totalProducts || 0,
          active: data.data.activeProducts || 0,
          outOfStock: data.data.outOfStockProducts || 0,
          totalValue: data.data.totalStockValue || 0
        })
        
        // Set categories from stats API with error handling
        try {
          const categoryNames = (data.data.categories || [])
            .map((cat: any) => cat?.name)
            .filter((name: any) => name && typeof name === 'string')
          setCategories(categoryNames)
        } catch (err) {
          console.warn('Error extracting categories from stats:', err)
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Don't show error toast for stats, just log it
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?active=true')
      const data = await response.json()
      if (data.success) {
        setCategories(data.data.map((cat: any) => cat.name))
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success("Product deleted successfully")
        fetchStats() // Refresh statistics
        fetchProducts() // Refresh the list
      } else {
        toast.error("Failed to delete product")
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error("Error deleting product")
    }
  }

  useEffect(() => {
    // Initialize page from URL parameters
    const pageFromUrl = searchParams.get('page')
    if (pageFromUrl) {
      setCurrentPage(parseInt(pageFromUrl))
    }
    
    fetchStats() // Fetch overall statistics
    fetchCategories() // Fetch categories
  }, [searchParams])

  useEffect(() => {
    fetchProducts() // Fetch paginated products
  }, [searchTerm, selectedCategory, currentPage, itemsPerPage])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    setCurrentPage(1) // Reset to first page when changing category
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value))
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleJumpToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Products</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your product inventory</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            variant="outline"
            className="w-full sm:w-auto justify-center sm:justify-start"
            onClick={() => router.push('/admin/products/bulk-import')}
          >
            <Upload className="h-4 w-4 mr-2" />
            Bulk Import
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 w-full sm:w-auto justify-center sm:justify-start"
            onClick={() => router.push('/admin/products/add')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Active products in inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <Package className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.outOfStock / stats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              AED {stats.totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Current inventory value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, description, or SKU..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product List</CardTitle>
              <CardDescription>
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Items per page:</span>
              <select
                value={itemsPerPage.toString()}
                onChange={(e) => handleItemsPerPageChange(e.target.value)}
                className="px-2 py-1 border border-input bg-background rounded text-sm"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding your first product.'
                }
              </p>
              {!searchTerm && selectedCategory === 'all' && (
                <Button onClick={() => router.push('/admin/products/add')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              )}
            </div>
          ) : (
            <>
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getCategoryName(product)}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">AED {product.price}</TableCell>
                    <TableCell>
                      <span className={product.stock === 0 ? "text-red-600 font-medium" : ""}>
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(product.stock > 0 ? "active" : "out_of_stock")}>
                        {getStatusText(product.stock > 0 ? "active" : "out_of_stock")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/admin/products/${product._id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/admin/products/${product._id}/edit?page=${currentPage}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => deleteProduct(product._id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                {/* Page Info */}
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages} ({totalProducts} total products)
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center space-x-2">
                  {/* First Page */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>

                  {/* Previous Page */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {getVisiblePages().map((page, index) => (
                      page === '...' ? (
                        <span key={index} className="px-2 py-1 text-muted-foreground">...</span>
                      ) : (
                        <Button
                          key={index}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page as number)}
                          className={currentPage === page ? "bg-primary text-white" : ""}
                        >
                          {page}
                        </Button>
                      )
                    ))}
                  </div>

                  {/* Next Page */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  {/* Last Page */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Jump to Page */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Go to:</span>
                  <Input
                    type="number"
                    min="1"
                    max={totalPages}
                    placeholder="Page"
                    className="w-20"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const page = parseInt((e.target as HTMLInputElement).value)
                        if (page >= 1 && page <= totalPages) {
                          handleJumpToPage(page)
                          ;(e.target as HTMLInputElement).value = ''
                        }
                      }
                    }}
                  />
                </div>
              </div>
            )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}