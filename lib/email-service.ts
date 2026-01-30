import nodemailer from 'nodemailer'
import path from 'path'

// Branding Constants
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.whitlin.com'
const PRIMARY_COLOR = '#4e6a9a' // Navy
const ACCENT_COLOR = '#f1a748'  // Gold
const TEXT_COLOR = '#1e293b'
const MUTED_TEXT = '#64748b'

/**
 * Common layout wrapper for all premium emails
 */
const commonEmailLayout = (content: string, title: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f3f5fa;
      color: ${TEXT_COLOR};
      -webkit-font-smoothing: antialiased;
    }
    .main-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(78, 106, 154, 0.1);
    }
    .header {
      background-color: ${PRIMARY_COLOR};
      padding: 40px 20px;
      text-align: center;
    }
    .content {
      padding: 40px 35px;
      line-height: 1.6;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      color: ${MUTED_TEXT};
      font-size: 13px;
      border-top: 1px solid #eef2f6;
    }
    .btn {
      display: inline-block;
      background-color: ${ACCENT_COLOR};
      color: #ffffff !important;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 600;
      margin: 25px 0;
      transition: all 0.3s ease;
    }
    h1, h2, h3 { color: ${TEXT_COLOR}; margin-top: 0; }
    p { margin-bottom: 20px; color: #475569; }
  </style>
</head>
<body>
  <div class="main-container">
    <div class="header">
      <img src="cid:logo" alt="Whitlin" style="height: 55px; width: auto;">
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p style="margin: 0;">&copy; ${new Date().getFullYear()} Whitlin. All rights reserved.</p>
      <p style="margin: 10px 0 0 0; font-style: italic;">Premium Quality &bull; Professional Care</p>
    </div>
  </div>
</body>
</html>
`

// Zoho Mail Configuration
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.zoho.in',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // false for TLS (port 587)
  auth: {
    user: process.env.SMTP_USER || 'creators@affworld.io',
    pass: process.env.SMTP_PASS || 'Rmjss_8j'
  },
  tls: {
    rejectUnauthorized: false,
    ciphers: 'SSLv3'
  },
  debug: true,
  logger: true
}

// Admin email for notifications
const ADMIN_EMAIL = process.env.SMTP_FROM_EMAIL || 'creators@affworld.io'

// Create transporter
const createTransporter = () => {
  const transporter = nodemailer.createTransport(SMTP_CONFIG)
  return transporter
}

// Helper to format payment method
const formatPaymentMethod = (method: string) => {
  const m = method?.toLowerCase().trim();
  if (m === 'stripe' || m === 'card') return 'Credit/Debit Card (Stripe)';
  if (m === 'cod' || m === 'cash_on_delivery') return 'Cash on Delivery';
  return method || 'Not specified';
};

// Email templates
export const emailTemplates = {
  newUserRegistration: (userData: {
    name: string
    email: string
    phone?: string
    registrationDate: string
  }) => {
    const htmlContent = `
      <h2 style="margin-bottom: 24px;">New Registration Received</h2>
      <p>A new user has registered on the Whitlin platform. Details are below:</p>
      <div style="background-color: #f8fafc; border-radius: 12px; padding: 25px; margin: 25px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="padding: 8px 0; color: ${MUTED_TEXT}; font-weight: 600; width: 140px;">Name:</td><td style="padding: 8px 0; font-weight: 500;">${userData.name}</td></tr>
          <tr><td style="padding: 8px 0; color: ${MUTED_TEXT}; font-weight: 600;">Email:</td><td style="padding: 8px 0; font-weight: 500;">${userData.email}</td></tr>
          <tr><td style="padding: 8px 0; color: ${MUTED_TEXT}; font-weight: 600;">Phone:</td><td style="padding: 8px 0; font-weight: 500;">${userData.phone || 'Not provided'}</td></tr>
          <tr><td style="padding: 8px 0; color: ${MUTED_TEXT}; font-weight: 600;">Date:</td><td style="padding: 8px 0; font-weight: 500;">${userData.registrationDate}</td></tr>
        </table>
      </div>
      <div style="text-align: center;">
        <a href="${BASE_URL}/admin/users" class="btn">Manage User in Admin</a>
      </div>
    `
    return {
      subject: `🎉 New User: ${userData.name}`,
      html: commonEmailLayout(htmlContent, 'New User Registration'),
      text: `New User Registration: ${userData.name} (${userData.email})`
    }
  },

  welcomeEmail: (userData: {
    name: string
    email: string
  }) => {
    const htmlContent = `
      <h2 style="margin-bottom: 24px; text-align: center;">Welcome to Whitlin, ${userData.name.split(' ')[0]}!</h2>
      <p style="text-align: center; font-size: 16px;">We're delighted to have you join our community of premium lifestyle enthusiasts.</p>
      
      <div style="text-align: center; margin: 40px 0;">
        <img src="${BASE_URL}/images/welcome-banner.png" alt="Welcome" style="width: 100%; max-width: 480px; border-radius: 12px; height: auto;" onerror="this.style.display='none'">
      </div>

      <p>Explore our curated collections designed for those who appreciate the finer things in life. From luxury linens to bespoke home essentials, Whitlin is your destination for quality and elegance.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${BASE_URL}/products" class="btn">Explore Collections</a>
      </div>

      <div style="background-color: #f0f9ff; border-radius: 12px; padding: 25px; margin-top: 40px; text-align: center;">
        <h4 style="margin: 0 0 10px 0; color: ${PRIMARY_COLOR};">First Purchase Special</h4>
        <p style="margin: 0; font-size: 24px; font-weight: 800; color: ${PRIMARY_COLOR};">WHITLIN-WELCOME</p>
        <p style="margin: 10px 0 0 0; font-size: 14px; color: ${MUTED_TEXT};">Use this code for 10% off your first order!</p>
      </div>
    `
    return {
      subject: `🌟 Welcome to Whitlin, ${userData.name}!`,
      html: commonEmailLayout(htmlContent, 'Welcome to Whitlin'),
      text: `Welcome to Whitlin, ${userData.name}! Use code WHITLIN-WELCOME for 10% off your first order.`
    }
  },

  forgotPassword: (userData: {
    name: string
    email: string
    otp: string
  }) => {
    const htmlContent = `
      <h2 style="margin-bottom: 24px; text-align: center;">Password Reset Verification</h2>
      <p>Hello <strong>${userData.name}</strong>,</p>
      <p>We received a request to reset your password for your Whitlin account. Use the code below to complete the verification process.</p>
      
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 30px; text-align: center; margin: 35px 0;">
        <p style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: ${MUTED_TEXT}; font-weight: 600;">Verification Code</p>
        <div style="font-size: 32px; font-weight: 700; color: ${PRIMARY_COLOR}; letter-spacing: 6px; font-family: 'Courier New', Courier, monospace; line-height: 1.2; white-space: nowrap; display: block;">
          ${userData.otp}
        </div>
        <p style="margin: 15px 0 0 0; color: #dc2626; font-size: 14px; font-weight: 500;">Expires in 10 minutes</p>
      </div>
      
      <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 4px; margin-bottom: 30px;">
        <p style="margin: 0; color: #92400e; font-size: 14px;">
          <strong>Security Tip:</strong> If you did not request this, please ignore this email. Your account remains secure. Never share this code with anyone.
        </p>
      </div>
    `
    return {
      subject: `🔐 ${userData.otp} is your verification code`,
      html: commonEmailLayout(htmlContent, 'Password Reset'),
      text: `Your password reset code is ${userData.otp}. This code expires in 10 minutes.`
    }
  }
}

// Send email function
export const sendEmail = async (to: string | any, subject?: string, html?: string, text?: string): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
  code?: string;
  response?: string;
}> => {
  try {
    if (typeof to === 'object' && to !== null) {
      const options = to as any
      return await sendEmail(options.to, options.subject, options.html, options.text)
    }

    const transporter = createTransporter()
    const mailOptions = {
      from: `"Whitlin" <${SMTP_CONFIG.auth.user}>`,
      to: to,
      subject: subject,
      html: html,
      text: text || (html ? html.replace(/<[^>]*>/g, '') : ''),
      attachments: [
        {
          filename: 'logo.png',
          path: path.join(process.cwd(), 'public', 'W_Logo_N.png'),
          cid: 'logo'
        }
      ]
    }

    const sendPromise = transporter.sendMail(mailOptions)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Email sending timeout after 30 seconds')), 30000)
    )

    const result = await Promise.race([sendPromise, timeoutPromise]) as any
    return { success: true, messageId: result.messageId, response: result.response }
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Unknown error',
      code: error?.code,
      response: error?.response
    }
  }
}

// Admin notification
export const sendNewUserNotification = async (userData: {
  name: string
  email: string
  phone?: string
  registrationDate: string
}) => {
  const template = emailTemplates.newUserRegistration(userData)
  return await sendEmail(ADMIN_EMAIL, template.subject, template.html, template.text)
}

// Welcome email
export const sendWelcomeEmail = async (userData: {
  name: string
  email: string
}) => {
  const template = emailTemplates.welcomeEmail(userData)
  return await sendEmail(userData.email, template.subject, template.html, template.text)
}

// Forgot password
export const sendForgotPasswordEmail = async (userData: {
  name: string
  email: string
  otp: string
}) => {
  const template = emailTemplates.forgotPassword(userData)
  return await sendEmail(userData.email, template.subject, template.html, template.text)
}

// Newsletter
export const sendNewsletterEmail = async ({
  to,
  subject,
  htmlContent,
  newsletterId,
  subscriberId
}: {
  to: string;
  subject: string;
  htmlContent: string;
  newsletterId: string;
  subscriberId: string;
}) => {
  const trackingPixel = `<img src="${BASE_URL}/api/newsletter/track/open?newsletter=${newsletterId}&subscriber=${subscriberId}" width="1" height="1" style="display:none;" />`
  const unsubscribeLink = `${BASE_URL}/api/newsletter/unsubscribe?token=UNSUBSCRIBE_TOKEN`

  const finalHtmlContent = htmlContent
    .replace('</body>', `${trackingPixel}</body>`)
    .replace(/UNSUBSCRIBE_TOKEN/g, unsubscribeLink)

  return await sendEmail(to, subject, commonEmailLayout(finalHtmlContent, subject))
}

// Account Created
export const sendAccountCreatedEmail = async ({
  name,
  email,
  password,
  orderNumber
}: {
  name: string;
  email: string;
  password: string;
  orderNumber: string;
}) => {
  const htmlContent = `
    <h2 style="margin-bottom: 24px;">Welcome to Whitlin Pro!</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>Thank you for your order! We've automatically created your Whitlin Pro account so you can track your order and enjoy a faster checkout next time.</p>
    
    <div style="background-color: #f8fafc; border-radius: 12px; padding: 25px; margin: 30px 0;">
      <h3 style="margin: 0 0 15px 0;">📦 Order Confirmation</h3>
      <p style="margin: 0;"><strong>Order Number:</strong> #${orderNumber}</p>
      <p style="margin: 5px 0 0 0;"><strong>Email:</strong> ${email}</p>
    </div>

    <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0;">
      <h3 style="margin: 0 0 10px 0; color: #0369a1;">Log In to Track Your Order</h3>
      <p style="margin: 0 0 15px 0; color: #0c4a6e;">Use the password below to access your account:</p>
      <div style="font-size: 24px; font-weight: 700; color: #0369a1; background: #ffffff; display: inline-block; padding: 12px 24px; border-radius: 8px; border: 1px solid #bae6fd; letter-spacing: 1px;">
        ${password}
      </div>
    </div>
    
    <div style="text-align: center;">
      <a href="${BASE_URL}/login" class="btn">Login to Your Account</a>
    </div>

    <p style="font-size: 14px; color: ${MUTED_TEXT}; text-align: center; margin-top: 20px;">
      For security, please change your password after logging in for the first time.
    </p>
  `
  const textContent = `Welcome to Whitlin Pro! Your account password is: ${password}`
  return await sendEmail(email, 'Your Whitlin Pro Account Has Been Created', commonEmailLayout(htmlContent, 'Account Created'), textContent)
}

// Lead Notification
export const sendLeadNotificationEmail = async (leadData: {
  name: string
  email: string
  phone?: string
  company?: string
  subject?: string
  message?: string
  source?: string
}) => {
  const htmlContent = `
    <h2 style="margin-bottom: 24px; color: ${PRIMARY_COLOR};">🎯 New Lead Received</h2>
    <p>A new lead has been submitted through the website inquiry form.</p>
    
    <div style="background-color: #f8fafc; border-left: 4px solid ${ACCENT_COLOR}; border-radius: 8px; padding: 25px; margin: 30px 0;">
      <h3 style="margin: 0 0 15px 0;">Lead Details</h3>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="padding: 6px 0; color: ${MUTED_TEXT}; width: 120px;">Name:</td><td style="padding: 6px 0; font-weight: 600;">${leadData.name}</td></tr>
        <tr><td style="padding: 6px 0; color: ${MUTED_TEXT};">Email:</td><td style="padding: 6px 0;"><a href="mailto:${leadData.email}" style="color: ${PRIMARY_COLOR}; text-decoration: none;">${leadData.email}</a></td></tr>
        ${leadData.phone ? `<tr><td style="padding: 6px 0; color: ${MUTED_TEXT};">Phone:</td><td style="padding: 6px 0;">${leadData.phone}</td></tr>` : ''}
        ${leadData.company ? `<tr><td style="padding: 6px 0; color: ${MUTED_TEXT};">Company:</td><td style="padding: 6px 0;">${leadData.company}</td></tr>` : ''}
        ${leadData.subject ? `<tr><td style="padding: 6px 0; color: ${MUTED_TEXT};">Subject:</td><td style="padding: 6px 0;">${leadData.subject}</td></tr>` : ''}
        ${leadData.source ? `<tr><td style="padding: 6px 0; color: ${MUTED_TEXT};">Source:</td><td style="padding: 6px 0;">${leadData.source}</td></tr>` : ''}
      </table>
    </div>

    ${leadData.message ? `
    <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
      <h4 style="margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; color: ${MUTED_TEXT};">Message</h4>
      <p style="margin: 0; white-space: pre-wrap;">${leadData.message}</p>
    </div>
    ` : ''}

    <div style="text-align: center;">
      <a href="mailto:${leadData.email}?subject=Re: ${leadData.subject || 'Your Inquiry'}" class="btn">Reply to Lead</a>
    </div>
  `

  const textContent = `New Lead: ${leadData.name} (${leadData.email})`
  return await sendEmail(ADMIN_EMAIL, `🎯 New Lead: ${leadData.name}`, commonEmailLayout(htmlContent, 'New Lead Received'), textContent)
}

// Order Confirmation
export const sendOrderConfirmationEmail = async (orderData: {
  orderNumber: string
  customerName: string
  customerEmail: string
  items: Array<{ name: string; quantity: number; price: number; image?: string }>
  subtotal: number
  shipping: number
  tax: number
  totalAmount: number
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    phone: string
  }
  paymentMethod: string
  trackingNumber?: string
  metadata?: any
  currency?: string
  currencySymbol?: string
}) => {
  const currency = orderData.currency || 'AED'
  const currencySymbol = orderData.currencySymbol || 'AED'

  const itemsHtml = orderData.items.map(item => `
    <tr>
      <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9; width: 80px;">
        <img src="${item.image || BASE_URL + '/placeholder.png'}" alt="${item.name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px; border: 1px solid #eef2f6;">
      </td>
      <td style="padding: 15px; border-bottom: 1px solid #f1f5f9;">
        <div style="font-weight: 600; color: ${TEXT_COLOR};">${item.name}</div>
        <div style="font-size: 13px; color: ${MUTED_TEXT};">Qty: ${item.quantity}</div>
      </td>
      <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 600; color: ${PRIMARY_COLOR};">
        ${currencySymbol} ${item.price.toFixed(2)}
      </td>
    </tr>
  `).join('')

  const htmlContent = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="display: inline-block; background-color: #f0fdf4; color: #166534; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-bottom: 15px;">Order Confirmed</div>
      <h2 style="margin: 0;">Thank you for your purchase!</h2>
      <p style="color: ${MUTED_TEXT};">Order #${orderData.orderNumber}</p>
    </div>

    <p>Hello <strong>${orderData.customerName}</strong>,</p>
    <p>We've received your order and are getting it ready for shipment. We'll notify you as soon as it's on its way.</p>
    
    <div style="margin: 35px 0;">
      <h3 style="font-size: 16px; text-transform: uppercase; letter-spacing: 1px; color: ${MUTED_TEXT}; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; margin-bottom: 0;">Order Summary</h3>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        ${itemsHtml}
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px;">
        <tr><td style="padding: 5px 0; color: ${MUTED_TEXT};">Subtotal</td><td style="padding: 5px 0; text-align: right;">${currencySymbol} ${orderData.subtotal.toFixed(2)}</td></tr>
        <tr><td style="padding: 5px 0; color: ${MUTED_TEXT};">Shipping</td><td style="padding: 5px 0; text-align: right;">${currencySymbol} ${orderData.shipping.toFixed(2)}</td></tr>
        <tr><td style="padding: 5px 0; color: ${MUTED_TEXT};">Estimated Tax</td><td style="padding: 5px 0; text-align: right;">${currencySymbol} ${orderData.tax.toFixed(2)}</td></tr>
        <tr><td style="padding: 15px 0; font-size: 18px; font-weight: 700; color: ${PRIMARY_COLOR};">Total</td><td style="padding: 15px 0; text-align: right; font-size: 18px; font-weight: 700; color: ${PRIMARY_COLOR};">${currencySymbol} ${orderData.totalAmount.toFixed(2)}</td></tr>
      </table>
    </div>

    <div style="background-color: #f8fafc; border-radius: 12px; padding: 25px; margin: 30px 0;">
      <div style="margin-bottom: 25px;">
        <h3 style="font-size: 15px; margin-top: 0; color: ${PRIMARY_COLOR}; text-transform: uppercase; letter-spacing: 0.5px;">Shipping Address</h3>
        <p style="margin: 0; font-size: 15px; color: ${TEXT_COLOR}; line-height: 1.5;">
          <strong>${orderData.shippingAddress.name}</strong><br>
          ${orderData.shippingAddress.address}<br>
          ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zipCode}<br>
          ${orderData.shippingAddress.country}<br>
          Phone: ${orderData.shippingAddress.phone}
        </p>
      </div>
      <div>
        <h3 style="font-size: 15px; margin-top: 0; color: ${PRIMARY_COLOR}; text-transform: uppercase; letter-spacing: 0.5px;">Payment Method</h3>
        <p style="margin: 0; font-size: 15px; color: ${TEXT_COLOR}; line-height: 1.5;">
          ${formatPaymentMethod(orderData.paymentMethod)}
        </p>
      </div>
    </div>
  `

  const textContent = `Order Confirmation #${orderData.orderNumber}. Thank you for your purchase!`
  return await sendEmail(orderData.customerEmail, `Your Whitlin Order #${orderData.orderNumber} is Confirmed`, commonEmailLayout(htmlContent, 'Order Confirmation'), textContent)
}

