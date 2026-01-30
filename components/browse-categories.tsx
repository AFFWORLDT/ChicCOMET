"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, ChevronDown, Shirt, Shoe, Baby, Home, ShoppingBag, Package } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Category {
  name: string
  href: string
  icon: React.ReactNode
}

const categories: Category[] = [
  {
    name: "Bed Linen",
    href: "/products?category=bed-linen",
    icon: <Home className="w-5 h-5" />
  },
  {
    name: "Bath Linen",
    href: "/products?category=bath-linen",
    icon: <ShoppingBag className="w-5 h-5" />
  },
  {
    name: "Duvets & Covers",
    href: "/products?category=duvets",
    icon: <Package className="w-5 h-5" />
  },
  {
    name: "Towels",
    href: "/products?category=towels",
    icon: <Shirt className="w-5 h-5" />
  },
  {
    name: "Homeware",
    href: "/products?category=homeware",
    icon: <Home className="w-5 h-5" />
  },
  {
    name: "Collections",
    href: "/collections",
    icon: <Package className="w-5 h-5" />
  }
]

export function BrowseCategories() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 py-4">
          {/* Browse Categories Button */}
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-navy-800 hover:bg-primary text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-md flex items-center gap-2 sm:gap-3 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm md:text-base">BROWSE CATEGORIES</span>
            <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </Button>

          {/* Category List */}
          <div className="flex-1 w-full lg:w-auto overflow-x-auto">
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 pb-2">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  href={category.href}
                  className="flex flex-col items-center gap-1.5 sm:gap-2 min-w-[80px] sm:min-w-[100px] group hover:scale-105 transition-all duration-300"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 text-primary border-2 border-transparent group-hover:border-primary">
                    {category.icon}
                  </div>
                  <span className="text-[10px] sm:text-xs md:text-sm font-medium text-navy-800 group-hover:text-primary transition-colors duration-300 text-center">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Dropdown Menu (Mobile/Tablet) */}
        {isOpen && (
          <div className="lg:hidden border-t border-gray-200 pt-4 pb-2 animate-fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  href={category.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary">
                    {category.icon}
                  </div>
                  <span className="text-sm font-medium text-navy-800">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

