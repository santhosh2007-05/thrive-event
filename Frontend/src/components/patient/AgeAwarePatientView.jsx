import React, { useState } from 'react';
import dataStore from '../../services/dataStore';
import audioService from '../../services/audioService';

export default function AgeAwarePatientView({ patient, onActionLog }) {
  const [confirmed, setConfirmed] = useState(patient.status === 'Confirmed');
  const [rescheduled, setRescheduled] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [newDate, setNewDate] = useState('2026-09-25');
  const [rescheduleReason, setRescheduleReason] = useState('Personal schedule conflict');

  const handleConfirmVisit = () => {
    setConfirmed(true);
    setShowConfirmModal(false);
    audioService.play2hReminder();

    dataStore.confirmPatientAppointment(patient.id, patient.name, 'Patient');
    if (onActionLog) onActionLog('Confirmed Appointment Visit', patient.id, 'Upcoming', 'Confirmed', 'Patient self-service portal confirmation');
  };

  const handleRescheduleVisit = (e) => {
    e.preventDefault();
    setRescheduled(true);
    setShowRescheduleModal(false);
    audioService.play2hReminder();

    dataStore.updateAppointmentStatus(`APT-${patient.id}`, 'Rescheduled Requested', `Patient requested reschedule to ${newDate}. Reason: ${rescheduleReason}`, patient.name, 'Patient');
    if (onActionLog) onActionLog('Requested Visit Reschedule', patient.id, 'Upcoming', 'Reschedule Requested', `Requested new date ${newDate}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Patient Portal Card with Hospital Building Banner & Date Badge */}
      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: '20px',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-soft)'
      }}>
        {/* Blue Banner Header with Medical Building Graphics */}
        <div style={{
          position: 'relative',
          height: '140px',
          background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
          padding: '24px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.25
          }} />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: '0.75rem', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>
              CARETRACK PATIENT PORTAL
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '4px 0 0 0', color: 'white' }}>
              {patient.department} Outpatient Clinic
            </h2>
            <div style={{ fontSize: '0.85rem', color: '#dbeafe', marginTop: '4px' }}>
              Chennai General Hospital • Main Medical Block
            </div>
          </div>

          <div style={{
            position: 'relative',
            zIndex: 2,
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 800
          }}>
            Patient ID: {patient.id}
          </div>
        </div>

        {/* Card Body: Soft Blue Appointment Date Container */}
        <div style={{ padding: '24px' }}>
          <div style={{
            background: 'var(--bg-subtle)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
                UPCOMING APPOINTMENT DATE & TIME
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', margin: '4px 0' }}>
                🗓️ {patient.nextFollowUpDate} at {patient.nextFollowUpTime}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Attending Physician: <strong style={{ color: 'var(--text-main)' }}>{patient.assignedDoctor}</strong>
              </div>
            </div>

            <div>
              {confirmed ? (
                <span style={{ background: 'var(--accent-soft)', color: 'var(--primary-accent)', padding: '8px 18px', borderRadius: '30px', fontWeight: 800, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  ✓ VISIT CONFIRMED
                </span>
              ) : rescheduled ? (
                <span style={{ background: 'var(--warning-soft)', color: 'var(--warning-color)', padding: '8px 18px', borderRadius: '30px', fontWeight: 800, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  ⏳ RESCHEDULE REQUESTED
                </span>
              ) : (
                <span style={{ background: 'var(--warning-soft)', color: 'var(--warning-color)', padding: '8px 18px', borderRadius: '30px', fontWeight: 800, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  ● CONFIRMATION PENDING
                </span>
              )}
            </div>
          </div>

          {/* Clinical Details List */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-highlight)', color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Specialist Department</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{patient.department} Clinic</div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-highlight)', color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned Physician</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{patient.assignedDoctor}</div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-highlight)', color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned Staff Nurse</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{patient.assignedNurse}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              style={{ flex: 1, minWidth: '180px', padding: '12px 20px', fontSize: '0.9rem', justifyContent: 'center' }}
              onClick={() => setShowConfirmModal(true)}
              disabled={confirmed}
            >
              {confirmed ? '✓ Visit Confirmed' : 'Confirm Attendance >'}
            </button>

            <button
              className="btn-secondary"
              style={{ flex: 1, minWidth: '180px', padding: '12px 20px', fontSize: '0.9rem', justifyContent: 'center' }}
              onClick={() => setShowRescheduleModal(true)}
            >
              Request Reschedule >
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '480px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 8px 0' }}>Confirm Hospital Visit</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Confirm attendance for <strong>{patient.name}</strong> on <strong>{patient.nextFollowUpDate} at {patient.nextFollowUpTime}</strong> with {patient.assignedDoctor}?
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn-secondary" onClick={() => setShowConfirmModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleConfirmVisit}>Yes, Confirm Visit</button>
            </div>
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {showRescheduleModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '480px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 12px 0' }}>Request Appointment Reschedule</h3>
            <form onSubmit={handleRescheduleVisit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Preferred New Date *</label>
                <input type="date" className="form-control" value={newDate} onChange={(e) => setNewDate(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Reason for Rescheduling</label>
                <textarea className="form-control" rows="3" value={rescheduleReason} onChange={(e) => setRescheduleReason(e.target.value)} required />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowRescheduleModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Submit Reschedule Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
