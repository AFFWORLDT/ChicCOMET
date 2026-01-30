"use client";

import Image from "next/image";
import Link from "next/link";

export function BoutiqueSection() {
  return (
    <section className="py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16 mb-6 sm:mb-8 flex items-end justify-between">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-gray-900 font-light italic">
          Discover a Boutique
        </h2>
        <Link
          href="/stores"
          className="text-xs sm:text-sm uppercase tracking-widest border-b border-gray-900 pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors"
        >
          Visit a Boutique
        </Link>
      </div>

      <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden group">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/image/store.jpg"
            alt="Whitlin Boutique Storefront"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-20 px-4">
          {/* Subtitle */}
          <p className="text-xs sm:text-sm tracking-[0.2em] uppercase mb-4 sm:mb-6 font-light drop-shadow-md">
            Personal Shopping Experience
          </p>

          {/* Main Title */}
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-8 sm:mb-10 font-light italic leading-tight drop-shadow-lg">
            Discover a Boutique
          </h2>

          {/* Action Button */}
          <Link
            href="/stores"
            className="group/btn inline-flex items-center gap-3 text-sm uppercase tracking-widest hover:text-white/80 transition-colors duration-300"
          >
            <span className="border-b border-white pb-1">Visit a Boutique</span>
            <span className="border border-white rounded-full w-6 h-6 flex items-center justify-center text-xs group-hover/btn:bg-white group-hover/btn:text-black transition-all duration-300">
              +
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
