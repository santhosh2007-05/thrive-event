import React, { useState, useEffect, useCallback } from 'react';
import { fetchMLPrediction } from '../services/mlRiskService';

export default function MLTestingPage() {
  const [totalAppointments, setTotalAppointments] = useState(12);
  const [missedAppointments, setMissedAppointments] = useState(3);
  const [distanceKm, setDistanceKm] = useState(13.5);
  const [age, setAge] = useState(25);
  const [treatmentDurationMonths, setTreatmentDurationMonths] = useState(8);
  const [appointmentFrequencyDays, setAppointmentFrequencyDays] = useState(30);

  const [mlResult, setMlResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Dynamic Attendance Rate calculation: ((Total - Missed) / Total) * 100
  const effectiveMissed = Math.min(missedAppointments, totalAppointments);
  const attendanceRate = totalAppointments > 0
    ? Math.round(((totalAppointments - effectiveMissed) / totalAppointments) * 100)
    : 100;

  const runMlInference = useCallback(async () => {
    setLoading(true);
    const mockPatient = {
      id: 'TEST-SIMULATOR',
      name: 'Interactive Test Patient',
      totalAppointments: Number(totalAppointments),
      missedAppointmentsCount: Number(effectiveMissed),
      distanceKm: Number(distanceKm),
      age: Number(age),
      treatmentDurationMonths: Number(treatmentDurationMonths),
      appointmentFrequencyDays: Number(appointmentFrequencyDays)
    };

    const res = await fetchMLPrediction(mockPatient);
    setMlResult(res);
    setLoading(false);
  }, [totalAppointments, effectiveMissed, distanceKm, age, treatmentDurationMonths, appointmentFrequencyDays]);

  useEffect(() => {
    runMlInference();
  }, [runMlInference]);

  const applyPreset = (presetType) => {
    if (presetType === 'HIGH_RISK') {
      setTotalAppointments(10);
      setMissedAppointments(5);
      setDistanceKm(28.0);
      setAge(68);
      setTreatmentDurationMonths(12);
      setAppointmentFrequencyDays(7);
    } else if (presetType === 'MEDIUM_RISK') {
      setTotalAppointments(12);
      setMissedAppointments(3);
      setDistanceKm(13.5);
      setAge(25);
      setTreatmentDurationMonths(8);
      setAppointmentFrequencyDays(30);
    } else if (presetType === 'LOW_RISK') {
      setTotalAppointments(15);
      setMissedAppointments(0);
      setDistanceKm(3.2);
      setAge(34);
      setTreatmentDurationMonths(6);
      setAppointmentFrequencyDays(60);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto', padding: '12px' }}>
      {/* Header Banner */}
      <div className="full-width-card" style={{
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        color: 'white',
        borderRadius: '20px',
        padding: '28px'
      }}>
        <div style={{ fontSize: '0.8rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
          7-Feature Machine Learning Workbench
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0', color: 'white' }}>
          Patient Follow-up Risk Model Sandbox
        </h1>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>
          Evaluate ML predictions live using 7 clinical features including Total Appointments, Missed Visits, and dynamic Attendance Rate %.
        </p>
      </div>

      {/* Test Case Presets */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>Test Presets:</span>
        <button
          className="btn-secondary"
          style={{ background: 'var(--danger-soft)', color: 'var(--danger-color)', border: '1px solid var(--danger-color)', fontSize: '0.8rem' }}
          onClick={() => applyPreset('HIGH_RISK')}
        >
          🔴 Load High Risk Patient Preset (10 Total, 5 Missed = 50% Rate)
        </button>
        <button
          className="btn-secondary"
          style={{ background: 'var(--warning-soft)', color: 'var(--warning-color)', border: '1px solid var(--warning-color)', fontSize: '0.8rem' }}
          onClick={() => applyPreset('MEDIUM_RISK')}
        >
          🟠 Load Medium Risk Patient Preset (12 Total, 3 Missed = 75% Rate)
        </button>
        <button
          className="btn-secondary"
          style={{ background: 'var(--accent-soft)', color: 'var(--primary-accent)', border: '1px solid var(--border-focus)', fontSize: '0.8rem' }}
          onClick={() => applyPreset('LOW_RISK')}
        >
          🟢 Load Low Risk Patient Preset (15 Total, 0 Missed = 100% Rate)
        </button>
      </div>

      {/* Main Grid: Left Controls (7 Inputs), Right Output Card */}
      <div className="dashboard-grid">
        {/* Left Column: 7 Input Sliders & Controls */}
        <div className="full-width-card" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="card-header-row">
            <div className="card-section-title">
              PATIENT FOLLOW-UP INFORMATION
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>7 Real-Time Features</span>
          </div>

          {/* Input 1: Total Previous Appointments */}
          <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.88rem', fontWeight: 700 }}>
              <span>Total Previous Appointments:</span>
              <span style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{totalAppointments} appointments</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={totalAppointments}
              onChange={(e) => {
                const newTotal = Number(e.target.value);
                setTotalAppointments(newTotal);
                if (missedAppointments > newTotal) setMissedAppointments(newTotal);
              }}
              style={{ width: '100%', accentColor: 'var(--text-main)', cursor: 'pointer' }}
            />
          </div>

          {/* Input 2: Missed Appointments ⭐ */}
          <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.88rem', fontWeight: 700 }}>
              <span>Missed Appointments ⭐:</span>
              <span style={{ color: 'var(--danger-color)', fontSize: '0.95rem' }}>{effectiveMissed} appointments</span>
            </div>
            <input
              type="range"
              min="0"
              max={Math.min(15, totalAppointments)}
              step="1"
              value={effectiveMissed}
              onChange={(e) => setMissedAppointments(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--danger-color)', cursor: 'pointer' }}
            />
          </div>

          {/* Input 3: Attendance Rate ⭐⭐⭐ (Calculated Dynamically) */}
          <div style={{ background: 'var(--bg-highlight)', border: '1px solid var(--border-focus)', padding: '14px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-accent)' }}>
              <span>Attendance Rate ⭐⭐⭐ (Calculated):</span>
              <span style={{ fontSize: '1.05rem', fontWeight: 900 }}>{attendanceRate}%</span>
            </div>
            <div style={{ background: 'var(--border-color)', height: '10px', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{
                width: `${attendanceRate}%`,
                background: attendanceRate < 50 ? 'var(--danger-color)' : attendanceRate < 75 ? 'var(--warning-color)' : 'var(--primary-accent)',
                height: '100%',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          {/* Input 4: Distance from Hospital */}
          <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.88rem', fontWeight: 700 }}>
              <span>Distance from Hospital:</span>
              <span style={{ color: 'var(--info-color)', fontSize: '0.95rem' }}>{distanceKm} km</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="0.5"
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--info-color)', cursor: 'pointer' }}
            />
          </div>

          {/* Input 5: Patient Age */}
          <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.88rem', fontWeight: 700 }}>
              <span>Patient Age:</span>
              <span style={{ color: 'var(--primary-accent)', fontSize: '0.95rem' }}>{age} years old</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary-accent)', cursor: 'pointer' }}
            />
          </div>

          {/* Input 6: Treatment Duration */}
          <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.88rem', fontWeight: 700 }}>
              <span>Treatment Duration:</span>
              <span style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{treatmentDurationMonths} months</span>
            </div>
            <input
              type="range"
              min="1"
              max="60"
              step="1"
              value={treatmentDurationMonths}
              onChange={(e) => setTreatmentDurationMonths(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--text-main)', cursor: 'pointer' }}
            />
          </div>

          {/* Input 7: Appointment Frequency */}
          <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: '12px' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}>
              Appointment Frequency:
            </label>
            <select
              className="form-control"
              value={appointmentFrequencyDays}
              onChange={(e) => setAppointmentFrequencyDays(Number(e.target.value))}
            >
              <option value="7">Every 7 Days (Weekly)</option>
              <option value="14">Every 14 Days (Bi-weekly)</option>
              <option value="30">Every 30 Days (Monthly)</option>
              <option value="60">Every 60 Days (Bi-monthly)</option>
              <option value="90">Every 90 Days (Quarterly)</option>
            </select>
          </div>
        </div>

        {/* Right Column: Prominent Final Output Gauge & Explanation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="full-width-card" style={{ borderTop: `6px solid ${mlResult?.statusColor || '#059669'}`, textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 800, marginTop: '10px' }}>
              FOLLOW-UP RISK
            </div>

            {/* Score Number Display */}
            <div style={{ fontSize: '4.2rem', fontWeight: 900, color: mlResult?.statusColor || '#059669', margin: '8px 0', letterSpacing: '-1px' }}>
              {loading ? '...' : `${mlResult?.riskScore || 0} / 100`}
            </div>

            <div className={`status-badge ${mlResult?.riskLevel === 'HIGH' ? 'inactive' : mlResult?.riskLevel === 'MEDIUM' ? 'reschedule_requested' : 'active'}`} style={{ fontSize: '1.1rem', padding: '8px 24px', letterSpacing: '0.5px' }}>
              {mlResult?.riskLevel || 'LOW'} RISK
            </div>

            {/* Explanation Section ("Why?") */}
            {mlResult && (
              <div style={{ background: 'var(--bg-subtle)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', marginTop: '24px', textAlign: 'left' }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px' }}>
                  Why?
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {mlResult.explanationBulletPoints.map((b, i) => (
                    <div key={i} style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: mlResult.statusColor, fontWeight: 800 }}>●</span>
                      <span>{b.replace('• ', '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
