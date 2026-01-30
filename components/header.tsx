"use client";

import { useState, memo, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/components/language-provider";
import {
  ShoppingBag,
  Heart,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Shirt,
  Home,
  Package,
  Crown,
  Gem,
  Award,
  Sparkles,
  Star,
  Shield,
  Zap,
  Leaf,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { Logo } from "@/components/logo";
import { MobileProductGridImage } from "@/components/ui/mobile-optimized-image";
import { useProducts } from "@/hooks/use-products";
import { CurrencySwitcher } from "@/components/currency-switcher";

const categories = [
  {
    name: "Bed Linen",
    href: "/products?category=bed-linen",
    icon: <Home className="w-5 h-5" />,
  },
  {
    name: "Bath Linen",
    href: "/products?category=bath-linen",
    icon: <ShoppingBag className="w-5 h-5" />,
  },
  {
    name: "Duvets & Covers",
    href: "/products?category=duvets",
    icon: <Package className="w-5 h-5" />,
  },
  {
    name: "Towels",
    href: "/products?category=towels",
    icon: <Shirt className="w-5 h-5" />,
  },
  {
    name: "Homeware",
    href: "/products?category=homeware",
    icon: <Home className="w-5 h-5" />,
  },
  {
    name: "Collections",
    href: "/collections",
    icon: <Package className="w-5 h-5" />,
  },
];

const premiumCollections = [
  {
    name: "Bed Linen",
    href: "/products?bed-linen",
    icon: <Crown className="w-5 h-5" />,
  },
  {
    name: "Bath Linen",
    href: "/products?bath-linen",
    icon: <Shield className="w-5 h-5" />,
  },
  {
    name: "Duvet Cover",
    href: "/products?duvet-cover",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    name: "Pillows",
    href: "/products?pillows",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    name: "Hotel Collection",
    href: "/products?hotel-collection",
    icon: <Leaf className="w-5 h-5" />,
  },
  {
    name: "Curtain",
    href: "/products?curtain",
    icon: <Star className="w-5 h-5" />,
  },
];

const collectionsList = [
  {
    name: "Semi Luxury Collection",
    href: "/products?semi-luxury",
    icon: <Crown className="w-5 h-5" />,
  },
  {
    name: "Upper Economy Collection",
    href: "/products?upper-economy",
    icon: <Award className="w-5 h-5" />,
  },
  {
    name: "Luxury Collection",
    href: "/products?luxury",
    icon: <Gem className="w-5 h-5" />,
  },
  {
    name: "Hyper Luxury Collection",
    href: "/products?hyper-luxury",
    icon: <Crown className="w-5 h-5" />,
  },
  {
    name: "Bed Linen Collection",
    href: "/products?bed-linen",
    icon: <Star className="w-5 h-5" />,
  },
  {
    name: "Bath Linen Collection",
    href: "/products?bath-linen",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    name: "Pillows & Duvets Collection",
    href: "/products?pillows-duvets",
    icon: <Award className="w-5 h-5" />,
  },
];

export const Header = memo(function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [isPaused, setIsPaused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { state } = useCart();
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const pathname = usePathname();

  // Check if on home page - only show white text on home route
  const isHomePage = pathname === "/";

  // Handle scroll to toggle header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch featured products for dropdowns
  const { products: featuredProducts } = useProducts({
    url: "/api/products?limit=4&featured=true&noCache=true",
    fallbackToAll: false,
  });

  const { products: premiumProducts } = useProducts({
    url: "/api/products?limit=4&featured=true&noCache=true",
    fallbackToAll: false,
  });

  const { products: collectionProducts } = useProducts({
    url: "/api/products?limit=4&featured=true&noCache=true",
    fallbackToAll: false,
  });

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  // Auto-scroll carousel
  useEffect(() => {
    if (!carouselApi || isPaused) return;

    const interval = setInterval(() => {
      carouselApi.scrollNext();
    }, 3000); // Auto-slide every 3 seconds

    return () => clearInterval(interval);
  }, [carouselApi, isPaused]);

  // Use frontend categories (these map to product keywords, not backend categories)
  // Filter out "New Arrivals" if it exists
  const displayCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase() !== "new arrivals" &&
      cat.name.toLowerCase() !== "newarrivals",
  );

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 header-entrance ${
        isScrolled
          ? "bg-white/95 text-gray-900 border-b border-gray-200 shadow-sm hover:shadow-xl backdrop-blur-md"
          : isHomePage
            ? "bg-transparent text-white border-b border-transparent"
            : "bg-transparent text-gray-900 border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
          {/* Logo */}
          <div className="flex items-center group cursor-pointer">
            <div className="transition-all duration-500 hover:scale-110 hover:rotate-2 hover-shadow-premium">
              <Logo size="md" showText={true} href="/" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <div
              className="relative"
              onMouseEnter={() => setIsShopOpen(true)}
              onMouseLeave={() => setIsShopOpen(false)}
            >
              <DropdownMenu open={isShopOpen} onOpenChange={setIsShopOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`relative transition-all duration-500 font-medium font-optima group py-2 nav-link-premium hover:scale-105 ${isScrolled ? "text-primary hover:text-secondary" : isHomePage ? "text-white hover:text-white/80" : "text-primary hover:text-secondary"}`}
                  >
                    {t("nav.products")}
                    <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent transition-all duration-500 group-hover:w-full"></span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[700px] p-0 bg-white border border-gray-200 shadow-xl"
                >
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-8">
                      {/* Left Column - Category List */}
                      <div>
                        <div className="flex flex-col gap-1">
                          {displayCategories.map((category, index) => (
                            <Link
                              key={index}
                              href={category.href}
                              onClick={() => setIsShopOpen(false)}
                              className="flex items-center gap-3 text-primary/80 hover:text-primary transition-colors duration-300 py-1.5 text-base font-normal group"
                            >
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                {category.icon}
                              </div>
                              <span>{category.name}</span>
                            </Link>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <Link
                            href="/products"
                            onClick={() => setIsShopOpen(false)}
                          >
                            <Button
                              variant="outline"
                              className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                            >
                              View All
                            </Button>
                          </Link>
                        </div>
                      </div>

                      {/* Right Column - Product Images */}
                      <div>
                        <h3 className="text-sm font-semibold text-primary/80 mb-4">
                          Explore the New Collection
                        </h3>
                        <div className="grid grid-cols-4 gap-3">
                          {featuredProducts && featuredProducts.length > 0
                            ? featuredProducts
                                .slice(0, 4)
                                .map((product, index) => {
                                  const productId = product._id || product.id;
                                  return (
                                    <Link
                                      key={productId}
                                      href={`/products/${product.sku || productId}`}
                                      onClick={() => setIsShopOpen(false)}
                                      className="group relative overflow-hidden rounded-lg aspect-square bg-gradient-to-br from-muted to-muted/80"
                                    >
                                      <div className="absolute inset-0">
                                        <MobileProductGridImage
                                          src={
                                            product.image ||
                                            product.images?.[0] ||
                                            "/placeholder.jpg"
                                          }
                                          alt={product.name}
                                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                      </div>
                                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                                      <div className="absolute top-2 left-2 z-10">
                                        <Badge className="bg-primary/90 text-white text-[10px] font-medium px-2 py-0.5">
                                          New Arrivals
                                        </Badge>
                                      </div>
                                    </Link>
                                  );
                                })
                            : // Fallback placeholder images
                              displayCategories
                                .slice(0, 4)
                                .map((category, index) => (
                                  <Link
                                    key={index}
                                    href={category.href}
                                    onClick={() => setIsShopOpen(false)}
                                    className="group relative overflow-hidden rounded-lg aspect-square bg-gradient-to-br from-muted to-muted/80"
                                  >
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                                    <div className="absolute top-2 left-2 z-10">
                                      <Badge className="bg-primary/90 text-white text-[10px] font-medium px-2 py-0.5">
                                        New Arrivals
                                      </Badge>
                                    </div>
                                    <div className="w-full h-full flex items-center justify-center p-4">
                                      <div className="w-12 h-12 text-primary group-hover:scale-110 transition-transform duration-300">
                                        {category.icon}
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Collections Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsCollectionsOpen(true)}
              onMouseLeave={() => setIsCollectionsOpen(false)}
            >
              <DropdownMenu
                open={isCollectionsOpen}
                onOpenChange={setIsCollectionsOpen}
              >
                <DropdownMenuTrigger asChild>
                  <button
                    className={`relative transition-all duration-500 font-medium font-optima group py-2 nav-link-premium hover:scale-105 ${isScrolled ? "text-primary hover:text-secondary" : isHomePage ? "text-white hover:text-white/80" : "text-primary hover:text-secondary"}`}
                  >
                    {t("nav.collections")}
                    <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent transition-all duration-500 group-hover:w-full"></span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[700px] p-0 bg-white border border-gray-200 shadow-xl"
                >
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-8">
                      {/* Left Column - Collections List */}
                      <div>
                        <div className="flex flex-col gap-1">
                          {collectionsList.map((collection, index) => (
                            <Link
                              key={index}
                              href={collection.href}
                              onClick={() => setIsCollectionsOpen(false)}
                              className="flex items-center gap-3 text-primary/80 hover:text-primary transition-colors duration-300 py-1.5 text-base font-normal group"
                            >
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                {collection.icon}
                              </div>
                              <span>{collection.name}</span>
                            </Link>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <Link
                            href="/collections"
                            onClick={() => setIsCollectionsOpen(false)}
                          >
                            <Button
                              variant="outline"
                              className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                            >
                              View All
                            </Button>
                          </Link>
                        </div>
                      </div>

                      {/* Right Column - Product Images */}
                      <div>
                        <h3 className="text-sm font-semibold text-primary/80 mb-4">
                          Explore Collections
                        </h3>
                        <div className="grid grid-cols-4 gap-3">
                          {collectionProducts && collectionProducts.length > 0
                            ? collectionProducts
                                .slice(0, 4)
                                .map((product, index) => {
                                  const productId = product._id || product.id;
                                  return (
                                    <Link
                                      key={productId}
                                      href={`/products/${product.sku || productId}`}
                                      onClick={() =>
                                        setIsCollectionsOpen(false)
                                      }
                                      className="group relative overflow-hidden rounded-lg aspect-square bg-gradient-to-br from-muted to-muted/80"
                                    >
                                      <div className="absolute inset-0">
                                        <MobileProductGridImage
                                          src={
                                            product.image ||
                                            product.images?.[0] ||
                                            "/placeholder.jpg"
                                          }
                                          alt={product.name}
                                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                      </div>
                                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                                      <div className="absolute top-2 left-2 z-10">
                                        <Badge className="bg-primary/90 text-white text-[10px] font-medium px-2 py-0.5">
                                          Featured
                                        </Badge>
                                      </div>
                                    </Link>
                                  );
                                })
                            : collectionsList
                                .slice(0, 4)
                                .map((collection, index) => (
                                  <Link
                                    key={index}
                                    href={collection.href}
                                    onClick={() => setIsCollectionsOpen(false)}
                                    className="group relative overflow-hidden rounded-lg aspect-square bg-gradient-to-br from-muted to-muted/80"
                                  >
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                                    <div className="absolute top-2 left-2 z-10">
                                      <Badge className="bg-primary/90 text-white text-[10px] font-medium px-2 py-0.5">
                                        Featured
                                      </Badge>
                                    </div>
                                    <div className="w-full h-full flex items-center justify-center p-4">
                                      <div className="w-12 h-12 text-primary group-hover:scale-110 transition-transform duration-300">
                                        {collection.icon}
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Link
              href="/about"
              className={`relative transition-all duration-500 font-medium font-optima group py-2 nav-link-premium hover:scale-105 ${isScrolled ? "text-primary hover:text-secondary" : isHomePage ? "text-white hover:text-white/80" : "text-primary hover:text-secondary"}`}
            >
              {t("nav.about")}
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent transition-all duration-500 group-hover:w-full"></span>
            </Link>
            <Link
              href="/contact"
              className={`relative transition-all duration-500 font-medium font-optima group py-2 nav-link-premium hover:scale-105 ${isScrolled ? "text-primary hover:text-secondary" : isHomePage ? "text-white hover:text-white/80" : "text-primary hover:text-secondary"}`}
            >
              {t("nav.contact")}
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent transition-all duration-500 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Right Actions - Mobile Optimized */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            <CurrencySwitcher isScrolled={isScrolled} isHomePage={isHomePage} />
            <Link href="/wishlist">
              <Button
                variant="ghost"
                size="icon"
                className={`hidden sm:flex p-2 transition-all duration-300 hover:scale-105 btn-circular ${isScrolled ? "text-primary hover:text-secondary hover:bg-secondary/15" : isHomePage ? "text-white hover:text-white/80 hover:bg-white/15" : "text-primary hover:text-secondary hover:bg-secondary/15"}`}
              >
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`p-2 transition-all duration-500 hover:scale-125 hover:rotate-6 btn-circular hover-shadow-premium ${isScrolled ? "text-primary hover:text-secondary hover:bg-secondary/15" : isHomePage ? "text-white hover:text-white/80 hover:bg-white/15" : "text-primary hover:text-secondary hover:bg-secondary/15"}`}
                  >
                    <User className="h-4 w-4 sm:h-5 sm:w-5 transition-all duration-500 group-hover:scale-110" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="font-medium">
                    {user.name}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">Order History</Link>
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`p-2 transition-all duration-500 hover:scale-125 hover:rotate-6 btn-circular hover-shadow-premium ${isScrolled ? "text-primary hover:text-secondary hover:bg-secondary/15" : isHomePage ? "text-white hover:text-white/80 hover:bg-white/15" : "text-primary hover:text-secondary hover:bg-secondary/15"}`}
                >
                  <User className="h-4 w-4 sm:h-5 sm:w-5 transition-all duration-500 group-hover:scale-110" />
                </Button>
              </Link>
            )}

            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className={`relative p-2 transition-all duration-500 hover:scale-125 hover:rotate-6 btn-circular group hover-shadow-premium ${isScrolled ? "text-primary hover:text-secondary hover:bg-secondary/15" : isHomePage ? "text-white hover:text-white/80 hover:bg-white/15" : "text-primary hover:text-secondary hover:bg-secondary/15"}`}
              >
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 icon-rotate-360" />
                {state.itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-xs bg-secondary text-foreground badge-premium shadow-xl transition-all duration-300 group-hover:scale-110">
                    {state.itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className={`lg:hidden p-2 transition-all duration-500 hover:scale-125 hover:rotate-12 btn-circular hover-shadow-premium ${isScrolled ? "text-primary hover:text-secondary hover:bg-secondary/15" : isHomePage ? "text-white hover:text-white/80 hover:bg-white/15" : "text-primary hover:text-secondary hover:bg-secondary/15"}`}
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 transition-all duration-500 rotate-90 scale-110" />
              ) : (
                <Menu className="h-5 w-5 transition-all duration-500 group-hover:rotate-90" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Enhanced */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 bg-white max-h-[calc(100vh-80px)] overflow-y-auto animate-fade-in slide-in-top">
            <nav className="flex flex-col space-y-1 px-3">
              <Accordion
                type="single"
                collapsible
                className="w-full flex flex-col gap-1"
              >
                <AccordionItem value="products" className="border-b-0">
                  <AccordionTrigger className="text-primary hover:text-secondary transition-all duration-300 py-3 px-3 rounded-md hover:bg-secondary/5 font-semibold font-optima text-base decoration-0 hover:no-underline">
                    {t("nav.products")}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-4 pb-2 flex flex-col space-y-1">
                      {displayCategories.map((category, index) => (
                        <Link
                          key={index}
                          href={category.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 text-gray-600 hover:text-primary py-2.5 px-3 rounded-md hover:bg-primary/5 transition-all"
                        >
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-primary">
                            {category.icon}
                          </div>
                          <span className="font-medium">{category.name}</span>
                        </Link>
                      ))}
                      <Link
                        href="/products"
                        onClick={() => setIsMenuOpen(false)}
                        className="mt-2"
                      >
                        <Button
                          variant="outline"
                          className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 h-10"
                        >
                          View All
                        </Button>
                      </Link>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Premium Dropdown - Removed as requested */}
                <AccordionItem value="collections" className="border-b-0">
                  <AccordionTrigger className="text-primary hover:text-secondary transition-all duration-300 py-3 px-3 rounded-md hover:bg-secondary/5 font-semibold font-optima text-base decoration-0 hover:no-underline">
                    {t("nav.collections")}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-4 pb-2 flex flex-col space-y-1">
                      {collectionsList.map((collection, index) => (
                        <Link
                          key={index}
                          href={collection.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 text-gray-600 hover:text-primary py-2.5 px-3 rounded-md hover:bg-primary/5 transition-all"
                        >
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-primary">
                            {collection.icon}
                          </div>
                          <span className="font-medium">{collection.name}</span>
                        </Link>
                      ))}
                      <Link
                        href="/collections"
                        onClick={() => setIsMenuOpen(false)}
                        className="mt-2"
                      >
                        <Button
                          variant="outline"
                          className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 h-10"
                        >
                          View All
                        </Button>
                      </Link>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="flex flex-col gap-1 pt-1">
                <Link
                  href="/about"
                  className="text-primary hover:text-secondary transition-all duration-300 py-3 px-3 rounded-md hover:bg-secondary/5 font-semibold font-optima text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("nav.about")}
                </Link>
                <Link
                  href="/contact"
                  className="text-primary hover:text-secondary transition-all duration-300 py-3 px-3 rounded-md hover:bg-secondary/5 font-semibold font-optima text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("nav.contact")}
                </Link>
              </div>

              <div className="my-4 border-t border-gray-100" />

              {/* Mobile Currency Selection */}
              <div className="px-3 py-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  Currency
                </span>
                <CurrencySwitcher
                  isScrolled={isScrolled}
                  isHomePage={isHomePage}
                />
              </div>

              <div className="my-2 border-t border-gray-100" />

              {/* User Actions */}
              <div className="flex flex-col gap-1 pb-4">
                {user ? (
                  <>
                    <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                      My Account
                    </div>
                    <Link
                      href="/account"
                      className="flex items-center gap-3 text-primary hover:text-primary-hover transition-all duration-300 py-3 px-3 rounded-md hover:bg-primary/5 font-medium text-base"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5 text-primary" />
                      Manage Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center gap-3 text-primary hover:text-primary-hover transition-all duration-300 py-3 px-3 rounded-md hover:bg-primary/5 font-medium text-base"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ShoppingBag className="h-5 w-5 text-primary" />
                      Order History
                    </Link>
                    <Link
                      href="/wishlist"
                      className="flex items-center gap-3 text-primary hover:text-primary-hover transition-all duration-300 py-3 px-3 rounded-md hover:bg-primary/5 font-medium text-base"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Heart className="h-5 w-5 text-primary" />
                      Wishlist
                    </Link>
                    {user?.role === "admin" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 text-primary hover:text-primary-hover transition-all duration-300 py-3 px-3 rounded-md bg-primary/5 font-bold text-base mt-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <LayoutDashboard className="h-5 w-5" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full text-left text-red-600 hover:text-red-700 transition-all duration-300 py-3 px-3 rounded-md hover:bg-red-50 font-bold text-base mt-4 border border-red-100"
                    >
                      <LogOut className="h-5 w-5" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3 px-3 mt-2">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full bg-primary hover:bg-primary-hover text-white font-bold h-12 shadow-md">
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full border-primary text-primary hover:bg-primary/5 font-bold h-12"
                      >
                        Join Now
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Browse Categories Section */}
      {/* 
      <div 
        className="bg-white border-b border-gray-200"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 py-4">
            <DropdownMenu open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  className="bg-[#262626] hover:bg-[#4e6a9a] text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-md flex items-center gap-2 sm:gap-3 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm md:text-base">BROWSE CATEGORIES</span>
                  <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="w-[300px] sm:w-[400px] md:w-[500px] max-h-[500px] overflow-y-auto"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className="p-2">
                  <div className="text-sm font-semibold text-[#262626] mb-3 px-2">All Categories</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {displayCategories.map((category, index) => (
                      <Link
                        key={index}
                        href={category.href}
                        onClick={() => setIsCategoriesOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-md hover:bg-[#f8f6f3] transition-colors duration-300 group"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#f8f6f3] flex items-center justify-center text-[#4e6a9a] group-hover:bg-[#4e6a9a] group-hover:text-white transition-all duration-300">
                          {category.icon}
                        </div>
                        <span className="text-sm font-medium text-[#262626] group-hover:text-[#4e6a9a] transition-colors duration-300">{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex-1 w-full lg:w-auto">
              <Carousel
                setApi={setCarouselApi}
                opts={{
                  align: "start",
                  loop: true,
                  slidesToScroll: 1,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {displayCategories.map((category, index) => (
                    <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/4">
                      <Link
                        href={category.href}
                        className="flex flex-col items-center gap-1.5 sm:gap-2 group hover:scale-105 transition-all duration-300"
                      >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-[#f8f6f3] flex items-center justify-center group-hover:bg-[#4e6a9a] group-hover:text-white transition-all duration-300 text-[#4e6a9a] border-2 border-transparent group-hover:border-[#4e6a9a]">
                          {category.icon}
                        </div>
                        <span className="text-[10px] sm:text-xs md:text-sm font-medium text-[#262626] group-hover:text-[#4e6a9a] transition-colors duration-300 text-center">
                          {category.name}
                        </span>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
      */}
    </header>
  );
});
