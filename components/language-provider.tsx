"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { LanguageCode } from "@/lib/i18n"
import { dictionaries } from "@/lib/i18n"

type LanguageContextValue = {
  lang: LanguageCode
  setLang: (l: LanguageCode) => void
  t: (key: string, fallback?: string) => string
  dir: "ltr" | "rtl"
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>("en")

  useEffect(() => {
    const stored = (typeof window !== 'undefined' && (localStorage.getItem('lang') as LanguageCode)) || undefined
    if (stored && (stored === 'en' || stored === 'ar')) {
      setLangState(stored)
    }
  }, [])

  const setLang = (l: LanguageCode) => {
    setLangState(l)
    try {
      localStorage.setItem('lang', l)
      document.documentElement.setAttribute('lang', l)
      // Do not change site direction; keep layout LTR
    } catch {}
  }

  useEffect(() => {
    // initialize dir/attr on mount
    document.documentElement.setAttribute('lang', lang)
    // Keep website side LTR regardless of language
  }, [lang])

  const dict = useMemo(() => dictionaries[lang], [lang])

  const t = (key: string, fallback?: string) => {
    return dict[key] ?? fallback ?? key
  }

  const value: LanguageContextValue = {
    lang,
    setLang,
    t,
    dir: 'ltr',
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useI18n must be used within LanguageProvider')
  return ctx
}


