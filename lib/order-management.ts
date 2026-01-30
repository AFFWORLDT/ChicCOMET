// Order Management Utilities
export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  PACKED: 'packed',
  SHIPPED: 'shipped',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
  REFUNDED: 'refunded'
} as const

export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded'
} as const

export const ORDER_PRIORITIES = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
} as const

export const ORDER_SOURCES = {
  WEBSITE: 'website',
  MOBILE: 'mobile',
  ADMIN: 'admin',
  API: 'api'
} as const

// Order Status Flow
export const ORDER_STATUS_FLOW = {
  [ORDER_STATUSES.PENDING]: [ORDER_STATUSES.CONFIRMED, ORDER_STATUSES.CANCELLED],
  [ORDER_STATUSES.CONFIRMED]: [ORDER_STATUSES.PROCESSING, ORDER_STATUSES.CANCELLED],
  [ORDER_STATUSES.PROCESSING]: [ORDER_STATUSES.PACKED, ORDER_STATUSES.CANCELLED],
  [ORDER_STATUSES.PACKED]: [ORDER_STATUSES.SHIPPED, ORDER_STATUSES.CANCELLED],
  [ORDER_STATUSES.SHIPPED]: [ORDER_STATUSES.OUT_FOR_DELIVERY, ORDER_STATUSES.DELIVERED, ORDER_STATUSES.RETURNED],
  [ORDER_STATUSES.OUT_FOR_DELIVERY]: [ORDER_STATUSES.DELIVERED, ORDER_STATUSES.RETURNED],
  [ORDER_STATUSES.DELIVERED]: [ORDER_STATUSES.RETURNED, ORDER_STATUSES.REFUNDED],
  [ORDER_STATUSES.CANCELLED]: [ORDER_STATUSES.REFUNDED],
  [ORDER_STATUSES.RETURNED]: [ORDER_STATUSES.REFUNDED],
  [ORDER_STATUSES.REFUNDED]: []
} as const

// Status Display Configuration
export const STATUS_CONFIG = {
  [ORDER_STATUSES.PENDING]: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
    icon: 'Clock',
    description: 'Order received, awaiting confirmation'
  },
  [ORDER_STATUSES.CONFIRMED]: {
    label: 'Confirmed',
    color: 'bg-blue-100 text-blue-800',
    icon: 'CheckCircle',
    description: 'Order confirmed, ready for processing'
  },
  [ORDER_STATUSES.PROCESSING]: {
    label: 'Processing',
    color: 'bg-indigo-100 text-indigo-800',
    icon: 'Package',
    description: 'Order is being prepared'
  },
  [ORDER_STATUSES.PACKED]: {
    label: 'Packed',
    color: 'bg-purple-100 text-purple-800',
    icon: 'Package',
    description: 'Order packed and ready for shipping'
  },
  [ORDER_STATUSES.SHIPPED]: {
    label: 'Shipped',
    color: 'bg-cyan-100 text-cyan-800',
    icon: 'Truck',
    description: 'Order has been shipped'
  },
  [ORDER_STATUSES.OUT_FOR_DELIVERY]: {
    label: 'Out for Delivery',
    color: 'bg-orange-100 text-orange-800',
    icon: 'Truck',
    description: 'Order is out for delivery'
  },
  [ORDER_STATUSES.DELIVERED]: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-800',
    icon: 'CheckCircle',
    description: 'Order has been delivered'
  },
  [ORDER_STATUSES.CANCELLED]: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800',
    icon: 'XCircle',
    description: 'Order has been cancelled'
  },
  [ORDER_STATUSES.RETURNED]: {
    label: 'Returned',
    color: 'bg-pink-100 text-pink-800',
    icon: 'ArrowLeft',
    description: 'Order has been returned'
  },
  [ORDER_STATUSES.REFUNDED]: {
    label: 'Refunded',
    color: 'bg-gray-100 text-gray-800',
    icon: 'CreditCard',
    description: 'Order has been refunded'
  }
} as const

// Payment Status Configuration
export const PAYMENT_STATUS_CONFIG = {
  [PAYMENT_STATUSES.PENDING]: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Payment is pending'
  },
  [PAYMENT_STATUSES.PAID]: {
    label: 'Paid',
    color: 'bg-green-100 text-green-800',
    description: 'Payment has been received'
  },
  [PAYMENT_STATUSES.FAILED]: {
    label: 'Failed',
    color: 'bg-red-100 text-red-800',
    description: 'Payment has failed'
  },
  [PAYMENT_STATUSES.REFUNDED]: {
    label: 'Refunded',
    color: 'bg-gray-100 text-gray-800',
    description: 'Payment has been refunded'
  },
  [PAYMENT_STATUSES.PARTIALLY_REFUNDED]: {
    label: 'Partially Refunded',
    color: 'bg-orange-100 text-orange-800',
    description: 'Payment has been partially refunded'
  }
} as const

