import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_NOTIFICATIONS } from '../services/mockDataService';
import audioService from '../services/audioService';
import { useRole } from '../components/layout/AppShell';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { role, user } = useRole();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('ALL');

  const showSoundToast = (type) => {
    if (type === '24h') audioService.play24hReminder();
    else if (type === '2h') audioService.play2hReminder();
    else if (type === '30m') audioService.play30mReminder();
    else if (type === '10m') audioService.play10mReminder();
    else if (type === 'missed') audioService.playMissedAlert();
  };

  const userName = (user && user.name ? user.name : 'Santhosh M').toLowerCase();
  const roleFiltered = notifications.filter(n => {
    if (role === 'Patient') {
      return n.patientName.toLowerCase().includes(userName) || n.patientId === 'P-10238' || n.patientId === 'P-10234';
    }
    if (role === 'Doctor') {
      return ['P-10234', 'P-10235', 'P-10236', 'P-10237', 'P-10238'].includes(n.patientId) || n.category === 'Clinical Alert';
    }
    if (role === 'Nurse') {
      return n.category === 'High Risk' || n.category === 'Missed Follow-up' || n.category === 'Upcoming';
    }
    return true;
  });

  const finalFiltered = roleFiltered.filter(n => {
    if (activeTab === 'HIGH_RISK') return n.category === 'High Risk';
    if (activeTab === 'MISSED') return n.category === 'Missed Follow-up';
    if (activeTab === 'UPCOMING') return n.category === 'Upcoming';
    return true;
  });

  const handleDismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
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
          backgroundImage: 'linear-gradient(90deg, rgba(24,24,22,0.92) 0%, rgba(24,24,22,0.65) 100%), url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1
        }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              Hospital Notifications Desk
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0', color: 'white' }}>
              {role === 'Patient' ? 'My Patient Notifications' : 'Outreach & Risk Alerts Notifications'}
            </h1>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
              {role === 'Patient' ? `Private alerts for ${user?.name || 'Santhosh M'}` : 'Real-time alert dispatches for high-risk patients and missed follow-ups'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: '30px', backdropFilter: 'blur(10px)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Audio Alerts:</span>
            <button onClick={() => showSoundToast('24h')} style={{ background: 'none', border: 'none', color: '#a7f3d0', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>24h</button>
            <button onClick={() => showSoundToast('2h')} style={{ background: 'none', border: 'none', color: '#a7f3d0', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>2h</button>
            <button onClick={() => showSoundToast('30m')} style={{ background: 'none', border: 'none', color: '#a7f3d0', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>30m</button>
            <button onClick={() => showSoundToast('missed')} style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>Missed</button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {[
          { id: 'ALL', label: 'All Notifications' },
          { id: 'HIGH_RISK', label: 'High Risk Alerts' },
          { id: 'MISSED', label: 'Missed Follow-ups' },
          { id: 'UPCOMING', label: 'Upcoming Visits' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {finalFiltered.length > 0 ? (
          finalFiltered.map((notif) => (
            <div
              key={notif.id}
              className="full-width-card"
              style={{
                borderLeft: notif.severity === 'danger' ? '6px solid var(--danger-color)' : '6px solid var(--warning-color)'
              }}
            >
              <div className="card-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className={`status-badge ${notif.severity === 'danger' ? 'inactive' : 'reschedule_requested'}`}>
                    {notif.category}
                  </span>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 700 }}>
                    {notif.title}
                  </h3>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {notif.timestamp}
                </div>
              </div>

              <p style={{ margin: '12px 0 16px 0', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                {notif.message}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Patient: <strong style={{ color: 'var(--text-main)' }}>{notif.patientName} ({notif.patientId})</strong>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    className="btn-primary"
                    style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                    onClick={() => navigate(`/patients/${notif.patientId}`)}
                  >
                    {notif.actionRequired}
                  </button>

                  <button
                    className="btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                    onClick={() => handleDismiss(notif.id)}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="full-width-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No notifications matching this tab.
          </div>
        )}
      </div>
    </div>
  );
}
