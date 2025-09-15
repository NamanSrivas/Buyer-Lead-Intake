import { z } from 'zod'

export const ENUMS = {
  cities: ['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other'] as const,
  propertyTypes: ['Apartment', 'Villa', 'Plot', 'Office', 'Retail'] as const,
  bhkOptions: ['1', '2', '3', '4', 'Studio'] as const,
  purposes: ['Buy', 'Rent'] as const,
  timelines: ['0-3m', '3-6m', '>6m', 'Exploring'] as const,
  sources: ['Website', 'Referral', 'Walk-in', 'Call', 'Other'] as const,
  statuses: ['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped'] as const,
}

export const buyerSchema = z
  .object({
    fullName: z.string().min(2).max(80),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().regex(/^\d{10,15}$/),
    city: z.enum(ENUMS.cities),
    propertyType: z.enum(ENUMS.propertyTypes),
    bhk: z.enum(ENUMS.bhkOptions).optional(),
    purpose: z.enum(ENUMS.purposes),
    budgetMin: z.number().int().positive().optional(),
    budgetMax: z.number().int().positive().optional(),
    timeline: z.enum(ENUMS.timelines),
    source: z.enum(ENUMS.sources),
    status: z.enum(ENUMS.statuses).default('New'),
    notes: z.string().max(1000).optional(),
    tags: z.array(z.string()).optional(),
  })
  .refine(
    data =>
      !['Apartment', 'Villa'].includes(data.propertyType) || !!data.bhk,
    {
      message: 'BHK is required for Apartment and Villa',
      path: ['bhk'],
    }
  )
  .refine(data => !data.budgetMin || !data.budgetMax || data.budgetMax >= data.budgetMin, {
    message: 'Max budget must be ≥ Min budget',
    path: ['budgetMax'],
  })

export type Buyer = z.infer<typeof buyerSchema>
