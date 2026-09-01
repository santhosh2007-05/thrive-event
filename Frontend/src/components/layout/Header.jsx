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
    else if (newRole === 'Patient') targetPath = '/patients/P-1001';

    navigate(targetPath);
  };

  const handleSendSmsSubmit = (e) => {
    e.preventDefault();
    const { nativeSmsUri } = smsService.sendSMS({
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
        <h2 style={{ margin: '2px 0 0 0', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>
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

        {/* Role Switcher Dropdown Pill with Explicit Dark Mode Option Text Colors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', padding: '3px 10px', borderRadius: '30px', flexShrink: 0 }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Role:</span>
          <select
            value={currentRole}
            onChange={handleRoleSelect}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              fontWeight: 800,
              fontSize: '0.78rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="Admin" style={{ background: darkMode ? '#1e293b' : '#ffffff', color: darkMode ? '#f8fafc' : '#0f172a' }}>Admin</option>
            <option value="Doctor" style={{ background: darkMode ? '#1e293b' : '#ffffff', color: darkMode ? '#f8fafc' : '#0f172a' }}>Doctor</option>
            <option value="Nurse" style={{ background: darkMode ? '#1e293b' : '#ffffff', color: darkMode ? '#f8fafc' : '#0f172a' }}>Nurse</option>
            <option value="Patient" style={{ background: darkMode ? '#1e293b' : '#ffffff', color: darkMode ? '#f8fafc' : '#0f172a' }}>Patient</option>
          </select>
        </div>

        {/* Notifications Bell */}
        <button
          onClick={onToggleNotifications}
          style={{
            position: 'relative',
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
            flexShrink: 0
          }}
          title="Open Notifications Drawer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {notificationsCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              background: '#e11d48',
              color: 'white',
              fontSize: '0.65rem',
              fontWeight: 800,
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--bg-surface)'
            }}>
              {notificationsCount}
            </span>
          )}
        </button>

        {/* Logged in User Badge & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '4px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0284c7, #0369a1)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.8rem'
          }}>
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: '1.1' }}>
              {user?.name || 'Staff User'}
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              {currentRole}
            </span>
          </div>
          <button
            onClick={onLogout}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              marginLeft: '4px',
              padding: '4px'
            }}
            title="Sign out"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Global Patient Search Modal */}
      {showSearchModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontWeight: 800 }}>Search Hospital Patients</h3>
              <button style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-main)' }} onClick={() => setShowSearchModal(false)}>✕</button>
            </div>

            <input
              type="text"
              className="form-control"
              placeholder="Type patient name (e.g., Santhosh, Shriakash)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              style={{ marginBottom: '16px' }}
            />

            <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {searchResults.length > 0 ? (
                searchResults.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setShowSearchModal(false);
                      navigate(`/patients/${p.id}`);
                    }}
                    style={{
                      padding: '10px 14px',
                      background: 'var(--bg-subtle)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{p.name} ({p.id})</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.department} • Doctor: {p.assignedDoctor}</div>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-accent)' }}>View Profile &rarr;</span>
                  </div>
                ))
              ) : searchQuery ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '16px' }}>No patients found.</div>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '16px' }}>Start typing to search 2,481 patient records...</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Real-time SMS Dispatch Modal */}
      {showSmsModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontWeight: 800 }}>Send Real-Time SMS Alert</h3>
              <button style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-main)' }} onClick={() => setShowSmsModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSendSmsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Destination Phone Number (Locked to Target Mobile)</label>
                <input type="text" className="form-control" value={FORMATTED_PHONE_NUMBER} disabled style={{ background: 'var(--bg-subtle)', fontWeight: 700 }} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Select Patient Context</label>
                <select className="form-control" value={smsRecipient} onChange={(e) => setSmsRecipient(e.target.value)}>
                  <option value="Santhosh M (P-1001)">Santhosh M (P-1001) - Cardiology</option>
                  <option value="Shriakash S (P-1002)">Shriakash S (P-1002) - Cardiology</option>
                  <option value="Prajan Soorya (P-1003)">Prajan Soorya (P-1003) - Orthopedics</option>
                  <option value="Rahul R (P-1004)">Rahul R (P-1004) - Endocrinology</option>
                  <option value="Pranesh T (P-1005)">Pranesh T (P-1005) - Dermatology</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>SMS Message Body *</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="e.g. CareTrack Alert: Your Cardiology follow-up visit is scheduled for 15 Sep 2026 at 10:30 AM."
                  value={smsText}
                  onChange={(e) => setSmsText(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowSmsModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Dispatch SMS ({FORMATTED_PHONE_NUMBER})</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
