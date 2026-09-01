// CareTrack Risk Prediction & Explainability Engine v1.0
// Transparent Rule-based scoring with weighted factors.

export const DEFAULT_RISK_WEIGHTS = {
  missedAppointments: 30, // 30%
  distance: 25,           // 25%
  frequency: 20,          // 20%
  treatmentDuration: 15,  // 15%
  age: 10                 // 10%
};

export const MODEL_VERSION = "RuleEngine v1.0";
export const LAST_UPDATED = "2026-09-01";

/**
 * Calculates follow-up risk score and produces transparent factor breakdowns.
 * @param {Object} patientInput 
 * @param {number} patientInput.missedCount - Number of missed appointments
 * @param {number} patientInput.distanceKm - Distance from hospital in kilometers
 * @param {number} patientInput.frequencyDays - Frequency between appointments in days
 * @param {number} patientInput.durationMonths - Total treatment duration in months
 * @param {number} patientInput.age - Patient age in years
 * @param {Object} weightsConfig - Optional custom weights config
 */
export function calculateRiskScore(patientInput, weightsConfig = DEFAULT_RISK_WEIGHTS) {
  const {
    missedCount = 0,
    distanceKm = 5,
    frequencyDays = 30,
    durationMonths = 6,
    age = 45
  } = patientInput;

  // Normalized Factor Calculations (0 to 1 scale for each factor)
  
  // 1. Missed Appointments score (0 missed = 0, 1 = 0.4, 2 = 0.7, 3+ = 1.0)
  let missedScore = 0;
  if (missedCount === 1) missedScore = 0.4;
  else if (missedCount === 2) missedScore = 0.75;
  else if (missedCount >= 3) missedScore = 1.0;

  // 2. Distance score (0-5km = 0.1, 5-15km = 0.4, 15-30km = 0.75, 30+km = 1.0)
  let distanceScore = 0.1;
  if (distanceKm > 30) distanceScore = 1.0;
  else if (distanceKm > 15) distanceScore = 0.75;
  else if (distanceKm > 5) distanceScore = 0.4;

  // 3. Frequency score (Long gaps = higher risk of forgetting/losing routine)
  // <= 14 days = 0.15, 15-30 days = 0.4, 31-60 days = 0.75, 60+ days = 1.0
  let frequencyScore = 0.15;
  if (frequencyDays > 60) frequencyScore = 1.0;
  else if (frequencyDays > 30) frequencyScore = 0.75;
  else if (frequencyDays > 14) frequencyScore = 0.4;

  // 4. Treatment Duration score (Long chronic treatments have fatigue factor)
  // < 3 months = 0.2, 3-6 months = 0.4, 6-12 months = 0.7, 12+ months = 0.95
  let durationScore = 0.2;
  if (durationMonths > 12) durationScore = 0.95;
  else if (durationMonths > 6) durationScore = 0.7;
  else if (durationMonths >= 3) durationScore = 0.4;

  // 5. Age score (Elderly 65+ or very young < 18 have higher mobility/dependency risks)
  let ageScore = 0.2;
  if (age >= 75) ageScore = 0.9;
  else if (age >= 65) ageScore = 0.75;
  else if (age < 18) ageScore = 0.6;
  else if (age >= 50) ageScore = 0.4;

  // Calculate Weighted Contributions (Points out of 100)
  const missedPts = Math.round(missedScore * weightsConfig.missedAppointments);
  const distancePts = Math.round(distanceScore * weightsConfig.distance);
  const frequencyPts = Math.round(frequencyScore * weightsConfig.frequency);
  const durationPts = Math.round(durationScore * weightsConfig.treatmentDuration);
  const agePts = Math.round(ageScore * weightsConfig.age);

  const rawTotal = missedPts + distancePts + frequencyPts + durationPts + agePts;
  const riskScore = Math.min(99, Math.max(5, rawTotal));

  // Determine Risk Level & Badge Color
  let riskLevel = 'LOW';
  let riskColor = 'blue';
  if (riskScore >= 85) {
    riskLevel = 'VERY HIGH';
    riskColor = 'red';
  } else if (riskScore >= 70) {
    riskLevel = 'HIGH';
    riskColor = 'orange';
  } else if (riskScore >= 45) {
    riskLevel = 'MEDIUM';
    riskColor = 'amber';
  } else if (riskScore >= 25) {
    riskLevel = 'LOW';
    riskColor = 'blue';
  } else {
    riskLevel = 'VERY LOW';
    riskColor = 'green';
  }

  // Factor list ordered by impact
  const factors = [
    { key: 'missedAppointments', label: 'Previous missed appointments', points: missedPts, maxPoints: weightsConfig.missedAppointments, raw: `${missedCount} missed` },
    { key: 'distance', label: 'Distance from hospital', points: distancePts, maxPoints: weightsConfig.distance, raw: `${distanceKm} km` },
    { key: 'frequency', label: 'Irregular / infrequent schedule', points: frequencyPts, maxPoints: weightsConfig.frequency, raw: `Every ${frequencyDays} days` },
    { key: 'treatmentDuration', label: 'Long treatment duration', points: durationPts, maxPoints: weightsConfig.treatmentDuration, raw: `${durationMonths} months` },
    { key: 'age', label: 'Age factor', points: agePts, maxPoints: weightsConfig.age, raw: `${age} years` }
  ].sort((a, b) => b.points - a.points);

  const primaryContributors = factors.slice(0, 3).map(f => f.label);

  // Generate plain, transparent text explanation strictly based on top factors
  const topFactorObj = factors[0];
  const secondFactorObj = factors[1];
  
  let explanation = `The patient has a predicted follow-up risk score of ${riskScore}% (${riskLevel}) primarily because of ${topFactorObj.label.toLowerCase()} (${topFactorObj.raw}) and ${secondFactorObj.label.toLowerCase()} (${secondFactorObj.raw}). These input factors contributed most significantly to the calculation.`;

  return {
    riskScore,
    riskLevel,
    riskColor,
    modelVersion: MODEL_VERSION,
    calculatedAt: new Date().toISOString(),
    inputs: {
      missedCount,
      distanceKm,
      frequencyDays,
      durationMonths,
      age
    },
    factorBreakdown: {
      missedPts,
      distancePts,
      frequencyPts,
      durationPts,
      agePts
    },
    factorsSorted: factors,
    primaryContributors,
    explanation
  };
}
