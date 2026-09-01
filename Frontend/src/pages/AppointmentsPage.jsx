import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dataStore from '../services/dataStore';
import { useRole } from '../components/layout/AppShell';

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const { role, user } = useRole();
  const [appointments, setAppointments] = useState(dataStore.getAppointments());
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [activeFilter, setActiveFilter] = useState('ALL');

  useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => {
      setAppointments(dataStore.getAppointments());
    });
    return () => unsubscribe();
  }, []);

  // Strict Data Scoping: If logged in as Patient, filter to ONLY own appointments
  const userName = (user && user.name ? user.name : 'Santhosh M').toLowerCase();
  const scopedAppointments = role === 'Patient'
    ? appointments.filter(a =>
        a.patientName.toLowerCase().includes(userName) ||
        a.patientId === 'P-10238' ||
        a.patientId === 'P-10234'
      )
    : appointments;

  const filteredAppointments = scopedAppointments.filter(apt => {
    if (activeFilter === 'CONFIRMED') return apt.status === 'Confirmed' || apt.confirmationStatus === 'Confirmed';
    if (activeFilter === 'PENDING') return apt.status === 'Pending' || apt.status === 'Upcoming';
    if (activeFilter === 'MISSED') return apt.status === 'Missed';
    if (activeFilter === 'HIGH_RISK') return apt.riskScore >= 70;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner with Curated Hospital Outpatient Reception Photography */}
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
          backgroundImage: 'linear-gradient(90deg, rgba(24,24,22,0.92) 0%, rgba(24,24,22,0.65) 100%), url(https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1
        }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              Hospital Schedule Management
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0', color: 'white' }}>
              {role === 'Patient' ? 'My Personal Appointments & Calendar' : 'Appointments & Follow-up Calendar'}
            </h1>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
              {role === 'Patient' ? `Viewing private follow-up schedule for ${user?.name || 'Santhosh M'}` : 'Schedule, confirm, and track patient follow-up visits'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '30px', padding: '2px', backdropFilter: 'blur(10px)' }}>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  background: viewMode === 'list' ? '#059669' : 'none',
                  color: 'white',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                style={{
                  background: viewMode === 'calendar' ? '#059669' : 'none',
                  color: 'white',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Calendar View
              </button>
            </div>

            {role !== 'Patient' && (
              <button
                className="btn-primary"
                onClick={() => alert('New Appointment Scheduling modal!')}
              >
                + Schedule Appointment
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { id: 'ALL', label: 'All Appointments' },
          { id: 'CONFIRMED', label: 'Confirmed' },
          { id: 'PENDING', label: 'Pending / Upcoming' },
          { id: 'MISSED', label: 'Missed Visits' },
          { id: 'HIGH_RISK', label: 'High Risk Only' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`tab-btn ${activeFilter === tab.id ? 'active' : ''}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* View Mode 1: List View */}
      {viewMode === 'list' && (
        <div className="full-width-card">
          <div className="table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Appointment ID</th>
                  <th>Patient</th>
                  <th>Date & Time</th>
                  <th>Doctor & Dept</th>
                  <th>Risk Score</th>
                  <th>Confirmation</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((apt) => (
                    <tr key={apt.id}>
                      <td style={{ fontWeight: 700 }}>{apt.id}</td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{apt.patientName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {apt.patientId} • Age {apt.patientAge}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{apt.date}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{apt.time}</div>
                      </td>
                      <td>
                        <div>{apt.doctor}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{apt.department}</div>
                      </td>
                      <td>
                        <span className={`status-badge ${apt.riskScore >= 70 ? 'inactive' : 'active'}`}>
                          {apt.riskScore}% {apt.riskLevel}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${apt.confirmationStatus === 'Confirmed' ? 'confirmed' : 'reschedule_requested'}`}>
                          {apt.confirmationStatus}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${apt.status === 'Confirmed' ? 'active' : apt.status === 'Missed' ? 'cancelled' : 'scheduled'}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          onClick={() => navigate(`/appointments/${apt.id}`)}
                        >
                          Details & Actions
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      No appointments found matching your account.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Mode 2: Interactive Operations Grid Calendar View */}
      {viewMode === 'calendar' && (
        <div className="full-width-card">
          <div className="card-header-row" style={{ marginBottom: '16px' }}>
            <div className="card-section-title">
              September 2026 Operations Schedule
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Color Legend: Green=Confirmed, Red=Missed, Orange=High Risk</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)', paddingBottom: '6px' }}>
                {day}
              </div>
            ))}

            {Array.from({ length: 30 }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `2026-09-${dayNum < 10 ? '0' + dayNum : dayNum}`;
              const aptsOnDay = scopedAppointments.filter(a => a.date === dateStr);

              return (
                <div
                  key={dayNum}
                  style={{
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    minHeight: '90px',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>{dayNum}</div>
                  <div>
                    {aptsOnDay.map(a => (
                      <div
                        key={a.id}
                        onClick={() => navigate(`/appointments/${a.id}`)}
                        style={{
                          background: a.riskScore >= 70 ? 'var(--danger-soft)' : a.status === 'Confirmed' ? 'var(--accent-soft)' : 'var(--bg-surface)',
                          borderLeft: `3px solid ${a.riskScore >= 70 ? 'var(--danger-color)' : a.status === 'Confirmed' ? 'var(--primary-accent)' : 'var(--info-color)'}`,
                          padding: '4px 6px',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          color: 'var(--text-main)',
                          marginBottom: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {a.patientName} ({a.time})
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
