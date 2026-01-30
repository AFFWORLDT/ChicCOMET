import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Playfair_Display, Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { CartProvider } from "@/lib/cart-context"
import { AuthProvider } from "@/lib/auth-context"
import { LayoutProvider } from "@/components/layout-provider"
import { LanguageProvider } from "@/components/language-provider"
import { CurrencyProvider } from "@/components/currency-provider"
import { Toaster } from "sonner"
import { PerformanceMonitor } from "@/components/performance-monitor"
import { ErrorBoundary } from "@/components/error-boundary"
import { MobileOptimizer } from "@/components/mobile-optimizer"
// import { PerformanceDashboard } from "@/components/performance-dashboard"
import { ChunkErrorHandler } from "@/components/chunk-error-handler"
import { Chatbot } from "@/components/chatbot"
import { LeadPopupWrapper } from "@/components/lead-popup-wrapper"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair-display",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: {
    default: "ChicComet - Premium Corporate Gifting",
    template: "%s | ChicComet"
  },
  description:
    "ChicComet L.L.C- FZ - Elevate your brand with premium corporate gifting solutions. From custom merchandising and employee welcome kits to sustainable tech and drinkware. We specialize in creating memorable brand experiences for teams and clients worldwide.",
  keywords: ["corporate gifting", "custom merch", "company swag", "employee welcome kits", "sustainable gifts", "promotional products", "branded tech", "corporate apparel"],
  authors: [{ name: "ChicComet" }],
  creator: "ChicComet",
  publisher: "ChicComet",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://chiccomet.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://chiccomet.com',
    title: 'ChicComet - Premium Corporate Gifting Solutions',
    description: 'Elevate your brand with premium corporate gifting solutions. Custom merchandising, welcome kits, and sustainable products for your team and clients.',
    siteName: 'ChicComet',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChicComet - Premium Corporate Gifting',
    description: 'Elevate your brand with premium corporate gifting solutions. Custom merchandising, welcome kits, and sustainable products.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${playfairDisplay.variable} ${poppins.variable}`}>
        <ChunkErrorHandler />
        <MobileOptimizer />
        <ErrorBoundary>
          <LanguageProvider>
            <AuthProvider>
              <CartProvider>
                <CurrencyProvider>
                  <LayoutProvider>
                    <Suspense fallback={null}>{children}</Suspense>
                  </LayoutProvider>
                </CurrencyProvider>
              </CartProvider>
            </AuthProvider>
          </LanguageProvider>
        </ErrorBoundary>
        <Toaster position="top-right" />
        <Analytics />
        <PerformanceMonitor />
        {/* <PerformanceDashboard /> */}
        <Chatbot />
        <LeadPopupWrapper />
      </body>
    </html>
  )
}
