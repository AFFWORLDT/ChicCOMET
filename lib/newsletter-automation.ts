import connectDB from '@/lib/mongodb'
import NewsletterSubscriber from '@/lib/models/NewsletterSubscriber'
import Newsletter from '@/lib/models/Newsletter'
import NewsletterAutomation from '@/lib/models/NewsletterAutomation'
import { sendNewsletterEmail } from '@/lib/email-service'
import { emailTemplates } from '@/lib/email-templates'

export interface AutomationTrigger {
  type: 'welcome' | 'abandoned_cart' | 'product_launch' | 'birthday' | 'anniversary'
  userId?: string
  email: string
  data?: any
}

export class NewsletterAutomationService {
  // Trigger welcome email for new subscribers
  static async triggerWelcomeEmail(email: string, name?: string) {
    try {
      await connectDB()
      
      const subscriber = await NewsletterSubscriber.findOne({ 
        email: email.toLowerCase().trim(),
        status: 'active'
      })

      if (!subscriber) {
        console.log(`Subscriber not found for welcome email: ${email}`)
        return
      }

      // Check if welcome email was already sent
      const existingWelcome = await Newsletter.findOne({
        type: 'welcome',
        'metadata.automationTrigger': `welcome_${subscriber._id}`,
        status: 'sent'
      })

      if (existingWelcome) {
        console.log(`Welcome email already sent for: ${email}`)
        return
      }

      // Create welcome newsletter
      const welcomeTemplate = emailTemplates.welcome({ 
        name: name || subscriber.firstName || 'Valued Customer', 
        email: subscriber.email 
      })

      const welcomeNewsletter = new Newsletter({
        title: 'Welcome to Whitlin',
        subject: welcomeTemplate.subject,
        content: welcomeTemplate.text,
        htmlContent: welcomeTemplate.html.replace(/UNSUBSCRIBE_TOKEN/g, subscriber.unsubscribeToken),
        type: 'welcome',
        status: 'draft',
        tags: ['welcome', 'automated'],
        segments: ['new-subscribers'],
        metadata: {
          createdBy: 'automation',
          lastModifiedBy: 'automation',
          automationTrigger: `welcome_${subscriber._id}`
        }
      })

      await welcomeNewsletter.save()

      // Send the welcome email
      await sendNewsletterEmail({
        to: subscriber.email,
        subject: welcomeTemplate.subject,
        htmlContent: welcomeTemplate.html.replace(/UNSUBSCRIBE_TOKEN/g, subscriber.unsubscribeToken),
        newsletterId: welcomeNewsletter._id.toString(),
        subscriberId: subscriber._id.toString()
      })

      // Update newsletter status
      welcomeNewsletter.status = 'sent'
      welcomeNewsletter.sentDate = new Date()
      welcomeNewsletter.recipientCount = 1
      await welcomeNewsletter.save()

      // Update subscriber's last email sent date
      subscriber.lastEmailSent = new Date()
      await subscriber.save()

      console.log(`Welcome email sent to: ${email}`)
      return { success: true, message: 'Welcome email sent successfully' }

    } catch (error) {
      console.error('Error sending welcome email:', error)
      return { success: false, error: error.message }
    }
  }

