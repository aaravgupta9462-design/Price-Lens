import React from 'react';

export const DashboardFooter = ({ onNavigate }) => {
  const handleLinkClick = (e, path) => {
    e.preventDefault();
    if (typeof onNavigate === 'function') {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="db-footer-clean">
      <div className="db-footer-container">
        {/* Left Column: Brand & Tagline */}
        <div className="db-footer-left">
          <div
            className="db-footer-logo-text"
            style={{ cursor: 'pointer' }}
            onClick={(e) => handleLinkClick(e, '/')}
          >
            Price<span>Lens</span>
          </div>
          <div style={{ color: 'var(--db-text-muted)', fontSize: '0.8rem' }}>
            Real-time multi-store price comparisons &amp; shopping intelligence in India.
          </div>
        </div>

        {/* Center / Navigation Links */}
        <div className="db-footer-links-row">
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
            title="Home & Deals"
          >
            Deals
          </a>
          <a
            href="/about"
            onClick={(e) => handleLinkClick(e, '/about')}
            title="About PriceLens & How It Works"
          >
            About
          </a>
          <a
            href="/privacy"
            onClick={(e) => handleLinkClick(e, '/privacy')}
            title="Privacy Policy"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            onClick={(e) => handleLinkClick(e, '/terms')}
            title="Terms of Service & Disclaimer"
          >
            Terms &amp; Disclaimer
          </a>
        </div>
      </div>

      {/* Mandatory Amazon Associates Disclosure & Disclaimer */}
      <div className="db-footer-container">
        <div className="db-footer-amazon-notice">
          <div style={{ fontWeight: 600, color: '#1E293B', marginBottom: '0.35rem' }}>
            Amazon Associates Program Disclosure:
          </div>
          <p style={{ margin: 0, marginBottom: '0.35rem' }}>
            <strong>&ldquo;As an Amazon Associate I earn from qualifying purchases.&rdquo;</strong>
          </p>
          <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748B' }}>
            PriceLens participates in various affiliate marketing programs, which means we may earn commissions on editorially chosen products purchased through our links to retailer sites (including Amazon.in, Flipkart, and other partner stores), at no extra cost to you. Product prices, coupons, and availability are accurate as of the date/time indicated and are subject to change. Any price and availability information displayed on the merchant site at the time of purchase will apply to the purchase of this product.
          </p>
        </div>
      </div>

      {/* Copyright row */}
      <div className="db-footer-container" style={{ marginTop: '0.75rem', paddingTop: '0.75rem' }}>
        <div style={{ color: 'var(--db-text-muted)', fontSize: '0.74rem' }}>
          &copy; {new Date().getFullYear()} PriceLens. All registered trademarks, logos, and merchant brands belong to their respective owners.
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