// Order Notification Admin
export const sendOrderNotificationEmail = async (orderData: {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  items: Array<{ name: string; quantity: number; price: number; image?: string }>
  subtotal: number
  shipping: number
  tax: number
  totalAmount: number
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    phone: string
  }
  paymentMethod: string
  metadata?: any
  currency?: string
  currencySymbol?: string
}) => {
  const currencySymbol = orderData.currencySymbol || 'AED'

  const itemsHtml = orderData.items.map(item => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
        ${item.name} <span style="color: ${MUTED_TEXT};">(x${item.quantity})</span>
      </td>
      <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; text-align: right;">
        ${currencySymbol} ${item.price.toFixed(2)}
      </td>
    </tr>
  `).join('')

  const htmlContent = `
    <h2 style="margin-bottom: 24px;">🛒 New Order Received</h2>
    <p>A new order has been placed on Whitlin. Details are below:</p>
    
    <div style="background-color: #f8fafc; border-radius: 12px; padding: 25px; margin: 30px 0;">
      <h3 style="margin: 0 0 15px 0; font-size: 16px;">Order #${orderData.orderNumber}</h3>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        ${itemsHtml}
        <tr><td style="padding: 15px 0; font-weight: 700;">Total Amount</td><td style="padding: 15px 0; text-align: right; font-weight: 700; color: ${PRIMARY_COLOR};">${currencySymbol} ${orderData.totalAmount.toFixed(2)}</td></tr>
      </table>
    </div>

    <div style="margin: 30px 0;">
      <h3 style="font-size: 15px;">Customer Details</h3>
      <p style="margin: 0; font-size: 14px;">
        <strong>Name:</strong> ${orderData.customerName}<br>
        <strong>Email:</strong> ${orderData.customerEmail}<br>
        <strong>Phone:</strong> ${orderData.customerPhone || 'N/A'}<br>
        <strong>Payment:</strong> ${formatPaymentMethod(orderData.paymentMethod)}
      </p>
    </div>

    <div style="text-align: center;">
      <a href="${BASE_URL}/admin/orders" class="btn">Process Order in Admin</a>
    </div>
  `

  return await sendEmail(ADMIN_EMAIL, `🛒 New Order: #${orderData.orderNumber} from ${orderData.customerName}`, commonEmailLayout(htmlContent, 'New Order Notification'))
}

// Test Connection
export const testEmailConnection = async () => {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    return { success: true, message: 'Email server connection verified' }
  } catch (error: any) {
    return { success: false, error: error?.message || 'Unknown error' }
  }
}
