import React from 'react';
import { Link } from 'react-router-dom';

export default function ProtectedRoute({ role, allowedRoles, children }) {
  const isAllowed = allowedRoles.includes(role);

  if (!isAllowed) {
    return (
      <div style={{
        background: '#ffffff',
        border: '1px solid #fecdd3',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center',
        maxWidth: '540px',
        margin: '40px auto',
        boxShadow: '0 10px 30px rgba(220, 38, 38, 0.08)'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#fef2f2',
          color: '#dc2626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto'
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h3 style={{ fontSize: '1.4rem', color: '#0f172a', margin: '0 0 8px 0', fontWeight: 800 }}>
          Access Restricted
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 24px 0' }}>
          This module contains administrative healthcare data restricted to <strong>{allowedRoles.join(', ')}</strong> roles. Your current session role is <strong>{role}</strong>.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link to="/dashboard" className="btn-primary">
            Return to My Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
