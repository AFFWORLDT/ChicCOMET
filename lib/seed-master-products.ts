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

function getProductImages(productName: string): string[] {
  const name = productName.toLowerCase()
  const baseUrl = 'https://images.unsplash.com/photo'

  // Abstract patterns / textile closeups for a premium feel
  const luxuryTextures = [
    '1528459801416-a9e53bbf4e17', // light linen texture
    '1550581190-9c6160974e58', // white fabric wave
    '1504917595217-d4dc5e98084d'  // folded white cloth
  ]

  // Assign specific images based on keywords
  if (name.includes('bedsheet')) return ['1584100936595-c06ee1b3cc98', '1522771753033-d5806ac12100']
  if (name.includes('pillow')) return ['1584100936555-d4560b37e868', '1592394625890-76903bd8d052']
  if (name.includes('duvet')) return ['1522771930-78e687830b14', '1568481483-e29d74f762f6']
  if (name.includes('towel')) return ['1616489953240-a92e1858c89b', '1566438480900-0609827a44f8']
  if (name.includes('mat') && !name.includes('mattress')) return ['1584622650111-993a573fbfb7']
  if (name.includes('mattress')) return ['1631049552057-403cdb8f0658']
  if (name.includes('robe') || name.includes('bathrobe')) return ['1584622650111-993a573fbfb7'] // placeholder

  return luxuryTextures.map(id => `${baseUrl}-${id}?auto=format&fit=crop&w=800&q=80`)
}

