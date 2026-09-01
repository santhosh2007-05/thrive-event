// CareTrack South Indian Hindu Dataset & Mock Data Service

export const MOCK_USERS = [
  {
    id: 'USR-101',
    name: 'Dr. Sundaramurthy Iyer',
    email: 'sundaramurthy.iyer@caretrack.health',
    role: 'Doctor',
    department: 'Cardiology',
    status: 'Active',
    lastLogin: '2026-09-01 08:30 AM'
  },
  {
    id: 'USR-102',
    name: 'Dr. Venkatesh Ramanathan',
    email: 'venkatesh.ramanathan@caretrack.health',
    role: 'Doctor',
    department: 'Orthopedics',
    status: 'Active',
    lastLogin: '2026-09-01 09:12 AM'
  },
  {
    id: 'USR-103',
    name: 'Dr. Subramanian Natarajan',
    email: 'subramanian.natarajan@caretrack.health',
    role: 'Doctor',
    department: 'Endocrinology',
    status: 'Active',
    lastLogin: '2026-08-31 04:45 PM'
  },
  {
    id: 'USR-104',
    name: 'Dr. Kausalya Krishnaswamy',
    email: 'kausalya.krishnaswamy@caretrack.health',
    role: 'Doctor',
    department: 'Dermatology',
    status: 'Active',
    lastLogin: '2026-09-01 08:50 AM'
  },
  {
    id: 'USR-105',
    name: 'Meenakshi Sundaram',
    email: 'meenakshi.sundaram@caretrack.health',
    role: 'Nurse',
    department: 'Cardiology',
    status: 'Active',
    lastLogin: '2026-09-01 07:50 AM'
  },
  {
    id: 'USR-106',
    name: 'Karpagam V',
    email: 'karpagam.v@caretrack.health',
    role: 'Nurse',
    department: 'Orthopedics',
    status: 'Active',
    lastLogin: '2026-09-01 08:15 AM'
  },
  {
    id: 'USR-107',
    name: 'Operational Staff',
    email: 'admin@caretrack.health',
    role: 'Admin',
    department: 'Hospital Administration',
    status: 'Active',
    lastLogin: '2026-09-01 09:30 AM'
  }
];

