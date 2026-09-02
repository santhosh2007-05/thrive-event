// CareTrack Shared Data Store for Real-Time Cross-Panel Synchronization
// Manages Patients, Appointments, Transport Shuttle Requests, and Audit Logs in localStorage!

import { PATIENTS_WITH_RISK, MOCK_APPOINTMENTS, MOCK_AUDIT_LOGS } from './mockDataService';

const STORAGE_KEYS = {
  PATIENTS: 'caretrack_patients_v2',
  APPOINTMENTS: 'caretrack_appointments_v2',
  AUDIT_LOGS: 'caretrack_audit_logs_v2',
  TRANSPORT: 'caretrack_transport_requests_v1'
};

const DEFAULT_TRANSPORT_REQUESTS = [
  {
    id: 'TRP-1001',
    patientId: 'P-1001',
    patientName: 'Santhosh M',
    phone: '+91 7598357132',
    address: 'No. 42, South Mada Street, Mylapore, Chennai',
    distanceKm: 5.0,
    requestedDate: '2026-09-15',
    requestedTime: '10:30 AM',
    status: 'Pending', // Pending | Accepted | Paid
    fareAmount: 250,
    driverName: 'Ramesh Kumar (Hospital Shuttle #4)',
    driverPhone: '+91 98765 43210',
    paymentId: null,
    paidAt: null
  }
];

