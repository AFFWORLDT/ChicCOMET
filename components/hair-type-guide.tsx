import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export default function HairTypeGuide() {
  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Find Your Perfect Hair Treatment</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover which Whitlin system is ideal for your unique hair type and needs
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <Image
              src="/images/hair-type-guide.jpeg"
              alt="Hair Type Guide - Find your hair type from straight to curly"
              width={600}
              height={400}
              className="rounded-2xl shadow-2xl"
            />
          </div>

          <div className="space-y-6">
            <div className="grid gap-4">
              <Card className="border-l-4 border-l-amber-500">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Type 1: Straight Hair</h3>
                  <p className="text-gray-600 mb-3">
                    Fine to thick, naturally straight hair that tends to be oily at roots.
                  </p>
                  <p className="text-sm font-medium text-amber-600">
                    Recommended: Nourishing Range (BC) or Repair Range (AC)
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Type 2: Wavy Hair</h3>
                  <p className="text-gray-600 mb-3">Natural waves with tendency to frizz, especially in humidity.</p>
                  <p className="text-sm font-medium text-orange-600">
                    Recommended: Expert-Liss Range (XL) or Inforcer Range (FB)
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Type 3: Curly Hair</h3>
                  <p className="text-gray-600 mb-3">Defined curls that need moisture and frizz control.</p>
                  <p className="text-sm font-medium text-red-600">
                    Recommended: Restructuring Range (CC) or KG Green Nutrition
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Type 4: Coily/Afro Hair</h3>
                  <p className="text-gray-600 mb-3">
                    Tight curls to kinky texture requiring intensive moisture and care.
                  </p>
                  <p className="text-sm font-medium text-purple-600">
                    Recommended: KG Green Revitalizing or Regenerating Range (AB)
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
