"use client"

import { useCurrency } from "./currency-provider"

interface PriceProps {
  amount: number
  originalAmount?: number
  className?: string
  showOriginal?: boolean
}

export function Price({ amount, originalAmount, className = "", showOriginal = true }: PriceProps) {
  const { formatPrice } = useCurrency()

  const isSale = originalAmount && originalAmount > amount

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-bold">{formatPrice(amount)}</span>
      {isSale && showOriginal && (
        <span className="text-sm text-muted-foreground line-through opacity-60">
          {formatPrice(originalAmount)}
        </span>
      )}
    </div>
  )
}