export const MOCK_PATIENTS = [
  {
    id: 'P-1001',
    name: 'Santhosh M',
    age: 25,
    gender: 'Male',
    phone: '+91 7598357132',
    address: 'Mylapore, Chennai, Tamil Nadu',
    distanceKm: 4.2,
    department: 'Cardiology',
    assignedDoctor: 'Dr. Sundaramurthy Iyer',
    assignedNurse: 'Meenakshi Sundaram',
    status: 'Upcoming',
    preferredComm: 'Phone',
    lastVisitDate: '2026-09-01',
    nextFollowUpDate: '2026-09-15',
    nextFollowUpTime: '10:30 AM',
    missedAppointmentsCount: 0,
    totalAppointments: 1,
    appointmentFrequencyDays: 30,
    treatmentDurationMonths: 1,
    history: [
      { id: 'H101', date: '2026-09-01', status: 'Completed', department: 'Cardiology', doctor: 'Dr. Sundaramurthy Iyer', notes: 'First patient intake and registration completed successfully.' }
    ]
  },
  {
    id: 'P-1002',
    name: 'Shriakash S',
    age: 68,
    gender: 'Male',
    phone: '+91 7598357132',
    address: 'Anna Nagar, Chennai, Tamil Nadu',
    distanceKm: 24.5,
    department: 'Cardiology',
    assignedDoctor: 'Dr. Sundaramurthy Iyer',
    assignedNurse: 'Meenakshi Sundaram',
    status: 'Upcoming',
    preferredComm: 'Phone',
    lastVisitDate: '2026-08-15',
    nextFollowUpDate: '2026-09-15',
    nextFollowUpTime: '10:30 AM',
    missedAppointmentsCount: 4,
    totalAppointments: 12,
    appointmentFrequencyDays: 14,
    treatmentDurationMonths: 8,
    history: [
      { id: 'H1', date: '2026-08-15', status: 'Completed', department: 'Cardiology', doctor: 'Dr. Sundaramurthy Iyer', notes: 'Blood pressure controlled. Advised ECG next visit.' },
      { id: 'H2', date: '2026-08-02', status: 'Missed', department: 'Cardiology', doctor: 'Dr. Sundaramurthy Iyer', notes: 'No show. Distance & transport cited.' },
      { id: 'H3', date: '2026-07-20', status: 'Completed', department: 'Cardiology', doctor: 'Dr. Sundaramurthy Iyer', notes: 'Medication adjusted.' },
      { id: 'H4', date: '2026-07-05', status: 'Rescheduled', department: 'Cardiology', doctor: 'Dr. Sundaramurthy Iyer', notes: 'Rescheduled on patient request.' }
    ]
  },
  {
    id: 'P-1003',
    name: 'Prajan Soorya',
    age: 54,
    gender: 'Male',
    phone: '+91 98765 43211',
    address: 'T. Nagar, Chennai, Tamil Nadu',
    distanceKm: 14.2,
    department: 'Orthopedics',
    assignedDoctor: 'Dr. Venkatesh Ramanathan',
    assignedNurse: 'Karpagam V',
    status: 'Confirmed',
    preferredComm: 'SMS',
    lastVisitDate: '2026-08-10',
    nextFollowUpDate: '2026-09-10',
    nextFollowUpTime: '11:15 AM',
    missedAppointmentsCount: 2,
    totalAppointments: 10,
    appointmentFrequencyDays: 30,
    treatmentDurationMonths: 6,
    history: [
      { id: 'H5', date: '2026-08-10', status: 'Completed', department: 'Orthopedics', doctor: 'Dr. Venkatesh Ramanathan', notes: 'Post-op knee assessment good.' },
      { id: 'H6', date: '2026-07-12', status: 'Completed', department: 'Orthopedics', doctor: 'Dr. Venkatesh Ramanathan', notes: 'X-ray review clean.' }
    ]
  },
  {
    id: 'P-1004',
    name: 'Rahul R',
    age: 46,
    gender: 'Male',
    phone: '+91 98765 43212',
    address: 'Adyar, Chennai, Tamil Nadu',
    distanceKm: 8.0,
    department: 'Endocrinology',
    assignedDoctor: 'Dr. Subramanian Natarajan',
    assignedNurse: 'Devi Mahalakshmi',
    status: 'Confirmed',
    preferredComm: 'WhatsApp',
    lastVisitDate: '2026-08-18',
    nextFollowUpDate: '2026-09-18',
    nextFollowUpTime: '09:45 AM',
    missedAppointmentsCount: 1,
    totalAppointments: 14,
    appointmentFrequencyDays: 30,
    treatmentDurationMonths: 12,
    history: [
      { id: 'H7', date: '2026-08-18', status: 'Completed', department: 'Endocrinology', doctor: 'Dr. Subramanian Natarajan', notes: 'HbA1c level 6.8%. Stable.' }
    ]
  },
  {
    id: 'P-1005',
    name: 'Pranesh T',
    age: 32,
    gender: 'Male',
    phone: '+91 98765 43213',
    address: 'Velachery, Chennai, Tamil Nadu',
    distanceKm: 5.5,
    department: 'Dermatology',
    assignedDoctor: 'Dr. Kausalya Krishnaswamy',
    assignedNurse: 'Meenakshi Sundaram',
    status: 'Upcoming',
    preferredComm: 'SMS',
    lastVisitDate: '2026-08-22',
    nextFollowUpDate: '2026-09-22',
    nextFollowUpTime: '02:00 PM',
    missedAppointmentsCount: 0,
    totalAppointments: 8,
    appointmentFrequencyDays: 60,
    treatmentDurationMonths: 4,
    history: [
      { id: 'H8', date: '2026-08-22', status: 'Completed', department: 'Dermatology', doctor: 'Dr. Kausalya Krishnaswamy', notes: 'Skin allergy rash resolved.' }
    ]
  },
  {
    id: 'P-1006',
    name: 'Karthik Sundaram',
    age: 41,
    gender: 'Male',
    phone: '+91 98765 43214',
    address: 'Tambaram, Chennai, Tamil Nadu',
    distanceKm: 18.0,
    department: 'Cardiology',
    assignedDoctor: 'Dr. Sundaramurthy Iyer',
    assignedNurse: 'Soundarya R',
    status: 'Confirmed',
    preferredComm: 'Phone',
    lastVisitDate: '2026-08-20',
    nextFollowUpDate: '2026-09-20',
    nextFollowUpTime: '11:00 AM',
    missedAppointmentsCount: 1,
    totalAppointments: 9,
    appointmentFrequencyDays: 30,
    treatmentDurationMonths: 7,
    history: [
      { id: 'H9', date: '2026-08-20', status: 'Completed', department: 'Cardiology', doctor: 'Dr. Sundaramurthy Iyer', notes: 'ECG regular. BP stable.' }
    ]
  }
];

