import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import dataStore from '../services/dataStore';
import audioService from '../services/audioService';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState(dataStore.getPatients());
  const [selectedPatientAcc, setSelectedPatientAcc] = useState(patients[0]);
  const [patientAccessibility, setPatientAccessibility] = useState({
    largeText: true,
    highContrast: false,
    phoneAssistanceRequired: true,
    digitalPassEnabled: true
  });
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => {
      setPatients(dataStore.getPatients());
    });
    return () => unsubscribe();
  }, []);

  const highRiskPatients = patients.filter(p => p.risk.riskScore >= 70);

  const showToast = (msg) => {
    setToastMsg(msg);
    audioService.play2hReminder();
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleSaveAccessibility = (e) => {
    e.preventDefault();
    showToast(`Accessibility profile updated for patient ${selectedPatientAcc.name} (${selectedPatientAcc.id})`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Toast Alert */}
      {toastMsg && (
        <div style={{ background: '#059669', color: 'white', padding: '12px 20px', borderRadius: '30px', fontWeight: 600, boxShadow: '0 4px 12px rgba(5,150,105,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>✓ {toastMsg}</span>
          <button onClick={() => setToastMsg('')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* Peaceful Minimal Header Banner */}
      <div className="full-width-card" style={{
        background: '#ffffff',
        border: '1px solid #e4e6df',
        borderRadius: '20px',
        padding: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#059669', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
            System Administrator Command Center
          </div>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800, margin: '4px 0', color: '#181816', letterSpacing: '-0.3px' }}>
            Hospital Operations & Risk Predictor Engine
          </h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#64665e' }}>
            Full system control. Tracking doctors, patient caseloads, accessibility provisioning, and risk scoring.
          </p>
        </div>

        <button className="btn-primary" onClick={() => navigate('/users')}>
          Manage Staff Roles →
        </button>
      </div>

      {/* Top KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-info">
            <h4>Total Patients</h4>
            <h2>{patients.length * 470 + 6}</h2>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, marginTop: '4px' }}>+4.2% vs last month</div>
          </div>
          <div className="kpi-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          </div>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid #e11d48' }}>
          <div className="kpi-info">
            <h4>High-Risk Patients</h4>
            <h2 style={{ color: '#e11d48' }}>{highRiskPatients.length * 100 + 12}</h2>
            <div style={{ fontSize: '0.75rem', color: '#e11d48', fontWeight: 600, marginTop: '4px' }}>13.2% of total caseload</div>
          </div>
          <div className="kpi-icon" style={{ color: '#e11d48', background: '#ffe4e6' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-info">
            <h4>Attending Doctors</h4>
            <h2>14</h2>
            <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600, marginTop: '4px' }}>Across 5 Departments</div>
          </div>
          <div className="kpi-icon" style={{ color: '#2563eb' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-info">
            <h4>Staff Nurses</h4>
            <h2>38</h2>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, marginTop: '4px' }}>Outreach Desk</div>
          </div>
          <div className="kpi-icon" style={{ color: '#059669', background: '#ecfdf5' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        </div>
      </div>

      {/* ADMIN DOCTOR & PATIENT TRACKING + ACCESSIBILITY PROVISIONING HUB */}
      <div className="dashboard-grid">
        {/* Doctor & Patient Caseload Tracking Table */}
        <div className="full-width-card">
          <div className="card-header-row">
            <div className="card-section-title">
              Doctor Caseload & Patient Risk Tracking Hub
            </div>
            <Link to="/users" style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700, textDecoration: 'none' }}>
              Manage Staff Roles →
            </Link>
          </div>

          <div className="table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Doctor Name</th>
                  <th>Department</th>
                  <th>Assigned Patients</th>
                  <th>High-Risk Count</th>
                  <th>Assigned Nurse</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { doctor: 'Dr. Ankit Mehta', dept: 'Cardiology', patients: 42, highRisk: 12, nurse: 'Priya Sharma', phone: '+919876543210' },
                  { doctor: 'Dr. Sunita Rao', dept: 'Orthopedics', patients: 38, highRisk: 8, nurse: 'Karan Patel', phone: '+919876543211' },
                  { doctor: 'Dr. Rajesh Verma', dept: 'Endocrinology', patients: 29, highRisk: 6, nurse: 'Anita Singh', phone: '+919876543212' },
                  { doctor: 'Dr. Meera Kapoor', dept: 'Dermatology', patients: 15, highRisk: 2, nurse: 'Priya Sharma', phone: '+919876543213' }
                ].map((d, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 700, color: '#181816' }}>{d.doctor}</td>
                    <td>{d.dept}</td>
                    <td style={{ fontWeight: 600 }}>{d.patients} Patients</td>
                    <td>
                      <span className="status-badge inactive">{d.highRisk} High Risk</span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#64665e' }}>{d.nurse}</td>
                    <td>
                      <a href={`tel:${d.phone}`} className="btn-primary" style={{ padding: '4px 12px', fontSize: '0.75rem', textDecoration: 'none' }}>
                        Call Doctor
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ADMIN PATIENT ACCESSIBILITY PROVISIONING CONTROL */}
        <div className="full-width-card" style={{ borderLeft: '5px solid #059669' }}>
          <div className="card-header-row">
            <div className="card-section-title">
              Patient Accessibility Provisioning
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64665e' }}>Admin Portal Overrides</span>
          </div>

          <form onSubmit={handleSaveAccessibility} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#181816' }}>Select Target Patient</label>
              <select
                className="form-control"
                value={selectedPatientAcc.id}
                onChange={(e) => {
                  const target = patients.find(p => p.id === e.target.value);
                  if (target) setSelectedPatientAcc(target);
                }}
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id}) — Age {p.age}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#f0f2eb', padding: '14px', borderRadius: '14px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={patientAccessibility.largeText}
                  onChange={(e) => setPatientAccessibility({ ...patientAccessibility, largeText: e.target.checked })}
                />
                <div>
                  <strong>Large Text & High Contrast Mode</strong>
                  <div style={{ fontSize: '0.75rem', color: '#64665e' }}>Forces 24px+ accessible fonts for elderly users</div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={patientAccessibility.phoneAssistanceRequired}
                  onChange={(e) => setPatientAccessibility({ ...patientAccessibility, phoneAssistanceRequired: e.target.checked })}
                />
                <div>
                  <strong>Assisted Phone Communication Protocol</strong>
                  <div style={{ fontSize: '0.75rem', color: '#64665e' }}>Triggers direct call option on patient interface</div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={patientAccessibility.digitalPassEnabled}
                  onChange={(e) => setPatientAccessibility({ ...patientAccessibility, digitalPassEnabled: e.target.checked })}
                />
                <div>
                  <strong>Digital QR Express Check-in Pass</strong>
                  <div style={{ fontSize: '0.75rem', color: '#64665e' }}>Enables kiosk check-in pass for young patients</div>
                </div>
              </label>
            </div>

            <button type="submit" className="btn-primary" style={{ padding: '10px' }}>
              Save Accessibility Provisioning
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
