# 🔐 Zoho Mail App Password Setup Guide

## 🚨 IMPORTANT: Current Issue
आपका email service authentication fail हो रहा है क्योंकि Zoho Mail के लिए **App Password** की जरूरत है, regular password नहीं।

## 📋 Step-by-Step Guide to Generate App Password

### Step 1: Login to Zoho Mail
1. Go to [mail.zoho.com](https://mail.zoho.com)
2. Login with your credentials:
   - **Email**: `admin@affworld.io`
   - **Password**: `Ad34%@hRFd`

### Step 2: Enable 2-Factor Authentication (Required)
1. Click on **Settings** (gear icon) in top right
2. Go to **Security** tab
3. Enable **2-Factor Authentication** if not already enabled
4. Follow the setup process

### Step 3: Generate App Password
1. In **Security** section, find **App Passwords**
2. Click **Generate New App Password**
3. Give it a name: `Whitlin E-commerce`
4. Click **Generate**
5. **Copy the generated App Password** (it will look like: `abcd1234efgh5678`)

### Step 4: Update Email Configuration
1. Open `/lib/email-service.ts` file
2. Replace the password:
```typescript
const ZOHO_CONFIG = {
  host: 'smtp.zoho.com',
  port: 587,
  secure: false,
  auth: {
    user: 'admin@affworld.io',
    pass: 'YOUR_APP_PASSWORD_HERE' // Replace with your App Password
  },
  tls: {
    rejectUnauthorized: false
  }
}
```

## 🧪 Test After Setup

### Test Email Connection:
```bash
curl http://localhost:3000/api/test-email
```

### Test Welcome Email:
```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "welcome",
    "userData": {
      "name": "Rahul Sarswat",
      "email": "Rahulsarswat57@gmail.com"
    }
  }'
```

### Test User Registration:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rahul Sarswat",
    "email": "Rahulsarswat57@gmail.com",
    "password": "password123",
    "phone": "9876543210"
  }'
```

## 🔍 Troubleshooting

### If App Password doesn't work:
1. **Check 2FA**: Make sure 2-Factor Authentication is enabled
2. **Regenerate**: Delete old App Password and create new one
3. **Wait**: Sometimes it takes a few minutes to activate
4. **Check Email**: Zoho might send confirmation email

### Alternative: Use Gmail SMTP
If Zoho doesn't work, you can use Gmail:

```typescript
const GMAIL_CONFIG = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-gmail@gmail.com',
    pass: 'your-gmail-app-password'
  }
}
```

## 📧 Expected Results

After successful setup:
- ✅ Email connection test passes
- ✅ Welcome emails sent to users
- ✅ Admin notifications sent
- ✅ User registration with email notifications works

## 🎯 Current Status

- ❌ **Email Service**: Authentication failed (needs App Password)
- ✅ **Email Templates**: Ready and working
- ✅ **User Registration**: Working (without emails)
- ✅ **System**: Ready for production (after email setup)

## 🚀 Next Steps

1. **Generate Zoho App Password** (follow steps above)
2. **Update email-service.ts** with App Password
3. **Test email functionality**
4. **Send test email to Rahul**

---

**🔐 Once you generate the App Password, your email system will work perfectly!**
