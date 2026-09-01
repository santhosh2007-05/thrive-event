import React, { useState, createContext, useContext } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { MOCK_NOTIFICATIONS } from '../../services/mockDataService';
import audioService from '../../services/audioService';

export const RoleContext = createContext({ role: 'Admin' });
export const useRole = () => useContext(RoleContext);

export default function AppShell({ children, role, onRoleChange, user, onLogout }) {
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);
  const [notificationsList, setNotificationsList] = useState(MOCK_NOTIFICATIONS);
  const [darkMode, setDarkMode] = useState(false);
  const [accessibilityMode, setAccessibilityMode] = useState({
    largeText: false,
    highContrast: false
  });

  // Panel-Specific Notification Drawer Filtering
  const roleNotifications = notificationsList.filter(n => {
    if (role === 'Patient') {
      return n.patientId === 'P-10234' || n.patientName === 'Ramesh Kumar';
    }
    if (role === 'Doctor') {
      return ['P-10234', 'P-10235', 'P-10236', 'P-10237'].includes(n.patientId) || n.category === 'Clinical Alert';
    }
    if (role === 'Nurse') {
      return n.category === 'High Risk' || n.category === 'Missed Follow-up' || n.category === 'Upcoming';
    }
    return true;
  });

  const unreadCount = roleNotifications.filter(n => !n.isRead).length;

  const handleDismissNotification = (id) => {
    setNotificationsList(prev => prev.filter(n => n.id !== id));
  };

  const handleTestSound = (type) => {
    if (type === '24h') audioService.play24hReminder();
    else if (type === '2h') audioService.play2hReminder();
    else if (type === '30m') audioService.play30mReminder();
    else if (type === '10m') audioService.play10mReminder();
    else if (type === 'missed') audioService.playMissedAlert();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <RoleContext.Provider value={{ role }}>
      <div className={`app-shell-root ${darkMode ? 'dark-mode' : ''} ${accessibilityMode.highContrast ? 'high-contrast-mode' : ''}`} style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        color: 'var(--text-main)',
        fontSize: accessibilityMode.largeText ? '18px' : '15px',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}>
        {/* Fixed Sidebar for ALL Roles */}
        <Sidebar role={role} />

        {/* Main Content Area (marginLeft: 240px unconditionally for ALL roles) */}
        <div style={{
          flex: 1,
          marginLeft: '240px',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflowX: 'hidden'
        }}>
          <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
            {/* Header */}
            <Header
              currentRole={role}
              onRoleChange={onRoleChange}
              notificationsCount={unreadCount}
              onToggleNotifications={() => setShowNotificationsDrawer(!showNotificationsDrawer)}
              user={user}
              onLogout={onLogout}
              darkMode={darkMode}
              onToggleDarkMode={toggleDarkMode}
            />

            {/* Quick Accessibility Banner Toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-surface)',
              padding: '8px 16px',
              borderRadius: '30px',
              marginBottom: '16px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-soft)',
              fontSize: '0.8rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 700, color: 'var(--primary-accent)' }}>ACCESSIBILITY CONTROLS:</span>
                <span>Patient & Accessibility Preferences</span>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={accessibilityMode.largeText}
                    onChange={(e) => setAccessibilityMode(prev => ({ ...prev, largeText: e.target.checked }))}
                  />
                  Large Text
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={accessibilityMode.highContrast}
                    onChange={(e) => setAccessibilityMode(prev => ({ ...prev, highContrast: e.target.checked }))}
                  />
                  High Contrast Mode
                </label>
              </div>
            </div>

            {/* Page Content */}
            <main style={{ minHeight: 'calc(100vh - 280px)' }}>
              {children}
            </main>
          </div>

          {/* Footer */}
          <Footer />
        </div>

        {/* Notification Drawer Modal */}
        {showNotificationsDrawer && (
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '380px',
            background: 'var(--bg-surface)',
            boxShadow: '-4px 0 25px rgba(0,0,0,0.25)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideLeft 0.25s ease-out',
            color: 'var(--text-main)',
            borderLeft: '1px solid var(--border-color)'
          }}>
            <div style={{
              padding: '18px 20px',
              background: 'var(--bg-subtle)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border-color)'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Notification Center ({role} View)</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Operations & Missed Follow-ups</span>
              </div>
              <button
                onClick={() => setShowNotificationsDrawer(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Audio Test Bar inside drawer */}
            <div style={{ background: 'var(--bg-subtle)', padding: '10px 16px', borderBottom: '1px solid var(--border-color)', fontSize: '0.75rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Test Audio Operations Tones:</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button onClick={() => handleTestSound('24h')} style={{ padding: '3px 8px', fontSize: '0.7rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-main)', cursor: 'pointer' }}>24h Tone</button>
                <button onClick={() => handleTestSound('2h')} style={{ padding: '3px 8px', fontSize: '0.7rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-main)', cursor: 'pointer' }}>2h Tone</button>
                <button onClick={() => handleTestSound('30m')} style={{ padding: '3px 8px', fontSize: '0.7rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-main)', cursor: 'pointer' }}>30m Tone</button>
                <button onClick={() => handleTestSound('10m')} style={{ padding: '3px 8px', fontSize: '0.7rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-main)', cursor: 'pointer' }}>10m Alert</button>
                <button onClick={() => handleTestSound('missed')} style={{ padding: '3px 8px', fontSize: '0.7rem', borderRadius: '4px', border: '1px solid var(--danger-color)', background: 'var(--danger-soft)', color: 'var(--danger-color)', cursor: 'pointer' }}>Missed Tone</button>
              </div>
            </div>

            {/* Notification List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {roleNotifications.length > 0 ? (
                roleNotifications.map(n => (
                  <div key={n.id} style={{
                    border: n.severity === 'danger' ? '1px solid var(--danger-color)' : '1px solid var(--border-color)',
                    background: 'var(--bg-surface)',
                    borderRadius: '12px',
                    padding: '14px',
                    position: 'relative'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span className={`status-badge ${n.severity === 'danger' ? 'inactive' : 'reschedule_requested'}`}>
                        {n.category}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{n.timestamp}</span>
                    </div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: 700 }}>{n.title}</h4>
                    <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{n.message}</p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        onClick={() => {
                          setShowNotificationsDrawer(false);
                          window.location.href = `/patients/${n.patientId}`;
                        }}
                        style={{
                          background: 'var(--primary-accent)',
                          color: 'white',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {n.actionRequired}
                      </button>
                      <button
                        onClick={() => handleDismissNotification(n.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-light)', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-light)' }}>
                  All clear! No active notifications for this portal.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </RoleContext.Provider>
  );
}
