import { Footer } from "@/components/footer"
import { LuxuryProductGallery } from "@/components/luxury-product-gallery"
import { Zap } from "lucide-react"

const abProducts = [
  {
    id: "ab-1",
    name: "AB Advanced Bonding Treatment",
    description: "Professional-grade bonding treatment for ultimate hair repair and strength",
    image: "/AB/AB(1).png",
    price: 299,
    originalPrice: 399,
    category: "AB",
    features: ["Advanced Bonding", "Repair Technology", "Professional Grade", "Long-lasting Results"],
    premium: true,
    rating: 4.9,
    reviews: 127
  },
  {
    id: "ab-2", 
    name: "AB Bonding Shampoo",
    description: "Specialized shampoo designed to maintain and enhance bonding treatments",
    image: "/AB/AB(2).png",
    price: 89,
    originalPrice: 119,
    category: "AB",
    features: ["Bonding Maintenance", "Gentle Formula", "Professional Results"],
    premium: true,
    rating: 4.8,
    reviews: 89
  },
  {
    id: "ab-3",
    name: "AB Bonding Conditioner", 
    description: "Deep conditioning treatment to complement bonding technology",
    image: "/AB/AB(3).png",
    price: 99,
    originalPrice: 129,
    category: "AB", 
    features: ["Deep Conditioning", "Bonding Support", "Moisture Lock"],
    premium: true,
    rating: 4.7,
    reviews: 76
  }
]

export default function ABCollectionPage() {
  return (
    <div className="min-h-screen">
      <LuxuryProductGallery
        categoryId="ab"
        categoryName="AB Collection"
        categoryDescription="Advanced Bonding Technology for Ultimate Hair Repair and Strength. Professional-grade formulations that rebuild hair bonds for lasting results."
        categoryImage="/AB/GROUPE/Gamme AB.jpg"
        products={abProducts}
        color="bg-gradient-to-br from-purple-600 to-indigo-800"
        gradient="from-purple-500/20 to-indigo-600/20"
        icon={<Zap className="w-8 h-8 text-purple-400" />}
      />
      <Footer />
    </div>
  )
}
