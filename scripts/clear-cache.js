/**
 * Script to clear all caches
 * Run with: node scripts/clear-cache.js
 */

const fs = require('fs')
const path = require('path')

console.log('Clearing caches...')

// Clear Next.js cache
const nextCacheDirs = [
  '.next',
  '.next/cache',
  'node_modules/.cache'
]

nextCacheDirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir)
  if (fs.existsSync(fullPath)) {
    console.log(`Removing ${dir}...`)
    try {
      fs.rmSync(fullPath, { recursive: true, force: true })
      console.log(`✓ Cleared ${dir}`)
    } catch (error) {
      console.error(`✗ Error clearing ${dir}:`, error.message)
    }
  }
})

console.log('\nCache clearing complete!')
console.log('Please restart your development server.')

