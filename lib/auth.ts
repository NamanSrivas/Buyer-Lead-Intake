import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'change-this-secret')

export interface User {
  id: string
  email: string
  role: 'user' | 'admin'
}

const DEMO_USERS: User[] = [
  { id: 'user-1', email: 'demo@example.com', role: 'user' },
  { id: 'admin-1', email: 'admin@example.com', role: 'admin' },
]

export async function getCurrentUser(): Promise<User | null> {
  const token = cookies().get('auth-token')?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    return (payload as any).user
  } catch {
    return null
  }
}

export async function createToken(user: User): Promise<string> {
  return new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret)
}
