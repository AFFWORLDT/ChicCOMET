import { Footer } from "@/components/footer"
import { LuxuryProductGallery } from "@/components/luxury-product-gallery"
import { Award } from "lucide-react"

const bcProducts = [
  {
    id: "bc-1",
    name: "BC Bonding Treatment",
    description: "Professional bonding treatment for healthy hair transformation",
    image: "/BC/BC(1).png",
    price: 299,
    originalPrice: 399,
    category: "BC",
    features: ["Bonding Technology", "Hair Transformation", "Professional Grade"],
    premium: true,
    rating: 4.8,
    reviews: 134
  },
  {
    id: "bc-2", 
    name: "BC Conditioning Shampoo",
    description: "Deep conditioning shampoo to enhance bonding treatments",
    image: "/BC/BC(2).png",
    price: 89,
    originalPrice: 119,
    category: "BC",
    features: ["Deep Conditioning", "Bonding Support", "Gentle Formula"],
    premium: true,
    rating: 4.7,
    reviews: 112
  },
  {
    id: "bc-3",
    name: "BC Hair Health Conditioner", 
    description: "Intensive conditioner for healthy hair maintenance",
    image: "/BC/BC(3).png",
    price: 99,
    originalPrice: 129,
    category: "BC", 
    features: ["Hair Health", "Moisture Lock", "Nourishing Formula"],
    premium: true,
    rating: 4.9,
    reviews: 98
  },
  {
    id: "bc-4",
    name: "BC Recovery Mask",
    description: "Intensive recovery mask for damaged hair restoration",
    image: "/BC/BC(4).png",
    price: 149,
    originalPrice: 199,
    category: "BC",
    features: ["Deep Recovery", "Damage Repair", "Intensive Treatment"],
    premium: true,
    rating: 4.8,
    reviews: 87
  }
]

export default function BCCollectionPage() {
  return (
    <div className="min-h-screen">
      <LuxuryProductGallery
        categoryId="bc"
        categoryName="BC Collection"
        categoryDescription="Bonding & Conditioning for Healthy Hair Transformation. Professional-grade formulations that combine bonding technology with deep conditioning for optimal hair health."
        categoryImage="/BC/GROUPE/Gamme BC.jpg"
        products={bcProducts}
        color="bg-gradient-to-br from-emerald-600 to-teal-800"
        gradient="from-emerald-500/20 to-teal-600/20"
        icon={<Award className="w-8 h-8 text-emerald-400" />}
      />
      <Footer />
    </div>
  )
}