  // Trigger abandoned cart email
  static async triggerAbandonedCartEmail(email: string, cartItems: any[]) {
    try {
      await connectDB()
      
      const subscriber = await NewsletterSubscriber.findOne({ 
        email: email.toLowerCase().trim(),
        status: 'active'
      })

      if (!subscriber) {
        console.log(`Subscriber not found for abandoned cart email: ${email}`)
        return
      }

      // Check if abandoned cart email was already sent recently (within 24 hours)
      const recentAbandonedCart = await Newsletter.findOne({
        type: 'abandoned_cart',
        'metadata.automationTrigger': `abandoned_cart_${subscriber._id}`,
        status: 'sent',
        sentDate: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      })

      if (recentAbandonedCart) {
        console.log(`Abandoned cart email already sent recently for: ${email}`)
        return
      }

      // Calculate cart total
      const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

      // Create abandoned cart newsletter
      const abandonedCartTemplate = emailTemplates.abandonedCart({ 
        items: cartItems,
        total: total
      })

      const abandonedCartNewsletter = new Newsletter({
        title: 'Complete Your Order - Items Waiting in Cart',
        subject: abandonedCartTemplate.subject,
        content: abandonedCartTemplate.text,
        htmlContent: abandonedCartTemplate.html.replace(/UNSUBSCRIBE_TOKEN/g, subscriber.unsubscribeToken),
        type: 'abandoned_cart',
        status: 'draft',
        tags: ['abandoned-cart', 'automated'],
        segments: ['cart-abandoners'],
        metadata: {
          createdBy: 'automation',
          lastModifiedBy: 'automation',
          automationTrigger: `abandoned_cart_${subscriber._id}`
        }
      })

      await abandonedCartNewsletter.save()

      // Send the abandoned cart email
      await sendNewsletterEmail({
        to: subscriber.email,
        subject: abandonedCartTemplate.subject,
        htmlContent: abandonedCartTemplate.html.replace(/UNSUBSCRIBE_TOKEN/g, subscriber.unsubscribeToken),
        newsletterId: abandonedCartNewsletter._id.toString(),
        subscriberId: subscriber._id.toString()
      })

      // Update newsletter status
      abandonedCartNewsletter.status = 'sent'
      abandonedCartNewsletter.sentDate = new Date()
      abandonedCartNewsletter.recipientCount = 1
      await abandonedCartNewsletter.save()

      // Update subscriber's last email sent date
      subscriber.lastEmailSent = new Date()
      await subscriber.save()

      console.log(`Abandoned cart email sent to: ${email}`)
      return { success: true, message: 'Abandoned cart email sent successfully' }

    } catch (error) {
      console.error('Error sending abandoned cart email:', error)
      return { success: false, error: error.message }
    }
  }

  // Trigger product launch email
  static async triggerProductLaunchEmail(productData: any) {
    try {
      await connectDB()
      
      // Get all active subscribers
      const subscribers = await NewsletterSubscriber.find({ 
        status: 'active',
        'preferences.productUpdates': true
      })

      if (subscribers.length === 0) {
        console.log('No active subscribers found for product launch')
        return
      }

      // Create product launch newsletter
      const productLaunchTemplate = emailTemplates.productLaunch(productData)

      const productLaunchNewsletter = new Newsletter({
        title: `New Product Launch: ${productData.name}`,
        subject: productLaunchTemplate.subject,
        content: productLaunchTemplate.text,
        htmlContent: productLaunchTemplate.html,
        type: 'product_launch',
        status: 'draft',
        tags: ['product-launch', 'automated'],
        segments: ['product-updates'],
        metadata: {
          createdBy: 'automation',
          lastModifiedBy: 'automation',
          automationTrigger: `product_launch_${productData.id || 'new'}`
        }
      })

      await productLaunchNewsletter.save()

      // Send emails to all subscribers
      let sentCount = 0
      let failedCount = 0

      for (const subscriber of subscribers) {
        try {
          await sendNewsletterEmail({
            to: subscriber.email,
            subject: productLaunchTemplate.subject,
            htmlContent: productLaunchTemplate.html.replace(/UNSUBSCRIBE_TOKEN/g, subscriber.unsubscribeToken),
            newsletterId: productLaunchNewsletter._id.toString(),
            subscriberId: subscriber._id.toString()
          })

          // Update subscriber's last email sent date
          subscriber.lastEmailSent = new Date()
          await subscriber.save()

          sentCount++
        } catch (error) {
          console.error(`Error sending product launch email to ${subscriber.email}:`, error)
          failedCount++
        }
      }

      // Update newsletter status
      productLaunchNewsletter.status = 'sent'
      productLaunchNewsletter.sentDate = new Date()
      productLaunchNewsletter.recipientCount = sentCount
      await productLaunchNewsletter.save()

      console.log(`Product launch email sent to ${sentCount} subscribers, ${failedCount} failed`)
      return { 
        success: true, 
        message: `Product launch email sent to ${sentCount} subscribers`,
        sentCount,
        failedCount
      }

    } catch (error) {
      console.error('Error sending product launch email:', error)
      return { success: false, error: error.message }
    }
  }

