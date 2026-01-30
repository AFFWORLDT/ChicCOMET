import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('whitlin_user')?.value
    
    return NextResponse.json({
      success: true,
      data: {
        hasToken: !!token,
        tokenValue: token ? JSON.parse(token) : null,
        cookies: Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value])),
        headers: {
          'user-agent': request.headers.get('user-agent'),
          'host': request.headers.get('host'),
          'referer': request.headers.get('referer')
        }
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: {
        hasToken: false,
        tokenValue: null
      }
    })
  }
}