// Master Product Data
const masterProducts = [
  // === HYPER LUXURY (600 TC) ===
  {
    category: "Hyper Luxury",
    products: [
      { name: "Bedsheet Single", material: "100% Virgin Cotton", tc: "600 TC", price: 250, size: "Single" },
      { name: "Bedsheet Double - Queen Size", material: "100% Virgin Cotton", tc: "600 TC", price: 350, size: "Queen" },
      { name: "Bedsheet Double - King Size", material: "100% Virgin Cotton", tc: "600 TC", price: 380, size: "King" },
      { name: "Pillow Case Medium", material: "100% Virgin Cotton", tc: "600 TC", price: 80, size: "Medium" },
      { name: "Pillow Case Large", material: "100% Virgin Cotton", tc: "600 TC", price: 90, size: "Large" },
      { name: "Pillow Case XXXLarge", material: "100% Virgin Cotton", tc: "600 TC", price: 100, size: "XXXLarge" },
      { name: "Single Duvet", material: "100% Virgin Cotton", tc: "600 TC", price: 400, size: "Single" },
      { name: "Double Duvet", material: "100% Virgin Cotton", tc: "600 TC", price: 550, size: "Double" },
      { name: "Feather Pillow", material: "Feather", tc: "100 TC", price: 150, size: "Standard" },
      { name: "Normal Pillow", material: "Synthetic", tc: "100 TC", price: 60, size: "Standard" }
    ]
  },

  // === LUXURY (400 TC) ===
  {
    category: "Luxury",
    products: [
      { name: "Bedsheet Single", material: "100% Virgin Cotton", tc: "400 TC", price: 180, size: "Single" },
      { name: "Bedsheet Double - Queen Size", material: "100% Virgin Cotton", tc: "400 TC", price: 280, size: "Queen" },
      { name: "Bedsheet Double - King Size", material: "100% Virgin Cotton", tc: "400 TC", price: 320, size: "King" },
      { name: "Pillow Case Medium", material: "100% Virgin Cotton", tc: "400 TC", price: 60, size: "Medium" },
      { name: "Pillow Case Large", material: "100% Virgin Cotton", tc: "400 TC", price: 70, size: "Large" },
      { name: "Pillow Case XXXLarge", material: "100% Virgin Cotton", tc: "400 TC", price: 80, size: "XXXLarge" },
      { name: "Single Duvet", material: "100% Virgin Cotton", tc: "400 TC", price: 300, size: "Single" },
      { name: "Double Duvet", material: "100% Virgin Cotton", tc: "400 TC", price: 450, size: "Double" },
      { name: "Bed Runner Single", material: "Fusion / Embroidery", price: 120, size: "Single" },
      { name: "Bed Runner Queen & King", material: "Fusion / Embroidery", price: 150, size: "Queen/King" },
      { name: "Cushion Cover with Zipper", material: "Fusion / Embroidery", price: 45, size: "Standard" },
      { name: "Bath Towel", material: "100% Virgin Cotton", gsm: "650 GSM", price: 110, size: "Large" },
      { name: "Hand Towel", material: "100% Virgin Cotton", gsm: "650 GSM", price: 55, size: "Standard" },
      { name: "Face Towel", material: "100% Virgin Cotton", gsm: "650 GSM", price: 35, size: "Small" },
      { name: "Bath Mat", material: "100% Virgin Cotton", gsm: "900 GSM", price: 90, size: "Standard" },
      { name: "Pool Towel", material: "100% Virgin Cotton", gsm: "550 GSM", price: 95, size: "Large" },
      { name: "Spa Bath Towel", material: "100% Virgin Cotton", gsm: "550 GSM", price: 90, size: "Large" },
      { name: "Spa Hand Towel", material: "100% Virgin Cotton", gsm: "550 GSM", price: 45, size: "Standard" },
      { name: "Spa Face Towel", material: "100% Virgin Cotton", gsm: "550 GSM", price: 30, size: "Small" },
      { name: "Spa Bath Mat", material: "100% Virgin Cotton", gsm: "800 GSM", price: 75, size: "Standard" },
      { name: "Mattress Single", material: "Pocket Spring Bonded Foam(HD)", price: 600, size: "Single" },
      { name: "Mattress Double", material: "Pocket Spring Bonded Foam(HD)", price: 900, size: "Double" },
      { name: "Mattress Protector Single", material: "Quilted Microfibre Rubber Coating", price: 150, size: "Single" },
      { name: "Mattress Protector Double", material: "Quilted Microfibre Rubber Coating", price: 200, size: "Double" },
      { name: "Room Slippers", material: "Terry Plain", price: 25, size: "Standard" },
      { name: "Room Slippers (Logo)", material: "Terry with Logo Print", price: 30, size: "Standard" },
      { name: "Bathrobe", material: "100% Virgin Cotton", gsm: "360 GSM", price: 180, size: "One Size" }
    ]
  },

  // === SEMI LUXURY (300 TC) ===
  {
    category: "Semi Luxury",
    products: [
      { name: "Bedsheet Single", material: "100% Virgin Cotton", tc: "300 TC", price: 120, size: "Single" },
      { name: "Bedsheet Double - Queen Size", material: "100% Virgin Cotton", tc: "300 TC", price: 180, size: "Queen" },
      { name: "Bedsheet Double - King Size", material: "100% Virgin Cotton", tc: "300 TC", price: 220, size: "King" },
      { name: "Pillow Case Medium", material: "100% Virgin Cotton", tc: "300 TC", price: 45, size: "Medium" },
      { name: "Pillow Case Large", material: "100% Virgin Cotton", tc: "300 TC", price: 55, size: "Large" },
      { name: "Pillow Case XXXLarge", material: "100% Virgin Cotton", tc: "300 TC", price: 65, size: "XXXLarge" },
      { name: "Single Duvet", material: "100% Virgin Cotton", tc: "300 TC", price: 140, size: "Single" },
      { name: "Double Duvet", material: "100% Virgin Cotton", tc: "300 TC", price: 200, size: "Double" },
      { name: "Bed Runner Single", material: "French Satin", price: 85, size: "Single" },
      { name: "Bed Runner Queen & King", material: "French Satin", price: 120, size: "Queen/King" },
      { name: "Cushion Cover with Zipper", material: "French Satin", price: 35, size: "Standard" },
      { name: "Bath Towel", material: "100% Virgin Cotton", gsm: "550 GSM", price: 89, size: "Large" },
      { name: "Hand Towel", material: "100% Virgin Cotton", gsm: "550 GSM", price: 45, size: "Standard" },
      { name: "Face Towel", material: "100% Virgin Cotton", gsm: "550 GSM", price: 35, size: "Small" },
      { name: "Bath Mat", material: "100% Virgin Cotton", gsm: "800 GSM", price: 75, size: "Standard" },
      { name: "Pool Towel", material: "100% Virgin Cotton", gsm: "450 GSM", price: 75, size: "Large" },
      { name: "Spa Bath Towel", material: "100% Virgin Cotton", gsm: "550 GSM", price: 95, size: "Large" },
      { name: "Spa Hand Towel", material: "100% Virgin Cotton", gsm: "550 GSM", price: 50, size: "Standard" },
      { name: "Spa Face Towel", material: "100% Virgin Cotton", gsm: "550 GSM", price: 40, size: "Small" },
      { name: "Spa Bath Mat", material: "100% Virgin Cotton", gsm: "800 GSM", price: 65, size: "Standard" },
      { name: "Mattress Single", material: "Pocket Spring Bonded Foam(HD)", price: 350, size: "Single" },
      { name: "Mattress Double", material: "Pocket Spring Bonded Foam(HD)", price: 550, size: "Double" },
      { name: "Mattress Protector Single", material: "Quilted Microfibre Rubber Coating", price: 110, size: "Single" },
      { name: "Mattress Protector Double", material: "Quilted Microfibre Rubber Coating", price: 150, size: "Double" },
      { name: "Room Slippers", material: "Terry Plain", price: 20, size: "Standard" },
      { name: "Room Slippers (Logo)", material: "Terry with Logo Print", price: 25, size: "Standard" },
      { name: "Bathrobe", material: "100% Virgin Cotton", gsm: "360 GSM", price: 140, size: "One Size" }
    ]
  },

  // === UPPER ECONOMY (200-210 TC) ===
  {
    category: "Upper Economy",
    products: [
      { name: "Bedsheet Single", material: "100% Virgin Cotton", tc: "200-210 TC", price: 80, size: "Single" },
      { name: "Bedsheet Double - Queen Size", material: "100% Virgin Cotton", tc: "200-211 TC", price: 120, size: "Queen" },
      { name: "Bedsheet Double - King Size", material: "100% Virgin Cotton", tc: "200-212 TC", price: 140, size: "King" },
      { name: "Pillow Case", material: "100% Virgin Cotton", tc: "200-213 TC", price: 25, size: "Standard" },
      { name: "Single Duvet", material: "100% Virgin Cotton", tc: "200-214 TC", price: 90, size: "Single" },
      { name: "Double Duvet", material: "100% Virgin Cotton", tc: "200-215 TC", price: 130, size: "Double" }
    ]
  },

  // === ECONOMY ===
  {
    category: "Economy",
    products: [
      { name: "Bedsheet Single", material: "100% Polyester", price: 40, size: "Single" },
      { name: "Bedsheet Double - Queen Size", material: "100% Polyester", price: 60, size: "Queen" },
      { name: "Bedsheet Double - King Size", material: "100% Polyester", price: 70, size: "King" },
      { name: "Pillow Case", material: "100% Polyester", price: 15, size: "Standard" },
      { name: "Single Duvet", material: "100% Polyester", price: 50, size: "Single" },
      { name: "Double Duvet", material: "100% Polyester", price: 75, size: "Double" },
      { name: "Bed Runner Single", material: "100% Polyester", price: 30, size: "Single" },
      { name: "Bed Runner Queen & King", material: "100% Polyester", price: 45, size: "Queen/King" },
      { name: "Cushion Cover with Zipper", material: "100% Polyester", price: 15, size: "Standard" },
      { name: "Bath Towel", material: "Poly Cotton / Recycle Cotton", gsm: "400-450 GSM", price: 35, size: "Large" },
      { name: "Hand Towel", material: "Poly Cotton / Recycle Cotton", gsm: "100-200 GSM", price: 15, size: "Standard" },
      { name: "Face Towel", material: "Poly Cotton / Recycle Cotton", gsm: "36-40 GSM", price: 10, size: "Small" },
      { name: "Bath Mat", material: "Poly Cotton / Recycle Cotton", gsm: "200-250 GSM", price: 25, size: "Standard" },
      { name: "Pool Towel", material: "Poly Cotton / Recycle Cotton", gsm: "550 GSM", price: 45, size: "Large" },
      { name: "Spa Bath Towel", material: "Poly Cotton / Recycle Cotton", gsm: "450 GSM", price: 40, size: "Large" },
      { name: "Spa Hand Towel", material: "Poly Cotton / Recycle Cotton", gsm: "450 GSM", price: 20, size: "Standard" },
      { name: "Spa Face Towel", material: "Poly Cotton / Recycle Cotton", gsm: "450 GSM", price: 12, size: "Small" },
      { name: "Spa Bath Mat", material: "Poly Cotton / Recycle Cotton", gsm: "700 GSM", price: 30, size: "Standard" },
      { name: "Pillow", material: "Poly Cotton / Recycle Cotton", price: 25, size: "Standard" },
      { name: "Mattress Single", material: "Pocket Spring Bonded Foam(HD)", price: 250, size: "Single" },
      { name: "Mattress Double", material: "Pocket Spring Bonded Foam(HD)", price: 400, size: "Double" },
      { name: "Mattress Protector Single", material: "Terry with Elastic", price: 80, size: "Single" },
      { name: "Mattress Protector Double", material: "Terry with Elastic", price: 120, size: "Double" },
      { name: "Curtains with Eyelet", material: "100% Polyester", price: 90, size: "Standard" },
      { name: "Room Slippers", material: "Non Woven Recyclable", price: 10, size: "Standard" }
    ]
  }
]

