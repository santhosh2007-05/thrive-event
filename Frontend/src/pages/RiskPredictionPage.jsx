import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATIENTS_WITH_RISK } from '../services/mockDataService';
import { fetchMLPrediction } from '../services/mlRiskService';
import audioService from '../services/audioService';
import smsService, { FORMATTED_PHONE_NUMBER } from '../services/smsService';

export default function RiskPredictionPage() {
  const navigate = useNavigate();
  const [mlRankedPatients, setMlRankedPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('ALL');
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    async function loadMlPredictions() {
      setLoading(true);
      const predictions = await Promise.all(
        PATIENTS_WITH_RISK.map(async (p) => {
          const mlResult = await fetchMLPrediction(p);
          return {
            ...p,
            ml: mlResult
          };
        })
      );

      // Rank Patients in Descending Order of ML Risk Score (Step 3: Patient Ranking Engine)
      predictions.sort((a, b) => b.ml.riskScore - a.ml.riskScore);
      setMlRankedPatients(predictions);
      setLoading(false);
    }

    loadMlPredictions();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    audioService.play2hReminder();
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleInterveneSms = (patient) => {
    const { nativeSmsUri } = smsService.sendSMS({
      to: FORMATTED_PHONE_NUMBER,
      patientName: patient.name,
      patientId: patient.id,
      messageType: 'REMINDER'
    });
    showToast(`SMS Intervention Dispatched to ${FORMATTED_PHONE_NUMBER} for ${patient.name}`);
    window.location.href = nativeSmsUri;
  };

  const filteredPatients = mlRankedPatients.filter(p => {
    const matchesDept = selectedDept === 'ALL' || p.department === selectedDept;
    const matchesLevel = selectedRiskLevel === 'ALL' || p.ml.riskLevel === selectedRiskLevel;
    return matchesDept && matchesLevel;
  });

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
              Machine Learning Follow-Up Risk Engine
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0', color: 'white' }}>
              Predictive Patient Ranking & Clinical Explanations
            </h1>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1', display: 'flex', gap: '16px' }}>
              <span>ML Engine: <strong>scikit-learn RandomForest v2.1</strong></span>
              <span>Predict &rarr; Identify &rarr; Intervene &rarr; Improve Attendance</span>
            </div>
          </div>

          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '8px 16px', borderRadius: '30px', color: '#065f46', fontSize: '0.8rem', fontWeight: 700 }}>
            ● ML Model Live Active
          </div>
        </div>
      </div>

      {/* 5-Step System Workflow Summary Card */}
      <div className="full-width-card" style={{ background: 'var(--bg-subtle)', padding: '20px' }}>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '12px' }}>
          5-Stage Predictive Clinical Workflow:
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.8rem' }}>
          <div style={{ background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <strong style={{ color: 'var(--primary-accent)', display: 'block' }}>1. Patient Information</strong>
            Missed history, distance, age, frequency, duration.
          </div>
          <div style={{ background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <strong style={{ color: 'var(--primary-accent)', display: 'block' }}>2. Risk Score Calculation</strong>
            ML probability score (e.g. 87/100 HIGH RISK).
          </div>
          <div style={{ background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <strong style={{ color: 'var(--primary-accent)', display: 'block' }}>3. Priority Patient Ranking</strong>
            Immediate sorting: 🔴 High &rarr; 🟠 Med &rarr; 🟢 Low.
          </div>
          <div style={{ background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <strong style={{ color: 'var(--primary-accent)', display: 'block' }}>4. Transparent Explanation</strong>
            Bullet point factor impact breakdown.
          </div>
          <div style={{ background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <strong style={{ color: 'var(--primary-accent)', display: 'block' }}>5. Pre-Appointment Intervention</strong>
            Call, SMS (7598357132), & Visit Confirmation.
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
          <option value="HIGH">🔴 High Risk (≥70%)</option>
          <option value="MEDIUM">🟠 Medium Risk (45-69%)</option>
          <option value="LOW">🟢 Low Risk (&lt;45%)</option>
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

      {/* Ranked Patients List with ML Explainability & Intervention Actions */}
      {loading ? (
        <div className="full-width-card" style={{ textAlign: 'center', padding: '40px' }}>
          Computing ML Risk Predictions & Ranking...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {filteredPatients.map((patient, rankIdx) => {
            const isHigh = patient.ml.riskScore >= 70;
            const isMed = patient.ml.riskScore >= 45 && patient.ml.riskScore < 70;
            const badgeIcon = isHigh ? '🔴' : isMed ? '🟠' : '🟢';

            return (
              <div
                key={patient.id}
                className="full-width-card"
                style={{ borderLeft: `6px solid ${patient.ml.statusColor}` }}
              >
                <div className="card-header-row">
                  {/* Rank Badge & Patient Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'var(--text-main)',
                      color: 'var(--bg-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '0.9rem'
                    }}>
                      #{rankIdx + 1}
                    </span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1rem' }}>{badgeIcon}</span>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 800 }}>
                          {patient.name} ({patient.id})
                        </h3>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Age {patient.age} • {patient.department} • Next Visit: {patient.nextFollowUpDate} ({patient.nextFollowUpTime})
                      </span>
                    </div>
                  </div>

                  {/* ML Risk Score & Intervention Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: patient.ml.statusColor }}>
                        {patient.ml.riskScore}/100
                      </div>
                      <span className={`status-badge ${isHigh ? 'inactive' : isMed ? 'reschedule_requested' : 'active'}`}>
                        {patient.ml.riskLevel} RISK
                      </span>
                    </div>

                    {/* Step 5: Intervene Before Appointment */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <a
                        href={`tel:${patient.phone}`}
                        className="btn-primary"
                        style={{ padding: '8px 14px', fontSize: '0.8rem', textDecoration: 'none' }}
                      >
                        Call Phone ({patient.phone})
                      </a>
                      <button
                        className="btn-secondary"
                        style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                        onClick={() => handleInterveneSms(patient)}
                      >
                        SMS ({FORMATTED_PHONE_NUMBER})
                      </button>
                      <button
                        className="btn-secondary"
                        style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                        onClick={() => navigate(`/patients/${patient.id}`)}
                      >
                        View Full Record
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 4: Transparent Explainability & Bullet Points */}
                <div style={{ marginTop: '16px', background: 'var(--bg-subtle)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      ✅ {patient.ml.explanationSummary} — Clinical Explanation Breakdown:
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {patient.ml.source}
                    </span>
                  </div>

                  {/* Bullet Points Format (As Requested) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                    {patient.ml.explanationBulletPoints.map((reason, idx) => (
                      <div key={idx} style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {reason}
                      </div>
                    ))}
                  </div>

                  {/* Feature Impact Points */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                    {patient.ml.factorsBreakdown.map((factor, idx) => (
                      <div key={idx} style={{ background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{factor.label}</div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: factor.points > 15 ? 'var(--danger-color)' : 'var(--primary-accent)' }}>
                          +{factor.points} pts <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>({factor.raw})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
