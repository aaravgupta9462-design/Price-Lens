import React from 'react';
import { Zap, ExternalLink } from 'lucide-react';
import { LIVE_PRICE_DROPS, formatPrice } from '../../data/mockData';
import { useDashboard } from '../../context/DashboardContext';

const LivePriceDropsTicker = () => {
  const { setSelectedProductId, viewPriceComparison } = useDashboard();

  const handleInspect = (drop) => {
    setSelectedProductId(drop.productId);
    const compEl = document.getElementById('price-comparison-section');
    if (compEl) {
      compEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      viewPriceComparison(drop.productId);
    }
  };

  const handleOpenDirect = (e, url) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="db-card db-card-primary" style={{ padding: '1.25rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#DC2626'
          }}>
            <Zap size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 className="db-card-title-sm" style={{ margin: 0 }}>Hot Price Drops Right Now</h3>
              <span className="db-mode-badge-live" style={{ background: '#DC2626', color: '#fff' }}>LIVE</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--db-text-secondary)', margin: '2px 0 0 0' }}>
              Real-time discounts detected on Amazon &amp; Flipkart within the last 2 hours
            </p>
          </div>
        </div>

        <span style={{ fontSize: '0.78rem', color: 'var(--db-primary)', fontWeight: 600 }}>
          ⚡ 4 Verified Drops Active
        </span>
      </div>

      <div className="db-hot-drops-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '0.85rem'
      }}>
        {LIVE_PRICE_DROPS.map((drop) => (
          <div
            key={drop.id}
            onClick={() => handleInspect(drop)}
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              border: '1px solid var(--db-border)',
              background: 'var(--db-surface-card)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}
            className="db-hot-drop-item"
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '20px',
                  background: 'rgba(5, 150, 105, 0.1)',
                  color: '#059669'
                }}>
                  {drop.storeLogo} {drop.store}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--db-text-muted)' }}>
                  {drop.timeAgo}
                </span>
              </div>

              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--db-text-main)', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                {drop.product}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--db-text-main)' }}>
                  {formatPrice(drop.newPrice)}
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--db-text-muted)', textDecoration: 'line-through' }}>
                  {formatPrice(drop.oldPrice)}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#DC2626' }}>
                  -{drop.dropPercent}% Drop
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
              <button
                type="button"
                className="db-btn-clean db-btn-clean-primary"
                style={{ flex: 1, fontSize: '0.75rem', padding: '0.35rem 0.6rem' }}
                onClick={() => handleInspect(drop)}
              >
                Track History
              </button>
              <button
                type="button"
                className="db-btn-clean db-btn-clean-outline"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }}
                onClick={(e) => handleOpenDirect(e, drop.url)}
                title={`Buy on ${drop.store}`}
              >
                Buy Now <ExternalLink size={11} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LivePriceDropsTicker;
