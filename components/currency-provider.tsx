"use client"

import { createContext, useContext, useEffect, useState, useMemo } from "react"

export type CurrencyCode = 'AED' | 'INR' | 'USD' | 'EUR' | 'GBP' | 'SAR' | 'CAD' | 'JPY' | 'AUD' | 'CNY' | 'CHF'

interface CurrencyInfo {
  code: CurrencyCode
  symbol: string
  name: string
  rate: number // Rate relative to AED (Base)
  locale: string
}

export const currencies: Record<CurrencyCode, CurrencyInfo> = {
  'AED': { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', rate: 1, locale: 'en-AE' },
  'INR': { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 22.75, locale: 'en-IN' },
  'USD': { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.27, locale: 'en-US' },
  'EUR': { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.25, locale: 'de-DE' },
  'GBP': { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.21, locale: 'en-GB' },
  'SAR': { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal', rate: 1.02, locale: 'ar-SA' },
  'CAD': { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', rate: 0.37, locale: 'en-CA' },
  'JPY': { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 40.5, locale: 'ja-JP' },
  'AUD': { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 0.42, locale: 'en-AU' },
  'CNY': { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', rate: 1.97, locale: 'zh-CN' },
  'CHF': { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', rate: 0.24, locale: 'de-CH' },
}

interface CurrencyContextType {
  currency: CurrencyCode
  setCurrency: (code: CurrencyCode) => void
  convert: (amount: number) => number
  formatPrice: (amount: number) => string
  currentCurrency: CurrencyInfo
}

const defaultContext: CurrencyContextType = {
  currency: 'AED',
  setCurrency: () => {},
  convert: (amount: number) => amount,
  formatPrice: (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
    }).format(amount)
  },
  currentCurrency: currencies['AED']
}

const CurrencyContext = createContext<CurrencyContextType>(defaultContext)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('AED')
  useEffect(() => {
    const stored = localStorage.getItem('selectedCurrency') as CurrencyCode
    if (stored && currencies[stored]) {
      setCurrencyState(stored)
    }
  }, [])

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code)
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedCurrency', code)
    }
  }

  const currentCurrency = useMemo(() => currencies[currency], [currency])

  const convert = (amount: number) => {
    return amount * currentCurrency.rate
  }

  const formatPrice = (amount: number) => {
    const converted = convert(amount)
    
    return new Intl.NumberFormat(currentCurrency.locale, {
      style: 'currency',
      currency: currentCurrency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(converted)
  }

  const value = {
    currency,
    setCurrency,
    convert,
    formatPrice,
    currentCurrency
  }

  // Always render the provider with default/current state to ensure context is available during SSR/Build
  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  return context
}
