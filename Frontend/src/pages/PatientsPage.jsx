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
  const [newPatientData, setNewPatientData] = useState({
    name: '',
    age: 45,
    gender: 'Male',
    phone: '',
    department: 'Cardiology',
    distanceKm: 12.0,
    totalAppointments: 10,
    missedAppointmentsCount: 1,
    treatmentDurationMonths: 6,
    appointmentFrequencyDays: 30,
    assignedDoctor: 'Dr. Ankit Mehta',
    assignedNurse: 'Priya Sharma'
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

    // Reset form
    setNewPatientData({
      name: '',
      age: 45,
      gender: 'Male',
      phone: '',
      department: 'Cardiology',
      distanceKm: 12.0,
      totalAppointments: 10,
      missedAppointmentsCount: 1,
      treatmentDurationMonths: 6,
      appointmentFrequencyDays: 30,
      assignedDoctor: 'Dr. Ankit Mehta',
      assignedNurse: 'Priya Sharma'
    });
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
      <div className="full-width-card" style={{ padding: '16px 20px' }}>
        <div className="search-action-bar" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-input-wrap" style={{ flex: '1 1 300px' }}>
            <input
              type="text"
              className="search-input"
              placeholder="Search patient name, ID or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {/* Risk Filter */}
            <select
              className="form-control"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              style={{ padding: '8px 12px', fontSize: '0.85rem', width: 'auto' }}
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
              style={{ padding: '8px 12px', fontSize: '0.85rem', width: 'auto' }}
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
              style={{ padding: '8px 12px', fontSize: '0.85rem', width: 'auto' }}
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

      {/* Patient Table */}
      <div className="full-width-card">
        <div className="table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Contact</th>
                <th>Last Visit</th>
                <th>Next Follow-up</th>
                <th>Risk Score</th>
                <th>Risk Level</th>
                <th>Follow-up Status</th>
                <th>Assigned Staff</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td style={{ fontWeight: 700 }}>{patient.id}</td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{patient.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{patient.department}</div>
                    </td>
                    <td>{patient.age} yrs</td>
                    <td>{patient.phone}</td>
                    <td>{patient.lastVisitDate}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{patient.nextFollowUpDate}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{patient.nextFollowUpTime}</div>
                    </td>
                    <td style={{ fontWeight: 800 }}>{patient.risk ? patient.risk.riskScore : 50}%</td>
                    <td>
                      <span className={`status-badge ${
                        patient.risk && (patient.risk.riskLevel === 'VERY HIGH' || patient.risk.riskLevel === 'HIGH') ? 'inactive' :
                        patient.risk && patient.risk.riskLevel === 'MEDIUM' ? 'reschedule_requested' : 'active'
                      }`}>
                        {patient.risk ? patient.risk.riskLevel : 'MEDIUM'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${
                        patient.status === 'Confirmed' ? 'confirmed' :
                        patient.status === 'Missed' ? 'cancelled' : 'scheduled'
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Dr. {patient.assignedDoctor ? patient.assignedDoctor.replace('Dr. ', '') : 'Ankit Mehta'}<br />
                      Nurse: {patient.assignedNurse || 'Priya Sharma'}
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button
                          className="btn-primary"
                          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          onClick={() => navigate(`/patients/${patient.id}`)}
                        >
                          View Profile
                        </button>
                      </div>
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

      {/* REGISTER NEW PATIENT MODAL FORM */}
      {showRegisterModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3>Register New Patient into CareTrack</h3>
              <button className="modal-close-btn" onClick={() => setShowRegisterModal(false)}>✕</button>
            </div>

            <form className="modal-form" onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Anand Sharma"
                    value={newPatientData.name}
                    onChange={(e) => setNewPatientData({ ...newPatientData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Phone Number *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="+91 98765 43219"
                    value={newPatientData.phone}
                    onChange={(e) => setNewPatientData({ ...newPatientData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Age *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newPatientData.age}
                    onChange={(e) => setNewPatientData({ ...newPatientData, age: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
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

                <div className="form-group">
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
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Distance from Hospital (km)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-control"
                    value={newPatientData.distanceKm}
                    onChange={(e) => setNewPatientData({ ...newPatientData, distanceKm: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Total Appointments</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newPatientData.totalAppointments}
                    onChange={(e) => setNewPatientData({ ...newPatientData, totalAppointments: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Missed Appointments History</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newPatientData.missedAppointmentsCount}
                    onChange={(e) => setNewPatientData({ ...newPatientData, missedAppointmentsCount: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Assigned Doctor</label>
                  <select
                    className="form-control"
                    value={newPatientData.assignedDoctor}
                    onChange={(e) => setNewPatientData({ ...newPatientData, assignedDoctor: e.target.value })}
                  >
                    <option value="Dr. Ankit Mehta">Dr. Ankit Mehta (Cardiology)</option>
                    <option value="Dr. Sunita Rao">Dr. Sunita Rao (Orthopedics)</option>
                    <option value="Dr. Rajesh Verma">Dr. Rajesh Verma (Endocrinology)</option>
                    <option value="Dr. Meera Kapoor">Dr. Meera Kapoor (Dermatology)</option>
                  </select>
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: '14px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowRegisterModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Register Patient & Run ML Risk Assessment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
