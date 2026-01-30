"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface DiscoverItem {
  id: string;
  title: string;
  description: string;
  linkText: string;
  image: string;
  href: string;
}

const discoverItems: DiscoverItem[] = [
  {
    id: "1",
    title: "Sustainable Gifting",
    description:
      "Eco-friendly choices for a greener future. Sustainable materials meets premium design.",
    linkText: "EXPLORE",
    image: "/images/discover-eco.jpg",
    href: "/collections/eco-friendly",
  },
  {
    id: "2",
    title: "Tech Essentials",
    description:
      "Power up your team with premium gadgets. Wireless chargers, headphones, and more.",
    linkText: "SHOP",
    image: "/images/discover-tech.jpg",
    href: "/collections/tech",
  },
  {
    id: "3",
    title: "The Art of Branding",
    description:
      "Precision laser engraving and high-quality printing to make your brand shine.",
    linkText: "DISCOVER",
    image: "/images/discover-branding.jpg",
    href: "/services/branding",
  },
  {
    id: "4",
    title: "Bulk Operations",
    description:
      "Seamless procurement for large teams with our dedicated B2B logistics.",
    linkText: "LEARN MORE",
    image: "/images/discover-bulk.jpg",
    href: "/services/bulk",
  },
];

export function DiscoverSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-[#f5f5f0]">
      <div className="mx-auto px-4 ">
        {/* Header */}
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-900 font-light italic mb-6 sm:mb-8 md:mb-10">
          Discover Corporate Solutions
        </h2>

        {/* Mobile Grid (2x2) */}
        <div className="grid grid-cols-2 gap-2 md:hidden">
          {discoverItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="relative overflow-hidden aspect-[3/4] group"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-active:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white text-xs sm:text-sm font-medium leading-snug mb-1">
                  {item.title}
                </h3>
                <span className="text-white/70 text-[10px] sm:text-xs tracking-wider uppercase">
                  {item.linkText} →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop Flex with hover effects */}
        <div className="hidden md:flex w-full overflow-hidden h-[50vh] lg:h-[60vh] min-h-[350px]">
          {discoverItems.map((item) => {
            const isHovered = hoveredId === item.id;
            const hasHovered = hoveredId !== null;

            return (
              <motion.div
                key={item.id}
                className="relative overflow-hidden h-full"
                initial={false}
                animate={{
                  flex: isHovered ? 1.5 : hasHovered ? 0.85 : 1,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1],
                }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Link href={item.href} className="block w-full h-full relative">
                  {/* Image */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      scale: isHovered ? 1.1 : 1,
                    }}
                    transition={{
                      duration: 0.7,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </motion.div>

                  {/* Dark Gradient Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                    animate={{
                      opacity: isHovered ? 1 : 0.9,
                    }}
                    transition={{ duration: 0.4 }}
                  />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 lg:p-6">
                    {/* Title */}
                    <motion.h3
                      className="text-white text-sm md:text-base lg:text-lg font-medium leading-snug"
                      animate={{
                        marginBottom: isHovered ? 12 : 8,
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      {item.title}
                    </motion.h3>

                    {/* Description - Animated reveal */}
                    <motion.p
                      className="text-white/80 text-xs md:text-sm leading-relaxed overflow-hidden"
                      initial={false}
                      animate={{
                        height: isHovered ? "auto" : 0,
                        opacity: isHovered ? 1 : 0,
                        marginBottom: isHovered ? 12 : 0,
                      }}
                      transition={{
                        duration: 0.5,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                    >
                      {item.description}
                    </motion.p>

                    {/* Link */}
                    <motion.span
                      className="inline-block text-white/70 text-xs md:text-sm tracking-wider uppercase"
                      animate={{
                        color: isHovered
                          ? "rgba(255,255,255,1)"
                          : "rgba(255,255,255,0.7)",
                        x: isHovered ? 4 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.linkText} →
                    </motion.span>
                  </div>

                  {/* Subtle border on hover */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{
                      boxShadow: isHovered
                        ? "inset 0 0 0 2px rgba(255,255,255,0.2)"
                        : "inset 0 0 0 0px rgba(255,255,255,0)",
                    }}
                    transition={{ duration: 0.4 }}
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
