import connectDB from './mongodb'
import Product from './models/Product'
import User from './models/User'
import Category from './models/Category'

const clearDatabase = async () => {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

    // Clear all collections
    await Product.deleteMany({})
    console.log('Cleared all products')

    await User.deleteMany({})
    console.log('Cleared all users')

    await Category.deleteMany({})
    console.log('Cleared all categories')

    console.log('Database cleared successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error clearing database:', error)
    process.exit(1)
  }
}

clearDatabase()
