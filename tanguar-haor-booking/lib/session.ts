import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret')
const cookieName = 'session'

export type Session = {
  userId: string
  role: 'guest' | 'owner' | 'admin'
  name: string
  email: string
}

export async function setSession(s: Session) {
  const token = await new SignJWT(s as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
  cookies().set(cookieName, token, { httpOnly: true, sameSite: 'lax', path: '/' })
}

export async function getSession(): Promise<Session | null> {
  const token = cookies().get(cookieName)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as any
  } catch {
    return null
  }
}

export function clearSession() {
  cookies().set(cookieName, '', { httpOnly: true, maxAge: 0, path: '/' })
}
