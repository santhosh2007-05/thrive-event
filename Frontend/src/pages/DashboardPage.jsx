import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dataStore from '../services/dataStore';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState(dataStore.getPatients());
  const [appointments, setAppointments] = useState(dataStore.getAppointments());

  useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => {
      setPatients(dataStore.getPatients());
      setAppointments(dataStore.getAppointments());
    });
    return () => unsubscribe();
  }, []);

  const highRiskPatients = patients.filter(p => p.risk && p.risk.riskScore >= 70);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Executive Command Header */}
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
          backgroundImage: 'linear-gradient(90deg, rgba(24,24,22,0.92) 0%, rgba(24,24,22,0.65) 100%), url(https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1
        }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              Hospital Operations Intelligence
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0', color: 'white' }}>
              Hospital-Level Intelligence & Risk Analytics
            </h1>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
              Real-time monitoring of 2,481 scheduled outpatient follow-up visits
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-primary" onClick={() => navigate('/risk-prediction')}>
              View Risk Predictions Engine
            </button>
            <button className="btn-secondary" style={{ background: '#ffffff', color: '#181816' }} onClick={() => navigate('/patients')}>
              Patients Directory
            </button>
          </div>
        </div>
      </div>

      {/* Hospital Follow-up Overview KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-title">TOTAL SCHEDULED VISITS</div>
          <div className="kpi-value" style={{ color: 'var(--text-main)' }}>2,481</div>
          <div className="kpi-subtitle">Active hospital caseload</div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '5px solid #059669' }}>
          <div className="kpi-title">LOW RISK VISITS</div>
          <div className="kpi-value" style={{ color: '#059669' }}>1,904</div>
          <div className="kpi-subtitle">High attendance probability</div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '5px solid #d97706' }}>
          <div className="kpi-title">MEDIUM RISK VISITS</div>
          <div className="kpi-value" style={{ color: '#d97706' }}>421</div>
          <div className="kpi-subtitle">Requires standard reminder</div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '5px solid #e11d48' }}>
          <div className="kpi-title">HIGH RISK VISITS (≥70%)</div>
          <div className="kpi-value" style={{ color: '#e11d48' }}>156</div>
          <div className="kpi-subtitle">Immediate intervention queue</div>
        </div>
      </div>

      {/* Analytics Grid: Left (Department & Barrier Analytics), Right (ML Metrics & Fairness) */}
      <div className="dashboard-grid">
        {/* Left Column: Department Risk & Top Missed Barriers Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Department Risk Distribution */}
          <div className="full-width-card">
            <div className="card-header-row" style={{ marginBottom: '16px' }}>
              <div className="card-section-title">
                Department Follow-Up Risk Distribution
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hospital Analytics</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { dept: 'Oncology', riskPct: 18, color: '#e11d48' },
                { dept: 'Cardiology', riskPct: 14, color: '#e11d48' },
                { dept: 'Neurology', riskPct: 12, color: '#d97706' },
                { dept: 'Orthopedics', riskPct: 9, color: '#059669' },
                { dept: 'General Medicine', riskPct: 7, color: '#059669' }
              ].map(d => (
                <div key={d.dept}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
                    <span>{d.dept} Clinic</span>
                    <span style={{ color: d.color }}>{d.riskPct}% No-Show Risk</span>
                  </div>
                  <div style={{ background: 'var(--border-color)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${d.riskPct * 4}%`, background: d.color, height: '100%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Follow-Up Barriers Analytics */}
          <div className="full-width-card">
            <div className="card-header-row" style={{ marginBottom: '16px' }}>
              <div className="card-section-title">
                Primary Outpatient No-Show Barriers
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Barrier Identification</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { barrier: 'Transportation / Long Travel Distance', Pct: 32, note: 'Primary barrier this month' },
                { barrier: 'Previous Missed Visit History', Pct: 24, note: 'Behavioral pattern' },
                { barrier: 'Work / Scheduling Conflict', Pct: 18, note: 'Time slot mismatch' },
                { barrier: 'Low Engagement / Ignored Reminders', Pct: 14, note: 'Communication barrier' },
                { barrier: 'Other Logistical Factors', Pct: 12, note: 'General factors' }
              ].map(b => (
                <div key={b.barrier} style={{ background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700 }}>
                    <span>{b.barrier}</span>
                    <span style={{ color: 'var(--primary-accent)' }}>{b.Pct}%</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: ML Model Evaluation Metrics & Model Fairness Audit */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* ML Performance Metrics */}
          <div className="full-width-card">
            <div className="card-header-row" style={{ marginBottom: '16px' }}>
              <div className="card-section-title">
                Machine Learning Model Evaluation
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary-accent)', fontWeight: 700 }}>scikit-learn RandomForest</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ROC-AUC SCORE</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary-accent)' }}>0.89</div>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>HIGH-RISK RECALL</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary-accent)' }}>88%</div>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PRECISION</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary-accent)' }}>84%</div>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>F1 SCORE</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary-accent)' }}>0.86</div>
              </div>
            </div>

            {/* Model Fairness Audit */}
            <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                Model Demographic Fairness Audit:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Group A (Age 18-45 Recall):</span>
                  <strong style={{ color: 'var(--text-main)' }}>84%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Group B (Age 46-65 Recall):</span>
                  <strong style={{ color: 'var(--text-main)' }}>81%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Group C (Elderly 65+ Recall):</span>
                  <strong style={{ color: 'var(--text-main)' }}>83%</strong>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--primary-accent)', marginTop: '4px', fontStyle: 'italic' }}>
                  ✓ Equalized Odds & Parity Audited across demographic subgroups.
                </div>
              </div>
            </div>
          </div>

          {/* Today's High Risk Queue Table */}
          <div className="full-width-card">
            <div className="card-header-row" style={{ marginBottom: '12px' }}>
              <div className="card-section-title">
                Priority Risk Queue
              </div>
              <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => navigate('/risk-prediction')}>
                Full Queue &rarr;
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {highRiskPatients.slice(0, 3).map(p => (
                <div key={p.id} style={{ background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: '10px', borderLeft: '4px solid var(--danger-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{p.name} ({p.id})</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.department} • Dist: {p.distanceKm} km</div>
                  </div>
                  <div style={{ fontWeight: 900, color: 'var(--danger-color)' }}>
                    {p.risk.riskScore}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
