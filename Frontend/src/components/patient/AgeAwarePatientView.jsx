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

  const numVisits = patient.totalAppointments || 6;
  const freqGapDays = patient.appointmentFrequencyDays || 30;

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

          {/* Clinical Details & Appointment Frequency List */}
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

            {/* Total Planned Visits Badge */}
            <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Planned Visits</div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary-accent)' }}>{numVisits} Planned Visits</div>
              </div>
            </div>

            {/* Visit Frequency Gap Badge */}
            <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--info-soft)', color: 'var(--info-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Visit Frequency Gap</div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--info-color)' }}>Every {freqGapDays} Days</div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-highlight)', color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hospital Distance</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{patient.distanceKm} km</div>
              </div>
            </div>
          </div>

          {/* Action Buttons: Confirm Visit & Request Reschedule */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              onClick={() => setShowConfirmModal(true)}
              disabled={confirmed}
              style={{
                background: confirmed ? 'var(--bg-subtle)' : 'linear-gradient(135deg, #059669, #047857)',
                color: confirmed ? 'var(--text-muted)' : 'white',
                border: 'none',
                boxShadow: confirmed ? 'none' : '0 4px 15px rgba(5, 150, 105, 0.4)'
              }}
            >
              {confirmed ? '✓ Visit Confirmed' : '✓ Confirm My Attendance'}
            </button>

            <button
              className="btn-secondary"
              onClick={() => setShowRescheduleModal(true)}
            >
              Request Reschedule &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '440px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 800 }}>Confirm Appointment Visit</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Are you sure you want to confirm attendance for your appointment on <strong>{patient.nextFollowUpDate}</strong> at <strong>{patient.nextFollowUpTime}</strong>?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn-secondary" onClick={() => setShowConfirmModal(false)}>Cancel</button>
              <button className="btn-primary" style={{ background: '#059669' }} onClick={handleConfirmVisit}>Yes, Confirm Attendance</button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '480px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 800 }}>Request Reschedule</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Select your preferred new visit date and state your reason for the clinic staff.
            </p>
            <form onSubmit={handleRescheduleVisit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Preferred New Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Reason for Reschedule *</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
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
