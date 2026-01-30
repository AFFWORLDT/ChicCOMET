import { Footer } from "@/components/footer"
import { LuxuryProductGallery } from "@/components/luxury-product-gallery"
import { Sparkles } from "lucide-react"

const ccProducts = [
  {
    id: "cc-1",
    name: "CC Color Care Treatment",
    description: "Professional color care system for vibrant, protected hair",
    image: "/CC/GROUPE/TTD_2516.png",
    price: 329,
    originalPrice: 429,
    category: "CC",
    features: ["Color Protection", "Vibrant Results", "Professional Grade"],
    premium: true,
    rating: 4.9,
    reviews: 145
  },
  {
    id: "cc-2", 
    name: "CC Color Safe Shampoo",
    description: "Specialized shampoo to maintain and protect hair color",
    image: "/CC/GROUPE/TTD_2517.png",
    price: 99,
    originalPrice: 129,
    category: "CC",
    features: ["Color Safe", "Gentle Formula", "Color Preservation"],
    premium: true,
    rating: 4.8,
    reviews: 128
  },
  {
    id: "cc-3",
    name: "CC Color Enhancing Conditioner", 
    description: "Conditioning treatment to enhance and protect hair color",
    image: "/CC/GROUPE/TTD_2518.png",
    price: 109,
    originalPrice: 139,
    category: "CC", 
    features: ["Color Enhancement", "Moisture Balance", "Vibrant Results"],
    premium: true,
    rating: 4.7,
    reviews: 112
  },
  {
    id: "cc-4",
    name: "CC Professional Care Mask",
    description: "Intensive mask for maximum color protection and vibrancy",
    image: "/CC/GROUPE/TTD_2520.png",
    price: 159,
    originalPrice: 209,
    category: "CC",
    features: ["Intensive Treatment", "Maximum Protection", "Professional Care"],
    premium: true,
    rating: 4.9,
    reviews: 96
  }
]

export default function CCCollectionPage() {
  return (
    <div className="min-h-screen">
      <LuxuryProductGallery
        categoryId="cc"
        categoryName="CC Collection"
        categoryDescription="Color Care System for Vibrant, Protected Hair. Professional-grade formulations that protect, enhance, and maintain your hair color for long-lasting vibrancy."
        categoryImage="/CC/GROUPE/Gamme CC.jpg"
        products={ccProducts}
        color="bg-gradient-to-br from-rose-600 to-pink-800"
        gradient="from-rose-500/20 to-pink-600/20"
        icon={<Sparkles className="w-8 h-8 text-rose-400" />}
      />
      <Footer />
    </div>
  )
}

