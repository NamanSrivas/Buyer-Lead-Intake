'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('demo@example.com')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (res.ok) {
      router.push('/buyers')
    } else {
      setError('Invalid email or login failed')
    }
  }

  return (
    <form onSubmit={handleLogin} style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h1>Demo Login</h1>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        style={{ width: '100%', padding: 8, marginBottom: 12 }}
      />
      <button type="submit" style={{ width: '100%', padding: 10 }}>
        Log In
      </button>
      {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
      <p style={{ marginTop: 20, fontSize: 12 }}>
        Use <code>demo@example.com</code> to login.
      </p>
    </form>
  )
}
