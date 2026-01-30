/**
 * Admin Utilities - Ensures admin panel data is always valid
 * Prevents errors from missing or malformed data
 */

/**
 * Normalizes product data for admin panel
 */
export function normalizeAdminProduct(product: any) {
  if (!product) {
    return null
  }

  // Normalize category
  const category = product.category
    ? (typeof product.category === 'string'
      ? { _id: product.category, name: product.category }
      : {
        _id: product.category._id || product.category.id || product.category,
        name: product.category.name || 'Unknown'
      })
    : { _id: '', name: 'Unknown' }

  // Normalize images
  const images = Array.isArray(product.images)
    ? product.images.filter((img: string) => img && typeof img === 'string')
    : product.image
      ? [product.image]
      : []

  return {
    _id: product._id || product.id || '',
    id: product._id || product.id || '',
    name: product.name || 'Unnamed Product',
    description: product.description || '',
    price: typeof product.price === 'number' && product.price >= 0 ? product.price : 0,
    originalPrice: typeof product.originalPrice === 'number' && product.originalPrice > 0 ? product.originalPrice : undefined,
    category: category,
    stock: typeof product.stock === 'number' ? product.stock : 0,
    sku: product.sku || `SKU-${product._id || Date.now()}`,
    image: product.image || images[0] || '/placeholder.jpg',
    images: images.length > 0 ? images : ['/placeholder.jpg'],
    isBestSeller: product.isBestSeller || false,
    isNewProduct: product.isNewProduct || false,
    rating: typeof product.rating === 'number' ? product.rating : 4.5,
    status: product.status || 'active',
    isActive: product.isActive !== undefined ? product.isActive : (product.status === 'active'),
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: product.updatedAt || new Date().toISOString(),
    washingInstructions: Array.isArray(product.washingInstructions) ? product.washingInstructions : (product.washingInstructions ? [product.washingInstructions] : []),
    attributes: Array.isArray(product.attributes) ? product.attributes : []
  }
}

/**
 * Normalizes order data for admin panel
 */
export function normalizeAdminOrder(order: any) {
  if (!order) {
    return null
  }

  // Normalize user
  const user = order.user
    ? (typeof order.user === 'string'
      ? { name: 'Unknown', email: order.user }
      : {
        name: order.user.name || 'Unknown User',
        email: order.user.email || 'unknown@example.com',
        id: order.user._id || order.user.id || order.user
      })
    : { name: 'Unknown User', email: 'unknown@example.com' }

  // Normalize items
  const items = Array.isArray(order.items)
    ? order.items.map((item: any) => ({
      product: {
        name: item.product?.name || item.name || 'Unknown Product',
        _id: item.product?._id || item.product?.id || item.productId || ''
      },
      quantity: typeof item.quantity === 'number' ? item.quantity : 1,
      price: typeof item.price === 'number' ? item.price : 0
    }))
    : []

  // Normalize shipping address
  const shippingAddress = order.shippingAddress || {}
  const normalizedAddress = {
    street: shippingAddress.street || '',
    city: shippingAddress.city || '',
    state: shippingAddress.state || '',
    zipCode: shippingAddress.zipCode || shippingAddress.zip || '',
    country: shippingAddress.country || ''
  }

  return {
    _id: order._id || order.id || '',
    id: order._id || order.id || '',
    orderNumber: order.orderNumber || order.order_id || `ORDER-${order._id || Date.now()}`,
    user: user,
    items: items,
    totalAmount: typeof order.totalAmount === 'number' ? order.totalAmount : 0,
    status: order.status || 'pending',
    shippingAddress: normalizedAddress,
    createdAt: order.createdAt || new Date().toISOString(),
    updatedAt: order.updatedAt || new Date().toISOString()
  }
}

/**
 * Normalizes category data for admin panel
 */
