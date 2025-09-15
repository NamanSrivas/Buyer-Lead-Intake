export default function Home() {
  return (
    <div className="main-content">
      <div className="container">
        {/* Modern Header */}
        <div className="page-header fade-in">
          <h1 className="page-title">
            🏠 Buyer Lead Intake
          </h1>
          <p className="page-subtitle">
            Modern lead management system with powerful analytics
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-3 fade-in" style={{marginBottom: '48px'}}>
          <a href="/buyers" className="modern-card" style={{textDecoration: 'none', color: 'inherit'}}>
            <div style={{padding: '32px', textAlign: 'center'}}>
              <div style={{
                fontSize: '3rem', 
                marginBottom: '16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                📋
              </div>
              <h3 style={{
                fontSize: '1.5rem', 
                fontWeight: '600', 
                marginBottom: '12px',
                color: '#2d3748'
              }}>
                All Leads
              </h3>
              <p style={{
                color: '#6b7280', 
                lineHeight: '1.6',
                fontSize: '1rem'
              }}>
                View, search, and manage all your buyer leads with advanced filtering and real-time updates
              </p>
            </div>
          </a>
          
          <a href="/buyers/new" className="modern-card" style={{textDecoration: 'none', color: 'inherit'}}>
            <div style={{padding: '32px', textAlign: 'center'}}>
              <div style={{
                fontSize: '3rem', 
                marginBottom: '16px',
                background: 'linear-gradient(135deg, #51cf66 0%, #40c057 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                ➕
              </div>
              <h3 style={{
                fontSize: '1.5rem', 
                fontWeight: '600', 
                marginBottom: '12px',
                color: '#2d3748'
              }}>
                New Lead
              </h3>
              <p style={{
                color: '#6b7280', 
                lineHeight: '1.6',
                fontSize: '1rem'
              }}>
                Create new buyer leads with smart validation and conditional form fields
              </p>
            </div>
          </a>
          
          <a href="/import" className="modern-card" style={{textDecoration: 'none', color: 'inherit'}}>
            <div style={{padding: '32px', textAlign: 'center'}}>
              <div style={{
                fontSize: '3rem', 
                marginBottom: '16px',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                📤
              </div>
              <h3 style={{
                fontSize: '1.5rem', 
                fontWeight: '600', 
                marginBottom: '12px',
                color: '#2d3748'
              }}>
                Import CSV
              </h3>
              <p style={{
                color: '#6b7280', 
                lineHeight: '1.6',
                fontSize: '1rem'
              }}>
                Bulk import leads from CSV with comprehensive validation and error reporting
              </p>
            </div>
          </a>
        </div>

        {/* Stats Dashboard */}
        <div className="modern-card slide-up" style={{marginBottom: '48px'}}>
          <div style={{padding: '40px'}}>
            <div style={{textAlign: 'center', marginBottom: '32px'}}>
              <h2 style={{
                fontSize: '2rem', 
                fontWeight: '700', 
                marginBottom: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                📊 Analytics Dashboard
              </h2>
              <p style={{color: '#6b7280', fontSize: '1.1rem'}}>
                Real-time insights into your lead management performance
              </p>
            </div>
            
            <div className="grid grid-4">
              <div className="stat-card">
                <div className="stat-number">0</div>
                <div className="stat-label">Total Leads</div>
                <div style={{
                  marginTop: '8px', 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  background: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  📈 All Time
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-number" style={{
                  background: 'linear-gradient(135deg, #51cf66 0%, #40c057 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>0</div>
                <div className="stat-label">New Leads</div>
                <div style={{
                  marginTop: '8px', 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  background: 'rgba(81, 207, 102, 0.1)',
                  color: '#40c057',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  🆕 This Month
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-number" style={{
                  background: 'linear-gradient(135deg, #ffd43b 0%, #fab005 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>0</div>
                <div className="stat-label">In Progress</div>
                <div style={{
                  marginTop: '8px', 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  background: 'rgba(255, 212, 59, 0.1)',
                  color: '#fab005',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  ⏳ Active
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-number" style={{
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>0</div>
                <div className="stat-label">Converted</div>
                <div style={{
                  marginTop: '8px', 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  background: 'rgba(255, 107, 107, 0.1)',
                  color: '#ee5a52',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  🎯 Success
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="modern-card slide-up" style={{marginBottom: '48px'}}>
          <div style={{padding: '40px'}}>
            <div style={{textAlign: 'center', marginBottom: '32px'}}>
              <h2 style={{
                fontSize: '2rem', 
                fontWeight: '700', 
                marginBottom: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                ✨ Key Features
              </h2>
              <p style={{color: '#6b7280', fontSize: '1.1rem'}}>
                Everything you need for efficient lead management
              </p>
            </div>
            
            <div className="grid grid-2" style={{gap: '32px'}}>
              <div style={{display: 'flex', alignItems: 'flex-start', gap: '16px'}}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  flexShrink: 0
                }}>
                  🔍
                </div>
                <div>
                  <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px', color: '#2d3748'}}>
                    Smart Search & Filters
                  </h3>
                  <p style={{color: '#6b7280', lineHeight: '1.6'}}>
                    Real-time search with debounced input and advanced filtering by city, property type, status, and timeline
                  </p>
                </div>
              </div>
              
              <div style={{display: 'flex', alignItems: 'flex-start', gap: '16px'}}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #51cf66 0%, #40c057 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  flexShrink: 0
                }}>
                  ✅
                </div>
                <div>
                  <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px', color: '#2d3748'}}>
                    Smart Validation
                  </h3>
                  <p style={{color: '#6b7280', lineHeight: '1.6'}}>
                    Comprehensive form validation with conditional logic and real-time error feedback
                  </p>
                </div>
              </div>
              
              <div style={{display: 'flex', alignItems: 'flex-start', gap: '16px'}}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #ffd43b 0%, #fab005 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  flexShrink: 0
                }}>
                  📊
                </div>
                <div>
                  <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px', color: '#2d3748'}}>
                    CSV Import/Export
                  </h3>
                  <p style={{color: '#6b7280', lineHeight: '1.6'}}>
                    Bulk operations with row-by-row validation, error reporting, and filtered data export
                  </p>
                </div>
              </div>
              
              <div style={{display: 'flex', alignItems: 'flex-start', gap: '16px'}}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  flexShrink: 0
                }}>
                  📝
                </div>
                <div>
                  <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px', color: '#2d3748'}}>
                    Change History
                  </h3>
                  <p style={{color: '#6b7280', lineHeight: '1.6'}}>
                    Complete audit trail with detailed change tracking and timeline visualization
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="modern-card slide-up">
          <div style={{padding: '32px', textAlign: 'center'}}>
            <h3 style={{
              fontSize: '1.5rem', 
              fontWeight: '600', 
              marginBottom: '24px',
              color: '#2d3748'
            }}>
              🚀 Ready to get started?
            </h3>
            <p style={{color: '#6b7280', marginBottom: '32px', fontSize: '1.1rem'}}>
              Start managing your buyer leads with our powerful, intuitive system
            </p>
            <div style={{display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap'}}>
              <a href="/buyers/new" className="btn-primary">
                ➕ Create First Lead
              </a>
              <a href="/import" className="btn-secondary">
                📤 Import Data
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center', 
          marginTop: '64px', 
          paddingTop: '32px',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'rgba(255, 255, 255, 0.8)'
        }}>
          <p style={{fontSize: '1rem', fontWeight: '500'}}>
            🏆 Built with modern technologies for maximum efficiency
          </p>
          <p style={{fontSize: '0.9rem', marginTop: '8px', opacity: 0.7}}>
            Next.js • TypeScript • Modern CSS • Responsive Design
          </p>
        </div>
      </div>
    </div>
  );
}
