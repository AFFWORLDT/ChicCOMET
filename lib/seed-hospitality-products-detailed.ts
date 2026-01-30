import connectDB from './mongodb'
import Product from './models/Product'
import Category from './models/Category'

// Helper function to generate SKU
function generateSKU(category: string, productName: string, index: number): string {
  const prefix = category.substring(0, 2).toUpperCase()
  const cleanName = productName
    .replace(/[^a-z0-9]/gi, '')
    .substring(0, 4)
    .toUpperCase()
  return `${prefix}-${cleanName}-${String(index).padStart(3, '0')}`
}

// Helper function to get product images based on product type
function getProductImages(productName: string): string[] {
  const name = productName.toLowerCase()
  const baseUrl = 'https://images.unsplash.com/photo'
  
  const imageMap: { [key: string]: string[] } = {
    'bedsheet': [
      '1556911229-bb31c44d8251', '1586105251267-828a5c76f6f1', '1625246333195-78d9cbd38a8f'
    ],
    'pillow': [
      '1541781774459-1c44556e42bd', '1571501679680-de32f1e7aad4', '1600596542810-ff3684dc50c8'
    ],
    'duvet': [
      '1555041469-a586c61ea9bc', '1584622650111-993a573fbfb7', '1598300042247-d088f8ab3a91'
    ],
    'towel': [
      '1544462815-739e5cee5343', '1559827260-dc66d52bef19', '1563453392202-326b5ff0a887'
    ],
    'mattress': [
      '1555041469-a586c61ea9bc', '1584622650111-993a573fbfb7', '1598300042247-d088f8ab3a91'
    ],
    'protector': [
      '1555041469-a586c61ea9bc', '1584622650111-993a573fbfb7', '1598300042247-d088f8ab3a91'
    ],
    'runner': [
      '1555041469-a586c61ea9bc', '1584622650111-993a573fbfb7', '1598300042247-d088f8ab3a91'
    ],
    'cover': [
      '1571501679680-de32f1e7aad4', '1584622650111-993a573fbfb7', '1598300042247-d088f8ab3a91'
    ]
  }
  
  let imageSet: string[] = []
  if (name.includes('bedsheet')) imageSet = imageMap['bedsheet']
  else if (name.includes('pillow')) imageSet = imageMap['pillow']
  else if (name.includes('duvet')) imageSet = imageMap['duvet']
  else if (name.includes('towel')) imageSet = imageMap['towel']
  else if (name.includes('mattress')) imageSet = imageMap['mattress']
  else if (name.includes('protector')) imageSet = imageMap['protector']
  else if (name.includes('runner')) imageSet = imageMap['runner']
  else if (name.includes('cover')) imageSet = imageMap['cover']
  else imageSet = imageMap['bedsheet']
  
  return imageSet.map(id => `${baseUrl}-${id}?w=800&h=800&fit=crop&auto=format&q=85`)
}

