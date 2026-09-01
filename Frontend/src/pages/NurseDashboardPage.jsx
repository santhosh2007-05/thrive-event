import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dataStore from '../services/dataStore';
import audioService from '../services/audioService';

export default function NurseDashboardPage() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState(dataStore.getPatients());
  const [activeCallPatient, setActiveCallPatient] = useState(null);
  const [callOutcome, setCallOutcome] = useState('Answered');
  const [callNotes, setCallNotes] = useState('');
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

  const handleInitiatePhoneCall = (p) => {
    setActiveCallPatient(p);
    // Directly redirect to phone dialer protocol tel:
    window.location.href = `tel:${p.phone}`;
  };

  const handleCallSubmit = (e) => {
    e.preventDefault();
    dataStore.updateAppointmentStatus(
      `APT-${activeCallPatient.id}`,
      callOutcome === 'Answered' ? 'Confirmed' : 'Pending',
      `Nurse Call: ${callOutcome}. ${callNotes}`,
      'Priya Sharma',
      'Nurse'
    );
    showToast(`Nurse intervention logged for ${activeCallPatient.name}`);
    setActiveCallPatient(null);
    setCallNotes('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMsg && (
        <div style={{ background: '#059669', color: 'white', padding: '12px 20px', borderRadius: '30px', fontWeight: 600 }}>
          ✓ {toastMsg}
        </div>
      )}

      {/* Header Banner with Curated Nurse Care Photography */}
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
          backgroundImage: 'linear-gradient(90deg, rgba(24,24,22,0.92) 0%, rgba(24,24,22,0.65) 100%), url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1
        }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              Nurse Interventions Portal
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0', color: 'white' }}>
              Patient Follow-up & Outreach Desk
            </h1>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
              Staff Nurse: <strong>Priya Sharma</strong> • Outpatient Follow-up Coordination
            </div>
          </div>

          <button className="btn-secondary" style={{ background: '#ffffff', color: '#181816', border: 'none', fontWeight: 700 }} onClick={() => audioService.play10mReminder()}>
            Test Alert Chime
          </button>
        </div>
      </div>

      {/* Priority High Risk Outreach Queue */}
      <div className="full-width-card">
        <div className="card-header-row">
          <div className="card-section-title">
            Priority Outreach Call Queue ({highRiskPatients.length} High Risk)
          </div>
          <span style={{ fontSize: '0.8rem', color: '#64665e' }}>Immediate phone call recommended for &gt;70% risk</span>
        </div>

        <div className="table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Appointment Date</th>
                <th>Risk Score</th>
                <th>Preferred Comm</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {highRiskPatients.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#181816' }}>{p.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64665e' }}>ID: {p.id} • {p.phone}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.nextFollowUpDate}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64665e' }}>{p.nextFollowUpTime}</div>
                  </td>
                  <td>
                    <span className="status-badge inactive">{p.risk.riskScore}% HIGH</span>
                  </td>
                  <td>
                    <span className="status-badge scheduled">{p.preferredComm}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${p.status === 'Confirmed' ? 'confirmed' : 'reschedule_requested'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <a
                        href={`tel:${p.phone}`}
                        onClick={() => setActiveCallPatient(p)}
                        className="btn-primary"
                        style={{ padding: '6px 14px', fontSize: '0.8rem', textDecoration: 'none' }}
                      >
                        Call ({p.phone})
                      </a>
                      <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => navigate(`/patients/${p.id}`)}>
                        View Record
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Call Outcome Logging Modal */}
      {activeCallPatient && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Nurse Outreach Call — {activeCallPatient.name}</h3>
              <button className="modal-close-btn" onClick={() => setActiveCallPatient(null)}>✕</button>
            </div>

            <form className="modal-form" onSubmit={handleCallSubmit}>
              <div style={{ background: '#f0f2eb', padding: '12px', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '14px' }}>
                Phone Number: <strong>{activeCallPatient.phone}</strong><br />
                Address: <strong>{activeCallPatient.address} ({activeCallPatient.distanceKm} km away)</strong><br />
                <a href={`tel:${activeCallPatient.phone}`} style={{ color: '#059669', fontWeight: 700, textDecoration: 'underline', marginTop: '6px', display: 'inline-block' }}>
                  Redial Phone ({activeCallPatient.phone})
                </a>
              </div>

              <div className="form-group">
                <label>Call Outcome *</label>
                <select className="form-control" value={callOutcome} onChange={(e) => setCallOutcome(e.target.value)}>
                  <option value="Answered">Answered — Visit Confirmed</option>
                  <option value="No Answer">No Answer — Left Voicemail</option>
                  <option value="Requested Reschedule">Requested Reschedule</option>
                  <option value="Transport Assistance Needed">Transport Assistance Needed</option>
                </select>
              </div>

              <div className="form-group">
                <label>Call Outcome Notes</label>
                <textarea className="form-control" rows="3" placeholder="Enter patient feedback..." value={callNotes} onChange={(e) => setCallNotes(e.target.value)} />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setActiveCallPatient(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Intervention</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
