import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import audioService from '../../services/audioService';

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
  const [role, setRole] = useState('Admin');
  const [email, setEmail] = useState('admin@caretrack.health');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLightTheme, setIsLightTheme] = useState(false); // Theme Switcher State

  // Auto-rotating image slider carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    audioService.play2hReminder();
    onLoginSuccess({ name: email, role });
    navigate('/dashboard');
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
        {/* Top-Right Theme Toggle Button (Light Theme / Black Theme) */}
        <button
          type="button"
          onClick={() => setIsLightTheme(!isLightTheme)}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
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
            gap: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          {isLightTheme ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              Switch to Dark Theme
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
              </svg>
              Switch to White Theme
            </>
          )}
        </button>

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
          {/* Background Image Carousel Layer with Crossfade */}
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

          {/* Top Logo & Back Button Layer */}
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

            <Link
              to="/dashboard"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 600,
                textDecoration: 'none',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              Back to portal →
            </Link>
          </div>

          {/* Bottom Hero Text Layer */}
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

            {/* Carousel Slide Indicators */}
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

        {/* Right Side Form Panel (Adapts to White or Black Theme) */}
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
                <option value="Admin">System Administrator</option>
                <option value="Doctor">Attending Doctor</option>
                <option value="Nurse">Staff Nurse</option>
                <option value="Patient">Patient Portal</option>
              </select>
            </div>

            {/* Email / Username */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: isLightTheme ? '#64665e' : '#cbd5e1', marginBottom: '6px', fontWeight: 500 }}>
                Email or Username
              </label>
              <input
                type="text"
                placeholder="Enter your email or username"
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

            {/* Password with Eye Icon */}
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: isLightTheme ? '#64665e' : '#cbd5e1', marginBottom: '6px', fontWeight: 500 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
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
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: isLightTheme ? '#64665e' : '#94a3b8',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
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
              Sign in to CareTrack
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
