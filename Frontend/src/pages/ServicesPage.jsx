import React, { useState, useEffect } from 'react';
import dataStore from '../services/dataStore';
import audioService from '../services/audioService';
import { useRole } from '../components/layout/AppShell';

export default function ServicesPage() {
  const { user } = useRole();
  const [patients] = useState(dataStore.getPatients());
  const [transportRequests, setTransportRequests] = useState(dataStore.getTransportRequests());
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [pickupAddress, setPickupAddress] = useState('No. 42, South Mada Street, Mylapore, Chennai');
  const [pickupNotes, setPickupNotes] = useState('Requires assistance with wheelchair accessibility.');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [toastMsg, setToastMsg] = useState('');

  const patientId = user && user.id ? user.id : 'P-1001';
  const patient = patients.find(p => p.id === patientId) || patients[0];
  const activeTransportReq = transportRequests.find(r => r.patientId === patient.id) || null;

  useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => {
      setTransportRequests(dataStore.getTransportRequests());
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    audioService.play2hReminder();
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleRequestVehicleSupport = (e) => {
    e.preventDefault();
    dataStore.requestTransportShuttle(patient.id, pickupAddress, pickupNotes);
    setShowRequestModal(false);
    showToast('Vehicle Support Request submitted to Admin Transport Desk!');
  };

  const handleExecutePayment = () => {
    if (!activeTransportReq) return;
    const paymentId = `pay_RZP_${Date.now()}`;
    dataStore.payTransportShuttle(activeTransportReq.id, { paymentId });
    setShowRazorpayModal(false);
    showToast('Payment successful! Hospital shuttle vehicle confirmed.');
  };

  const handleDownloadReceipt = () => {
    if (!activeTransportReq) return;

    const receiptHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>CareTrack Vehicle Service Receipt - ${activeTransportReq.id}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 40px; color: #0f172a; line-height: 1.5; }
          .header { display: flex; justify-content: space-between; border-bottom: 3px solid #059669; padding-bottom: 16px; margin-bottom: 24px; }
          .title { font-size: 24px; font-weight: bold; color: #059669; }
          .receipt-box { border: 1px solid #cbd5e1; border-radius: 12px; padding: 24px; background: #f8fafc; margin-bottom: 24px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; border-bottom: 1px dashed #e2e8f0; padding-bottom: 8px; }
          .badge { background: #059669; color: white; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">CareTrack Health Outpatient Services</div>
            <div>Hospital Vehicle Transport & Payment Receipt</div>
          </div>
          <div>
            <span class="badge">PAID & SCHEDULED</span>
          </div>
        </div>

        <div class="receipt-box">
          <div class="row"><span>Booking Reference ID:</span><strong>${activeTransportReq.id}</strong></div>
          <div class="row"><span>Razorpay Payment ID:</span><strong>${activeTransportReq.paymentId || 'pay_RZP_DEMO'}</strong></div>
          <div class="row"><span>Patient Name:</span><strong>${patient.name} (${patient.id})</strong></div>
          <div class="row"><span>Pickup Address:</span><strong>${activeTransportReq.address}</strong></div>
          <div class="row"><span>Scheduled Visit Date:</span><strong>${activeTransportReq.requestedDate} at ${activeTransportReq.requestedTime}</strong></div>
          <div class="row"><span>Assigned Shuttle Driver:</span><strong>${activeTransportReq.driverName}</strong></div>
          <div class="row"><span>Driver Contact Phone:</span><strong>${activeTransportReq.driverPhone}</strong></div>
          <div class="row"><span>Travel Distance & Fare:</span><strong style="color: #059669; font-size: 16px;">₹${activeTransportReq.fareAmount} (${activeTransportReq.distanceKm} km)</strong></div>
          <div class="row"><span>Transaction Date:</span><strong>${activeTransportReq.paidAt || new Date().toLocaleString()}</strong></div>
        </div>

        <div class="footer">
          CareTrack Health • Operational Support: +91 7598357132 • Official Transport Booking Receipt
        </div>
      </body>
      </html>
    `;

    const printWin = window.open('', '_blank', 'width=800,height=900');
    if (printWin) {
      printWin.document.write(receiptHtml);
      printWin.document.close();
      printWin.focus();
      setTimeout(() => {
        printWin.print();
      }, 500);
    }
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
          backgroundImage: 'linear-gradient(90deg, rgba(24,24,22,0.92) 0%, rgba(24,24,22,0.65) 100%), url(https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1
        }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              Hospital Patient Services Hub
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0', color: 'white' }}>
              Services & Vehicle Transport Support
            </h1>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
              Request hospital vehicle pickup, view available clinical services, and manage booking receipts
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={() => setShowRequestModal(true)}
            style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}
          >
            + Request Vehicle Support
          </button>
        </div>
      </div>

      {/* 🚗 VEHICLE TRANSPORT STATUS CARD */}
      <div className="full-width-card">
        <div className="card-header-row" style={{ marginBottom: '16px' }}>
          <div className="card-section-title">
            Your Active Vehicle Transport Request
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--primary-accent)', fontWeight: 700 }}>Real-Time Dispatch Sync</span>
        </div>

        {activeTransportReq ? (
          <div style={{ background: 'var(--bg-subtle)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-accent)' }}>Booking ID: {activeTransportReq.id}</span>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pickup: {activeTransportReq.address}</div>
              </div>
              <span className={`status-badge ${activeTransportReq.status === 'Paid' ? 'active' : activeTransportReq.status === 'Accepted' ? 'reschedule_requested' : 'inactive'}`}>
                ● {activeTransportReq.status.toUpperCase()}
              </span>
            </div>

            {activeTransportReq.status === 'Pending' && (
              <div style={{ fontSize: '0.85rem', color: 'var(--warning-color)', fontWeight: 700 }}>
                ⏳ Vehicle support request submitted. Awaiting Admin Vehicle Management approval...
              </div>
            )}

            {activeTransportReq.status === 'Accepted' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ color: '#059669', fontWeight: 800, fontSize: '0.95rem' }}>
                    ✓ Request Accepted by Admin! Travel Fare: ₹{activeTransportReq.fareAmount}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Assigned Driver: {activeTransportReq.driverName} ({activeTransportReq.driverPhone})
                  </div>
                </div>
                <button
                  className="btn-primary"
                  onClick={() => setShowRazorpayModal(true)}
                  style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)' }}
                >
                  Pay Travel Charges (₹{activeTransportReq.fareAmount} via Razorpay)
                </button>
              </div>
            )}

            {activeTransportReq.status === 'Paid' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ color: '#059669', fontWeight: 800, fontSize: '0.95rem' }}>
                    ✓ Paid & Vehicle Scheduled! (Razorpay Ref: {activeTransportReq.paymentId})
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Driver: {activeTransportReq.driverName} • Phone: {activeTransportReq.driverPhone}
                  </div>
                </div>
                <button
                  className="btn-primary"
                  onClick={handleDownloadReceipt}
                  style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}
                >
                  Download Receipt (PDF)
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
            No active vehicle transport requests. Click <strong>"+ Request Vehicle Support"</strong> to arrange home pickup.
          </div>
        )}
      </div>

      {/* Hospital Services Directory Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        {[
          { title: 'Outpatient Specialist Consultation', desc: 'Book follow-up consultations with senior hospital specialists.', icon: '🩺' },
          { title: 'Hospital Vehicle Transport Pickup', desc: 'Door-to-door shuttle service for patient home pickup and return.', icon: '🚗' },
          { title: 'Diagnostic & Pathology Labs', desc: 'Comprehensive blood work, ECG, and imaging pre-screening.', icon: '🔬' },
          { title: 'Pharmacy Prescription Dispatch', desc: 'Direct home delivery of prescribed medications and supplements.', icon: '💊' }
        ].map((svc, i) => (
          <div key={i} className="full-width-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{svc.icon}</div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: 800 }}>{svc.title}</h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{svc.desc}</p>
            </div>
            <button
              className="btn-secondary"
              style={{ marginTop: '16px', fontSize: '0.8rem', alignSelf: 'flex-start' }}
              onClick={() => setShowRequestModal(true)}
            >
              Request Service &rarr;
            </button>
          </div>
        ))}
      </div>

      {/* REQUEST VEHICLE SUPPORT MODAL */}
      {showRequestModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '480px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 800 }}>Request Hospital Vehicle Support</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Enter your home address to schedule a hospital shuttle pickup for your upcoming visit.
            </p>

            <form onSubmit={handleRequestVehicleSupport} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Pickup Home Address *</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Special Notes / Wheelchair Assistance</label>
                <input
                  type="text"
                  className="form-control"
                  value={pickupNotes}
                  onChange={(e) => setPickupNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowRequestModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Confirm & Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RAZORPAY DEMO CHECKOUT MODAL */}
      {showRazorpayModal && activeTransportReq && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '440px', background: '#0f172a', color: 'white', border: '1px solid #3b82f6', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: '#0284c7', color: 'white', fontWeight: 900, padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem' }}>
                  Razorpay
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>CareTrack Transport Checkout</span>
              </div>
              <button onClick={() => setShowRazorpayModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ background: '#1e293b', padding: '14px', borderRadius: '10px', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total Fare Amount Payable:</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38bdf8' }}>₹{activeTransportReq.fareAmount}.00</div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '4px' }}>
                Booking ID: {activeTransportReq.id} • Patient: {patient.name}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8' }}>Select Payment Method:</label>

              <div onClick={() => setPaymentMethod('upi')} style={{ background: paymentMethod === 'upi' ? '#334155' : '#1e293b', border: paymentMethod === 'upi' ? '2px solid #38bdf8' : '1px solid #475569', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="radio" checked={paymentMethod === 'upi'} readOnly />
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>UPI / Google Pay / PhonePe</span>
              </div>

              <div onClick={() => setPaymentMethod('card')} style={{ background: paymentMethod === 'card' ? '#334155' : '#1e293b', border: paymentMethod === 'card' ? '2px solid #38bdf8' : '1px solid #475569', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="radio" checked={paymentMethod === 'card'} readOnly />
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Credit / Debit Card</span>
              </div>
            </div>

            <button
              onClick={handleExecutePayment}
              style={{ width: '100%', background: 'linear-gradient(135deg, #0284c7, #0369a1)', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer' }}
            >
              Pay ₹{activeTransportReq.fareAmount} & Complete Booking &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
