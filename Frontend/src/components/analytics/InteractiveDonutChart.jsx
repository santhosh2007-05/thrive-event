import React, { useState } from 'react';

export default function InteractiveDonutChart() {
  const [hoveredSlice, setHoveredSlice] = useState(null);

  const data = [
    { label: 'Low Risk (0-30%)', count: 1904, percentage: 76.7, color: '#059669', sliceAngle: 276.12 },
    { label: 'Medium Risk (31-69%)', count: 421, percentage: 17.0, color: '#d97706', sliceAngle: 61.2 },
    { label: 'High Risk (≥70%)', count: 156, percentage: 6.3, color: '#e11d48', sliceAngle: 22.68 }
  ];

  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: '220px', height: '220px' }}>
        <svg width="220" height="220" viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg)', borderRadius: '50%' }}>
          {/* Ring 1: Low Risk (76.7%) */}
          <circle
            cx="21"
            cy="21"
            r="15.91549430918954"
            fill="transparent"
            stroke="#059669"
            strokeWidth="6"
            strokeDasharray="76.7 23.3"
            strokeDashoffset="0"
            style={{
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              opacity: hoveredSlice === null || hoveredSlice === 0 ? 1 : 0.45,
              transform: hoveredSlice === 0 ? 'scale(1.04)' : 'scale(1)',
              transformOrigin: 'center'
            }}
            onMouseEnter={() => setHoveredSlice(0)}
            onMouseLeave={() => setHoveredSlice(null)}
          />

          {/* Ring 2: Medium Risk (17.0%) */}
          <circle
            cx="21"
            cy="21"
            r="15.91549430918954"
            fill="transparent"
            stroke="#d97706"
            strokeWidth="6"
            strokeDasharray="17.0 83.0"
            strokeDashoffset="-76.7"
            style={{
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              opacity: hoveredSlice === null || hoveredSlice === 1 ? 1 : 0.45,
              transform: hoveredSlice === 1 ? 'scale(1.04)' : 'scale(1)',
              transformOrigin: 'center'
            }}
            onMouseEnter={() => setHoveredSlice(1)}
            onMouseLeave={() => setHoveredSlice(null)}
          />

          {/* Ring 3: High Risk (6.3%) */}
          <circle
            cx="21"
            cy="21"
            r="15.91549430918954"
            fill="transparent"
            stroke="#e11d48"
            strokeWidth="6"
            strokeDasharray="6.3 93.7"
            strokeDashoffset="-93.7"
            style={{
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              opacity: hoveredSlice === null || hoveredSlice === 2 ? 1 : 0.45,
              transform: hoveredSlice === 2 ? 'scale(1.04)' : 'scale(1)',
              transformOrigin: 'center'
            }}
            onMouseEnter={() => setHoveredSlice(2)}
            onMouseLeave={() => setHoveredSlice(null)}
          />
        </svg>

        {/* Center Dynamic Tooltip Callout */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none'
        }}>
          {hoveredSlice !== null ? (
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: data[hoveredSlice].color }}>
                {data[hoveredSlice].count}
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {data[hoveredSlice].percentage}%
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)' }}>
                2,481
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Total Visits
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend with Interactive Hover Highlight */}
      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
        {data.map((item, idx) => (
          <div
            key={idx}
            onMouseEnter={() => setHoveredSlice(idx)}
            onMouseLeave={() => setHoveredSlice(null)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '6px 10px',
              borderRadius: '8px',
              background: hoveredSlice === idx ? 'var(--bg-highlight)' : 'var(--bg-subtle)',
              border: `1px solid ${hoveredSlice === idx ? item.color : 'var(--border-color)'}`,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 600 }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
              <span style={{ color: 'var(--text-main)' }}>{item.label}</span>
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {item.count} <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({item.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