export function normalizeAdminCategory(category: any) {
  if (!category) {
    return null
  }

  // Normalize attributes array
  const attributes = Array.isArray(category.attributes)
    ? category.attributes.filter((attr: any) => attr && attr.name)
    : []

  return {
    _id: category._id || category.id || '',
    id: category._id || category.id || '',
    name: category.name || 'Unknown Category',
    slug: category.slug || category.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown',
    description: category.description || '',
    image: category.image || '',
    isActive: category.isActive !== undefined ? category.isActive : true,
    sortOrder: typeof category.sortOrder === 'number' ? category.sortOrder : 0,
    attributes: attributes,
    createdAt: category.createdAt || new Date().toISOString(),
    updatedAt: category.updatedAt || new Date().toISOString()
  }
}

/**
 * Safely extracts category name from product
 */
export function getCategoryName(product: any): string {
  if (!product || !product.category) {
    return 'Unknown'
  }

  if (typeof product.category === 'string') {
    return product.category
  }

  if (typeof product.category === 'object') {
    return product.category.name || product.category._id || 'Unknown'
  }

  return 'Unknown'
}

/**
 * Safely extracts category ID from product
 */
export function getCategoryId(product: any): string {
  if (!product || !product.category) {
    return ''
  }

  if (typeof product.category === 'string') {
    return product.category
  }

  if (typeof product.category === 'object') {
    return product.category._id || product.category.id || ''
  }

  return ''
}

/**
 * Validates and normalizes API response
 */
export function normalizeApiResponse<T>(response: any, dataKey: string = 'data'): {
  success: boolean
  data: T[]
  error?: string
  total?: number
  pages?: number
} {
  if (!response) {
    return {
      success: false,
      data: [],
      error: 'No response received'
    }
  }

  if (!response.success) {
    return {
      success: false,
      data: [],
      error: response.error || 'Request failed'
    }
  }

  const data = response[dataKey]

  if (!data) {
    return {
      success: true,
      data: [],
      total: 0,
      pages: 0
    }
  }

  const normalizedData = Array.isArray(data) ? data : [data]

  return {
    success: true,
    data: normalizedData as T[],
    total: response.total || normalizedData.length,
    pages: response.pages || 1
  }
}

/**
 * Normalizes dashboard data for admin panel
 */
export function normalizeDashboardData(data: any) {
  if (!data) {
    return {
      stats: {
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        productGrowth: 0,
        orderGrowth: 0,
        userGrowth: 0,
        revenueGrowth: 0
      },
      recentOrders: [],
      topProducts: []
    }
  }

  const stats = data.stats || {}
  const recentOrders = Array.isArray(data.recentOrders) ? data.recentOrders : []
  const topProducts = Array.isArray(data.topProducts) ? data.topProducts : []

  return {
    stats: {
      totalProducts: typeof stats.totalProducts === 'number' ? stats.totalProducts : 0,
      totalOrders: typeof stats.totalOrders === 'number' ? stats.totalOrders : 0,
      totalUsers: typeof stats.totalUsers === 'number' ? stats.totalUsers : 0,
      totalRevenue: typeof stats.totalRevenue === 'number' ? stats.totalRevenue : 0,
      productGrowth: typeof stats.productGrowth === 'number' ? stats.productGrowth : 0,
      orderGrowth: typeof stats.orderGrowth === 'number' ? stats.orderGrowth : 0,
      userGrowth: typeof stats.userGrowth === 'number' ? stats.userGrowth : 0,
      revenueGrowth: typeof stats.revenueGrowth === 'number' ? stats.revenueGrowth : 0
    },
    recentOrders: recentOrders.map((order: any) => ({
      id: order.id || order._id || `ORDER-${Date.now()}`,
      customer: order.customer || order.user?.name || 'Unknown',
      amount: typeof order.amount === 'number' ? order.amount : 0,
      status: order.status || 'pending',
      date: order.date || order.createdAt || new Date().toISOString()
    })),
    topProducts: topProducts.map((product: any) => ({
      name: product.name || 'Unknown Product',
      sales: typeof product.sales === 'number' ? product.sales : 0,
      revenue: typeof product.revenue === 'number' ? product.revenue : 0,
      rating: typeof product.rating === 'number' ? product.rating : 4.5
    }))
  }
}

