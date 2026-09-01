import React, { useState } from 'react';
import audioService from '../../services/audioService';
import dataStore from '../../services/dataStore';

export default function AgeAwarePatientView({ patient, onActionLog }) {
  const [confirmed, setConfirmed] = useState(patient?.status === 'Confirmed');
  const [showQRModal, setShowQRModal] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  if (!patient) return null;

  const triggerSuccess = (msg) => {
    setActionSuccessMsg(msg);
    audioService.play2hReminder();
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const handleConfirmVisit = () => {
    setConfirmed(true);
    dataStore.confirmPatientAppointment(patient.id, patient.name, 'Patient');
    triggerSuccess('Visit confirmed successfully!');
    if (onActionLog) {
      onActionLog('Confirmed Appointment', patient.id, 'Unconfirmed', 'Confirmed', 'Patient self-confirmation flow');
    }
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '24px',
      padding: '32px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
      maxWidth: '780px',
      margin: '0 auto',
      boxSizing: 'border-box'
    }}>
      {/* 1. Header Banner (Matching Uploaded Template Image) */}
      <div style={{
        background: 'linear-gradient(135deg, #0b2545, #134074)',
        color: 'white',
        padding: '20px 28px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {/* Hospital Building Circle Badge */}
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.3)',
          background: 'rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M3 21h18M5 21V7l7-4 7 4v14M9 10h6M9 14h6M9 18h6" />
          </svg>
        </div>

        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, letterSpacing: '0.5px' }}>
            YOUR NEXT HOSPITAL VISIT
          </h2>
          <span style={{ fontSize: '0.9rem', color: '#93c5fd', opacity: 0.9 }}>
            We're here to take care of you
          </span>
        </div>
      </div>

      {actionSuccessMsg && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '14px', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, textAlign: 'center', marginBottom: '20px' }}>
          ✓ {actionSuccessMsg}
        </div>
      )}

      {/* 2. Prominent Date & Details Container */}
      <div style={{
        background: '#f0f7ff',
        border: '1px solid #c7d2fe',
        borderRadius: '16px',
        padding: '24px',
        textAlign: 'center',
        marginBottom: '24px'
      }}>
        <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          — APPOINTMENT DATE —
        </div>

        {/* Calendar Circle Icon */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#dbeafe',
          color: '#2563eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px auto'
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>

        <div style={{ fontSize: '2rem', color: '#0f172a', fontWeight: 900, marginBottom: '2px' }}>
          {patient.nextFollowUpDate || '05 September 2026'}
        </div>
        <div style={{ fontSize: '1.4rem', color: '#2563eb', fontWeight: 800, marginBottom: '20px' }}>
          {patient.nextFollowUpTime || '10:30 AM'}
        </div>

        {/* Department & Doctor Row with Icons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid #cbd5e1', paddingTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l.77.78L12 20.67l7.65-7.66.77-.78a5.4 5.4 0 0 0 0-7.65z" />
              </svg>
            </div>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>DEPARTMENT</span>
              <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{patient.department}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>DOCTOR</span>
              <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{patient.assignedDoctor}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Action Buttons with Professional Icons & Chevrons (Matching Uploaded Template) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* GREEN CONFIRM BUTTON */}
        {!confirmed ? (
          <button
            onClick={handleConfirmVisit}
            style={{
              background: '#059669',
              color: 'white',
              border: 'none',
              padding: '18px 24px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
              transition: 'transform 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>CONFIRM MY APPOINTMENT</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Confirm your appointment to help us serve you better</div>
              </div>
            </div>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        ) : (
          <div style={{ background: '#dcfce7', color: '#15803d', padding: '18px', borderRadius: '16px', textAlign: 'center', fontSize: '1.1rem', fontWeight: 800, border: '1px solid #86efac' }}>
            ✓ YOUR VISIT IS CONFIRMED! WE ARE EXPECTING YOU.
          </div>
        )}

        {/* BLUE PHONE BUTTON */}
        <a
          href={`tel:${patient.phone}`}
          onClick={() => onActionLog && onActionLog('Call Hospital Clicked', patient.id, '', '', 'Elderly phone action')}
          style={{
            background: '#2563eb',
            color: 'white',
            border: 'none',
            padding: '18px 24px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>CALL HOSPITAL ASSISTANCE</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>+91 98765 43210</div>
            </div>
          </div>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </a>

        {/* WHITE CALENDAR RESCHEDULE BUTTON */}
        <button
          onClick={() => alert(`Please call hospital staff at ${patient.phone} to pick a new date.`)}
          style={{
            background: '#ffffff',
            color: '#1e293b',
            border: '1px solid #cbd5e1',
            padding: '16px 24px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>CHANGE APPOINTMENT DATE</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Reschedule your appointment</div>
            </div>
          </div>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Footer Info Row */}
      <div style={{
        marginTop: '24px',
        paddingTop: '16px',
        borderTop: '1px solid #f1f5f9',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.85rem',
        color: '#64748b',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <span>Assigned Nurse: <strong style={{ color: '#2563eb' }}>{patient.assignedNurse}</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <span>Need transport help? Call us directly.</span>
        </div>
      </div>
    </div>
  );
}
