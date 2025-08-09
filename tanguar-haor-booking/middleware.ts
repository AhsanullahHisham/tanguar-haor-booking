import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret')
const PROTECTED_OWNER = ['/owner']
const PROTECTED_ADMIN = ['/admin']

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname
  if (!PROTECTED_OWNER.some(p => url.startsWith(p)) && !PROTECTED_ADMIN.some(p => url.startsWith(p))) {
    return NextResponse.next()
  }
  const token = req.cookies.get('session')?.value
  if (!token) return NextResponse.redirect(new URL('/login', req.url))
  try {
    const { payload } = await jwtVerify(token, secret)
    const role = payload.role as string
    if (url.startsWith('/owner') && (role === 'owner' || role === 'admin')) return NextResponse.next()
    if (url.startsWith('/admin') && role === 'admin') return NextResponse.next()
    return NextResponse.redirect(new URL('/', req.url))
  } catch (e) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: ['/owner/:path*', '/admin/:path*']
}
