"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

interface HeroSlide {
  id: string;
  subtitle: string;
  title: string;
  linkText: string;
  linkHref: string;
  image: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: "slide-1",
    subtitle: "PREMIUM CORPORATE GIFTING",
    title: "Elevate Your Brand Experience",
    linkText: "Shop Corporate Gifts",
    linkHref: "/products",
    image: "/images/hero-corporate.jpg",
  },
  {
    id: "slide-2",
    subtitle: "CUSTOM BRANDING SOLUTIONS",
    title: "Your Logo, On Premium Products",
    linkText: "Explore Customization",
    linkHref: "/custom-orders",
    image: "/images/hero-branding.jpg",
  },
  {
    id: "slide-3",
    subtitle: "EMPLOYEE WELCOME KITS",
    title: "Curated Unboxing Experiences",
    linkText: "View Welcome Kits",
    linkHref: "/collections/welcome-kits",
    image: "/images/hero-kits.jpg",
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setTimeout(() => setIsTransitioning(false), 100);
      }, 100);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section
      ref={sliderRef}
      className="relative h-[60vh] min-h-[350px] overflow-hidden"
    >
      {/* Background Video */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/Untitled-design-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Subtle dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content - Bottom Left Aligned (Frette Style) */}
      <div className="relative z-10 h-full flex items-end">
        <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 pb-16 sm:pb-20 md:pb-24 lg:pb-32">
          <div className="max-w-3xl">
            {heroSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`transition-all duration-700 ease-out ${index === currentSlide
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 absolute pointer-events-none"
                  }`}
              >
                {/* Subtitle - Small uppercase */}
                <p className="text-white/80 text-xs sm:text-sm tracking-[0.2em] uppercase mb-3 sm:mb-4 font-light">
                  {slide.subtitle}
                </p>

                {/* Main Title - Elegant serif with link inline */}
                <div className="flex flex-wrap items-baseline gap-x-6 sm:gap-x-8 gap-y-2">
                  <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-light italic leading-tight">
                    {slide.title}
                  </h1>
                  <Link
                    href={slide.linkHref}
                    className="text-white/90 text-sm sm:text-base underline underline-offset-4 hover:text-white transition-colors duration-300 whitespace-nowrap"
                  >
                    {slide.linkText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide Indicators - Bottom Right */}
      <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-12 z-20 flex items-center gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentSlide(index);
                setTimeout(() => setIsTransitioning(false), 100);
              }, 100);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide
              ? "bg-white w-6"
              : "bg-white/50 hover:bg-white/70"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

// Export as dynamic component to prevent hydration issues
const DynamicHeroSlider = dynamic(() => Promise.resolve(HeroSlider), {
  ssr: false,
  loading: () => (
    <section className="relative h-[70vh] min-h-[450px] overflow-hidden bg-gray-900">
      <div className="absolute inset-0 bg-gray-800 animate-pulse" />
      <div className="relative z-10 h-full flex items-end">
        <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 pb-12 sm:pb-16 md:pb-20 lg:pb-24">
          <div className="max-w-3xl">
            <div className="h-4 bg-gray-700 rounded w-48 mb-4"></div>
            <div className="h-12 bg-gray-700 rounded w-96 mb-2"></div>
          </div>
        </div>
      </div>
    </section>
  ),
});

export default DynamicHeroSlider;
