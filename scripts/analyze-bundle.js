#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🔍 Analyzing bundle size and performance...\n')

// Check if @next/bundle-analyzer is installed
try {
  require.resolve('@next/bundle-analyzer')
} catch (e) {
  console.log('📦 Installing @next/bundle-analyzer...')
  execSync('npm install --save-dev @next/bundle-analyzer', { stdio: 'inherit' })
}

// Create bundle analyzer config
const bundleAnalyzerConfig = `
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // Your existing Next.js config
})
`

// Update next.config.mjs to include bundle analyzer
const nextConfigPath = path.join(process.cwd(), 'next.config.mjs')
let nextConfig = fs.readFileSync(nextConfigPath, 'utf8')

if (!nextConfig.includes('bundle-analyzer')) {
  const updatedConfig = nextConfig.replace(
    'export default nextConfig',
    `import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(nextConfig)`
  )
  
  fs.writeFileSync(nextConfigPath, updatedConfig)
  console.log('✅ Updated next.config.mjs with bundle analyzer')
}

// Add analyze scripts to package.json
const packageJsonPath = path.join(process.cwd(), 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

if (!packageJson.scripts.analyze) {
  packageJson.scripts.analyze = 'ANALYZE=true npm run build'
  packageJson.scripts['analyze:server'] = 'BUNDLE_ANALYZE=server npm run build'
  packageJson.scripts['analyze:browser'] = 'BUNDLE_ANALYZE=browser npm run build'
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
  console.log('✅ Added analyze scripts to package.json')
}

console.log('\n🚀 Bundle analysis setup complete!')
console.log('\nTo analyze your bundle:')
console.log('  npm run analyze        # Analyze both server and browser bundles')
console.log('  npm run analyze:server # Analyze server bundle only')
console.log('  npm run analyze:browser # Analyze browser bundle only')
console.log('\nThe analysis will open in your browser automatically.')
