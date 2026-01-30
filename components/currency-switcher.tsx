"use client";

import {
  useCurrency,
  currencies,
  type CurrencyCode,
} from "./currency-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface CurrencySwitcherProps {
  isScrolled?: boolean;
  isHomePage?: boolean;
}

export function CurrencySwitcher({
  isScrolled = true,
  isHomePage = false,
}: CurrencySwitcherProps) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide currency switcher on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Determine text color based on scroll and route
  const textColorClass = isScrolled
    ? "text-primary hover:text-secondary hover:bg-secondary/5"
    : isHomePage
      ? "text-white hover:text-white/80 hover:bg-white/15"
      : "text-primary hover:text-secondary hover:bg-secondary/5";

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-1.5 px-2 sm:px-3 h-9 ${textColorClass}`}
        disabled
      >
        <Globe className="h-4 w-4" />
        <span className="font-medium text-xs sm:text-sm hidden sm:inline">
          AED
        </span>
        <span className="font-medium text-xs sm:text-sm sm:hidden">د.إ</span>
      </Button>
    );
  }

  return (
    <CurrencySwitcherContent isScrolled={isScrolled} isHomePage={isHomePage} />
  );
}

interface CurrencySwitcherContentProps {
  isScrolled?: boolean;
  isHomePage?: boolean;
}

function CurrencySwitcherContent({
  isScrolled = true,
  isHomePage = false,
}: CurrencySwitcherContentProps) {
  const { currency, setCurrency, currentCurrency } = useCurrency();

  const handleCurrencyChange = (code: CurrencyCode) => {
    console.log("Currency changed to:", code);
    setCurrency(code);
  };

  // Determine text color based on scroll and route
  const textColorClass = isScrolled
    ? "text-primary hover:text-secondary hover:bg-secondary/5"
    : isHomePage
      ? "text-white hover:text-white/80 hover:bg-white/15"
      : "text-primary hover:text-secondary hover:bg-secondary/5";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1.5 px-2 sm:px-3 h-9 transition-colors ${textColorClass}`}
        >
          <Globe className="h-4 w-4" />
          <span className="font-medium text-xs sm:text-sm hidden sm:inline">
            {currentCurrency.code}
          </span>
          <span className="font-medium text-xs sm:text-sm sm:hidden">
            {currentCurrency.symbol}
          </span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 max-h-[400px] overflow-y-auto"
      >
        <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase">
          Select Currency
        </div>
        {Object.values(currencies).map((curr) => (
          <DropdownMenuItem
            key={curr.code}
            onClick={() => handleCurrencyChange(curr.code)}
            className={`flex items-center justify-between px-3 py-2 cursor-pointer ${
              currency === curr.code
                ? "bg-secondary/10 text-secondary font-semibold"
                : "hover:bg-gray-50"
            }`}
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium">{curr.name}</span>
              <span className="text-xs text-gray-500">{curr.code}</span>
            </div>
            <span className="text-sm font-semibold">{curr.symbol}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
