import { NextResponse } from 'next/server'
import { createToken, User } from '../../../../lib/auth'

const demoUsers: User[] = [
  { id: 'user-1', email: 'demo@example.com', role: 'user' },
  { id: 'admin-1', email: 'admin@example.com', role: 'admin' },
]

export async function POST(request: Request) {
  const { email } = await request.json()

  const user = demoUsers.find((u) => u.email === email)
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 401 })
  }

  const token = await createToken(user)
  const response = NextResponse.json({ success: true })

  response.cookies.set({
    name: 'auth-token',
    value: token,
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
  })

  return response
}
