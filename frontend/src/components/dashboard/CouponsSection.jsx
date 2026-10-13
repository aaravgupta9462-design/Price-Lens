import React, { useState } from 'react';
import { Tag, Copy, Check, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { VERIFIED_COUPONS } from '../../data/mockData';
import { useDashboard } from '../../context/DashboardContext';

const CouponsSection = () => {
  const { showToast } = useDashboard();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (coupon) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(coupon.code);
    }
    setCopiedId(coupon.id);
    if (showToast) {
      showToast(`Coupon code ${coupon.code} copied for ${coupon.store}!`, 'success');
    }
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  const handleVisitStore = (store) => {
    const urls = {
      Flipkart: 'https://www.flipkart.com',
      Amazon: 'https://www.amazon.in',
      Croma: 'https://www.croma.com',
      'Reliance Digital': 'https://www.reliancedigital.in',
    };
    window.open(urls[store] || 'https://www.flipkart.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="db-card db-card-primary" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(91, 69, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--db-primary)'
          }}>
            <Tag size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 className="db-card-title-sm" style={{ margin: 0 }}>Verified Store Coupons &amp; Bank Offers</h3>
              <span className="db-mode-badge-live" style={{ background: '#059669', color: '#fff' }}>TESTED TODAY</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--db-text-secondary)', margin: '2px 0 0 0' }}>
              Auto-tested promo codes for Flipkart, Amazon, Croma &amp; Reliance Digital
            </p>
          </div>
        </div>

        <span style={{ fontSize: '0.78rem', color: 'var(--db-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={14} color="#059669" /> 100% Working Guaranteed
        </span>
      </div>

      <div className="db-coupons-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '0.85rem'
      }}>
        {VERIFIED_COUPONS.map((coupon) => {
          const isCopied = copiedId === coupon.id;
          return (
            <div
              key={coupon.id}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                border: '1px dashed var(--db-border-strong)',
                background: 'var(--db-surface-card)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
              className="db-coupon-box"
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--db-text-main)' }}>
                    {coupon.logo} {coupon.store}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>
                    {coupon.expiry}
                  </span>
                </div>

                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--db-text-main)', marginBottom: '0.2rem' }}>
                  {coupon.discount}
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--db-text-secondary)', marginBottom: '0.75rem' }}>
                  Min Order: {coupon.minOrder} · {coupon.category}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <div
                  style={{
                    flex: 1,
                    padding: '0.4rem 0.6rem',
                    borderRadius: '6px',
                    background: 'rgba(91, 69, 255, 0.07)',
                    border: '1px solid rgba(91, 69, 255, 0.2)',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    color: 'var(--db-primary)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{coupon.code}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(coupon)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: isCopied ? '#059669' : 'var(--db-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 0
                    }}
                    title="Copy promo code"
                  >
                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>

                <button
                  type="button"
                  className="db-btn-clean db-btn-clean-outline"
                  style={{ fontSize: '0.72rem', padding: '0.4rem 0.6rem' }}
                  onClick={() => handleVisitStore(coupon.store)}
                  title={`Open ${coupon.store}`}
                >
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CouponsSection;
