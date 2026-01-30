"use client"

import { useEffect, useState, useRef } from 'react'

interface UseParallaxOptions {
  speed?: number
  enabled?: boolean
}

export function useParallax({ speed = 0.5, enabled = true }: UseParallaxOptions = {}) {
  const [offset, setOffset] = useState(0)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!enabled) return

    const handleScroll = () => {
      if (!elementRef.current) return

      const rect = elementRef.current.getBoundingClientRect()
      const scrollY = window.scrollY || window.pageYOffset
      const elementTop = rect.top + scrollY
      const windowHeight = window.innerHeight
      const elementHeight = rect.height

      // Calculate parallax offset
      const scrolled = scrollY + windowHeight
      const elementCenter = elementTop + elementHeight / 2
      const distance = scrolled - elementCenter
      const parallaxOffset = distance * speed

      setOffset(parallaxOffset)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed, enabled])

  return { ref: elementRef, offset }
}

