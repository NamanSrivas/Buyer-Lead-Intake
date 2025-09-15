'use client'
import { useState } from 'react'

export default function CsvImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<any[]>([])
  const [message, setMessage] = useState('')

  async function handleUpload() {
    if (!file) return alert('Please select a CSV file')
    setLoading(true)
    setErrors([])
    setMessage('')

    const text = await file.text()
    const res = await fetch('/api/csv/import', {
      method: 'POST',
      headers: { 'Content-Type': 'text/csv' },
      body: text,
    })

    if (res.ok) {
      const result = await res.json()
      setMessage(`Successfully imported ${result.imported} leads!`)
    } else {
      const json = await res.json()
      setErrors(json.errors || [{ message: json.error || 'Unknown error' }])
    }
    setLoading(false)
  }

  return (
    <div>
      <h1>Import Buyer Leads CSV</h1>

      <input
        type="file"
        accept=".csv"
        onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
      />

      <button onClick={handleUpload} disabled={!file || loading}>
        {loading ? 'Importing...' : 'Import'}
      </button>

      {message && <p style={{ color: 'green' }}>{message}</p>}

      {errors.length > 0 && (
        <div style={{ color: 'red' }}>
          <h3>Errors</h3>
          <ul>
            {errors.map((e, i) => (
              <li key={i}>
                Row {e.row || 'N/A'}: {JSON.stringify(e.errors || e.message)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
