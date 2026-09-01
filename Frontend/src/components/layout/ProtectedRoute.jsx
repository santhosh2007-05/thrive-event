import React from 'react';
import { Link } from 'react-router-dom';

export default function ProtectedRoute({ role, allowedRoles, children }) {
  // ADMIN HAS UNRESTRICTED FULL ACCESS TO ALL MODULES
  const isAllowed = role === 'Admin' || (allowedRoles && allowedRoles.includes(role));

  if (!isAllowed) {
    return (
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--danger-soft)',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center',
        maxWidth: '540px',
        margin: '40px auto',
        boxShadow: 'var(--shadow-soft)'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--danger-soft)',
          color: 'var(--danger-color)',
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

        <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', margin: '0 0 8px 0', fontWeight: 800 }}>
          Access Restricted
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 24px 0' }}>
          This module is restricted to <strong>{allowedRoles ? allowedRoles.join(', ') : 'Staff'}</strong> roles. Your current session role is <strong>{role}</strong>.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link to="/" className="btn-primary">
            Return to My Portal
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
