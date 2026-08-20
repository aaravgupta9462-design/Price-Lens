import React from 'react';

export const Header = () => {
  return (
    <header className="brand-header">
      <a href="/" className="brand-logo-group">
        <div className="brand-logo-icon">
          <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="hdrLensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="50%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
            <circle cx="45" cy="45" r="24" stroke="url(#hdrLensGrad)" strokeWidth="10" />
            <path d="M62 62L82 82" stroke="url(#hdrLensGrad)" strokeWidth="10" strokeLinecap="round" />
            <path d="M35 48L42 41L48 45L56 36" stroke="#10B981" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="brand-name">
          Price<span>Lens</span>
        </div>
      </a>

      {/* Tagline Pill specified in User Specs */}
      <div className="brand-tagline-pill">
        <span style={{ color: 'var(--primary-emerald)' }}>✦</span>
        <span>Compare Prices. Trust Reviews. Buy Smarter.</span>
      </div>
    </header>
  );
};
