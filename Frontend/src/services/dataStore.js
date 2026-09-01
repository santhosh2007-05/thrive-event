// CareTrack Shared Data Store for Real-Time Cross-Panel Synchronization
// Ensures changes in Patient panel instantly update Admin, Doctor, Nurse, Dashboard & Audit Logs!

import { PATIENTS_WITH_RISK, MOCK_APPOINTMENTS, MOCK_AUDIT_LOGS } from './mockDataService';

const STORAGE_KEYS = {
  PATIENTS: 'caretrack_patients',
  APPOINTMENTS: 'caretrack_appointments',
  AUDIT_LOGS: 'caretrack_audit_logs'
};

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

  // Real-time Action: Confirm Patient Appointment
  confirmPatientAppointment(patientId, actorName = 'Patient', role = 'Patient') {
    const patients = this.getPatients();
    const appointments = this.getAppointments();
    const logs = this.getAuditLogs();

    let targetPatientName = patientId;

    // 1. Update Patient
    const updatedPatients = patients.map(p => {
      if (p.id === patientId) {
        targetPatientName = p.name;
        return { ...p, status: 'Confirmed' };
      }
      return p;
    });

    // 2. Update Appointment
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

    // 3. Append Immutable Audit Log
    const newLog = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
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

    // Save to Storage
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

    let previousStatus = 'Pending';
    let targetPatientId = 'P-10234';

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
      timestamp: new Date().toLocaleString(),
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
