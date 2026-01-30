"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, Clock, Zap, TrendingUp, AlertTriangle } from 'lucide-react'

interface PerformanceMetrics {
  fcp: number | null
  lcp: number | null
  fid: number | null
  cls: number | null
  ttfb: number | null
  loadTime: number | null
}

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    loadTime: null
  })

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development and on desktop/tablet sizes
    if (process.env.NODE_ENV !== 'development') return

    const decideVisibility = () => {
      if (typeof window === 'undefined') return
      // Hide on small screens (e.g., < 1024px)
      setIsVisible(window.innerWidth >= 1024)
    }

    decideVisibility()
    window.addEventListener('resize', decideVisibility)

    // Get performance metrics
    if (typeof window !== 'undefined' && 'performance' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        
        entries.forEach((entry) => {
          switch (entry.entryType) {
            case 'paint':
              if (entry.name === 'first-contentful-paint') {
                setMetrics(prev => ({ ...prev, fcp: entry.startTime }))
              }
              break
            case 'largest-contentful-paint':
              setMetrics(prev => ({ ...prev, lcp: entry.startTime }))
              break
            case 'first-input':
              setMetrics(prev => ({ 
                ...prev, 
                fid: (entry as any).processingStart - entry.startTime 
              }))
              break
            case 'layout-shift':
              if (!(entry as any).hadRecentInput) {
                setMetrics(prev => ({ 
                  ...prev, 
                  cls: (prev.cls || 0) + (entry as any).value 
                }))
              }
              break
            case 'navigation':
              setMetrics(prev => ({ 
                ...prev, 
                ttfb: (entry as any).responseStart - (entry as any).requestStart,
                loadTime: entry.loadEventEnd - entry.loadEventStart
              }))
              break
          }
        })
      })

      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift', 'navigation'] })

      return () => observer.disconnect()
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', decideVisibility)
      }
    }
  }, [])

  if (!isVisible) return null

  const getScoreColor = (value: number | null, thresholds: { good: number; poor: number }) => {
    if (value === null) return 'bg-gray-100'
    if (value <= thresholds.good) return 'bg-green-100 text-green-800'
    if (value <= thresholds.poor) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getScoreText = (value: number | null, thresholds: { good: number; poor: number }) => {
    if (value === null) return 'N/A'
    if (value <= thresholds.good) return 'Good'
    if (value <= thresholds.poor) return 'Needs Improvement'
    return 'Poor'
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-white/95 backdrop-blur-sm border shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Performance Metrics
            <Badge variant="outline" className="text-xs">Dev</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                FCP
              </span>
              <Badge className={getScoreColor(metrics.fcp, { good: 1800, poor: 3000 })}>
                {metrics.fcp ? `${Math.round(metrics.fcp)}ms` : 'N/A'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                LCP
              </span>
              <Badge className={getScoreColor(metrics.lcp, { good: 2500, poor: 4000 })}>
                {metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'N/A'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                FID
              </span>
              <Badge className={getScoreColor(metrics.fid, { good: 100, poor: 300 })}>
                {metrics.fid ? `${Math.round(metrics.fid)}ms` : 'N/A'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                CLS
              </span>
              <Badge className={getScoreColor(metrics.cls, { good: 0.1, poor: 0.25 })}>
                {metrics.cls ? metrics.cls.toFixed(3) : 'N/A'}
              </Badge>
            </div>
          </div>
          
          <div className="pt-2 border-t text-xs text-gray-500">
            <div className="flex justify-between">
              <span>TTFB:</span>
              <span>{metrics.ttfb ? `${Math.round(metrics.ttfb)}ms` : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Load Time:</span>
              <span>{metrics.loadTime ? `${Math.round(metrics.loadTime)}ms` : 'N/A'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
