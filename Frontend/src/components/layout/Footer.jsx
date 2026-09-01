import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import batteryService from '../../services/batteryService';

export default function Footer() {
  const [batteryState, setBatteryState] = useState({ level: 85, isCharging: false });
  const [batteryAlertMsg, setBatteryAlertMsg] = useState('');

  useEffect(() => {
    const unsubscribe = batteryService.subscribe((data) => {
      if (data.level !== undefined) {
        setBatteryState({ level: data.level, isCharging: data.isCharging });
      }
      if (data.alert) {
        setBatteryAlertMsg(data.alert.message);
        setTimeout(() => setBatteryAlertMsg(''), 6000);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <footer style={{
      background: 'var(--bg-surface)',
      color: 'var(--text-main)',
      borderTop: '1px solid var(--border-color)',
      padding: '40px 24px 24px 24px',
      marginTop: '40px',
      fontSize: '0.85rem'
    }}>
      {/* Battery Low Alert Banner */}
      {batteryAlertMsg && (
        <div style={{
          background: 'linear-gradient(135deg, #e11d48, #be123c)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '12px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 700,
          boxShadow: '0 4px 15px rgba(225, 29, 72, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="6" width="18" height="12" rx="2" />
              <line x1="23" y1="11" x2="23" y2="13" />
            </svg>
            <span>{batteryAlertMsg}</span>
          </div>
          <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px' }}>
            Auto SMS Dispatched
          </span>
        </div>
      )}

      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '32px',
        paddingBottom: '32px',
        borderBottom: '1px solid var(--border-color)'
      }}>
        {/* Column 1: Hospital Branding */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--primary-accent)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.85rem'
            }}>
              CT
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>
              CareTrack Health
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.5', margin: 0, fontSize: '0.8rem' }}>
            AI-Assisted Outpatient Follow-up Risk Prediction & Transparent Clinical Decision Support System.
          </p>

          {/* Battery Status Indicator */}
          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={batteryState.level <= 15 ? '#e11d48' : '#059669'} strokeWidth="2">
              <rect x="2" y="7" width="16" height="10" rx="2" />
              <line x1="20" y1="11" x2="20" y2="13" />
            </svg>
            <span>Device Battery: <strong style={{ color: batteryState.level <= 15 ? '#e11d48' : 'var(--text-main)' }}>{batteryState.level}%</strong> {batteryState.isCharging ? '(Charging)' : ''}</span>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700 }}>
            System Portals
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
            <Link to="/patients" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Patients Directory</Link>
            <Link to="/risk-prediction" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>ML Risk Predictions Engine</Link>
            <Link to="/ml-test" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Interactive ML Sandbox</Link>
            <Link to="/appointments" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Appointments Calendar</Link>
            <Link to="/notifications" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Notifications & Alerts</Link>
          </div>
        </div>

        {/* Column 3: Operational Support */}
        <div>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700 }}>
            Operational Contact
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <div>📞 SMS & Voice Line: <strong style={{ color: 'var(--primary-accent)' }}>+91 7598357132</strong></div>
            <div>✉️ Clinical Support: <strong>support@caretrack.health</strong></div>
            <div>📍 Region: <strong>Chennai, Tamil Nadu, India</strong></div>
            <div>🕒 Operating Hours: <strong>24/7 Clinical Support</strong></div>
          </div>
        </div>

        {/* Column 4: Compliance & Certifications */}
        <div>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700 }}>
            Compliance & Security
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <div style={{ background: 'var(--bg-subtle)', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              🔒 <strong>Patient Data Isolated</strong> (Role Scoped)
            </div>
            <div style={{ background: 'var(--bg-subtle)', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              🧠 <strong>scikit-learn RandomForest v2.1</strong>
            </div>
            <div style={{ background: 'var(--bg-subtle)', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              ⚡ <strong>Battery Safeguard Alert System Active</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Battery Simulator Bar */}
      <div style={{
        maxWidth: '1280px',
        margin: '16px auto 0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        color: 'var(--text-muted)',
        fontSize: '0.78rem'
      }}>
        <div>
          © 2026 CareTrack Health. All rights reserved. Platform Version 2.4.0
        </div>

        {/* Presentation Battery Threshold Tester */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontWeight: 600 }}>Test Battery Alerts:</span>
          <button
            onClick={() => batteryService.simulateBatteryDrop(15)}
            style={{ padding: '3px 8px', fontSize: '0.7rem', borderRadius: '4px', border: '1px solid #d97706', background: 'var(--warning-soft)', color: '#d97706', cursor: 'pointer', fontWeight: 700 }}
          >
            15% Test
          </button>
          <button
            onClick={() => batteryService.simulateBatteryDrop(10)}
            style={{ padding: '3px 8px', fontSize: '0.7rem', borderRadius: '4px', border: '1px solid #e11d48', background: 'var(--danger-soft)', color: '#e11d48', cursor: 'pointer', fontWeight: 700 }}
          >
            10% Test
          </button>
          <button
            onClick={() => batteryService.simulateBatteryDrop(5)}
            style={{ padding: '3px 8px', fontSize: '0.7rem', borderRadius: '4px', border: '1px solid #be123c', background: '#fef2f2', color: '#be123c', cursor: 'pointer', fontWeight: 700 }}
          >
            5% Test
          </button>
          <button
            onClick={() => batteryService.simulateBatteryDrop(2)}
            style={{ padding: '3px 8px', fontSize: '0.7rem', borderRadius: '4px', border: '1px solid #881337', background: '#9f1239', color: '#ffffff', cursor: 'pointer', fontWeight: 700 }}
          >
            2% Emergency
          </button>
        </div>
      </div>
    </footer>
  );
}
