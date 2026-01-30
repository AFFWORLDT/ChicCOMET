const XLSX = require('xlsx');
const fs = require('fs');

try {
  // Read the original Excel file
  const workbook = XLSX.readFile('bulkexcel.xlsx');
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
  console.log('Converting Excel file...');
  
  // Convert to our required format
  const convertedData = jsonData.map((row, index) => {
    // Extract product name from description (remove extra spaces)
    const name = row.Description ? row.Description.trim() : `Product ${index + 1}`;
    
    // Use Reference as SKU
    const sku = row.Reference || `SKU-${index + 1}`;
    
    // Use PRICE as price
    const price = row['PRICE '] || row.PRICE || 0;
    
    // Determine category based on description
    let category = 'Treatment Systems'; // Default category
    if (name.toLowerCase().includes('shampoo')) {
      category = 'Hair Care';
    } else if (name.toLowerCase().includes('masque') || name.toLowerCase().includes('mask')) {
      category = 'Treatment Systems';
    } else if (name.toLowerCase().includes('serum')) {
      category = 'Treatment Systems';
    } else if (name.toLowerCase().includes('conditioner')) {
      category = 'Hair Care';
    }
    
    return {
      name: name,
      description: name, // Use name as description too
      price: parseFloat(price),
      category: category,
      stock: 50, // Default stock
      sku: sku,
      image: '', // Empty for now
      isBestSeller: false,
      isNewProduct: true,
      rating: 4.5,
      weight: 'Standard',
      size: 'Standard',
      barcode: row.barcode || ''
    };
  });
  
  // Create new workbook
  const newWorkbook = XLSX.utils.book_new();
  const newWorksheet = XLSX.utils.json_to_sheet(convertedData);
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Products');
  
  // Write the converted file
  XLSX.writeFile(newWorkbook, 'bulkexcel-converted.xlsx');
  
  console.log('✅ Conversion completed!');
  console.log(`📁 New file created: bulkexcel-converted.xlsx`);
  console.log(`📊 Converted ${convertedData.length} products`);
  
  // Show sample of converted data
  console.log('\n=== SAMPLE CONVERTED DATA ===');
  convertedData.slice(0, 3).forEach((product, index) => {
    console.log(`\nProduct ${index + 1}:`);
    console.log(`  Name: ${product.name}`);
    console.log(`  SKU: ${product.sku}`);
    console.log(`  Price: AED ${product.price}`);
    console.log(`  Category: ${product.category}`);
    console.log(`  Stock: ${product.stock}`);
  });
  
  // Show category distribution
  const categoryCount = {};
  convertedData.forEach(product => {
    categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
  });
  
  console.log('\n=== CATEGORY DISTRIBUTION ===');
  Object.entries(categoryCount).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} products`);
  });
  
} catch (error) {
  console.error('Error converting Excel file:', error.message);
}
