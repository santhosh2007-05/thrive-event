import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dataStore from '../services/dataStore';

export default function DoctorDashboardPage() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState(dataStore.getPatients());
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('ALL');

  useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => {
      setPatients(dataStore.getPatients());
    });
    return () => unsubscribe();
  }, []);

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDoctor = doctorFilter === 'ALL' || p.assignedDoctor === doctorFilter;
    return matchesSearch && matchesDoctor;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Doctor Executive Banner */}
      <div style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        minHeight: '150px',
        display: 'flex',
        alignItems: 'center',
        padding: '32px',
        color: 'white',
        background: 'var(--bg-surface)',
        boxShadow: 'var(--shadow-soft)',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'linear-gradient(90deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.7) 100%), url(https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1
        }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1.2px', fontWeight: 800 }}>
              CLINICAL PHYSICIAN WORKSTATION
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0', color: 'white' }}>
              Overview of Attending Doctors & Patient Caseload
            </h1>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
              Dr. Sundaramurthy Iyer (Cardiology Lead) • Hospital Outpatient Division
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-primary" onClick={() => navigate('/risk-prediction')}>
              ML Risk Predictions &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Attending Doctors Roster Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {[
          { name: 'Dr. Sundaramurthy Iyer', dept: 'Cardiology', count: 3, highRisk: 1 },
          { name: 'Dr. Venkatesh Ramanathan', dept: 'Orthopedics', count: 1, highRisk: 0 },
          { name: 'Dr. Subramanian Natarajan', dept: 'Endocrinology', count: 1, highRisk: 0 },
          { name: 'Dr. Kausalya Krishnaswamy', dept: 'Dermatology', count: 1, highRisk: 0 }
        ].map((doc, idx) => (
          <div
            key={idx}
            style={{
              background: 'var(--bg-surface)',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              padding: '16px 20px',
              borderLeft: `5px solid ${doc.highRisk > 0 ? '#e11d48' : '#059669'}`,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-soft)'
            }}
            onClick={() => setDoctorFilter(doc.name)}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              {doc.dept} Specialist
            </div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)', margin: '4px 0' }}>
              {doc.name}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Assigned Patients: <strong>{doc.count}</strong></span>
              {doc.highRisk > 0 && (
                <span style={{ color: '#e11d48', fontWeight: 800 }}>🔴 {doc.highRisk} High Risk</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Search & Doctor Filter Bar */}
      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        padding: '16px 20px',
        boxShadow: 'var(--shadow-soft)'
      }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search patient name, ID, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: '1 1 300px' }}
          />

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Filter Doctor:</span>
            <select
              className="form-control"
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="ALL">All Attending Doctors</option>
              <option value="Dr. Sundaramurthy Iyer">Dr. Sundaramurthy Iyer (Cardiology)</option>
              <option value="Dr. Venkatesh Ramanathan">Dr. Venkatesh Ramanathan (Orthopedics)</option>
              <option value="Dr. Subramanian Natarajan">Dr. Subramanian Natarajan (Endocrinology)</option>
              <option value="Dr. Kausalya Krishnaswamy">Dr. Kausalya Krishnaswamy (Dermatology)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 📋 BULLETPROOF INLINE-STYLED DOCTORS PATIENT CASELOAD OVERVIEW TABLE */}
      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-soft)'
      }}>
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-subtle)', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Patient ID</th>
                <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Patient Details</th>
                <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Age / Contact</th>
                <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Last Visit</th>
                <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Next Follow-up</th>
                <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Risk Score</th>
                <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Risk Level</th>
                <th style={{ padding: '16px 18px', fontWeight 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Follow-up Status</th>
                <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assigned Staff</th>
                <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map(p => {
                  const rScore = p.risk ? p.risk.riskScore : 12;
                  const rLevel = p.risk ? p.risk.riskLevel : 'LOW';
                  const isHigh = rScore >= 70;
                  const isMed = rScore >= 45 && rScore < 70;

                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--primary-accent)' }}>
                        {p.id}
                      </td>
                      <td style={{ padding: '16px 18px' }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.92rem' }}>{p.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.department}</div>
                      </td>
                      <td style={{ padding: '16px 18px' }}>
                        <div>{p.age} yrs</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.phone}</div>
                      </td>
                      <td style={{ padding: '16px 18px', color: 'var(--text-muted)' }}>
                        {p.lastVisitDate}
                      </td>
                      <td style={{ padding: '16px 18px' }}>
                        <div style={{ fontWeight: 700 }}>{p.nextFollowUpDate}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.nextFollowUpTime}</div>
                      </td>
                      <td style={{ padding: '16px 18px', fontWeight: 900, fontSize: '1.05rem', color: isHigh ? 'var(--danger-color)' : isMed ? 'var(--warning-color)' : 'var(--text-main)' }}>
                        {rScore}%
                      </td>
                      <td style={{ padding: '16px 18px' }}>
                        <span style={{
                          background: isHigh ? 'var(--danger-soft)' : isMed ? 'var(--warning-soft)' : 'var(--accent-soft)',
                          color: isHigh ? 'var(--danger-color)' : isMed ? 'var(--warning-color)' : 'var(--primary-accent)',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          display: 'inline-block'
                        }}>
                          {rLevel}
                        </span>
                      </td>
                      <td style={{ padding: '16px 18px' }}>
                        <span style={{
                          background: p.status === 'Confirmed' ? 'var(--accent-soft)' : 'var(--warning-soft)',
                          color: p.status === 'Confirmed' ? 'var(--primary-accent)' : 'var(--warning-color)',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          display: 'inline-block'
                        }}>
                          ● {p.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '16px 18px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <strong style={{ color: 'var(--text-main)' }}>{p.assignedDoctor || 'Dr. Sundaramurthy Iyer'}</strong><br />
                        Nurse: {p.assignedNurse || 'Meenakshi Sundaram'}
                      </td>
                      <td style={{ padding: '16px 18px', textAlign: 'center' }}>
                        <button
                          className="btn-primary"
                          style={{ padding: '6px 14px', fontSize: '0.78rem', background: 'linear-gradient(135deg, #059669, #047857)', color: 'white', border: 'none', borderRadius: '20px', fontWeight: 700, cursor: 'pointer' }}
                          onClick={() => navigate(`/patients/${p.id}`)}
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No patient records found for the selected doctor filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Pagination Controls */}
        <div style={{
          padding: '16px 24px',
          background: 'var(--bg-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          borderTop: '1px solid var(--border-color)'
        }}>
          <div>
            Showing <strong>1 to {filteredPatients.length}</strong> of <strong>2,481</strong> patients
          </div>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>&lt;</button>
            <button className="btn-primary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>1</button>
            <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>2</button>
            <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>3</button>
            <span>...</span>
            <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>415</button>
            <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
