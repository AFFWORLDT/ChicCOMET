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
function getProductImages(productName: string, category: string): string[] {
  const name = productName.toLowerCase()
  
  // Use Unsplash for high-quality product images
  // Images are sized 800x800 for consistency and optimized
  const baseUrl = 'https://images.unsplash.com/photo'
  
  // Map products to Unsplash image IDs - using real hospitality/bedding product photos
  const imageMap: { [key: string]: string[] } = {
    'bedsheet': [
      '1556911229-bb31c44d8251', // Luxury hotel bedsheet
      '1586105251267-828a5c76f6f1', // White bedsheet on bed
      '1625246333195-78d9cbd38a8f'  // Folded bedsheets
    ],
    'pillow': [
      '1541781774459-1c44556e42bd', // Luxury pillows
      '1571501679680-de32f1e7aad4', // Decorative pillows
      '1600596542810-ff3684dc50c8'  // Hotel pillows
    ],
    'duvet': [
      '1555041469-a586c61ea9bc', // Hotel duvet
      '1584622650111-993a573fbfb7', // Folded duvet
      '1598300042247-d088f8ab3a91'  // Luxury bedding set
    ],
    'towel': [
      '1544462815-739e5cee5343', // Stacked bath towels
      '1559827260-dc66d52bef19', // Folded towels
      '1563453392202-326b5ff0a887'  // Spa towels
    ],
    'bath': [
      '1570042225831-61b6329c9e6c', // Luxury bathroom
      '1600758208050-22f28f7d1f7a', // Hotel bathroom
      '1571501679680-de32f1e7aad4'  // Bath accessories
    ],
    'mat': [
      '1570042225831-61b6329c9e6c', // Bathroom mat
      '1600758208050-22f28f7d1f7a', // Floor mat
      '1563453392202-326b5ff0a887'  // Bathroom accessories
    ],
    'mattress': [
      '1555041469-a586c61ea9bc', // Hotel bed with mattress
      '1584622650111-993a573fbfb7', // Luxury mattress
      '1598300042247-d088f8ab3a91'  // Made bed
    ],
    'protector': [
      '1555041469-a586c61ea9bc', // Mattress protector on bed
      '1584622650111-993a573fbfb7', // Bedding layers
      '1598300042247-d088f8ab3a91'  // Hotel bed setup
    ],
    'curtain': [
      '1560448204-e02f11c3d0e2', // Luxury curtains
      '1586023493495-b813453f5f7a', // Window curtains
      '1578855694193-1c8e1d1b0a7f'  // Hotel room curtains
    ],
    'slipper': [
      '1570042225831-61b6329c9e6c', // Hotel slippers
      '1600758208050-22f28f7d1f7a', // Bathroom slippers
      '1563453392202-326b5ff0a887'  // Luxury slippers
    ],
    'bathrobe': [
      '1570042225831-61b6329c9e6c', // White bathrobe
      '1600758208050-22f28f7d1f7a', // Luxury bathrobe
      '1563453392202-326b5ff0a887'  // Spa bathrobe
    ],
    'runner': [
      '1555041469-a586c61ea9bc', // Bed runner decorative
      '1584622650111-993a573fbfb7', // Luxury bed runner
      '1598300042247-d088f8ab3a91'  // Decorative bed runner
    ],
    'cushion': [
      '1571501679680-de32f1e7aad4', // Decorative cushions
      '1541781774459-1c44556e42bd', // Luxury cushions
      '1600596542810-ff3684dc50c8'  // Throw pillows
    ],
    'cover': [
      '1571501679680-de32f1e7aad4', // Chair with cover
      '1584622650111-993a573fbfb7', // Table cover
      '1598300042247-d088f8ab3a91'  // Furniture covers
    ]
  }
  
  // Determine image set based on product name
  let imageSet: string[] = []
  
  if (name.includes('bedsheet') || name.includes('bed sheet')) {
    imageSet = imageMap['bedsheet']
  } else if (name.includes('pillow') && !name.includes('case')) {
    imageSet = imageMap['pillow']
  } else if (name.includes('pillow case') || name.includes('pillowcase')) {
    imageSet = imageMap['pillow'] // Pillow cases use pillow images
  } else if (name.includes('duvet')) {
    imageSet = imageMap['duvet']
  } else if (name.includes('towel') && !name.includes('bath mat')) {
    if (name.includes('spa')) {
      imageSet = imageMap['towel'] // Spa towels
    } else {
      imageSet = imageMap['towel']
    }
  } else if (name.includes('bath') && !name.includes('towel') && !name.includes('mat') && !name.includes('robe')) {
    imageSet = imageMap['bath']
  } else if (name.includes('bath mat') || (name.includes('mat') && name.includes('bath'))) {
    imageSet = imageMap['mat']
  } else if (name.includes('mattress') && !name.includes('protector')) {
    imageSet = imageMap['mattress']
  } else if (name.includes('protector')) {
    imageSet = imageMap['protector']
  } else if (name.includes('curtain')) {
    imageSet = imageMap['curtain']
  } else if (name.includes('slipper')) {
    imageSet = imageMap['slipper']
  } else if (name.includes('bathrobe')) {
    imageSet = imageMap['bathrobe']
  } else if (name.includes('runner')) {
    imageSet = imageMap['runner']
  } else if (name.includes('cushion')) {
    imageSet = imageMap['cushion']
  } else if (name.includes('cover')) {
    imageSet = imageMap['cover']
  }
  
  // Default to bedsheet images if no match
  if (imageSet.length === 0) {
    imageSet = imageMap['bedsheet']
  }
  
  // Return formatted Unsplash URLs with proper sizing and quality
  // Using 800x800 for consistent product display
  return imageSet.map(id => 
    `${baseUrl}-${id}?w=800&h=800&fit=crop&auto=format&q=85`
  )
}

