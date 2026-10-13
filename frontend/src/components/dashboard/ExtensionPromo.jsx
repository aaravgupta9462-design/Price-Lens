import React from 'react';
import { Globe, ShieldCheck, Zap, Bell, CheckCircle2 } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

const ExtensionPromo = () => {
  const { showToast } = useDashboard();

  const handleInstallClick = () => {
    if (showToast) {
      showToast('PriceLens Extension simulated: Auto-price tracker enabled for Flipkart & Amazon!', 'success');
    }
  };

  return (
    <div className="db-card db-card-primary" style={{
      padding: '1.5rem',
      marginBottom: '1.5rem',
      background: 'linear-gradient(135deg, rgba(91, 69, 255, 0.08) 0%, rgba(124, 58, 237, 0.04) 100%)',
      border: '1px solid rgba(91, 69, 255, 0.25)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
        <div style={{ maxWidth: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '2px 10px',
              borderRadius: '20px',
              background: 'var(--db-primary)',
              color: '#fff'
            }}>
              ⭐ BROWSER ADDON
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--db-text-secondary)', fontWeight: 600 }}>
              4.9/5 Rating · 250,000+ Smart Shoppers
            </span>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--db-text-main)', margin: '0 0 0.4rem 0' }}>
            Never overpay again on Amazon &amp; Flipkart
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--db-text-secondary)', margin: '0 0 0.85rem 0', lineHeight: 1.5 }}>
            See live price history graphs directly on Amazon &amp; Flipkart product pages, auto-apply secret discount coupons at checkout, and get instant drop alerts.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--db-text-main)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={14} color="#059669" /> Auto-Graph on Store Pages
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={14} color="#059669" /> Auto-Coupon Apply
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={14} color="#059669" /> Real-time Price Drop Alerts
            </span>
          </div>
        </div>

        <div>
          <button
            type="button"
            className="db-btn-clean db-btn-clean-primary"
            style={{
              padding: '0.75rem 1.4rem',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 4px 14px rgba(91, 69, 255, 0.3)'
            }}
            onClick={handleInstallClick}
          >
            <Globe size={18} />
            <span>Add Browser Extension — Free</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExtensionPromo;
