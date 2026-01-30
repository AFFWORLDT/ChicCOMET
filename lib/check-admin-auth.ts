import { NextRequest, NextResponse } from 'next/server'

/**
 * Check if the current user is an admin from request cookies
 * Returns user data if admin, null otherwise
 */
export function checkAdminAuth(request: NextRequest): { id: string; email: string; role: string } | null {
  try {
    // Get cookie from request
    const token = request.cookies.get('chiccomet_user')?.value

    if (!token) {
      return null
    }

    try {
      // Decode the URL-encoded cookie value
      const decodedToken = decodeURIComponent(token)
      const userData = JSON.parse(decodedToken)

      // Check if user is admin
      if (userData.role === 'admin' || userData.email === 'admin@chiccomet.com') {
        return {
          id: userData.id || userData._id,
          email: userData.email,
          role: userData.role || 'admin'
        }
      }

      return null
    } catch (error) {
      console.error('Error parsing admin auth token:', error)
      return null
    }
  } catch (error) {
    console.error('Error checking admin auth:', error)
    return null
  }
}

/**
 * Middleware to protect admin routes
 * Use this in admin API routes
 * Returns error response if not admin, null if authorized
 */
export function requireAdmin(request: NextRequest): NextResponse | null {
  const admin = checkAdminAuth(request)

  if (!admin) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Admin access required.' },
      { status: 401 }
    )
  }

  return null // Return null if authorized (continue processing)
}

