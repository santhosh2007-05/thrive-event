import React, { useState } from 'react';
import audioService from '../services/audioService';

export default function SettingsPage() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(60);
  const [highRiskAlerts, setHighRiskAlerts] = useState(true);
  const [missedAlerts, setMissedAlerts] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    if (soundEnabled) audioService.play2hReminder();
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleTestSound = () => {
    audioService.setVolume(volume / 100);
    audioService.setEnabled(soundEnabled);
    audioService.testSound();
    showToast('Testing 10-Minute Operations Alert Sound!');
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    audioService.setVolume(volume / 100);
    audioService.setEnabled(soundEnabled);
    showToast('CareTrack System Preferences Saved successfully.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMsg && (
        <div style={{ background: '#059669', color: 'white', padding: '12px 20px', borderRadius: '10px', fontWeight: 600 }}>
          ✓ {toastMsg}
        </div>
      )}

      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>System Preferences & Settings</h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Configure audio alerts, notification preferences, sound volume, and accessibility modes</span>
      </div>

      <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Sound & Audio Settings */}
        <div className="full-width-card">
          <div className="card-header-row">
            <div className="card-section-title">
              Operations Sound & Audio Alert System
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Web Audio API Synthetic Chime Engine</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>Sound Notifications</strong>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Play operational chime tones for 24h, 2h, 30m, 10m, and missed alerts</p>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                <span>Alert Sound Volume</span>
                <span>{volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  audioService.setVolume(Number(e.target.value) / 100);
                }}
                style={{ cursor: 'pointer' }}
              />
            </div>

            <div>
              <button type="button" className="btn-secondary" onClick={handleTestSound}>
                Test Operations Notification Sound
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Dispatch Settings */}
        <div className="full-width-card">
          <div className="card-header-row">
            <div className="card-section-title">
              Notification Channel Preferences
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', padding: '14px 16px', borderRadius: '12px' }}>
              <input type="checkbox" checked={highRiskAlerts} onChange={(e) => setHighRiskAlerts(e.target.checked)} style={{ width: '18px', height: '18px' }} />
              <div>
                <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>High-Risk Patient Flags</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Notify staff when risk score exceeds 70%</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', padding: '14px 16px', borderRadius: '12px' }}>
              <input type="checkbox" checked={missedAlerts} onChange={(e) => setMissedAlerts(e.target.checked)} style={{ width: '18px', height: '18px' }} />
              <div>
                <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>Missed Follow-Up Alerts</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Trigger immediate alert when visit deadline passes</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', padding: '14px 16px', borderRadius: '12px' }}>
              <input type="checkbox" checked={smsNotif} onChange={(e) => setSmsNotif(e.target.checked)} style={{ width: '18px', height: '18px' }} />
              <div>
                <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>SMS Patient Reminders</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Automated SMS dispatch 24 hours prior</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', padding: '14px 16px', borderRadius: '12px' }}>
              <input type="checkbox" checked={emailNotif} onChange={(e) => setEmailNotif(e.target.checked)} style={{ width: '18px', height: '18px' }} />
              <div>
                <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>Email Summaries</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Daily operations recap emails</div>
              </div>
            </label>
          </div>
        </div>

        {/* Accessibility & Assisted Communication */}
        <div className="full-width-card">
          <div className="card-header-row">
            <div className="card-section-title">
              Accessibility & Assisted Communication Settings
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', padding: '14px 16px', borderRadius: '12px' }}>
              <input type="checkbox" checked={largeText} onChange={(e) => setLargeText(e.target.checked)} style={{ width: '18px', height: '18px' }} />
              <div>
                <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>Large Text Mode (18px+)</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Increases font readability for elderly users</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', padding: '14px 16px', borderRadius: '12px' }}>
              <input type="checkbox" checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} style={{ width: '18px', height: '18px' }} />
              <div>
                <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>High Contrast Theme</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Enhances contrast for visually impaired staff</div>
              </div>
            </label>
          </div>
        </div>

        <div>
          <button type="submit" className="btn-primary" style={{ padding: '12px 24px', fontSize: '1rem' }}>
            Save All Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
