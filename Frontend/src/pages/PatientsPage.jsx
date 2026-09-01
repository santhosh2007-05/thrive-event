import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dataStore from '../services/dataStore';

export default function PatientsPage() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState(dataStore.getPatients());
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => {
      setPatients(dataStore.getPatients());
    });
    return () => unsubscribe();
  }, []);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm);

    const matchesRisk =
      riskFilter === 'ALL' || patient.risk.riskLevel.toUpperCase() === riskFilter.toUpperCase();

    const matchesDept =
      deptFilter === 'ALL' || patient.department === deptFilter;

    const matchesStatus =
      statusFilter === 'ALL' || patient.status === statusFilter;

    return matchesSearch && matchesRisk && matchesDept && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
            onClick={() => alert('Register New Patient modal — frontend workflow ready!')}
          >
            + Register New Patient
          </button>
        </div>
      </div>

      {/* Filter and Search Control Bar */}
      <div className="full-width-card" style={{ padding: '16px 20px' }}>
        <div className="search-action-bar">
          <div className="search-input-wrap" style={{ flex: '1 1 300px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
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
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
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
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
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
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
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
                    <td style={{ fontWeight: 800 }}>{patient.risk.riskScore}%</td>
                    <td>
                      <span className={`status-badge ${
                        patient.risk.riskLevel === 'VERY HIGH' || patient.risk.riskLevel === 'HIGH' ? 'inactive' :
                        patient.risk.riskLevel === 'MEDIUM' ? 'reschedule_requested' : 'active'
                      }`}>
                        {patient.risk.riskLevel}
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
                      Dr. {patient.assignedDoctor.replace('Dr. ', '')}<br />
                      Nurse: {patient.assignedNurse}
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
    </div>
  );
}
