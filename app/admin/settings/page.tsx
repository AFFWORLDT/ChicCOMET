"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Settings,
  Store,
  Mail,
  Shield,
  CreditCard,
  Globe,
  Bell,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap,
  DollarSign,
  Lock,
  ExternalLink,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [showStripeKeys, setShowStripeKeys] = useState(false)
  const [stripeTestMode, setStripeTestMode] = useState(true)
  
  const [settings, setSettings] = useState({
    // Store Settings
    storeName: "Whitlin",
    storeDescription: "Welcome to Our World of Quality Hotel Linen - Professional Supplier Since 1984. 100% Virgin Cotton Long Staple Yarn with Extreme Softness & High Absorbency",
    storeEmail: "info@whitlin.com",
    storePhone: "+971 54 438 9849",
    storeAddress: "Al Ittihad Road, Dubai, United Arab Emirates",
    
    // Email Settings
    emailNotifications: true,
    orderConfirmation: true,
    shippingUpdates: true,
    marketingEmails: false,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: "strong",
    
    // Stripe Payment Settings
    stripeEnabled: true,
    stripeTestMode: true,
    stripePublishableKey: "",
    stripeSecretKey: "",
    stripeWebhookSecret: "",
    stripeAccountId: "",
    
    // Other Payment Settings
    paypalEnabled: false,
    cashOnDelivery: true,
    
    // General Settings
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    defaultCurrency: "AED",
    timezone: "Asia/Dubai"
  })

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        const data = await response.json()
        
        if (data.success) {
          setSettings(data.data)
          setStripeTestMode(data.data.stripeTestMode)
        } else {
          toast.error(data.error || 'Failed to fetch settings')
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
        toast.error('Failed to fetch settings')
      } finally {
        setInitialLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Validate Stripe settings if enabled
      if (settings.stripeEnabled) {
        if (!settings.stripePublishableKey || !settings.stripeSecretKey) {
          toast.error("Please provide both Stripe Publishable Key and Secret Key")
          setLoading(false)
          return
        }
        
        // Validate key format
        if (!settings.stripePublishableKey.startsWith('pk_') || !settings.stripeSecretKey.startsWith('sk_')) {
          toast.error("Invalid Stripe key format. Keys should start with 'pk_' and 'sk_'")
          setLoading(false)
          return
        }
      }

      // Save to API
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success("Settings saved successfully!")
        // Update local state with saved data
        setSettings(data.data)
      } else {
        toast.error(data.error || "Failed to save settings")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Failed to save settings")
    } finally {
      setLoading(false)
    }
  }

  const testStripeConnection = async () => {
    if (!settings.stripePublishableKey || !settings.stripeSecretKey) {
      toast.error("Please provide Stripe keys first")
      return
    }

    try {
      // Test Stripe connection by creating a test payment intent
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-stripe-secret-key': settings.stripeSecretKey,
        },
        body: JSON.stringify({
          amount: 100, // Test with 1 AED
          currency: 'AED',
          customerEmail: 'test@example.com'
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success("Stripe connection test successful!")
      } else {
        toast.error(data.error || "Stripe connection test failed")
      }
    } catch (error) {
      console.error("Stripe connection test error:", error)
      toast.error("Stripe connection test failed")
    }
  }

  const getStripeKeyStatus = (key: string) => {
    if (!key) return { status: 'empty', icon: XCircle, color: 'text-red-500' }
    if (key.startsWith('pk_') || key.startsWith('sk_')) {
      return { status: 'valid', icon: CheckCircle, color: 'text-green-500' }
    }
    return { status: 'invalid', icon: AlertTriangle, color: 'text-yellow-500' }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your store configuration and preferences</p>
        </div>
        <Button onClick={handleSave} disabled={loading} className="bg-primary hover:bg-primary/90">
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Store className="h-5 w-5 mr-2" />
              Store Information
            </CardTitle>
            <CardDescription>Basic information about your store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={settings.storeName}
                onChange={(e) => handleSettingChange("storeName", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="storeDescription">Store Description</Label>
              <Textarea
                id="storeDescription"
                value={settings.storeDescription}
                onChange={(e) => handleSettingChange("storeDescription", e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="storeEmail">Store Email</Label>
              <Input
                id="storeEmail"
                type="email"
                value={settings.storeEmail}
                onChange={(e) => handleSettingChange("storeEmail", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="storePhone">Store Phone</Label>
              <Input
                id="storePhone"
                value={settings.storePhone}
                onChange={(e) => handleSettingChange("storePhone", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="storeAddress">Store Address</Label>
              <Textarea
                id="storeAddress"
                value={settings.storeAddress}
                onChange={(e) => handleSettingChange("storeAddress", e.target.value)}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Email Settings
            </CardTitle>
            <CardDescription>Configure email notifications and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Enable email notifications</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Order Confirmation</Label>
                <p className="text-sm text-muted-foreground">Send order confirmation emails</p>
              </div>
              <Switch
                checked={settings.orderConfirmation}
                onCheckedChange={(checked) => handleSettingChange("orderConfirmation", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Shipping Updates</Label>
                <p className="text-sm text-muted-foreground">Send shipping status updates</p>
              </div>
              <Switch
                checked={settings.shippingUpdates}
                onCheckedChange={(checked) => handleSettingChange("shippingUpdates", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">Send promotional emails</p>
              </div>
              <Switch
                checked={settings.marketingEmails}
                onCheckedChange={(checked) => handleSettingChange("marketingEmails", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security Settings
            </CardTitle>
            <CardDescription>Configure security and access controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Require 2FA for admin access</p>
              </div>
              <Switch
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => handleSettingChange("twoFactorAuth", checked)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange("sessionTimeout", parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="passwordPolicy">Password Policy</Label>
              <select
                id="passwordPolicy"
                value={settings.passwordPolicy}
                onChange={(e) => handleSettingChange("passwordPolicy", e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="weak">Weak</option>
                <option value="medium">Medium</option>
                <option value="strong">Strong</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Stripe Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Stripe Payment Settings
            </CardTitle>
            <CardDescription>Configure Stripe payment gateway for secure online payments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stripe Enable/Disable */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  Enable Stripe Payments
                </Label>
                <p className="text-sm text-muted-foreground">Accept credit cards and digital payments</p>
              </div>
              <Switch
                checked={settings.stripeEnabled}
                onCheckedChange={(checked) => handleSettingChange("stripeEnabled", checked)}
              />
            </div>

            {settings.stripeEnabled && (
              <>
                <Separator />
                
                {/* Test Mode Toggle */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Test Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">Use test keys for development</p>
                  </div>
                  <Switch
                    checked={settings.stripeTestMode}
                    onCheckedChange={(checked) => handleSettingChange("stripeTestMode", checked)}
                  />
                </div>

                {/* Stripe Keys */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Stripe API Keys</Label>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowStripeKeys(!showStripeKeys)}
                      >
                        {showStripeKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {showStripeKeys ? "Hide" : "Show"} Keys
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={testStripeConnection}
                        disabled={!settings.stripePublishableKey || !settings.stripeSecretKey}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Test Connection
                      </Button>
                    </div>
                  </div>

                  {/* Publishable Key */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="stripePublishableKey">Publishable Key *</Label>
                      {(() => {
                        const status = getStripeKeyStatus(settings.stripePublishableKey)
                        const Icon = status.icon
                        return <Icon className={`h-4 w-4 ${status.color}`} />
                      })()}
                    </div>
                    <Input
                      id="stripePublishableKey"
                      type={showStripeKeys ? "text" : "password"}
                      value={settings.stripePublishableKey}
                      onChange={(e) => handleSettingChange("stripePublishableKey", e.target.value)}
                      placeholder={settings.stripeTestMode ? "pk_test_..." : "pk_live_..."}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Get this from your Stripe Dashboard → Developers → API Keys
                    </p>
                  </div>

                  {/* Secret Key */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="stripeSecretKey">Secret Key *</Label>
                      {(() => {
                        const status = getStripeKeyStatus(settings.stripeSecretKey)
                        const Icon = status.icon
                        return <Icon className={`h-4 w-4 ${status.color}`} />
                      })()}
                    </div>
                    <Input
                      id="stripeSecretKey"
                      type={showStripeKeys ? "text" : "password"}
                      value={settings.stripeSecretKey}
                      onChange={(e) => handleSettingChange("stripeSecretKey", e.target.value)}
                      placeholder={settings.stripeTestMode ? "sk_test_..." : "sk_live_..."}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Keep this secret! Never share it publicly.
                    </p>
                  </div>

                  {/* Webhook Secret */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="stripeWebhookSecret">Webhook Secret</Label>
                      {settings.stripeWebhookSecret ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <Input
                      id="stripeWebhookSecret"
                      type={showStripeKeys ? "text" : "password"}
                      value={settings.stripeWebhookSecret}
                      onChange={(e) => handleSettingChange("stripeWebhookSecret", e.target.value)}
                      placeholder="whsec_..."
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      For webhook endpoint verification (optional but recommended)
                    </p>
                  </div>

                  {/* Account ID */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="stripeAccountId">Account ID</Label>
                      {settings.stripeAccountId ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <Input
                      id="stripeAccountId"
                      value={settings.stripeAccountId}
                      onChange={(e) => handleSettingChange("stripeAccountId", e.target.value)}
                      placeholder="acct_..."
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your Stripe account ID (for multi-account setups)
                    </p>
                  </div>
                </div>

                {/* Stripe Info */}
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p><strong>Test Mode:</strong> Use test keys (pk_test_/sk_test_) for development</p>
                      <p><strong>Live Mode:</strong> Use live keys (pk_live_/sk_live_) for production</p>
                      <p><strong>Webhook URL:</strong> <code className="bg-muted px-1 rounded">https://yourdomain.com/api/webhooks/stripe</code></p>
                    </div>
                  </AlertDescription>
                </Alert>

                {/* Stripe Dashboard Link */}
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Need help with Stripe setup?</p>
                    <p className="text-sm text-muted-foreground">Visit your Stripe Dashboard for API keys and documentation</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Stripe Dashboard
                    </a>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Other Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Other Payment Methods
            </CardTitle>
            <CardDescription>Configure additional payment options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>PayPal</Label>
                <p className="text-sm text-muted-foreground">Enable PayPal payments</p>
              </div>
              <Switch
                checked={settings.paypalEnabled}
                onCheckedChange={(checked) => handleSettingChange("paypalEnabled", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Cash on Delivery</Label>
                <p className="text-sm text-muted-foreground">Allow cash on delivery payments</p>
              </div>
              <Switch
                checked={settings.cashOnDelivery}
                onCheckedChange={(checked) => handleSettingChange("cashOnDelivery", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              General Settings
            </CardTitle>
            <CardDescription>Configure general store settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Put store in maintenance mode</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleSettingChange("maintenanceMode", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Registration</Label>
                <p className="text-sm text-muted-foreground">Allow new user registration</p>
              </div>
              <Switch
                checked={settings.allowRegistration}
                onCheckedChange={(checked) => handleSettingChange("allowRegistration", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Verification</Label>
                <p className="text-sm text-muted-foreground">Require email verification</p>
              </div>
              <Switch
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked) => handleSettingChange("requireEmailVerification", checked)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defaultCurrency">Default Currency</Label>
                <select
                  id="defaultCurrency"
                  value={settings.defaultCurrency}
                  onChange={(e) => handleSettingChange("defaultCurrency", e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="AED">AED (UAE Dirham)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                  <option value="GBP">GBP (British Pound)</option>
                  <option value="SAR">SAR (Saudi Riyal)</option>
                  <option value="QAR">QAR (Qatari Riyal)</option>
                  <option value="KWD">KWD (Kuwaiti Dinar)</option>
                  <option value="BHD">BHD (Bahraini Dinar)</option>
                  <option value="OMR">OMR (Omani Rial)</option>
                  <option value="INR">INR (Indian Rupee)</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange("timezone", e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="Asia/Dubai">Dubai (GMT+4)</option>
                  <option value="Asia/Abu_Dhabi">Abu Dhabi (GMT+4)</option>
                  <option value="Asia/Riyadh">Riyadh (GMT+3)</option>
                  <option value="Asia/Kuwait">Kuwait (GMT+3)</option>
                  <option value="Asia/Bahrain">Bahrain (GMT+3)</option>
                  <option value="Asia/Qatar">Qatar (GMT+3)</option>
                  <option value="Asia/Muscat">Muscat (GMT+4)</option>
                  <option value="America/New_York">Eastern Time (GMT-5)</option>
                  <option value="Europe/London">London (GMT+0)</option>
                  <option value="Asia/Kolkata">India (GMT+5:30)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
