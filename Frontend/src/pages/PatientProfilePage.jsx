import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PATIENTS_WITH_RISK } from '../services/mockDataService';
import AgeAwarePatientView from '../components/patient/AgeAwarePatientView';
import audioService from '../services/audioService';
import smsService, { FORMATTED_PHONE_NUMBER } from '../services/smsService';
import { useRole } from '../components/layout/AppShell';

export default function PatientProfilePage() {
  const { id } = useParams();
  const { role } = useRole();
  const [toastMsg, setToastMsg] = useState('');

  // Unrestricted Data Access: If logged in as Patient, view own profile (P-10234), otherwise view requested ID
  const targetId = role === 'Patient' ? 'P-10234' : id;
  const patient = PATIENTS_WITH_RISK.find(p => p.id === targetId) || PATIENTS_WITH_RISK[0];

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
            <a
              href={`tel:${patient.phone}`}
              className="btn-primary"
              style={{ textDecoration: 'none' }}
            >
              Call Patient ({patient.phone})
            </a>
            <button
              className="btn-secondary"
              style={{ background: '#ffffff', color: '#181816' }}
              onClick={handleSendSms}
            >
              Send SMS ({FORMATTED_PHONE_NUMBER})
            </button>
            <button
              className="btn-primary"
              onClick={() => showToast(`Schedule Follow-up modal triggered for ${patient.name}`)}
            >
              Schedule Follow-up
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Left Column (Info + Timeline), Right Column (Risk Score & Breakdown) */}
      <div className="dashboard-grid">
        {/* Left Column: Patient Information & Attendance Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Administrative Details */}
          <div className="full-width-card">
            <div className="card-header-row">
              <div className="card-section-title">
                Patient Administrative Information
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Contact Phone</span>
                <strong>{patient.phone}</strong>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>SMS Gateway Dispatch</span>
                <strong style={{ color: 'var(--primary-accent)' }}>{FORMATTED_PHONE_NUMBER}</strong>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Residential Address & Distance</span>
                <strong>{patient.address} ({patient.distanceKm} km from hospital)</strong>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Preferred Channel</span>
                <span className="status-badge scheduled">{patient.preferredComm}</span>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Assigned Care Team</span>
                <strong>{patient.assignedDoctor} (Doctor)</strong><br />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nurse: {patient.assignedNurse}</span>
              </div>
            </div>
          </div>

          {/* Appointment Attendance Timeline (Bulletproof Inline Flex Card Styling) */}
          <div className="full-width-card">
            <div className="card-header-row" style={{ marginBottom: '20px' }}>
              <div className="card-section-title">
                Appointment Attendance Timeline
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Historical Attendance Record</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {patient.history.map((h) => {
                const isCompleted = h.status === 'Completed';
                const isMissed = h.status === 'Missed';
                const statusColor = isCompleted ? '#059669' : isMissed ? '#e11d48' : '#d97706';
                const statusBg = isCompleted ? 'var(--accent-soft)' : isMissed ? 'var(--danger-soft)' : 'var(--warning-soft)';

                return (
                  <div
                    key={h.id}
                    style={{
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-color)',
                      borderLeft: `5px solid ${statusColor}`,
                      borderRadius: '14px',
                      padding: '16px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        🗓️ {h.date}
                      </div>
                      <span
                        style={{
                          background: statusBg,
                          color: statusColor,
                          padding: '4px 12px',
                          borderRadius: '30px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          letterSpacing: '0.3px'
                        }}
                      >
                        {h.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {h.department} • {h.doctor}
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                      "{h.notes}"
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Follow-up Risk Card & Explainability Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="full-width-card" style={{ borderTop: `6px solid ${patient.risk.riskScore >= 70 ? 'var(--danger-color)' : 'var(--primary-accent)'}` }}>
            <div className="card-header-row">
              <div className="card-section-title">
                Follow-up Risk Prediction
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{patient.risk.modelVersion}</span>
            </div>

            {/* Risk Score Pill */}
            <div style={{ textAlign: 'center', padding: '20px', background: 'var(--bg-subtle)', borderRadius: '16px', margin: '12px 0' }}>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: patient.risk.riskScore >= 70 ? 'var(--danger-color)' : 'var(--primary-accent)' }}>
                {patient.risk.riskScore}%
              </div>
              <div className={`status-badge ${patient.risk.riskScore >= 70 ? 'inactive' : 'active'}`} style={{ fontSize: '0.9rem', padding: '6px 16px' }}>
                {patient.risk.riskLevel} RISK
              </div>
            </div>

            {/* Why this prediction? Transparent Factor Contribution */}
            <div>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: 'var(--text-main)', fontWeight: 700 }}>
                Why this prediction?
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {patient.risk.factorsSorted.map((factor) => (
                  <div key={factor.key} style={{ background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                      <span>{factor.label} ({factor.raw})</span>
                      <span style={{ color: factor.points > 10 ? 'var(--danger-color)' : 'var(--primary-accent)', fontWeight: 700 }}>
                        +{factor.points} pts
                      </span>
                    </div>
                    <div style={{ background: 'var(--border-color)', height: '6px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${(factor.points / factor.maxPoints) * 100}%`,
                        background: factor.points > 10 ? 'var(--danger-color)' : 'var(--primary-accent)',
                        height: '100%'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Contributors */}
            <div style={{ marginTop: '16px', background: 'var(--bg-highlight)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-focus)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-accent)', marginBottom: '4px' }}>
                Primary Contributing Factors:
              </div>
              <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--primary-accent)' }}>
                {patient.risk.primaryContributors.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ol>
            </div>

            {/* Non-fabricated Explanation */}
            <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', background: 'var(--bg-subtle)', padding: '12px', borderRadius: '10px' }}>
              "{patient.risk.explanation}"
            </div>
          </div>
        </div>
      </div>

      {/* Age-Aware Communication & Patient View Section */}
      {role === 'Patient' && (
        <div style={{ marginTop: '12px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 16px 0', color: 'var(--text-main)' }}>
            My Patient Portal & Appointment Confirmation
          </h3>
          <AgeAwarePatientView
            patient={patient}
            onActionLog={(action, pId, oldVal, newVal, reason) => {
              showToast(`Logged to Audit Trail: ${action}`);
            }}
          />
        </div>
      )}
    </div>
  );
}
