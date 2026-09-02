import React, { useState } from 'react';
import audioService from '../services/audioService';
import dataStore from '../services/dataStore';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('completion');
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    audioService.play2hReminder();
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleExportPdfReport = () => {
    const patients = dataStore.getPatients();
    const reportHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>CareTrack Analytical Operations PDF Report</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 40px; color: #0f172a; line-height: 1.5; }
          .header { border-bottom: 3px solid #059669; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; }
          .title { font-size: 24px; font-weight: bold; color: #059669; }
          .section-title { font-size: 16px; font-weight: bold; margin-top: 24px; margin-bottom: 12px; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th { background: #f1f5f9; padding: 10px; text-align: left; border-bottom: 2px solid #cbd5e1; font-size: 12px; }
          td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">CareTrack Operations & Analytics Report</div>
            <div>Active Report Type: ${reportType.toUpperCase()} breakdown</div>
          </div>
          <div style="text-align: right; font-size: 12px;">
            Generated: <strong>${new Date().toLocaleString()}</strong><br/>
            Region: <strong>Chennai, India</strong>
          </div>
        </div>

        <div class="section-title">Department Risk & Completion Summary</div>
        <table>
          <thead>
            <tr>
              <th>Specialist Department</th>
              <th>Follow-up Completion Rate</th>
              <th>High-Risk Caseload</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Cardiology</td><td>89.2%</td><td>42 Patients</td><td>High Priority</td></tr>
            <tr><td>Orthopedics</td><td>84.5%</td><td>38 Patients</td><td>Active</td></tr>
            <tr><td>Endocrinology</td><td>86.0%</td><td>29 Patients</td><td>Active</td></tr>
            <tr><td>Dermatology</td><td>94.1%</td><td>8 Patients</td><td>Optimal</td></tr>
            <tr><td>Neurology</td><td>88.0%</td><td>15 Patients</td><td>Active</td></tr>
          </tbody>
        </table>

        <div class="section-title">Patient Caseload Registry (Sample Extraction)</div>
        <table>
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Age / Phone</th>
              <th>Department</th>
              <th>Risk Score</th>
              <th>Next Follow-up</th>
            </tr>
          </thead>
          <tbody>
            ${patients.map(p => `
              <tr>
                <td><strong>${p.id}</strong></td>
                <td>${p.name}</td>
                <td>${p.age} yrs • ${p.phone}</td>
                <td>${p.department}</td>
                <td style="font-weight:bold; color:${p.risk?.riskScore >= 70 ? '#e11d48' : '#059669'}">${p.risk?.riskScore || 12}% (${p.risk?.riskLevel || 'LOW'})</td>
                <td>${p.nextFollowUpDate}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          CareTrack Health Analytical Report • Confidential Healthcare Data • Operational Support: +91 7598357132
        </div>
      </body>
      </html>
    `;

    const printWin = window.open('', '_blank', 'width=900,height=1000');
    if (printWin) {
      printWin.document.write(reportHtml);
      printWin.document.close();
      printWin.focus();
      setTimeout(() => {
        printWin.print();
      }, 500);
      showToast('PDF Operational Analytics Report Generated');
    }
  };

  const handleExportCsv = () => {
    const patients = dataStore.getPatients();
    let csvContent = 'data:text/csv;charset=utf-8,Patient ID,Name,Age,Phone,Department,Risk Score,Risk Level,Next FollowUp\n';
    patients.forEach(p => {
      csvContent += `${p.id},"${p.name}",${p.age},"${p.phone}","${p.department}",${p.risk?.riskScore || 12},"${p.risk?.riskLevel || 'LOW'}","${p.nextFollowUpDate}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CareTrack_Analytics_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('CSV Report Downloaded Successfully');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMsg && (
        <div style={{ background: '#059669', color: 'white', padding: '12px 20px', borderRadius: '30px', fontWeight: 600 }}>
          ✓ {toastMsg}
        </div>
      )}

      {/* Header Banner with Curated Healthcare Analytics Photography */}
      <div className="full-width-card" style={{
        position: 'relative',
        borderRadius: '20px',
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
          backgroundImage: 'linear-gradient(90deg, rgba(24,24,22,0.92) 0%, rgba(24,24,22,0.65) 100%), url(https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1
        }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              Operational Intelligence & Reporting
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0', color: 'white' }}>
              Operational Analytics & Reports
            </h1>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
              Hospital follow-up statistics, risk distribution, and staff intervention metrics
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" style={{ background: '#ffffff', color: '#181816' }} onClick={handleExportCsv}>
              Export CSV
            </button>
            <button className="btn-primary" onClick={handleExportPdfReport}>
              Export PDF Report
            </button>
          </div>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { id: 'completion', label: 'Follow-up Completion Report' },
          { id: 'missed', label: 'Missed Appointment Analytics' },
          { id: 'risk', label: 'Risk Distribution Breakdown' },
          { id: 'staff', label: 'Staff Intervention Report' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id)}
            className={`btn-secondary ${reportType === tab.id ? 'btn-primary' : ''}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Content Grid */}
      <div className="dashboard-grid">
        <div className="full-width-card">
          <div className="card-header-row">
            <div className="card-section-title">
              Department Risk & Attendance Breakdown
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            {[
              { dept: 'Cardiology', completion: '89.2%', highRiskCount: 42, color: 'var(--danger-color)' },
              { dept: 'Orthopedics', completion: '84.5%', highRiskCount: 38, color: 'var(--warning-color)' },
              { dept: 'Endocrinology', completion: '86.0%', highRiskCount: 29, color: 'var(--warning-color)' },
              { dept: 'Dermatology', completion: '94.1%', highRiskCount: 8, color: 'var(--primary-accent)' },
              { dept: 'Neurology', completion: '88.0%', highRiskCount: 15, color: 'var(--info-color)' }
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-subtle)', padding: '12px 16px', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{row.dept}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>High-Risk Patients: {row.highRiskCount}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>{row.completion}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary-accent)', fontWeight: 600 }}>Completion Rate</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="full-width-card">
          <div className="card-header-row">
            <div className="card-section-title">
              Staff Outreach Conversion Rates
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
            <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--info-color)', fontWeight: 700 }}>PHONE OUTREACH SUCCESS</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)' }}>78.4%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Patients reached who confirmed visit date</div>
            </div>

            <div style={{ background: 'var(--bg-highlight)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-focus)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary-accent)', fontWeight: 700 }}>RE-ENGAGEMENT AFTER MISSED VISIT</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)' }}>64.2%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rescheduled within 48 hours of alert</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
