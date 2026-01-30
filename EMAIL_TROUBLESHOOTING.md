# 📧 Email Troubleshooting Guide

## Issue: Emails not being received in Zoho Mail

### Common Causes:

1. **SMTP Password Issue** - Zoho requires an **App Password**, not your regular password
2. **Environment Variables Not Set** - SMTP credentials need to be in `.env.local`
3. **Authentication Failure** - SMTP connection might be failing

## ✅ Step-by-Step Fix:

### 1. Generate Zoho App Password

1. Login to [Zoho Mail](https://mail.zoho.in)
2. Go to **Settings** → **Security** → **App Passwords**
3. Click **Generate New App Password**
4. Name it: `Whitlin E-commerce`
5. **Copy the generated password** (it will be a long string like `abcd1234efgh5678`)

### 2. Update Environment Variables

Create or update `.env.local` file in your project root:

```env
SMTP_HOST=smtp.zoho.in
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=creators@affworld.io
SMTP_PASS=YOUR_APP_PASSWORD_HERE
SMTP_FROM_EMAIL=creators@affworld.io
```

**Important:** Replace `YOUR_APP_PASSWORD_HERE` with the App Password you generated in step 1.

### 3. Restart Your Server

After updating `.env.local`, restart your Next.js server:
```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### 4. Test Email Connection

Test if SMTP is working:
```bash
# In browser or using curl
GET http://localhost:3000/api/test-email
```

### 5. Test Order Email

Test sending an order notification email:
```bash
POST http://localhost:3000/api/test-email
Content-Type: application/json

{
  "type": "order-notification",
  "userData": {
    "orderNumber": "TEST-001",
    "customerName": "Test Customer",
    "customerEmail": "creators@affworld.io",
    "customerPhone": "1234567890",
    "items": [
      {
        "name": "Test Product",
        "quantity": 1,
        "price": 100
      }
    ],
    "subtotal": 100,
    "shipping": 10,
    "tax": 5,
    "totalAmount": 115,
    "paymentMethod": "cash_on_delivery"
  }
}
```

## 🔍 Check Server Logs

After placing an order, check your server console for:
- ✅ `SMTP connection verified successfully`
- ✅ `Email sent successfully: [messageId]`
- ❌ `Error sending email: [error details]`

## 📝 Common Error Messages:

### "Invalid login" or "Authentication failed"
- **Solution:** Use App Password, not regular password
- Make sure `SMTP_PASS` in `.env.local` is the App Password

### "Connection timeout"
- **Solution:** Check if port 587 is blocked by firewall
- Try using port 465 with `SMTP_SECURE=true`

### "Email not received"
- **Solution:** Check Spam folder in Zoho Mail
- Verify the recipient email address is correct
- Check server logs for email sending status

## 🧪 Quick Test Commands:

```bash
# Test SMTP connection
curl http://localhost:3000/api/test-email

# Test order notification (sends to creators@affworld.io)
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "order-notification",
    "userData": {
      "orderNumber": "TEST-001",
      "customerName": "Test",
      "customerEmail": "creators@affworld.io",
      "customerPhone": "1234567890",
      "items": [{"name": "Test", "quantity": 1, "price": 100}],
      "subtotal": 100,
      "shipping": 10,
      "tax": 5,
      "totalAmount": 115,
      "paymentMethod": "cash_on_delivery"
    }
  }'
```

## 📧 Email Flow:

When an order is placed:
1. **Customer** receives: Order confirmation email at their email address
2. **Admin** receives: Order notification email at `creators@affworld.io`

Both emails are sent automatically after order creation.