// Pricing tiers based on luxury level
const PRICING = {
  'Semi Luxury': { base: 80, multiplier: 1 },
  'Upper Economy': { base: 60, multiplier: 0.8 },
  'Economy': { base: 40, multiplier: 0.6 },
  'Luxury': { base: 150, multiplier: 1.5 },
  'Hyper Luxury': { base: 250, multiplier: 2 }
}

// Size multipliers for pricing
const SIZE_MULTIPLIERS: { [key: string]: number } = {
  'Single': 1,
  'Double-Queen': 1.5,
  'Double-King': 1.8,
  'Medium': 0.5,
  'Large': 0.6,
  'XXXLarge': 0.8,
  'Queen/King': 1.5
}

function calculatePrice(category: string, productName: string, size?: string): number {
  const tier = PRICING[category as keyof typeof PRICING] || PRICING['Economy']
  const sizeMult = size ? (SIZE_MULTIPLIERS[size] || 1) : 1
  
  // Adjust based on product type
  let typeMultiplier = 1
  if (productName.includes('TOWEL') || productName.includes('MAT')) {
    typeMultiplier = 0.7
  } else if (productName.includes('DUVET')) {
    typeMultiplier = 1.5
  } else if (productName.includes('MATTRESS')) {
    typeMultiplier = 3
  } else if (productName.includes('BATHROBE')) {
    typeMultiplier = 1.8
  }
  
  return Math.round(tier.base * tier.multiplier * sizeMult * typeMultiplier)
}