// Priority Configuration
export const PRIORITY_CONFIG = {
  [ORDER_PRIORITIES.LOW]: {
    label: 'Low',
    color: 'bg-gray-100 text-gray-800',
    description: 'Low priority order'
  },
  [ORDER_PRIORITIES.NORMAL]: {
    label: 'Normal',
    color: 'bg-blue-100 text-blue-800',
    description: 'Normal priority order'
  },
  [ORDER_PRIORITIES.HIGH]: {
    label: 'High',
    color: 'bg-orange-100 text-orange-800',
    description: 'High priority order'
  },
  [ORDER_PRIORITIES.URGENT]: {
    label: 'Urgent',
    color: 'bg-red-100 text-red-800',
    description: 'Urgent priority order'
  }
} as const

// Utility Functions
export const getNextStatus = (currentStatus: string): string | null => {
  const flow = ORDER_STATUS_FLOW[currentStatus as keyof typeof ORDER_STATUS_FLOW]
  return flow && flow.length > 0 ? flow[0] : null
}

export const getAllowedStatuses = (currentStatus: string): string[] => {
  return ORDER_STATUS_FLOW[currentStatus as keyof typeof ORDER_STATUS_FLOW] || []
}

export const canUpdateStatus = (currentStatus: string, newStatus: string): boolean => {
  const allowedStatuses = getAllowedStatuses(currentStatus)
  return allowedStatuses.includes(newStatus)
}

export const getStatusConfig = (status: string) => {
  return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG[ORDER_STATUSES.PENDING]
}

export const getPaymentStatusConfig = (status: string) => {
  return PAYMENT_STATUS_CONFIG[status as keyof typeof PAYMENT_STATUS_CONFIG] || PAYMENT_STATUS_CONFIG[PAYMENT_STATUSES.PENDING]
}

export const getPriorityConfig = (priority: string) => {
  return PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG] || PRIORITY_CONFIG[ORDER_PRIORITIES.NORMAL]
}

// Order Status Timeline
export const getOrderTimeline = (statusHistory: any[]) => {
  const timeline = []
  
  // Always start with order placed
  timeline.push({
    status: 'Order Placed',
    timestamp: new Date(),
    completed: true,
    description: 'Order was successfully placed'
  })
  
  // Add status history entries
  if (statusHistory && statusHistory.length > 0) {
    statusHistory.forEach(entry => {
      const config = getStatusConfig(entry.status)
      timeline.push({
        status: config.label,
        timestamp: new Date(entry.timestamp),
        completed: true,
        description: config.description,
        note: entry.note,
        updatedBy: entry.updatedBy
      })
    })
  }
  
  return timeline.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
}

// Order Analytics
export const calculateOrderMetrics = (orders: any[]) => {
  const metrics = {
    total: orders.length,
    byStatus: {} as Record<string, number>,
    byPriority: {} as Record<string, number>,
    bySource: {} as Record<string, number>,
    totalRevenue: 0,
    averageOrderValue: 0,
    conversionRate: 0
  }
  
  orders.forEach(order => {
    // Count by status
    metrics.byStatus[order.status] = (metrics.byStatus[order.status] || 0) + 1
    
    // Count by priority
    metrics.byPriority[order.priority] = (metrics.byPriority[order.priority] || 0) + 1
    
    // Count by source
    metrics.bySource[order.source] = (metrics.bySource[order.source] || 0) + 1
    
    // Calculate revenue (only for delivered orders)
    if (order.status === ORDER_STATUSES.DELIVERED) {
      metrics.totalRevenue += order.totalAmount
    }
  })
  
  // Calculate average order value
  if (metrics.total > 0) {
    const totalValue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
    metrics.averageOrderValue = totalValue / metrics.total
  }
  
  return metrics
}

// Order Validation
export const validateOrderUpdate = (order: any, updates: any) => {
  const errors: string[] = []
  
  // Validate status update
  if (updates.status && !canUpdateStatus(order.status, updates.status)) {
    errors.push(`Cannot update status from ${order.status} to ${updates.status}`)
  }
  
  // Validate payment status
  if (updates.paymentStatus && !Object.values(PAYMENT_STATUSES).includes(updates.paymentStatus)) {
    errors.push(`Invalid payment status: ${updates.paymentStatus}`)
  }
  
  // Validate priority
  if (updates.priority && !Object.values(ORDER_PRIORITIES).includes(updates.priority)) {
    errors.push(`Invalid priority: ${updates.priority}`)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Order Notifications
export const getOrderNotifications = (order: any) => {
  const notifications = []
  
  // Check for overdue orders
  if (order.status === ORDER_STATUSES.PENDING) {
    const daysSinceCreated = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    if (daysSinceCreated > 1) {
      notifications.push({
        type: 'warning',
        message: `Order has been pending for ${daysSinceCreated} days`,
        action: 'Review and confirm order'
      })
    }
  }
  
  // Check for high priority orders
  if (order.priority === ORDER_PRIORITIES.URGENT || order.priority === ORDER_PRIORITIES.HIGH) {
    notifications.push({
      type: 'info',
      message: `High priority order requires attention`,
      action: 'Process immediately'
    })
  }
  
  // Check for failed payments
  if (order.paymentStatus === PAYMENT_STATUSES.FAILED) {
    notifications.push({
      type: 'error',
      message: 'Payment has failed',
      action: 'Contact customer or retry payment'
    })
  }
  
  return notifications
}
