// CareTrack Shared Data Store for Real-Time Cross-Panel Synchronization
// Ensures changes in Patient panel instantly update Admin, Doctor, Nurse, Dashboard & Audit Logs!

import { PATIENTS_WITH_RISK, MOCK_APPOINTMENTS, MOCK_AUDIT_LOGS } from './mockDataService';
import { calculateRiskScore, DEFAULT_RISK_WEIGHTS } from './riskEngine';

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

  // Real-time Action: Register New Patient into System
  registerNewPatient(patientData, actorName = 'Admin', role = 'Admin') {
    const patients = this.getPatients();
    const appointments = this.getAppointments();
    const logs = this.getAuditLogs();

    const newId = patientData.id || `P-${10234 + patients.length}`;
    const riskCalc = calculateRiskScore({
      missedCount: Number(patientData.missedAppointmentsCount || 1),
      distanceKm: Number(patientData.distanceKm || 12),
      frequencyDays: Number(patientData.appointmentFrequencyDays || 30),
      durationMonths: Number(patientData.treatmentDurationMonths || 6),
      age: Number(patientData.age || 45)
    }, DEFAULT_RISK_WEIGHTS);

    const newPatientObj = {
      id: newId,
      name: patientData.name,
      age: Number(patientData.age),
      gender: patientData.gender || 'Male',
      phone: patientData.phone || '+919876543219',
      address: patientData.address || 'Chennai Medical District',
      distanceKm: Number(patientData.distanceKm || 10),
      department: patientData.department || 'Cardiology',
      assignedDoctor: patientData.assignedDoctor || 'Dr. Ankit Mehta',
      assignedNurse: patientData.assignedNurse || 'Priya Sharma',
      status: 'Upcoming',
      preferredComm: 'Phone',
      lastVisitDate: new Date().toISOString().split('T')[0],
      nextFollowUpDate: '2026-09-15',
      nextFollowUpTime: '10:30 AM',
      missedAppointmentsCount: Number(patientData.missedAppointmentsCount || 0),
      totalAppointments: Number(patientData.totalAppointments || 10),
      appointmentFrequencyDays: Number(patientData.appointmentFrequencyDays || 30),
      treatmentDurationMonths: Number(patientData.treatmentDurationMonths || 6),
      risk: riskCalc,
      history: [
        {
          id: `HST-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          status: 'Completed',
          department: patientData.department || 'Cardiology',
          doctor: patientData.assignedDoctor || 'Dr. Ankit Mehta',
          notes: 'Patient registered into CareTrack platform.'
        }
      ]
    };

    const updatedPatients = [newPatientObj, ...patients];

    // Create initial appointment record
    const newAptObj = {
      id: `APT-${newId}`,
      patientId: newId,
      patientName: patientData.name,
      patientAge: Number(patientData.age),
      doctor: patientData.assignedDoctor || 'Dr. Ankit Mehta',
      department: patientData.department || 'Cardiology',
      date: '2026-09-15',
      time: '10:30 AM',
      status: 'Upcoming',
      confirmationStatus: 'Pending',
      riskScore: riskCalc.riskScore,
      riskLevel: riskCalc.riskLevel
    };

    const updatedAppointments = [newAptObj, ...appointments];

    // Append Audit Log
    const exactTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newLog = {
      id: `AUD-${Date.now()}`,
      timestamp: `${new Date().toISOString().split('T')[0]} ${exactTime}`,
      user: actorName,
      role: role,
      action: 'Registered New Patient',
      patientId: newId,
      appointmentId: newAptObj.id,
      previousValue: 'Unregistered',
      newValue: `Registered (${patientData.name})`,
      reason: 'New patient intake registration',
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
