import React, { useState } from 'react';

export default function WhatIfSimulator({ initialPatient = null }) {
  const [baseRisk, setBaseRisk] = useState(initialPatient ? initialPatient.riskScore || 84 : 84);
  const [proposedTime, setProposedTime] = useState('MON_8AM');
  const [proposedIntervention, setProposedIntervention] = useState('NONE');
  const [coldStartMode, setColdStartMode] = useState(false);

  // Model-Based What-If Simulation Math
  let simulatedRisk = baseRisk;

  // Time-of-day adjustment
  if (proposedTime === 'MON_5PM') simulatedRisk -= 15;
  else if (proposedTime === 'WED_10AM') simulatedRisk -= 8;
  else if (proposedTime === 'SAT_11AM') simulatedRisk -= 12;

  // Intervention adjustment
  if (proposedIntervention === 'SMS') simulatedRisk -= 8;
  else if (proposedIntervention === 'VOICE') simulatedRisk -= 23;
  else if (proposedIntervention === 'TRANSPORT') simulatedRisk -= 36;
  else if (proposedIntervention === 'WHATSAPP') simulatedRisk -= 12;

  simulatedRisk = Math.max(10, Math.min(99, Math.round(simulatedRisk)));

  return (
    <div className="full-width-card" style={{
      background: 'var(--bg-surface)',
      borderRadius: '20px',
      border: '1px solid var(--border-color)',
      padding: '24px',
      boxShadow: 'var(--shadow-soft)'
    }}>
      {/* Title Bar */}
      <div className="card-header-row" style={{ marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--primary-accent)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>
            CLINICAL DECISION SUPPORT TOOL
          </div>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Interactive "What-If" Counterfactual Risk Simulator
          </h3>
        </div>
        <div style={{ fontSize: '0.75rem', background: 'var(--bg-highlight)', color: 'var(--primary-accent)', padding: '4px 12px', borderRadius: '20px', fontWeight: 700 }}>
          Model-Based Simulation
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 20px 0', lineHeight: '1.5' }}>
        Experiment with baseline risk scores, proposed appointment time shifts, and intervention modes to observe simulated reduction in patient no-show risk probability.
      </p>

      {/* Simulator Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {/* Control 0: Baseline Risk Slider */}
        <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
            <span>Baseline Patient Risk:</span>
            <span style={{ color: 'var(--danger-color)' }}>{baseRisk}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="99"
            value={baseRisk}
            onChange={(e) => setBaseRisk(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--danger-color)', cursor: 'pointer' }}
          />
        </div>

        {/* Control 1: Appointment Time Proposed Shift */}
        <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-main)' }}>
            Proposed Visit Slot:
          </label>
          <select
            className="form-control"
            value={proposedTime}
            onChange={(e) => setProposedTime(e.target.value)}
          >
            <option value="MON_8AM">Monday 8:00 AM (Current Base)</option>
            <option value="MON_5PM">Monday 5:00 PM (-15% Risk)</option>
            <option value="WED_10AM">Wednesday 10:00 AM (-8% Risk)</option>
            <option value="SAT_11AM">Saturday 11:00 AM (-12% Risk)</option>
          </select>
        </div>

        {/* Control 2: Proposed Intervention Strategy */}
        <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-main)' }}>
            Proposed Intervention Strategy:
          </label>
          <select
            className="form-control"
            value={proposedIntervention}
            onChange={(e) => setProposedIntervention(e.target.value)}
          >
            <option value="NONE">No Intervention (Current)</option>
            <option value="SMS">SMS Text Reminder (-8%)</option>
            <option value="WHATSAPP">WhatsApp Automated Message (-12%)</option>
            <option value="VOICE">Staff Voice Phone Call (-23%)</option>
            <option value="TRANSPORT">Hospital Transport Shuttle (-36%)</option>
          </select>
        </div>

        {/* Control 3: Cold Start Toggle */}
        <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
            <input
              type="checkbox"
              checked={coldStartMode}
              onChange={(e) => setColdStartMode(e.target.checked)}
              style={{ accentColor: 'var(--primary-accent)', width: '16px', height: '16px' }}
            />
            Cold-Start Mode (First-Time Patient)
          </label>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Flags low prediction confidence due to 0 historical visits.
          </span>
        </div>
      </div>

      {/* Simulation Result Comparison Card */}
      <div style={{
        background: 'var(--bg-subtle)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        {/* Baseline Risk */}
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>BASELINE NO-SHOW RISK</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: baseRisk >= 70 ? 'var(--danger-color)' : 'var(--warning-color)' }}>
            {baseRisk}%
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Monday 8:00 AM • No Intervention</span>
        </div>

        {/* Transition Arrow */}
        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary-accent)' }}>
          &rarr;
        </div>

        {/* Simulated Risk */}
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--primary-accent)', fontWeight: 800 }}>SIMULATED PROPOSED RISK</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: simulatedRisk < 50 ? 'var(--primary-accent)' : 'var(--warning-color)' }}>
            {simulatedRisk}%
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--primary-accent)', fontWeight: 700 }}>
            Risk Reduction: -{baseRisk - simulatedRisk}%
          </span>
        </div>

        {/* Confidence & Completeness Gauges */}
        <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '20px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
            Model Confidence: <strong style={{ color: coldStartMode ? 'var(--danger-color)' : 'var(--primary-accent)' }}>{coldStartMode ? 'LOW (35%)' : 'HIGH (82%)'}</strong>
          </div>
          <div style={{ background: 'var(--border-color)', width: '140px', height: '6px', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{ width: coldStartMode ? '35%' : '82%', background: coldStartMode ? 'var(--danger-color)' : 'var(--primary-accent)', height: '100%' }} />
          </div>

          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
            Data Completeness: <strong>{coldStartMode ? '45%' : '91%'}</strong>
          </div>
          <div style={{ background: 'var(--border-color)', width: '140px', height: '6px', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: coldStartMode ? '45%' : '91%', background: 'var(--info-color)', height: '100%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