// Detailed products based on catalog
const detailedProducts = [
  // BED LINEN - 300 TC
  {
    category: "Semi Luxury",
    products: [
      {
        name: "Bedsheet Single Bed",
        description: "Hotel-quality bed linen designed for comfort, durability, and elegance. Made from 100% Virgin Cotton with 300 Thread Count.",
        dimensions: "76 X 114 Inches",
        material: "100% VIRGIN COTTON",
        tc: "300",
        gsm: null,
        price: 120
      },
      {
        name: "Bedsheet Queen Size",
        description: "Premium bed linen trusted by top hotels across the UAE. Crafted from 100% Virgin Cotton with 300 Thread Count for ultimate comfort.",
        dimensions: "90 X 114 Inches",
        material: "100% VIRGIN COTTON",
        tc: "300",
        gsm: null,
        price: 180
      },
      {
        name: "Bedsheet King Size",
        description: "Luxury bed linen that elevates guest experiences. Made from 100% Virgin Cotton with 300 Thread Count premium quality.",
        dimensions: "110 x 114 Inches",
        material: "100% VIRGIN COTTON",
        tc: "300",
        gsm: null,
        price: 220
      },
      {
        name: "Medium Pillow Case",
        description: "Premium pillow case crafted from 100% Virgin Cotton with 300 Thread Count. Designed for comfort and durability.",
        dimensions: "19X29X6 Inches",
        material: "100% VIRGIN COTTON",
        tc: "300",
        gsm: null,
        price: 45
      },
      {
        name: "Large Pillow Case",
        description: "Luxury large pillow case made from 100% Virgin Cotton with 300 Thread Count. Perfect for hotel rooms.",
        dimensions: "21X31X6 Inches",
        material: "100% VIRGIN COTTON",
        tc: "300",
        gsm: null,
        price: 55
      },
      {
        name: "XXXLarge Pillow Case",
        description: "Extra large pillow case crafted from 100% Virgin Cotton with 300 Thread Count. Premium hotel quality.",
        dimensions: "22X36X6 Inches",
        material: "100% VIRGIN COTTON",
        tc: "300",
        gsm: null,
        price: 65
      },
      {
        name: "Single Duvet",
        description: "Premium single duvet made from 100% Virgin Cotton with 300 Thread Count. Designed for ultimate comfort.",
        dimensions: "64X94X6 Inches",
        material: "100% VIRGIN COTTON",
        tc: "300",
        gsm: null,
        price: 140
      },
      {
        name: "Double Duvet (Queen Size)",
        description: "Luxury queen size duvet crafted from 100% Virgin Cotton with 300 Thread Count. Custom dimensions available.",
        dimensions: "As Per Client",
        material: "100% VIRGIN COTTON",
        tc: "300",
        gsm: null,
        price: 200
      },
      {
        name: "Double Duvet (King Size)",
        description: "Premium king size duvet made from 100% Virgin Cotton with 300 Thread Count. Hotel-grade quality.",
        dimensions: "92X106X8 Inches",
        material: "100% VIRGIN COTTON",
        tc: "300",
        gsm: null,
        price: 250
      },
      {
        name: "Single Duvet Cover",
        description: "Premium duvet cover crafted from 100% Virgin Cotton. Easy to maintain and elegant design.",
        dimensions: "64X94X6 Inches",
        material: "100% VIRGIN COTTON",
        tc: null,
        gsm: null,
        price: 120
      },
      {
        name: "Double Duvet Cover",
        description: "Luxury double duvet cover made from 100% Virgin Cotton. Perfect for hotel and hospitality use.",
        dimensions: "92X106X8 Inches",
        material: "100% VIRGIN COTTON",
        tc: null,
        gsm: null,
        price: 180
      },
      {
        name: "Mattress Single",
        description: "Premium single mattress with Pocket Spring Bonded Foam (HD). Designed for hotel comfort and durability.",
        dimensions: "36X72X8 Inches",
        material: "Pocket Spring Bonded Foam (HD)",
        tc: null,
        gsm: null,
        price: 350
      },
      {
        name: "Mattress Protector Double",
        description: "Double mattress protector with Pocket Spring Bonded Foam (HD). Protects and enhances mattress longevity.",
        dimensions: "72X78X8 Inches",
        material: "Pocket Spring Bonded Foam (HD)",
        tc: null,
        gsm: null,
        price: 280
      },
      {
        name: "Bed Runner Single",
        description: "Elegant bed runner crafted from 100% Virgin Cotton. Custom dimensions available to fit your needs.",
        dimensions: "As Per Client",
        material: "100% VIRGIN COTTON",
        tc: null,
        gsm: null,
        price: 85
      },
      {
        name: "Bed Runner Queen & King Size",
        description: "Premium bed runner for queen and king size beds. Made from 100% Virgin Cotton with custom dimensions.",
        dimensions: "As Per Client",
        material: "100% VIRGIN COTTON",
        tc: null,
        gsm: null,
        price: 120
      },
      {
        name: "Mattress Protector Double",
        description: "Quilted mattress protector in microfiber with rubber coating, 4-sided fitted. Provides superior protection.",
        dimensions: "72X78X8 Inches",
        material: "Quilted in Microfiber Rubber Coating 4 Sided Fitted",
        tc: null,
        gsm: null,
        price: 150
      },
      {
        name: "Mattress Protector Single",
        description: "Single mattress protector quilted in microfiber with rubber coating, 4-sided fitted design.",
        dimensions: "36X72X8 Inches",
        material: "Quilted in Microfiber Rubber Coating 4 Sided Fitted",
        tc: null,
        gsm: null,
        price: 110
      }
    ]
  },
  
  // BATH LINEN
  {
    category: "Semi Luxury",
    products: [
      {
        name: "Bath Towels",
        description: "Top of the line bath linen providing premium quality bath towels. Made from 100% Virgin Cotton with 550 GSM for superior absorbency.",
        dimensions: "30 X 60 Inches",
        material: "100% VIRGIN COTTON",
        tc: null,
        gsm: "550",
        price: 89
      },
      {
        name: "Hand Towels",
        description: "Premium hand towels crafted from 100% Virgin Cotton with 550 GSM. Highly absorbent and soft to touch.",
        dimensions: "16 x 24 Inches",
        material: "100% VIRGIN COTTON",
        tc: null,
        gsm: "550",
        price: 45
      },
      {
        name: "Face Towels",
        description: "Luxury face towels made from 100% Virgin Cotton with 550 GSM. Gentle on skin with excellent absorbency.",
        dimensions: "12 X 12 Inches",
        material: "100% VIRGIN COTTON",
        tc: null,
        gsm: "550",
        price: 35
      },
      {
        name: "Pool Towel",
        description: "Wrap yourself in comfort with our premium pool towels, crafted for maximum absorbency and quick drying. Designed to elevate your poolside experience with a touch of elegance.",
        dimensions: "36 X 72 Inches",
        material: "100% VIRGIN COTTON",
        tc: null,
        gsm: "450",
        price: 75
      },
      {
        name: "SPA Bath Towel",
        description: "Indulge in pure relaxation with our Special SPA Towel Collection - crafted from ultra-soft, highly absorbent linen for a serene, spa-like experience every time.",
        dimensions: "30 X 60 Inches",
        material: "100% VIRGIN COTTON",
        tc: null,
        gsm: "550",
        price: 95
      },
      {
        name: "SPA Hand Towel",
        description: "SPA collection hand towel made from ultra-soft 100% Virgin Cotton. Perfect for spa and wellness facilities.",
        dimensions: "16 x 24 Inches",
        material: "100% VIRGIN COTTON",
        tc: null,
        gsm: "550",
        price: 50
      },
      {
        name: "SPA Face Towel",
        description: "Luxury SPA face towel crafted from 100% Virgin Cotton. Ultra-soft for gentle spa treatments.",
        dimensions: "12 X 12 Inches",
        material: "100% VIRGIN COTTON",
        tc: null,
        gsm: "550",
        price: 40
      },
      {
        name: "SPA Bath Mat",
        description: "Premium SPA bath mat made from 100% Virgin Cotton with 450 GSM. Non-slip and highly absorbent.",
        dimensions: "20 X 30 Inches",
        material: "100% VIRGIN COTTON",
        tc: null,
        gsm: "450",
        price: 65
      },
      {
        name: "Bath Mat",
        description: "Premium bath mat crafted from 100% Virgin Cotton. Non-slip design with excellent absorbency.",
        dimensions: "20 X 30 Inches",
        material: "100% VIRGIN COTTON",
        tc: null,
        gsm: "800",
        price: 75
      }
    ]
  },
  
  // FURNITURE LINEN
  {
    category: "Semi Luxury",
    products: [
      {
        name: "Table Cover",
        description: "Protect your surfaces in style with our premium linen table covers. Whether for everyday dining or special gatherings, they bring a refined, natural touch to any setting. Crafted for both beauty and function.",
        dimensions: "Various Sizes Available",
        material: "100% VIRGIN COTTON",
        tc: null,
        gsm: null,
        price: 95
      },
      {
        name: "Chair Cover",
        description: "Give your chairs a fresh, elegant look with our tailored linen chair covers. Designed for both protection and style, they bring a refined finish to any space. Elevate your living spaces with premium furniture linen.",
        dimensions: "Various Sizes Available",
        material: "100% VIRGIN COTTON",
        tc: null,
        gsm: null,
        price: 85
      }
    ]
  }
]