/**
 * Normalizes analytics data for admin panel
 */
export function normalizeAnalyticsData(data: any) {
  if (!data) {
    return {
      overview: {
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        conversionRate: 0,
        avgOrderValue: 0
      },
      salesData: [],
      topProducts: [],
      recentOrders: []
    }
  }

  const overview = data.overview || {}
  const salesData = Array.isArray(data.salesData) ? data.salesData : []
  const topProducts = Array.isArray(data.topProducts) ? data.topProducts : []
  const recentOrders = Array.isArray(data.recentOrders) ? data.recentOrders : []

  return {
    overview: {
      totalRevenue: typeof overview.totalRevenue === 'number' ? overview.totalRevenue : 0,
      totalOrders: typeof overview.totalOrders === 'number' ? overview.totalOrders : 0,
      totalUsers: typeof overview.totalUsers === 'number' ? overview.totalUsers : 0,
      conversionRate: typeof overview.conversionRate === 'number' ? overview.conversionRate : 0,
      avgOrderValue: typeof overview.avgOrderValue === 'number' ? overview.avgOrderValue : 0
    },
    salesData: salesData.map((item: any) => ({
      month: item.month || 'Unknown',
      revenue: typeof item.revenue === 'number' ? item.revenue : 0,
      orders: typeof item.orders === 'number' ? item.orders : 0
    })),
    topProducts: topProducts.map((product: any) => ({
      name: product.name || 'Unknown Product',
      sales: typeof product.sales === 'number' ? product.sales : 0,
      revenue: typeof product.revenue === 'number' ? product.revenue : 0,
      rating: typeof product.rating === 'number' ? product.rating : 4.5
    })),
    recentOrders: recentOrders.map((order: any) => ({
      id: order.id || order._id || `ORDER-${Date.now()}`,
      customer: order.customer || order.user?.name || 'Unknown',
      total: typeof order.total === 'number' ? order.total : 0,
      status: order.status || 'pending',
      createdAt: order.createdAt || new Date().toISOString()
    }))
  }
}

/**
 * Normalizes user data for admin panel
 */
export function normalizeAdminUser(user: any) {
  if (!user) {
    return null
  }

  // Convert status field to isActive boolean
  // User model has status: 'active' | 'inactive' | 'suspended'
  // Admin panel expects isActive: boolean
  const isActive = user.isActive !== undefined
    ? user.isActive
    : user.status === 'active' || user.status === undefined

  return {
    _id: user._id || user.id || '',
    id: user._id || user.id || '',
    name: user.name || 'Unknown User',
    email: user.email || 'unknown@example.com',
    role: user.role === 'admin' ? 'admin' : 'customer',
    isActive: isActive,
    status: user.status || 'active', // Keep original status for reference
    createdAt: user.createdAt || new Date().toISOString(),
    updatedAt: user.updatedAt || new Date().toISOString()
  }
}

/**
 * Validates and safely accesses nested object properties
 */
export function safeGet<T>(obj: any, path: string, fallback: T): T {
  try {
    const keys = path.split('.')
    let value = obj
    for (const key of keys) {
      if (value === null || value === undefined) {
        return fallback
      }
      value = value[key]
    }
    return value !== undefined && value !== null ? value : fallback
  } catch {
    return fallback
  }
}

/**
 * Safely filters array with null checks
 */
export function safeFilter<T>(array: T[] | null | undefined, predicate: (item: T) => boolean): T[] {
  if (!Array.isArray(array)) {
    return []
  }
  try {
    return array.filter(predicate)
  } catch {
    return []
  }
}

/**
 * Safely maps array with null checks
 */
export function safeMap<T, U>(array: T[] | null | undefined, mapper: (item: T) => U): U[] {
  if (!Array.isArray(array)) {
    return []
  }
  try {
    return array.map(mapper).filter(item => item !== null && item !== undefined) as U[]
  } catch {
    return []
  }
}

