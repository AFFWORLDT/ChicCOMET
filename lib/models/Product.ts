import { Schema, model, models } from 'mongoose'

export interface IProductAttribute {
  name: string
  value: string
  type: 'color' | 'size' | 'text' | 'number'
}

export interface IProduct {
  _id?: string
  name: string
  category: string
  subCategory?: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  rating: number
  reviews: number
  description: string
  features?: string[]
  ingredients?: string[]
  inStock: boolean
  isNewProduct: boolean
  isBestSeller: boolean
  sku: string
  weight?: string
  size?: string
  stock: number
  status: string
  businessType: 'B2B' | 'B2C' | 'BOTH'
  attributes?: IProductAttribute[]
  washingInstructions?: string[]
  createdAt?: Date
  updatedAt?: Date
}

const ProductAttributeSchema = new Schema<IProductAttribute>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['color', 'size', 'text', 'number'],
    default: 'text'
  }
}, { _id: false })

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  subCategory: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  image: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0,
    min: 0
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  features: [{
    type: String,
    trim: true
  }],
  ingredients: [{
    type: String,
    trim: true
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  isNewProduct: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true
  },
  weight: {
    type: String,
    default: 'N/A',
    trim: true
  },
  size: {
    type: String,
    default: 'Standard',
    trim: true
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive', 'out_of_stock']
  },
  businessType: {
    type: String,
    default: 'BOTH',
    enum: ['B2B', 'B2C', 'BOTH']
  },
  attributes: [ProductAttributeSchema],
  washingInstructions: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
})

// Indexes for better performance
ProductSchema.index({ category: 1 })
ProductSchema.index({ status: 1 })
ProductSchema.index({ price: 1 })
ProductSchema.index({ rating: -1 })
ProductSchema.index({ createdAt: -1 })
ProductSchema.index({ name: 'text', description: 'text', sku: 'text' }) // Text search index

export default models.Product || model<IProduct>('Product', ProductSchema)