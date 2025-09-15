'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ENUMS, validateLead } from '../../lib/schema';

export default function ImportCSV() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState(null);
  const [preview, setPreview] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const expectedHeaders = [
    'fullName', 'email', 'phone', 'city', 'propertyType', 'bhk', 
    'purpose', 'budgetMin', 'budgetMax', 'timeline', 'source', 'notes', 'tags', 'status'
  ];

  const generateSampleCSV = () => {
    const headers = expectedHeaders.join(',');
    const sampleRows = [
      '"John Doe","john@example.com","9876543210","Chandigarh","Apartment","2","Buy","5000000","7000000","3-6m","Website","Looking for ready-to-move apartment","first-time-buyer,urgent","New"',
      '"Sarah Smith","sarah@example.com","9876543211","Mohali","Villa","3","Buy","8000000","12000000","0-3m","Referral","Wants independent villa with parking","villa,parking","Qualified"',
      '"Raj Kumar","","9876543212","Zirakpur","Plot","","Buy","2000000","3000000",">6m","Walk-in","Interested in residential plot","investment","New"'
    ];
    
    const csvContent = [headers, ...sampleRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-leads.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const parseCSV = (content) => {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length === 0) return { headers: [], rows: [] };
    
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    const rows = lines.slice(1).map((line, index) => {
      const values = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      
      return {
        rowNumber: index + 2,
        values: values.map(v => v.replace(/^"|"$/g, ''))
      };
    });
    
    return { headers, rows };
  };

  const validateCSVRow = (rowData, rowNumber) => {
    const errors = [];
    
    const leadData = {
      fullName: rowData.fullName || '',
      email: rowData.email || '',
      phone: rowData.phone || '',
      city: rowData.city || '',
      propertyType: rowData.propertyType || '',
      bhk: rowData.bhk || '',
      purpose: rowData.purpose || '',
      budgetMin: rowData.budgetMin ? parseInt(rowData.budgetMin) : '',
      budgetMax: rowData.budgetMax ? parseInt(rowData.budgetMax) : '',
      timeline: rowData.timeline || '',
      source: rowData.source || '',
      status: rowData.status || 'New',
      notes: rowData.notes || '',
      tags: rowData.tags ? rowData.tags.split(',').map(t => t.trim()) : []
    };

    if (!leadData.fullName) errors.push('Full name is required');
    if (!leadData.phone) errors.push('Phone is required');
    if (!leadData.city) errors.push('City is required');
    if (!leadData.propertyType) errors.push('Property type is required');
    if (!leadData.purpose) errors.push('Purpose is required');
    if (!leadData.timeline) errors.push('Timeline is required');
    if (!leadData.source) errors.push('Source is required');

    if (leadData.city && !ENUMS.cities.includes(leadData.city)) {
      errors.push(`Invalid city: ${leadData.city}`);
    }
    if (leadData.propertyType && !ENUMS.propertyTypes.includes(leadData.propertyType)) {
      errors.push(`Invalid property type: ${leadData.propertyType}`);
    }
    if (leadData.bhk && !ENUMS.bhkOptions.includes(leadData.bhk)) {
      errors.push(`Invalid BHK: ${leadData.bhk}`);
    }
    if (leadData.purpose && !ENUMS.purposes.includes(leadData.purpose)) {
      errors.push(`Invalid purpose: ${leadData.purpose}`);
    }
    if (leadData.timeline && !ENUMS.timelines.includes(leadData.timeline)) {
      errors.push(`Invalid timeline: ${leadData.timeline}`);
    }
    if (leadData.source && !ENUMS.sources.includes(leadData.source)) {
      errors.push(`Invalid source: ${leadData.source}`);
    }
    if (leadData.status && !ENUMS.statuses.includes(leadData.status)) {
      errors.push(`Invalid status: ${leadData.status}`);
    }

    const validationErrors = validateLead(leadData);
    if (validationErrors) {
      Object.values(validationErrors).forEach(error => errors.push(error));
    }

    return { leadData, errors, isValid: errors.length === 0 };
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        alert('Please select a CSV file');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
      setResults(null);
      setPreview([]);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const { headers, rows } = parseCSV(content);
        setPreview(rows.slice(0, 3));
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!file) {
      alert('Please select a CSV file first');
      return;
    }

    setImporting(true);
    setResults(null);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target.result;
        const { headers, rows } = parseCSV(content);

        if (rows.length > 200) {
          alert('CSV file cannot contain more than 200 rows (excluding header)');
          setImporting(false);
          return;
        }

        const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
        if (missingHeaders.length > 0) {
          alert(`Missing required headers: ${missingHeaders.join(', ')}`);
          setImporting(false);
          return;
        }

        const validRows = [];
        const invalidRows = [];

        rows.forEach(row => {
          const rowData = {};
          headers.forEach((header, index) => {
            rowData[header] = row.values[index] || '';
          });

          const validation = validateCSVRow(rowData, row.rowNumber);
          
          if (validation.isValid) {
            validRows.push({
              ...validation.leadData,
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              ownerId: 'user-1',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          } else {
            invalidRows.push({
              rowNumber: row.rowNumber,
              data: rowData,
              errors: validation.errors
            });
          }
        });

        if (validRows.length > 0) {
          const existingLeads = JSON.parse(localStorage.getItem('leads') || '[]');
          const updatedLeads = [...existingLeads, ...validRows];
          localStorage.setItem('leads', JSON.stringify(updatedLeads));
        }

        setResults({
          totalRows: rows.length,
          validRows: validRows.length,
          invalidRows: invalidRows.length,
          errors: invalidRows
        });

        setImporting(false);
      };

      reader.readAsText(file);
    } catch (error) {
      console.error('Import error:', error);
      alert('Error processing CSV file');
      setImporting(false);
    }
  };

  return (
    <div className="main-content">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb fade-in">
          <a href="/" onClick={(e) => { e.preventDefault(); router.push('/'); }}>🏠 Home</a>
          <span>›</span>
          <span>Import CSV</span>
        </div>

        {/* Header */}
        <div className="page-header fade-in">
          <h1 className="page-title">
            📤 CSV Import
          </h1>
          <p className="page-subtitle">
            Bulk import buyer leads with comprehensive validation (max 200 rows)
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px'
        }}>
          {/* Upload Section */}
          <div className="modern-card slide-up">
            <div style={{padding: '40px'}}>
              <div style={{marginBottom: '32px', textAlign: 'center'}}>
                <h2 style={{
                  fontSize: '2rem', 
                  fontWeight: '700', 
                  marginBottom: '8px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  📁 Upload CSV File
                </h2>
                <p style={{color: '#6b7280', fontSize: '1.1rem'}}>
                  Select or drag & drop your CSV file to import leads
                </p>
              </div>

              {/* File Drop Zone */}
              <div
                style={{
                  border: `3px dashed ${dragActive ? '#667eea' : 'rgba(102, 126, 234, 0.3)'}`,
                  borderRadius: '20px',
                  padding: '60px 40px',
                  textAlign: 'center',
                  marginBottom: '32px',
                  background: dragActive ? 'rgba(102, 126, 234, 0.05)' : 'rgba(102, 126, 234, 0.02)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input').click()}
              >
                <div style={{
                  fontSize: '4rem', 
                  marginBottom: '20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  📄
                </div>
                <input
                  id="file-input"
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  style={{display: 'none'}}
                />
                <p style={{fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>
                  {dragActive ? 'Drop your CSV file here!' : 'Choose CSV file or drag & drop'}
                </p>
                <p style={{color: '#6b7280', fontSize: '14px'}}>
                  Maximum file size: 5MB • Maximum rows: 200
                </p>
              </div>

              {/* Selected File Info */}
              {file && (
                <div className="slide-up" style={{
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)',
                  border: '2px solid rgba(102, 126, 234, 0.2)',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '32px'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px'
                    }}>
                      📊
                    </div>
                    <div>
                      <div style={{fontWeight: '600', color: '#667eea', fontSize: '16px'}}>
                        {file.name}
                      </div>
                      <div style={{fontSize: '14px', color: '#6b7280'}}>
                        {(file.size / 1024).toFixed(1)} KB • CSV File
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview */}
              {preview.length > 0 && (
                <div className="slide-up" style={{marginBottom: '32px'}}>
                  <h3 style={{
                    fontSize: '1.25rem', 
                    fontWeight: '600', 
                    marginBottom: '16px', 
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    👀 Preview (first 3 rows):
                  </h3>
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.02)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    overflow: 'auto',
                    maxHeight: '200px'
                  }}>
                    {preview.map((row, index) => (
                      <div key={index} style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.5)' : 'transparent',
                        marginBottom: '4px'
                      }}>
                        <strong>Row {row.rowNumber}:</strong> {row.values.slice(0, 4).join(' | ')}...
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Import Button */}
              <button
                onClick={handleImport}
                disabled={!file || importing}
                className={!file || importing ? 'btn-secondary' : 'btn-primary'}
                style={{
                  width: '100%',
                  height: '56px',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px'
                }}
              >
                {importing ? (
                  <>
                    <div className="spinner" style={{width: '20px', height: '20px', margin: 0}}></div>
                    Processing Import...
                  </>
                ) : (
                  <>
                    📤 Import CSV Data
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Instructions & Results */}
          <div>
            {/* Instructions */}
            <div className="modern-card slide-up" style={{marginBottom: '32px'}}>
              <div style={{padding: '40px'}}>
                <div style={{marginBottom: '32px', textAlign: 'center'}}>
                  <h2 style={{
                    fontSize: '2rem', 
                    fontWeight: '700', 
                    marginBottom: '8px',
                    background: 'linear-gradient(135deg, #51cf66 0%, #40c057 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    📋 Format Guide
                  </h2>
                  <p style={{color: '#6b7280', fontSize: '1.1rem'}}>
                    CSV format requirements and validation rules
                  </p>
                </div>

                <div style={{marginBottom: '32px'}}>
                  <h3 style={{
                    fontSize: '1.25rem', 
                    fontWeight: '600', 
                    marginBottom: '16px', 
                    color: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    📝 Required Headers:
                  </h3>
                  <div style={{
                    background: 'rgba(34, 197, 94, 0.05)',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    wordBreak: 'break-all',
                    lineHeight: '1.6'
                  }}>
                    {expectedHeaders.join(', ')}
                  </div>
                </div>

                <div style={{marginBottom: '32px'}}>
                  <h3 style={{
                    fontSize: '1.25rem', 
                    fontWeight: '600', 
                    marginBottom: '16px', 
                    color: '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    ⚡ Validation Rules:
                  </h3>
                  <div style={{
                    background: 'rgba(245, 158, 11, 0.05)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    borderRadius: '12px',
                    padding: '20px'
                  }}>
                    <ul style={{fontSize: '14px', color: '#6b7280', lineHeight: '1.8', paddingLeft: '20px', margin: 0}}>
                      <li><strong>fullName:</strong> 2-80 characters (required)</li>
                      <li><strong>phone:</strong> 10-15 digits (required)</li>
                      <li><strong>email:</strong> valid email format (optional)</li>
                      <li><strong>city:</strong> {ENUMS.cities.join(', ')}</li>
                      <li><strong>propertyType:</strong> {ENUMS.propertyTypes.join(', ')}</li>
                      <li><strong>bhk:</strong> required for Apartment/Villa only</li>
                      <li><strong>budgetMax ≥ budgetMin</strong> (when both present)</li>
                      <li><strong>tags:</strong> comma-separated values</li>
                    </ul>
                  </div>
                </div>

                <button
                  onClick={generateSampleCSV}
                  className="btn-success"
                  style={{width: '100%', height: '48px', fontSize: '16px', fontWeight: '600'}}
                >
                  📥 Download Sample CSV
                </button>
              </div>
            </div>

            {/* Results */}
            {results && (
              <div className="modern-card slide-up">
                <div style={{padding: '40px'}}>
                  <div style={{marginBottom: '32px', textAlign: 'center'}}>
                    <h2 style={{
                      fontSize: '2rem', 
                      fontWeight: '700', 
                      marginBottom: '8px',
                      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      📊 Import Results
                    </h2>
                    <p style={{color: '#6b7280', fontSize: '1.1rem'}}>
                      Processing summary and validation results
                    </p>
                  </div>

                  <div className="grid grid-3" style={{marginBottom: '32px'}}>
                    <div className="stat-card">
                      <div className="stat-number" style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}>
                        {results.totalRows}
                      </div>
                      <div className="stat-label">Total Rows</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number" style={{
                        background: 'linear-gradient(135deg, #51cf66 0%, #40c057 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}>
                        {results.validRows}
                      </div>
                      <div className="stat-label">Imported</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number" style={{
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}>
                        {results.invalidRows}
                      </div>
                      <div className="stat-label">Errors</div>
                    </div>
                  </div>

                  {results.errors.length > 0 && (
                    <div style={{marginBottom: '32px'}}>
                      <h3 style={{
                        fontSize: '1.25rem', 
                        fontWeight: '600', 
                        marginBottom: '16px', 
                        color: '#dc2626',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        ❌ Validation Errors
                      </h3>
                      <div style={{maxHeight: '400px', overflowY: 'auto'}}>
                        {results.errors.map((error, index) => (
                          <div key={index} style={{
                            marginBottom: '16px',
                            padding: '20px',
                            background: 'rgba(239, 68, 68, 0.05)',
                            border: '2px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '12px'
                          }}>
                            <div style={{
                              fontWeight: '600', 
                              color: '#dc2626', 
                              marginBottom: '12px',
                              fontSize: '16px'
                            }}>
                              🚫 Row {error.rowNumber}:
                            </div>
                            <ul style={{
                              fontSize: '14px', 
                              color: '#991b1b', 
                              paddingLeft: '20px', 
                              margin: 0,
                              lineHeight: '1.6'
                            }}>
                              {error.errors.map((err, errIndex) => (
                                <li key={errIndex}>{err}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.validRows > 0 && (
                    <div style={{textAlign: 'center'}}>
                      <button
                        onClick={() => router.push('/buyers')}
                        className="btn-primary"
                        style={{fontSize: '16px', fontWeight: '600'}}
                      >
                        👀 View Imported Leads
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
