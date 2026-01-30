import { Footer } from "@/components/footer"
import { LuxuryProductGallery } from "@/components/luxury-product-gallery"
import { Crown } from "lucide-react"

const xlProducts = [
  {
    id: "xl-1",
    name: "XL Keratin Silk Treatment",
    description: "Extra long keratin and silk treatment for maximum hair length and strength",
    image: "/XL/XL(1).png",
    price: 399,
    originalPrice: 499,
    category: "XL",
    features: ["Extra Length", "Keratin & Silk", "Maximum Strength", "Professional Grade"],
    premium: true,
    rating: 4.9,
    reviews: 189
  },
  {
    id: "xl-2", 
    name: "XL Length Shampoo",
    description: "Specialized shampoo to maintain and enhance length treatments",
    image: "/XL/XL(2).png",
    price: 119,
    originalPrice: 149,
    category: "XL",
    features: ["Length Maintenance", "Keratin Support", "Gentle Care"],
    premium: true,
    rating: 4.8,
    reviews: 134
  },
  {
    id: "xl-3",
    name: "XL Silk Conditioner", 
    description: "Silk-infused conditioner for luxurious length care",
    image: "/XL/XL(3).png",
    price: 129,
    originalPrice: 159,
    category: "XL", 
    features: ["Silk Infusion", "Length Enhancement", "Luxury Care"],
    premium: true,
    rating: 4.7,
    reviews: 112
  },
  {
    id: "xl-4",
    name: "XL Professional Mask",
    description: "Intensive mask for maximum length and strength results",
    image: "/XL/XL(4).png",
    price: 179,
    originalPrice: 229,
    category: "XL",
    features: ["Intensive Treatment", "Maximum Length", "Professional Results"],
    premium: true,
    rating: 4.9,
    reviews: 98
  },
  {
    id: "xl-5",
    name: "XL Finishing Oil",
    description: "Luxury finishing oil for perfect length treatment results",
    image: "/XL/XL(5).png",
    price: 89,
    originalPrice: 119,
    category: "XL",
    features: ["Finishing Touch", "Luxury Oil", "Perfect Results"],
    premium: true,
    rating: 4.6,
    reviews: 87
  }
]

export default function XLCollectionPage() {
  return (
    <div className="min-h-screen">
      <LuxuryProductGallery
        categoryId="xl"
        categoryName="XL Collection"
        categoryDescription="Extra Long Keratin & Silk for Maximum Hair Length and Strength. Professional-grade formulations that extend and strengthen your hair naturally."
        categoryImage="/XL/GROUPE/Gamme XL Kératine Soie.jpg"
        products={xlProducts}
        color="bg-gradient-to-br from-yellow-600 to-amber-800"
        gradient="from-yellow-500/20 to-amber-600/20"
        icon={<Crown className="w-8 h-8 text-yellow-400" />}
      />
      <Footer />
    </div>
  )
}
