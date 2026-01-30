"use client"

import { ReactNode } from 'react'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'

interface ScrollAnimateProps {
  children: ReactNode
  className?: string
  animation?: 'fade-in-up' | 'fade-in' | 'slide-in-left' | 'slide-in-right' | 'scale-in' | 'fade-in-up-scale' | 'slide-in-top' | 'rotate-fade-in' | 'zoom-in-blur' | 'card-entrance' | 'text-slide-reveal' | 'bounce-in-subtle'
  delay?: number
  threshold?: number
  duration?: number
}

export function ScrollAnimate({ 
  children, 
  className = '', 
  animation = 'fade-in-up',
  delay = 0,
  threshold = 0.1,
  duration
}: ScrollAnimateProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold, triggerOnce: true })

  // Animations that use CSS keyframes directly
  const directAnimations = ['fade-in-up-scale', 'slide-in-top', 'rotate-fade-in', 'zoom-in-blur', 'card-entrance', 'text-slide-reveal', 'bounce-in-subtle']
  const isDirectAnimation = directAnimations.includes(animation)

  const animationClass = isDirectAnimation
    ? (isVisible ? animation : 'opacity-0')
    : `${animation} ${isVisible ? 'animate' : ''}`

  return (
    <div
      ref={ref}
      className={`${animationClass} ${className}`}
      style={{ 
        transitionDelay: `${delay}ms`,
        animationDelay: `${delay}ms`,
        ...(duration && { animationDuration: `${duration}ms` })
      }}
    >
      {children}
    </div>
  )
}

