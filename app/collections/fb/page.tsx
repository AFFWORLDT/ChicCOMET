import { Footer } from "@/components/footer"
import { LuxuryProductGallery } from "@/components/luxury-product-gallery"
import { Star } from "lucide-react"

const fbProducts = [
  {
    id: "fb-1",
    name: "FB Fiber Bonding Treatment",
    description: "Professional fiber bonding technology for maximum hair strength",
    image: "/FB/FB(1).png",
    price: 379,
    originalPrice: 479,
    category: "FB",
    features: ["Fiber Bonding", "Maximum Strength", "Professional Grade"],
    premium: true,
    rating: 4.9,
    reviews: 178
  },
  {
    id: "fb-2", 
    name: "FB Strength Shampoo",
    description: "Specialized shampoo to enhance and maintain fiber bonding",
    image: "/FB/FB(2).png",
    price: 119,
    originalPrice: 149,
    category: "FB",
    features: ["Strength Enhancement", "Bonding Support", "Professional Formula"],
    premium: true,
    rating: 4.8,
    reviews: 145
  },
  {
    id: "fb-3",
    name: "FB Professional Conditioner", 
    description: "Intensive conditioner for maximum hair strength and resilience",
    image: "/FB/FB(3).png",
    price: 129,
    originalPrice: 159,
    category: "FB", 
    features: ["Professional Care", "Strength Maintenance", "Resilience Formula"],
    premium: true,
    rating: 4.7,
    reviews: 132
  },
  {
    id: "fb-4",
    name: "FB Maximum Strength Mask",
    description: "Intensive mask for ultimate hair strength and durability",
    image: "/FB/FB(4).png",
    price: 179,
    originalPrice: 229,
    category: "FB",
    features: ["Maximum Strength", "Intensive Treatment", "Durability Enhancement"],
    premium: true,
    rating: 4.9,
    reviews: 115
  },
  {
    id: "fb-5",
    name: "FB Bonding Serum",
    description: "Advanced serum to enhance fiber bonding results",
    image: "/FB/FB(5).png",
    price: 99,
    originalPrice: 129,
    category: "FB",
    features: ["Bonding Enhancement", "Advanced Formula", "Professional Results"],
    premium: true,
    rating: 4.6,
    reviews: 98
  },
  {
    id: "fb-6",
    name: "FB Finishing Treatment",
    description: "Final step treatment for perfect fiber bonding finish",
    image: "/FB/FB(6).png",
    price: 89,
    originalPrice: 119,
    category: "FB",
    features: ["Finishing Touch", "Perfect Results", "Professional Finish"],
    premium: true,
    rating: 4.8,
    reviews: 87
  }
]

export default function FBCollectionPage() {
  return (
    <div className="min-h-screen">
      <LuxuryProductGallery
        categoryId="fb"
        categoryName="FB Collection"
        categoryDescription="Fiber Bonding Technology for Maximum Hair Strength. Professional-grade formulations that create strong fiber bonds for maximum hair strength and professional results."
        categoryImage="/FB/GROUPE/Gamme FB.jpg"
        products={fbProducts}
        color="bg-gradient-to-br from-violet-600 to-purple-800"
        gradient="from-violet-500/20 to-purple-600/20"
        icon={<Star className="w-8 h-8 text-violet-400" />}
      />
      <Footer />
    </div>
  )
}

