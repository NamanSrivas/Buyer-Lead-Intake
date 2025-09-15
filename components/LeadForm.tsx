'use client'
import { useState } from 'react';
import { ENUMS, validateLead } from '../lib/schema';

export default function LeadForm({ lead = {}, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    fullName: lead.fullName || '',
    email: lead.email || '',
    phone: lead.phone || '',
    city: lead.city || 'Chandigarh',
    propertyType: lead.propertyType || 'Apartment',
    bhk: lead.bhk || '',
    purpose: lead.purpose || 'Buy',
    budgetMin: lead.budgetMin || '',
    budgetMax: lead.budgetMax || '',
    timeline: lead.timeline || '3-6m',
    source: lead.source || 'Website',
    status: lead.status || 'New',
    notes: lead.notes || '',
    tags: lead.tags || []
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const validationErrors = validateLead(formData);
    if (validationErrors) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }
    
    setErrors({});
    await onSubmit(formData);
    setLoading(false);
  };

  const showBHK = ['Apartment', 'Villa'].includes(formData.propertyType);

  return (
    <div className="modern-card fade-in">
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
            {lead.id ? '✏️ Edit Lead' : '➕ Create New Lead'}
          </h2>
          <p style={{color: '#6b7280', fontSize: '1.1rem'}}>
            {lead.id ? 'Update lead information with validation' : 'Add a new buyer lead to your system'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-2" style={{marginBottom: '32px'}}>
            {/* Full Name */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className={`modern-input ${errors.fullName ? 'error' : ''}`}
                placeholder="Enter full name"
              />
              {errors.fullName && <div className="error-message">{errors.fullName}</div>}
            </div>

            {/* Phone */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Phone Number *
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className={`modern-input ${errors.phone ? 'error' : ''}`}
                placeholder="Enter phone number"
              />
              {errors.phone && <div className="error-message">{errors.phone}</div>}
            </div>

            {/* Email */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`modern-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter email address"
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            {/* City */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                City *
              </label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="modern-select"
              >
                {ENUMS.cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Property Type *
              </label>
              <select
                value={formData.propertyType}
                onChange={(e) => setFormData({...formData, propertyType: e.target.value, bhk: ''})}
                className="modern-select"
              >
                {ENUMS.propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* BHK (Conditional) */}
            {showBHK && (
              <div className="slide-up">
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  BHK Configuration *
                </label>
                <select
                  value={formData.bhk}
                  onChange={(e) => setFormData({...formData, bhk: e.target.value})}
                  className={`modern-select ${errors.bhk ? 'error' : ''}`}
                >
                  <option value="">Select BHK</option>
                  {ENUMS.bhkOptions.map(bhk => (
                    <option key={bhk} value={bhk}>{bhk}</option>
                  ))}
                </select>
                {errors.bhk && <div className="error-message">{errors.bhk}</div>}
              </div>
            )}

            {/* Purpose */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Purpose *
              </label>
              <select
                value={formData.purpose}
                onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                className="modern-select"
              >
                {ENUMS.purposes.map(purpose => (
                  <option key={purpose} value={purpose}>{purpose}</option>
                ))}
              </select>
            </div>

            {/* Budget Min */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Minimum Budget (₹)
              </label>
              <input
                type="number"
                value={formData.budgetMin}
                onChange={(e) => setFormData({...formData, budgetMin: parseInt(e.target.value) || ''})}
                className="modern-input"
                placeholder="Minimum budget in INR"
              />
            </div>

            {/* Budget Max */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Maximum Budget (₹)
              </label>
              <input
                type="number"
                value={formData.budgetMax}
                onChange={(e) => setFormData({...formData, budgetMax: parseInt(e.target.value) || ''})}
                className={`modern-input ${errors.budgetMax ? 'error' : ''}`}
                placeholder="Maximum budget in INR"
              />
              {errors.budgetMax && <div className="error-message">{errors.budgetMax}</div>}
            </div>

            {/* Timeline */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Timeline *
              </label>
              <select
                value={formData.timeline}
                onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                className="modern-select"
              >
                {ENUMS.timelines.map(timeline => (
                  <option key={timeline} value={timeline}>{timeline}</option>
                ))}
              </select>
            </div>

            {/* Source */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Lead Source *
              </label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({...formData, source: e.target.value})}
                className="modern-select"
              >
                {ENUMS.sources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Current Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="modern-select"
              >
                {ENUMS.statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div style={{marginBottom: '32px'}}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className={`modern-textarea ${errors.notes ? 'error' : ''}`}
              placeholder="Add any additional notes about this lead..."
              rows="4"
            />
            {errors.notes && <div className="error-message">{errors.notes}</div>}
          </div>

          {/* Tags */}
          <div style={{marginBottom: '40px'}}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Tags (Optional)
            </label>
            <input
              type="text"
              value={formData.tags.join(', ')}
              onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)})}
              className="modern-input"
              placeholder="Enter tags separated by commas (e.g., urgent, first-time-buyer, hot-lead)"
            />
            <div style={{fontSize: '12px', color: '#6b7280', marginTop: '6px'}}>
              💡 Add tags to help categorize and filter your leads
            </div>
          </div>

          {/* Form Actions */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'flex-end',
            paddingTop: '24px',
            borderTop: '1px solid rgba(0, 0, 0, 0.05)'
          }}>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary"
                disabled={loading}
              >
                ❌ Cancel
              </button>
            )}
            <button
              type="submit"
              className={loading ? 'btn-secondary' : 'btn-primary'}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: '140px',
                justifyContent: 'center'
              }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{
                    width: '16px',
                    height: '16px',
                    margin: '0'
                  }}></div>
                  Saving...
                </>
              ) : (
                <>
                  💾 Save Lead
                </>
              )}
            </button>
          </div>
        </form>

        {/* Form Tips */}
        <div style={{
          marginTop: '32px',
          padding: '20px',
          background: 'rgba(102, 126, 234, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(102, 126, 234, 0.1)'
        }}>
          <h4 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#667eea',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            💡 Quick Tips
          </h4>
          <ul style={{
            fontSize: '13px',
            color: '#6b7280',
            lineHeight: '1.6',
            paddingLeft: '16px',
            margin: 0
          }}>
            <li>Required fields are marked with an asterisk (*)</li>
            <li>BHK field appears automatically for Apartment and Villa properties</li>
            <li>Budget amounts should be entered in Indian Rupees (INR)</li>
            <li>Use tags to categorize leads for better organization</li>
            <li>All changes are tracked and visible in the lead history</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
