"use client"

import Head from 'next/head'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  structuredData?: any
}

export function SEOOptimizer({
  title = "Whitlin - Trusted Linen Excellence Since 1984",
  description = "Trusted Linen Excellence Since 1984. Discover premium-quality linen crafted with care and expertise. From luxurious duvets, bed sheets, and duvet covers to plush towels and more — Whitlin has been delivering comfort, style, and durability for over four decades around the globe.",
  keywords = ["hospitality linen", "bed linen", "bath linen", "hotel linen", "luxury sheets", "cotton sheets", "Egyptian cotton"],
  image = "/hero.png",
  url = "https://whitlin.com",
  type = "website",
  structuredData
}: SEOProps) {
  const fullTitle = title.includes("Whitlin") ? title : `${title} | Whitlin`
  
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Whitlin" />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Whitlin" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    </Head>
  )
}

// Structured data generators
export const generateProductStructuredData = (product: any) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "image": product.images,
    "brand": {
      "@type": "Brand",
      "name": "Whitlin"
    },
  "offers": {
    "@type": "Offer",
    "price": product.price,
    "priceCurrency": "AED",
    "availability": product.isActive ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
  }
})

export const generateOrganizationStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "WHITLIN L.L.C- FZ",
  "alternateName": "Whitlin",
  "url": "https://whitlin.com",
  "logo": "https://whitlin.com/W_Logo_N.png",
  "description": "Trusted Linen Excellence Since 1984. Discover premium-quality linen crafted with care and expertise. From luxurious duvets, bed sheets, and duvet covers to plush towels and more - Whitlin has been delivering comfort, style, and durability for over four decades around the globe. We proudly serve both B2B and B2C markets.",
  "foundingDate": "1984",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Al Ittihad Road",
    "addressLocality": "Dubai",
    "addressCountry": "AE"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+971-54-438-9849",
    "email": "info@whitlin.com",
    "contactType": "customer service"
  }
})
