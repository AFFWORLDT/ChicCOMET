import { NextRequest, NextResponse } from 'next/server'
import { cache } from '@/lib/cache'
import { CacheManager } from '@/lib/cache-optimizer'

export async function POST(request: NextRequest) {
  try {
    // Clear memory cache
    cache.clear()
    
    // Clear cache optimizer cache
    const cacheManager = CacheManager.getInstance()
    cacheManager.invalidate()
    
    return NextResponse.json({
      success: true,
      message: 'All caches cleared successfully'
    })
  } catch (error: any) {
    console.error('Error clearing cache:', error)
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to clear cache'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get cache stats
    const stats = cache.getStats()
    
    return NextResponse.json({
      success: true,
      data: {
        size: stats.size,
        keys: stats.keys
      }
    })
  } catch (error: any) {
    console.error('Error getting cache stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to get cache stats'
      },
      { status: 500 }
    )
  }
}

