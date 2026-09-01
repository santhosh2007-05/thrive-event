// CareTrack Synthetic Healthcare Operational Dataset
// Contains 100% synthetic, realistic data for demonstration.

import { calculateRiskScore } from './riskEngine';

export const MOCK_PATIENTS = [
  {
    id: "P-10234",
    name: "Ramesh Kumar",
    age: 68,
    gender: "Male",
    phone: "+91 98765 43210",
    email: "ramesh.kumar@example.com",
    address: "Plot 42, Sector 14, Outer Ring Road, Bengaluru",
    distanceKm: 24,
    treatmentDurationMonths: 8,
    missedAppointmentsCount: 3,
    appointmentFrequencyDays: 30,
    department: "Cardiology",
    assignedDoctor: "Dr. Ankit Mehta",
    assignedNurse: "Priya Sharma",
    preferredComm: "Phone",
    requiresAssistedComm: true,
    techFamiliarity: "Low", // 'Low' | 'Moderate' | 'High'
    lastVisitDate: "2026-08-15",
    nextFollowUpDate: "2026-09-05",
    nextFollowUpTime: "10:30 AM",
    status: "Upcoming",
    history: [
      { id: "h1", date: "2026-08-15", status: "Completed", doctor: "Dr. Ankit Mehta", department: "Cardiology", notes: "Blood pressure controlled. Advised ECG in next visit." },
      { id: "h2", date: "2026-08-02", status: "Missed", doctor: "Dr. Ankit Mehta", department: "Cardiology", notes: "No show. Distance & transport cited." },
      { id: "h3", date: "2026-07-20", status: "Completed", doctor: "Dr. Ankit Mehta", department: "Cardiology", notes: "Medication adjusted." },
      { id: "h4", date: "2026-07-05", status: "Rescheduled", doctor: "Dr. Ankit Mehta", department: "Cardiology", notes: "Rescheduled on patient request." }
    ]
  },
  {
    id: "P-10235",
    name: "Ananya Sharma",
    age: 28,
    gender: "Female",
    phone: "+91 98123 45678",
    email: "ananya.sharma@techcorp.io",
    address: "Indiranagar 100ft Road, Bengaluru",
    distanceKm: 4,
    treatmentDurationMonths: 2,
    missedAppointmentsCount: 0,
    appointmentFrequencyDays: 14,
    department: "Dermatology",
    assignedDoctor: "Dr. Sneha Reddy",
    assignedNurse: "Sunita Rao",
    preferredComm: "WhatsApp",
    requiresAssistedComm: false,
    techFamiliarity: "High",
    lastVisitDate: "2026-08-22",
    nextFollowUpDate: "2026-09-02",
    nextFollowUpTime: "02:15 PM",
    status: "Confirmed",
    history: [
      { id: "h10", date: "2026-08-22", status: "Completed", doctor: "Dr. Sneha Reddy", department: "Dermatology", notes: "Skin allergy follow-up. Healing well." }
    ]
  },
  {
    id: "P-10236",
    name: "Sunita Verma",
    age: 74,
    gender: "Female",
    phone: "+91 94455 66778",
    email: "sunita.v@example.com",
    address: "JP Nagar Phase 6, Bengaluru",
    distanceKm: 18,
    treatmentDurationMonths: 14,
    missedAppointmentsCount: 2,
    appointmentFrequencyDays: 45,
    department: "Orthopedics",
    assignedDoctor: "Dr. Vikram Seth",
    assignedNurse: "Priya Sharma",
    preferredComm: "Phone",
    requiresAssistedComm: true,
    techFamiliarity: "Low",
    lastVisitDate: "2026-07-18",
    nextFollowUpDate: "2026-09-01",
    nextFollowUpTime: "11:00 AM",
    status: "Missed",
    history: [
      { id: "h20", date: "2026-07-18", status: "Completed", doctor: "Dr. Vikram Seth", department: "Orthopedics", notes: "Knee replacement checkup." },
      { id: "h21", date: "2026-06-01", status: "Missed", doctor: "Dr. Vikram Seth", department: "Orthopedics", notes: "Forgot appointment date." }
    ]
  },
  {
    id: "P-10237",
    name: "Rajesh Patel",
    age: 52,
    gender: "Male",
    phone: "+91 97234 56789",
    email: "rajesh.patel@logistics.com",
    address: "Whitefield Main Road, Bengaluru",
    distanceKm: 12,
    treatmentDurationMonths: 6,
    missedAppointmentsCount: 1,
    appointmentFrequencyDays: 30,
    department: "Endocrinology",
    assignedDoctor: "Dr. K. V. Rao",
    assignedNurse: "Deepak Verma",
    preferredComm: "SMS",
    requiresAssistedComm: false,
    techFamiliarity: "Moderate",
    lastVisitDate: "2026-08-01",
    nextFollowUpDate: "2026-09-03",
    nextFollowUpTime: "09:30 AM",
    status: "Pending",
    history: [
      { id: "h30", date: "2026-08-01", status: "Completed", doctor: "Dr. K. V. Rao", department: "Endocrinology", notes: "Diabetes HbA1c review." },
      { id: "h31", date: "2026-07-02", status: "Missed", doctor: "Dr. K. V. Rao", department: "Endocrinology", notes: "Work conflict." }
    ]
  },
  {
    id: "P-10238",
    name: "Vikram Singh",
    age: 34,
    gender: "Male",
    phone: "+91 99001 12233",
    email: "vikram.singh@designstudio.in",
    address: "Koramangala 5th Block, Bengaluru",
    distanceKm: 6,
    treatmentDurationMonths: 4,
    missedAppointmentsCount: 0,
    appointmentFrequencyDays: 21,
    department: "Neurology",
    assignedDoctor: "Dr. Ankit Mehta",
    assignedNurse: "Sunita Rao",
    preferredComm: "Email",
    requiresAssistedComm: false,
    techFamiliarity: "High",
    lastVisitDate: "2026-08-10",
    nextFollowUpDate: "2026-09-07",
    nextFollowUpTime: "04:00 PM",
    status: "Confirmed",
    history: [
      { id: "h40", date: "2026-08-10", status: "Completed", doctor: "Dr. Ankit Mehta", department: "Neurology", notes: "Migraine assessment." }
    ]
  }
];

