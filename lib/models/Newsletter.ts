import mongoose, { Schema, Document } from 'mongoose'

export interface INewsletter extends Document {
  title: string
  subject: string
  content: string
  htmlContent: string
  type: 'manual' | 'automated' | 'welcome' | 'abandoned_cart' | 'product_launch'
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'
  scheduledDate?: Date
  sentDate?: Date
  recipientCount: number
  openCount: number
  clickCount: number
  unsubscribeCount: number
  bounceCount: number
  tags: string[]
  segments: string[] // Target specific subscriber segments
  template: string // Template used for this newsletter
  metadata: {
    createdBy: string
    lastModifiedBy: string
    campaignId?: string
    automationTrigger?: string
  }
  analytics: {
    opens: Array<{
      subscriberId: string
      openedAt: Date
      ipAddress?: string
      userAgent?: string
    }>
    clicks: Array<{
      subscriberId: string
      clickedAt: Date
      link: string
      ipAddress?: string
      userAgent?: string
    }>
  }
}

const NewsletterSchema = new Schema<INewsletter>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  htmlContent: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['manual', 'automated', 'welcome', 'abandoned_cart', 'product_launch'],
    default: 'manual'
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sending', 'sent', 'failed'],
    default: 'draft'
  },
  scheduledDate: {
    type: Date
  },
  sentDate: {
    type: Date
  },
  recipientCount: {
    type: Number,
    default: 0
  },
  openCount: {
    type: Number,
    default: 0
  },
  clickCount: {
    type: Number,
    default: 0
  },
  unsubscribeCount: {
    type: Number,
    default: 0
  },
  bounceCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  segments: [{
    type: String,
    trim: true
  }],
  template: {
    type: String,
    default: 'default'
  },
  metadata: {
    createdBy: {
      type: String,
      required: true
    },
    lastModifiedBy: {
      type: String,
      required: true
    },
    campaignId: String,
    automationTrigger: String
  },
  analytics: {
    opens: [{
      subscriberId: {
        type: Schema.Types.ObjectId,
        ref: 'NewsletterSubscriber'
      },
      openedAt: {
        type: Date,
        default: Date.now
      },
      ipAddress: String,
      userAgent: String
    }],
    clicks: [{
      subscriberId: {
        type: Schema.Types.ObjectId,
        ref: 'NewsletterSubscriber'
      },
      clickedAt: {
        type: Date,
        default: Date.now
      },
      link: String,
      ipAddress: String,
      userAgent: String
    }]
  }
}, {
  timestamps: true
})

// Indexes for better performance
NewsletterSchema.index({ status: 1 })
NewsletterSchema.index({ type: 1 })
NewsletterSchema.index({ scheduledDate: 1 })
NewsletterSchema.index({ sentDate: -1 })
NewsletterSchema.index({ tags: 1 })
NewsletterSchema.index({ 'metadata.createdBy': 1 })

export default mongoose.models.Newsletter || mongoose.model<INewsletter>('Newsletter', NewsletterSchema)
