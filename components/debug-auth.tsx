"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DebugAuth() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkAuthStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug/auth')
      const data = await response.json()
      setDebugInfo(data)
    } catch (error) {
      console.error('Debug auth error:', error)
      setDebugInfo({ error: 'Failed to fetch debug info' })
    } finally {
      setLoading(false)
    }
  }

  const clearAuth = () => {
    localStorage.removeItem("whitlin_user")
    document.cookie = "whitlin_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    setDebugInfo(null)
  }

  useEffect(() => {
    checkAuthStatus()
  }, [])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Auth Debug Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={checkAuthStatus} disabled={loading}>
            {loading ? 'Checking...' : 'Check Auth Status'}
          </Button>
          <Button variant="outline" onClick={clearAuth}>
            Clear Auth
          </Button>
        </div>
        
        {debugInfo && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Server-side Auth Status:</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
            
            <div>
              <h3 className="font-semibold">Client-side Auth Status:</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                {JSON.stringify({
                  localStorage: typeof window !== 'undefined' ? localStorage.getItem("whitlin_user") : 'N/A',
                  cookies: typeof document !== 'undefined' ? document.cookie : 'N/A',
                  hostname: typeof window !== 'undefined' ? window.location.hostname : 'N/A'
                }, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
