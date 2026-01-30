import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import Category from '@/lib/models/Category'
import * as XLSX from 'xlsx'

interface ImportProduct {
  name: string
  description: string
  price: number
  category: string
  stock: number
  sku: string
  image?: string
  isBestSeller?: boolean
  isNewProduct?: boolean
  rating?: number
  weight?: string
  size?: string
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }
    
    // Check file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json(
        { success: false, error: 'Please upload an Excel file (.xlsx or .xls)' },
        { status: 400 }
      )
    }
    
    // Read Excel file
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json(worksheet)
    
    if (jsonData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Excel file is empty' },
        { status: 400 }
      )
    }
    
    // Get all categories to map names to IDs
    const categories = await Category.find({ isActive: true })
    const categoryMap = new Map()
    categories.forEach(cat => {
      categoryMap.set(cat.name.toLowerCase(), cat._id)
    })
    
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
      imported: [] as any[]
    }
    
    // Process each row
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i] as any
      const rowNumber = i + 2 // Excel row number (1-based + header)
      
      try {
        // Validate required fields
        if (!row.name || !row.price || !row.category || !row.sku) {
          results.failed++
          results.errors.push(`Row ${rowNumber}: Missing required fields (name, price, category, sku)`)
          continue
        }
        
        // Find category ID
        const categoryId = categoryMap.get(row.category.toLowerCase())
        if (!categoryId) {
          results.failed++
          results.errors.push(`Row ${rowNumber}: Category "${row.category}" not found`)
          continue
        }
        
        // Check if SKU already exists
        const existingProduct = await Product.findOne({ sku: row.sku })
        if (existingProduct) {
          results.failed++
          results.errors.push(`Row ${rowNumber}: SKU "${row.sku}" already exists`)
          continue
        }
        
        // Prepare product data
        const productData: any = {
          name: row.name.toString().trim(),
          description: row.description?.toString().trim() || '',
          price: parseFloat(row.price),
          category: categoryId,
          stock: parseInt(row.stock) || 0,
          sku: row.sku.toString().trim(),
          image: row.image?.toString().trim() || '',
          isBestSeller: row.isBestSeller === 'true' || row.isBestSeller === true,
          isNewProduct: row.isNewProduct === 'true' || row.isNewProduct === true,
          rating: parseFloat(row.rating) || 4.5,
          weight: row.weight?.toString().trim() || 'N/A',
          size: row.size?.toString().trim() || 'Standard',
          status: 'active',
          inStock: (parseInt(row.stock) || 0) > 0
        }
        
        // Validate price
        if (isNaN(productData.price) || productData.price < 0) {
          results.failed++
          results.errors.push(`Row ${rowNumber}: Invalid price "${row.price}"`)
          continue
        }
        
        // Create product
        const newProduct = new Product(productData)
        await newProduct.save()
        
        results.success++
        results.imported.push({
          name: productData.name,
          sku: productData.sku,
          price: productData.price
        })
        
      } catch (error) {
        results.failed++
        results.errors.push(`Row ${rowNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Import completed. ${results.success} products imported successfully, ${results.failed} failed.`,
      data: {
        total: jsonData.length,
        imported: results.success,
        failed: results.failed,
        errors: results.errors,
        importedProducts: results.imported
      }
    })
    
  } catch (error) {
    console.error('Bulk import error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process import' },
      { status: 500 }
    )
  }
}
