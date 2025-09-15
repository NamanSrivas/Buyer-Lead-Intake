import { NextResponse } from 'next/server'
import { v4 as uuid } from 'uuid'
import { db } from '../../../lib/db'
import { buyerSchema, Buyer } from '../../../lib/schema'
import { getCurrentUser } from '../../../lib/auth'

type BuyerWithTags = Buyer & { tags: string[] }

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const json = await request.json()
  const parse = buyerSchema.safeParse(json)
  if (!parse.success) {
    return NextResponse.json({ errors: parse.error.format() }, { status: 422 })
  }
  const data = parse.data

  const buyer = await db.buyer.create({
    data: {
      id: uuid(),
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
      ownerId: user.id,
    },
  })

  await db.buyerHistory.create({
    data: {
      id: uuid(),
      buyerId: buyer.id,
      changedBy: user.id,
      diff: JSON.stringify({}),
    },
  })

  return NextResponse.json({ success: true, id: buyer.id }, { status: 201 })
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page') || '1')
  const pageSize = 10
  const skip = (page - 1) * pageSize

  const search = url.searchParams.get('search') || ''
  const city = url.searchParams.get('city') || undefined
  const propertyType = url.searchParams.get('propertyType') || undefined
  const status = url.searchParams.get('status') || undefined
  const timeline = url.searchParams.get('timeline') || undefined

  const where: any = {}
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search } },
      { email: { contains: search, mode: 'insensitive' } },
    ]
  }
  if (city) where.city = city
  if (propertyType) where.propertyType = propertyType
  if (status) where.status = status
  if (timeline) where.timeline = timeline

  const [total, buyers] = await Promise.all([
    db.buyer.count({ where }),
    db.buyer.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip,
      take: pageSize,
    }),
  ])

  const leads: BuyerWithTags[] = buyers.map((b: Buyer) => ({
    ...b,
    tags: JSON.parse(String(b.tags || '[]')) as string[],
  }))

  return NextResponse.json({ leads, page, pageSize, total })
}
