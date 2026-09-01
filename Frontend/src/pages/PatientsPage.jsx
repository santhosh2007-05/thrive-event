import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dataStore from '../services/dataStore';
import audioService from '../services/audioService';

export default function PatientsPage() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState(dataStore.getPatients());
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Register New Patient Modal State
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showModalPassword, setShowModalPassword] = useState(false);
  const [newPatientData, setNewPatientData] = useState({
    name: '',
    phone: '+91 7598357132',
    password: '',
    age: 30,
    gender: 'Male',
    department: 'Cardiology',
    distanceKm: 5.0,
    totalAppointments: 6,
    appointmentFrequencyDays: 30,
    assignedDoctor: 'Dr. Sundaramurthy Iyer',
    assignedNurse: 'Meenakshi Sundaram'
  });
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => {
      setPatients(dataStore.getPatients());
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    audioService.play2hReminder();
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!newPatientData.name.trim()) {
      alert('Please enter patient full name');
      return;
    }

    const { newPatientObj } = dataStore.registerNewPatient(newPatientData, 'Admin', 'Admin');
    showToast(`New Patient ${newPatientObj.name} (${newPatientObj.id}) registered successfully!`);
    setShowRegisterModal(false);

    // Immediately navigate to newly generated Patient Profile page
    navigate(`/patients/${newPatientObj.id}`);
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.phone && patient.phone.includes(searchTerm));

    const matchesRisk =
      riskFilter === 'ALL' || (patient.risk && patient.risk.riskLevel && patient.risk.riskLevel.toUpperCase() === riskFilter.toUpperCase());

    const matchesDept =
      deptFilter === 'ALL' || patient.department === deptFilter;

    const matchesStatus =
      statusFilter === 'ALL' || patient.status === statusFilter;

    return matchesSearch && matchesRisk && matchesDept && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMsg && (
        <div style={{ background: '#059669', color: 'white', padding: '12px 20px', borderRadius: '30px', fontWeight: 600 }}>
          ✓ {toastMsg}
        </div>
      )}

      {/* Header Banner with Curated Hospital Caseload Photography */}
      <div style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        minHeight: '160px',
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
          backgroundImage: 'linear-gradient(90deg, rgba(24,24,22,0.92) 0%, rgba(24,24,22,0.65) 100%), url(https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1
        }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              Hospital Patient Registry
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0', color: 'white' }}>
              Patients Directory & Caseload Ranking
            </h1>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
              Comprehensive patient profiles, medical histories, and risk rankings
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={() => setShowRegisterModal(true)}
          >
            + Register New Patient
          </button>
        </div>
      </div>

      {/* Filter and Search Control Bar */}
      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        padding: '16px 20px',
        boxShadow: 'var(--shadow-soft)'
      }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search patient name, ID or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: '1 1 300px' }}
          />

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {/* Risk Filter */}
            <select
              className="form-control"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="ALL">All Risk Levels</option>
              <option value="VERY HIGH">VERY HIGH</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
              <option value="VERY LOW">VERY LOW</option>
            </select>

            {/* Dept Filter */}
            <select
              className="form-control"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="ALL">All Departments</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Endocrinology">Endocrinology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Neurology">Neurology</option>
            </select>

            {/* Follow-up Status */}
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="ALL">All Follow-up Statuses</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Missed">Missed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* BULLETPROOF INLINE-STYLED PATIENT TABLE */}
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
                <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Patient ID</th>
                <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Name</th>
                <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Age</th>
                <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Contact</th>
                <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Last Visit</th>
                <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Next Follow-up</th>
                <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Risk Score</th>
                <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Risk Level</th>
                <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Follow-up Status</th>
                <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Assigned Staff</th>
                <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--primary-accent)' }}>{patient.id}</td>
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.92rem' }}>{patient.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{patient.department}</div>
                    </td>
                    <td style={{ padding: '16px 18px' }}>{patient.age} yrs</td>
                    <td style={{ padding: '16px 18px' }}>{patient.phone}</td>
                    <td style={{ padding: '16px 18px', color: 'var(--text-muted)' }}>{patient.lastVisitDate}</td>
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ fontWeight: 700 }}>{patient.nextFollowUpDate}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{patient.nextFollowUpTime}</div>
                    </td>
                    <td style={{ padding: '16px 18px', fontWeight: 900, fontSize: '1.05rem' }}>{patient.risk ? patient.risk.riskScore : 12}%</td>
                    <td style={{ padding: '16px 18px' }}>
                      <span style={{
                        background: patient.risk && patient.risk.riskLevel === 'HIGH' ? 'var(--danger-soft)' : patient.risk && patient.risk.riskLevel === 'MEDIUM' ? 'var(--warning-soft)' : 'var(--accent-soft)',
                        color: patient.risk && patient.risk.riskLevel === 'HIGH' ? 'var(--danger-color)' : patient.risk && patient.risk.riskLevel === 'MEDIUM' ? 'var(--warning-color)' : 'var(--primary-accent)',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontWeight: 800,
                        fontSize: '0.75rem'
                      }}>
                        {patient.risk ? patient.risk.riskLevel : 'LOW'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 18px' }}>
                      <span style={{
                        background: patient.status === 'Confirmed' ? 'var(--accent-soft)' : 'var(--warning-soft)',
                        color: patient.status === 'Confirmed' ? 'var(--primary-accent)' : 'var(--warning-color)',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontWeight: 800,
                        fontSize: '0.75rem'
                      }}>
                        ● {patient.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '16px 18px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <strong style={{ color: 'var(--text-main)' }}>{patient.assignedDoctor || 'Dr. Sundaramurthy Iyer'}</strong><br />
                      Nurse: {patient.assignedNurse || 'Meenakshi Sundaram'}
                    </td>
                    <td style={{ padding: '16px 18px', textAlign: 'center' }}>
                      <button
                        className="btn-primary"
                        style={{ padding: '6px 14px', fontSize: '0.78rem', background: 'linear-gradient(135deg, #059669, #047857)', color: 'white', border: 'none', borderRadius: '20px', fontWeight: 700, cursor: 'pointer' }}
                        onClick={() => navigate(`/patients/${patient.id}`)}
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No patients match the search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REGISTER NEW PATIENT MODAL FORM WITH VISITS & FREQUENCY GAPS */}
      {showRegisterModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontWeight: 800 }}>New Patient Intake Registration</h3>
              <button style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-main)' }} onClick={() => setShowRegisterModal(false)}>✕</button>
            </div>

            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Your Full Name"
                    value={newPatientData.name}
                    onChange={(e) => setNewPatientData({ ...newPatientData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Contact Phone *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="+91 7598357132"
                    value={newPatientData.phone}
                    onChange={(e) => setNewPatientData({ ...newPatientData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Password Integration for New Patient */}
              <div style={{ position: 'relative' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Patient Portal Account Password *</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showModalPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Set account password (e.g. 123456)"
                    value={newPatientData.password}
                    onChange={(e) => setNewPatientData({ ...newPatientData, password: e.target.value })}
                    required
                    style={{ paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowModalPassword(!showModalPassword);
                    }}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                      zIndex: 10
                    }}
                  >
                    {showModalPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* VISITS COUNT & FREQUENCY GAP (NEW FIELDS) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'var(--bg-subtle)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-accent)' }}>Number of Planned Visits *</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    placeholder="e.g. 6 visits"
                    value={newPatientData.totalAppointments}
                    onChange={(e) => setNewPatientData({ ...newPatientData, totalAppointments: Number(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-accent)' }}>Visit Frequency Gap (Days) *</label>
                  <select
                    className="form-control"
                    value={newPatientData.appointmentFrequencyDays}
                    onChange={(e) => setNewPatientData({ ...newPatientData, appointmentFrequencyDays: Number(e.target.value) })}
                  >
                    <option value={7}>Every 7 Days (Weekly)</option>
                    <option value={14}>Every 14 Days (Bi-weekly)</option>
                    <option value={30}>Every 30 Days (Monthly)</option>
                    <option value={60}>Every 60 Days (Bi-monthly)</option>
                    <option value={90}>Every 90 Days (Quarterly)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Age *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newPatientData.age}
                    onChange={(e) => setNewPatientData({ ...newPatientData, age: Number(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Gender</label>
                  <select
                    className="form-control"
                    value={newPatientData.gender}
                    onChange={(e) => setNewPatientData({ ...newPatientData, gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Department *</label>
                  <select
                    className="form-control"
                    value={newPatientData.department}
                    onChange={(e) => setNewPatientData({ ...newPatientData, department: e.target.value })}
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Endocrinology">Endocrinology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Neurology">Neurology</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Distance from Hospital (km)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-control"
                    value={newPatientData.distanceKm}
                    onChange={(e) => setNewPatientData({ ...newPatientData, distanceKm: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Assigned Doctor</label>
                  <select
                    className="form-control"
                    value={newPatientData.assignedDoctor}
                    onChange={(e) => setNewPatientData({ ...newPatientData, assignedDoctor: e.target.value })}
                  >
                    <option value="Dr. Sundaramurthy Iyer">Dr. Sundaramurthy Iyer (Cardiology)</option>
                    <option value="Dr. Venkatesh Ramanathan">Dr. Venkatesh Ramanathan (Orthopedics)</option>
                    <option value="Dr. Subramanian Natarajan">Dr. Subramanian Natarajan (Endocrinology)</option>
                    <option value="Dr. Kausalya Krishnaswamy">Dr. Kausalya Krishnaswamy (Dermatology)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '14px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowRegisterModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Register Patient & Open Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
