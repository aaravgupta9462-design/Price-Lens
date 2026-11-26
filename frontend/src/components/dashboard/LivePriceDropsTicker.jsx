import React from 'react';
import { Flame, ExternalLink, ArrowRight, TrendingDown, Clock, Sparkles } from 'lucide-react';
import { LIVE_PRICE_DROPS, formatPrice } from '../../data/mockData';
import { useDashboard } from '../../context/DashboardContext';
import StoreLogo from './StoreLogo';

export const LivePriceDropsTicker = () => {
  const { setSelectedProductId, viewPriceComparison, showToast } = useDashboard();

  const handleInspect = (drop) => {
    setSelectedProductId(drop.productId);
    const compEl = document.getElementById('price-comparison-section');
    if (compEl) {
      compEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      viewPriceComparison(drop.productId);
    }
    if (showToast) {
      showToast(`Inspecting live price history for ${drop.product}...`, 'info');
    }
  };

  const handleOpenDirect = (e, url, store) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
    if (showToast) {
      showToast(`Opening deal on ${store}...`, 'info');
    }
  };

  return (
    <section className="pl-live-drops-section" aria-label="Real-Time Price Crashes">
      <div className="pl-live-drops-container">
        {/* Section Header */}
        <div className="pl-section-header-row">
          <div className="pl-section-title-col">
            <div className="pl-section-eyebrow-pill red">
              <Flame size={13} className="pl-eyebrow-flame" />
              <span>LOOT DEALS &bull; FLASH DROPS DETECTED</span>
            </div>
            <h2 className="pl-section-title">Hot price drops right now</h2>
            <p className="pl-section-subtitle">
              Algorithmic price crashes detected across Amazon &amp; Flipkart within the last 2 hours. Verified in stock.
            </p>
          </div>

          <div className="pl-live-count-badge">
            <span className="pl-live-pulse-dot" />
            <span>4 Verified Drops Active</span>
          </div>
        </div>

        {/* Drops Grid */}
        <div className="pl-live-drops-grid">
          {LIVE_PRICE_DROPS.map((drop) => (
            <div
              key={drop.id}
              className="pl-live-drop-card"
              onClick={() => handleInspect(drop)}
            >
              <div className="pl-live-drop-top">
                <StoreLogo store={drop.store} size="sm" />
                <span className="pl-live-time-tag">
                  <Clock size={11} />
                  <span>{drop.timeAgo}</span>
                </span>
              </div>

              <h4 className="pl-live-drop-name" title={drop.product}>
                {drop.product}
              </h4>

              <div className="pl-live-price-group">
                <span className="pl-live-current-price">{formatPrice(drop.newPrice)}</span>
                <span className="pl-live-old-price">{formatPrice(drop.oldPrice)}</span>
                <span className="pl-live-drop-badge">
                  <TrendingDown size={12} />
                  <span>-{drop.dropPercent}%</span>
                </span>
              </div>

              <div className="pl-live-drop-actions">
                <button
                  type="button"
                  className="pl-live-inspect-btn"
                  onClick={() => handleInspect(drop)}
                >
                  <span>Track Graph</span>
                  <ArrowRight size={12} />
                </button>
                <button
                  type="button"
                  className="pl-live-buy-btn"
                  onClick={(e) => handleOpenDirect(e, drop.url, drop.store)}
                  title={`Open deal on ${drop.store}`}
                >
                  <span>Buy</span>
                  <ExternalLink size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LivePriceDropsTicker;
