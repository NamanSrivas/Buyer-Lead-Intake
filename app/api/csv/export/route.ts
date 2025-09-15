import { NextResponse } from 'next/server'
import { db } from '../../../../lib/db'


interface Buyer {
  fullName: string
  email: string | null
  phone: string
  city: string
  propertyType: string
  bhk?: string | null
  purpose: string
  budgetMin?: number | null
  budgetMax?: number | null
  timeline: string
  source: string
  notes?: string | null
  tags?: string | null
  status: string
}

export async function GET() {
  const leads: Buyer[] = await db.buyer.findMany()

  const headers = [
    'fullName','email','phone','city','propertyType','bhk','purpose',
    'budgetMin','budgetMax','timeline','source','notes','tags','status'
  ]

  const lines = [
    headers.join(','),
    ...leads.map((l) =>
      [
        `"${l.fullName}"`,
        `"${l.email ?? ''}"`,
        `"${l.phone}"`,
        `"${l.city}"`,
        `"${l.propertyType}"`,
        `"${l.bhk ?? ''}"`,
        `"${l.purpose}"`,
        l.budgetMin ?? '',
        l.budgetMax ?? '',
        `"${l.timeline}"`,
        `"${l.source}"`,
        `"${l.notes ?? ''}"`,
        `"${l.tags ? JSON.parse(l.tags).join(',') : ''}"`,
        `"${l.status}"`
      ].join(',')
    )
  ]

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="buyer-leads.csv"',
    },
  })
}
