import { NextRequest } from 'next/server'

// Simple in-memory rate limiter (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  keyGenerator?: (req: NextRequest) => string // Custom key generator
}

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, maxRequests, keyGenerator } = options

  return (req: NextRequest) => {
    const key = keyGenerator ? keyGenerator(req) : getDefaultKey(req)
    const now = Date.now()
    
    // Clean up expired entries
    for (const [k, v] of rateLimitMap.entries()) {
      if (v.resetTime < now) {
        rateLimitMap.delete(k)
      }
    }
    
    const current = rateLimitMap.get(key)
    
    if (!current) {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
      return { success: true, remaining: maxRequests - 1 }
    }
    
    if (current.resetTime < now) {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
      return { success: true, remaining: maxRequests - 1 }
    }
    
    if (current.count >= maxRequests) {
      return { 
        success: false, 
        remaining: 0, 
        resetTime: current.resetTime,
        error: 'Too many requests'
      }
    }
    
    current.count++
    return { 
      success: true, 
      remaining: maxRequests - current.count,
      resetTime: current.resetTime
    }
  }
}

function getDefaultKey(req: NextRequest): string {
  // Use IP address as default key
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : req.ip || 'unknown'
  return ip
}

// Predefined rate limiters
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10, // 10 attempts per window (increased from 5)
  keyGenerator: (req) => {
    const ip = getDefaultKey(req)
    // Include email in key for login attempts to be more specific
    return `auth:${ip}`
  }
})


export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per window
})

export const strictRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute
})

