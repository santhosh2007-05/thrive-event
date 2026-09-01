import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATIENTS_WITH_RISK } from '../services/mockDataService';
import audioService from '../services/audioService';

export default function DoctorDashboardPage() {
  const navigate = useNavigate();
  const [selectedPatientId, setSelectedPatientId] = useState('P-10234');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Doctor's assigned patients with rich 360-degree clinical disease details and medical photography
  const doctorPatients = PATIENTS_WITH_RISK.map(p => {
    let diseaseDetails = {};
    if (p.id === 'P-10234') {
      diseaseDetails = {
        primaryDiagnosis: 'Hypertension Stage 2 & Coronary Artery Disease',
        icdCode: 'I10 / I25.10',
        severity: 'High',
        keyLabMetrics: 'BP: 148/92 mmHg | HbA1c: 6.8% | LVEF: 52%',
        activeMedications: 'Amlodipine 10mg, Atorvastatin 20mg, Aspirin 75mg',
        treatmentPhase: 'Post-PCI Maintenance (Month 8)',
        clinicalAlerts: 'Slight BP elevation observed in last visit. Distance to clinic (24km) impacting follow-up frequency.',
        photo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80'
      };
    } else if (p.id === 'P-10235') {
      diseaseDetails = {
        primaryDiagnosis: 'Severe Atopic Dermatitis & Contact Eczema',
        icdCode: 'L20.9',
        severity: 'Moderate',
        keyLabMetrics: 'IgE Level: 450 IU/mL | Skin Patch Test: Positive for Nickel',
        activeMedications: 'Topical Tacrolimus 0.1%, Cetirizine 10mg',
        treatmentPhase: 'Acute Flare Resolution (Month 2)',
        clinicalAlerts: 'Healing well. Patient requested digital prescription renewals via WhatsApp.',
        photo: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80'
      };
    } else if (p.id === 'P-10236') {
      diseaseDetails = {
        primaryDiagnosis: 'Osteoarthritis Right Knee & Osteoporosis',
        icdCode: 'M17.11 / M81.0',
        severity: 'High',
        keyLabMetrics: 'BMD T-Score: -2.8 (Femoral Neck) | ESR: 28 mm/hr',
        activeMedications: 'Denosumab 60mg Q6M, Calcium + Vitamin D3, Tramadol PRN',
        treatmentPhase: 'Post-Knee Surgery Follow-up (Month 14)',
        clinicalAlerts: 'Mobility restriction. Missed last visit due to transport barriers.',
        photo: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80'
      };
    } else if (p.id === 'P-10237') {
      diseaseDetails = {
        primaryDiagnosis: 'Type 2 Diabetes Mellitus with Peripheral Neuropathy',
        icdCode: 'E11.40',
        severity: 'High',
        keyLabMetrics: 'HbA1c: 8.6% (Uncontrolled) | Fasting Glucose: 178 mg/dL',
        activeMedications: 'Metformin 1000mg BID, Empagliflozin 10mg, Pregabalin 75mg',
        treatmentPhase: 'Glycemic Intensification (Month 6)',
        clinicalAlerts: 'Suboptimal glycemic control. Requires strict monthly follow-up review.',
        photo: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80'
      };
    } else {
      diseaseDetails = {
        primaryDiagnosis: 'Refractory Migraine with Aura',
        icdCode: 'G43.109',
        severity: 'Moderate',
        keyLabMetrics: 'Brain MRI: Normal | MIDAS Disability Score: 18 (Severe)',
        activeMedications: 'Topiramate 50mg BID, Rizatriptan 10mg PRN',
        treatmentPhase: 'Prophylaxis Optimization (Month 4)',
        clinicalAlerts: 'Episode frequency reduced from 8 to 2 per month.',
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80'
      };
    }

    return {
      ...p,
      disease: diseaseDetails
    };
  });

  const filteredPatients = doctorPatients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedPatient = doctorPatients.find(p => p.id === selectedPatientId) || doctorPatients[0];

  const showToast = (msg) => {
    setToastMsg(msg);
    audioService.play2hReminder();
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMsg && (
        <div style={{ background: '#0d9488', color: 'white', padding: '12px 20px', borderRadius: '10px', fontWeight: 600 }}>
          ✓ {toastMsg}
        </div>
      )}

      {/* Hero Header Banner with Curated Healthcare Photography */}
      <div className="full-width-card" style={{
        position: 'relative',
        borderRadius: '16px',
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
          backgroundImage: 'linear-gradient(90deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.6) 100%), url(https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1
        }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              Doctor Clinical Portal
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0', color: 'white' }}>
              360° Clinical Disease & Patient Overview
            </h1>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
              Attending Physician: <strong>Dr. Ankit Mehta</strong> • Department: Cardiology & Clinical Care
            </div>
          </div>

          <button className="btn-primary" style={{ background: '#0d9488' }} onClick={() => showToast('New Clinical Consultation note added')}>
            + New Clinical Note
          </button>
        </div>
      </div>

      {/* Main Clinical Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Left Column: Assigned Patients List */}
        <div className="full-width-card" style={{ padding: '20px' }}>
          <div className="card-header-row" style={{ marginBottom: '14px' }}>
            <div className="card-section-title">
              Assigned Patients ({filteredPatients.length})
            </div>
          </div>

          {/* Search Box */}
          <div className="search-input-wrap" style={{ marginBottom: '14px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Filter patients by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Patient Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '560px', overflowY: 'auto' }}>
            {filteredPatients.map(p => (
              <div
                key={p.id}
                onClick={() => setSelectedPatientId(p.id)}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: p.id === selectedPatient.id ? '2px solid #0d9488' : '1px solid #e2e8f0',
                  background: p.id === selectedPatient.id ? '#f0fdf4' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center'
                }}
              >
                <img
                  src={p.disease.photo}
                  alt={p.name}
                  style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{p.name}</span>
                    <span className={`status-badge ${p.risk.riskScore >= 70 ? 'inactive' : 'active'}`} style={{ fontSize: '0.7rem' }}>
                      {p.risk.riskScore}%
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    ID: {p.id} • Age {p.age} • {p.department}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#0f172a', fontWeight: 600, marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.disease.primaryDiagnosis}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: 360-Degree Clinical Disease Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Patient Profile & Clinical Diagnosis Header */}
          <div className="full-width-card" style={{ borderTop: '5px solid #0d9488' }}>
            <div className="card-header-row">
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <img
                  src={selectedPatient.disease.photo}
                  alt={selectedPatient.name}
                  style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }}
                />
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    360° Clinical File Record
                  </span>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '2px 0', color: '#0f172a' }}>
                    {selectedPatient.name} (ID: {selectedPatient.id})
                  </h2>
                  <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                    Age: {selectedPatient.age} yrs • Gender: {selectedPatient.gender} • Contact: {selectedPatient.phone}
                  </div>
                </div>
              </div>

              <button
                className="btn-primary"
                onClick={() => navigate(`/patients/${selectedPatient.id}`)}
              >
                Full Profile Record →
              </button>
            </div>

            {/* Disease Details Card */}
            <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', marginTop: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0d9488', textTransform: 'uppercase' }}>
                  PRIMARY DIAGNOSIS & ICD CLASSIFICATION
                </span>
                <span className={`status-badge ${selectedPatient.disease.severity === 'High' ? 'inactive' : 'reschedule_requested'}`}>
                  {selectedPatient.disease.severity} Clinical Severity
                </span>
              </div>

              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                {selectedPatient.disease.primaryDiagnosis}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '12px' }}>
                ICD-10 Code: <strong>{selectedPatient.disease.icdCode}</strong> • Treatment Phase: <strong>{selectedPatient.disease.treatmentPhase}</strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Key Lab Metrics & Biomarkers</span>
                  <strong style={{ fontSize: '0.875rem', color: '#0f172a' }}>{selectedPatient.disease.keyLabMetrics}</strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Active Prescribed Medications</span>
                  <strong style={{ fontSize: '0.875rem', color: '#0f172a' }}>{selectedPatient.disease.activeMedications}</strong>
                </div>
              </div>

              <div style={{ marginTop: '12px', background: '#fff5f5', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fecdd3', color: '#991b1b', fontSize: '0.85rem' }}>
                <strong>Doctor Note / Alert:</strong> {selectedPatient.disease.clinicalAlerts}
              </div>
            </div>
          </div>

          {/* Follow-up Attendance Risk & Contributing Factors */}
          <div className="dashboard-grid">
            {/* Risk Card */}
            <div className="full-width-card" style={{ borderLeft: `5px solid ${selectedPatient.risk.riskScore >= 70 ? '#dc2626' : '#16a34a'}` }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>
                Follow-up Miss Probability
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: selectedPatient.risk.riskScore >= 70 ? '#dc2626' : '#16a34a', margin: '4px 0' }}>
                {selectedPatient.risk.riskScore}%
              </div>
              <span className={`status-badge ${selectedPatient.risk.riskScore >= 70 ? 'inactive' : 'active'}`}>
                {selectedPatient.risk.riskLevel} RISK
              </span>
              <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '8px', lineHeight: '1.4' }}>
                "{selectedPatient.risk.explanation}"
              </p>
            </div>

            {/* Attendance History Timeline */}
            <div className="full-width-card">
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                Recent Visit History
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedPatient.history.map(h => (
                  <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem' }}>
                    <div>
                      <strong>{h.date}</strong> — {h.department}
                    </div>
                    <span className={`status-badge ${h.status === 'Completed' ? 'confirmed' : 'cancelled'}`}>
                      {h.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
