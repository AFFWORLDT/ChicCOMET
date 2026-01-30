import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/hero.png"
          alt="Whitlin Professional Hospitality Linen"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-balance">
          Welcome to Our World of Quality Hotel Linen
          <span className="block text-primary">Professional Supplier Since 1984</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 text-pretty max-w-2xl mx-auto opacity-90">
          All our Bath & Bed Linen Products Are Crafted Out of 100% Virgin Cotton Long Staple Yarn Producing plush 
          Extreme softness of Dove Feather Standard & Highly Absorbent.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8">
              Shop Now
            </Button>
          </Link>
          <Link href="/collections">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black bg-transparent"
            >
              View Collections
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
