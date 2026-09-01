import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_APPOINTMENTS } from '../services/mockDataService';
import audioService from '../services/audioService';

export default function AppointmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [toastMsg, setToastMsg] = useState('');

  const appointment = MOCK_APPOINTMENTS.find(a => a.id === id) || MOCK_APPOINTMENTS[0];
  const [status, setStatus] = useState(appointment.status);
  const [newNote, setNewNote] = useState('');
  const [notesList, setNotesList] = useState([
    { id: 1, text: "Initial reminder SMS dispatched.", author: "Automated System", time: "2026-08-31 09:00 AM" }
  ]);

  const showToast = (msg) => {
    setToastMsg(msg);
    audioService.play2hReminder();
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleMarkConfirmed = () => {
    setStatus('Confirmed');
    showToast(`Appointment ${appointment.id} marked as CONFIRMED.`);
  };

  const handleMarkMissed = () => {
    setStatus('Missed');
    audioService.playMissedAlert();
    showToast(`Appointment ${appointment.id} marked as MISSED. Alert generated.`);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotesList(prev => [{ id: Date.now(), text: newNote, author: "Nurse Priya Sharma", time: new Date().toLocaleString() }, ...prev]);
    setNewNote('');
    showToast("Clinical note recorded in audit log.");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMsg && (
        <div style={{ background: '#0d9488', color: 'white', padding: '12px 20px', borderRadius: '10px', fontWeight: 600 }}>
          ✓ {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="full-width-card">
        <div className="card-header-row">
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Appointment Record Details</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '4px 0', color: '#0f172a' }}>
              Appointment #{appointment.id}
            </h2>
            <div style={{ fontSize: '0.9rem', color: '#475569' }}>
              Patient: <strong>{appointment.patientName} ({appointment.patientId})</strong> • Age {appointment.patientAge}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={handleMarkConfirmed}>
              Mark Confirmed
            </button>
            <button className="btn-outline-danger" onClick={handleMarkMissed}>
              Mark Missed
            </button>
            <button className="btn-secondary" onClick={() => showToast('Reschedule modal opened')}>
              Reschedule
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="dashboard-grid">
        {/* Left Column: Details & Communication */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="full-width-card">
            <div className="card-header-row">
              <div className="card-section-title">
                Scheduled Visit Details
              </div>
              <span className={`status-badge ${status === 'Confirmed' ? 'active' : status === 'Missed' ? 'cancelled' : 'scheduled'}`}>
                {status}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.9rem', marginTop: '12px' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.8rem', display: 'block' }}>Date & Time</span>
                <strong>{appointment.date} at {appointment.time}</strong>
              </div>

              <div>
                <span style={{ color: '#64748b', fontSize: '0.8rem', display: 'block' }}>Department</span>
                <strong>{appointment.department}</strong>
              </div>

              <div>
                <span style={{ color: '#64748b', fontSize: '0.8rem', display: 'block' }}>Assigned Doctor</span>
                <strong>{appointment.doctor}</strong>
              </div>

              <div>
                <span style={{ color: '#64748b', fontSize: '0.8rem', display: 'block' }}>Confirmation Status</span>
                <span className="status-badge confirmed">{appointment.confirmationStatus}</span>
              </div>
            </div>
          </div>

          {/* Communication Timeline */}
          <div className="timeline-card">
            <div className="card-header-row">
              <div className="card-section-title">
                Communication & Reminder Timeline
              </div>
            </div>

            <div className="timeline-list">
              {appointment.communications.map((c, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot attended" />
                  <div className="timeline-date-status">
                    <span className="timeline-date">{c.timestamp}</span>
                    <span className="status-badge scheduled">{c.type}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#334155' }}>Sender: {c.sender}</div>
                  <div className="doctor-notes-snippet">"{c.text}"</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Risk & Clinical Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Risk Card */}
          <div className="full-width-card" style={{ borderLeft: '5px solid #dc2626' }}>
            <div className="card-header-row">
              <div className="card-section-title">
                Follow-up Risk Context
              </div>
              <span className="status-badge inactive">{appointment.riskLevel}</span>
            </div>

            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#dc2626' }}>
                {appointment.riskScore}% Probability
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 12px 0' }}>
                Estimated likelihood of missed follow-up generated from historical attendance, travel distance, and treatment gap.
              </p>
              <button
                className="btn-secondary"
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                onClick={() => navigate(`/patients/${appointment.patientId}`)}
              >
                View Full Patient Profile →
              </button>
            </div>
          </div>

          {/* Clinical Notes & Action Log */}
          <div className="full-width-card">
            <div className="card-header-row">
              <div className="card-section-title">
                Staff Notes & Logged Interventions
              </div>
            </div>

            <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '8px', margin: '12px 0' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Add clinical note or call outcome..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '8px 14px' }}>Add Note</button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {notesList.map((note) => (
                <div key={note.id} style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.75rem', marginBottom: '4px' }}>
                    <span>{note.author}</span>
                    <span>{note.time}</span>
                  </div>
                  <div style={{ color: '#0f172a', fontWeight: 500 }}>{note.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