async function seedMasterProducts() {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

    const categories = await Category.find({})

    // Check if categories exist
    if (categories.length === 0) {
      console.error('No categories found! Please run seed-hospitality-categories first.')
      process.exit(1)
    }

    // Clear existing products
    await Product.deleteMany({})
    console.log('Cleared existing products')

    let totalProducts = 0

    for (const group of masterProducts) {
      // Find category (case insensitive)
      const category = categories.find(c => c.name.toLowerCase() === group.category.toLowerCase())

      if (!category) {
        console.warn(`Category ${group.category} not found. Skipping items.`)
        continue
      }

      console.log(`\nSeeding ${group.category}...`)

      for (let i = 0; i < group.products.length; i++) {
        const item = group.products[i]

        // Build description
        let desc = `${item.name} from the ${group.category} Collection.`
        if (item.material) desc += ` Made from ${item.material}.`
        if (item.tc) desc += ` Thread Count: ${item.tc}.`
        if (item.gsm) desc += ` GSM: ${item.gsm}.`

        // Attributes
        const attributes = [
          { name: "Material", value: item.material || 'N/A', type: 'text' },
          { name: "Size", value: item.size || 'Standard', type: 'size' }
        ]
        if (item.tc) attributes.push({ name: "Thread Count", value: item.tc, type: 'text' })
        if (item.gsm) attributes.push({ name: "GSM", value: item.gsm, type: 'text' })

        const images = getProductImages(item.name)

        const product = new Product({
          name: item.name,
          category: category._id,
          price: item.price,
          originalPrice: Math.round(item.price * 1.2),
          description: desc,
          sku: generateSKU(group.category, item.name, i + 1),
          image: images[0],
          images: images,
          stock: 100,
          status: 'active',
          inStock: true,
          attributes: attributes,
          size: item.size,
          weight: item.gsm,
          isNewProduct: Math.random() > 0.8,
          // Assign random business type for testing: 10% B2B, 10% B2C, 80% BOTH
          businessType: Math.random() < 0.1 ? 'B2B' : (Math.random() < 0.2 ? 'B2C' : 'BOTH')
        })

        await product.save()
        totalProducts++
      }
    }

    console.log(`\n✅ Successfully seeded ${totalProducts} products across all categories!`)
    process.exit(0)

  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  }
}

seedMasterProducts()
