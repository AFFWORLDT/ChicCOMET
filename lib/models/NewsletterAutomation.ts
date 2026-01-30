import mongoose, { Schema, Document } from 'mongoose'

export interface INewsletterAutomation extends Document {
  name: string
  description: string
  trigger: 'welcome' | 'abandoned_cart' | 'product_launch' | 'birthday' | 'anniversary' | 'custom'
  triggerConditions: {
    event: string
    delay?: number // Delay in hours
    conditions?: Record<string, any>
  }
  emailSequence: Array<{
    order: number
    newsletterId: string
    delay: number // Delay in hours from previous email
    conditions?: Record<string, any>
  }>
  status: 'active' | 'paused' | 'draft'
  targetSegments: string[]
  tags: string[]
  metadata: {
    createdBy: string
    lastModifiedBy: string
    totalSent: number
    lastTriggered?: Date
  }
}

const NewsletterAutomationSchema = new Schema<INewsletterAutomation>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  trigger: {
    type: String,
    enum: ['welcome', 'abandoned_cart', 'product_launch', 'birthday', 'anniversary', 'custom'],
    required: true
  },
  triggerConditions: {
    event: {
      type: String,
      required: true
    },
    delay: {
      type: Number,
      default: 0
    },
    conditions: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  emailSequence: [{
    order: {
      type: Number,
      required: true
    },
    newsletterId: {
      type: Schema.Types.ObjectId,
      ref: 'Newsletter',
      required: true
    },
    delay: {
      type: Number,
      default: 0
    },
    conditions: {
      type: Schema.Types.Mixed,
      default: {}
    }
  }],
  status: {
    type: String,
    enum: ['active', 'paused', 'draft'],
    default: 'draft'
  },
  targetSegments: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  metadata: {
    createdBy: {
      type: String,
      required: true
    },
    lastModifiedBy: {
      type: String,
      required: true
    },
    totalSent: {
      type: Number,
      default: 0
    },
    lastTriggered: {
      type: Date
    }
  }
}, {
  timestamps: true
})

// Indexes for better performance
NewsletterAutomationSchema.index({ status: 1 })
NewsletterAutomationSchema.index({ trigger: 1 })
NewsletterAutomationSchema.index({ 'metadata.createdBy': 1 })
NewsletterAutomationSchema.index({ tags: 1 })

export default mongoose.models.NewsletterAutomation || mongoose.model<INewsletterAutomation>('NewsletterAutomation', NewsletterAutomationSchema)
