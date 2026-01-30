import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'

// Settings schema for MongoDB
const settingsSchema = {
  storeName: String,
  storeDescription: String,
  storeEmail: String,
  storePhone: String,
  storeAddress: String,
  emailNotifications: Boolean,
  orderConfirmation: Boolean,
  shippingUpdates: Boolean,
  marketingEmails: Boolean,
  twoFactorAuth: Boolean,
  sessionTimeout: Number,
  passwordPolicy: String,
  stripeEnabled: Boolean,
  stripeTestMode: Boolean,
  stripePublishableKey: String,
  stripeSecretKey: String,
  stripeWebhookSecret: String,
  stripeAccountId: String,
  paypalEnabled: Boolean,
  cashOnDelivery: Boolean,
  maintenanceMode: Boolean,
  allowRegistration: Boolean,
  requireEmailVerification: Boolean,
  defaultCurrency: String,
  timezone: String,
  updatedAt: { type: Date, default: Date.now }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // In a real app, you'd fetch from MongoDB
    // For now, return default settings
    const defaultSettings = {
      storeName: "Whitlin",
      storeDescription: "Welcome to Our World of Quality Hotel Linen - Professional Supplier Since 1984. 100% Virgin Cotton Long Staple Yarn with Extreme Softness & High Absorbency",
      storeEmail: "info@whitlin.com",
      storePhone: "+971 54 438 9849",
      storeAddress: "Al Ittihad Road, Dubai, United Arab Emirates",
      emailNotifications: true,
      orderConfirmation: true,
      shippingUpdates: true,
      marketingEmails: false,
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordPolicy: "strong",
      stripeEnabled: true,
      stripeTestMode: true,
      stripePublishableKey: "",
      stripeSecretKey: "",
      stripeWebhookSecret: "",
      stripeAccountId: "",
      paypalEnabled: false,
      cashOnDelivery: true,
      maintenanceMode: false,
      allowRegistration: true,
      requireEmailVerification: true,
      defaultCurrency: "AED",
      timezone: "Asia/Dubai"
    }

    return NextResponse.json({
      success: true,
      data: defaultSettings
    })
  } catch (error: any) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const settings = await request.json()

    // Validate required fields
    if (!settings.storeName || !settings.storeEmail) {
      return NextResponse.json(
        { success: false, error: 'Store name and email are required' },
        { status: 400 }
      )
    }

    // Validate Stripe settings if enabled
    if (settings.stripeEnabled) {
      if (!settings.stripePublishableKey || !settings.stripeSecretKey) {
        return NextResponse.json(
          { success: false, error: 'Stripe keys are required when Stripe is enabled' },
          { status: 400 }
        )
      }

      // Validate key format
      if (!settings.stripePublishableKey.startsWith('pk_') || !settings.stripeSecretKey.startsWith('sk_')) {
        return NextResponse.json(
          { success: false, error: 'Invalid Stripe key format' },
          { status: 400 }
        )
      }
    }

    // In a real app, you'd save to MongoDB
    // For now, just log the settings
    console.log('Settings saved:', settings)

    // Simulate database save
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully',
      data: settings
    })
  } catch (error: any) {
    console.error('Error saving settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save settings' },
      { status: 500 }
    )
  }
}
