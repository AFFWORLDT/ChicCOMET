import connectDB from './mongodb'
import Product from './models/Product'
import User from './models/User'
import Category from './models/Category'
import mongoose from 'mongoose'

async function checkDatabase() {
  try {
    await connectDB()
    console.log('\n=== Database Connection Info ===')
    console.log('Database Name:', mongoose.connection.db?.databaseName || 'unknown')
    console.log('Connection State:', mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected')
    console.log('Host:', mongoose.connection.host || 'unknown')
    
    console.log('\n=== Database Contents ===')
    const productCount = await Product.countDocuments({})
    const userCount = await User.countDocuments({})
    const categoryCount = await Category.countDocuments({})
    
    console.log(`Products: ${productCount}`)
    console.log(`Users: ${userCount}`)
    console.log(`Categories: ${categoryCount}`)
    
    if (productCount > 0) {
      console.log('\n=== Sample Products ===')
      const sampleProducts = await Product.find({}).limit(3).select('name sku').lean()
      sampleProducts.forEach((p: any) => {
        console.log(`- ${p.name} (${p.sku})`)
      })
    }
    
    process.exit(0)
  } catch (error) {
    console.error('Error checking database:', error)
    process.exit(1)
  }
}

checkDatabase()

