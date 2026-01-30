import { Footer } from "@/components/footer"
import { LuxuryProductGallery } from "@/components/luxury-product-gallery"
import { Gem } from "lucide-react"

const acProducts = [
  {
    id: "ac-1",
    name: "AC Anti-Curl Treatment",
    description: "Professional anti-curl system for perfect straightening results",
    image: "/AC/AC(1).png",
    price: 349,
    originalPrice: 449,
    category: "AC",
    features: ["Anti-Curl Technology", "Straightening Power", "Long-lasting Results", "Professional Grade"],
    premium: true,
    rating: 4.9,
    reviews: 156
  },
  {
    id: "ac-2", 
    name: "AC Straightening Shampoo",
    description: "Specialized shampoo to maintain anti-curl treatments",
    image: "/AC/AC(2).png",
    price: 99,
    originalPrice: 129,
    category: "AC",
    features: ["Treatment Maintenance", "Straightening Support", "Gentle Formula"],
    premium: true,
    rating: 4.8,
    reviews: 98
  },
  {
    id: "ac-3",
    name: "AC Anti-Curl Conditioner", 
    description: "Conditioning treatment to enhance straightening results",
    image: "/AC/AC(3).png",
    price: 109,
    originalPrice: 139,
    category: "AC", 
    features: ["Anti-Curl Enhancement", "Moisture Balance", "Smooth Results"],
    premium: true,
    rating: 4.7,
    reviews: 87
  },
  {
    id: "ac-4",
    name: "AC Professional Mask",
    description: "Intensive mask for maximum straightening results",
    image: "/AC/AC(4).png",
    price: 149,
    originalPrice: 199,
    category: "AC",
    features: ["Intensive Treatment", "Maximum Results", "Professional Care"],
    premium: true,
    rating: 4.9,
    reviews: 73
  },
  {
    id: "ac-5",
    name: "AC Finishing Serum",
    description: "Final step serum for perfect straightening finish",
    image: "/AC/AC(5).png",
    price: 79,
    originalPrice: 99,
    category: "AC",
    features: ["Finishing Touch", "Smooth Finish", "Professional Results"],
    premium: true,
    rating: 4.6,
    reviews: 65
  }
]

export default function ACCollectionPage() {
  return (
    <div className="min-h-screen">
      <LuxuryProductGallery
        categoryId="ac"
        categoryName="AC Collection"
        categoryDescription="Anti-Curl System for Perfect Straightening Results. Professional-grade formulations that eliminate curl and provide long-lasting straight hair."
        categoryImage="/AC/GROUPE/Gamme AC.jpg"
        products={acProducts}
        color="bg-gradient-to-br from-blue-600 to-cyan-800"
        gradient="from-blue-500/20 to-cyan-600/20"
        icon={<Gem className="w-8 h-8 text-blue-400" />}
      />
      <Footer />
    </div>
  )
}
