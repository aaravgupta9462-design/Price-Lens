import React from 'react';
import { ExternalLink, Share2, Sparkles, Star } from 'lucide-react';
import { PRODUCTS, PLATFORM_COMPARISONS, formatPrice } from '../../data/mockData';
import { useDashboard } from '../../context/DashboardContext';

const PriceComparison = () => {
  const { selectedProductId, setSelectedProductId, openShareModal } = useDashboard();

  const selectedProduct = PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];
  const platforms = PLATFORM_COMPARISONS[selectedProduct.id] || PLATFORM_COMPARISONS['iphone-16-128'];

  const bestPlatform = platforms.find((p) => p.isBestPrice) || platforms[0];
  const highestPrice = Math.max(...platforms.map((p) => p.price));
  const maxSavings = highestPrice - bestPlatform.price;

  const handleOpenStore = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = (plat) => {
    openShareModal({
      productName: selectedProduct.name,
      platform: plat.platform,
      url: plat.url,
    });
  };

  return (
    <div className="db-compare-card" id="price-comparison-section">
      <div className="db-section-head" style={{ marginBottom: '0.75rem' }}>
        <div>
          <h2 className="db-section-title-clean">Where should you buy?</h2>
          <p className="db-section-subtitle-clean">
            Live comparison for <strong>{selectedProduct.name}</strong>
          </p>
        </div>
      </div>

      <div className="db-compare-selector-row">
        {PRODUCTS.map((prod) => (
          <button
            key={prod.id}
            className={`db-selector-pill ${prod.id === selectedProduct.id ? 'active' : ''}`}
            onClick={() => setSelectedProductId(prod.id)}
          >
            {prod.emoji} {prod.name}
          </button>
        ))}
      </div>

      {maxSavings > 0 && (
        <div className="db-compare-saving-callout">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#15803D' }}>
            <Sparkles size={14} />
            <span>
              Best deal on <strong>{bestPlatform.platform}</strong>
            </span>
          </span>
          <span style={{ fontWeight: 700, color: '#15803D' }}>
            Save {formatPrice(maxSavings)}
          </span>
        </div>
      )}

      <div className="db-store-comparison-list">
        {platforms.map((plat) => {
          return (
            <div
              key={plat.platform}
              className={`db-store-row ${plat.isBestPrice ? 'best' : ''}`}
            >
              <div className="db-store-top">
                <div className="db-store-info">
                  <span className="db-store-emoji">{plat.emoji}</span>
                  <div>
                    <span className="db-store-name">{plat.platform}</span>
                    {plat.isBestPrice && (
                      <span className="db-store-best-badge" style={{ marginLeft: '0.4rem' }}>
                        BEST PRICE
                      </span>
                    )}
                  </div>
                </div>
                <div className={`db-store-price ${plat.isBestPrice ? 'best' : ''}`}>
                  {formatPrice(plat.price)}
                </div>
              </div>

              {/* Horizontal Comparison Bar */}
              <div className="db-compare-bar-track">
                <div
                  className={`db-compare-bar-fill ${plat.isBestPrice ? 'best' : ''}`}
                  style={{ width: `${plat.barPercent}%` }}
                />
              </div>

              <div className="db-store-foot">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#F59E0B' }}>
                    <Star size={12} fill="#F59E0B" /> {plat.rating}
                  </span>
                  <span>· {plat.delivery}</span>
                </div>

                <div className="db-store-actions">
                  <button
                    className="db-btn-clean db-btn-clean-primary"
                    style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem' }}
                    onClick={() => handleOpenStore(plat.url)}
                  >
                    View Product <ExternalLink size={11} />
                  </button>
                  <button
                    className="db-btn-clean db-btn-clean-icon"
                    style={{ width: '26px', height: '26px' }}
                    onClick={() => handleShare(plat)}
                    title="Share link"
                    aria-label="Share link"
                  >
                    <Share2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PriceComparison;
