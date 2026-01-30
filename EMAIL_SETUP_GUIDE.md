# 📧 Email Setup Guide for Whitlin E-commerce Platform

## 🎯 Overview
This guide will help you set up email notifications for your Whitlin e-commerce platform using Zoho Mail.

## 📋 Email Features Implemented

### ✅ **User Registration Notifications**
- **Admin Notification**: When a new user registers, admin receives detailed email
- **Welcome Email**: New users receive a welcome email with platform information
- **Professional Templates**: Beautiful HTML email templates with Whitlin branding

### ✅ **Email Templates**
1. **New User Registration Alert** (to Admin)
   - User details (name, email, phone, registration date)
   - Direct link to admin panel
   - Professional styling with Whitlin branding

2. **Welcome Email** (to New User)
   - Welcome message with platform introduction
   - Feature highlights (shopping, wishlist, order tracking, reviews)
   - Special offer (10% off first order with code: WELCOME10)
   - Call-to-action buttons

## 🔧 Zoho Mail Setup Instructions

### Step 1: Enable 2-Factor Authentication
1. Log in to your Zoho Mail account
2. Go to **Settings** → **Security**
3. Enable **2-Factor Authentication**

### Step 2: Generate App Password
1. In Zoho Mail Settings, go to **Security** → **App Passwords**
2. Click **Generate New App Password**
3. Give it a name like "Whitlin E-commerce"
4. Copy the generated App Password (it will look like: `abcd1234efgh5678`)

### Step 3: Update Email Configuration
1. Open `/lib/email-service.ts`
2. Update the credentials:
```typescript
const ZOHO_CONFIG = {
  host: 'smtp.zoho.com',
  port: 587,
  secure: false,
  auth: {
    user: 'admin@affworld.io', // Your Zoho email
    pass: 'YOUR_APP_PASSWORD_HERE' // Replace with your App Password
  },
  tls: {
    rejectUnauthorized: false
  }
}
```

### Step 4: Test Email Service
```bash
# Test email connection
curl http://localhost:3000/api/test-email

# Test new user notification
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "new-user",
    "userData": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "1234567890"
    }
  }'

# Test welcome email
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "welcome",
    "userData": {
      "name": "Test User",
      "email": "test@example.com"
    }
  }'
```

## 🚀 How It Works

### **User Registration Flow**
1. User fills registration form
2. System creates user account
3. **Two emails are sent automatically:**
   - Admin notification to `admin@affworld.io`
   - Welcome email to new user
4. Registration completes successfully

### **Email Content**
- **Professional HTML templates** with responsive design
- **Whitlin branding** with golden color scheme
- **Mobile-friendly** layouts
- **Clear call-to-action** buttons
- **Fallback text versions** for all emails

## 📊 Email Analytics

### **Admin Notifications Include:**
- User's full name and contact information
- Registration timestamp
- Direct link to admin panel
- Next steps recommendations

### **Welcome Emails Include:**
- Personalized greeting
- Platform feature overview
- Special welcome offer (10% discount)
- Direct links to start shopping

## 🔒 Security Features

- **Rate limiting** on registration endpoint
- **Input validation** for all email data
- **Error handling** - registration doesn't fail if email fails
- **Secure SMTP** connection with TLS
- **App password** authentication (more secure than regular password)

## 🛠️ Troubleshooting

### **Common Issues:**

1. **"Authentication Failed" Error**
   - Make sure you're using App Password, not regular password
   - Verify 2FA is enabled on your Zoho account

2. **"Connection Timeout" Error**
   - Check your internet connection
   - Verify Zoho SMTP settings are correct

3. **Emails Not Received**
   - Check spam/junk folder
   - Verify email addresses are correct
   - Test with different email providers

### **Testing Commands:**
```bash
# Check if server is running
curl http://localhost:3000

# Test email service
curl http://localhost:3000/api/test-email

# Test user registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "1234567890"
  }'
```

## 📱 Email Templates Preview

### **Admin Notification Email:**
- **Header**: Whitlin logo and "New User Registration" title
- **User Info Card**: Name, email, phone, registration date
- **Next Steps**: Review profile, send welcome, monitor activity
- **Action Button**: "View in Admin Panel"

### **Welcome Email:**
- **Header**: "Welcome to Whitlin" with golden branding
- **Welcome Message**: Personalized greeting
- **Features Grid**: Shopping, Wishlist, Order Tracking, Reviews
- **Special Offer**: 10% off first order with WELCOME10 code
- **Action Button**: "Start Shopping Now"

## 🎉 Success Indicators

When everything is working correctly, you should see:
- ✅ User registration completes successfully
- ✅ Admin receives notification email
- ✅ New user receives welcome email
- ✅ No errors in server console
- ✅ Email service test passes

## 📞 Support

If you encounter any issues:
1. Check the server console for error messages
2. Verify Zoho Mail settings
3. Test email service endpoint
4. Check spam folders
5. Verify App Password is correct

---

**🎯 Your Whitlin e-commerce platform now has professional email notifications!**

**📧 Admin will be notified of every new user registration**
**👋 New users will receive a warm welcome with special offers**
**🚀 Ready for production deployment!**
