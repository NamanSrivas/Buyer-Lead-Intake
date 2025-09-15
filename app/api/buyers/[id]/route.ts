import { NextResponse } from 'next/server'
import { db } from '../../../../lib/db'
import { buyerSchema } from '../../../../lib/schema'
import { getCurrentUser } from '../../../../lib/auth'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const lead = await db.buyer.findUnique({ where: { id: params.id } })
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

  return NextResponse.json({ ...lead, tags: JSON.parse(lead.tags || '[]') })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existingLead = await db.buyer.findUnique({ where: { id: params.id } })
  if (!existingLead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  if (existingLead.ownerId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const json = await request.json()
  const parse = buyerSchema.safeParse(json)
  if (!parse.success) return NextResponse.json({ errors: parse.error.format() }, { status: 422 })
  const data = parse.data

  const updatedLead = await db.buyer.update({
    where: { id: params.id },
    data: {
      fullName: data.fullName,
      email: data.email || null,
      phone: data.phone,
      city: data.city,
      propertyType: data.propertyType,
      bhk: data.bhk || null,
      purpose: data.purpose,
      budgetMin: data.budgetMin ?? null,
      budgetMax: data.budgetMax ?? null,
      timeline: data.timeline,
      source: data.source,
      status: data.status,
      notes: data.notes || null,
      tags: JSON.stringify(data.tags || []),
    },
  })

  // TODO: Insert history with diff for changes here

  return NextResponse.json({ success: true, updatedLead })
}
