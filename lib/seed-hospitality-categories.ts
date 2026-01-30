import connectDB from './mongodb'
import Category from './models/Category'

const seedCategories = async () => {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

    // Clear existing categories
    await Category.deleteMany({})
    console.log('Cleared existing categories')

    const categories = [
      {
        name: "Semi Luxury",
        description: "Premium quality hospitality products with 300 TC cotton and quality materials",
        isActive: true,
        sortOrder: 1,
        attributes: [
          { name: "Thread Count", type: "select", options: ["300 TC"], required: true },
          { name: "Material", type: "select", options: ["100% Virgin Cotton", "French Satin"], required: true },
          { name: "GSM", type: "select", options: ["550 GSM", "800 GSM", "450 GSM", "360 GSM"], required: false },
          { name: "Size", type: "select", options: ["Single", "Double-Queen", "Double-King", "Medium", "Large", "XXXLarge"], required: false }
        ]
      },
      {
        name: "Upper Economy",
        description: "Quality economy products with 200-210 TC cotton and durable materials",
        isActive: true,
        sortOrder: 2,
        attributes: [
          { name: "Thread Count", type: "select", options: ["200-210 TC", "200-211 TC", "200-212 TC", "200-213 TC", "200-214 TC", "200-215 TC", "200-216 TC", "200-217 TC"], required: true },
          { name: "Material", type: "select", options: ["100% Virgin Cotton"], required: true },
          { name: "Size", type: "select", options: ["Single", "Double-Queen", "Double-King"], required: false }
        ]
      },
      {
        name: "Economy",
        description: "Budget-friendly hospitality products with polyester and recycled cotton materials",
        isActive: true,
        sortOrder: 3,
        attributes: [
          { name: "Material", type: "select", options: ["100% Polyester", "Poly Cotton", "Recycle Cotton"], required: true },
          { name: "GSM", type: "select", options: ["400-450 GSM", "100-200 GSM", "36-40 GSM", "200-250 GSM", "550 GSM", "450 GSM", "700 GSM"], required: false },
          { name: "Size", type: "select", options: ["Single", "Double-Queen", "Double-King"], required: false }
        ]
      },
      {
        name: "Luxury",
        description: "Premium luxury products with 400 TC cotton and fusion/embroidery details",
        isActive: true,
        sortOrder: 4,
        attributes: [
          { name: "Thread Count", type: "select", options: ["400 TC"], required: true },
          { name: "Material", type: "select", options: ["100% Virgin Cotton", "Fusion", "Embroidery"], required: true },
          { name: "GSM", type: "select", options: ["650 GSM", "900 GSM", "550 GSM", "800 GSM", "360 GSM"], required: false },
          { name: "Size", type: "select", options: ["Single", "Double-Queen", "Double-King", "Medium", "Large", "XXXLarge"], required: false }
        ]
      },
      {
        name: "Hyper Luxury",
        description: "Ultimate luxury hospitality products with 600 TC premium cotton",
        isActive: true,
        sortOrder: 5,
        attributes: [
          { name: "Thread Count", type: "select", options: ["600 TC", "100 TC"], required: true },
          { name: "Material", type: "select", options: ["100% Virgin Cotton"], required: true },
          { name: "Size", type: "select", options: ["Single", "Double-Queen", "Double-King", "Medium", "Large", "XXXLarge"], required: false }
        ]
      }
    ]

    // Save categories individually to trigger pre-save hooks
    for (const categoryData of categories) {
      const category = new Category(categoryData)
      await category.save()
      console.log(`Created category: ${category.name}`)
    }

    console.log('\nCategories seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding categories:', error)
    process.exit(1)
  }
}

seedCategories()

