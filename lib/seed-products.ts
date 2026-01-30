import connectDB from './mongodb'
import Product from './models/Product'
import Category from './models/Category'

const sampleProducts = [
  // AB Collection - Advanced Bonding Technology
  {
    name: "AB Advanced Bonding Treatment",
    price: 299,
    originalPrice: 399,
    description: "Professional-grade bonding treatment for ultimate hair repair and strength",
    longDescription: "Professional-grade bonding treatment for ultimate hair repair and strength. Advanced bonding technology that rebuilds hair bonds for lasting results.",
    images: ["/AB/AB(1).png"],
    category: null, // Will be set to AB category
    attributes: [
      { name: "Size", value: "500ml" },
      { name: "Collection", value: "AB" },
      { name: "SKU", value: "AB-TRT-001" }
    ],
    isActive: true,
    isBestSeller: true,
    isNewProduct: false
  },
  {
    name: "AB Bonding Shampoo",
    price: 89,
    originalPrice: 119,
    description: "Specialized shampoo designed to maintain and enhance bonding treatments",
    longDescription: "Specialized shampoo designed to maintain and enhance bonding treatments. Gentle formula that preserves bonding results.",
    images: ["/AB/AB(2).png"],
    category: null,
    attributes: [
      { name: "Size", value: "1000ml" },
      { name: "Collection", value: "AB" },
      { name: "SKU", value: "AB-SH-002" }
    ],
    isActive: true,
    isBestSeller: false,
    isNewProduct: false
  },
  {
    name: "AB Bonding Conditioner",
    price: 99,
    originalPrice: 129,
    description: "Deep conditioning treatment to complement bonding technology",
    longDescription: "Deep conditioning treatment to complement bonding technology. Provides moisture lock and bonding support.",
    images: ["/AB/AB(3).png"],
    category: null,
    attributes: [
      { name: "Size", value: "1000ml" },
      { name: "Collection", value: "AB" },
      { name: "SKU", value: "AB-CN-003" }
    ],
    isActive: true,
    isBestSeller: false,
    isNewProduct: false
  },
  // AC Collection - Anti-Curl System
  {
    name: "AC Anti-Curl Treatment",
    price: 349,
    originalPrice: 449,
    description: "Professional anti-curl system for perfect straightening results",
    longDescription: "Professional anti-curl system for perfect straightening results. Long-lasting straightening power with professional-grade formulation.",
    images: ["/AC/AC(1).png"],
    category: null,
    attributes: [
      { name: "Size", value: "500ml" },
      { name: "Collection", value: "AC" },
      { name: "SKU", value: "AC-TRT-001" }
    ],
    isActive: true,
    isBestSeller: true,
    isNewProduct: false
  },
  {
    name: "AC Straightening Shampoo",
    price: 99,
    originalPrice: 129,
    description: "Specialized shampoo to maintain anti-curl treatments",
    longDescription: "Specialized shampoo to maintain anti-curl treatments. Treatment maintenance with straightening support.",
    images: ["/AC/AC(2).png"],
    category: null,
    attributes: [
      { name: "Size", value: "1000ml" },
      { name: "Collection", value: "AC" },
      { name: "SKU", value: "AC-SH-002" }
    ],
    isActive: true,
    isBestSeller: false,
    isNewProduct: false
  },
  {
    name: "AC Anti-Curl Conditioner",
    price: 109,
    originalPrice: 139,
    description: "Conditioning treatment to enhance straightening results",
    longDescription: "Conditioning treatment to enhance straightening results. Anti-curl enhancement with moisture balance.",
    images: ["/AC/AC(3).png"],
    category: null,
    attributes: [
      { name: "Size", value: "1000ml" },
      { name: "Collection", value: "AC" },
      { name: "SKU", value: "AC-CN-003" }
    ],
    isActive: true,
    isBestSeller: false,
    isNewProduct: false
  },
  {
    name: "AC Professional Mask",
    price: 149,
    originalPrice: 199,
    description: "Intensive mask for maximum straightening results",
    longDescription: "Intensive mask for maximum straightening results. Professional care with intensive treatment.",
    images: ["/AC/AC(4).png"],
    category: null,
    attributes: [
      { name: "Size", value: "500ml" },
      { name: "Collection", value: "AC" },
      { name: "SKU", value: "AC-MK-004" }
    ],
    isActive: true,
    isBestSeller: true,
    isNewProduct: false
  },
  {
    name: "AC Finishing Serum",
    price: 79,
    originalPrice: 99,
    description: "Final step serum for perfect straightening finish",
    longDescription: "Final step serum for perfect straightening finish. Smooth finish with professional results.",
    images: ["/AC/AC(5).png"],
    category: null,
    attributes: [
      { name: "Size", value: "100ml" },
      { name: "Collection", value: "AC" },
      { name: "SKU", value: "AC-SR-005" }
    ],
    isActive: true,
    isBestSeller: false,
    isNewProduct: false
  },
  // BC Collection - Bonding & Conditioning
  {
    name: "BC Bonding Treatment",
    price: 299,
    originalPrice: 399,
    description: "Professional bonding treatment for healthy hair transformation",
    longDescription: "Professional bonding treatment for healthy hair transformation. Bonding technology for optimal hair health.",
    images: ["/BC/BC(1).png"],
    category: null,
    attributes: [
      { name: "Size", value: "500ml" },
      { name: "Collection", value: "BC" },
      { name: "SKU", value: "BC-TRT-001" }
    ],
    isActive: true,
    isBestSeller: true,
    isNewProduct: false
  },
  {
    name: "BC Conditioning Shampoo",
    price: 89,
    originalPrice: 119,
    description: "Deep conditioning shampoo to enhance bonding treatments",
    longDescription: "Deep conditioning shampoo to enhance bonding treatments. Gentle formula with bonding support.",
    images: ["/BC/BC(2).png"],
    category: null,
    attributes: [
      { name: "Size", value: "1000ml" },
      { name: "Collection", value: "BC" },
      { name: "SKU", value: "BC-SH-002" }
    ],
    isActive: true,
    isBestSeller: false,
    isNewProduct: false
  },
  {
    name: "BC Hair Health Conditioner",
    price: 99,
    originalPrice: 129,
    description: "Intensive conditioner for healthy hair maintenance",
    longDescription: "Intensive conditioner for healthy hair maintenance. Hair health with moisture lock and nourishing formula.",
    images: ["/BC/BC(3).png"],
    category: null,
    attributes: [
      { name: "Size", value: "1000ml" },
      { name: "Collection", value: "BC" },
      { name: "SKU", value: "BC-CN-003" }
    ],
    isActive: true,
    isBestSeller: true,
    isNewProduct: false
  },
  {
    name: "BC Recovery Mask",
    price: 149,
    originalPrice: 199,
    description: "Intensive recovery mask for damaged hair restoration",
    longDescription: "Intensive recovery mask for damaged hair restoration. Deep recovery with damage repair.",
    images: ["/BC/BC(4).png"],
    category: null,
    attributes: [
      { name: "Size", value: "500ml" },
      { name: "Collection", value: "BC" },
      { name: "SKU", value: "BC-MK-004" }
    ],
    isActive: true,
    isBestSeller: false,
    isNewProduct: false
  },
  // CC Collection - Color Care System
  {
    name: "CC Color Care Treatment",
    price: 329,
    originalPrice: 429,
    description: "Professional color care system for vibrant, protected hair",
    longDescription: "Professional color care system for vibrant, protected hair. Color protection with vibrant results.",
    images: ["/CC/GROUPE/TTD_2516.png"],
    category: null,
    attributes: [
      { name: "Size", value: "500ml" },
      { name: "Collection", value: "CC" },
      { name: "SKU", value: "CC-TRT-001" }
    ],
    isActive: true,
    isBestSeller: true,
    isNewProduct: false
  },
  {
    name: "CC Color Safe Shampoo",
    price: 99,
    originalPrice: 129,
    description: "Specialized shampoo to maintain and protect hair color",
    longDescription: "Specialized shampoo to maintain and protect hair color. Color safe with gentle formula.",
    images: ["/CC/GROUPE/TTD_2517.png"],
    category: null,
    attributes: [
      { name: "Size", value: "1000ml" },
      { name: "Collection", value: "CC" },
      { name: "SKU", value: "CC-SH-002" }
    ],
    isActive: true,
    isBestSeller: false,
    isNewProduct: false
  },
  {
    name: "CC Color Enhancing Conditioner",
    price: 109,
    originalPrice: 139,
    description: "Conditioning treatment to enhance and protect hair color",
    longDescription: "Conditioning treatment to enhance and protect hair color. Color enhancement with moisture balance.",
    images: ["/CC/GROUPE/TTD_2518.png"],
    category: null,
    attributes: [
      { name: "Size", value: "1000ml" },
      { name: "Collection", value: "CC" },
      { name: "SKU", value: "CC-CN-003" }
    ],
    isActive: true,
    isBestSeller: false,
    isNewProduct: false
  },
  {
    name: "CC Professional Care Mask",
    price: 159,
    originalPrice: 209,
    description: "Intensive mask for maximum color protection and vibrancy",
    longDescription: "Intensive mask for maximum color protection and vibrancy. Maximum protection with professional care.",
    images: ["/CC/GROUPE/TTD_2520.png"],
    category: null,
    attributes: [
      { name: "Size", value: "500ml" },
      { name: "Collection", value: "CC" },
      { name: "SKU", value: "CC-MK-004" }
    ],
    isActive: true,
    isBestSeller: true,
    isNewProduct: false
  },
  // DD Collection - Deep Detox & Damage Repair
  {
    name: "DD Deep Detox Treatment",
    price: 349,
    originalPrice: 449,
    description: "Professional deep detox system for ultimate hair recovery",
    longDescription: "Professional deep detox system for ultimate hair recovery. Deep detox with hair recovery technology.",
    images: ["/DD/DD(1).png"],
    category: null,
    attributes: [
      { name: "Size", value: "500ml" },
      { name: "Collection", value: "DD" },
      { name: "SKU", value: "DD-TRT-001" }
    ],
    isActive: true,
    isBestSeller: true,
    isNewProduct: false
  },
  {
    name: "DD Damage Repair Shampoo",
    price: 109,
    originalPrice: 139,
    description: "Specialized shampoo for damaged hair repair and restoration",
    longDescription: "Specialized shampoo for damaged hair repair and restoration. Damage repair with restoration formula.",
    images: ["/DD/DD(2).png"],
    category: null,
    attributes: [
      { name: "Size", value: "1000ml" },
      { name: "Collection", value: "DD" },
      { name: "SKU", value: "DD-SH-002" }
    ],
    isActive: true,
    isBestSeller: false,
    isNewProduct: false
  },
  {
    name: "DD Recovery Conditioner",
    price: 119,
    originalPrice: 149,
    description: "Intensive conditioning treatment for ultimate hair recovery",
    longDescription: "Intensive conditioning treatment for ultimate hair recovery. Recovery treatment with deep nourishment.",
    images: ["/DD/DD(3).png"],
    category: null,
    attributes: [
      { name: "Size", value: "1000ml" },
      { name: "Collection", value: "DD" },
      { name: "SKU", value: "DD-CN-003" }
    ],
    isActive: true,
    isBestSeller: false,
    isNewProduct: false
  },
  {
    name: "DD Ultimate Repair Mask",
    price: 169,
    originalPrice: 219,
    description: "Intensive repair mask for maximum damage recovery",
    longDescription: "Intensive repair mask for maximum damage recovery. Ultimate recovery with maximum repair.",
    images: ["/DD/DD(4).png"],
    category: null,
    attributes: [
      { name: "Size", value: "500ml" },
      { name: "Collection", value: "DD" },
      { name: "SKU", value: "DD-MK-004" }
    ],
    isActive: true,
    isBestSeller: true,
    isNewProduct: false
  },
  // FB Collection - Fiber Bonding Technology
  {
    name: "FB Fiber Bonding Treatment",
    price: 379,
    originalPrice: 479,
    description: "Professional fiber bonding technology for maximum hair strength",
    longDescription: "Professional fiber bonding technology for maximum hair strength. Fiber bonding with maximum strength technology.",
    images: ["/FB/FB(1).png"],
    category: null,
    attributes: [
      { name: "Size", value: "500ml" },
      { name: "Collection", value: "FB" },
      { name: "SKU", value: "FB-TRT-001" }
    ],
    isActive: true,
    isBestSeller: true,
    isNewProduct: false
  },
  {
    name: "FB Strength Shampoo",
    price: 119,
    originalPrice: 149,
    description: "Specialized shampoo to enhance and maintain fiber bonding",
    longDescription: "Specialized shampoo to enhance and maintain fiber bonding. Strength enhancement with bonding support.",
    images: ["/FB/FB(2).png"],
    category: null,
    attributes: [
      { name: "Size", value: "1000ml" },
      { name: "Collection", value: "FB" },
      { name: "SKU", value: "FB-SH-002" }
    ],
    isActive: true,
    isBestSeller: false,
    isNewProduct: false
  },
  {
    name: "FB Professional Conditioner",
    price: 129,
    originalPrice: 159,
    description: "Intensive conditioner for maximum hair strength and resilience",
    longDescription: "Intensive conditioner for maximum hair strength and resilience. Professional care with strength maintenance.",
    images: ["/FB/FB(3).png"],
    category: null,
    attributes: [
      { name: "Size", value: "1000ml" },
      { name: "Collection", value: "FB" },
      { name: "SKU", value: "FB-CN-003" }
    ],
    isActive: true,
    isBestSeller: false,
    isNewProduct: false
  },
  {
    name: "FB Maximum Strength Mask",
    price: 179,
    originalPrice: 229,
    description: "Intensive mask for ultimate hair strength and durability",
    longDescription: "Intensive mask for ultimate hair strength and durability. Maximum strength with intensive treatment.",
    images: ["/FB/FB(4).png"],
    category: null,
    attributes: [
      { name: "Size", value: "500ml" },
      { name: "Collection", value: "FB" },
      { name: "SKU", value: "FB-MK-004" }
    ],
    isActive: true,
    isBestSeller: true,
    isNewProduct: false
  },
  {
    name: "FB Bonding Serum",
    price: 99,
    originalPrice: 129,
    description: "Advanced serum to enhance fiber bonding results",
    longDescription: "Advanced serum to enhance fiber bonding results. Bonding enhancement with advanced formula.",
    images: ["/FB/FB(5).png"],
    category: null,
    attributes: [
      { name: "Size", value: "100ml" },
      { name: "Collection", value: "FB" },
      { name: "SKU", value: "FB-SR-005" }
    ],
    isActive: true,
    isBestSeller: false,
    isNewProduct: false
  },
  {
    name: "FB Finishing Treatment",
    price: 89,
    originalPrice: 119,
    description: "Final step treatment for perfect fiber bonding finish",
    longDescription: "Final step treatment for perfect fiber bonding finish. Finishing touch with perfect results.",
    images: ["/FB/FB(6).png"],
    category: null,
    attributes: [
      { name: "Size", value: "100ml" },
      { name: "Collection", value: "FB" },
      { name: "SKU", value: "FB-FN-006" }
    ],
    isActive: true,
    isBestSeller: false,
    isNewProduct: false
  },
  // SV Collection - Silver & Volumizing
  {
    name: "SV Silver Volumizing Treatment",
    price: 329,
    originalPrice: 429,
    description: "Professional silver technology for luxurious hair volume",
    longDescription: "Professional silver technology for luxurious hair volume. Silver technology with volume enhancement.",
    images: ["/SV/SV(1).png"],
    category: null,
    attributes: [
      { name: "Size", value: "500ml" },
      { name: "Collection", value: "SV" },
      { name: "SKU", value: "SV-TRT-001" }
    ],
    isActive: true,
    isBestSeller: true,
    isNewProduct: false
  },
  {
    name: "SV Luxury Volume Shampoo",
    price: 109,
    originalPrice: 139,
    description: "Specialized shampoo for maximum volume and luxury care",
    longDescription: "Specialized shampoo for maximum volume and luxury care. Volume enhancement with luxury care.",
    images: ["/SV/SV(2).png"],
    category: null,
    attributes: [
      { name: "Size", value: "1000ml" },
      { name: "Collection", value: "SV" },
      { name: "SKU", value: "SV-SH-002" }
    ],
    isActive: true,
    isBestSeller: true,
    isNewProduct: false
  },
  // XL Collection - Extra Long Keratin & Silk
  {
    name: "XL Keratin Silk Treatment",
    price: 399,
    originalPrice: 499,
    description: "Extra long keratin and silk treatment for maximum hair length and strength",
    longDescription: "Extra long keratin and silk treatment for maximum hair length and strength. Extra length with keratin and silk technology.",
    images: ["/XL/XL(1).png"],
    category: null,
    attributes: [
      { name: "Size", value: "500ml" },
      { name: "Collection", value: "XL" },
      { name: "SKU", value: "XL-TRT-001" }
    ],
    isActive: true,
    isBestSeller: true,
    isNewProduct: false
  },
  {
    name: "XL Length Shampoo",
    price: 119,
    originalPrice: 149,
    description: "Specialized shampoo to maintain and enhance length treatments",
    longDescription: "Specialized shampoo to maintain and enhance length treatments. Length maintenance with keratin support.",
    images: ["/XL/XL(2).png"],
    category: null,
    attributes: [
      { name: "Size", value: "1000ml" },
      { name: "Collection", value: "XL" },
      { name: "SKU", value: "XL-SH-002" }
    ],
    isActive: true,
    isBestSeller: false,
    isNewProduct: false
  },
  {
    name: "XL Silk Conditioner",
    price: 129,
    originalPrice: 159,
    description: "Silk-infused conditioner for luxurious length care",
    longDescription: "Silk-infused conditioner for luxurious length care. Silk infusion with length enhancement.",
    images: ["/XL/XL(3).png"],
    category: null,
    attributes: [
      { name: "Size", value: "1000ml" },
      { name: "Collection", value: "XL" },
      { name: "SKU", value: "XL-CN-003" }
    ],
    isActive: true,
    isBestSeller: false,
    isNewProduct: false
  },
  {
    name: "XL Professional Mask",
    price: 179,
    originalPrice: 229,
    description: "Intensive mask for maximum length and strength results",
    longDescription: "Intensive mask for maximum length and strength results. Intensive treatment with maximum length.",
    images: ["/XL/XL(4).png"],
    category: null,
    attributes: [
      { name: "Size", value: "500ml" },
      { name: "Collection", value: "XL" },
      { name: "SKU", value: "XL-MK-004" }
    ],
    isActive: true,
    isBestSeller: true,
    isNewProduct: false
  },
  {
    name: "XL Finishing Oil",
    price: 89,
    originalPrice: 119,
    description: "Luxury finishing oil for perfect length treatment results",
    longDescription: "Luxury finishing oil for perfect length treatment results. Finishing touch with luxury oil.",
    images: ["/XL/XL(5).png"],
    category: null,
    attributes: [
      { name: "Size", value: "100ml" },
      { name: "Collection", value: "XL" },
      { name: "SKU", value: "XL-OIL-005" }
    ],
    isActive: true,
    isBestSeller: false,
    isNewProduct: false
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
      console.log('No categories found. Please run seed-categories first.')
      return
    }

    // Clear existing products
    await Product.deleteMany({})
    console.log('Cleared existing products')

    // Create products with proper category references
    for (const productData of sampleProducts) {
      // Find matching category by collection code
      let categoryId = null
      const collectionCode = productData.attributes.find(attr => attr.name === 'Collection')?.value
      
      if (collectionCode) {
        // Try to find category by name containing the collection code
        const category = categories.find(c => 
          c.name.toLowerCase().includes(collectionCode.toLowerCase()) ||
          c.slug?.toLowerCase().includes(collectionCode.toLowerCase())
        )
        categoryId = category?._id
      }

      // If no specific category found, use first category as fallback
      if (!categoryId) {
        categoryId = categories[0]._id
        console.warn(`No category found for collection ${collectionCode}, using fallback category`)
      }

      // Extract SKU from attributes
      const skuAttribute = productData.attributes.find(attr => attr.name === 'SKU')
      const sku = skuAttribute?.value || `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      const product = new Product({
        ...productData,
        category: categoryId,
        sku: sku,
        image: productData.images[0] || '/placeholder.svg',
        rating: 4.8,
        reviews: Math.floor(Math.random() * 200) + 50,
        inStock: true,
        stock: Math.floor(Math.random() * 100) + 10,
        status: 'active'
      })

      await product.save()
      console.log(`Created product: ${product.name} (${collectionCode})`)
    }

    console.log('Products seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding products:', error)
    process.exit(1)
  }
}

seedProducts()
