import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import dataStore from '../services/dataStore';
import AgeAwarePatientView from '../components/patient/AgeAwarePatientView';
import audioService from '../services/audioService';
import smsService, { FORMATTED_PHONE_NUMBER } from '../services/smsService';
import { useRole } from '../components/layout/AppShell';

export default function PatientProfilePage() {
  const { id } = useParams();
  const { role } = useRole();
  const [patients, setPatients] = useState(dataStore.getPatients());
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => {
      setPatients(dataStore.getPatients());
    });
    return () => unsubscribe();
  }, []);

  // Determine target patient: if ID is provided, use that ID. If Patient role, default to P-1001 (Santhosh M)
  const targetId = id || (role === 'Patient' ? 'P-1001' : 'P-1001');
  const patient = patients.find(p => p.id === targetId) || patients[0];

  const showToast = (msg) => {
    setToastMsg(msg);
    audioService.play2hReminder();
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleSendSms = () => {
    const { smsEntry, nativeSmsUri } = smsService.sendSMS({
      to: FORMATTED_PHONE_NUMBER,
      patientName: patient.name,
      patientId: patient.id,
      messageType: 'REMINDER'
    });
    showToast(`SMS Dispatched to ${FORMATTED_PHONE_NUMBER}: "${smsEntry.message.substring(0, 45)}..."`);
    window.location.href = nativeSmsUri;
  };

  const handlePatientSelfConfirm = () => {
    dataStore.confirmPatientAppointment(patient.id, patient.name, 'Patient');
    showToast(`Visit Confirmed! Appointment status updated to CONFIRMED for ${patient.name}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMsg && (
        <div style={{ background: '#059669', color: 'white', padding: '12px 20px', borderRadius: '30px', fontWeight: 600 }}>
          ✓ {toastMsg}
        </div>
      )}

      {/* Header Banner with Curated Hospital Medical Photography */}
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
          backgroundImage: 'linear-gradient(90deg, rgba(24,24,22,0.92) 0%, rgba(24,24,22,0.65) 100%), url(https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1
        }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              Patient Profile Record
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0', color: 'white' }}>
              {patient.name}
            </h1>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1', display: 'flex', gap: '16px', marginTop: '6px' }}>
              <span>Patient ID: <strong>{patient.id}</strong></span>
              <span>Age: <strong>{patient.age} years</strong></span>
              <span>Gender: <strong>{patient.gender}</strong></span>
              <span>Dept: <strong>{patient.department}</strong></span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {patient.status !== 'Confirmed' ? (
              <button
                className="btn-primary"
                onClick={handlePatientSelfConfirm}
                style={{ background: 'linear-gradient(135deg, #059669, #047857)', boxShadow: '0 4px 15px rgba(5, 150, 105, 0.4)' }}
              >
                ✓ Confirm My Visit Attendance
              </button>
            ) : (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '8px 16px', borderRadius: '30px', color: '#065f46', fontSize: '0.85rem', fontWeight: 800 }}>
                ✓ VISIT CONFIRMED BY PATIENT
              </div>
            )}

            <a
              href={`tel:${patient.phone}`}
              className="btn-secondary"
              style={{ textDecoration: 'none' }}
            >
              Call Patient ({patient.phone})
            </a>

            <button
              className="btn-secondary"
              onClick={handleSendSms}
            >
              SMS Reminder ({FORMATTED_PHONE_NUMBER})
            </button>
          </div>
        </div>
      </div>

      {/* Age-Aware Accessible Patient Portal View */}
      <AgeAwarePatientView
        patient={patient}
        onActionLog={(action, pId, prev, next, reason) => {
          showToast(`Logged Action: ${action} for ${pId}`);
        }}
      />

      {/* Baseline Clinical & Logistical Details */}
      <div className="dashboard-grid">
        {/* Left Column: Demographics & Clinical Attributes */}
        <div className="full-width-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="card-section-title">
            DEMOGRAPHICS & CLINICAL ATTRIBUTES
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Full Name:</span>
              <strong style={{ color: 'var(--text-main)' }}>{patient.name}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Hospital Distance:</span>
              <strong style={{ color: 'var(--info-color)' }}>{patient.distanceKm} km</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Contact Mobile:</span>
              <strong style={{ color: 'var(--text-main)' }}>{patient.phone}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Home Address:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)', textAlign: 'right' }}>{patient.address || 'Mylapore, Chennai'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Attending Physician:</span>
              <strong style={{ color: 'var(--primary-accent)' }}>{patient.assignedDoctor}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Assigned Staff Nurse:</span>
              <strong style={{ color: 'var(--text-main)' }}>{patient.assignedNurse}</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Attendance History Timeline */}
        <div className="full-width-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="card-section-title">
            APPOINTMENT ATTENDANCE TIMELINE
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {patient.history && patient.history.length > 0 ? (
              patient.history.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-subtle)',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    borderLeft: `4px solid ${
                      item.status === 'Completed' ? 'var(--primary-accent)' :
                      item.status === 'Missed' ? 'var(--danger-color)' : 'var(--warning-color)'
                    }`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <strong style={{ color: 'var(--text-main)' }}>{item.date} — {item.department}</strong>
                    <span className={`status-badge ${item.status === 'Completed' ? 'active' : item.status === 'Missed' ? 'inactive' : 'reschedule_requested'}`}>
                      {item.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Doctor: {item.doctor || patient.assignedDoctor} • {item.notes}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No past attendance records found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
