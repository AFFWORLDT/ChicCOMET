import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the path starts with /admin
  if (pathname.startsWith('/admin')) {
    // Get the token from cookies
    const token = request.cookies.get('whitlin_user')?.value
    
    if (!token) {
      console.log('No token found, redirecting to login')
      // Redirect to login page with redirect parameter
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    try {
      // Decode the URL-encoded cookie value
      const decodedToken = decodeURIComponent(token)
      // Parse the user data from the token
      const userData = JSON.parse(decodedToken)
      console.log('User data from token:', { role: userData.role, email: userData.email })
      
      // Check if user is admin
      if (userData.role !== 'admin') {
        console.log('User is not admin, redirecting to login')
        // Redirect to login page
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
      }
      
      console.log('Admin access granted')
    } catch (error) {
      console.log('Invalid token, redirecting to login:', error)
      // Invalid token, redirect to login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
}
