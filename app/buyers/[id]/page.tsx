'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

interface Lead {
  id: string
  fullName: string
  email?: string | null
  phone: string
  city: string
  propertyType: string
  bhk?: string | null
  purpose: string
  budgetMin?: number | null
  budgetMax?: number | null
  timeline: string
  source: string
  status: string
  notes?: string | null
  tags: string[]
  updatedAt: string
}

export default function LeadEditPage() {
  const { id } = useParams()
  const router = useRouter()
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<any>({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    propertyType: '',
    bhk: '',
    purpose: '',
    budgetMin: '',
    budgetMax: '',
    timeline: '',
    source: '',
    status: '',
    notes: '',
    tags: '',
    updatedAt: '',
  })

  useEffect(() => {
    async function fetchLead() {
      setLoading(true)
      const res = await fetch(`/api/buyers/${id}`)
      if (res.ok) {
        const data = await res.json()
        setLead(data)
        setFormData({
          fullName: data.fullName,
          email: data.email || '',
          phone: data.phone,
          city: data.city,
          propertyType: data.propertyType,
          bhk: data.bhk || '',
          purpose: data.purpose,
          budgetMin: data.budgetMin ?? '',
          budgetMax: data.budgetMax ?? '',
          timeline: data.timeline,
          source: data.source,
          status: data.status,
          notes: data.notes || '',
          tags: data.tags.join(', '),
          updatedAt: data.updatedAt,
        })
      } else {
        setError('Lead not found.')
      }
      setLoading(false)
    }
    fetchLead()
  }, [id])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      ...formData,
      budgetMin: formData.budgetMin ? parseInt(formData.budgetMin) : undefined,
      budgetMax: formData.budgetMax ? parseInt(formData.budgetMax) : undefined,
      tags: formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
    }

    const res = await fetch(`/api/buyers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      router.push('/buyers')
    } else {
      const json = await res.json()
      setError(json.error || JSON.stringify(json.errors) || 'Failed to update lead')
    }
    setSaving(false)
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (!lead) return null

  return (
    <div>
      <h1>Edit Lead</h1>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="updatedAt" value={formData.updatedAt} />

        <label>Full Name*</label>
        <input name="fullName" value={formData.fullName} onChange={handleChange} required minLength={2} />

        <label>Email</label>
        <input name="email" value={formData.email} onChange={handleChange} type="email" />

        <label>Phone*</label>
        <input name="phone" value={formData.phone} onChange={handleChange} required pattern="\d{10,15}" />

        <label>City*</label>
        <select name="city" value={formData.city} onChange={handleChange} required>
          <option>Chandigarh</option>
          <option>Mohali</option>
          <option>Zirakpur</option>
          <option>Panchkula</option>
          <option>Other</option>
        </select>

        <label>Property Type*</label>
        <select name="propertyType" value={formData.propertyType} onChange={handleChange} required>
          <option>Apartment</option>
          <option>Villa</option>
          <option>Plot</option>
          <option>Office</option>
          <option>Retail</option>
        </select>

        {(formData.propertyType === 'Apartment' || formData.propertyType === 'Villa') && (
          <>
            <label>BHK*</label>
            <select name="bhk" value={formData.bhk} onChange={handleChange} required>
              <option value="">Select</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>Studio</option>
            </select>
          </>
        )}

        <label>Purpose*</label>
        <select name="purpose" value={formData.purpose} onChange={handleChange} required>
          <option>Buy</option>
          <option>Rent</option>
        </select>

        <label>Budget Min</label>
        <input name="budgetMin" value={formData.budgetMin} onChange={handleChange} type="number" min={0} />

        <label>Budget Max</label>
        <input name="budgetMax" value={formData.budgetMax} onChange={handleChange} type="number" min={0} />

        <label>Timeline*</label>
        <select name="timeline" value={formData.timeline} onChange={handleChange} required>
          <option>0-3m</option>
          <option>3-6m</option>
          <option>&gt;6m</option>
          <option>Exploring</option>
        </select>

        <label>Source*</label>
        <select name="source" value={formData.source} onChange={handleChange} required>
          <option>Website</option>
          <option>Referral</option>
          <option>Walk-in</option>
          <option>Call</option>
          <option>Other</option>
        </select>

        <label>Status*</label>
        <select name="status" value={formData.status} onChange={handleChange} required>
          <option>New</option>
          <option>Qualified</option>
          <option>Contacted</option>
          <option>Visited</option>
          <option>Negotiation</option>
          <option>Converted</option>
          <option>Dropped</option>
        </select>

        <label>Notes</label>
        <textarea name="notes" value={formData.notes} onChange={handleChange} maxLength={1000} />

        <label>Tags (comma separated)</label>
        <input name="tags" value={formData.tags} onChange={handleChange} />

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  )
}
