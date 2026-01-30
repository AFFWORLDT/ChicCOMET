import mongoose, { Schema, Document } from 'mongoose'

export interface IOrderItem {
  product: mongoose.Types.ObjectId
  name: string
  quantity: number
  price: number
  image: string
  total: number
}

export interface IShippingAddress {
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
}

export interface IOrderStatusHistory {
  status: string
  timestamp: Date
  note?: string
  updatedBy?: string
}

export interface IOrder extends Document {
  orderNumber: string
  user: mongoose.Types.ObjectId
  items: IOrderItem[]
  totalAmount: number
  subtotal: number
  tax: number
  shipping: number
  discount: number
  status: 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned' | 'refunded'
  shippingAddress: IShippingAddress
  billingAddress?: IShippingAddress
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
  trackingNumber?: string
  carrier?: string
  estimatedDelivery?: Date
  actualDelivery?: Date
  notes?: string
  internalNotes?: string
  statusHistory?: IOrderStatusHistory[]
  priority: 'low' | 'normal' | 'high' | 'urgent'
  source: 'website' | 'mobile' | 'admin' | 'api'
  tags?: string[]
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

const OrderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false })

const ShippingAddressSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
}, { _id: false })

const OrderStatusHistorySchema = new Schema({
  status: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String
  },
  updatedBy: {
    type: String
  }
}, { _id: false })

const OrderSchema: Schema = new Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [OrderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  shipping: {
    type: Number,
    default: 0,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded'],
    default: 'pending',
    validate: {
      validator: function (v: string) {
        // Allow old status values for backward compatibility
        const validStatuses = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded']
        return validStatuses.includes(v)
      },
      message: 'Invalid status value'
    }
  },
  shippingAddress: {
    type: ShippingAddressSchema,
    required: true
  },
  billingAddress: {
    type: ShippingAddressSchema
  },
  paymentMethod: {
    type: String,
    default: 'cash_on_delivery'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending',
    validate: {
      validator: function (v: string) {
        const validStatuses = ['pending', 'paid', 'failed', 'refunded', 'partially_refunded']
        return validStatuses.includes(v)
      },
      message: 'Invalid payment status value'
    }
  },
  trackingNumber: {
    type: String
  },
  carrier: {
    type: String
  },
  estimatedDelivery: {
    type: Date
  },
  actualDelivery: {
    type: Date
  },
  notes: {
    type: String
  },
  internalNotes: {
    type: String
  },
  statusHistory: {
    type: [OrderStatusHistorySchema],
    default: []
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  source: {
    type: String,
    enum: ['website', 'mobile', 'admin', 'api'],
    default: 'website'
  },
  tags: {
    type: [String],
    default: []
  },
  metadata: {
    type: Schema.Types.Map,
    of: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
})

// Index for better query performance
// orderNumber index is automatically created by unique: true
OrderSchema.index({ user: 1 })
OrderSchema.index({ status: 1 })
OrderSchema.index({ createdAt: -1 })
OrderSchema.index({ paymentStatus: 1 })
OrderSchema.index({ priority: 1 })
OrderSchema.index({ source: 1 })
OrderSchema.index({ trackingNumber: 1 })
OrderSchema.index({ estimatedDelivery: 1 })
OrderSchema.index({ tags: 1 })

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)