import React, { useState } from 'react';

export default function InteractiveLineChart() {
  const [activePoint, setActivePoint] = useState(null);

  const days = [
    { day: 'Sep 10', low: 1820, med: 410, high: 145 },
    { day: 'Sep 11', low: 1850, med: 415, high: 150 },
    { day: 'Sep 12', low: 1890, med: 420, high: 152 },
    { day: 'Sep 13', low: 1875, med: 418, high: 148 },
    { day: 'Sep 14', low: 1910, med: 425, high: 155 },
    { day: 'Sep 15', low: 1940, med: 430, high: 158 },
    { day: 'Sep 16', low: 1904, med: 421, high: 156 }
  ];

  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Legend Header */}
      <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', fontWeight: 700, justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '3px', background: '#059669', borderRadius: '2px' }} />
          <span>Low Risk</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '3px', background: '#d97706', borderRadius: '2px' }} />
          <span>Medium Risk</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '3px', background: '#e11d48', borderRadius: '2px' }} />
          <span>High Risk</span>
        </div>
      </div>

      {/* SVG Interactive Line Canvas */}
      <div style={{ position: 'relative', height: '180px', width: '100%' }}>
        <svg width="100%" height="180" viewBox="0 0 450 180" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
          {/* Grid lines */}
          <line x1="0" y1="30" x2="450" y2="30" stroke="var(--border-color)" strokeDasharray="3 3" />
          <line x1="0" y1="80" x2="450" y2="80" stroke="var(--border-color)" strokeDasharray="3 3" />
          <line x1="0" y1="130" x2="450" y2="130" stroke="var(--border-color)" strokeDasharray="3 3" />

          {/* Low Risk Line Path (Green) */}
          <path
            d="M 10,40 L 75,35 L 140,25 L 205,30 L 270,20 L 335,15 L 400,20"
            fill="none"
            stroke="#059669"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Medium Risk Line Path (Orange) */}
          <path
            d="M 10,110 L 75,108 L 140,105 L 205,106 L 270,102 L 335,100 L 400,105"
            fill="none"
            stroke="#d97706"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* High Risk Line Path (Red) */}
          <path
            d="M 10,155 L 75,152 L 140,150 L 205,153 L 270,148 L 335,145 L 400,146"
            fill="none"
            stroke="#e11d48"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Interactive Data Points */}
          {days.map((d, i) => {
            const x = 10 + i * 65;
            const lowY = 40 - (i % 2 === 0 ? 5 : 0);
            const highY = 155 - i * 1.5;

            return (
              <g key={i}>
                {/* Active Hover Guide Line */}
                {activePoint === i && (
                  <line x1={x} y1="0" x2={x} y2="170" stroke="var(--primary-accent)" strokeWidth="1.5" strokeDasharray="2 2" />
                )}

                {/* Low Risk Data Node */}
                <circle
                  cx={x}
                  cy={lowY}
                  r={activePoint === i ? "6" : "4"}
                  fill="#059669"
                  stroke="#ffffff"
                  strokeWidth="2"
                  style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onMouseEnter={() => setActivePoint(i)}
                  onMouseLeave={() => setActivePoint(null)}
                />

                {/* High Risk Data Node */}
                <circle
                  cx={x}
                  cy={highY}
                  r={activePoint === i ? "6" : "4"}
                  fill="#e11d48"
                  stroke="#ffffff"
                  strokeWidth="2"
                  style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onMouseEnter={() => setActivePoint(i)}
                  onMouseLeave={() => setActivePoint(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip Callout on Hover */}
        {activePoint !== null && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: `${10 + activePoint * 13}%`,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-focus)',
            padding: '8px 12px',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-hover)',
            fontSize: '0.78rem',
            zIndex: 10,
            pointerEvents: 'none',
            whiteSpace: 'nowrap'
          }}>
            <div style={{ fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>{days[activePoint].day} Risk Counts</div>
            <div style={{ color: '#059669', fontWeight: 700 }}>🟢 Low: {days[activePoint].low}</div>
            <div style={{ color: '#d97706', fontWeight: 700 }}>🟠 Med: {days[activePoint].med}</div>
            <div style={{ color: '#e11d48', fontWeight: 700 }}>🔴 High: {days[activePoint].high}</div>
          </div>
        )}
      </div>

      {/* X-Axis Date Labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0 5px' }}>
        {days.map((d, i) => (
          <span key={i} style={{ fontWeight: activePoint === i ? 800 : 500, color: activePoint === i ? 'var(--primary-accent)' : 'inherit' }}>
            {d.day}
          </span>
        ))}
      </div>
    </div>
  );
}