async function seedDetailedProducts() {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

    const categories = await Category.find({})
    console.log(`Found ${categories.length} categories`)

    if (categories.length === 0) {
      console.log('No categories found. Please run seed-hospitality-categories first.')
      return
    }

    // Clear existing products
    await Product.deleteMany({})
    console.log('Cleared existing products\n')

    let totalProducts = 0

    for (const categoryData of detailedProducts) {
      const category = categories.find(c => 
        c.name.toLowerCase() === categoryData.category.toLowerCase()
      )

      if (!category) {
        console.warn(`Category "${categoryData.category}" not found, skipping...`)
        continue
      }

      console.log(`\n=== Creating products for: ${categoryData.category} ===`)
      
      for (let i = 0; i < categoryData.products.length; i++) {
        const prod = categoryData.products[i]
        const originalPrice = Math.round(prod.price * 1.25)
        
        // Extract size from product name
        const extractSize = (name: string): string => {
          const nameLower = name.toLowerCase()
          if (nameLower.includes('xxxlarge') || nameLower.includes('xxx large')) return 'XXXLarge'
          if (nameLower.includes('king size') || nameLower.includes('king')) return 'King'
          if (nameLower.includes('queen size') || nameLower.includes('queen')) return 'Queen'
          if (nameLower.includes('double')) return 'Double'
          if (nameLower.includes('single')) return 'Single'
          if (nameLower.includes('large')) return 'Large'
          if (nameLower.includes('medium')) return 'Medium'
          return 'Standard'
        }
        
        const productSize = extractSize(prod.name)
        
        // Build detailed description
        let description = prod.description
        if (prod.tc) description += ` Thread Count: ${prod.tc} TC.`
        if (prod.gsm) description += ` Weight: ${prod.gsm} GSM.`
        description += ` Dimensions: ${prod.dimensions}.`
        
        // Build attributes
        const attributes: any[] = [
          { name: "Brand", value: "WHITLIN", type: "text" },
          { name: "Material", value: prod.material, type: "text" },
          { name: "Dimensions", value: prod.dimensions, type: "text" },
          { name: "Size", value: productSize, type: "size" }
        ]
        if (prod.gsm) attributes.push({ name: "GSM", value: `${prod.gsm} GSM`, type: "text" })
        
        // Generate SKU
        const sku = generateSKU(categoryData.category, prod.name, i + 1)
        
        // Get images
        const productImages = getProductImages(prod.name)
        
        // Determine if best seller
        const isBestSeller = prod.name.toLowerCase().includes('bedsheet') || 
                            prod.name.toLowerCase().includes('towel') || 
                            prod.name.toLowerCase().includes('duvet')
        
        const product = new Product({
          name: prod.name,
          category: category._id,
          price: prod.price,
          originalPrice: originalPrice,
          description: description,
          image: productImages[0] || '/placeholder.jpg',
          images: productImages.length > 0 ? productImages : ['/placeholder.jpg'],
          rating: 4.5 + Math.random() * 0.5,
          reviews: Math.floor(Math.random() * 150) + 20,
          sku: sku,
          inStock: true,
          stock: Math.floor(Math.random() * 100) + 20,
          status: 'active',
          attributes: attributes,
          isNewProduct: Math.random() > 0.85,
          isBestSeller: isBestSeller,
          size: prod.dimensions,
          weight: prod.gsm || undefined
        })

        await product.save()
        console.log(`✓ ${prod.name} - AED ${prod.price} (${sku})`)
        totalProducts++
      }
    }

    console.log(`\n✅ Successfully created ${totalProducts} products with detailed specifications!`)
    process.exit(0)
  } catch (error) {
    console.error('Error seeding products:', error)
    process.exit(1)
  }
}

seedDetailedProducts()

