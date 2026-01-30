import { Schema, model, models } from 'mongoose'

export interface ICategory {
  _id?: string
  name: string
  slug: string
  description?: string
  image?: string
  parent?: string
  isActive: boolean
  sortOrder: number
  attributes: {
    name: string
    type: 'color' | 'size' | 'text' | 'number' | 'select'
    options?: string[]
    required: boolean
  }[]
  createdAt?: Date
  updatedAt?: Date
}

const CategoryAttributeSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['color', 'size', 'text', 'number', 'select'],
    default: 'text'
  },
  options: [{
    type: String,
    trim: true
  }],
  required: {
    type: Boolean,
    default: false
  }
}, { _id: false })

const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  parent: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  attributes: [CategoryAttributeSchema]
}, {
  timestamps: true
})

// Create slug from name
CategorySchema.pre('save', function(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-')
  }
  next()
})

// Indexes for better performance
// slug index is automatically created by unique: true
CategorySchema.index({ isActive: 1 })
CategorySchema.index({ sortOrder: 1 })
CategorySchema.index({ parent: 1 })

export default models.Category || model<ICategory>('Category', CategorySchema)
