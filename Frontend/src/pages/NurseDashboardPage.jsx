import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dataStore from '../services/dataStore';
import audioService from '../services/audioService';
import smsService, { FORMATTED_PHONE_NUMBER } from '../services/smsService';

export default function NurseDashboardPage() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState(dataStore.getPatients());
  const [toastMsg, setToastMsg] = useState('');
  const [activeTab, setActiveTab] = useState('HIGH_RISK');
  const [callNotes, setCallNotes] = useState('');
  const [selectedPatientForNotes, setSelectedPatientForNotes] = useState(null);

  useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => {
      setPatients(dataStore.getPatients());
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    audioService.play2hReminder();
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleNurseCallSms = (patient) => {
    const { nativeSmsUri } = smsService.sendSMS({
      to: FORMATTED_PHONE_NUMBER,
      patientName: patient.name,
      patientId: patient.id,
      messageType: 'REMINDER',
      senderRole: 'Staff Nurse'
    });
    showToast(`Nurse Reminder SMS Sent to ${FORMATTED_PHONE_NUMBER} for ${patient.name}`);
    window.location.href = nativeSmsUri;
  };

  const handleNurseConfirm = (patient) => {
    dataStore.confirmPatientAppointment(patient.id, 'Meenakshi Sundaram (Head Nurse)', 'Nurse');
    showToast(`Appointment Confirmed by Staff Nurse for ${patient.name} (${patient.id})`);
  };

  const handleSaveNurseNotes = (e) => {
    e.preventDefault();
    if (!selectedPatientForNotes) return;
    dataStore.updateAppointmentStatus(`APT-${selectedPatientForNotes.id}`, 'Call Completed', `Nurse Note: ${callNotes}`, 'Meenakshi Sundaram', 'Nurse');
    showToast(`Nurse Call Note Saved for ${selectedPatientForNotes.name}`);
    setSelectedPatientForNotes(null);
    setCallNotes('');
  };

  const filteredPatients = patients.filter(p => {
    if (activeTab === 'HIGH_RISK') return p.risk && p.risk.riskScore >= 70;
    if (activeTab === 'MEDIUM_RISK') return p.risk && p.risk.riskScore >= 45 && p.risk.riskScore < 70;
    if (activeTab === 'CONFIRMED') return p.status === 'Confirmed';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMsg && (
        <div style={{ background: '#059669', color: 'white', padding: '12px 20px', borderRadius: '30px', fontWeight: 600 }}>
          ✓ {toastMsg}
        </div>
      )}

      {/* Nurse Workstation Executive Banner */}
      <div className="full-width-card" style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        minHeight: '150px',
        display: 'flex',
        alignItems: 'center',
        padding: '32px',
        color: 'white',
        boxShadow: 'var(--shadow-soft)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'linear-gradient(90deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.7) 100%), url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1
        }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1.2px', fontWeight: 800 }}>
              CLINICAL NURSE INTERVENTION DESK
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0', color: 'white' }}>
              Staff Nurse Outreach & Pre-Appointment Follow-up Desk
            </h1>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
              Head Nurse: <strong>Meenakshi Sundaram</strong> • Operational Line: <strong>+91 7598357132</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-primary" onClick={() => navigate('/risk-prediction')}>
              View Risk Engine &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Nurse Operations KPI Grid */}
      <div className="kpi-grid">
        <div className="kpi-card" style={{ borderLeft: '5px solid #e11d48' }}>
          <div className="kpi-title">TODAY'S HIGH RISK QUEUE</div>
          <div className="kpi-value" style={{ color: '#e11d48' }}>18</div>
          <div className="kpi-subtitle">Patients requiring urgent call</div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '5px solid #0284c7' }}>
          <div className="kpi-title">VOICE CALLS COMPLETED</div>
          <div className="kpi-value" style={{ color: '#0284c7' }}>45</div>
          <div className="kpi-subtitle">Recorded in shift</div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '5px solid #059669' }}>
          <div className="kpi-title">SMS REMINDERS SENT</div>
          <div className="kpi-value" style={{ color: '#059669' }}>120</div>
          <div className="kpi-subtitle">Dispatched to +91 7598357132</div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '5px solid #8b5cf6' }}>
          <div className="kpi-title">CONFIRMATIONS OBTAINED</div>
          <div className="kpi-value" style={{ color: '#8b5cf6' }}>38</div>
          <div className="kpi-subtitle">Visits confirmed</div>
        </div>
      </div>

      {/* Nurse Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          className={activeTab === 'HIGH_RISK' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setActiveTab('HIGH_RISK')}
          style={{ padding: '8px 16px', fontSize: '0.82rem' }}
        >
          🔴 High Risk Priority Queue (≥70%)
        </button>
        <button
          className={activeTab === 'MEDIUM_RISK' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setActiveTab('MEDIUM_RISK')}
          style={{ padding: '8px 16px', fontSize: '0.82rem' }}
        >
          🟠 Medium Risk Follow-ups
        </button>
        <button
          className={activeTab === 'CONFIRMED' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setActiveTab('CONFIRMED')}
          style={{ padding: '8px 16px', fontSize: '0.82rem' }}
        >
          🟢 Confirmed Visits
        </button>
        <button
          className={activeTab === 'ALL' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setActiveTab('ALL')}
          style={{ padding: '8px 16px', fontSize: '0.82rem' }}
        >
          All Patients Directory
        </button>
      </div>

      {/* 💉 NURSE OUTREACH ACTION TABLE */}
      <div className="full-width-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="admin-data-table" style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '14px 16px' }}>Patient ID</th>
                <th style={{ padding: '14px 16px' }}>Patient Details</th>
                <th style={{ padding: '14px 16px' }}>Risk Level</th>
                <th style={{ padding: '14px 16px' }}>Primary Barrier</th>
                <th style={{ padding: '14px 16px' }}>Nurse Recommended Action</th>
                <th style={{ padding: '14px 16px' }}>Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'center' }}>Outreach Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map(p => {
                  const rScore = p.risk ? p.risk.riskScore : 12;
                  const isHigh = rScore >= 70;
                  const isMed = rScore >= 45 && rScore < 70;
                  const isDist = (p.distanceKm || 5) > 15;

                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ fontWeight: 800, color: 'var(--primary-accent)', padding: '16px' }}>
                        {p.id}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.92rem' }}>{p.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Age {p.age} • {p.department} • Phone: {p.phone}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span className={`status-badge ${isHigh ? 'inactive' : isMed ? 'reschedule_requested' : 'active'}`}>
                          {p.risk ? p.risk.riskLevel : 'LOW'} ({rScore}%)
                        </span>
                      </td>
                      <td style={{ padding: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {isDist ? 'Hospital Travel Distance (15+ km)' : 'Past Missed Appointments History'}
                      </td>
                      <td style={{ padding: '16px', fontSize: '0.82rem', fontWeight: 700, color: '#059669' }}>
                        ✓ {isDist ? 'Offer Transport Shuttle Assistance' : 'Staff Voice Call + Confirm Visit'}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          background: p.status === 'Confirmed' ? 'var(--accent-soft)' : 'var(--warning-soft)',
                          color: p.status === 'Confirmed' ? 'var(--primary-accent)' : 'var(--warning-color)',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontWeight: 700,
                          fontSize: '0.75rem'
                        }}>
                          ● {p.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                          <a
                            href={`tel:${p.phone}`}
                            className="btn-primary"
                            style={{ padding: '6px 12px', fontSize: '0.78rem', textDecoration: 'none' }}
                          >
                            Call Phone
                          </a>

                          <button
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                            onClick={() => handleNurseCallSms(p)}
                          >
                            Send SMS
                          </button>

                          <button
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                            onClick={() => setSelectedPatientForNotes(p)}
                          >
                            Log Note
                          </button>

                          {p.status !== 'Confirmed' && (
                            <button
                              className="btn-primary"
                              style={{ padding: '6px 12px', fontSize: '0.78rem', background: '#059669' }}
                              onClick={() => handleNurseConfirm(p)}
                            >
                              Confirm
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No patients match the active filter tab.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nurse Call Notes Modal */}
      {selectedPatientForNotes && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.2rem', fontWeight: 800 }}>
              Log Nurse Call & Intervention Note
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Patient: <strong>{selectedPatientForNotes.name} ({selectedPatientForNotes.id})</strong>
            </p>

            <form onSubmit={handleSaveNurseNotes} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                  Nurse Call Outcome & Notes *
                </label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="e.g., Called patient. Spoke with spouse. Confirmed transportation assistance shuttle for 15 Sep 2026 at 10:30 AM."
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" className="btn-secondary" onClick={() => setSelectedPatientForNotes(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Clinical Call Note</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