export const PATIENTS_WITH_RISK = MOCK_PATIENTS.map(p => ({
  ...p,
  risk: {
    riskScore: p.id === 'P-1002' ? 87 : p.id === 'P-1003' ? 56 : p.id === 'P-1004' ? 42 : 12,
    riskLevel: p.id === 'P-1002' ? 'HIGH' : p.id === 'P-1003' ? 'MEDIUM' : 'LOW',
    modelVersion: 'scikit-learn RandomForest ML v2.1',
    explanation: p.id === 'P-1002'
      ? 'High risk of no-show due to 4 past missed appointments, 24.5 km distance, and age factor.'
      : 'Low risk. Regular attendance history.',
    primaryContributors: ['Missed appointments history', 'Hospital distance gap'],
    factorsSorted: [
      { key: 'missed', label: 'Missed Appointments History', raw: `${p.missedAppointmentsCount} visits`, points: p.missedAppointmentsCount * 18, maxPoints: 30 },
      { key: 'distance', label: 'Hospital Distance', raw: `${p.distanceKm} km`, points: Math.round(p.distanceKm * 1.2), maxPoints: 25 },
      { key: 'age', label: 'Patient Age', raw: `${p.age} yrs`, points: 10, maxPoints: 15 }
    ]
  }
}));

export const MOCK_APPOINTMENTS = MOCK_PATIENTS.map(p => ({
  id: `APT-${p.id}`,
  patientId: p.id,
  patientName: p.name,
  patientAge: p.age,
  doctor: p.assignedDoctor,
  department: p.department,
  date: p.nextFollowUpDate,
  time: p.nextFollowUpTime,
  status: p.status,
  confirmationStatus: p.status === 'Confirmed' ? 'Confirmed' : 'Pending',
  riskScore: p.id === 'P-1002' ? 87 : p.id === 'P-1003' ? 56 : 12,
  riskLevel: p.id === 'P-1002' ? 'HIGH' : p.id === 'P-1003' ? 'MEDIUM' : 'LOW'
}));

export const MOCK_NOTIFICATIONS = [
  {
    id: 'NOTIF-1',
    patientId: 'P-1002',
    patientName: 'Shriakash S',
    title: 'High Risk Alert: Follow-up Visit Due',
    message: 'Shriakash S (P-1002) has an 87% predicted risk of no-show for Cardiology visit on 15 Sep 2026.',
    severity: 'danger',
    category: 'High Risk',
    timestamp: '10 mins ago',
    isRead: false,
    actionRequired: 'Call Patient'
  },
  {
    id: 'NOTIF-2',
    patientId: 'P-1001',
    patientName: 'Santhosh M',
    title: 'Patient Intake Visit Scheduled',
    message: 'Santhosh M (P-1001) has a Cardiology follow-up visit scheduled for 15 Sep 2026 at 10:30 AM.',
    severity: 'warning',
    category: 'Upcoming',
    timestamp: '25 mins ago',
    isRead: false,
    actionRequired: 'View Details'
  }
];

export const MOCK_AUDIT_LOGS = [
  {
    id: 'AUD-901',
    timestamp: '2026-09-01 09:15 AM',
    user: 'System Administrator',
    role: 'Admin',
    action: 'Registered Patient Intake',
    patientId: 'P-1001',
    appointmentId: 'APT-P-1001',
    previousValue: 'Unregistered',
    newValue: 'Registered (Santhosh M)',
    reason: 'First time patient registration',
    ipAddress: '192.168.1.10'
  }
];
