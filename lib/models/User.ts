import { Schema, model, models } from 'mongoose'

export interface IUser {
  _id?: string
  name?: string
  firstName?: string
  lastName?: string
  email: string
  password: string
  role: 'customer' | 'admin' | 'user'
  status: 'active' | 'inactive' | 'suspended'
  phone?: string
  isEmailVerified?: boolean
  addresses?: Array<{
    type: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    isDefault: boolean
  }>
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  preferences?: {
    emailNotifications: boolean
    smsNotifications: boolean
    marketingEmails: boolean
  }
  stats?: {
    totalOrders: number
    totalSpent: number
    lastOrderDate?: string
  }
  wishlist?: string[]
  resetPassword?: {
    otp: string
    expiresAt: Date
    isUsed: boolean
  }
  createdAt?: Date
  updatedAt?: Date
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    trim: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'user'],
    default: 'customer'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  phone: {
    type: String,
    trim: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  addresses: [{
    type: {
      type: String,
      default: 'shipping'
    },
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: false
    },
    marketingEmails: {
      type: Boolean,
      default: true
    }
  },
  stats: {
    totalOrders: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    lastOrderDate: Date
  },
  wishlist: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  resetPassword: {
    otp: String,
    expiresAt: Date,
    isUsed: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
})

// Indexes for better performance
// email index is automatically created by unique: true
UserSchema.index({ role: 1 })
UserSchema.index({ status: 1 })
UserSchema.index({ createdAt: -1 })

export default models.User || model<IUser>('User', UserSchema)