const productsData = [
  // ========== SEMI LUXURY ==========
  {
    category: "Semi Luxury",
    products: [
      { name: "BEDSHEET SINGLE", size: "Single", material: "100% Virgin Cotton", tc: "300 TC" },
      { name: "BEDSHEET DOUBLE -QUEEN SIZE", size: "Double-Queen", material: "100% Virgin Cotton", tc: "300 TC" },
      { name: "BEDSHEET DOUBLE - KING SIZE", size: "Double-King", material: "100% Virgin Cotton", tc: "300 TC" },
      { name: "PILLOW CASE MEDIUM", size: "Medium", material: "100% Virgin Cotton", tc: "300 TC" },
      { name: "PILLOW CASE LARGE", size: "Large", material: "100% Virgin Cotton", tc: "300 TC" },
      { name: "PILLOW CASE XXXLARGE", size: "XXXLarge", material: "100% Virgin Cotton", tc: "300 TC" },
      { name: "SINGLE DUVET", size: "Single", material: "100% Virgin Cotton", tc: "300 TC" },
      { name: "DOUBLE DUVET", size: "Double-Queen", material: "100% Virgin Cotton", tc: "300 TC" },
      { name: "BED RUNNER SINGLE", size: "Single", material: "French Satin" },
      { name: "BED RUNNER QUEEN AND KING SIZE", size: "Queen/King", material: "French Satin" },
      { name: "CUSHION COVER WITH ZIPPER", size: "Standard", material: "French Satin" },
      { name: "BATH TOWEL", size: "Standard", material: "100% Virgin Cotton", gsm: "550 GSM" },
      { name: "HAND TOWEL", size: "Standard", material: "100% Virgin Cotton", gsm: "550 GSM" },
      { name: "FACE TOWEL", size: "Standard", material: "100% Virgin Cotton", gsm: "550 GSM" },
      { name: "BATH MAT", size: "Standard", material: "100% Virgin Cotton", gsm: "800 GSM" },
      { name: "POOL TOWEL", size: "Standard", material: "100% Virgin Cotton", gsm: "450 GSM" },
      { name: "SPA BATH TOWEL", size: "Standard", material: "100% Virgin Cotton", gsm: "550 GSM" },
      { name: "SPA HAND TOWEL", size: "Standard", material: "100% Virgin Cotton", gsm: "550 GSM" },
      { name: "SPA FACE TOWEL", size: "Standard", material: "100% Virgin Cotton", gsm: "550 GSM" },
      { name: "SPA BATH MAT", size: "Standard", material: "100% Virgin Cotton", gsm: "800 GSM" },
      { name: "MATRESS SINGLE", size: "Single", material: "Pocket Spring Bonded Foam(HD)" },
      { name: "MATRESS DOUBLE", size: "Double-Queen", material: "Pocket Spring Bonded Foam(HD)" },
      { name: "MATRESS PROTECTOR SINGLE", size: "Single", material: "Quilted In Micro Fibre With Rubber Coating 4 Sided Fitted" },
      { name: "MATRESS PROTECTOR DOUBLE", size: "Double-Queen", material: "Quilted In Micro Fibre With Rubber Coating 4 Sided Fitted" },
      { name: "CURTAINS WITH EYELET", size: "Standard", material: "Standard" },
      { name: "ROOM SLIPPERS TERRY PLAIN", size: "Standard", material: "Terry Plain" },
      { name: "ROOM SLIPPERS TERRY WITH LOGO PRINT", size: "Standard", material: "Terry With Logo Print" },
      { name: "BATHROBE", size: "Standard", material: "100% Virgin Cotton", gsm: "360 GSM" },
      { name: "CHAIR COVER", size: "Standard", material: "Standard" },
      { name: "TABLE COVER", size: "Standard", material: "Standard" },
    ]
  },
  
  // ========== UPPER ECONOMY ==========
  {
    category: "Upper Economy",
    products: [
      { name: "BEDSHEET SINGLE", size: "Single", material: "100% Virgin Cotton", tc: "200-210 TC" },
      { name: "BEDSHEET DOUBLE -QUEEN SIZE", size: "Double-Queen", material: "100% Virgin Cotton", tc: "200-211 TC" },
      { name: "BEDSHEET DOUBLE - KING SIZE", size: "Double-King", material: "100% Virgin Cotton", tc: "200-212 TC" },
      { name: "PILLOW CASE", size: "Standard", material: "100% Virgin Cotton", tc: "200-213 TC" },
      { name: "SINGLE DUVET", size: "Single", material: "100% Virgin Cotton", tc: "200-214 TC" },
      { name: "DOUBLE DUVET", size: "Double-Queen", material: "100% Virgin Cotton", tc: "200-215 TC" },
      { name: "PILLOW CASE", size: "Standard", material: "100% Virgin Cotton", tc: "200-216 TC" },
      { name: "PILLOW CASE", size: "Standard", material: "100% Virgin Cotton", tc: "200-217 TC" },
    ]
  },
  
  // ========== ECONOMY ==========
  {
    category: "Economy",
    products: [
      { name: "BEDSHEET SINGLE", size: "Single", material: "100% Polyester" },
      { name: "BEDSHEET DOUBLE -QUEEN SIZE", size: "Double-Queen", material: "100% Polyester" },
      { name: "BEDSHEET DOUBLE - KING SIZE", size: "Double-King", material: "100% Polyester" },
      { name: "PILLOW CASE", size: "Standard", material: "100% Polyester" },
      { name: "SINGLE DUVET", size: "Single", material: "100% Polyester" },
      { name: "DOUBLE DUVET", size: "Double-Queen", material: "100% Polyester" },
      { name: "BED RUNNER SINGLE", size: "Single", material: "100% Polyester" },
      { name: "BED RUNNER QUEEN AND KING SIZE", size: "Queen/King", material: "100% Polyester" },
      { name: "CUSHION COVER WITH ZIPPER", size: "Standard", material: "100% Polyester" },
      { name: "BATH TOWEL", size: "Standard", material: "Poly Cotton Or Recycle Cotton", gsm: "400-450 GSM" },
      { name: "HAND TOWEL", size: "Standard", material: "Poly Cotton Or Recycle Cotton", gsm: "100-200 GSM" },
      { name: "FACE TOWEL", size: "Standard", material: "Poly Cotton Or Recycle Cotton", gsm: "36-40 GSM" },
      { name: "BATH MAT", size: "Standard", material: "Poly Cotton Or Recycle Cotton", gsm: "200-250 GSM" },
      { name: "POOL TOWEL", size: "Standard", material: "Poly Cotton Or Recycle Cotton", gsm: "550 GSM" },
      { name: "SPA BATH TOWEL", size: "Standard", material: "Poly Cotton Or Recycle Cotton", gsm: "450 GSM" },
      { name: "SPA HAND TOWEL", size: "Standard", material: "Poly Cotton Or Recycle Cotton", gsm: "450 GSM" },
      { name: "SPA FACE TOWEL", size: "Standard", material: "Poly Cotton Or Recycle Cotton", gsm: "450 GSM" },
      { name: "SPA BATH MAT", size: "Standard", material: "Poly Cotton Or Recycle Cotton", gsm: "700 GSM" },
      { name: "PILLOW", size: "Standard", material: "Poly Cotton Or Recycle Cotton" },
      { name: "MATRESS SINGLE", size: "Single", material: "Pocket Spring Bonded Foam(HD)" },
      { name: "MATRESS DOUBLE", size: "Double-Queen", material: "Pocket Spring Bonded Foam(HD)" },
      { name: "MATRESS PROTECTOR SINGLE", size: "Single", material: "Terry With Elastic" },
      { name: "MATRESS PROTECTOR DOUBLE", size: "Double-Queen", material: "Terry With Elastic" },
      { name: "CURTAINS WITH EYELET", size: "Standard", material: "100% Polyester" },
      { name: "ROOM SLIPPERS", size: "Standard", material: "Non Woven Recycleable" },
    ]
  },
  
  // ========== LUXURY ==========
  {
    category: "Luxury",
    products: [
      { name: "BEDSHEET SINGLE", size: "Single", material: "100% Virgin Cotton", tc: "400 TC" },
      { name: "BEDSHEET DOUBLE -QUEEN SIZE", size: "Double-Queen", material: "100% Virgin Cotton", tc: "400 TC" },
      { name: "BEDSHEET DOUBLE - KING SIZE", size: "Double-King", material: "100% Virgin Cotton", tc: "400 TC" },
      { name: "PILLOW CASE MEDIUM", size: "Medium", material: "100% Virgin Cotton", tc: "400 TC" },
      { name: "PILLOW CASE LARGE", size: "Large", material: "100% Virgin Cotton", tc: "400 TC" },
      { name: "PILLOW CASE XXXLARGE", size: "XXXLarge", material: "100% Virgin Cotton", tc: "400 TC" },
      { name: "SINGLE DUVET", size: "Single", material: "100% Virgin Cotton", tc: "400 TC" },
      { name: "DOUBLE DUVET", size: "Double-Queen", material: "100% Virgin Cotton", tc: "400 TC" },
      { name: "BED RUNNER SINGLE", size: "Single", material: "Fusion / Embroidery" },
      { name: "BED RUNNER QUEEN AND KING SIZE", size: "Queen/King", material: "Fusion / Embroidery" },
      { name: "CUSHION COVER WITH ZIPPER", size: "Standard", material: "Fusion / Embroidery" },
      { name: "BATH TOWEL", size: "Standard", material: "100% Virgin Cotton", gsm: "650 GSM" },
      { name: "HAND TOWEL", size: "Standard", material: "100% Virgin Cotton", gsm: "650 GSM" },
      { name: "FACE TOWEL", size: "Standard", material: "100% Virgin Cotton", gsm: "650 GSM" },
      { name: "BATH MAT", size: "Standard", material: "100% Virgin Cotton", gsm: "900 GSM" },
      { name: "POOL TOWEL", size: "Standard", material: "100% Virgin Cotton", gsm: "550 GSM" },
      { name: "SPA BATH TOWEL", size: "Standard", material: "100% Virgin Cotton", gsm: "550 GSM" },
      { name: "SPA HAND TOWEL", size: "Standard", material: "100% Virgin Cotton", gsm: "550 GSM" },
      { name: "SPA FACE TOWEL", size: "Standard", material: "100% Virgin Cotton", gsm: "550 GSM" },
      { name: "SPA BATH MAT", size: "Standard", material: "100% Virgin Cotton", gsm: "800 GSM" },
      { name: "MATRESS SINGLE", size: "Single", material: "Pocket Spring Bonded Foam(HD)" },
      { name: "MATRESS DOUBLE", size: "Double-Queen", material: "Pocket Spring Bonded Foam(HD)" },
      { name: "MATRESS PROTECTOR SINGLE", size: "Single", material: "Quilted In Micro Fibre With Rubber Coating 4 Sided Fitted" },
      { name: "MATRESS PROTECTOR DOUBLE", size: "Double-Queen", material: "Quilted In Micro Fibre With Rubber Coating 4 Sided Fitted" },
      { name: "CURTAINS WITH EYELET", size: "Standard", material: "Standard" },
      { name: "ROOM SLIPPERS TERRY PLAIN", size: "Standard", material: "Terry Plain" },
      { name: "ROOM SLIPPERS TERRY WITH LOGO PRINT", size: "Standard", material: "Terry With Logo Print" },
      { name: "BATHROBE", size: "Standard", material: "100% Virgin Cotton", gsm: "360 GSM" },
      { name: "CHAIR COVER", size: "Standard", material: "Standard" },
      { name: "TABLE COVER", size: "Standard", material: "Standard" },
    ]
  },
  
  // ========== HYPER LUXURY ==========
  {
    category: "Hyper Luxury",
    products: [
      { name: "BEDSHEET SINGLE", size: "Single", material: "100% Virgin Cotton", tc: "600 TC" },
      { name: "BEDSHEET DOUBLE -QUEEN SIZE", size: "Double-Queen", material: "100% Virgin Cotton", tc: "600 TC" },
      { name: "BEDSHEET DOUBLE - KING SIZE", size: "Double-King", material: "100% Virgin Cotton", tc: "600 TC" },
      { name: "PILLOW CASE MEDIUM", size: "Medium", material: "100% Virgin Cotton", tc: "600 TC" },
      { name: "PILLOW CASE LARGE", size: "Large", material: "100% Virgin Cotton", tc: "600 TC" },
      { name: "PILLOW CASE XXXLARGE", size: "XXXLarge", material: "100% Virgin Cotton", tc: "600 TC" },
      { name: "SINGLE DUVET", size: "Single", material: "100% Virgin Cotton", tc: "600 TC" },
      { name: "DOUBLE DUVET", size: "Double-Queen", material: "100% Virgin Cotton", tc: "600 TC" },
      { name: "FEATHER PILLOW", size: "Standard", material: "Feather", tc: "100 TC" },
      { name: "NORMAL PILLOW", size: "Standard", material: "Normal", tc: "100 TC" },
    ]
  }
]

