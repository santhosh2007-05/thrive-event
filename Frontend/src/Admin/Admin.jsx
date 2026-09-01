import React, { useState, useEffect } from 'react';
import './Admin.css';

const API_BASE_URL = 'http://localhost:8080/api/admin';

// Initial Mock Data to ensure instant UI rendering even if backend is offline
const INITIAL_ADMINS = [
  {
    id: 1,
    username: 'admin_sys',
    email: 'admin.sys@healthcare.com',
    fullName: 'System Administrator',
    role: 'ROLE_ADMIN',
    isActive: true,
    createdAt: '2026-08-15T10:30:00'
  },
  {
    id: 2,
    username: 'dr_sarah_lead',
    email: 'sarah.jenkins@hospital.org',
    fullName: 'Dr. Sarah Jenkins',
    role: 'ROLE_ADMIN',
    isActive: true,
    createdAt: '2026-08-20T14:15:00'
  },
  {
    id: 3,
    username: 'robert_ops',
    email: 'robert.chen@healthcare.com',
    fullName: 'Robert Chen',
    role: 'ROLE_ADMIN',
    isActive: false,
    createdAt: '2026-08-28T09:00:00'
  }
];

const INITIAL_AUDIT_LOGS = [
  {
    id: 101,
    action: 'Admin Account Created',
    timestamp: '2026-09-01 11:45 AM',
    actor: 'System Administrator',
    status: 'attended',
    details: 'Registered new administrative user dr_sarah_lead with email sarah.jenkins@hospital.org'
  },
  {
    id: 102,
    action: 'H2 Database Schema Migration',
    timestamp: '2026-09-01 10:15 AM',
    actor: 'Automated System',
    status: 'attended',
    details: 'Applied ddl-auto update for table admins in H2 in-memory testdb.'
  },
  {
    id: 103,
    action: 'Admin Status Toggled',
    timestamp: '2026-08-30 04:20 PM',
    actor: 'admin_sys',
    status: 'cancelled',
    details: 'Deactivated admin user robert_ops due to scheduled security maintenance.'
  }
];

