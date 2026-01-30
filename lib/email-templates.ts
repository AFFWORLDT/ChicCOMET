export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export const emailTemplates = {
  // Welcome email template
  welcome: (userData: { name: string; email: string }): EmailTemplate => ({
    subject: "Welcome to ChicComet - Your Premium Linen Journey Begins!",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ChicComet</title>
        <style>
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 40px 30px; text-align: center; }
          .content { padding: 40px 30px; }
          .footer { background-color: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 12px; }
          .button { display: inline-block; background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .feature { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .unsubscribe { margin-top: 20px; }
          .unsubscribe a { color: #f59e0b; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 32px;">Welcome to ChicComet!</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Professional  Premium Linen Solutions</p>
          </div>
          <div class="content">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${userData.name}!</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Welcome to the ChicComet family! We're thrilled to have you join our community of Premium Linen enthusiasts 
              who believe in the power of professional-grade treatments.
            </p>
            
            <div class="feature">
              <h3 style="color: #92400e; margin: 0 0 10px 0;">🎉 What's Next?</h3>
              <ul style="color: #92400e; margin: 0; padding-left: 20px;">
                <li>Exclusive access to new product launches</li>
                <li>Professional  Premium Linen tips and tutorials</li>
                <li>Special discounts and promotions</li>
                <li>Expert advice from our  Premium Linen professionals</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
               <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.chiccomet.com'}/products" class="button">
                Explore Our Products
              </a>
            </div>

            <p style="color: #666; line-height: 1.6;">
              Ready to transform your hair? Browse our collection of professional-grade keratin treatments, 
              hair repair solutions, and styling essentials designed to give you salon-quality results at home.
            </p>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="color: #333; margin: 0 0 15px 0;">💡 Pro Tip</h3>
              <p style="color: #666; margin: 0; line-height: 1.6;">
                Start with our <strong>Keratin Treatment Starter Kit</strong> for the best introduction to 
                professional  Premium Linen. It includes everything you need for your first treatment!
              </p>
            </div>
          </div>
          <div class="footer">
            <p style="margin: 0 0 10px 0;">© 2025 ChicComet. All rights reserved.</p>
            <div class="unsubscribe">
              <a href="UNSUBSCRIBE_TOKEN">Unsubscribe</a> | 
              <a href="mailto:info@chiccomet.com">Contact Support</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to Whitlin!
      
      Hello ${userData.name}!
      
      Welcome to the Whitlin family! We're thrilled to have you join our community of  Premium Linen enthusiasts 
      who believe in the power of professional-grade treatments.
      
      What's Next?
      - Exclusive access to new product launches
      - Professional  Premium Linen tips and tutorials
      - Special discounts and promotions
      - Expert advice from our  Premium Linen professionals
      
      Ready to transform your hair? Browse our collection of professional-grade keratin treatments, 
      hair repair solutions, and styling essentials designed to give you salon-quality results at home.
      
      Pro Tip: Start with our Keratin Treatment Starter Kit for the best introduction to 
      professional  Premium Linen. It includes everything you need for your first treatment!
      
      Explore our products: ${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.chiccomet.com'}/products
      
      © 2025 ChicComet. All rights reserved.
      Unsubscribe: UNSUBSCRIBE_TOKEN
      Contact Support: support@chiccomet.com
    `
  }),

  // Product launch template
  productLaunch: (productData: { name: string; description: string; imageUrl?: string; price?: number }): EmailTemplate => ({
    subject: `🚀 New Product Launch: ${productData.name} - Limited Time Offer!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Product Launch - ${productData.name}</title>
        <style>
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 40px 30px; text-align: center; }
          .content { padding: 40px 30px; }
          .footer { background-color: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 12px; }
          .button { display: inline-block; background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .product-card { background: #fef3c7; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center; }
          .price { font-size: 24px; font-weight: bold; color: #f59e0b; margin: 10px 0; }
          .unsubscribe { margin-top: 20px; }
          .unsubscribe a { color: #f59e0b; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">🚀 New Product Launch!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Exclusive Early Access</p>
          </div>
          <div class="content">
            <h2 style="color: #333; margin-bottom: 20px;">Introducing ${productData.name}</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
              We're excited to announce our latest innovation in professional  Premium Linen. 
              This breakthrough product is designed to deliver exceptional results.
            </p>
            
            <div class="product-card">
              <h3 style="color: #92400e; margin: 0 0 15px 0;">${productData.name}</h3>
              <p style="color: #92400e; line-height: 1.6; margin-bottom: 20px;">
                ${productData.description}
              </p>
              ${productData.price ? `<div class="price">$${productData.price}</div>` : ''}
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.whitlin.com'}/products" class="button">
                Shop Now - Limited Time!
              </a>
            </div>

            <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="color: #dc2626; margin: 0 0 10px 0;">⚡ Early Bird Special</h3>
              <p style="color: #dc2626; margin: 0; line-height: 1.6;">
                Be among the first to experience this revolutionary product. 
                Limited quantities available - don't miss out!
              </p>
            </div>

            <p style="color: #666; line-height: 1.6; text-align: center;">
              Questions about this product? Our  Premium Linen experts are here to help!
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0 0 10px 0;">© 2025 ChicComet. All rights reserved.</p>
            <div class="unsubscribe">
              <a href="UNSUBSCRIBE_TOKEN">Unsubscribe</a> | 
              <a href="mailto:info@chiccomet.com">Contact Support</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      🚀 New Product Launch: ${productData.name}
      
      Introducing ${productData.name}
      
      We're excited to announce our latest innovation in professional  Premium Linen. 
      This breakthrough product is designed to deliver exceptional results.
      
      ${productData.name}
      ${productData.description}
      ${productData.price ? `Price: $${productData.price}` : ''}
      
      ⚡ Early Bird Special
      Be among the first to experience this revolutionary product. 
      Limited quantities available - don't miss out!
      
      Shop Now: ${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.whitlin.com'}/products
      
      Questions about this product? Our  Premium Linen experts are here to help!
      
      © 2025 Whitlin. All rights reserved.
      Unsubscribe: UNSUBSCRIBE_TOKEN
      Contact Support: support@whitlin.com
    `
  }),

  // Abandoned cart template
  abandonedCart: (cartData: { items: Array<{ name: string; price: number; image?: string }>; total: number }): EmailTemplate => ({
    subject: "Don't forget your Whitlin items! Complete your order now",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Complete Your Order - Whitlin</title>
        <style>
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 40px 30px; text-align: center; }
          .content { padding: 40px 30px; }
          .footer { background-color: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 12px; }
          .button { display: inline-block; background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .cart-item { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0; display: flex; align-items: center; gap: 15px; }
          .item-details { flex: 1; }
          .item-price { font-weight: bold; color: #f59e0b; }
          .total { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .unsubscribe { margin-top: 20px; }
          .unsubscribe a { color: #f59e0b; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">🛒 Your Cart is Waiting!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Complete your order in just a few clicks</p>
          </div>
          <div class="content">
            <h2 style="color: #333; margin-bottom: 20px;">Don't miss out on these amazing products!</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
              We noticed you left some items in your cart. These professional  Premium Linen products 
              are waiting for you to complete your order.
            </p>
            
            <h3 style="color: #333; margin-bottom: 15px;">Your Cart Items:</h3>
            ${cartData.items.map(item => `
              <div class="cart-item">
                <div class="item-details">
                  <h4 style="margin: 0 0 5px 0; color: #333;">${item.name}</h4>
                  <div class="item-price">$${item.price}</div>
                </div>
              </div>
            `).join('')}

            <div class="total">
              <h3 style="margin: 0 0 10px 0; color: #92400e;">Total: $${cartData.total}</h3>
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.whitlin.com'}/cart" class="button">
                Complete Your Order
              </a>
            </div>

            <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="color: #dc2626; margin: 0 0 10px 0;">⏰ Limited Time Offer</h3>
              <p style="color: #dc2626; margin: 0; line-height: 1.6;">
                Complete your order within 24 hours and get FREE shipping on your entire order!
              </p>
            </div>

            <p style="color: #666; line-height: 1.6; text-align: center;">
              Need help? Our customer service team is here to assist you with any questions.
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0 0 10px 0;">© 2025 ChicComet. All rights reserved.</p>
            <div class="unsubscribe">
              <a href="UNSUBSCRIBE_TOKEN">Unsubscribe</a> | 
              <a href="mailto:info@chiccomet.com">Contact Support</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      🛒 Your Cart is Waiting!
      
      Don't miss out on these amazing products!
      
      We noticed you left some items in your cart. These professional  Premium Linen products 
      are waiting for you to complete your order.
      
      Your Cart Items:
      ${cartData.items.map(item => `- ${item.name}: $${item.price}`).join('\n')}
      
      Total: $${cartData.total}
      
      ⏰ Limited Time Offer
      Complete your order within 24 hours and get FREE shipping on your entire order!
      
      Complete Your Order: ${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.whitlin.com'}/cart
      
      Need help? Our customer service team is here to assist you with any questions.
      
      © 2025 Whitlin. All rights reserved.
      Unsubscribe: UNSUBSCRIBE_TOKEN
      Contact Support: support@whitlin.com
    `
  }),

  // Promotional template
  promotional: (promoData: { title: string; description: string; discountCode?: string; discountPercent?: number }): EmailTemplate => ({
    subject: `🎉 ${promoData.title} - Exclusive Offer Inside!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${promoData.title} - Whitlin</title>
        <style>
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 40px 30px; text-align: center; }
          .content { padding: 40px 30px; }
          .footer { background-color: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 12px; }
          .button { display: inline-block; background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .promo-box { background: #fef3c7; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center; border: 2px dashed #f59e0b; }
          .discount-code { background: #f59e0b; color: white; padding: 10px 20px; border-radius: 6px; font-weight: bold; font-size: 18px; margin: 15px 0; display: inline-block; }
          .unsubscribe { margin-top: 20px; }
          .unsubscribe a { color: #f59e0b; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">🎉 ${promoData.title}</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Exclusive Member Offer</p>
          </div>
          <div class="content">
            <h2 style="color: #333; margin-bottom: 20px;">Special Offer Just for You!</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
              ${promoData.description}
            </p>
            
            <div class="promo-box">
              <h3 style="color: #92400e; margin: 0 0 15px 0;">🎁 Your Exclusive Discount</h3>
              ${promoData.discountCode ? `
                <p style="color: #92400e; margin: 0 0 15px 0;">Use code at checkout:</p>
                <div class="discount-code">${promoData.discountCode}</div>
              ` : ''}
              ${promoData.discountPercent ? `
                <p style="color: #92400e; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">
                  ${promoData.discountPercent}% OFF
                </p>
              ` : ''}
  <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.whitlin.com'}/products" class="button">                Shop Now & Save!
              </a>
            </div>

            <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="color: #dc2626; margin: 0 0 10px 0;">⏰ Limited Time Only</h3>
              <p style="color: #dc2626; margin: 0; line-height: 1.6;">
                This offer expires soon! Don't miss your chance to save on professional  Premium Linen products.
              </p>
            </div>

            <p style="color: #666; line-height: 1.6; text-align: center;">
              Questions about this offer? Contact our support team for assistance.
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0 0 10px 0;">© 2025 ChicComet. All rights reserved.</p>
            <div class="unsubscribe">
              <a href="UNSUBSCRIBE_TOKEN">Unsubscribe</a> | 
              <a href="mailto:info@chiccomet.com">Contact Support</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      🎉 ${promoData.title}
      
      Special Offer Just for You!
      
      ${promoData.description}
      
      🎁 Your Exclusive Discount
      ${promoData.discountCode ? `Use code at checkout: ${promoData.discountCode}` : ''}
      ${promoData.discountPercent ? `${promoData.discountPercent}% OFF` : ''}
      
      ⏰ Limited Time Only
      This offer expires soon! Don't miss your chance to save on professional  Premium Linen products.
      
      Shop Now & Save: ${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.whitlin.com'}/products
      
      Questions about this offer? Contact our support team for assistance.
      
      © 2025 Whitlin. All rights reserved.
      Unsubscribe: UNSUBSCRIBE_TOKEN
      Contact Support: support@whitlin.com
    `
  })
}
