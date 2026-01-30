import { Suspense } from "react";
import dynamic from "next/dynamic";
import HeroSlider from "@/components/hero-slider";
import { CollectionCarousel } from "@/components/collection-carousel";
import { DiscoverSection } from "@/components/discover-section";
import { Footer } from "@/components/footer";
import { BenefitsSection } from "@/components/benefits-section";
import { PartnersSection } from "@/components/partners-section";
import { WhyUsSection } from "@/components/why-us-section";
import { FeaturedCategories } from "@/components/featured-categories";
import { GlobalPresenceSection } from "@/components/global-presence-section";
import { HeritageSection } from "@/components/heritage-section";
import { VideoShowcase } from "@/components/video-showcase";
import { ScrollAnimate } from "@/components/scroll-animate";
import { GalleryShowcase } from "@/components/gallery-showcase";
import { ShopTheLook } from "@/components/shop-the-look";
import SecondaryHero from "@/components/secondary-hero";
import { BoutiqueSection } from "@/components/boutique-section";

// Lazy load components for better performance
const BestSellers = dynamic(
  () =>
    import("@/components/best-sellers").then((mod) => ({
      default: mod.BestSellers,
    })),
  {
    loading: () => (
      <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
    ),
  },
);

const ProductCategories = dynamic(
  () =>
    import("@/components/product-categories").then((mod) => ({
      default: mod.ProductCategories,
    })),
  {
    loading: () => (
      <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
    ),
  },
);

export default function HomePage() {
  return (
    <div className="min-h-screen page-fade relative">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float-reverse" />
      </div>

      <main className="relative z-0">
        {/* Hero Slider Section */}
        <HeroSlider />

        {/* Collection Carousel - Frette Style */}
        <CollectionCarousel />

        {/* Discover Section - 4 Column Grid */}
        <DiscoverSection />

      {/* Shop The Look Section */}
        <ShopTheLook />
   {/* Boutique Section */}
        <BoutiqueSection />

        {/* Secondary Hero Section */}
        <SecondaryHero />

     


  

        {/* Benefits Section */}
        <ScrollAnimate animation="fade-in-up-scale" delay={100}>
          <BenefitsSection />
        </ScrollAnimate>

        {/* Best Sellers Section */}
        <ScrollAnimate animation="card-entrance" delay={200}>
          <Suspense
            fallback={
              <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
            }
          >
            <BestSellers />
          </Suspense>
        </ScrollAnimate>

        {/* Featured Categories Section */}
        <ScrollAnimate animation="slide-in-top" delay={150}>
          <FeaturedCategories />
        </ScrollAnimate>

        {/* Product Categories Section */}
        <ScrollAnimate animation="fade-in-up-scale" delay={250}>
          <Suspense
            fallback={
              <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
            }
          >
            <ProductCategories />
          </Suspense>
        </ScrollAnimate>

        {/* Partners Section */}
        <ScrollAnimate animation="zoom-in-blur" delay={200}>
          <PartnersSection />
        </ScrollAnimate>

        {/* Global Presence Section */}
        {/* <ScrollAnimate animation="rotate-fade-in" delay={300}>
          <GlobalPresenceSection />
        </ScrollAnimate> */}

        {/* Why Us Section */}
        <ScrollAnimate animation="bounce-in-subtle" delay={250}>
          <WhyUsSection />
        </ScrollAnimate>

        {/* Heritage/Timeline Section */}
        {/* <ScrollAnimate animation="fade-in-up-scale" delay={300}>
          <HeritageSection />
        </ScrollAnimate> */}

        {/* Gallery Showcase Section */}
        {/* <ScrollAnimate animation="fade-in-up-scale" delay={300}>
          <GalleryShowcase />
        </ScrollAnimate> */}

        {/* Video Showcase Section */}
        <ScrollAnimate animation="zoom-in-blur" delay={350}>
          <VideoShowcase />
        </ScrollAnimate>
      </main>
      <ScrollAnimate animation="fade-in" delay={400}>
        <Footer />
      </ScrollAnimate>
    </div>
  );
}