  // Process scheduled newsletters
  static async processScheduledNewsletters() {
    try {
      await connectDB()
      
      const now = new Date()
      const scheduledNewsletters = await Newsletter.find({
        status: 'scheduled',
        scheduledDate: { $lte: now }
      })

      console.log(`Found ${scheduledNewsletters.length} scheduled newsletters to process`)

      for (const newsletter of scheduledNewsletters) {
        try {
          // Update status to sending
          newsletter.status = 'sending'
          await newsletter.save()

          // Get target subscribers
          const filter: any = { status: 'active' }
          
          if (newsletter.segments.length > 0) {
            filter.tags = { $in: newsletter.segments }
          }

          const subscribers = await NewsletterSubscriber.find(filter)
          const recipientCount = subscribers.length

          if (recipientCount === 0) {
            newsletter.status = 'failed'
            await newsletter.save()
            continue
          }

          // Send emails in batches
          const batchSize = 10
          let sentCount = 0
          let failedCount = 0

          for (let i = 0; i < subscribers.length; i += batchSize) {
            const batch = subscribers.slice(i, i + batchSize)
            
            const emailPromises = batch.map(async (subscriber) => {
              try {
                await sendNewsletterEmail({
                  to: subscriber.email,
                  subject: newsletter.subject,
                  htmlContent: newsletter.htmlContent.replace(/UNSUBSCRIBE_TOKEN/g, subscriber.unsubscribeToken),
                  newsletterId: newsletter._id.toString(),
                  subscriberId: subscriber._id.toString()
                })

                // Update subscriber's last email sent date
                subscriber.lastEmailSent = new Date()
                await subscriber.save()

                sentCount++
              } catch (error) {
                console.error(`Error sending email to ${subscriber.email}:`, error)
                failedCount++
              }
            })

            await Promise.all(emailPromises)

            // Add delay between batches
            if (i + batchSize < subscribers.length) {
              await new Promise(resolve => setTimeout(resolve, 1000))
            }
          }

          // Update newsletter status
          newsletter.status = 'sent'
          newsletter.sentDate = new Date()
          newsletter.recipientCount = sentCount
          await newsletter.save()

          console.log(`Scheduled newsletter "${newsletter.title}" sent to ${sentCount} subscribers`)

        } catch (error) {
          console.error(`Error processing scheduled newsletter ${newsletter._id}:`, error)
          newsletter.status = 'failed'
          await newsletter.save()
        }
      }

      return { 
        success: true, 
        message: `Processed ${scheduledNewsletters.length} scheduled newsletters` 
      }

    } catch (error) {
      console.error('Error processing scheduled newsletters:', error)
      return { success: false, error: error.message }
    }
  }

  // Clean up old automation data
  static async cleanupOldData() {
    try {
      await connectDB()
      
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      
      // Delete old failed newsletters
      const deletedFailed = await Newsletter.deleteMany({
        status: 'failed',
        createdAt: { $lt: thirtyDaysAgo }
      })

      // Delete old bounced subscribers
      const deletedBounced = await NewsletterSubscriber.deleteMany({
        status: 'bounced',
        updatedAt: { $lt: thirtyDaysAgo }
      })

      console.log(`Cleaned up ${deletedFailed.deletedCount} failed newsletters and ${deletedBounced.deletedCount} bounced subscribers`)
      
      return { 
        success: true, 
        message: `Cleaned up ${deletedFailed.deletedCount} failed newsletters and ${deletedBounced.deletedCount} bounced subscribers` 
      }

    } catch (error) {
      console.error('Error cleaning up old data:', error)
      return { success: false, error: error.message }
    }
  }
}