// Dynamically augment mock patients with computed risk predictions
export const PATIENTS_WITH_RISK = MOCK_PATIENTS.map(patient => {
  const riskCalculation = calculateRiskScore({
    missedCount: patient.missedAppointmentsCount,
    distanceKm: patient.distanceKm,
    frequencyDays: patient.appointmentFrequencyDays,
    durationMonths: patient.treatmentDurationMonths,
    age: patient.age
  });
  return {
    ...patient,
    risk: riskCalculation
  };
});

export const MOCK_APPOINTMENTS = PATIENTS_WITH_RISK.map((patient, index) => ({
  id: `APT-2026090${index + 1}`,
  patientId: patient.id,
  patientName: patient.name,
  patientAge: patient.age,
  doctor: patient.assignedDoctor,
  department: patient.department,
  date: patient.nextFollowUpDate,
  time: patient.nextFollowUpTime,
  status: patient.status,
  riskScore: patient.risk.riskScore,
  riskLevel: patient.risk.riskLevel,
  riskColor: patient.risk.riskColor,
  confirmationStatus: patient.status === 'Confirmed' ? 'Confirmed' : 'Unconfirmed',
  remindersSent: [
    { type: 'SMS', date: '2026-08-31 09:00 AM', status: 'Delivered' }
  ],
  communications: [
    { type: 'SMS', sender: 'System', text: 'Reminder: Follow-up visit on ' + patient.nextFollowUpDate, timestamp: '2026-08-31 09:00 AM' }
  ]
}));

