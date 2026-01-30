// Demo Email Service - Logs emails to console instead of sending
// This is for development/testing purposes

// Email templates
export const emailTemplates = {
  newUserRegistration: (userData: {
    name: string
    email: string
    phone?: string
    registrationDate: string
  }) => ({
    subject: `🎉 New User Registration - ${userData.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #d4af37, #b8941f);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .user-info {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #d4af37;
          }
          .info-row {
            margin: 10px 0;
            display: flex;
            justify-content: space-between;
          }
          .label {
            font-weight: bold;
            color: #666;
          }
          .value {
            color: #333;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 14px;
          }
          .action-button {
            display: inline-block;
            background: #d4af37;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎉 New User Registration</h1>
          <p>Whitlin E-commerce Platform</p>
        </div>
        
        <div class="content">
          <h2>Hello Admin!</h2>
          <p>A new user has registered on your Whitlin platform. Here are the details:</p>
          
          <div class="user-info">
            <div class="info-row">
              <span class="label">Name:</span>
              <span class="value">${userData.name}</span>
            </div>
            <div class="info-row">
              <span class="label">Email:</span>
              <span class="value">${userData.email}</span>
            </div>
            <div class="info-row">
              <span class="label">Phone:</span>
              <span class="value">${userData.phone || 'Not provided'}</span>
            </div>
            <div class="info-row">
              <span class="label">Registration Date:</span>
              <span class="value">${userData.registrationDate}</span>
            </div>
          </div>
          
          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>Review the user profile in admin panel</li>
            <li>Send welcome email to the new user</li>
            <li>Monitor their activity and engagement</li>
          </ul>
          
          <div style="text-align: center;">
            <a href="https://www.whitlin.com/admin/users" class="action-button">
                          View in Admin Panel
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p>This is an automated notification from Whitlin E-commerce Platform</p>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `,
    text: `
      New User Registration - Whitlin Platform
      
      A new user has registered on your platform:
      
      Name: ${userData.name}
      Email: ${userData.email}
      Phone: ${userData.phone || 'Not provided'}
      Registration Date: ${userData.registrationDate}
      
      Please review the user profile in your admin panel.
      
      Generated on ${new Date().toLocaleString()}
    `
  }),

  welcomeEmail: (userData: {
    name: string
    email: string
  }) => ({
    subject: `Welcome to Whitlin - ${userData.name}!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #d4af37, #b8941f);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .welcome-message {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
          }
          .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
          }
          .feature {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border: 2px solid #f0f0f0;
          }
          .feature-icon {
            font-size: 24px;
            margin-bottom: 10px;
          }
          .action-button {
            display: inline-block;
            background: #d4af37;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🌟 Welcome to Whitlin!</h1>
          <p>Professional Hair Care Solutions</p>
        </div>
        
        <div class="content">
          <div class="welcome-message">
            <h2>Hello ${userData.name}!</h2>
            <p>Welcome to Whitlin - your premium destination for professional hair care products!</p>
            <p>We're excited to have you join our community of hair care enthusiasts.</p>
          </div>
          
          <h3>What you can do now:</h3>
          <div class="features">
            <div class="feature">
              <div class="feature-icon">🛍️</div>
              <h4>Shop Products</h4>
              <p>Browse our premium hair care collection</p>
            </div>
            <div class="feature">
              <div class="feature-icon">💝</div>
              <h4>Add to Wishlist</h4>
              <p>Save your favorite products for later</p>
            </div>
            <div class="feature">
              <div class="feature-icon">📦</div>
              <h4>Track Orders</h4>
              <p>Monitor your order status in real-time</p>
            </div>
            <div class="feature">
              <div class="feature-icon">⭐</div>
              <h4>Leave Reviews</h4>
              <p>Share your experience with others</p>
            </div>
          </div>
          
          <div style="text-align: center;">
            <a href="https://www.whitlin.com/products" class="action-button">
              Start Shopping Now
            </a>
          </div>
          
          <p><strong>Special Offer:</strong> Get 10% off your first order! Use code: <strong>WELCOME10</strong></p>
        </div>
        
        <div class="footer">
          <p>Thank you for choosing Whitlin!</p>
          <p>If you have any questions, feel free to contact us.</p>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to Whitlin!
      
      Hello ${userData.name}!
      
      Welcome to Whitlin - your premium destination for professional hair care products!
      We're excited to have you join our community of hair care enthusiasts.
      
      What you can do now:
      - Shop Products: Browse our premium hair care collection
      - Add to Wishlist: Save your favorite products for later
      - Track Orders: Monitor your order status in real-time
      - Leave Reviews: Share your experience with others
      
      Special Offer: Get 10% off your first order! Use code: WELCOME10
      
      Start shopping at: https://www.whitlin.com/products
      
      Thank you for choosing Whitlin!
      Generated on ${new Date().toLocaleString()}
    `
  })
}

// Demo email functions - logs to console instead of sending
export const sendEmail = async (to: string, subject: string, html: string, text?: string) => {
  console.log('\n📧 ===== EMAIL NOTIFICATION =====')
  console.log(`📬 To: ${to}`)
  console.log(`📋 Subject: ${subject}`)
  console.log(`📅 Time: ${new Date().toLocaleString()}`)
  console.log('📄 Content Preview:')
  console.log(text || html.replace(/<[^>]*>/g, '').substring(0, 200) + '...')
  console.log('=====================================\n')
  
  return { success: true, messageId: `demo-${Date.now()}` }
}

// Send new user registration notification to admin
export const sendNewUserNotification = async (userData: {
  name: string
  email: string
  phone?: string
  registrationDate: string
}) => {
  const template = emailTemplates.newUserRegistration(userData)
  return await sendEmail('admin@whitlin.com', template.subject, template.html, template.text)
}

// Send welcome email to new user
export const sendWelcomeEmail = async (userData: {
  name: string
  email: string
}) => {
  const template = emailTemplates.welcomeEmail(userData)
  return await sendEmail(userData.email, template.subject, template.html, template.text)
}

// Test email function
export const testEmailConnection = async () => {
  console.log('📧 Email service test - Demo mode active')
  return { success: true, message: 'Demo email service is working (emails logged to console)' }
}
