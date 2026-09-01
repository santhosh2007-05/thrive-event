import React, { useState, useEffect } from 'react';
import dataStore from '../services/dataStore';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState(dataStore.getAuditLogs());

  useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => {
      setLogs(dataStore.getAuditLogs());
    });
    return () => unsubscribe();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>System Audit Logs & Traceability</h2>
          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Immutable real-time ledger of patient confirmations, staff actions, and status updates</span>
        </div>

        <span className="status-badge confirmed">Live Real-time Ledger</span>
      </div>

      {/* Audit Log Table */}
      <div className="full-width-card">
        <div className="table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Timestamp</th>
                <th>User / Actor</th>
                <th>Role</th>
                <th>Action Performed</th>
                <th>Patient ID</th>
                <th>Previous &rarr; New Value</th>
                <th>Reason / Notes</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontWeight: 700 }}>{log.id}</td>
                  <td style={{ fontSize: '0.8rem', color: '#475569' }}>{log.timestamp}</td>
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>{log.user}</td>
                  <td>
                    <span className="status-badge scheduled">{log.role}</span>
                  </td>
                  <td style={{ fontWeight: 700 }}>{log.action}</td>
                  <td>{log.patientId}</td>
                  <td style={{ fontSize: '0.8rem', color: '#334155' }}>
                    <span style={{ color: '#dc2626' }}>{log.previousValue}</span> &rarr; <span style={{ color: '#16a34a', fontWeight: 700 }}>{log.newValue}</span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#475569' }}>{log.reason}</td>
                  <td style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