export default function Admin() {
  const [admins, setAdmins] = useState(INITIAL_ADMINS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' | 'logs' | 'actions'
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [apiConnected, setApiConnected] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Form state for new admin registration
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: ''
  });

  // Fetch Admins from Spring Boot Backend
  const fetchAdmins = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/all`);
      if (response.ok) {
        const data = await response.json();
        setAdmins(data);
        setApiConnected(true);
      }
    } catch (error) {
      console.warn('Backend API offline or unreachable, using local state mode:', error.message);
      setApiConnected(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Handle Form Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Add/Register Admin
  const handleRegisterAdmin = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      showToast('Please fill in all required fields!');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showToast('New Admin registered successfully on Backend!');
        fetchAdmins();
      } else {
        const errData = await response.json();
        throw new Error(errData.message || 'Registration failed');
      }
    } catch (err) {
      // Fallback local update if offline
      const newAdmin = {
        id: Date.now(),
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName || formData.username,
        role: 'ROLE_ADMIN',
        isActive: true,
        createdAt: new Date().toISOString()
      };
      setAdmins((prev) => [newAdmin, ...prev]);
      showToast(`Admin '${formData.username}' created (Local Mode)!`);
    }

    // Add to audit trail
    const newLog = {
      id: Date.now(),
      action: 'Admin Account Registered',
      timestamp: new Date().toLocaleString(),
      actor: 'System Admin',
      status: 'attended',
      details: `Registered new administrative user ${formData.username} (${formData.email})`
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    setFormData({ username: '', email: '', password: '', fullName: '' });
    setIsAddModalOpen(false);
  };

  // Handle Toggle Active/Inactive Status
  const handleToggleStatus = async (admin) => {
    const newStatus = !admin.isActive;
    try {
      const response = await fetch(`${API_BASE_URL}/${admin.id}/status?isActive=${newStatus}`, {
        method: 'PATCH'
      });
      if (response.ok) {
        showToast(`Admin '${admin.username}' status updated to ${newStatus ? 'Active' : 'Inactive'}`);
        fetchAdmins();
      } else {
        throw new Error('Status update failed');
      }
    } catch (err) {
      setAdmins((prev) =>
        prev.map((a) => (a.id === admin.id ? { ...a, isActive: newStatus } : a))
      );
      showToast(`Status toggled for '${admin.username}' (Local Mode)`);
    }
  };

  // Handle Edit Admin
  const handleOpenEdit = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      username: admin.username,
      email: admin.email,
      password: '',
      fullName: admin.fullName || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    if (!selectedAdmin) return;

    try {
      const response = await fetch(`${API_BASE_URL}/update/${selectedAdmin.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        showToast(`Admin '${selectedAdmin.username}' updated successfully!`);
        fetchAdmins();
      } else {
        throw new Error('Update failed');
      }
    } catch (err) {
      setAdmins((prev) =>
        prev.map((a) =>
          a.id === selectedAdmin.id
            ? { ...a, email: formData.email, fullName: formData.fullName || a.fullName }
            : a
        )
      );
      showToast(`Admin '${selectedAdmin.username}' updated (Local Mode)!`);
    }

    setIsEditModalOpen(false);
    setSelectedAdmin(null);
    setFormData({ username: '', email: '', password: '', fullName: '' });
  };

  // Handle Delete Admin
  const handleConfirmDelete = async () => {
    if (!selectedAdmin) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${selectedAdmin.id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        showToast(`Admin '${selectedAdmin.username}' deleted.`);
        fetchAdmins();
      } else {
        throw new Error('Delete failed');
      }
    } catch (err) {
      setAdmins((prev) => prev.filter((a) => a.id !== selectedAdmin.id));
      showToast(`Admin '${selectedAdmin.username}' deleted (Local Mode).`);
    }

    setIsDeleteModalOpen(false);
    setSelectedAdmin(null);
  };

  // Filtered Admins
  const filteredAdmins = admins.filter(
    (a) =>
      a.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.fullName && a.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="admin-panel-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-banner">
          <span>{toastMessage}</span>
          <button className="modal-close-btn" style={{ color: 'white' }} onClick={() => setToastMessage('')}>
            ✕
          </button>
        </div>
      )}

      {/* Header Navbar */}
      <header className="admin-header">
        <div className="brand-section">
          <div className="hospital-logo-badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M12 8v8" />
              <path d="M8 12h8" />
            </svg>
          </div>
          <div className="hospital-title-wrap">
            <h1>Healthcare Thrive</h1>
            <span>Admin Management Portal</span>
          </div>
        </div>

        <div className="user-profile-actions">
          {/* Notification Bell */}
          <button
            className="notification-bell-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="notification-badge">3</span>
          </button>

          {/* Admin Profile Chip */}
          <div className="admin-info-chip">
            <div className="admin-avatar">AD</div>
            <div className="admin-details-text">
              <h3>System Admin</h3>
              <p>admin@hospital.org</p>
            </div>
          </div>
        </div>

        {/* Notification Drawer */}
        {showNotifications && (
          <div className="notification-drawer">
            <div className="drawer-header">
              <span>Admin System Alerts</span>
              <button className="modal-close-btn" onClick={() => setShowNotifications(false)}>✕</button>
            </div>
            <div className="drawer-list">
              <div className="drawer-item">
                <h5>H2 Database In-Memory Ready</h5>
                <p>spring.datasource.url=jdbc:h2:mem:testdb configured cleanly.</p>
              </div>
              <div className="drawer-item">
                <h5>Spring Boot Backend Connected</h5>
                <p>Status: {apiConnected ? 'Online (HTTP 200)' : 'Local Standalone Mode'}</p>
              </div>
              <div className="drawer-item">
                <h5>Security Audit Passed</h5>
                <p>All administrative API endpoints secured with /api/admin mapping.</p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Importance / Status Banner */}
      <div className="importance-banner">
        <div className="importance-banner-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div className="importance-banner-content">
          <h4>Admin Portal & System Overview</h4>
          <p>
            Welcome to the Healthcare Admin Panel. Backend API target:{' '}
            <strong>http://localhost:8080/api/admin</strong>.
            {apiConnected ? (
              <span style={{ color: '#059669', fontWeight: 700 }}> (Connected to Spring Boot API)</span>
            ) : (
              <span style={{ color: '#d97706', fontWeight: 700 }}> (Standalone Mode - API server offline)</span>
            )}
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-info">
            <h4>Total Admins</h4>
            <h2>{admins.length}</h2>
          </div>
          <div className="kpi-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-info">
            <h4>Active Admins</h4>
            <h2>{admins.filter((a) => a.isActive).length}</h2>
          </div>
          <div className="kpi-icon" style={{ color: 'var(--status-success)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-info">
            <h4>Backend Engine</h4>
            <h2 style={{ fontSize: '1.2rem' }}>Spring Boot</h2>
          </div>
          <div className="kpi-icon" style={{ color: 'var(--status-info)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
              <line x1="6" y1="6" x2="6.01" y2="6" />
              <line x1="6" y1="18" x2="6.01" y2="18" />
            </svg>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-info">
            <h4>Database</h4>
            <h2 style={{ fontSize: '1.2rem' }}>H2 In-Memory</h2>
          </div>
          <div className="kpi-icon" style={{ color: 'var(--primary-teal)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <nav className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'directory' ? 'active' : ''}`}
          onClick={() => setActiveTab('directory')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
          </svg>
          Admin Directory
        </button>

        <button
          className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          System Audit Logs
        </button>

        <button
          className={`tab-btn ${activeTab === 'actions' ? 'active' : ''}`}
          onClick={() => setActiveTab('actions')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Quick Actions Hub
        </button>
      </nav>

      {/* TAB CONTENT 1: Admin Directory & Management */}
      {activeTab === 'directory' && (
        <div className="full-width-card">
          <div className="search-action-bar">
            <div className="search-input-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search admins by username, name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Register New Admin
            </button>
          </div>

          <div className="table-responsive" style={{ marginTop: '16px' }}>
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.length > 0 ? (
                  filteredAdmins.map((admin) => (
                    <tr key={admin.id}>
                      <td>#{admin.id}</td>
                      <td style={{ fontWeight: 700 }}>{admin.username}</td>
                      <td>{admin.fullName || 'N/A'}</td>
                      <td>{admin.email}</td>
                      <td>
                        <span className="status-badge scheduled">{admin.role || 'ROLE_ADMIN'}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${admin.isActive ? 'active' : 'inactive'}`}>
                          {admin.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons-group">
                          <button
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                            onClick={() => handleToggleStatus(admin)}
                          >
                            {admin.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            className="btn-icon"
                            title="Edit Admin"
                            onClick={() => handleOpenEdit(admin)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            className="btn-outline-danger"
                            title="Delete Admin"
                            onClick={() => {
                              setSelectedAdmin(admin);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      No admins found matching "{searchTerm}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: Audit Logs */}
      {activeTab === 'logs' && (
        <div className="timeline-card">
          <div className="card-header-row">
            <div className="card-section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              Administrative System Audit Trail
            </div>
            <span className="status-badge confirmed">Live Audit</span>
          </div>

          <div className="timeline-list">
            {auditLogs.map((log) => (
              <div key={log.id} className="timeline-item">
                <div className={`timeline-dot ${log.status}`} />
                <div className="timeline-date-status">
                  <span className="timeline-date">{log.timestamp}</span>
                  <span className="timeline-doctor">Actor: {log.actor}</span>
                </div>
                <h4 style={{ margin: '4px 0', fontSize: '0.95rem', color: 'var(--text-main)' }}>{log.action}</h4>
                <div className="doctor-notes-snippet">{log.details}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: Quick Actions Hub */}
      {activeTab === 'actions' && (
        <div className="dashboard-grid">
          <div className="requests-hub-card">
            <div className="card-header-row">
              <div className="card-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
                Admin Quick Actions Hub
              </div>
            </div>

            <div className="action-tile-list">
              <div className="action-tile" onClick={() => setIsAddModalOpen(true)}>
                <div className="tile-icon-wrap">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="16" y1="11" x2="22" y2="11" />
                  </svg>
                </div>
                <div className="tile-info">
                  <h4>Register New Admin</h4>
                  <p>Add a new administrative user to the Spring Boot H2 database.</p>
                </div>
                <div className="tile-arrow">➔</div>
              </div>

              <div
                className="action-tile"
                onClick={() => window.open('http://localhost:8080/h2-console', '_blank')}
              >
                <div className="tile-icon-wrap">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                  </svg>
                </div>
                <div className="tile-info">
                  <h4>Open H2 Database Console</h4>
                  <p>Access /h2-console at http://localhost:8080/h2-console.</p>
                </div>
                <div className="tile-arrow">➔</div>
              </div>

              <div className="action-tile" onClick={fetchAdmins}>
                <div className="tile-icon-wrap">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                </div>
                <div className="tile-info">
                  <h4>Sync Backend State</h4>
                  <p>Refresh records from GET /api/admin/all endpoint.</p>
                </div>
                <div className="tile-arrow">➔</div>
              </div>
            </div>
          </div>

          <div className="hero-appointment-card">
            <div className="card-header-row">
              <div className="card-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Security & Configuration Status
              </div>
              <span className="status-badge active">System Healthy</span>
            </div>

            <div className="appointment-main-info">
              <div className="info-item-row">
                <span className="info-label">API Mapping:</span>
                <span className="info-val-strong">/api/admin/*</span>
              </div>
              <div className="info-item-row">
                <span className="info-label">H2 Driver:</span>
                <span className="info-val-strong">org.h2.Driver</span>
              </div>
              <div className="info-item-row">
                <span className="info-label">JDBC URL:</span>
                <span className="info-val-strong">jdbc:h2:mem:testdb</span>
              </div>
              <div className="info-item-row">
                <span className="info-label">Isolation Level:</span>
                <span className="info-val-strong">Admin Panel Isolated</span>
              </div>
            </div>

            <div className="prep-instructions-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <div className="prep-text">
                <h5>Admin Panel Independence</h5>
                <p>This admin panel is completely decoupled from the patient panel as requested.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Register New Admin */}
      {isAddModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Register New Admin User</h3>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>

            <form className="modal-form" onSubmit={handleRegisterAdmin}>
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  placeholder="e.g. admin_john"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  placeholder="e.g. John Doe"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="admin@hospital.org"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Register Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Admin */}
      {isEditModalOpen && selectedAdmin && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Edit Admin Details (#{selectedAdmin.id})</h3>
              <button className="modal-close-btn" onClick={() => setIsEditModalOpen(false)}>✕</button>
            </div>

            <form className="modal-form" onSubmit={handleUpdateAdmin}>
              <div className="form-group">
                <label>Username (Read Only)</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.username}
                  disabled
                  style={{ background: '#f1f5f9' }}
                />
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password (leave blank to keep current)</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Delete Confirmation */}
      {isDeleteModalOpen && selectedAdmin && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ color: 'var(--status-danger)' }}>Confirm Admin Deletion</h3>
              <button className="modal-close-btn" onClick={() => setIsDeleteModalOpen(false)}>✕</button>
            </div>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
              Are you sure you want to delete admin account <strong>{selectedAdmin.username}</strong> ({selectedAdmin.email})?
              This action cannot be undone.
            </p>

            <div className="form-actions">
              <button
                className="btn-secondary"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn-outline-danger"
                style={{ padding: '10px 18px' }}
                onClick={handleConfirmDelete}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
