import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ role }) {
  const getNavItems = () => {
    if (role === 'Admin') {
      return [
        { label: 'Admin Command Center', path: '/dashboard' },
        { label: 'Patients Management', path: '/patients' },
        { label: 'Vehicle Management', path: '/vehicle-management' },
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
        { label: 'Vehicle Transport Desk', path: '/vehicle-management' },
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
        { label: 'Vehicle Transport Desk', path: '/vehicle-management' },
        { label: 'Follow-up Risk Alerts', path: '/risk-prediction' },
        { label: 'Appointments Calendar', path: '/appointments' },
        { label: 'Outreach Notifications', path: '/notifications' },
        { label: 'Settings', path: '/settings' },
        { label: 'Help Center', path: '/help' }
      ];
    }

    // Patient Role
    return [
      { label: 'My Patient Portal', path: '/patients/P-1001' },
      { label: 'Hospital Services & Vehicle', path: '/services' },
      { label: 'My Appointments', path: '/appointments' },
      { label: 'My Notifications', path: '/notifications' },
      { label: 'Accessibility Settings', path: '/settings' },
      { label: 'Support & Help', path: '/help' }
    ];
  };

  const navItems = getNavItems();

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
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', padding: '0 8px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #059669, #047857)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: '900',
          fontSize: '1.2rem',
          boxShadow: '0 4px 12px rgba(5, 150, 105, 0.4)'
        }}>
          C
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.3px' }}>CareTrack</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Hospital Follow-up AI</div>
        </div>
      </div>

      {/* Role Badge */}
      <div style={{
        background: 'var(--bg-subtle)',
        border: '1px solid var(--border-color)',
        padding: '8px 12px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '0.75rem'
      }}>
        <span style={{ color: 'var(--text-muted)' }}>Logged in as:</span><br />
        <strong style={{ color: 'var(--primary-accent)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{role} Role</strong>
      </div>

      {/* Navigation Items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              display: 'block',
              padding: '10px 14px',
              borderRadius: '8px',
              color: isActive ? 'var(--primary-accent)' : 'var(--text-main)',
              background: isActive ? 'var(--bg-highlight)' : 'transparent',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: isActive ? 700 : 500,
              transition: 'all 0.15s ease'
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Version Footer */}
      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-color)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
        CareTrack Hospital OS v2.4<br />
        Connected to Spring Boot API
      </div>
    </aside>
  );
}
