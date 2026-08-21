import React from 'react';

export const Header = () => {
  return (
    <header className="brand-header">
      <a href="/" className="lofi-brand-badge">
        <img
          src="/logo.jpg"
          alt="PriceLens Logo"
          className="lofi-brand-img"
        />
        <div className="brand-name">
          <span className="text-price">PRICE</span>
          <span className="text-lens">LENS</span>
        </div>
      </a>

      {/* Tagline Pill */}
      <div className="brand-tagline-pill">
        <span style={{ color: '#f59e0b' }}>✦</span>
        <span>FIND BEST PRICES. BUY SMART.</span>
      </div>
    </header>
  );
};