export const MOCK_NOTIFICATIONS = [
  {
    id: "N-501",
    category: "High Risk",
    title: "HIGH RISK: Follow-up Unconfirmed",
    message: "Ramesh Kumar (P-10234, 68 yrs) has not confirmed his Cardiology follow-up appointment scheduled for 05 Sep 2026 at 10:30 AM.",
    patientId: "P-10234",
    appointmentId: "APT-20260901",
    timestamp: "2026-09-01 10:15 AM",
    isRead: false,
    severity: "danger", // 'danger' | 'warning' | 'info'
    patientName: "Ramesh Kumar",
    actionRequired: "Call Patient"
  },
  {
    id: "N-502",
    category: "Missed Follow-up",
    title: "MISSED FOLLOW-UP ALERT",
    message: "Sunita Verma (P-10236, 74 yrs) missed her scheduled Orthopedics follow-up today at 11:00 AM.",
    patientId: "P-10236",
    appointmentId: "APT-20260903",
    timestamp: "2026-09-01 11:15 AM",
    isRead: false,
    severity: "danger",
    patientName: "Sunita Verma",
    actionRequired: "Outreach & Reschedule"
  },
  {
    id: "N-503",
    category: "Upcoming",
    title: "Upcoming High-Risk Visit",
    message: "Rajesh Patel (P-10237) follow-up visit scheduled for 03 Sep 2026 in Endocrinology.",
    patientId: "P-10237",
    appointmentId: "APT-20260904",
    timestamp: "2026-09-01 08:30 AM",
    isRead: true,
    severity: "warning",
    patientName: "Rajesh Patel",
    actionRequired: "Send SMS Reminder"
  }
];

export const MOCK_AUDIT_LOGS = [
  {
    id: "AUD-901",
    timestamp: "2026-09-01 11:45 AM",
    user: "System Administrator",
    role: "Admin",
    action: "Configured Risk Weights",
    patientId: "N/A",
    appointmentId: "N/A",
    previousValue: "Missed 25%, Distance 25%",
    newValue: "Missed 30%, Distance 25%",
    reason: "Updated algorithm calibration for Q3",
    ipAddress: "192.168.1.10"
  },
  {
    id: "AUD-902",
    timestamp: "2026-09-01 10:31 AM",
    user: "Priya Sharma",
    role: "Nurse",
    action: "Changed appointment status",
    patientId: "P-10234",
    appointmentId: "APT-20260901",
    previousValue: "Pending",
    newValue: "Rescheduled",
    reason: "Patient requested new date due to travel difficulty",
    ipAddress: "192.168.1.24"
  },
  {
    id: "AUD-903",
    timestamp: "2026-09-01 09:15 AM",
    user: "Dr. Ankit Mehta",
    role: "Doctor",
    action: "Viewed Patient Risk Explanation",
    patientId: "P-10234",
    appointmentId: "APT-20260901",
    previousValue: "N/A",
    newValue: "Risk 92% (VERY HIGH)",
    reason: "Pre-clinical review prior to consultation",
    ipAddress: "192.168.1.18"
  }
];

export const MOCK_USERS = [
  { id: "u1", name: "System Admin", username: "admin_sys", email: "admin@caretrack.health", role: "Admin", status: "Active", department: "IT & Admin" },
  { id: "u2", name: "Dr. Ankit Mehta", username: "dr_ankit", email: "ankit.m@caretrack.health", role: "Doctor", status: "Active", department: "Cardiology" },
  { id: "u3", name: "Dr. Sneha Reddy", username: "dr_sneha", email: "sneha.r@caretrack.health", role: "Doctor", status: "Active", department: "Dermatology" },
  { id: "u4", name: "Priya Sharma", username: "nurse_priya", email: "priya.s@caretrack.health", role: "Nurse", status: "Active", department: "Outpatient Services" },
  { id: "u5", name: "Ramesh Kumar", username: "patient_ramesh", email: "ramesh.k@example.com", role: "Patient", status: "Active", department: "Cardiology" }
];
