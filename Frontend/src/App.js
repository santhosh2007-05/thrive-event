import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import ProtectedRoute from './components/layout/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import NurseDashboardPage from './pages/NurseDashboardPage';
import PatientsPage from './pages/PatientsPage';
import PatientProfilePage from './pages/PatientProfilePage';
import AppointmentsPage from './pages/AppointmentsPage';
import AppointmentDetailPage from './pages/AppointmentDetailPage';
import RiskPredictionPage from './pages/RiskPredictionPage';
import NotificationsPage from './pages/NotificationsPage';
import ReportsPage from './pages/ReportsPage';
import UsersRolesPage from './pages/UsersRolesPage';
import AuditLogsPage from './pages/AuditLogsPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Admin from './Admin/Admin';
import './App.css';
import './Admin/Admin.css';

function App() {
  const [user, setUser] = useState({ name: 'System Admin', role: 'Admin' });
  const [role, setRole] = useState('Admin');

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setUser(prev => ({ ...prev, role: newRole }));
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setRole(userData.role);
  };

  const handleLogout = () => {
    setUser(null);
    window.location.href = '/login';
  };

  const getRootRedirect = () => {
    if (role === 'Admin') return '/dashboard';
    if (role === 'Doctor') return '/doctor-dashboard';
    if (role === 'Nurse') return '/nurse-dashboard';
    if (role === 'Patient') return '/patients/P-10234';
    return '/dashboard';
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Register onLoginSuccess={handleLoginSuccess} />} />

        {/* Standalone Admin Route Guarded for Admin Role */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role={role} allowedRoles={['Admin']}>
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* Main Application Shell Wrapped Routes */}
        <Route
          path="/*"
          element={
            <AppShell role={role} onRoleChange={handleRoleChange} user={user} onLogout={handleLogout}>
              <Routes>
                <Route path="/" element={<Navigate to={getRootRedirect()} replace />} />
                
                {/* Admin Dashboard ONLY for Admin */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute role={role} allowedRoles={['Admin']}>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* Doctor Clinical Dashboard */}
                <Route
                  path="/doctor-dashboard"
                  element={
                    <ProtectedRoute role={role} allowedRoles={['Doctor', 'Admin']}>
                      <DoctorDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* Nurse Intervention Desk */}
                <Route
                  path="/nurse-dashboard"
                  element={
                    <ProtectedRoute role={role} allowedRoles={['Nurse', 'Admin']}>
                      <NurseDashboardPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/patients"
                  element={
                    role === 'Patient' ? (
                      <Navigate to="/patients/P-10234" replace />
                    ) : (
                      <ProtectedRoute role={role} allowedRoles={['Admin', 'Doctor', 'Nurse']}>
                        <PatientsPage />
                      </ProtectedRoute>
                    )
                  }
                />

                <Route
                  path="/patients/:id"
                  element={
                    <ProtectedRoute role={role} allowedRoles={['Admin', 'Doctor', 'Nurse', 'Patient']}>
                      <PatientProfilePage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/appointments"
                  element={
                    <ProtectedRoute role={role} allowedRoles={['Admin', 'Doctor', 'Nurse', 'Patient']}>
                      <AppointmentsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/appointments/:id"
                  element={
                    <ProtectedRoute role={role} allowedRoles={['Admin', 'Doctor', 'Nurse', 'Patient']}>
                      <AppointmentDetailPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/risk-prediction"
                  element={
                    <ProtectedRoute role={role} allowedRoles={['Admin', 'Doctor', 'Nurse']}>
                      <RiskPredictionPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/risk-prediction/:patientId"
                  element={
                    <ProtectedRoute role={role} allowedRoles={['Admin', 'Doctor', 'Nurse']}>
                      <PatientProfilePage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute role={role} allowedRoles={['Admin', 'Doctor', 'Nurse', 'Patient']}>
                      <NotificationsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute role={role} allowedRoles={['Admin', 'Doctor']}>
                      <ReportsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/users"
                  element={
                    <ProtectedRoute role={role} allowedRoles={['Admin']}>
                      <UsersRolesPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/audit-logs"
                  element={
                    <ProtectedRoute role={role} allowedRoles={['Admin']}>
                      <AuditLogsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute role={role} allowedRoles={['Admin', 'Doctor', 'Nurse', 'Patient']}>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/help"
                  element={
                    <ProtectedRoute role={role} allowedRoles={['Admin', 'Doctor', 'Nurse', 'Patient']}>
                      <HelpPage />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to={getRootRedirect()} replace />} />
              </Routes>
            </AppShell>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
