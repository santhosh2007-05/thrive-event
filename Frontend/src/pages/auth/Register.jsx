import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import audioService from '../../services/audioService';
import dataStore from '../../services/dataStore';

export default function Register({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [role, setRole] = useState('Patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('+91 7598357132');
  const [department, setDepartment] = useState('Cardiology');

  const handleSubmit = (e) => {
    e.preventDefault();
    audioService.play2hReminder();

    if (role === 'Patient') {
      const { newPatientObj } = dataStore.registerNewPatient({
        name: name || 'Santhosh M',
        phone: phone,
        password: password,
        department: department,
        age: 30,
        distanceKm: 5.0
      }, 'Self-Registration', 'Patient');

      onLoginSuccess({ name: newPatientObj.name, role: 'Patient' });
      navigate(`/patients/${newPatientObj.id}`);
    } else {
      onLoginSuccess({ name: name || email, role: role });
      if (role === 'Admin') navigate('/dashboard');
      else if (role === 'Doctor') navigate('/doctor-dashboard');
      else navigate('/nurse-dashboard');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 10%, #1e1b4b 0%, #0d0c15 80%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        background: '#161424',
        borderRadius: '24px',
        maxWidth: '520px',
        width: '100%',
        padding: '40px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        border: '1px solid #28243d',
        color: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: '#ffffff',
            color: '#0f766e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '1rem'
          }}>
            CT
          </div>
          <span style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '1px' }}>
            CARETRACK REGISTRATION
          </span>
        </div>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0 0 6px 0', color: '#ffffff' }}>
          Create New Account
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: '0 0 24px 0' }}>
          Already registered?{' '}
          <Link to="/login" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>
            Sign in here
          </Link>
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px' }}>
              Account Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                background: '#242038',
                border: '1px solid #3b3558',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            >
              <option value="Patient">Patient Account</option>
              <option value="Admin">System Administrator</option>
              <option value="Doctor">Attending Doctor</option>
              <option value="Nurse">Staff Nurse</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px' }}>
              Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Santhosh M"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                background: '#242038',
                border: '1px solid #3b3558',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px' }}>
              Contact Phone Number
            </label>
            <input
              type="text"
              placeholder="+91 7598357132"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                background: '#242038',
                border: '1px solid #3b3558',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px' }}>
              Medical Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                background: '#242038',
                border: '1px solid #3b3558',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            >
              <option value="Cardiology">Cardiology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Endocrinology">Endocrinology</option>
              <option value="Dermatology">Dermatology</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px' }}>
              Email Address *
            </label>
            <input
              type="email"
              placeholder="santhosh@caretrack.health"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                background: '#242038',
                border: '1px solid #3b3558',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Password with Working Eye Toggle */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px' }}>
              Password *
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 44px 12px 14px',
                  borderRadius: '10px',
                  background: '#242038',
                  border: '1px solid #3b3558',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPassword(!showPassword);
                }}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '4px',
                  zIndex: 10
                }}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #059669, #047857)',
              color: 'white',
              border: 'none',
              padding: '14px',
              borderRadius: '30px',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: '10px',
              boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)'
            }}
          >
            Register Account & Access CareTrack
          </button>
        </form>
      </div>
    </div>
  );
}