async function seedProducts() {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

    // Get categories
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

    // Create products by category
    for (const categoryData of productsData) {
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
        const price = calculatePrice(categoryData.category, prod.name, prod.size)
        const originalPrice = Math.round(price * 1.2) // 20% markup for original price
        
        // Build description
        let description = `${prod.name}`
        if (prod.material) description += ` - ${prod.material}`
        if (prod.tc) description += `, ${prod.tc}`
        if (prod.gsm) description += `, ${prod.gsm}`
        if (prod.size && prod.size !== "Standard") description += `, Size: ${prod.size}`
        
        // Build attributes
        const attributes: any[] = []
        if (prod.size) attributes.push({ name: "Size", value: prod.size, type: "size" })
        if (prod.material) attributes.push({ name: "Material", value: prod.material, type: "text" })
        if (prod.tc) attributes.push({ name: "Thread Count", value: prod.tc, type: "text" })
        if (prod.gsm) attributes.push({ name: "GSM", value: prod.gsm, type: "text" })
        
        // Generate SKU
        const sku = generateSKU(categoryData.category, prod.name, i + 1)
        
        // Determine if best seller (mark some popular items)
        const isBestSeller = prod.name.includes('BEDSHEET') || 
                            prod.name.includes('TOWEL') || 
                            prod.name.includes('PILLOW')
        
        // Get appropriate images for this product
        const productImages = getProductImages(prod.name, categoryData.category)
        
        const product = new Product({
          name: prod.name,
          category: category._id,
          price: price,
          originalPrice: originalPrice,
          description: description,
          image: productImages[0] || '/placeholder.jpg',
          images: productImages.length > 0 ? productImages : ['/placeholder.jpg'],
          rating: 4.5 + Math.random() * 0.5, // 4.5 to 5.0
          reviews: Math.floor(Math.random() * 150) + 20,
          sku: sku,
          inStock: true,
          stock: Math.floor(Math.random() * 100) + 20,
          status: 'active',
          attributes: attributes,
          isNewProduct: Math.random() > 0.8, // 20% chance
          isBestSeller: isBestSeller,
          size: prod.size !== "Standard" ? prod.size : undefined,
          weight: prod.gsm || undefined
        })

        await product.save()
        console.log(`✓ ${prod.name} - AED ${price} (${sku})`)
        totalProducts++
      }
    }

    console.log(`\n✅ Successfully created ${totalProducts} products!`)
    process.exit(0)
  } catch (error) {
    console.error('Error seeding products:', error)
    process.exit(1)
  }
}

seedProducts()

