import connectDB from './mongodb'
import Product from './models/Product'
import User from './models/User'

const seedData = async () => {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

    // Clear existing data
    await Product.deleteMany({})
    await User.deleteMany({})
    console.log('Cleared existing data')

    // Seed Products
    const products = [
      {
        name: "Whitlin Expert Liss System",
        category: "Treatment Systems",
        price: 299.99,
        originalPrice: 349.99,
        image: "/images/expert-liss-system.jpeg",
        images: [
          "/images/expert-liss-system.jpeg",
          "/images/expert-liss-range.jpeg"
        ],
        rating: 4.8,
        reviews: 124,
        description: "Professional keratin straightening system for silky smooth hair. This advanced treatment system delivers salon-quality results at home with our premium keratin formula.",
        features: [
          "Professional-grade keratin formula",
          "Long-lasting straightening effect",
          "Safe for all hair types",
          "Includes complete application kit",
          "Results last up to 3 months"
        ],
        ingredients: [
          "Keratin Protein",
          "Hyaluronic Acid",
          "Argan Oil",
          "Vitamin E",
          "Natural Extracts"
        ],
        inStock: true,
        isNewProduct: true,
        isBestSeller: true,
        sku: "KG-ELS-001",
        weight: "500ml",
        size: "Professional Kit",
        stock: 50,
        status: "active"
      },
      {
        name: "Whitlin Inforcer Range",
        category: "Hair Care",
        price: 199.99,
        originalPrice: null,
        image: "/images/inforcer-range.jpeg",
        images: [
          "/images/inforcer-range.jpeg",
          "/images/inforcer-system.jpeg"
        ],
        rating: 4.6,
        reviews: 89,
        description: "Strengthening and fortifying hair care range designed to rebuild damaged hair from within. Perfect for chemically treated or damaged hair.",
        features: [
          "Deep strengthening formula",
          "Repairs damaged hair structure",
          "Prevents future damage",
          "Suitable for daily use",
          "Professional results"
        ],
        ingredients: [
          "Keratin Complex",
          "Collagen",
          "Biotin",
          "Amino Acids",
          "Natural Proteins"
        ],
        inStock: true,
        isNewProduct: false,
        isBestSeller: true,
        sku: "KG-IR-002",
        weight: "300ml",
        size: "Standard",
        stock: 75,
        status: "active"
      },
      {
        name: "Whitlin Nourishing System",
        category: "Treatment Systems",
        price: 249.99,
        originalPrice: 299.99,
        images: [
          "/images/nourishing-system.jpeg",
          "/images/nourishing-range.jpeg"
        ],
        rating: 4.7,
        reviews: 67,
        description: "Deep nourishing treatment for damaged hair. Restore moisture and vitality to your hair with our premium nourishing system.",
        features: [
          "Deep moisture restoration",
          "Repairs split ends",
          "Adds shine and softness",
          "Suitable for all hair types",
          "Professional results"
        ],
        ingredients: [
          "Keratin Protein",
          "Hyaluronic Acid",
          "Argan Oil",
          "Shea Butter",
          "Vitamin E"
        ],
        inStock: false,
        isNewProduct: false,
        isBestSeller: false,
        sku: "KG-NS-003",
        weight: "400ml",
        size: "Professional Kit",
        stock: 0,
        status: "out_of_stock"
      },
      {
        name: "Whitlin Repair Range",
        category: "Hair Care",
        price: 179.99,
        originalPrice: null,
        images: [
          "/images/repair-range.jpeg",
          "/images/repair-system.jpeg"
        ],
        rating: 4.5,
        reviews: 45,
        description: "Repair and restore damaged hair with our advanced repair range. Perfect for chemically treated or heat-damaged hair.",
        features: [
          "Advanced repair technology",
          "Restores hair structure",
          "Prevents future damage",
          "Adds strength and elasticity",
          "Professional results"
        ],
        ingredients: [
          "Keratin Complex",
          "Collagen",
          "Biotin",
          "Amino Acids",
          "Natural Proteins"
        ],
        inStock: true,
        isNewProduct: true,
        isBestSeller: false,
        sku: "KG-RR-004",
        weight: "250ml",
        size: "Standard",
        stock: 60
      },
      {
        name: "Whitlin Restructuring System",
        category: "Treatment Systems",
        price: 329.99,
        originalPrice: null,
        images: [
          "/images/restructuring-system.jpeg",
          "/images/restructuring-range.jpeg"
        ],
        rating: 4.9,
        reviews: 156,
        description: "Complete hair restructuring treatment that transforms your hair from the inside out. Our most advanced treatment system.",
        features: [
          "Complete hair restructuring",
          "Long-lasting results",
          "Safe for all hair types",
          "Professional application kit",
          "Results last up to 6 months"
        ],
        ingredients: [
          "Advanced Keratin Complex",
          "Hyaluronic Acid",
          "Argan Oil",
          "Vitamin E",
          "Natural Extracts"
        ],
        inStock: true,
        isNewProduct: false,
        isBestSeller: true,
        sku: "KG-RS-005",
        weight: "600ml",
        size: "Professional Kit",
        stock: 25
      },
      {
        name: "Whitlin Regenerating Range",
        category: "Hair Care",
        price: 159.99,
        originalPrice: 199.99,
        images: [
          "/images/regenerating-range.jpeg",
          "/images/regenerating-system.jpeg"
        ],
        rating: 4.4,
        reviews: 32,
        description: "Regenerate and revitalize your hair with our advanced regenerating range. Perfect for damaged and dull hair.",
        features: [
          "Hair regeneration technology",
          "Restores natural shine",
          "Improves hair texture",
          "Suitable for daily use",
          "Professional results"
        ],
        ingredients: [
          "Keratin Complex",
          "Collagen",
          "Biotin",
          "Amino Acids",
          "Natural Proteins"
        ],
        inStock: true,
        isNewProduct: false,
        isBestSeller: false,
        sku: "KG-RG-006",
        weight: "200ml",
        size: "Standard",
        stock: 40
      }
    ]

    await Product.insertMany(products)
    console.log('Seeded products')

    // Seed Users
    const users = [
      {
        name: "Admin User",
        email: "admin@whitlin.com",
        password: "admin123",
        role: "admin",
        status: "active",
        phone: "+1 (555) 000-0000",
        address: {
          street: "789 Admin St",
          city: "Admin City",
          state: "AC",
          zipCode: "00000",
          country: "US"
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
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "customer",
        status: "active",
        phone: "+1 (555) 123-4567",
        address: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "US"
        },
        preferences: {
          emailNotifications: true,
          smsNotifications: false,
          marketingEmails: true
        },
        stats: {
          totalOrders: 5,
          totalSpent: 1299.95,
          lastOrderDate: new Date("2024-01-15")
        }
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        role: "customer",
        status: "active",
        phone: "+1 (555) 987-6543",
        address: {
          street: "456 Oak Ave",
          city: "Dubai",
          state: "CA",
          zipCode: "90210",
          country: "US"
        },
        preferences: {
          emailNotifications: true,
          smsNotifications: true,
          marketingEmails: false
        },
        stats: {
          totalOrders: 3,
          totalSpent: 599.97,
          lastOrderDate: new Date("2024-01-14")
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
