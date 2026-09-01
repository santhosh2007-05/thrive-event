import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ role }) {
  const getNavItems = () => {
    if (role === 'Admin') {
      return [
        { label: 'Admin Command Center', path: '/dashboard' },
        { label: 'Patients Management', path: '/patients' },
        { label: 'Risk Predictions Engine', path: '/risk-prediction' },
        { label: 'Appointments Calendar', path: '/appointments' },
        { label: 'Notifications Center', path: '/notifications' },
        { label: 'Reports & Analytics', path: '/reports' },
        { label: 'User Roles & Access', path: '/users' },
        { label: 'System Audit Logs', path: '/audit-logs' },
        { label: 'System Preferences', path: '/settings' },
        { label: 'Help & Docs', path: '/help' }
      ];
    }

    if (role === 'Doctor') {
      return [
        { label: '360° Doctor Portal', path: '/doctor-dashboard' },
        { label: 'My Patients Caseload', path: '/patients' },
        { label: 'Risk Predictions', path: '/risk-prediction' },
        { label: 'Appointments Schedule', path: '/appointments' },
        { label: 'Clinical Reports', path: '/reports' },
        { label: 'Settings', path: '/settings' },
        { label: 'Help Center', path: '/help' }
      ];
    }

    if (role === 'Nurse') {
      return [
        { label: 'Nurse Intervention Desk', path: '/nurse-dashboard' },
        { label: 'Patients List', path: '/patients' },
        { label: 'Follow-up Risk Alerts', path: '/risk-prediction' },
        { label: 'Appointments Calendar', path: '/appointments' },
        { label: 'Outreach Notifications', path: '/notifications' },
        { label: 'Settings', path: '/settings' },
        { label: 'Help Center', path: '/help' }
      ];
    }

    // Patient Role
    return [
      { label: 'My Patient Portal', path: '/patients/P-10234' },
      { label: 'My Appointments', path: '/appointments' },
      { label: 'My Notifications', path: '/notifications' },
      { label: 'Accessibility Settings', path: '/settings' },
      { label: 'Support & Help', path: '/help' }
    ];
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    window.location.href = '/login';
  };

  return (
    <aside style={{
      width: '240px',
      background: 'var(--bg-surface)',
      color: 'var(--text-main)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      boxSizing: 'border-box',
      borderRight: '1px solid var(--border-color)',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      height: '100vh',
      overflowY: 'auto',
      zIndex: 100,
      transition: 'background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease'
    }}>
      {/* Brand Header */}
      <div style={{ paddingBottom: '20px', borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--bg-highlight)',
            color: 'var(--primary-accent)',
            border: '1px solid var(--border-focus)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.9rem'
          }}>
            CT
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)', letterSpacing: '-0.3px', display: 'block' }}>
              CareTrack
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--primary-accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {role} Portal
            </span>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              padding: '10px 14px',
              borderRadius: '12px',
              color: isActive ? 'var(--primary-accent)' : 'var(--text-muted)',
              background: isActive ? 'var(--bg-highlight)' : 'transparent',
              border: isActive ? '1px solid var(--border-focus)' : '1px solid transparent',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: isActive ? 700 : 500,
              transition: 'all 0.15s ease'
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer with Colorful Round Logout Button */}
      <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #e11d48, #be123c)',
            color: '#ffffff',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '30px',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(225, 29, 72, 0.25)',
            transition: 'all 0.2s ease'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          Active Role: <strong style={{ color: 'var(--text-main)' }}>{role}</strong>
        </div>
      </div>
    </aside>
  );
}
