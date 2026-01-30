import { Footer } from "@/components/footer"
import { LuxuryProductGallery } from "@/components/luxury-product-gallery"
import { Crown } from "lucide-react"

const ddProducts = [
  {
    id: "dd-1",
    name: "DD Deep Detox Treatment",
    description: "Professional deep detox system for ultimate hair recovery",
    image: "/DD/DD(1).png",
    price: 349,
    originalPrice: 449,
    category: "DD",
    features: ["Deep Detox", "Hair Recovery", "Professional Grade"],
    premium: true,
    rating: 4.9,
    reviews: 167
  },
  {
    id: "dd-2", 
    name: "DD Damage Repair Shampoo",
    description: "Specialized shampoo for damaged hair repair and restoration",
    image: "/DD/DD(2).png",
    price: 109,
    originalPrice: 139,
    category: "DD",
    features: ["Damage Repair", "Restoration Formula", "Gentle Care"],
    premium: true,
    rating: 4.8,
    reviews: 134
  },
  {
    id: "dd-3",
    name: "DD Recovery Conditioner", 
    description: "Intensive conditioning treatment for ultimate hair recovery",
    image: "/DD/DD(3).png",
    price: 119,
    originalPrice: 149,
    category: "DD", 
    features: ["Recovery Treatment", "Deep Nourishment", "Hair Restoration"],
    premium: true,
    rating: 4.7,
    reviews: 118
  },
  {
    id: "dd-4",
    name: "DD Ultimate Repair Mask",
    description: "Intensive repair mask for maximum damage recovery",
    image: "/DD/DD(4).png",
    price: 169,
    originalPrice: 219,
    category: "DD",
    features: ["Ultimate Recovery", "Maximum Repair", "Intensive Treatment"],
    premium: true,
    rating: 4.9,
    reviews: 102
  }
]

export default function DDCollectionPage() {
  return (
    <div className="min-h-screen">
      <LuxuryProductGallery
        categoryId="dd"
        categoryName="DD Collection"
        categoryDescription="Deep Detox & Damage Repair for Ultimate Hair Recovery. Professional-grade formulations that deeply detoxify and repair damaged hair for complete restoration."
        categoryImage="/DD/GROUPE/Gamme DD.jpg"
        products={ddProducts}
        color="bg-gradient-to-br from-amber-600 to-orange-800"
        gradient="from-amber-500/20 to-orange-600/20"
        icon={<Crown className="w-8 h-8 text-amber-400" />}
      />
      <Footer />
    </div>
  )
}

