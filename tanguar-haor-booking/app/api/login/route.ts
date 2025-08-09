import { prisma } from '../../../lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { setSession } from '../../../lib/session'

export async function POST(req: Request) {
  const fd = await req.formData()
  const email = String(fd.get('email') || '')
  const password = String(fd.get('password') || '')
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return NextResponse.redirect(new URL('/login?e=1', process.env.NEXT_PUBLIC_BASE_URL))
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return NextResponse.redirect(new URL('/login?e=1', process.env.NEXT_PUBLIC_BASE_URL))
  await setSession({ userId: user.id, role: user.role, name: user.name, email: user.email })
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL))
}
