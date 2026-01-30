import mongoose, { Schema, Document } from 'mongoose'

export interface INewsletterSubscriber extends Document {
  email: string
  firstName?: string
  lastName?: string
  status: 'active' | 'unsubscribed' | 'bounced'
  source: string // 'website', 'admin', 'import', etc.
  tags: string[]
  preferences: {
    productUpdates: boolean
    promotions: boolean
    tips: boolean
    events: boolean
  }
  subscriptionDate: Date
  lastEmailSent?: Date
  unsubscribeDate?: Date
  unsubscribeToken: string
  metadata: {
    ipAddress?: string
    userAgent?: string
    referrer?: string
  }
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
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
  status: {
    type: String,
    enum: ['active', 'unsubscribed', 'bounced'],
    default: 'active'
  },
  source: {
    type: String,
    default: 'website'
  },
  tags: [{
    type: String,
    trim: true
  }],
  preferences: {
    productUpdates: {
      type: Boolean,
      default: true
    },
    promotions: {
      type: Boolean,
      default: true
    },
    tips: {
      type: Boolean,
      default: true
    },
    events: {
      type: Boolean,
      default: true
    }
  },
  subscriptionDate: {
    type: Date,
    default: Date.now
  },
  lastEmailSent: {
    type: Date
  },
  unsubscribeDate: {
    type: Date
  },
  unsubscribeToken: {
    type: String,
    unique: true
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    referrer: String
  }
}, {
  timestamps: true
})

// Indexes for better performance
// email and unsubscribeToken indexes are automatically created by unique: true
NewsletterSubscriberSchema.index({ status: 1 })
NewsletterSubscriberSchema.index({ tags: 1 })
NewsletterSubscriberSchema.index({ subscriptionDate: -1 })

// Generate unsubscribe token before saving
NewsletterSubscriberSchema.pre('save', function(next) {
  if (this.isNew && !this.unsubscribeToken) {
    const crypto = require('crypto')
    this.unsubscribeToken = crypto.randomBytes(32).toString('hex')
  }
  next()
})

export default mongoose.models.NewsletterSubscriber || mongoose.model<INewsletterSubscriber>('NewsletterSubscriber', NewsletterSubscriberSchema)
