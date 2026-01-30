import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export async function GET() {
  try {
    // Create sample data
    const sampleData = [
      {
        name: 'Nourishing Hair Mask',
        description: 'Deep conditioning mask with keratin and coconut oil',
        price: 52.00,
        category: 'Treatment Systems',
        stock: 50,
        sku: 'NHM-001',
        image: 'https://example.com/nourishing-mask.jpg',
        isBestSeller: true,
        isNewProduct: false,
        rating: 4.5,
        weight: '250g',
        size: 'Standard'
      },
      {
        name: 'Repairing Serum',
        description: 'Intensive repair serum for damaged hair',
        price: 38.00,
        category: 'Treatment Systems',
        stock: 30,
        sku: 'RS-002',
        image: 'https://example.com/repairing-serum.jpg',
        isBestSeller: false,
        isNewProduct: true,
        rating: 4.8,
        weight: '100ml',
        size: 'Standard'
      }
    ]

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(sampleData)

    // Add the worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'buffer' 
    })

    // Return the Excel file
    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="product-import-template.xlsx"',
      },
    })
  } catch (error) {
    console.error('Template generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate template' },
      { status: 500 }
    )
  }
}
