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

  // Data Scoping: If logged in as Patient, filter to ONLY own appointments (matching P-1001, name, or assigned ID)
  const userName = (user && user.name ? user.name : 'Santhosh M').toLowerCase();
  const userId = user && user.id ? user.id : 'P-1001';
  const scopedAppointments = role === 'Patient'
    ? appointments.filter(a =>
        a.patientName.toLowerCase().includes(userName) ||
        a.patientId === userId ||
        a.patientId === 'P-1001'
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
              Hospital Appointments Desk
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0', color: 'white' }}>
              {role === 'Patient' ? 'My Scheduled Appointments' : 'All Hospital Outpatient Appointments'}
            </h1>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
              Real-time schedule tracking, status confirmations, and risk metrics
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`btn-secondary ${viewMode === 'list' ? 'btn-primary' : ''}`}
              style={{ padding: '8px 16px', fontSize: '0.8rem' }}
              onClick={() => setViewMode('list')}
            >
              List View
            </button>
            <button
              className={`btn-secondary ${viewMode === 'calendar' ? 'btn-primary' : ''}`}
              style={{ padding: '8px 16px', fontSize: '0.8rem' }}
              onClick={() => setViewMode('calendar')}
            >
              Calendar View
            </button>
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
            className={`btn-secondary ${activeFilter === tab.id ? 'btn-primary' : ''}`}
            style={{ padding: '8px 16px', fontSize: '0.82rem' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* View Mode Switch: List vs Calendar */}
      {viewMode === 'list' ? (
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
                  <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Appointment ID</th>
                  <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Patient</th>
                  <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Date & Time</th>
                  <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Doctor & Dept</th>
                  <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Risk Score</th>
                  <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Confirmation</th>
                  <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map(apt => (
                    <tr key={apt.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--primary-accent)' }}>{apt.id}</td>
                      <td style={{ padding: '16px 18px' }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{apt.patientName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {apt.patientId}</div>
                      </td>
                      <td style={{ padding: '16px 18px' }}>
                        <div style={{ fontWeight: 700 }}>🗓️ {apt.date}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{apt.time}</div>
                      </td>
                      <td style={{ padding: '16px 18px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{apt.doctor}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{apt.department}</div>
                      </td>
                      <td style={{ padding: '16px 18px', fontWeight: 900, color: apt.riskScore >= 70 ? 'var(--danger-color)' : apt.riskScore >= 45 ? 'var(--warning-color)' : 'var(--text-main)' }}>
                        {apt.riskScore}%
                      </td>
                      <td style={{ padding: '16px 18px' }}>
                        <span style={{
                          background: apt.status === 'Confirmed' ? 'var(--accent-soft)' : 'var(--warning-soft)',
                          color: apt.status === 'Confirmed' ? 'var(--primary-accent)' : 'var(--warning-color)',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          display: 'inline-block'
                        }}>
                          ● {apt.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '16px 18px' }}>
                        <span className={`status-badge ${apt.riskScore >= 70 ? 'inactive' : 'active'}`}>
                          {apt.riskLevel || 'LOW'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 18px', textAlign: 'center' }}>
                        <button
                          className="btn-secondary"
                          style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                          onClick={() => navigate(`/patients/${apt.patientId}`)}
                        >
                          View Details &rarr;
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      No appointments found matching your account or selected filter tab.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Calendar Grid View */
        <div className="full-width-card" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 800 }}>September 2026 Outpatient Calendar</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} style={{ textAlign: 'center', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)', paddingBottom: '8px' }}>
                {d}
              </div>
            ))}
            {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
              const dayStr = `2026-09-${day < 10 ? '0' + day : day}`;
              const dayApts = filteredAppointments.filter(a => a.date === dayStr);

              return (
                <div
                  key={day}
                  style={{
                    background: dayApts.length > 0 ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                    border: dayApts.length > 0 ? '2px solid var(--primary-accent)' : '1px solid var(--border-color)',
                    minHeight: '80px',
                    padding: '8px',
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{day}</div>
                  {dayApts.map(a => (
                    <div key={a.id} style={{ background: 'var(--primary-accent)', color: 'white', fontSize: '0.68rem', padding: '2px 4px', borderRadius: '4px', marginTop: '4px', fontWeight: 700 }}>
                      {a.patientName.split(' ')[0]} ({a.time})
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
