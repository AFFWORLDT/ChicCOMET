import connectDB from '../lib/mongodb'
import Product from '../lib/models/Product'
import Category from '../lib/models/Category'

async function verifyProducts() {
    await connectDB()

    const categories = await Category.find({})
    const products = await Product.find({}).populate('category')

    console.log(`Total Categories: ${categories.length}`)
    console.log(`Total Products: ${products.length}`)

    const summary: Record<string, any[]> = {}

    categories.forEach(c => {
        summary[c.name] = []
    })

    products.forEach(p => {
        const catName = (p.category as any).name
        if (!summary[catName]) summary[catName] = []

        summary[catName].push({
            name: p.name,
            material: p.attributes?.find((a: any) => a.name === 'Material')?.value,
            tc: p.attributes?.find((a: any) => a.name === 'Thread Count')?.value,
            gsm: p.attributes?.find((a: any) => a.name === 'GSM')?.value,
            price: p.price
        })
    })

    // Print Report
    Object.keys(summary).forEach(cat => {
        console.log(`\n=== ${cat} (${summary[cat].length} items) ===`)
        summary[cat].forEach(item => {
            let details = `- ${item.name} | $${item.price}`
            if (item.material) details += ` | ${item.material}`
            if (item.tc) details += ` | ${item.tc}`
            if (item.gsm) details += ` | ${item.gsm}`
            console.log(details)
        })
    })

    process.exit(0)
}

verifyProducts()
