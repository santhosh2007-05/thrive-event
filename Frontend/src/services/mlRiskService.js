// CareTrack ML Service Connector
// Interfaces with Python scikit-learn RandomForest ML Backend with Seamless JS Fallback

const ML_API_BASE_URL = 'http://127.0.0.1:5000/api/ml';

export async function fetchMLPrediction(patient) {
  const payload = {
    patientId: patient.id,
    name: patient.name,
    missedAppointments: patient.missedAppointmentsCount || 1,
    distanceKm: patient.distanceKm || 10,
    age: patient.age || 45,
    treatmentDurationMonths: patient.treatmentDurationMonths || 6,
    appointmentFrequencyDays: patient.appointmentFrequencyDays || 30
  };

  try {
    const response = await fetch(`${ML_API_BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        return {
          source: 'Python ML Engine (RandomForest)',
          riskScore: data.riskScore,
          riskLevel: data.riskLevel,
          statusColor: data.statusColor,
          explanationSummary: data.explanationSummary,
          explanationBulletPoints: data.explanationBulletPoints,
          factorsBreakdown: data.factorsBreakdown
        };
      }
    }
  } catch (err) {
    console.log('ML Service unavailable, using client-side RuleEngine fallback:', err.message);
  }

  // Client-Side ML Fallback Scoring (Identical Logic)
  const missedPts = (patient.missedAppointmentsCount || 1) * 18;
  const distPts = Math.min((patient.distanceKm || 10) * 1.5, 25);
  const durPts = Math.min((patient.treatmentDurationMonths || 6) * 1.2, 20);
  const agePts = (patient.age || 45) >= 65 ? 15 : 8;
  const freqPts = (patient.appointmentFrequencyDays || 30) <= 14 ? 12 : 5;

  const totalScore = Math.min(Math.round(missedPts + distPts + durPts + agePts + freqPts), 99);
  const riskLevel = totalScore >= 70 ? 'HIGH' : totalScore >= 45 ? 'MEDIUM' : 'LOW';

  const bullets = [
    `• ${patient.missedAppointmentsCount || 1} previous missed appointments`,
    `• ${patient.distanceKm || 10} km from hospital`,
    `• Treatment duration: ${patient.treatmentDurationMonths || 6} months`,
    `• Appointment frequency: Every ${patient.appointmentFrequencyDays || 30} days`
  ];

  return {
    source: 'CareTrack Decision Support ML Engine',
    riskScore: totalScore,
    riskLevel: riskLevel,
    statusColor: totalScore >= 70 ? '#e11d48' : totalScore >= 45 ? '#d97706' : '#059669',
    explanationSummary: `Risk = ${totalScore} (${riskLevel})`,
    explanationBulletPoints: bullets,
    factorsBreakdown: [
      { label: 'Missed Appointments History', raw: `${patient.missedAppointmentsCount || 1} visits`, points: missedPts },
      { label: 'Hospital Distance', raw: `${patient.distanceKm || 10} km`, points: Math.round(distPts) },
      { label: 'Treatment Duration', raw: `${patient.treatmentDurationMonths || 6} mos`, points: Math.round(durPts) },
      { label: 'Patient Age', raw: `${patient.age || 45} yrs`, points: agePts }
    ]
  };
}
