import { NextResponse } from 'next/server'
import { db } from '../../../../lib/db'
import { buyerSchema } from '../../../../lib/schema'
import { getCurrentUser } from '../../../../lib/auth'
import { v4 as uuid } from 'uuid'
import csvParse from 'csv-parse/lib/sync'

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const text = await request.text()
  const records = csvParse(text, {
    columns: true,
    skip_empty_lines: true,
  })

  if (records.length > 200) {
    return NextResponse.json({ error: 'Max 200 rows allowed' }, { status: 400 })
  }

  const errors = []
  const validRows: { status: "New" | "Qualified" | "Contacted" | "Visited" | "Negotiation" | "Converted" | "Dropped"; fullName: string; phone: string; city: "Chandigarh" | "Mohali" | "Zirakpur" | "Panchkula" | "Other"; propertyType: "Apartment" | "Villa" | "Plot" | "Office" | "Retail"; purpose: "Buy" | "Rent"; timeline: "0-3m" | "3-6m" | ">6m" | "Exploring"; source: "Other" | "Website" | "Referral" | "Walk-in" | "Call"; tags?: string[] | undefined; budgetMin?: number | undefined; budgetMax?: number | undefined; email?: string | undefined; bhk?: "1" | "2" | "3" | "4" | "Studio" | undefined; notes?: string | undefined }[] = []

  for (let i = 0; i < records.length; i++) {
    const row = records[i]
    // Transform row fields as needed (e.g. budgetMin to int)
    // Split tags string to array if it's a comma separated string
    if (typeof row.tags === 'string') {
      row.tags = row.tags.split(',').map((t: string) => t.trim())
    }
    // Convert budget strings to numbers or undefined
    row.budgetMin = row.budgetMin ? parseInt(row.budgetMin) : undefined
    row.budgetMax = row.budgetMax ? parseInt(row.budgetMax) : undefined

    const parseResult = buyerSchema.safeParse(row)
    if (!parseResult.success) {
      errors.push({ row: i + 2, errors: parseResult.error.errors })
      continue
    }
    validRows.push(parseResult.data)
  }

  if (errors.length > 0) {
    return NextResponse.json({ errors, validCount: validRows.length, total: records.length }, { status: 422 })
  }

  // Insert valid rows inside a transaction
  await db.$transaction(async (prisma: { buyer: { create: (arg0: { data: { id: string; fullName: string; email: string | null; phone: string; city: "Chandigarh" | "Mohali" | "Zirakpur" | "Panchkula" | "Other"; propertyType: "Apartment" | "Villa" | "Plot" | "Office" | "Retail"; bhk: "1" | "2" | "3" | "4" | "Studio" | null; purpose: "Buy" | "Rent"; budgetMin: number | null; budgetMax: number | null; timeline: "0-3m" | "3-6m" | ">6m" | "Exploring"; source: "Other" | "Website" | "Referral" | "Walk-in" | "Call"; status: "New" | "Qualified" | "Contacted" | "Visited" | "Negotiation" | "Converted" | "Dropped"; notes: string | null; tags: string; ownerId: string } }) => any }; buyerHistory: { create: (arg0: { data: { id: string; buyerId: string; changedBy: string; diff: string } }) => any } }) => {
    for (const data of validRows) {
      const buyerId = uuid()
      await prisma.buyer.create({
        data: {
          id: buyerId,
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
      await prisma.buyerHistory.create({
        data: {
          id: uuid(),
          buyerId,
          changedBy: user.id,
          diff: JSON.stringify({}),
        },
      })
    }
  })

  return NextResponse.json({ success: true, imported: validRows.length })
}
