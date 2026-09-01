import React, { useState, useEffect } from 'react';
import { MOCK_PATIENTS } from '../../services/mockDataService';
import { useNavigate } from 'react-router-dom';
import smsService, { FORMATTED_PHONE_NUMBER } from '../../services/smsService';

export default function Header({ currentRole, onRoleChange, notificationsCount, onToggleNotifications, user, onLogout, darkMode, onToggleDarkMode }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [smsText, setSmsText] = useState('');
  const [smsRecipient, setSmsRecipient] = useState('Ramesh Kumar (P-10234)');
  const [toastMsg, setToastMsg] = useState('');
  const [sentSmsList, setSentSmsList] = useState(smsService.getSentMessages());

  useEffect(() => {
    const unsub = smsService.subscribe(() => {
      setSentSmsList(smsService.getSentMessages());
    });
    return () => unsub();
  }, []);

  const handleRoleSelect = (e) => {
    const newRole = e.target.value;
    onRoleChange(newRole);

    let targetPath = '/dashboard';
    if (newRole === 'Admin') targetPath = '/dashboard';
    else if (newRole === 'Doctor') targetPath = '/doctor-dashboard';
    else if (newRole === 'Nurse') targetPath = '/nurse-dashboard';
    else if (newRole === 'Patient') targetPath = '/patients/P-10234';

    navigate(targetPath);
  };

  const handleSendSmsSubmit = (e) => {
    e.preventDefault();
    const { smsEntry, nativeSmsUri } = smsService.sendSMS({
      to: FORMATTED_PHONE_NUMBER,
      patientName: smsRecipient.split(' ')[0],
      customBody: smsText,
      senderRole: currentRole
    });

    setToastMsg(`Real-time SMS Dispatched to ${FORMATTED_PHONE_NUMBER}!`);
    setShowSmsModal(false);
    setSmsText('');
    setTimeout(() => setToastMsg(''), 4000);

    window.location.href = nativeSmsUri;
  };

  const searchResults = searchQuery.trim()
    ? MOCK_PATIENTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: '16px',
      marginBottom: '20px',
      borderBottom: '1px solid var(--border-color)',
      gap: '16px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Toast Alert */}
      {toastMsg && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#059669', color: 'white', padding: '12px 24px', borderRadius: '30px', fontWeight: 700, zIndex: 3000, boxShadow: '0 10px 30px rgba(5,150,105,0.3)' }}>
          ✓ {toastMsg}
        </div>
      )}

      {/* 1. Left Title Block */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          HOSPITAL RISK & FOLLOW-UP PLATFORM
        </div>
        <h2 style={{ margin: '2px 0 0 0', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.3px', whitespace: 'nowrap' }}>
          CareTrack Operations
        </h2>
      </div>

      {/* 2. Middle Search Bar */}
      <div style={{ flex: '1 1 240px', maxWidth: '340px', position: 'relative' }}>
        <div
          onClick={() => setShowSearchModal(true)}
          style={{
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-color)',
            borderRadius: '30px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>Search patients, records...</span>
        </div>
      </div>

      {/* 3. Right Single Horizontal Action Tools Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {/* DARK MODE TOGGLE BUTTON */}
        <button
          onClick={onToggleDarkMode}
          style={{
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flexShrink: 0
          }}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* Real-time SMS Pill Button */}
        <button
          onClick={() => setShowSmsModal(true)}
          style={{
            background: 'var(--bg-highlight)',
            border: '1px solid var(--border-focus)',
            color: 'var(--primary-accent)',
            padding: '5px 12px',
            borderRadius: '30px',
            fontWeight: 700,
            fontSize: '0.78rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
          title="Send Real-Time SMS to 7598357132"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>SMS ({FORMATTED_PHONE_NUMBER})</span>
          <span style={{ background: 'var(--primary-accent)', color: 'white', borderRadius: '50%', padding: '1px 5px', fontSize: '0.68rem' }}>
            {sentSmsList.length}
          </span>
        </button>

        {/* Role Switcher Dropdown Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', padding: '3px 10px', borderRadius: '30px', flexShrink: 0 }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Role:</span>
          <select
            value={currentRole}
            onChange={handleRoleSelect}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-main)',
              fontWeight: 800,
              fontSize: '0.78rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="Admin">Admin</option>
            <option value="Doctor">Doctor</option>
            <option value="Nurse">Nurse</option>
            <option value="Patient">Patient</option>
          </select>
        </div>

        {/* Notifications Bell */}
        <button
          onClick={onToggleNotifications}
          style={{
            position: 'relative',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-color)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-main)',
            flexShrink: 0
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {notificationsCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '1px',
              right: '1px',
              background: 'var(--danger-color)',
              color: 'white',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              fontSize: '0.65rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {notificationsCount}
            </span>
          )}
        </button>

        {/* User Avatar Chip + Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', padding: '3px 6px 3px 10px', borderRadius: '30px', flexShrink: 0 }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'var(--primary-accent)',
            color: 'white',
            fontWeight: 800,
            fontSize: '0.7rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {user?.name ? user.name[0] : 'U'}
          </div>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)' }}>
            {user?.name || 'User'}
          </span>

          <button
            onClick={onLogout}
            style={{
              background: 'var(--danger-soft)',
              border: '1px solid var(--danger-color)',
              color: 'var(--danger-color)',
              padding: '4px 10px',
              borderRadius: '30px',
              fontWeight: 700,
              fontSize: '0.72rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Logout"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Real-time SMS Dispatcher Modal & Live History */}
      {showSmsModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <h3>Dispatch Real-Time SMS — {FORMATTED_PHONE_NUMBER}</h3>
              <button className="modal-close-btn" onClick={() => setShowSmsModal(false)}>✕</button>
            </div>

            <form className="modal-form" onSubmit={handleSendSmsSubmit}>
              <div style={{ background: 'var(--bg-highlight)', padding: '12px', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--primary-accent)', marginBottom: '12px' }}>
                Target Operational Mobile: <strong>{FORMATTED_PHONE_NUMBER}</strong><br />
                Gateway Status: <strong style={{ color: 'var(--primary-accent)' }}>Live Cross-Panel Real-Time Sync Active</strong>
              </div>

              <div className="form-group">
                <label>Select Patient</label>
                <select
                  className="form-control"
                  value={smsRecipient}
                  onChange={(e) => setSmsRecipient(e.target.value)}
                >
                  {MOCK_PATIENTS.map(p => (
                    <option key={p.id} value={`${p.name} (${p.id})`}>
                      {p.name} ({p.id}) — {p.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>SMS Message Body</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Enter message text to send to 7598357132..."
                  value={smsText}
                  onChange={(e) => setSmsText(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                  onClick={() => setSmsText(`CareTrack Reminder: Hello ${smsRecipient.split(' ')[0]}, your Cardiology follow-up visit is scheduled for 28 Sep 2026 at 10:30 AM with Dr. Ankit Mehta. Please confirm by replying or calling ${FORMATTED_PHONE_NUMBER}.`)}
                >
                  + Preset: 24h Reminder
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                  onClick={() => setSmsText(`CareTrack Confirmed: Hello ${smsRecipient.split(' ')[0]}, your hospital visit has been successfully CONFIRMED. Contact ${FORMATTED_PHONE_NUMBER} for assistance.`)}
                >
                  + Preset: Visit Confirmed
                </button>
              </div>

              {/* Live Sent SMS History List */}
              <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                  Recent Real-Time Sent SMS Log ({sentSmsList.length}):
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                  {sentSmsList.map(s => (
                    <div key={s.id} style={{ background: 'var(--bg-subtle)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.78rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                        <span>To: <strong>{s.to}</strong> ({s.patientName})</span>
                        <span>{s.timestamp}</span>
                      </div>
                      <div style={{ color: 'var(--text-main)', fontWeight: 500, marginTop: '2px' }}>"{s.message}"</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: '16px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowSmsModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  Dispatch SMS ({FORMATTED_PHONE_NUMBER})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      {showSearchModal && (
        <div className="modal-backdrop" onClick={() => setShowSearchModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3>Search Patient Records & Follow-ups</h3>
              <button className="modal-close-btn" onClick={() => setShowSearchModal(false)}>✕</button>
            </div>

            <input
              type="text"
              className="search-input"
              placeholder="Type patient name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              style={{ marginBottom: '16px' }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
              {searchResults.length > 0 ? (
                searchResults.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setShowSearchModal(false);
                      navigate(`/patients/${p.id}`);
                    }}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{p.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {p.id} • {p.department}</div>
                    </div>
                    <span className="status-badge active">{p.risk.riskScore}% Risk</span>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-light)', padding: '20px', fontSize: '0.85rem' }}>
                  {searchQuery ? 'No matching patient record found.' : 'Type a name or ID to search...'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
