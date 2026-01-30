"use client";

import { createContext, useContext, ReactNode } from "react";
import { Header } from "@/components/header";

interface LayoutContextType {
  // Context for future use if needed
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};

interface LayoutProviderProps {
  children: ReactNode;
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  return (
    <LayoutContext.Provider value={{}}>
      <div className="min-h-screen flex flex-col">
        {/* Top Navigation Bar */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 w-full -mt-16 sm:-mt-18 md:-mt-20">
          {children}
        </main>
      </div>
    </LayoutContext.Provider>
  );
}
