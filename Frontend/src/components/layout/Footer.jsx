import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="app-footer" style={{
      background: 'white',
      borderTop: '1px solid #e2e8f0',
      padding: '32px 24px 20px 24px',
      marginTop: 'auto',
      color: '#475569',
      fontSize: '0.875rem'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '32px',
        marginBottom: '24px'
      }}>
        {/* Brand Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0d9488, #0f766e)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700
            }}>
              CT
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>CARETRACK</span>
          </div>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem', lineHeight: '1.4' }}>
            Patient Follow-up Risk Predictor<br />
            <strong>Better follow-up. Better outcomes.</strong>
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#0f172a', fontWeight: 700 }}>
            Quick Links
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><Link to="/patients" style={{ color: '#64748b', textDecoration: 'none' }}>Patients</Link></li>
            <li><Link to="/appointments" style={{ color: '#64748b', textDecoration: 'none' }}>Appointments</Link></li>
            <li><Link to="/risk-prediction" style={{ color: '#64748b', textDecoration: 'none' }}>Risk Prediction</Link></li>
            <li><Link to="/reports" style={{ color: '#64748b', textDecoration: 'none' }}>Reports</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#0f172a', fontWeight: 700 }}>
            Support
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><Link to="/help" style={{ color: '#64748b', textDecoration: 'none' }}>Help Center</Link></li>
            <li><Link to="/help#docs" style={{ color: '#64748b', textDecoration: 'none' }}>Documentation</Link></li>
            <li><Link to="/help#contact" style={{ color: '#64748b', textDecoration: 'none' }}>Contact Support</Link></li>
          </ul>
        </div>

        {/* Legal & Security */}
        <div>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#0f172a', fontWeight: 700 }}>
            Legal & Security
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><span style={{ color: '#64748b' }}>Privacy Policy</span></li>
            <li><span style={{ color: '#64748b' }}>Terms of Service</span></li>
            <li><span style={{ color: '#64748b' }}>Data Security & Compliance</span></li>
            <li><Link to="/audit-logs" style={{ color: '#64748b', textDecoration: 'none' }}>Audit Policy</Link></li>
          </ul>
        </div>
      </div>

      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        borderTop: '1px solid #f1f5f9',
        paddingTop: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        color: '#94a3b8',
        fontSize: '0.75rem'
      }}>
        <div>© 2026 CareTrack Health Systems. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>Healthcare Operations + Predictive Analytics</span>
          <span>v1.0</span>
        </div>
      </div>
    </footer>
  );
}
