"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CollectionItem {
  id: string;
  title: string;
  image: string;
  href: string;
}

const collectionItems: CollectionItem[] = [
  {
    id: "1",
    title: "Shop New Bedding",
    image: "/image/Image1.jpg",
    href: "/products?category=bed-linen",
  },
  {
    id: "2",
    title: "Shop New Bath",
    image: "/image/image2.jpg",
    href: "/products?category=bath-linen",
  },
  {
    id: "3",
    title: "Shop Towels",
    image: "/image/image3.jpg",
    href: "/products?category=towels",
  },
  {
    id: "4",
    title: "Shop New Home",
    image: "/image/image3.jpg",
    href: "/products?category=homeware",
  },
  {
    id: "5",
    title: "Shop Decorative Pillows",
    image: "/image/image4.jpg",
    href: "/products?category=pillows",
  },
  {
    id: "6",
    title: "Shop Duvets",
    image: "/image/image5.jpg",
    href: "/products?category=duvets",
  },
  {
    id: "7",
    title: "Shop Duvets",
    image: "/image/image6.jpg",
    href: "/products?category=duvets",
  },
  {
    id: "8",
    title: "Shop Duvets",
    image: "/image/image7.jpg",
    href: "/products?category=duvets",
  },
];

export function CollectionCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      setScrollProgress(maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0);
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < maxScroll - 10);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", updateScrollState);
      updateScrollState();
      return () =>
        scrollContainer.removeEventListener("scroll", updateScrollState);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-[#f5f5f0]">
      <div className="mx-auto px-4 ">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 md:mb-10">
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-900 font-light italic">
            Explore the New Collection
          </h2>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 underline underline-offset-4 transition-colors uppercase tracking-wider"
          >
            Shop All
          </Link>
        </div>

        {/* Carousel - Shows on all screens */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-2 px-2"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {collectionItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[280px] lg:w-[320px] group"
                style={{ scrollSnapAlign: "start" }}
              >
                {/* Image Container */}
                <div className="relative h-[200px] sm:h-[280px] md:h-[380px] lg:h-[420px] overflow-hidden bg-gray-200 mb-2 sm:mb-3 md:mb-4">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                {/* Title */}
                <p className="text-xs sm:text-sm md:text-base text-gray-700 group-hover:text-gray-900 transition-colors text-center underline underline-offset-4 decoration-gray-400 group-hover:decoration-gray-900">
                  {item.title}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Progress Bar & Navigation */}
        <div className="flex items-center gap-4 mt-4 sm:mt-6 md:mt-8">
          {/* Progress Bar */}
          <div className="flex-1 h-0.5 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-700 transition-all duration-300 rounded-full"
              style={{ width: `${Math.max(scrollProgress, 5)}%` }}
            />
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`p-1 transition-colors ${
                canScrollLeft
                  ? "text-gray-700 hover:text-gray-900"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`p-1 transition-colors ${
                canScrollRight
                  ? "text-gray-700 hover:text-gray-900"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
