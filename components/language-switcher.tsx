"use client"

import { useI18n } from "@/components/language-provider"
import { Button } from "@/components/ui/button"

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n()

  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-sm text-muted-foreground hidden sm:inline">{t('lang.switchLabel')}</span>
      <div className="inline-flex rounded-md border border-input overflow-hidden">
        <Button
          variant={lang === 'en' ? 'default' : 'ghost'}
          size="sm"
          className="rounded-none"
          onClick={() => setLang('en')}
        >
          EN
        </Button>
        <Button
          variant={lang === 'ar' ? 'default' : 'ghost'}
          size="sm"
          className="rounded-none"
          onClick={() => setLang('ar')}
        >
          AR
        </Button>
      </div>
    </div>
  )
}


