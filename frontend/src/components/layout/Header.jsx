import React from 'react';

export const Header = () => {
  return (
    <header className="brand-header">
      <a href="/" className="lofi-brand-badge">
        <img
          src="/logo.png"
          alt="PriceLens — Compare • Track • Save"
          className="h-10 w-auto object-contain"
        />
      </a>

      {/* Tagline Pill */}
      <div className="brand-tagline-pill">
        <span style={{ color: '#f59e0b' }}>✦</span>
        <span>FIND BEST PRICES. BUY SMART.</span>
      </div>
    </header>
  );
};
