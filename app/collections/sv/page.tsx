import { Footer } from "@/components/footer"
import { LuxuryProductGallery } from "@/components/luxury-product-gallery"
import { Gem } from "lucide-react"

const svProducts = [
  {
    id: "sv-1",
    name: "SV Silver Volumizing Treatment",
    description: "Professional silver technology for luxurious hair volume",
    image: "/SV/SV(1).png",
    price: 329,
    originalPrice: 429,
    category: "SV",
    features: ["Silver Technology", "Volume Enhancement", "Professional Grade"],
    premium: true,
    rating: 4.9,
    reviews: 156
  },
  {
    id: "sv-2", 
    name: "SV Luxury Volume Shampoo",
    description: "Specialized shampoo for maximum volume and luxury care",
    image: "/SV/SV(2).png",
    price: 109,
    originalPrice: 139,
    category: "SV",
    features: ["Volume Enhancement", "Luxury Care", "Professional Formula"],
    premium: true,
    rating: 4.8,
    reviews: 134
  }
]

export default function SVCollectionPage() {
  return (
    <div className="min-h-screen">
      <LuxuryProductGallery
        categoryId="sv"
        categoryName="SV Collection"
        categoryDescription="Silver & Volumizing System for Luxurious Hair Volume. Professional-grade formulations that use advanced silver technology to create luxurious volume and enhance hair appearance."
        categoryImage="/SV/GROUPE/Gamme SV.jpg"
        products={svProducts}
        color="bg-gradient-to-br from-slate-600 to-gray-800"
        gradient="from-slate-500/20 to-gray-600/20"
        icon={<Gem className="w-8 h-8 text-slate-400" />}
      />
      <Footer />
    </div>
  )
}

