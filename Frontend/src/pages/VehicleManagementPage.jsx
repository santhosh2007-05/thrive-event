import React, { useState, useEffect } from 'react';
import dataStore from '../services/dataStore';
import audioService from '../services/audioService';

export default function VehicleManagementPage() {
  const [requests, setRequests] = useState(dataStore.getTransportRequests());
  const [toastMsg, setToastMsg] = useState('');
  const [selectedReqForApproval, setSelectedReqForApproval] = useState(null);
  const [fareInput, setFareInput] = useState(250);
  const [driverInput, setDriverInput] = useState('Ramesh Kumar (Hospital Shuttle #4)');

  useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => {
      setRequests(dataStore.getTransportRequests());
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    audioService.play2hReminder();
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleConfirmApproval = (e) => {
    e.preventDefault();
    if (!selectedReqForApproval) return;

    dataStore.approveTransportShuttle(selectedReqForApproval.id, fareInput, driverInput);
    showToast(`Vehicle Pickup Request Approved for ${selectedReqForApproval.patientName}! Fare set to ₹${fareInput}.`);
    setSelectedReqForApproval(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMsg && (
        <div style={{ background: '#059669', color: 'white', padding: '12px 20px', borderRadius: '30px', fontWeight: 600 }}>
          ✓ {toastMsg}
        </div>
      )}

      {/* Header Banner */}
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
          backgroundImage: 'linear-gradient(90deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.7) 100%), url(https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1
        }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>
              HOSPITAL LOGISTICS CONTROL
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0', color: 'white' }}>
              Vehicle Management & Shuttle Dispatch
            </h1>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
              Review patient home pickup requests, assign shuttle drivers, and calculate travel fares
            </div>
          </div>
        </div>
      </div>

      {/* 🚗 ADMIN VEHICLE MANAGEMENT DESK TABLE */}
      <div className="full-width-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="admin-data-table" style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-subtle)', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Booking Ref</th>
                <th style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Patient Name</th>
                <th style={{ padding: '16px 18px', fontWeight 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Contact Phone</th>
                <th style={{ padding: '16px 18px', fontWeight 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Pickup Address</th>
                <th style={{ padding: '16px 18px', fontWeight 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Distance</th>
                <th style={{ padding: '16px 18px', fontWeight 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Calculated Fare</th>
                <th style={{ padding: '16px 18px', fontWeight 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '16px 18px', fontWeight 800, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'center' }}>Admin Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map(req => (
                  <tr key={req.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px 18px', fontWeight: 800, color: 'var(--primary-accent)' }}>{req.id}</td>
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{req.patientName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {req.patientId}</div>
                    </td>
                    <td style={{ padding: '16px 18px' }}>{req.phone}</td>
                    <td style={{ padding: '16px 18px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.address}</td>
                    <td style={{ padding: '16px 18px' }}>{req.distanceKm} km</td>
                    <td style={{ padding: '16px 18px', fontWeight: 900, color: '#059669' }}>₹{req.fareAmount}</td>
                    <td style={{ padding: '16px 18px' }}>
                      <span style={{
                        background: req.status === 'Paid' ? 'var(--accent-soft)' : req.status === 'Accepted' ? 'var(--info-soft)' : 'var(--warning-soft)',
                        color: req.status === 'Paid' ? 'var(--primary-accent)' : req.status === 'Accepted' ? 'var(--info-color)' : 'var(--warning-color)',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        display: 'inline-block'
                      }}>
                        ● {req.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '16px 18px', textAlign: 'center' }}>
                      {req.status === 'Pending' ? (
                        <button
                          className="btn-primary"
                          style={{ padding: '6px 14px', fontSize: '0.78rem', background: 'linear-gradient(135deg, #0284c7, #0369a1)' }}
                          onClick={() => {
                            setSelectedReqForApproval(req);
                            setFareInput(req.fareAmount || 250);
                          }}
                        >
                          Accept & Assign Vehicle
                        </button>
                      ) : req.status === 'Accepted' ? (
                        <span style={{ fontSize: '0.78rem', color: 'var(--info-color)', fontWeight: 700 }}>
                          Accepted (Awaiting Patient Payment)
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 800 }}>
                          ✓ Paid (Driver: {req.driverName})
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No vehicle pickup requests pending.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADMIN APPROVAL & FARE ASSIGNMENT MODAL */}
      {selectedReqForApproval && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '480px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 800 }}>Approve Vehicle Support Request</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Patient: <strong>{selectedReqForApproval.patientName} ({selectedReqForApproval.patientId})</strong><br/>
              Address: <strong>{selectedReqForApproval.address}</strong> ({selectedReqForApproval.distanceKm} km)
            </p>

            <form onSubmit={handleConfirmApproval} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Calculated Travel Fare (₹) *</label>
                <input
                  type="number"
                  className="form-control"
                  value={fareInput}
                  onChange={(e) => setFareInput(Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Assigned Driver & Vehicle Details *</label>
                <input
                  type="text"
                  className="form-control"
                  value={driverInput}
                  onChange={(e) => setDriverInput(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setSelectedReqForApproval(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Confirm Approval & Send to Patient</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
