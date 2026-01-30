"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  x: number; // Percentage from left
  y: number; // Percentage from top
}

const products: Product[] = [
  {
    id: "1",
    name: "Collector Decorative Cushion Cover",
    price: "$650.00",
    image: "/image/bed.jpg",
    x: 45, // Approximate position based on the image
    y: 50,
  },
  {
    id: "2",
    name: "Luxury Silk Pillowcase", // Placeholder
    price: "$250.00",
    image: "/image/bed.jpg", // Reusing image for demo
    x: 25,
    y: 45,
  },
  {
    id: "3",
    name: "Cashmere Throw Blanket", // Placeholder
    price: "$890.00",
    image: "/image/bed.jpg", // Reusing image for demo
    x: 60,
    y: 52,
  },
  {
    id: "4",
    name: "Modern Bedside Lamp", // Placeholder
    price: "$420.00",
    image: "/image/bed.jpg", // Reusing image for demo
    x: 48,
    y: 28,
  },
];

export function ShopTheLook() {
  const [activeProduct, setActiveProduct] = useState<string | null>(null);

  return (
    <section className="py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16 mb-6 sm:mb-8 flex items-end justify-between">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-gray-900 font-light italic">
          Shop The Look
        </h2>
        <a
          href="/shop-the-look"
          className="text-xs sm:text-sm uppercase tracking-widest border-b border-gray-900 pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors"
        >
          Shop The Look
        </a>
      </div>

      <div className="relative w-full h-[80vh] min-h-[600px] overflow-hidden group">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/image/bed.jpg"
            alt="Shop the look background"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          {/* Dark Overlay gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        </div>

        {/* Content Overlay - Text (Left) */}
        <div className="absolute bottom-12 left-8 md:bottom-16 md:left-16 z-20 max-w-lg pointer-events-none select-none">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-2 leading-tight drop-shadow-lg">
            Create Spaces That Restore and Inspire
          </h2>
          <p className="text-white/90 text-xs tracking-wider uppercase drop-shadow-md font-medium">
            Legacy of timeless luxury.
          </p>
        </div>

        {/* Content Overlay - Button (Right) */}
        <div className="absolute bottom-12 right-8 md:bottom-16 md:right-16 z-20">
          <Button
            variant="outline"
            className="bg-white/10 backdrop-blur-md text-white border-white hover:bg-white hover:text-black transition-all duration-300 rounded-none px-10 py-6 text-sm uppercase tracking-widest hover:scale-105"
          >
            Shop The Look
          </Button>
        </div>

        {/* Hotspots */}
        {products.map((product) => (
          <div
            key={product.id}
            className={`absolute ${activeProduct === product.id ? "z-50" : "z-30"}`}
            style={{ left: `${product.x}%`, top: `${product.y}%` }}
          >
            {/* Hotspot Circle */}
            <button
              onClick={() =>
                setActiveProduct(
                  activeProduct === product.id ? null : product.id,
                )
              }
              onMouseEnter={() => setActiveProduct(product.id)}
              className="group relative w-8 h-8 -ml-4 -mt-4 flex items-center justify-center focus:outline-none"
              aria-label={`View details for ${product.name}`}
            >
              <div
                className={`absolute inset-0 rounded-full border border-white transition-transform duration-500 ${activeProduct === product.id ? "scale-150 opacity-0" : "scale-100 opacity-100 group-hover:scale-125"}`}
              />
              <div className="w-3 h-3 bg-white rounded-full shadow-lg" />
            </button>

            {/* Product Popover */}
            <AnimatePresence>
              {activeProduct === product.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 bottom-full mb-4 -translate-x-1/2 w-72 bg-white shadow-xl z-40 overflow-hidden"
                  onMouseEnter={() => setActiveProduct(product.id)}
                  onMouseLeave={() => setActiveProduct(null)}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] px-2 py-1 uppercase tracking-wider backdrop-blur-sm">
                      New Arrivals
                    </div>
                    <button className="absolute top-3 right-3 text-white hover:text-red-500 transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>

                    {/* Quick Shop Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <button className="bg-transparent border border-white text-white px-6 py-2 uppercase text-sm tracking-widest hover:bg-white hover:text-black transition-colors">
                        Quick Shop
                      </button>
                    </div>
                  </div>

                  <div className="p-4 text-center">
                    <h3 className="text-sm text-gray-900 font-medium mb-1 leading-relaxed">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">{product.price}</p>
                  </div>

                  {/* Mobile/Connect Line (Optional decoration) */}
                  <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 transform" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
