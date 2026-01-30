import { Footer } from "@/components/footer"
import { LuxuryProductGallery } from "@/components/luxury-product-gallery"
import { Sparkles } from "lucide-react"

const greenProducts = [
  {
    id: "green-aloe-1",
    name: "KG GREEN Aloe Banana Shampoo",
    description: "Natural aloe vera and banana extract shampoo for gentle, nourishing hair care",
    image: "/GREEN/ALOEVERA BANANE/GREEN(1).png",
    price: 79,
    originalPrice: 99,
    category: "KG GREEN",
    features: ["Natural Ingredients", "Aloe Vera", "Banana Extract", "Gentle Formula"],
    premium: true,
    rating: 4.8,
    reviews: 156
  },
  {
    id: "green-aloe-2",
    name: "KG GREEN Aloe Banana Conditioner",
    description: "Moisturizing conditioner with aloe vera and banana for soft, manageable hair",
    image: "/GREEN/ALOEVERA BANANE/GREEN(2).png", 
    price: 89,
    originalPrice: 109,
    category: "KG GREEN",
    features: ["Deep Moisturizing", "Natural Care", "Soft Results"],
    premium: true,
    rating: 4.9,
    reviews: 134
  },
  {
    id: "green-aloe-3",
    name: "KG GREEN Aloe Banana Mask",
    description: "Intensive hair mask with aloe vera and banana for deep nourishment",
    image: "/GREEN/ALOEVERA BANANE/GREEN(3).png",
    price: 119,
    originalPrice: 149,
    category: "KG GREEN",
    features: ["Intensive Treatment", "Deep Nourishment", "Natural Ingredients"],
    premium: true,
    rating: 4.7,
    reviews: 98
  },
  {
    id: "green-avocado-1",
    name: "KG GREEN Avocado Karité Shampoo",
    description: "Rich avocado and shea butter shampoo for luxurious hair care",
    image: "/GREEN/AVOCAT BEURRE DE KARITE/GREEN(1).png",
    price: 89,
    originalPrice: 119,
    category: "KG GREEN",
    features: ["Avocado Oil", "Shea Butter", "Luxury Care"],
    premium: true,
    rating: 4.8,
    reviews: 112
  },
  {
    id: "green-monoi-1",
    name: "KG GREEN Monoi Vanille Shampoo",
    description: "Exotic monoi oil and vanilla shampoo for tropical hair care experience",
    image: "/GREEN/MONOI VANILLE/GREEN(1).png",
    price: 95,
    originalPrice: 125,
    category: "KG GREEN", 
    features: ["Monoi Oil", "Vanilla Extract", "Tropical Care"],
    premium: true,
    rating: 4.9,
    reviews: 87
  }
]

export default function KGREENCollectionPage() {
  return (
    <div className="min-h-screen">
      <LuxuryProductGallery
        categoryId="green"
        categoryName="KG GREEN Collection"
        categoryDescription="Natural & Organic Hair Care with Premium Ingredients. Eco-friendly formulations that nourish and protect your hair naturally."
        categoryImage="/GREEN/ALOEVERA BANANE/GROUPE/Gamme KG Green Aloe Banana.jpg"
        products={greenProducts}
        color="bg-gradient-to-br from-green-600 to-emerald-800"
        gradient="from-green-500/20 to-emerald-600/20"
        icon={<Sparkles className="w-8 h-8 text-green-400" />}
      />
      <Footer />
    </div>
  )
}
