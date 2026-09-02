import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import PatientProfilePage from './pages/PatientProfilePage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import NurseDashboardPage from './pages/NurseDashboardPage';
import AppointmentsPage from './pages/AppointmentsPage';
import AppointmentDetailPage from './pages/AppointmentDetailPage';
import RiskPredictionPage from './pages/RiskPredictionPage';
import MLTestingPage from './pages/MLTestingPage';
import NotificationsPage from './pages/NotificationsPage';
import ReportsPage from './pages/ReportsPage';
import UsersRolesPage from './pages/UsersRolesPage';
import AuditLogsPage from './pages/AuditLogsPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import ServicesPage from './pages/ServicesPage';
import VehicleManagementPage from './pages/VehicleManagementPage';

export default function App() {
  const [role, setRole] = useState('Admin');
  const [user, setUser] = useState({ name: 'System Administrator', role: 'Admin' });

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setUser(prev => ({ ...prev, role: newRole }));
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setRole(userData.role || 'Admin');
  };

  const handleLogout = () => {
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Root URL Opens LOGIN Page First */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Register onLoginSuccess={handleLoginSuccess} />} />

        {/* Standalone ML Model Sandbox Route */}
        <Route
          path="/ml-test"
          element={
            <AppShell role={role} onRoleChange={handleRoleChange} user={user} onLogout={handleLogout}>
              <MLTestingPage />
            </AppShell>
          }
        />

        {/* Application Routes wrapped in AppShell */}
        <Route
          path="/*"
          element={
            <AppShell role={role} onRoleChange={handleRoleChange} user={user} onLogout={handleLogout}>
              <Routes>
                {/* Admin Command Center */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute role={role} allowedRoles={['Admin']}>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* Doctor Portal */}
                <Route
                  path="/doctor-dashboard"
                  element={
                    <ProtectedRoute role={role} allowedRoles={['Doctor', 'Admin']}>
                      <DoctorDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* Nurse Desk */}
                <Route
                  path="/nurse-dashboard"
                  element={
                    <ProtectedRoute role={role} allowedRoles={['Nurse', 'Admin']}>
                      <NurseDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* General Pages */}
                <Route path="/patients" element={<PatientsPage />} />
                <Route path="/patients/:id" element={<PatientProfilePage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/vehicle-management" element={<VehicleManagementPage />} />
                <Route path="/appointments" element={<AppointmentsPage />} />
                <Route path="/appointments/:id" element={<AppointmentDetailPage />} />
                <Route path="/risk-prediction" element={<RiskPredictionPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/reports" element={<ReportsPage />} />

                {/* Security Admin Only Routes */}
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

                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </AppShell>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
