import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import audioService from '../../services/audioService';
import dataStore from '../../services/dataStore';

const CAROUSEL_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80',
    title: 'Better Follow-up,\nBetter Outcomes',
    subtitle: 'AI-assisted patient risk prediction & transparent clinical decision support system.'
  },
  {
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80',
    title: 'Comprehensive\nPatient Care',
    subtitle: 'Real-time intervention tracking for hospital staff, doctors, and nurses.'
  },
  {
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1000&q=80',
    title: 'Accessible\nHealthcare Technology',
    subtitle: 'Age-aware patient portals designed for maximum accessibility and ease of use.'
  }
];

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [role, setRole] = useState('Patient');
  const [email, setEmail] = useState('santhosh');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLightTheme, setIsLightTheme] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    audioService.play2hReminder();

    const allPatients = dataStore.getPatients();
    const query = email.toLowerCase().trim();

    // Match patient by name or ID
    const matchedPatient = allPatients.find(p =>
      p.name.toLowerCase().includes(query) ||
      p.id.toLowerCase() === query
    ) || allPatients.find(p => p.id === 'P-10238') || allPatients[0];

    onLoginSuccess({ name: matchedPatient ? matchedPatient.name : email, role });

    if (role === 'Admin') navigate('/dashboard');
    else if (role === 'Doctor') navigate('/doctor-dashboard');
    else if (role === 'Nurse') navigate('/nurse-dashboard');
    else navigate(`/patients/${matchedPatient.id}`);
  };

  const currentSlide = CAROUSEL_SLIDES[activeSlide];

  return (
    <div style={{
      minHeight: '100vh',
      background: isLightTheme
        ? '#f7f7f4'
        : 'radial-gradient(circle at 50% 10%, #1e1b4b 0%, #0d0c15 80%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      boxSizing: 'border-box',
      transition: 'background 0.4s ease'
    }}>
      {/* Outer Card Container */}
      <div style={{
        background: isLightTheme ? '#ffffff' : '#161424',
        borderRadius: '24px',
        maxWidth: '1000px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        boxShadow: isLightTheme
          ? '0 20px 50px rgba(0,0,0,0.06)'
          : '0 25px 60px rgba(0,0,0,0.6)',
        border: isLightTheme ? '1px solid #e4e6df' : '1px solid #28243d',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Top-Right Buttons */}
        <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10, display: 'flex', gap: '8px' }}>
          <Link
            to="/ml-test"
            style={{
              background: 'linear-gradient(135deg, #059669, #047857)',
              color: 'white',
              padding: '8px 14px',
              borderRadius: '30px',
              fontWeight: 700,
              fontSize: '0.8rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
            }}
          >
            🔬 Test ML Model Sandbox
          </Link>

          <button
            type="button"
            onClick={() => setIsLightTheme(!isLightTheme)}
            style={{
              background: isLightTheme ? '#f0f2eb' : '#242038',
              border: isLightTheme ? '1px solid #e4e6df' : '1px solid #3b3558',
              color: isLightTheme ? '#181816' : '#ffffff',
              padding: '8px 14px',
              borderRadius: '30px',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {isLightTheme ? '🌙 Dark Theme' : '☀️ White Theme'}
          </button>
        </div>

        {/* Left Side Sliding Image Graphic Panel */}
        <div style={{
          position: 'relative',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '480px',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.4) 0%, rgba(15,23,42,0.85) 100%), url(${currentSlide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'background-image 0.8s ease-in-out',
            zIndex: 1
          }} />

          <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                CARETRACK
              </span>
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 2, marginTop: 'auto', paddingTop: '60px' }}>
            <h1 style={{
              color: 'white',
              fontSize: '2.2rem',
              fontWeight: 800,
              lineHeight: '1.2',
              margin: '0 0 12px 0',
              whiteSpace: 'pre-line'
            }}>
              {currentSlide.title}
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem', margin: 0, lineHeight: '1.5' }}>
              {currentSlide.subtitle}
            </p>

            <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
              {CAROUSEL_SLIDES.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  style={{
                    width: idx === activeSlide ? '32px' : '12px',
                    height: '4px',
                    background: idx === activeSlide ? '#ffffff' : 'rgba(255,255,255,0.4)',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Form Panel */}
        <div style={{
          padding: '44px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          color: isLightTheme ? '#181816' : '#ffffff'
        }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0 0 6px 0', color: isLightTheme ? '#181816' : '#ffffff' }}>
            Sign in to CareTrack
          </h2>
          <p style={{ fontSize: '0.875rem', color: isLightTheme ? '#64665e' : '#94a3b8', margin: '0 0 28px 0' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: isLightTheme ? '#059669' : '#818cf8', fontWeight: 600, textDecoration: 'none' }}>
              Create an account
            </Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Role Selection */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: isLightTheme ? '#64665e' : '#cbd5e1', marginBottom: '6px', fontWeight: 500 }}>
                Access Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: isLightTheme ? '#f0f2eb' : '#242038',
                  border: isLightTheme ? '1px solid #e4e6df' : '1px solid #3b3558',
                  color: isLightTheme ? '#181816' : '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <option value="Patient">Patient Portal (e.g. Santhosh)</option>
                <option value="Admin">System Administrator</option>
                <option value="Doctor">Attending Doctor</option>
                <option value="Nurse">Staff Nurse</option>
              </select>
            </div>

            {/* Email / Username / Patient Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: isLightTheme ? '#64665e' : '#cbd5e1', marginBottom: '6px', fontWeight: 500 }}>
                Patient Name, Email or ID
              </label>
              <input
                type="text"
                placeholder="e.g. santhosh or P-10238"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  background: isLightTheme ? '#f0f2eb' : '#242038',
                  border: isLightTheme ? '1px solid #e4e6df' : '1px solid #3b3558',
                  color: isLightTheme ? '#181816' : '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Password with Working Eye Toggle Button */}
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: isLightTheme ? '#64665e' : '#cbd5e1', marginBottom: '6px', fontWeight: 500 }}>
                Password
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 44px 14px 16px',
                    borderRadius: '10px',
                    background: isLightTheme ? '#f0f2eb' : '#242038',
                    border: isLightTheme ? '1px solid #e4e6df' : '1px solid #3b3558',
                    color: isLightTheme ? '#181816' : '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPassword(!showPassword);
                  }}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'transparent',
                    border: 'none',
                    color: isLightTheme ? '#181816' : '#ffffff',
                    cursor: 'pointer',
                    padding: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: isLightTheme ? '#64665e' : '#cbd5e1' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#059669', width: '16px', height: '16px' }}
                />
                Remember me
              </label>
              <span style={{ color: isLightTheme ? '#059669' : '#818cf8', cursor: 'pointer' }}>Forgot password?</span>
            </div>

            {/* Submit Button */}
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
                marginTop: '12px',
                boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)'
              }}
            >
              Sign in as Patient ({email || 'Santhosh'})
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