class DataStore {
  constructor() {
    this.listeners = [];
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(PATIENTS_WITH_RISK));
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(MOCK_APPOINTMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(MOCK_AUDIT_LOGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRANSPORT)) {
      localStorage.setItem(STORAGE_KEYS.TRANSPORT, JSON.stringify(DEFAULT_TRANSPORT_REQUESTS));
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener());
  }

  getPatients() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENTS)) || PATIENTS_WITH_RISK;
    } catch (e) {
      return PATIENTS_WITH_RISK;
    }
  }

  getAppointments() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) || MOCK_APPOINTMENTS;
    } catch (e) {
      return MOCK_APPOINTMENTS;
    }
  }

  getAuditLogs() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) || MOCK_AUDIT_LOGS;
    } catch (e) {
      return MOCK_AUDIT_LOGS;
    }
  }

  getTransportRequests() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSPORT)) || DEFAULT_TRANSPORT_REQUESTS;
    } catch (e) {
      return DEFAULT_TRANSPORT_REQUESTS;
    }
  }

  // Compute multi-visit schedule array based on totalAppointments and appointmentFrequencyDays
  generateMultiVisitSchedule(patient) {
    const numVisits = patient.totalAppointments || 6;
    const gapDays = patient.appointmentFrequencyDays || 30;
    const baseDate = new Date(patient.nextFollowUpDate || '2026-09-15');

    const schedule = [];
    for (let i = 0; i < numVisits; i++) {
      const visitDate = new Date(baseDate);
      visitDate.setDate(baseDate.getDate() + (i * gapDays));
      const dateStr = visitDate.toISOString().split('T')[0];

      schedule.push({
        visitNumber: i + 1,
        date: dateStr,
        time: patient.nextFollowUpTime || '10:30 AM',
        department: patient.department || 'Cardiology',
        doctor: patient.assignedDoctor || 'Dr. Sundaramurthy Iyer',
        status: i === 0 ? (patient.status || 'Upcoming') : 'Scheduled'
      });
    }

    return schedule;
  }

  // Home Transport Request Actions
  requestTransportShuttle(patientId, address, notes = '') {
    const patients = this.getPatients();
    const requests = this.getTransportRequests();
    const patient = patients.find(p => p.id === patientId) || patients[0];

    const dist = patient.distanceKm || 5;
    const calculatedFare = Math.max(100, Math.round(dist * 50)); // ₹50/km, min ₹100

    const newRequest = {
      id: `TRP-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      phone: patient.phone,
      address: address || patient.address || 'Chennai Outpatient District',
      distanceKm: dist,
      requestedDate: patient.nextFollowUpDate || '2026-09-15',
      requestedTime: patient.nextFollowUpTime || '10:30 AM',
      status: 'Pending',
      fareAmount: calculatedFare,
      driverName: 'Assigned Hospital Shuttle Driver',
      driverPhone: '+91 7598357132',
      notes: notes,
      paymentId: null,
      paidAt: null
    };

    const updated = [newRequest, ...requests];
    localStorage.setItem(STORAGE_KEYS.TRANSPORT, JSON.stringify(updated));
    this.notify();
    return newRequest;
  }

  approveTransportShuttle(requestId, fareAmount = 250, driverDetails = 'Ramesh Kumar (Hospital Shuttle #4)') {
    const requests = this.getTransportRequests();
    const logs = this.getAuditLogs();

    const updated = requests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'Accepted',
          fareAmount: Number(fareAmount),
          driverName: driverDetails
        };
      }
      return req;
    });

    const newLog = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: 'Admin Staff',
      role: 'Admin',
      action: 'Accepted Transport Shuttle Request',
      patientId: requests.find(r => r.id === requestId)?.patientId || 'P-1001',
      appointmentId: requestId,
      previousValue: 'Pending',
      newValue: `Accepted (Fare: ₹${fareAmount})`,
      reason: 'Assigned hospital shuttle vehicle & confirmed pickup',
      ipAddress: '192.168.1.10'
    };

    localStorage.setItem(STORAGE_KEYS.TRANSPORT, JSON.stringify(updated));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([newLog, ...logs]));
    this.notify();
    return updated;
  }

  payTransportShuttle(requestId, paymentDetails = {}) {
    const requests = this.getTransportRequests();
    const logs = this.getAuditLogs();

    const updated = requests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'Paid',
          paymentId: paymentDetails.paymentId || `pay_RZP_${Date.now()}`,
          paidAt: new Date().toLocaleString()
        };
      }
      return req;
    });

    const targetReq = requests.find(r => r.id === requestId);
    const newLog = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: targetReq?.patientName || 'Patient',
      role: 'Patient',
      action: 'Paid Transport Fare via Razorpay Demo',
      patientId: targetReq?.patientId || 'P-1001',
      appointmentId: requestId,
      previousValue: 'Accepted',
      newValue: 'Paid & Confirmed',
      reason: `Razorpay payment successful (${paymentDetails.paymentId || 'pay_RZP'})`,
      ipAddress: '192.168.1.45'
    };

    localStorage.setItem(STORAGE_KEYS.TRANSPORT, JSON.stringify(updated));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([newLog, ...logs]));
    this.notify();
    return updated;
  }

  // Real-time Action: Register New Patient
  registerNewPatient(patientData, actorName = 'Admin', role = 'Admin') {
    const patients = this.getPatients();
    const appointments = this.getAppointments();
    const logs = this.getAuditLogs();

    const nextNumber = 1001 + patients.length;
    const newId = `P-${nextNumber}`;
    const numVisits = Number(patientData.totalAppointments || 6);
    const freqDays = Number(patientData.appointmentFrequencyDays || 30);

    const newPatientRisk = {
      riskScore: 12,
      riskLevel: 'LOW',
      modelVersion: 'New Intake Baseline v1.0',
      explanation: 'First time intake appointment. No past missed visits.',
      primaryContributors: ['First time hospital intake', 'Proximity to health facility'],
      factorsSorted: [
        { key: 'missed', label: 'Missed Appointments History', raw: '0 visits', points: 0, maxPoints: 30 },
        { key: 'distance', label: 'Hospital Distance', raw: `${patientData.distanceKm || 5} km`, points: 5, maxPoints: 25 },
        { key: 'age', label: 'Patient Age', raw: `${patientData.age || 30} yrs`, points: 5, maxPoints: 15 }
      ]
    };

    const newPatientObj = {
      id: newId,
      name: patientData.name || 'New Patient',
      age: Number(patientData.age || 30),
      gender: patientData.gender || 'Male',
      phone: patientData.phone || '+91 7598357132',
      address: patientData.address || 'Chennai Medical District',
      distanceKm: Number(patientData.distanceKm || 5),
      department: patientData.department || 'Cardiology',
      assignedDoctor: patientData.assignedDoctor || 'Dr. Sundaramurthy Iyer',
      assignedNurse: patientData.assignedNurse || 'Meenakshi Sundaram',
      status: 'Upcoming',
      preferredComm: 'Phone',
      lastVisitDate: 'N/A (First Intake)',
      nextFollowUpDate: '2026-09-15',
      nextFollowUpTime: '10:30 AM',
      missedAppointmentsCount: 0,
      totalAppointments: numVisits,
      appointmentFrequencyDays: freqDays,
      treatmentDurationMonths: Math.ceil((numVisits * freqDays) / 30),
      risk: newPatientRisk,
      history: [
        {
          id: `HST-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          status: 'Completed',
          department: patientData.department || 'Cardiology',
          doctor: patientData.assignedDoctor || 'Dr. Sundaramurthy Iyer',
          notes: `Intake registration completed. Total planned visits: ${numVisits}, Frequency gap: ${freqDays} days.`
        }
      ]
    };

    const updatedPatients = [newPatientObj, ...patients];

    const newAptObj = {
      id: `APT-${newId}`,
      patientId: newId,
      patientName: newPatientObj.name,
      patientAge: newPatientObj.age,
      doctor: newPatientObj.assignedDoctor,
      department: newPatientObj.department,
      date: '2026-09-15',
      time: '10:30 AM',
      status: 'Upcoming',
      confirmationStatus: 'Pending',
      riskScore: 12,
      riskLevel: 'LOW'
    };

    const updatedAppointments = [newAptObj, ...appointments];

    const exactTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newLog = {
      id: `AUD-${Date.now()}`,
      timestamp: `${new Date().toISOString().split('T')[0]} ${exactTime}`,
      user: actorName,
      role: role,
      action: 'Registered New Patient Intake',
      patientId: newId,
      appointmentId: newAptObj.id,
      previousValue: 'Unregistered',
      newValue: `Registered (${newPatientObj.name})`,
      reason: `Intake registered with ${numVisits} visits every ${freqDays} days`,
      ipAddress: '192.168.1.10'
    };

    const updatedLogs = [newLog, ...logs];

    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(updatedPatients));
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updatedAppointments));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updatedLogs));

    this.notify();
    return { newPatientObj, updatedPatients };
  }

  // Real-time Action: Confirm Patient Appointment
  confirmPatientAppointment(patientId, actorName = 'Patient', role = 'Patient') {
    const patients = this.getPatients();
    const appointments = this.getAppointments();
    const logs = this.getAuditLogs();

    const exactTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let targetPatientName = patientId;

    const updatedPatients = patients.map(p => {
      if (p.id === patientId) {
        targetPatientName = p.name;
        return { ...p, status: 'Confirmed' };
      }
      return p;
    });

    const updatedAppointments = appointments.map(apt => {
      if (apt.patientId === patientId || apt.patientName === targetPatientName) {
        return {
          ...apt,
          status: 'Confirmed',
          confirmationStatus: 'Confirmed'
        };
      }
      return apt;
    });

    const newLog = {
      id: `AUD-${Date.now()}`,
      timestamp: `${new Date().toISOString().split('T')[0]} ${exactTime}`,
      user: actorName,
      role: role,
      action: 'Confirmed Appointment Visit',
      patientId: patientId,
      appointmentId: updatedAppointments.find(a => a.patientId === patientId)?.id || 'APT-20260901',
      previousValue: 'Pending / Unconfirmed',
      newValue: 'Confirmed',
      reason: 'Patient self-service portal confirmation',
      ipAddress: '192.168.1.45'
    };

    const updatedLogs = [newLog, ...logs];

    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(updatedPatients));
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updatedAppointments));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updatedLogs));

    this.notify();
    return { updatedPatients, updatedAppointments, updatedLogs };
  }

  // Real-time Action: Log Staff Call Outcome or Reschedule
  updateAppointmentStatus(appointmentId, newStatus, reason = 'Staff action', actorName = 'Staff Nurse', role = 'Nurse') {
    const appointments = this.getAppointments();
    const logs = this.getAuditLogs();

    const exactTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let previousStatus = 'Pending';
    let targetPatientId = 'P-1001';

    const updatedAppointments = appointments.map(apt => {
      if (apt.id === appointmentId) {
        previousStatus = apt.status;
        targetPatientId = apt.patientId;
        return {
          ...apt,
          status: newStatus,
          confirmationStatus: newStatus === 'Confirmed' ? 'Confirmed' : apt.confirmationStatus
        };
      }
      return apt;
    });

    const newLog = {
      id: `AUD-${Date.now()}`,
      timestamp: `${new Date().toISOString().split('T')[0]} ${exactTime}`,
      user: actorName,
      role: role,
      action: `Changed status to ${newStatus}`,
      patientId: targetPatientId,
      appointmentId: appointmentId,
      previousValue: previousStatus,
      newValue: newStatus,
      reason: reason,
      ipAddress: '192.168.1.24'
    };

    const updatedLogs = [newLog, ...logs];

    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updatedAppointments));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updatedLogs));

    this.notify();
    return { updatedAppointments, updatedLogs };
  }
}

export const dataStore = new DataStore();
export default dataStore;
