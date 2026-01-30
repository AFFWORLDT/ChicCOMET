import connectDB from '../lib/mongodb'
import Product from '../lib/models/Product'

async function verifyFiltering() {
    await connectDB()

    // 1. Verify all products have businessType
    const allProducts = await Product.find({})
    const missingType = allProducts.filter(p => !p.businessType)

    console.log(`Total Products: ${allProducts.length}`)
    console.log(`Products missing businessType: ${missingType.length}`)

    if (missingType.length > 0) {
        console.log('Fixing missing types...')
        await Product.updateMany({ businessType: { $exists: false } }, { businessType: 'BOTH' })
    }

    // 2. Simulate API Filter
    const publicFilter = {
        status: 'active',
        businessType: { $ne: 'B2B' }
    }

    const publicProducts = await Product.find(publicFilter)
    console.log(`Public Products (Excluding B2B): ${publicProducts.length}`)

    if (publicProducts.length === allProducts.length) {
        console.log('NOTE: Currently all products are set to BOTH/B2C, so all are visible.')
    } else {
        console.log(`Hidden B2B Products: ${allProducts.length - publicProducts.length}`)
    }

    process.exit(0)
}

verifyFiltering()
