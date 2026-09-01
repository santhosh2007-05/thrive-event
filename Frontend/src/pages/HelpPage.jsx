import React from 'react';

export default function HelpPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>CareTrack Help Center & Documentation</h2>
        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Guides on risk prediction scores, follow-up workflows, and accessibility</span>
      </div>

      <div className="dashboard-grid">
        <div className="full-width-card">
          <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: '#0f172a', fontWeight: 700 }}>
            Understanding Risk Scores
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: '1.5' }}>
            CareTrack calculates follow-up risk using transparent weighted factor analysis based on previous appointment attendance, travel distance, age bracket, appointment frequency gaps, and treatment duration.
          </p>
          <ul style={{ fontSize: '0.85rem', color: '#475569', paddingLeft: '20px', margin: '8px 0' }}>
            <li><strong>VERY HIGH (85-100%):</strong> Red alert. Immediate staff phone call or nurse assignment recommended.</li>
            <li><strong>HIGH (70-84%):</strong> Orange alert. Outreach & confirmation reminder.</li>
            <li><strong>MEDIUM (45-69%):</strong> Amber alert. Automated SMS reminder.</li>
            <li><strong>LOW (&lt;45%):</strong> Blue/Green state. Regular schedule.</li>
          </ul>
        </div>

        <div className="full-width-card">
          <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: '#0f172a', fontWeight: 700 }}>
            Elderly & Accessibility Guide
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: '1.5' }}>
            For patients aged 60+ or marked as <em>Requires Assisted Communication</em>, CareTrack automatically switches to an ultra-accessible interface with 24px+ headings, high contrast buttons, and direct phone assistance options.
          </p>
        </div>
      </div>

      <div className="full-width-card" id="contact">
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: '#0f172a', fontWeight: 700 }}>
          Contact CareTrack Operations Support
        </h3>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '500px' }} onSubmit={(e) => { e.preventDefault(); alert('Support inquiry submitted!'); }}>
          <input type="text" className="form-control" placeholder="Your Name & Staff ID" required />
          <input type="email" className="form-control" placeholder="Hospital Email Address" required />
          <textarea className="form-control" rows="3" placeholder="Describe issue or request..." required />
          <button type="submit" className="btn-primary">Submit Support Ticket</button>
        </form>
      </div>
    </div>
  );
}
