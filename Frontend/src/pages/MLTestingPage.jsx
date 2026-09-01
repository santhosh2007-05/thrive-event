import React, { useState, useEffect } from 'react';
import { fetchMLPrediction } from '../services/mlRiskService';

export default function MLTestingPage() {
  const [inputs, setInputs] = useState({
    missedAppointments: 3,
    distanceKm: 24.5,
    age: 68,
    treatmentDurationMonths: 12,
    appointmentFrequencyDays: 14
  });

  const [mlResult, setMlResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    runMlInference();
  }, [inputs]);

  const runMlInference = async () => {
    setLoading(true);
    const mockPatient = {
      id: 'TEST-SIMULATOR',
      name: 'Interactive Test Patient',
      missedAppointmentsCount: Number(inputs.missedAppointments),
      distanceKm: Number(inputs.distanceKm),
      age: Number(inputs.age),
      treatmentDurationMonths: Number(inputs.treatmentDurationMonths),
      appointmentFrequencyDays: Number(inputs.appointmentFrequencyDays)
    };

    const res = await fetchMLPrediction(mockPatient);
    setMlResult(res);
    setLoading(false);
  };

  const applyPreset = (presetType) => {
    if (presetType === 'HIGH_RISK') {
      setInputs({
        missedAppointments: 4,
        distanceKm: 32.0,
        age: 74,
        treatmentDurationMonths: 18,
        appointmentFrequencyDays: 7
      });
    } else if (presetType === 'MEDIUM_RISK') {
      setInputs({
        missedAppointments: 1,
        distanceKm: 18.5,
        age: 52,
        treatmentDurationMonths: 6,
        appointmentFrequencyDays: 30
      });
    } else if (presetType === 'LOW_RISK') {
      setInputs({
        missedAppointments: 0,
        distanceKm: 2.5,
        age: 29,
        treatmentDurationMonths: 3,
        appointmentFrequencyDays: 60
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div className="full-width-card" style={{
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        color: 'white',
        borderRadius: '20px',
        padding: '28px'
      }}>
        <div style={{ fontSize: '0.8rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
          Interactive Machine Learning Workbench
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0', color: 'white' }}>
          ML Follow-Up Risk Model Testing Sandbox
        </h1>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>
          Test the scikit-learn RandomForest Machine Learning algorithm live. Adjust clinical parameters to observe real-time risk score calculations and transparent XAI explanations.
        </p>
      </div>

      {/* Preset Action Buttons Bar */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>Load Test Case Presets:</span>
        <button
          className="btn-secondary"
          style={{ background: 'var(--danger-soft)', color: 'var(--danger-color)', border: '1px solid var(--danger-color)', fontSize: '0.8rem' }}
          onClick={() => applyPreset('HIGH_RISK')}
        >
          🔴 Load High Risk Patient Preset (89% High)
        </button>
        <button
          className="btn-secondary"
          style={{ background: 'var(--warning-soft)', color: 'var(--warning-color)', border: '1px solid var(--warning-color)', fontSize: '0.8rem' }}
          onClick={() => applyPreset('MEDIUM_RISK')}
        >
          🟠 Load Medium Risk Patient Preset (54% Med)
        </button>
        <button
          className="btn-secondary"
          style={{ background: 'var(--accent-soft)', color: 'var(--primary-accent)', border: '1px solid var(--border-focus)', fontSize: '0.8rem' }}
          onClick={() => applyPreset('LOW_RISK')}
        >
          🟢 Load Low Risk Patient Preset (18% Low)
        </button>
      </div>

      {/* Main Grid: Left Controls (Inputs), Right Output (ML Score & Explanation) */}
      <div className="dashboard-grid">
        {/* Left Column: Interactive Input Controls */}
        <div className="full-width-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card-header-row">
            <div className="card-section-title">
              1. Clinical & Logistical Input Parameters
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-time Input Bindings</span>
          </div>

          {/* Slider 1: Missed Appointments */}
          <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 700 }}>
              <span>Previous Missed Appointments:</span>
              <span style={{ color: 'var(--danger-color)', fontSize: '1rem' }}>{inputs.missedAppointments} visits</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={inputs.missedAppointments}
              onChange={(e) => setInputs({ ...inputs, missedAppointments: Number(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--danger-color)', cursor: 'pointer' }}
            />
          </div>

          {/* Slider 2: Distance from Hospital */}
          <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 700 }}>
              <span>Distance from Hospital:</span>
              <span style={{ color: 'var(--info-color)', fontSize: '1rem' }}>{inputs.distanceKm} km</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="60"
              step="0.5"
              value={inputs.distanceKm}
              onChange={(e) => setInputs({ ...inputs, distanceKm: Number(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--info-color)', cursor: 'pointer' }}
            />
          </div>

          {/* Slider 3: Patient Age */}
          <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 700 }}>
              <span>Patient Age:</span>
              <span style={{ color: 'var(--primary-accent)', fontSize: '1rem' }}>{inputs.age} years old</span>
            </div>
            <input
              type="range"
              min="18"
              max="95"
              step="1"
              value={inputs.age}
              onChange={(e) => setInputs({ ...inputs, age: Number(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--primary-accent)', cursor: 'pointer' }}
            />
          </div>

          {/* Slider 4: Treatment Duration */}
          <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 700 }}>
              <span>Treatment Duration:</span>
              <span style={{ color: 'var(--text-main)', fontSize: '1rem' }}>{inputs.treatmentDurationMonths} months</span>
            </div>
            <input
              type="range"
              min="1"
              max="36"
              step="1"
              value={inputs.treatmentDurationMonths}
              onChange={(e) => setInputs({ ...inputs, treatmentDurationMonths: Number(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--text-main)', cursor: 'pointer' }}
            />
          </div>

          {/* Selector 5: Appointment Frequency */}
          <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px' }}>
              Appointment Frequency Gap:
            </label>
            <select
              className="form-control"
              value={inputs.appointmentFrequencyDays}
              onChange={(e) => setInputs({ ...inputs, appointmentFrequencyDays: Number(e.target.value) })}
            >
              <option value="7">Every 7 Days (Weekly)</option>
              <option value="14">Every 14 Days (Bi-weekly)</option>
              <option value="30">Every 30 Days (Monthly)</option>
              <option value="60">Every 60 Days (Bi-monthly)</option>
              <option value="90">Every 90 Days (Quarterly)</option>
            </select>
          </div>
        </div>

        {/* Right Column: Real-time ML Prediction Output & XAI Explanation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="full-width-card" style={{ borderTop: `6px solid ${mlResult?.statusColor || '#059669'}` }}>
            <div className="card-header-row">
              <div className="card-section-title">
                2. Real-Time ML Prediction Output
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary-accent)', fontWeight: 700 }}>
                {mlResult?.source || 'ML Engine Active'}
              </span>
            </div>

            {/* Large Gauge Score Output */}
            <div style={{ textAlign: 'center', padding: '24px', background: 'var(--bg-subtle)', borderRadius: '16px', margin: '12px 0' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', uppercase: 'true', letterSpacing: '1px', fontWeight: 700 }}>
                CALCULATED FOLLOW-UP RISK SCORE
              </div>

              <div style={{ fontSize: '3.8rem', fontWeight: 900, color: mlResult?.statusColor || '#059669', margin: '4px 0' }}>
                {loading ? '...' : `${mlResult?.riskScore || 0}/100`}
              </div>

              <div className={`status-badge ${mlResult?.riskLevel === 'HIGH' ? 'inactive' : mlResult?.riskLevel === 'MEDIUM' ? 'reschedule_requested' : 'active'}`} style={{ fontSize: '1rem', padding: '6px 20px' }}>
                {mlResult?.riskLevel || 'LOW'} RISK CLASSIFICATION
              </div>
            </div>

            {/* Explainability Bullet Points (As Required) */}
            {mlResult && (
              <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)', marginTop: '16px' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                  ✅ {mlResult.explanationSummary} — Clinical Explainability:
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                  {mlResult.explanationBulletPoints.map((b, i) => (
                    <div key={i} style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {b}
                    </div>
                  ))}
                </div>

                {/* Impact Feature Points */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {mlResult.factorsBreakdown.map((f, i) => (
                    <div key={i} style={{ background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{f.label}</div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: f.points > 15 ? 'var(--danger-color)' : 'var(--primary-accent)' }}>
                        +{f.points} pts <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>({f.raw})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Raw JSON Payload Debug Inspection Box */}
          <div className="full-width-card" style={{ background: '#0f172a', color: '#38bdf8', padding: '16px', borderRadius: '14px', fontFamily: 'monospace', fontSize: '0.78rem' }}>
            <div style={{ color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>
              // API Payload Inspection (POST http://127.0.0.1:5000/api/ml/predict)
            </div>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {JSON.stringify({
                patientId: 'TEST-SIMULATOR',
                missedAppointments: inputs.missedAppointments,
                distanceKm: inputs.distanceKm,
                age: inputs.age,
                treatmentDurationMonths: inputs.treatmentDurationMonths,
                appointmentFrequencyDays: inputs.appointmentFrequencyDays,
                predictionResult: {
                  score: mlResult?.riskScore,
                  level: mlResult?.riskLevel
                }
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
