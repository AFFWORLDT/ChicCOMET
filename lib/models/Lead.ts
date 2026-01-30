import mongoose, { Schema, Document } from 'mongoose'

export interface ILead extends Document {
  name: string
  email: string
  phone?: string
  company?: string
  subject?: string
  message?: string
  source: string // 'contact-form', 'popup', 'footer', 'chatbot', 'product-inquiry', etc.
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  priority: 'low' | 'medium' | 'high'
  tags: string[]
  assignedTo?: string // User ID if you want to assign leads
  notes?: string // Internal notes
  metadata: {
    ipAddress?: string
    userAgent?: string
    referrer?: string
    pageUrl?: string
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
  }
  contactedAt?: Date
  convertedAt?: Date
  lastContactedAt?: Date
}

const LeadSchema = new Schema<ILead>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  phone: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    trim: true
  },
  source: {
    type: String,
    required: true,
    default: 'website',
    index: true
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'converted', 'lost'],
    default: 'new',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
    index: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String,
    trim: true
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    referrer: String,
    pageUrl: String,
    utmSource: String,
    utmMedium: String,
    utmCampaign: String
  },
  contactedAt: {
    type: Date
  },
  convertedAt: {
    type: Date
  },
  lastContactedAt: {
    type: Date
  }
}, {
  timestamps: true
})

// Indexes for better performance
LeadSchema.index({ email: 1, createdAt: -1 })
LeadSchema.index({ status: 1, createdAt: -1 })
LeadSchema.index({ source: 1, createdAt: -1 })
LeadSchema.index({ priority: 1, status: 1 })

export default mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema)

