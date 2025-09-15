'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewLeadPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: 'Chandigarh',
    propertyType: 'Apartment',
    bhk: '',
    purpose: 'Buy',
    budgetMin: '',
    budgetMax: '',
    timeline: '0-3m',
    source: 'Website',
    status: 'New',
    notes: '',
    tags: '',
    email: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Prepare tags as array
    const dataToSend = {
      ...formData,
      budgetMin: formData.budgetMin ? parseInt(formData.budgetMin) : undefined,
      budgetMax: formData.budgetMax ? parseInt(formData.budgetMax) : undefined,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
    }

    const res = await fetch('/api/buyers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    })

    if (res.ok) {
      // Redirect to leads list after success
      router.push('/buyers')
    } else {
      const json = await res.json()
      setError(JSON.stringify(json.errors || json.error || 'Unknown error'))
    }
    setLoading(false)
  }

  return (
    <div>
      <h1>Create New Lead</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name*:</label>
          <input name="fullName" value={formData.fullName} onChange={handleChange} required minLength={2} />
        </div>
        <div>
          <label>Phone*:</label>
          <input name="phone" value={formData.phone} onChange={handleChange} required pattern="\d{10,15}" />
        </div>
        <div>
          <label>Email:</label>
          <input name="email" value={formData.email} onChange={handleChange} type="email" />
        </div>
        <div>
          <label>City*:</label>
          <select name="city" value={formData.city} onChange={handleChange} required>
            <option>Chandigarh</option>
            <option>Mohali</option>
            <option>Zirakpur</option>
            <option>Panchkula</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label>Property Type*:</label>
          <select name="propertyType" value={formData.propertyType} onChange={handleChange} required>
            <option>Apartment</option>
            <option>Villa</option>
            <option>Plot</option>
            <option>Office</option>
            <option>Retail</option>
          </select>
        </div>
        {(formData.propertyType === 'Apartment' || formData.propertyType === 'Villa') && (
          <div>
            <label>BHK*:</label>
            <select name="bhk" value={formData.bhk} onChange={handleChange} required>
              <option value="">Select</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>Studio</option>
            </select>
          </div>
        )}
        <div>
          <label>Purpose*:</label>
          <select name="purpose" value={formData.purpose} onChange={handleChange} required>
            <option>Buy</option>
            <option>Rent</option>
          </select>
        </div>
        <div>
          <label>Budget Min:</label>
          <input
            name="budgetMin"
            value={formData.budgetMin}
            onChange={handleChange}
            type="number"
            min={0}
            step={10000}
          />
        </div>
        <div>
          <label>Budget Max:</label>
          <input
            name="budgetMax"
            value={formData.budgetMax}
            onChange={handleChange}
            type="number"
            min={0}
            step={10000}
          />
        </div>
        <div>
          <label>Timeline*:</label>
          <select name="timeline" value={formData.timeline} onChange={handleChange} required>
            <option>0-3m</option>
            <option>3-6m</option>
            <option>&gt;6m</option>
            <option>Exploring</option>
          </select>
        </div>
        <div>
          <label>Source*:</label>
          <select name="source" value={formData.source} onChange={handleChange} required>
            <option>Website</option>
            <option>Referral</option>
            <option>Walk-in</option>
            <option>Call</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label>Status*:</label>
          <select name="status" value={formData.status} onChange={handleChange} required>
            <option>New</option>
            <option>Qualified</option>
            <option>Contacted</option>
            <option>Visited</option>
            <option>Negotiation</option>
            <option>Converted</option>
            <option>Dropped</option>
          </select>
        </div>
        <div>
          <label>Notes:</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} maxLength={1000} />
        </div>
        <div>
          <label>Tags (comma separated):</label>
          <input name="tags" value={formData.tags} onChange={handleChange} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Create Lead'}
        </button>
      </form>
    </div>
  )
}
