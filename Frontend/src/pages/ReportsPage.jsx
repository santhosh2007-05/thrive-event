import React, { useState } from 'react';
import audioService from '../services/audioService';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('completion');
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    audioService.play2hReminder();
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMsg && (
        <div style={{ background: '#059669', color: 'white', padding: '12px 20px', borderRadius: '30px', fontWeight: 600 }}>
          ✓ {toastMsg}
        </div>
      )}

      {/* Header Banner with Curated Healthcare Analytics Photography */}
      <div className="full-width-card" style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        minHeight: '160px',
        display: 'flex',
        alignItems: 'center',
        padding: '32px',
        color: 'white',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'linear-gradient(90deg, rgba(24,24,22,0.92) 0%, rgba(24,24,22,0.65) 100%), url(https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1
        }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              Operational Intelligence & Reporting
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0', color: 'white' }}>
              Operational Analytics & Reports
            </h1>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
              Hospital follow-up statistics, risk distribution, and staff intervention metrics
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" style={{ background: '#ffffff', color: '#181816' }} onClick={() => showToast('CSV Report Downloaded')}>
              Export CSV
            </button>
            <button className="btn-primary" onClick={() => showToast('PDF Analytics Report Generated')}>
              Export PDF Report
            </button>
          </div>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { id: 'completion', label: 'Follow-up Completion Report' },
          { id: 'missed', label: 'Missed Appointment Analytics' },
          { id: 'risk', label: 'Risk Distribution Breakdown' },
          { id: 'staff', label: 'Staff Intervention Report' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id)}
            className={`tab-btn ${reportType === tab.id ? 'active' : ''}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Content Grid */}
      <div className="dashboard-grid">
        <div className="full-width-card">
          <div className="card-header-row">
            <div className="card-section-title">
              Department Risk & Attendance Breakdown
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            {[
              { dept: 'Cardiology', completion: '89.2%', highRiskCount: 42, color: 'var(--danger-color)' },
              { dept: 'Orthopedics', completion: '84.5%', highRiskCount: 38, color: 'var(--warning-color)' },
              { dept: 'Endocrinology', completion: '86.0%', highRiskCount: 29, color: 'var(--warning-color)' },
              { dept: 'Dermatology', completion: '94.1%', highRiskCount: 8, color: 'var(--primary-accent)' },
              { dept: 'Neurology', completion: '88.0%', highRiskCount: 15, color: 'var(--info-color)' }
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-subtle)', padding: '12px 16px', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{row.dept}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>High-Risk Patients: {row.highRiskCount}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>{row.completion}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary-accent)', fontWeight: 600 }}>Completion Rate</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="full-width-card">
          <div className="card-header-row">
            <div className="card-section-title">
              Staff Outreach Conversion Rates
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
            <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--info-color)', fontWeight: 700 }}>PHONE OUTREACH SUCCESS</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)' }}>78.4%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Patients reached who confirmed visit date</div>
            </div>

            <div style={{ background: 'var(--bg-highlight)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-focus)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary-accent)', fontWeight: 700 }}>RE-ENGAGEMENT AFTER MISSED VISIT</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)' }}>64.2%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rescheduled within 48 hours of alert</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
