import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const path = req.nextUrl.pathname

  if (path === '/login') {
    if (token) {
      const role = token.role as string
      const dest = role === 'hj' ? '/networking' : role === 'ck' ? '/research' : '/family'
      return NextResponse.redirect(new URL(dest, req.url))
    }
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/family', '/research/:path*', '/networking'],
}
