import connectDB from './mongodb'
import Product from './models/Product'
import User from './models/User'
import Category from './models/Category'

const seedData = async () => {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

    // Clear existing data
    await Product.deleteMany({})
    await User.deleteMany({})
    await Category.deleteMany({})
    console.log('Cleared existing data')

    // 1. Seed Categories
    const techCategory = await Category.create({
      name: "Tech & Gadgets",
      description: "Premium tech accessories for the modern professional",
      isActive: true,
      sortOrder: 1,
      attributes: [{ name: "Color", type: "text", required: true }]
    })

    const drinkwareCategory = await Category.create({
      name: "Drinkware",
      description: "Sustainable and stylish bottles, mugs, and tumblers",
      isActive: true,
      sortOrder: 2,
      attributes: [{ name: "Capacity", type: "text", required: true }]
    })

    const officeCategory = await Category.create({
      name: "Office Essentials",
      description: "Notebooks, pens, and desk organizers",
      isActive: true,
      sortOrder: 3,
      attributes: [{ name: "Material", type: "text", required: false }]
    })

    const apparelCategory = await Category.create({
      name: "Apparel",
      description: "Custom branded hoodies, t-shirts, and caps",
      isActive: true,
      sortOrder: 4,
      attributes: [{ name: "Size", type: "select", options: ["S", "M", "L", "XL", "XXL"], required: true }]
    })

    const welcomeKitCategory = await Category.create({
      name: "Welcome Kits",
      description: "Curated onboarding boxes for new employees",
      isActive: true,
      sortOrder: 5,
      attributes: [{ name: "Theme", type: "text", required: false }]
    })

    console.log('Seeded categories')

    // 2. Seed Products
    const products = [
      // Tech & Gadgets
      {
        name: "Pro Wireless Charging Pad",
        category: techCategory._id,
        price: 85.00,
        image: "/images/tech-charger.jpg",
        // using placeholders or generic names, update with real images if available later
        rating: 4.8,
        reviews: 42,
        description: "Fast wireless charging pad with premium fabric finish. Customizable with your company logo. Supports Qi-enabled devices.",
        features: ["15W Fast Charging", "Premium Fabric Finish", "Overheat Protection", "Custom Logo Printing"],
        inStock: true,
        sku: "TECH-WCP-001",
        businessType: "B2B",
        minOrderQuantity: 10
      },
      {
        name: "Noise-Cancelling Headphones 700",
        category: techCategory._id,
        price: 299.00,
        image: "/images/tech-headphones.jpg",
        rating: 4.9,
        reviews: 28,
        description: "Premium over-ear noise-cancelling headphones. Perfect for focused work in busy offices.",
        features: ["Active Noise Cancellation", "30-hour Battery Life", "Bluetooth 5.0", "Built-in Microphone"],
        inStock: true,
        sku: "TECH-NCH-002",
        businessType: "B2B",
        minOrderQuantity: 5
      },

      // Drinkware
      {
        name: "Smart Temperature Bottle",
        category: drinkwareCategory._id,
        price: 45.00,
        image: "/images/drinkware-smartbottle.jpg",
        rating: 4.7,
        reviews: 150,
        description: "Insulated stainless steel bottle with digital temperature display. Keeps drinks hot for 12 hours or cold for 24 hours.",
        features: ["LED Temperature Display", "Double-wall Insulation", "Leak-proof Cap", "500ml Capacity"],
        inStock: true,
        sku: "DRK-STB-001",
        businessType: "BOTH"
      },
      {
        name: "Classic Ceramic Mug",
        category: drinkwareCategory._id,
        price: 12.00,
        image: "/images/drinkware-mug.jpg",
        rating: 4.5,
        reviews: 300,
        description: "Timeless ceramic mug, perfect for office coffee. Large printing area for branding.",
        features: ["Microwave Safe", "Dishwasher Safe", "350ml Capacity", "Matte Finish"],
        inStock: true,
        sku: "DRK-CCM-002",
        businessType: "B2B",
        minOrderQuantity: 50
      },

      // Office Essentials
      {
        name: "Premium Leather Notebook",
        category: officeCategory._id,
        price: 25.00,
        image: "/images/office-notebook.jpg",
        rating: 4.8,
        reviews: 85,
        description: "A5 hardcover notebook with vegan leather cover. 192 lined pages of premium ivory paper.",
        features: ["Vegan Leather Cover", "100gsm Ivory Paper", "Ribbon Bookmark", "Elastic Closure"],
        inStock: true,
        sku: "OFF-PLN-001",
        businessType: "BOTH"
      },
      {
        name: "Metal Rollerball Pen",
        category: officeCategory._id,
        price: 15.00,
        image: "/images/office-pen.jpg",
        rating: 4.6,
        reviews: 120,
        description: "Weighted metal rollerball pen for a smooth writing experience. Laser engravable.",
        features: ["Black Ink", "0.7mm Tip", "Metal Body", "Gift Box Included"],
        inStock: true,
        sku: "OFF-MRP-002",
        businessType: "B2B",
        minOrderQuantity: 100
      },

      // Apparel
      {
        name: "Eco-Fleece Hoodie",
        category: apparelCategory._id,
        price: 55.00,
        image: "/images/apparel-hoodie.jpg",
        rating: 4.9,
        reviews: 60,
        description: "Super soft hoodie made from recycled materials and organic cotton. Sustainable comfort.",
        features: ["Organic Cotton Blend", "Recycled Polyester", "Unisex Fit", "Kangaroo Pocket"],
        inStock: true,
        sku: "APP-EFH-001",
        businessType: "BOTH",
        attributes: [{ name: "Size", value: "L", type: "select" }]
      },
      {
        name: "Performance Polo Shirt",
        category: apparelCategory._id,
        price: 35.00,
        image: "/images/apparel-polo.jpg",
        rating: 4.7,
        reviews: 90,
        description: "Moisture-wicking polo shirt for corporate events and uniforms. Wrinkle-resistant fabric.",
        features: ["Moisture Wicking", "UV Protection", "Classic Fit", "Embroiderable"],
        inStock: true,
        sku: "APP-PPS-002",
        businessType: "B2B",
        minOrderQuantity: 20
      },

      // Welcome Kits
      {
        name: "Ultimate Onboarding Box",
        category: welcomeKitCategory._id,
        price: 150.00,
        image: "/images/kit-onboarding.jpg",
        rating: 5.0,
        reviews: 25,
        description: "The complete setup for new hires. Includes: Hoodie, Notebook, Pen, Bottle, and Stickers.",
        features: ["Fully Customizable box", "Includes 5 premium items", "Eco-friendly packaging"],
        inStock: true,
        sku: "KIT-UOB-001",
        businessType: "B2B",
        minOrderQuantity: 10
      },
      {
        name: "VIP Client Gift Set",
        category: welcomeKitCategory._id,
        price: 200.00,
        image: "/images/kit-vip.jpg",
        rating: 5.0,
        reviews: 15,
        description: "Impress your top clients with this luxury gift set. Includes: Premium Tech Organizer, Wireless Charger, and Insulated Tumbler.",
        features: ["Luxury Packaging", "Premium Tech Items", "Personalized Note Card"],
        inStock: true,
        sku: "KIT-VIP-002",
        businessType: "B2B",
        minOrderQuantity: 5
      }
    ]

    await Product.insertMany(products)
    console.log('Seeded products')

    // 3. Seed Users
    const users = [
      {
        name: "Admin User",
        email: "Admin@chiccomet.com", // Case matching request
        password: "Rahul6375@@@",
        role: "admin",
        status: "active",
        phone: "+971 50 000 0000",
        address: {
          street: "Business Bay",
          city: "Dubai",
          state: "Dubai",
          zipCode: "00000",
          country: "AE"
        },
        preferences: {
          emailNotifications: true,
          smsNotifications: true,
          marketingEmails: false
        },
        stats: {
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: null
        }
      },
      {
        name: "Corporate Buyer",
        email: "buyer@example.com",
        password: "password123",
        role: "customer",
        status: "active",
        phone: "+971 55 123 4567",
        address: {
          street: "Sheikh Zayed Road",
          city: "Dubai",
          state: "Dubai",
          zipCode: "00000",
          country: "AE"
        },
        preferences: {
          emailNotifications: true,
          smsNotifications: false,
          marketingEmails: true
        },
        stats: {
          totalOrders: 2,
          totalSpent: 2500.00,
          lastOrderDate: new Date("2024-01-15")
        }
      }
    ]

    await User.insertMany(users)
    console.log('Seeded users')

    console.log('Database seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedData()
