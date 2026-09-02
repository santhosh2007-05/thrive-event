import React, { useState, useEffect } from 'react';
import dataStore from '../../services/dataStore';
import audioService from '../../services/audioService';
import batteryService from '../../services/batteryService';

export default function AgeAwarePatientView({ patient, onActionLog }) {
  const [confirmed, setConfirmed] = useState(patient.status === 'Confirmed');
  const [rescheduled, setRescheduled] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [showTransportRequestModal, setShowTransportRequestModal] = useState(false);

  const [newDate, setNewDate] = useState('2026-09-25');
  const [rescheduleReason, setRescheduleReason] = useState('Personal schedule conflict');
  const [pickupAddress, setPickupAddress] = useState(patient.address || 'No. 42, South Mada Street, Mylapore, Chennai');
  const [pickupNotes, setPickupNotes] = useState('Requires assistance with wheelchair accessibility.');
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const [batteryData, setBatteryData] = useState({
    level: 85,
    isCharging: false,
    dateTime: new Date().toLocaleString(),
    hasPermission: localStorage.getItem('caretrack_battery_permission') === 'granted'
  });

  const [transportRequests, setTransportRequests] = useState(dataStore.getTransportRequests());

  useEffect(() => {
    const unsubBattery = batteryService.subscribe((data) => {
      setBatteryData(data);
    });

    const unsubData = dataStore.subscribe(() => {
      setTransportRequests(dataStore.getTransportRequests());
      setConfirmed(patient.status === 'Confirmed');
    });

    return () => {
      unsubBattery();
      unsubData();
    };
  }, [patient.status]);

  const activeTransportReq = transportRequests.find(r => r.patientId === patient.id) || null;
  const multiVisitSchedule = dataStore.generateMultiVisitSchedule(patient);

  const handleGrantBatteryPermission = () => {
    batteryService.requestPermission();
    audioService.play2hReminder();
  };

  const handleConfirmVisit = () => {
    setConfirmed(true);
    setShowConfirmModal(false);
    audioService.play2hReminder();

    dataStore.confirmPatientAppointment(patient.id, patient.name, 'Patient');
    if (onActionLog) onActionLog('Confirmed Appointment Visit', patient.id, 'Upcoming', 'Confirmed', 'Patient self-service portal confirmation');
  };

  const handleRescheduleVisit = (e) => {
    e.preventDefault();
    setRescheduled(true);
    setShowRescheduleModal(false);
    audioService.play2hReminder();

    dataStore.updateAppointmentStatus(`APT-${patient.id}`, 'Rescheduled Requested', `Patient requested reschedule to ${newDate}. Reason: ${rescheduleReason}`, patient.name, 'Patient');
    if (onActionLog) onActionLog('Requested Visit Reschedule', patient.id, 'Upcoming', 'Reschedule Requested', `Requested new date ${newDate}`);
  };

  const handleSubmitTransportRequest = (e) => {
    e.preventDefault();
    dataStore.requestTransportShuttle(patient.id, pickupAddress, pickupNotes);
    setShowTransportRequestModal(false);
    audioService.play2hReminder();
  };

  const handleExecuteRazorpayPayment = () => {
    if (!activeTransportReq) return;
    const paymentId = `pay_RZP_${Date.now()}`;
    dataStore.payTransportShuttle(activeTransportReq.id, { paymentId });
    setShowRazorpayModal(false);
    audioService.play2hReminder();
  };

  const handleDownloadReceiptPdf = () => {
    if (!activeTransportReq) return;

    const receiptHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>CareTrack Transport & Payment Receipt - ${activeTransportReq.id}</title>
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
          <div class="row"><span>Hospital Department:</span><strong>${patient.department} Clinic</strong></div>
          <div class="row"><span>Assigned Shuttle Driver:</span><strong>${activeTransportReq.driverName}</strong></div>
          <div class="row"><span>Driver Contact Phone:</span><strong>${activeTransportReq.driverPhone}</strong></div>
          <div class="row"><span>Distance & Travel Fare:</span><strong style="color: #059669; font-size: 16px;">₹${activeTransportReq.fareAmount} (${activeTransportReq.distanceKm} km)</strong></div>
          <div class="row"><span>Transaction Date:</span><strong>${activeTransportReq.paidAt || new Date().toLocaleString()}</strong></div>
        </div>

        <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 16px; border-radius: 8px; font-size: 13px; color: #065f46;">
          <strong>Instructions for Patient:</strong> Please be ready at your pickup address 30 minutes before your scheduled appointment time. The assigned shuttle driver will call your phone (+91 7598357132) upon arrival.
        </div>

        <div class="footer">
          CareTrack Health • Operational Line: +91 7598357132 • Support: support@caretrack.health<br/>
          Chennai, Tamil Nadu, India • Official Electronic Receipt
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

  const numVisits = patient.totalAppointments || 6;
  const freqGapDays = patient.appointmentFrequencyDays || 30;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 🔒 REAL-TIME BATTERY & DATE PERMISSION BANNER */}
      {!batteryData.hasPermission ? (
        <div style={{
          background: 'linear-gradient(135deg, #0284c7, #0369a1)',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: 'var(--shadow-soft)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Allow Real-Time Battery & Clock Access Permission?</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                Enables automated outreach SMS before device battery runs out and syncs system date/time in real time.
              </div>
            </div>
          </div>

          <button
            onClick={handleGrantBatteryPermission}
            style={{
              background: '#ffffff',
              color: '#0369a1',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '20px',
              fontWeight: 800,
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Grant Real-Time Permission
          </button>
        </div>
      ) : (
        <div style={{
          background: 'var(--bg-subtle)',
          padding: '8px 16px',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>Real-time Safeguards Active • Live Date/Time: <strong>{batteryData.dateTime}</strong></span>
          </div>
          <div>
            Battery Monitor: <strong style={{ color: batteryData.level <= 15 ? '#e11d48' : '#059669' }}>{batteryData.level}%</strong> {batteryData.isCharging ? '(Charging)' : ''}
          </div>
        </div>
      )}

      {/* Patient Portal Card with Hospital Building Banner & Date Badge */}
      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: '20px',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-soft)'
      }}>
        {/* Blue Banner Header with Medical Building Graphics */}
        <div style={{
          position: 'relative',
          height: '140px',
          background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
          padding: '24px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.25
          }} />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: '0.75rem', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>
              CARETRACK PATIENT PORTAL
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '4px 0 0 0', color: 'white' }}>
              {patient.department} Outpatient Clinic
            </h2>
            <div style={{ fontSize: '0.85rem', color: '#dbeafe', marginTop: '4px' }}>
              Chennai General Hospital • Main Medical Block
            </div>
          </div>

          <div style={{
            position: 'relative',
            zIndex: 2,
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 800
          }}>
            Patient ID: {patient.id}
          </div>
        </div>

        {/* Card Body: Soft Blue Appointment Date Container */}
        <div style={{ padding: '24px' }}>
          <div style={{
            background: 'var(--bg-subtle)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
                UPCOMING APPOINTMENT DATE & TIME
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', margin: '4px 0' }}>
                🗓️ {patient.nextFollowUpDate} at {patient.nextFollowUpTime}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Attending Physician: <strong style={{ color: 'var(--text-main)' }}>{patient.assignedDoctor}</strong>
              </div>
            </div>

            <div>
              {confirmed ? (
                <span style={{ background: 'var(--accent-soft)', color: 'var(--primary-accent)', padding: '8px 18px', borderRadius: '30px', fontWeight: 800, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  ✓ VISIT CONFIRMED
                </span>
              ) : rescheduled ? (
                <span style={{ background: 'var(--warning-soft)', color: 'var(--warning-color)', padding: '8px 18px', borderRadius: '30px', fontWeight: 800, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  ⏳ RESCHEDULE REQUESTED
                </span>
              ) : (
                <span style={{ background: 'var(--warning-soft)', color: 'var(--warning-color)', padding: '8px 18px', borderRadius: '30px', fontWeight: 800, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  ● CONFIRMATION PENDING
                </span>
              )}
            </div>
          </div>

          {/* Clinical Details & Appointment Frequency List */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-highlight)', color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Specialist Department</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{patient.department} Clinic</div>
              </div>
            </div>

            {/* Total Planned Visits Badge */}
            <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Planned Visits</div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary-accent)' }}>{numVisits} Planned Visits</div>
              </div>
            </div>

            {/* Visit Frequency Gap Badge */}
            <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--info-soft)', color: 'var(--info-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Visit Frequency Gap</div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--info-color)' }}>Every {freqGapDays} Days</div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-highlight)', color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hospital Distance</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{patient.distanceKm} km</div>
              </div>
            </div>
          </div>

          {/* Action Buttons: Confirm Visit & Request Reschedule */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <button
              className="btn-primary"
              onClick={() => setShowConfirmModal(true)}
              disabled={confirmed}
              style={{
                background: confirmed ? 'var(--bg-subtle)' : 'linear-gradient(135deg, #059669, #047857)',
                color: confirmed ? 'var(--text-muted)' : 'white',
                border: 'none',
                boxShadow: confirmed ? 'none' : '0 4px 15px rgba(5, 150, 105, 0.4)'
              }}
            >
              {confirmed ? '✓ Visit Confirmed' : '✓ Confirm My Attendance'}
            </button>

            <button
              className="btn-secondary"
              onClick={() => setShowRescheduleModal(true)}
            >
              Request Reschedule &rarr;
            </button>
          </div>

          {/* 🚗 HOME VEHICLE TRANSPORT SHUTTLE PICKUP WORKFLOW WIDGET */}
          <div style={{
            background: 'var(--bg-subtle)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--primary-accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  HOSPITAL TRANSPORT ASSISTANCE
                </div>
                <h4 style={{ margin: '2px 0 0 0', fontSize: '1.1rem', fontWeight: 800 }}>
                  Home Vehicle Pickup Request
                </h4>
              </div>

              {!activeTransportReq && (
                <button
                  className="btn-primary"
                  onClick={() => setShowTransportRequestModal(true)}
                  style={{ fontSize: '0.8rem', padding: '8px 16px' }}
                >
                  + Request Home Shuttle Pickup
                </button>
              )}
            </div>

            {activeTransportReq ? (
              <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Request Ref: <strong>{activeTransportReq.id}</strong></span>
                  </div>
                  <div>
                    <span style={{
                      background: activeTransportReq.status === 'Paid' ? 'var(--accent-soft)' : activeTransportReq.status === 'Accepted' ? 'var(--info-soft)' : 'var(--warning-soft)',
                      color: activeTransportReq.status === 'Paid' ? 'var(--primary-accent)' : activeTransportReq.status === 'Accepted' ? 'var(--info-color)' : 'var(--warning-color)',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontWeight: 800,
                      fontSize: '0.75rem'
                    }}>
                      ● STATUS: {activeTransportReq.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '12px' }}>
                  Pickup Location: <strong>{activeTransportReq.address}</strong> ({activeTransportReq.distanceKm} km from hospital)
                </div>

                {activeTransportReq.status === 'Pending' && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--warning-color)', fontWeight: 600 }}>
                    ⏳ Your pickup request has been submitted to the Admin Transport Desk. Awaiting hospital approval...
                  </div>
                )}

                {activeTransportReq.status === 'Accepted' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 800 }}>
                        ✓ Hospital Approved! Travel Fare: ₹{activeTransportReq.fareAmount}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Driver: {activeTransportReq.driverName} ({activeTransportReq.driverPhone})
                      </div>
                    </div>

                    <button
                      className="btn-primary"
                      onClick={() => setShowRazorpayModal(true)}
                      style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)', padding: '8px 16px', fontSize: '0.8rem' }}
                    >
                      Pay Travel Charges (₹{activeTransportReq.fareAmount} via Razorpay)
                    </button>
                  </div>
                )}

                {activeTransportReq.status === 'Paid' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 800 }}>
                        ✓ Paid & Vehicle Scheduled! (Ref: {activeTransportReq.paymentId})
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Assigned Driver: {activeTransportReq.driverName} • Contact: {activeTransportReq.driverPhone}
                      </div>
                    </div>

                    <button
                      className="btn-primary"
                      onClick={handleDownloadReceiptPdf}
                      style={{ background: 'linear-gradient(135deg, #059669, #047857)', padding: '8px 16px', fontSize: '0.8rem' }}
                    >
                      Download Receipt (PDF)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Need transport to the hospital? Request our dedicated patient shuttle service for home pickup.
              </div>
            )}
          </div>

          {/* 📅 MULTI-VISIT CARE SCHEDULE BREAKDOWN */}
          <div style={{ marginTop: '24px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--primary-accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              FULL TREATMENT PATHWAY
            </div>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 800 }}>
              Your Multi-Visit Care Schedule ({numVisits} Total Appointments)
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {multiVisitSchedule.map((item) => (
                <div
                  key={item.visitNumber}
                  style={{
                    background: item.visitNumber === 1 ? 'var(--bg-highlight)' : 'var(--bg-surface)',
                    border: item.visitNumber === 1 ? '2px solid var(--primary-accent)' : '1px solid var(--border-color)',
                    padding: '14px',
                    borderRadius: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-accent)' }}>
                      VISIT #{item.visitNumber}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.status}</span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    🗓️ {item.date}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {item.time} • {item.department}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 💳 DEMO RAZORPAY PAYMENT MODAL */}
      {showRazorpayModal && activeTransportReq && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '440px', background: '#0f172a', color: 'white', border: '1px solid #3b82f6', borderRadius: '16px' }}>
            {/* Razorpay Brand Header */}
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
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total Amount Payable:</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38bdf8' }}>₹{activeTransportReq.fareAmount}.00</div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '4px' }}>
                Booking ID: {activeTransportReq.id} • Patient: {patient.name}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8' }}>Select Payment Method:</label>

              <div
                onClick={() => setPaymentMethod('upi')}
                style={{ background: paymentMethod === 'upi' ? '#334155' : '#1e293b', border: paymentMethod === 'upi' ? '2px solid #38bdf8' : '1px solid #475569', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <input type="radio" checked={paymentMethod === 'upi'} readOnly />
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>UPI / Google Pay / PhonePe (Instant)</span>
              </div>

              <div
                onClick={() => setPaymentMethod('card')}
                style={{ background: paymentMethod === 'card' ? '#334155' : '#1e293b', border: paymentMethod === 'card' ? '2px solid #38bdf8' : '1px solid #475569', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <input type="radio" checked={paymentMethod === 'card'} readOnly />
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Credit / Debit Card</span>
              </div>

              <div
                onClick={() => setPaymentMethod('netbanking')}
                style={{ background: paymentMethod === 'netbanking' ? '#334155' : '#1e293b', border: paymentMethod === 'netbanking' ? '2px solid #38bdf8' : '1px solid #475569', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <input type="radio" checked={paymentMethod === 'netbanking'} readOnly />
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Net Banking</span>
              </div>
            </div>

            <button
              onClick={handleExecuteRazorpayPayment}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                color: 'white',
                border: 'none',
                padding: '14px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              Pay ₹{activeTransportReq.fareAmount} & Complete Booking &rarr;
            </button>
          </div>
        </div>
      )}

      {/* REQUEST TRANSPORT MODAL */}
      {showTransportRequestModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '480px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 800 }}>Request Home Shuttle Pickup</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Request hospital transport pickup from your home to Chennai General Hospital.
            </p>

            <form onSubmit={handleSubmitTransportRequest} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Pickup Address *</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Special Notes / Accessibility Assistance</label>
                <input
                  type="text"
                  className="form-control"
                  value={pickupNotes}
                  onChange={(e) => setPickupNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowTransportRequestModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Submit Transport Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Visit Modal */}
      {showConfirmModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '440px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 800 }}>Confirm Appointment Visit</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Are you sure you want to confirm attendance for your appointment on <strong>{patient.nextFollowUpDate}</strong> at <strong>{patient.nextFollowUpTime}</strong>?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn-secondary" onClick={() => setShowConfirmModal(false)}>Cancel</button>
              <button className="btn-primary" style={{ background: '#059669' }} onClick={handleConfirmVisit}>Yes, Confirm Attendance</button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '480px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 800 }}>Request Reschedule</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Select your preferred new visit date and state your reason for the clinic staff.
            </p>
            <form onSubmit={handleRescheduleVisit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Preferred New Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Reason for Reschedule *</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowRescheduleModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Submit Reschedule Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
