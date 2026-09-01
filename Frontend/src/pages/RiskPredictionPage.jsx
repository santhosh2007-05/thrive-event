import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATIENTS_WITH_RISK } from '../services/mockDataService';
import { DEFAULT_RISK_WEIGHTS, MODEL_VERSION, LAST_UPDATED, calculateRiskScore } from '../services/riskEngine';
import audioService from '../services/audioService';

export default function RiskPredictionPage() {
  const navigate = useNavigate();
  const [weights, setWeights] = useState(DEFAULT_RISK_WEIGHTS);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('ALL');
  const [toastMsg, setToastMsg] = useState('');

  // Re-calculate patients with active weights
  const rankedPatients = PATIENTS_WITH_RISK.map(p => {
    const updatedRisk = calculateRiskScore({
      missedCount: p.missedAppointmentsCount,
      distanceKm: p.distanceKm,
      frequencyDays: p.appointmentFrequencyDays,
      durationMonths: p.treatmentDurationMonths,
      age: p.age
    }, weights);
    return { ...p, risk: updatedRisk };
  }).sort((a, b) => b.risk.riskScore - a.risk.riskScore);

  const filteredPatients = rankedPatients.filter(p => {
    const matchesDept = selectedDept === 'ALL' || p.department === selectedDept;
    const matchesLevel = selectedRiskLevel === 'ALL' || p.risk.riskLevel === selectedRiskLevel;
    return matchesDept && matchesLevel;
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    audioService.play2hReminder();
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleSaveWeights = (e) => {
    e.preventDefault();
    const sum = Object.values(weights).reduce((a, b) => Number(a) + Number(b), 0);
    if (sum !== 100) {
      showToast(`Warning: Weights sum to ${sum}%. Recommended total is 100%.`);
    } else {
      showToast('Risk prediction engine weights updated successfully!');
    }
    setShowConfigModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMsg && (
        <div style={{ background: '#059669', color: 'white', padding: '12px 20px', borderRadius: '30px', fontWeight: 600 }}>
          ✓ {toastMsg}
        </div>
      )}

      {/* Header Banner with Curated AI Medical Analytics Photography */}
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
          backgroundImage: 'linear-gradient(90deg, rgba(24,24,22,0.92) 0%, rgba(24,24,22,0.65) 100%), url(https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1
        }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              Predictive Analytics Engine
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0', color: 'white' }}>
              Follow-up Risk Prediction & Ranking
            </h1>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1', display: 'flex', gap: '16px' }}>
              <span>Model Version: <strong>{MODEL_VERSION}</strong></span>
              <span>Last Updated: <strong>{LAST_UPDATED}</strong></span>
              <span>Decision Support System (No fabricated claims)</span>
            </div>
          </div>

          <button
            className="btn-primary"
            style={{ background: '#059669' }}
            onClick={() => setShowConfigModal(true)}
          >
            Configure Scoring Weights
          </button>
        </div>
      </div>

      {/* Transparent Scoring Formula Summary */}
      <div className="full-width-card" style={{ background: 'var(--bg-subtle)', padding: '16px 20px' }}>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '8px' }}>
          Transparent Algorithm Weights:
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.85rem' }}>
          <div style={{ background: 'var(--bg-surface)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            Missed Appointments: <strong style={{ color: 'var(--danger-color)' }}>{weights.missedAppointments}%</strong>
          </div>
          <div style={{ background: 'var(--bg-surface)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            Distance from Hospital: <strong style={{ color: 'var(--warning-color)' }}>{weights.distance}%</strong>
          </div>
          <div style={{ background: 'var(--bg-surface)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            Appointment Frequency: <strong style={{ color: 'var(--warning-color)' }}>{weights.frequency}%</strong>
          </div>
          <div style={{ background: 'var(--bg-surface)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            Treatment Duration: <strong style={{ color: 'var(--info-color)' }}>{weights.treatmentDuration}%</strong>
          </div>
          <div style={{ background: 'var(--bg-surface)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            Age Factor: <strong style={{ color: 'var(--primary-accent)' }}>{weights.age}%</strong>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <select
          className="form-control"
          value={selectedRiskLevel}
          onChange={(e) => setSelectedRiskLevel(e.target.value)}
          style={{ width: 'auto' }}
        >
          <option value="ALL">All Risk Levels</option>
          <option value="VERY HIGH">VERY HIGH Risk (≥85%)</option>
          <option value="HIGH">HIGH Risk (70-84%)</option>
          <option value="MEDIUM">MEDIUM Risk (45-69%)</option>
          <option value="LOW">LOW Risk (&lt;45%)</option>
        </select>

        <select
          className="form-control"
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          style={{ width: 'auto' }}
        >
          <option value="ALL">All Departments</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Orthopedics">Orthopedics</option>
          <option value="Endocrinology">Endocrinology</option>
          <option value="Dermatology">Dermatology</option>
          <option value="Neurology">Neurology</option>
        </select>
      </div>

      {/* Ranked Patients List with Explainability */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredPatients.map((patient, rankIdx) => (
          <div key={patient.id} className="full-width-card" style={{ borderLeft: `6px solid ${patient.risk.riskScore >= 70 ? 'var(--danger-color)' : 'var(--primary-accent)'}` }}>
            <div className="card-header-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--text-main)',
                  color: 'var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem'
                }}>
                  #{rankIdx + 1}
                </span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 700 }}>
                    {patient.name} ({patient.id})
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Age {patient.age} • {patient.department} • Next Visit: {patient.nextFollowUpDate} ({patient.nextFollowUpTime})
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: patient.risk.riskScore >= 70 ? 'var(--danger-color)' : 'var(--primary-accent)' }}>
                    {patient.risk.riskScore}%
                  </div>
                  <span className={`status-badge ${patient.risk.riskScore >= 70 ? 'inactive' : 'active'}`}>
                    {patient.risk.riskLevel} RISK
                  </span>
                </div>

                <button
                  className="btn-primary"
                  onClick={() => navigate(`/patients/${patient.id}`)}
                >
                  View Profile & Intervene
                </button>
              </div>
            </div>

            {/* Explainability Breakdown */}
            <div style={{ marginTop: '16px', background: 'var(--bg-subtle)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                Contributing Factor Impact Breakdown:
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '12px' }}>
                {patient.risk.factorsSorted.map(f => (
                  <div key={f.key} style={{ background: 'var(--bg-surface)', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{f.label}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: f.points > 10 ? 'var(--danger-color)' : 'var(--primary-accent)' }}>
                      +{f.points} pts <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>({f.raw})</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontStyle: 'italic', background: 'var(--bg-surface)', padding: '10px', borderRadius: '8px', borderLeft: '3px solid var(--primary-accent)' }}>
                "{patient.risk.explanation}"
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Configure Algorithm Weights */}
      {showConfigModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Configure Risk Model Scoring Weights</h3>
              <button className="modal-close-btn" onClick={() => setShowConfigModal(false)}>✕</button>
            </div>

            <form className="modal-form" onSubmit={handleSaveWeights}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Adjust weights to calibrate risk calculation engine ({MODEL_VERSION}).
              </p>

              <div className="form-group">
                <label>Missed Appointments History (%)</label>
                <input
                  type="number"
                  className="form-control"
                  value={weights.missedAppointments}
                  onChange={(e) => setWeights({ ...weights, missedAppointments: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Distance from Hospital (%)</label>
                <input
                  type="number"
                  className="form-control"
                  value={weights.distance}
                  onChange={(e) => setWeights({ ...weights, distance: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Appointment Frequency Gap (%)</label>
                <input
                  type="number"
                  className="form-control"
                  value={weights.frequency}
                  onChange={(e) => setWeights({ ...weights, frequency: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Treatment Duration (%)</label>
                <input
                  type="number"
                  className="form-control"
                  value={weights.treatmentDuration}
                  onChange={(e) => setWeights({ ...weights, treatmentDuration: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Age Factor (%)</label>
                <input
                  type="number"
                  className="form-control"
                  value={weights.age}
                  onChange={(e) => setWeights({ ...weights, age: Number(e.target.value) })}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowConfigModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Model Configuration</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
