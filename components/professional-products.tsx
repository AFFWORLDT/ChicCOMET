"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart } from "lucide-react"
import { useWishlist } from "@/hooks/use-wishlist"
import { toast } from "sonner"

export default function ProfessionalProducts() {
  const professionalProducts = [
    {
      id: 1,
      name: "600 GSM Organic Towels",
      description: "100% cotton, 600gsm organic white towels available in a range of sizes. Hand Towel 50x95cm, Bath Towel 70x145cm, Bath Sheet 100x178cm.",
      image: "https://images.unsplash.com/photo-1544462815-739e5cee5343?w=800&h=800&fit=crop&auto=format&q=85",
      category: "Bath Linen",
      badge: "Premium",
      price: "AED 179",
      sizes: ["Hand Towel", "Bath Towel", "Bath Sheet"],
    },
    {
      id: 2,
      name: "400 TC Luxury Bed Linen",
      description: "100% Virgin Cotton, 400 Thread Count luxury bed linen with fusion/embroidery details. Available in all sizes.",
      image: "https://images.unsplash.com/photo-1556911229-bb31c44d8251?w=800&h=800&fit=crop&auto=format&q=85",
      category: "Bed Linen",
      badge: "Luxury",
      price: "AED 338",
      sizes: ["Single", "Double", "King", "Super King"],
    },
    {
      id: 3,
      name: "600 TC Hyper Luxury Bedsheets",
      description: "Ultimate luxury hospitality products with 600 TC premium cotton. Extreme softness and durability.",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop&auto=format&q=85",
      category: "Hyper Luxury",
      badge: "Premium",
      price: "AED 750",
      sizes: ["Single", "Double", "King", "Super King"],
    },
    {
      id: 4,
      name: "Eco Microfibre Duvet",
      description: "10.5 tog eco friendly duvet filled with 100% recycled plastic bottles, covered with embossed jacquard fabric.",
      image: "https://images.unsplash.com/photo-1584622650111-993a573fbfb7?w=800&h=800&fit=crop&auto=format&q=85",
      category: "Eco-Friendly",
      badge: "New",
      price: "AED 299",
      sizes: ["Single", "Double", "King", "Super King"],
    },
    {
      id: 5,
      name: "Goose Feather & Down Pillow",
      description: "Natural option with 85% goose feather and 15% down with luxury 100% cotton percale cover.",
      image: "https://images.unsplash.com/photo-1586105251267-828a5c76f6f1?w=800&h=800&fit=crop&auto=format&q=85",
      category: "Pillows",
      badge: "Natural",
      price: "AED 199",
      sizes: ["Standard", "King Size"],
    },
    {
      id: 6,
      name: "Bathrobes & Slippers",
      description: "100% cotton towelling shawl collar bathrobes and terry towelling slippers. Perfect for hotels and spas.",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=800&fit=crop&auto=format&q=85",
      category: "Accessories",
      badge: "Essential",
      price: "AED 149",
      sizes: ["Various"],
    },
  ]

  const { toggleWishlist, isInWishlist } = useWishlist()

  const handleToggleWishlist = async (product: any, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    await toggleWishlist({
      ...product,
      id: product.id.toString(), // Ensure ID is string for consistency
    })
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Professional Hospitality Products</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete your hotel with our premium hospitality linen essentials - From luxury bed linen to premium bath towels
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {professionalProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge
                  className={`absolute top-4 left-4 ${
                    product.badge === "Premium"
                      ? "bg-red-600"
                      : product.badge === "New"
                        ? "bg-green-600"
                        : product.badge === "Professional"
                          ? "bg-purple-600"
                          : "bg-amber-600"
                  }`}
                >
                  {product.badge}
                </Badge>
                
                {/* Wishlist Toggle */}
                <button
                  onClick={(e) => handleToggleWishlist(product, e)}
                  className="absolute top-4 right-4 z-10 transition-all transform hover:scale-110 drop-shadow-md rounded-full rounded-tl-full rounded-tr-full rounded-bl-full rounded-br-full"
                >
                  <Heart 
                    className={`w-6 h-6 ${isInWishlist(product.id.toString()) ? "text-rose-500 fill-rose-500" : "text-white stroke-[2.5px]"}`} 
                  />
                </button>
              </div>

              <CardContent className="p-6">
                <div className="mb-2">
                  <span className="text-sm font-medium text-amber-600 uppercase tracking-wide">{product.category}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{product.name}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{product.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-gray-900">{product.price}</span>
                  <div className="text-sm text-gray-500">{product.sizes.join(" • ")}</div>
                </div>

                <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition-all duration-300">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
