#!/usr/bin/env pwsh
# Test script to verify washing instructions persistence

Write-Host "=== Washing Instructions Persistence Test ===" -ForegroundColor Cyan
Write-Host ""

# Get a product to test with
Write-Host "1. Fetching a product to test..." -ForegroundColor Yellow
$products = curl.exe -s "http://localhost:3000/api/products?limit=1" | ConvertFrom-Json
$productId = $products.data[0]._id
$productName = $products.data[0].name

Write-Host "   Testing with product: $productName (ID: $productId)" -ForegroundColor Green
Write-Host ""

# Prepare test data with washing instructions
Write-Host "2. Sending update with washing instructions..." -ForegroundColor Yellow
$testData = @{
    name = $productName
    washingInstructions = @(
        "Machine wash cold, gentle cycle. Tumble dry low. Do not bleach.",
        "Hand wash with mild detergent. Do not wring. Dry flat in shade."
    )
} | ConvertTo-Json

Write-Host "   Payload:" -ForegroundColor Gray
Write-Host "   $testData" -ForegroundColor Gray
Write-Host ""

# Send the update
$response = curl.exe -X PUT -H "Content-Type: application/json" -d $testData "http://localhost:3000/api/products/$productId" | ConvertFrom-Json

Write-Host "3. Update response:" -ForegroundColor Yellow
if ($response.success) {
    Write-Host "   ✓ Success!" -ForegroundColor Green
    Write-Host "   Washing Instructions in response: $($response.data.washingInstructions)" -ForegroundColor Green
} else {
    Write-Host "   ✗ Failed: $($response.error)" -ForegroundColor Red
}
Write-Host ""

# Verify by fetching the product again
Write-Host "4. Verifying persistence..." -ForegroundColor Yellow
Start-Sleep -Seconds 1
$verify = curl.exe -s "http://localhost:3000/api/products/$productId" | ConvertFrom-Json

if ($verify.success) {
    $savedInstructions = $verify.data.washingInstructions
    Write-Host "   Saved washing instructions count: $($savedInstructions.Count)" -ForegroundColor Cyan
    if ($savedInstructions.Count -gt 0) {
        Write-Host "   ✓ Instructions persisted successfully!" -ForegroundColor Green
        $savedInstructions | ForEach-Object { Write-Host "     - $_" -ForegroundColor Green }
    } else {
        Write-Host "   ✗ No instructions found in database!" -ForegroundColor Red
    }
} else {
    Write-Host "   ✗ Failed to fetch product" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Cyan
Write-Host "Check the terminal running 'npm run dev' for detailed [API:PUT] logs" -ForegroundColor Yellow
