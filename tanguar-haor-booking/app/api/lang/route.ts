import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const fd = await req.formData()
  const lang = (fd.get('lang') as string) || 'bn'
  cookies().set('lang', lang, { path: '/', maxAge: 60*60*24*365 })
  return NextResponse.redirect(new URL(req.headers.get('referer') || '/', process.env.NEXT_PUBLIC_BASE_URL))
}
