import connectDB from './mongodb'
import Category from './models/Category'

const seedCategories = async () => {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

    // Clear existing categories
    await Category.deleteMany({})
    console.log('Cleared existing categories')

    // Seed Categories - Collection Categories Only
    const categories = [
      {
        name: "AB Collection",
        description: "Advanced Bonding Technology for Ultimate Hair Repair and Strength",
        isActive: true,
        sortOrder: 1,
        attributes: [
          {
            name: "Product Type",
            type: "select",
            options: ["Treatment", "Shampoo", "Conditioner", "Mask", "Serum"],
            required: true
          },
          {
            name: "Size",
            type: "select",
            options: ["100ml", "250ml", "500ml", "1000ml"],
            required: true
          }
        ]
      },
      {
        name: "AC Collection",
        description: "Anti-Curl System for Perfect Straightening Results",
        isActive: true,
        sortOrder: 2,
        attributes: [
          {
            name: "Product Type",
            type: "select",
            options: ["Treatment", "Shampoo", "Conditioner", "Mask", "Serum"],
            required: true
          },
          {
            name: "Size",
            type: "select",
            options: ["100ml", "250ml", "500ml", "1000ml"],
            required: true
          }
        ]
      },
      {
        name: "BC Collection",
        description: "Bonding & Conditioning for Healthy Hair Transformation",
        isActive: true,
        sortOrder: 3,
        attributes: [
          {
            name: "Product Type",
            type: "select",
            options: ["Treatment", "Shampoo", "Conditioner", "Mask"],
            required: true
          },
          {
            name: "Size",
            type: "select",
            options: ["100ml", "250ml", "500ml", "1000ml"],
            required: true
          }
        ]
      },
      {
        name: "CC Collection",
        description: "Color Care System for Vibrant, Protected Hair",
        isActive: true,
        sortOrder: 4,
        attributes: [
          {
            name: "Product Type",
            type: "select",
            options: ["Treatment", "Shampoo", "Conditioner", "Mask"],
            required: true
          },
          {
            name: "Size",
            type: "select",
            options: ["100ml", "250ml", "500ml", "1000ml"],
            required: true
          }
        ]
      },
      {
        name: "DD Collection",
        description: "Deep Detox & Damage Repair for Ultimate Hair Recovery",
        isActive: true,
        sortOrder: 5,
        attributes: [
          {
            name: "Product Type",
            type: "select",
            options: ["Treatment", "Shampoo", "Conditioner", "Mask"],
            required: true
          },
          {
            name: "Size",
            type: "select",
            options: ["100ml", "250ml", "500ml", "1000ml"],
            required: true
          }
        ]
      },
      {
        name: "FB Collection",
        description: "Fiber Bonding Technology for Maximum Hair Strength",
        isActive: true,
        sortOrder: 6,
        attributes: [
          {
            name: "Product Type",
            type: "select",
            options: ["Treatment", "Shampoo", "Conditioner", "Mask", "Serum", "Finishing"],
            required: true
          },
          {
            name: "Size",
            type: "select",
            options: ["100ml", "250ml", "500ml", "1000ml"],
            required: true
          }
        ]
      },
      {
        name: "SV Collection",
        description: "Silver & Volumizing System for Luxurious Hair Volume",
        isActive: true,
        sortOrder: 7,
        attributes: [
          {
            name: "Product Type",
            type: "select",
            options: ["Treatment", "Shampoo", "Conditioner", "Mask"],
            required: true
          },
          {
            name: "Size",
            type: "select",
            options: ["100ml", "250ml", "500ml", "1000ml"],
            required: true
          }
        ]
      },
      {
        name: "XL Collection",
        description: "Extra Long Keratin & Silk for Maximum Hair Length and Strength",
        isActive: true,
        sortOrder: 8,
        attributes: [
          {
            name: "Product Type",
            type: "select",
            options: ["Treatment", "Shampoo", "Conditioner", "Mask", "Oil"],
            required: true
          },
          {
            name: "Size",
            type: "select",
            options: ["100ml", "250ml", "500ml", "1000ml"],
            required: true
          }
        ]
      }
    ]

    // Save categories individually to trigger pre-save hooks
    for (const categoryData of categories) {
      const category = new Category(categoryData)
      await category.save()
    }
    console.log('Seeded categories')

    console.log('Categories seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding categories:', error)
    process.exit(1)
  }
}

seedCategories()

