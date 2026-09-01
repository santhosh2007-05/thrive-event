import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dataStore from '../services/dataStore';
import InteractiveDonutChart from '../components/analytics/InteractiveDonutChart';
import InteractiveLineChart from '../components/analytics/InteractiveLineChart';
import smsService, { FORMATTED_PHONE_NUMBER } from '../services/smsService';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState(dataStore.getPatients());

  useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => {
      setPatients(dataStore.getPatients());
    });
    return () => unsubscribe();
  }, []);

  const highRiskPatients = patients.filter(p => p.risk && p.risk.riskScore >= 40);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Executive Operations Header Banner */}
      <div className="full-width-card" style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        minHeight: '150px',
        display: 'flex',
        alignItems: 'center',
        padding: '32px',
        color: 'white',
        boxShadow: 'var(--shadow-soft)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'linear-gradient(90deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.7) 100%), url(https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1
        }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1.2px', fontWeight: 800 }}>
              HOSPITAL RISK & FOLLOW-UP PLATFORM
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0', color: 'white' }}>
              CareTrack Operations Command Center
            </h1>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
              Real-time intelligence and follow-up management across 2,481 active outpatient visits
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-primary" onClick={() => navigate('/risk-prediction')}>
              ML Risk Engine &rarr;
            </button>
            <button className="btn-secondary" style={{ background: '#ffffff', color: '#0f172a' }} onClick={() => navigate('/patients')}>
              Patients Directory
            </button>
          </div>
        </div>
      </div>

      {/* Top Row: 4 Clean Boxed KPI Cards with Trend Indicators */}
      <div className="kpi-grid">
        <div className="kpi-card" style={{ borderLeft: '5px solid #0284c7' }}>
          <div className="kpi-title">TOTAL SCHEDULED VISITS</div>
          <div className="kpi-value" style={{ color: 'var(--text-main)' }}>2,481</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Active hospital caseload</span>
            <span style={{ color: '#059669', fontWeight: 800 }}>▲ 8.2% vs last wk</span>
          </div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '5px solid #059669' }}>
          <div className="kpi-title">LOW RISK VISITS (0-30%)</div>
          <div className="kpi-value" style={{ color: '#059669' }}>1,904</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>High attendance probability</span>
            <span style={{ color: '#059669', fontWeight: 800 }}>▲ 6.7% vs last wk</span>
          </div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '5px solid #d97706' }}>
          <div className="kpi-title">MEDIUM RISK VISITS (31-69%)</div>
          <div className="kpi-value" style={{ color: '#d97706' }}>421</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Requires standard reminder</span>
            <span style={{ color: '#d97706', fontWeight: 800 }}>▼ 3.1% vs last wk</span>
          </div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '5px solid #e11d48' }}>
          <div className="kpi-title">HIGH RISK VISITS (≥70%)</div>
          <div className="kpi-value" style={{ color: '#e11d48' }}>156</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Immediate intervention queue</span>
            <span style={{ color: '#e11d48', fontWeight: 800 }}>▲ 12.4% vs last wk</span>
          </div>
        </div>
      </div>

      {/* Middle Row: 3-Column Analytics Grid (Donut Chart, Line Graph, Alerts Feed) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Card 1: Interactive Donut Chart */}
        <div className="full-width-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="card-header-row" style={{ marginBottom: '16px' }}>
            <div className="card-section-title">
              Risk Distribution Overview
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hover for data</span>
          </div>
          <InteractiveDonutChart />
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '12px' }}>
            Last updated: Today, 09:30 AM • Real-time Sync
          </div>
        </div>

        {/* Card 2: Interactive Line Graph */}
        <div className="full-width-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="card-header-row" style={{ marginBottom: '16px' }}>
            <div className="card-section-title">
              7-Day Risk Trend Analysis
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary-accent)', fontWeight: 700 }}>Interactive Nodes</span>
          </div>
          <InteractiveLineChart />
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '12px' }}>
            Calculated across 2,481 active outpatient appointments
          </div>
        </div>

        {/* Card 3: High Risk Alerts Feed */}
        <div className="full-width-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="card-header-row" style={{ marginBottom: '16px' }}>
            <div className="card-section-title">
              High Risk Clinical Alerts
            </div>
            <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => navigate('/notifications')}>
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { id: 'P-1002', name: 'Shriakash S', score: 87, reason: 'Missed 4 follow-up visits', time: '10 mins ago', color: '#e11d48' },
              { id: 'P-1003', name: 'Prajan Soorya', score: 56, reason: 'High hospital travel distance', time: '25 mins ago', color: '#d97706' },
              { id: 'P-1004', name: 'Rahul R', score: 42, reason: 'No response to digital SMS', time: '1 hr ago', color: '#d97706' },
              { id: 'P-1006', name: 'Karthik Sundaram', score: 38, reason: 'Communication barrier noted', time: '2 hrs ago', color: '#059669' }
            ].map(alert => (
              <div key={alert.id} style={{ background: 'var(--bg-subtle)', padding: '10px 12px', borderRadius: '10px', borderLeft: `4px solid ${alert.color}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    {alert.name} ({alert.id})
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{alert.reason}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 900, color: alert.color, fontSize: '0.95rem' }}>{alert.score}%</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{alert.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: High Risk Queue Table & Communication Activity Widget */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* High Risk Patients Queue Table */}
        <div className="full-width-card">
          <div className="card-header-row" style={{ marginBottom: '16px' }}>
            <div className="card-section-title">
              Priority Patient Follow-Up Queue
            </div>
            <button className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={() => navigate('/risk-prediction')}>
              Full Queue &rarr;
            </button>
          </div>

          <div className="table-responsive">
            <table className="admin-data-table" style={{ width: '100%', fontSize: '0.82rem' }}>
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Name</th>
                  <th>Risk Score</th>
                  <th>Next Follow-up</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {highRiskPatients.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 700 }}>{p.id}</td>
                    <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{p.name}</td>
                    <td style={{ fontWeight: 900, color: p.risk.riskScore >= 70 ? 'var(--danger-color)' : 'var(--warning-color)' }}>
                      {p.risk.riskScore}%
                    </td>
                    <td>{p.nextFollowUpDate}</td>
                    <td>
                      <button
                        className="btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        onClick={() => navigate(`/patients/${p.id}`)}
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Communication Activity & Automated Outreach Widget */}
        <div className="full-width-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="card-header-row" style={{ marginBottom: '16px' }}>
            <div className="card-section-title">
              Communication & Outreach Activity (Today)
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary-accent)', fontWeight: 700 }}>Line: +91 7598357132</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>💬 SMS Sent</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary-accent)', margin: '4px 0' }}>120</div>
              <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>▲ 15% vs yesterday</div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📞 Voice Calls Made</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--info-color)', margin: '4px 0' }}>45</div>
              <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>▲ 8% vs yesterday</div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📱 WhatsApp Sent</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#8b5cf6', margin: '4px 0' }}>68</div>
              <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>▲ 12% vs yesterday</div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>⚠️ No Response</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--danger-color)', margin: '4px 0' }}>12</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--danger-color)', fontWeight: 700 }}>▼ 5% vs yesterday</div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Auto-reminders scheduled for 421 medium risk patients (Next batch: 02:00 PM IST)
            </div>
            <button
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              onClick={() => {
                smsService.sendSMS({
                  to: FORMATTED_PHONE_NUMBER,
                  patientName: 'Medium Risk Cohort',
                  patientId: 'BATCH-421',
                  messageType: 'REMINDER'
                });
                alert('Automated Batch Outreach Reminders Dispatched to +91 7598357132!');
              }}
            >
              Trigger Batch Reminders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
