const XLSX = require('xlsx');
const fs = require('fs');

try {
  // Read the Excel file
  const workbook = XLSX.readFile('bulkexcel.xlsx');
  
  // Get the first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert to JSON
  const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
  console.log('=== EXCEL FILE ANALYSIS ===');
  console.log(`Sheet Name: ${sheetName}`);
  console.log(`Total Rows: ${jsonData.length}`);
  
  if (jsonData.length > 0) {
    console.log('\n=== COLUMN HEADERS ===');
    const headers = Object.keys(jsonData[0]);
    headers.forEach((header, index) => {
      console.log(`${index + 1}. ${header}`);
    });
    
    console.log('\n=== SAMPLE DATA (First 3 rows) ===');
    jsonData.slice(0, 3).forEach((row, index) => {
      console.log(`\nRow ${index + 1}:`);
      Object.entries(row).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });
    });
    
    console.log('\n=== DATA ANALYSIS ===');
    headers.forEach(header => {
      const values = jsonData.map(row => row[header]).filter(val => val !== undefined && val !== '');
      console.log(`\n${header}:`);
      console.log(`  - Non-empty values: ${values.length}`);
      console.log(`  - Sample values: ${values.slice(0, 3).join(', ')}`);
      
      // Check for required fields
      if (['name', 'price', 'category', 'sku'].includes(header.toLowerCase())) {
        console.log(`  - ✅ Required field`);
      }
    });
    
    // Check for missing required fields
    const requiredFields = ['name', 'price', 'category', 'sku'];
    const missingFields = requiredFields.filter(field => 
      !headers.some(header => header.toLowerCase() === field)
    );
    
    if (missingFields.length > 0) {
      console.log('\n❌ MISSING REQUIRED FIELDS:');
      missingFields.forEach(field => {
        console.log(`  - ${field}`);
      });
    } else {
      console.log('\n✅ All required fields present!');
    }
    
    // Check for duplicate SKUs
    const skus = jsonData.map(row => row.sku || row.SKU).filter(sku => sku);
    const uniqueSkus = [...new Set(skus)];
    if (skus.length !== uniqueSkus.length) {
      console.log('\n⚠️  DUPLICATE SKUs FOUND:');
      const duplicates = skus.filter((sku, index) => skus.indexOf(sku) !== index);
      console.log(`  - Duplicate SKUs: ${[...new Set(duplicates)].join(', ')}`);
    } else {
      console.log('\n✅ No duplicate SKUs found!');
    }
    
  } else {
    console.log('❌ No data found in the Excel file');
  }
  
} catch (error) {
  console.error('Error analyzing Excel file:', error.message);
}
