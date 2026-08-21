import React from 'react';

const DashboardFooter = () => {
  return (
    <footer className="db-footer-clean">
      <div className="db-footer-left">
        <div className="db-footer-logo-text">
          Price<span>Lens</span>
        </div>
        <div style={{ color: 'var(--db-text-muted)', fontSize: '0.75rem' }}>
          Compare prices. Trust reviews. Choose better.
        </div>
      </div>

      <div className="db-footer-links-row">
        <a href="#about" onClick={(e) => e.preventDefault()}>About</a>
        <a href="#contact" onClick={(e) => e.preventDefault()}>Contact</a>
        <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy</a>
        <a href="#terms" onClick={(e) => e.preventDefault()}>Terms</a>
      </div>

      <div style={{ color: 'var(--db-text-muted)', fontSize: '0.72rem' }}>
        © 2026 PriceLens. All store logos belong to their respective owners.
      </div>
    </footer>
  );
};

export default DashboardFooter;
