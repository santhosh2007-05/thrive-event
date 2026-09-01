import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_NOTIFICATIONS, MOCK_PATIENTS } from '../services/mockDataService';
import audioService from '../services/audioService';
import { useRole } from '../components/layout/AppShell';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { role } = useRole();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [activeCallModalPatient, setActiveCallModalPatient] = useState(null);
  const [callOutcome, setCallOutcome] = useState('Answered');
  const [callNotes, setCallNotes] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Strict Panel-Specific Notification Scoping
  const scopedNotifications = notifications.filter(n => {
    if (role === 'Patient') {
      // Patient only sees notifications for own ID (P-10234)
      return n.patientId === 'P-10234' || n.patientName === 'Ramesh Kumar';
    }
    if (role === 'Doctor') {
      // Doctor sees clinical alerts and assigned patients (P-10234, P-10235, P-10236, P-10237)
      return ['P-10234', 'P-10235', 'P-10236', 'P-10237'].includes(n.patientId) || n.category === 'Clinical Alert';
    }
    if (role === 'Nurse') {
      // Nurse sees outreach call alerts, missed follow-ups, and reminders
      return n.category === 'High Risk' || n.category === 'Missed Follow-up' || n.category === 'Upcoming';
    }
    // Admin sees all system notifications
    return true;
  });

  const filteredNotifications = scopedNotifications.filter(n =>
    categoryFilter === 'ALL' || n.category.toUpperCase() === categoryFilter.toUpperCase()
  );

  const showToast = (msg) => {
    setToastMsg(msg);
    audioService.play2hReminder();
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleCallSubmit = (e) => {
    e.preventDefault();
    showToast(`Call outcome '${callOutcome}' logged for ${activeCallModalPatient.name}`);
    setActiveCallModalPatient(null);
    setCallNotes('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMsg && (
        <div style={{ background: '#059669', color: 'white', padding: '12px 20px', borderRadius: '30px', fontWeight: 600 }}>
          ✓ {toastMsg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
            {role === 'Patient' ? 'My Portal Reminders & Alerts' : 'Operations Notification Center'}
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {role === 'Patient' ? 'Real-time appointment reminders and hospital updates' : 'Real-time alerts for missed follow-ups, high-risk flags, and escalations'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn-secondary"
            onClick={() => audioService.play10mReminder()}
          >
            Test Alert Sound
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
              showToast('All notifications marked as read.');
            }}
          >
            Mark All Read
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { id: 'ALL', label: 'All Alerts' },
          { id: 'HIGH RISK', label: 'High Risk' },
          { id: 'MISSED FOLLOW-UP', label: 'Missed Follow-up' },
          { id: 'UPCOMING', label: 'Upcoming' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setCategoryFilter(tab.id)}
            className={`tab-btn ${categoryFilter === tab.id ? 'active' : ''}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Escalation Hierarchy Card */}
      {role !== 'Patient' && (
        <div className="importance-banner" style={{ background: 'var(--bg-highlight)', borderColor: 'var(--border-focus)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--primary-accent)' }}>
            <strong>Notification Escalation Protocol:</strong> T-24h (Reminder) &rarr; T-2h (Staff Alert) &rarr; T-30m (Two-Tone Alert) &rarr; T-10m (Urgent Alert) &rarr; Appointment Missed &rarr; Escalation to Nurse & Supervisor.
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((n) => {
            const patientObj = MOCK_PATIENTS.find(p => p.id === n.patientId) || MOCK_PATIENTS[0];
            return (
              <div
                key={n.id}
                className="full-width-card"
                style={{
                  borderLeft: n.severity === 'danger' ? '6px solid var(--danger-color)' : '6px solid var(--warning-color)',
                  background: 'var(--bg-surface)'
                }}
              >
                <div className="card-header-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className={`status-badge ${n.severity === 'danger' ? 'inactive' : 'reschedule_requested'}`}>
                      {n.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.timestamp}</span>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => prev.filter(item => item.id !== n.id))}
                    style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>

                <h3 style={{ margin: '8px 0 4px 0', fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 700 }}>
                  {n.title}
                </h3>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {n.message}
                </p>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {role !== 'Patient' && (
                    <a
                      href={`tel:${patientObj.phone}`}
                      className="btn-primary"
                      style={{ padding: '6px 14px', fontSize: '0.8rem', textDecoration: 'none' }}
                      onClick={() => setActiveCallModalPatient(patientObj)}
                    >
                      Call Phone ({patientObj.phone})
                    </a>
                  )}
                  <button
                    className="btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                    onClick={() => showToast(`SMS sent to ${n.patientName}`)}
                  >
                    Send Message
                  </button>
                  <button
                    className="btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                    onClick={() => navigate(`/patients/${n.patientId}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="full-width-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No active notifications for your role panel.
          </div>
        )}
      </div>

      {/* MODAL: Call Outcome Recording */}
      {activeCallModalPatient && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Record Call Outcome — {activeCallModalPatient.name}</h3>
              <button className="modal-close-btn" onClick={() => setActiveCallModalPatient(null)}>✕</button>
            </div>

            <form className="modal-form" onSubmit={handleCallSubmit}>
              <div style={{ background: 'var(--bg-subtle)', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Calling Phone: <strong>{activeCallModalPatient.phone}</strong><br />
                Patient ID: <strong>{activeCallModalPatient.id}</strong><br />
                <a href={`tel:${activeCallModalPatient.phone}`} style={{ color: 'var(--primary-accent)', fontWeight: 700, textDecoration: 'underline', marginTop: '6px', display: 'inline-block' }}>
                  Click to Redial ({activeCallModalPatient.phone})
                </a>
              </div>

              <div className="form-group">
                <label>Call Outcome *</label>
                <select
                  className="form-control"
                  value={callOutcome}
                  onChange={(e) => setCallOutcome(e.target.value)}
                >
                  <option value="Answered">[Answered] — Patient confirmed visit</option>
                  <option value="No Answer">[No Answer] — Left voicemail</option>
                  <option value="Wrong Number">[Wrong Number]</option>
                  <option value="Requested Reschedule">[Requested Reschedule]</option>
                  <option value="Patient Will Call Back">[Patient Will Call Back]</option>
                  <option value="Other">[Other]</option>
                </select>
              </div>

              <div className="form-group">
                <label>Intervention Notes</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Record outcome details..."
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setActiveCallModalPatient(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Call Outcome</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
