import React, { useState } from 'react';
import { MOCK_USERS } from '../services/mockDataService';
import audioService from '../services/audioService';

export default function UsersRolesPage() {
  const [usersList, setUsersList] = useState(MOCK_USERS);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    audioService.play2hReminder();
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleToggleStatus = (id) => {
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
    showToast('User status updated');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMsg && (
        <div style={{ background: '#0d9488', color: 'white', padding: '12px 20px', borderRadius: '10px', fontWeight: 600 }}>
          ✓ {toastMsg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>Users & Role Management</h2>
          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Role-based access control for Admins, Doctors, Nurses, and Patients</span>
        </div>

        <button className="btn-primary" onClick={() => showToast('New User Registration form ready!')}>
          + Register New User
        </button>
      </div>

      {/* Users Table */}
      <div className="full-width-card">
        <div className="table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>{u.name}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className="status-badge scheduled">{u.role}</span>
                  </td>
                  <td>{u.department}</td>
                  <td>
                    <span className={`status-badge ${u.status === 'Active' ? 'active' : 'inactive'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      onClick={() => handleToggleStatus(u.id)}
                    >
                      {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
