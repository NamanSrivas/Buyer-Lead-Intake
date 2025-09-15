'use client'
import { useState, useEffect } from 'react'

interface Lead {
  id: string
  fullName: string
  phone: string
  city: string
  propertyType: string
  budgetMin?: number
  budgetMax?: number
  timeline: string
  status: string
  tags: string[]
}

export default function LeadListPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [total, setTotal] = useState(0)

  useEffect(() => {
    async function fetchLeads() {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      if (search) params.set('search', search)

      const res = await fetch(`/api/buyers?${params.toString()}`)
      const json = await res.json()
      setLeads(json.leads)
      setTotal(json.total)
    }
    fetchLeads()
  }, [page, search])

  async function handleExport() {
    const res = await fetch('/api/csv/export')
    if (!res.ok) {
      alert('Failed to export CSV')
      return
    }
    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'buyer-leads.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div>
      <h1>Buyer Leads</h1>

      <input
        placeholder="Search leads"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <button onClick={handleExport} style={{ marginLeft: '16px' }}>
        Export CSV
      </button>

      <table border={1} cellPadding={8} style={{ width: '100%', marginTop: 12 }}>
        {/* table headers */}
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>City</th>
            <th>Property Type</th>
            <th>Budget</th>
            <th>Timeline</th>
            <th>Status</th>
          </tr>
        </thead>
        {/* table body */}
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.fullName}</td>
              <td>{lead.phone}</td>
              <td>{lead.city}</td>
              <td>{lead.propertyType}</td>
              <td>
                {lead.budgetMin ? `₹${(lead.budgetMin / 100000).toFixed(0)}L` : 'N/A'} -{' '}
                {lead.budgetMax ? `₹${(lead.budgetMax / 100000).toFixed(0)}L` : 'N/A'}
              </td>
              <td>{lead.timeline}</td>
              <td>{lead.status}</td>
            </tr>
          ))}
          {leads.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center' }}>
                No leads found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
        Prev
      </button>
      <button disabled={page * 10 >= total} onClick={() => setPage(p => p + 1)}>
        Next
      </button>
      <span style={{ marginLeft: 12 }}>Total leads: {total}</span>
    </div>
  )
}
