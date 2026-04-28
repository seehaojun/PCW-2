import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(req: NextRequest) {
  if (req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/family', req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/login'],
}
