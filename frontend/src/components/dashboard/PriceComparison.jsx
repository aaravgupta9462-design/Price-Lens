import React, { useState, useEffect } from 'react';
import { ExternalLink, Share2, Sparkles, Star, Loader2 } from 'lucide-react';
import { PRODUCTS, PLATFORM_COMPARISONS, formatPrice } from '../../data/mockData';
import { useDashboard } from '../../context/DashboardContext';
import { apiService } from '../../services/api';

const PriceComparison = () => {
  const { selectedProductId, setSelectedProductId, openShareModal } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [liveComparison, setLiveComparison] = useState(null);

  const selectedProduct = PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setLiveComparison(null); // Clear previous product comparison to avoid stale state

    apiService
      .compareProduct(selectedProduct.id)
      .then((data) => {
        if (isMounted && data) {
          setLiveComparison(data);
        }
      })
      .catch((err) => {
        console.warn('[PriceComparison] Live compare error, using fallback:', err.message);
        if (isMounted) setLiveComparison(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedProduct.id]);

  const fallbackPlatforms =
    PLATFORM_COMPARISONS[selectedProduct.id] || PLATFORM_COMPARISONS['iphone-16-128'];

  const rawPlatforms = liveComparison?.offers?.length
    ? liveComparison.offers.map((o) => ({
        platform: o.store,
        emoji: o.storeEmoji || '🏬',
        price: o.price,
        rating: o.rating,
        delivery: o.delivery,
        url: o.productUrl,
        isBestPrice: o.isBestPrice,
        isAvailable: o.isAvailable !== false,
        barPercent: o.barPercent
      }))
    : fallbackPlatforms;

  // 1. Identify lowest valid and available offer displayed in UI
  const validAvailablePlatforms = rawPlatforms
    .filter((p) => p.isAvailable !== false && typeof p.price === 'number' && p.price > 0 && !isNaN(p.price))
    .sort((a, b) => a.price - b.price);

  const lowestDisplayedOffer = validAvailablePlatforms[0] || rawPlatforms[0] || {};

  // 2. Best Deal Resolution (Requirements 7, 8, 9):
  let resolvedBestDeal = null;

  if (liveComparison?.bestDeal && liveComparison.bestDeal.store) {
    const backendStore = liveComparison.bestDeal.store;
    const backendPrice = liveComparison.bestDeal.price;
    const matchingPlatform = rawPlatforms.find((p) => p.platform === backendStore);

    if (
      matchingPlatform &&
      matchingPlatform.price === lowestDisplayedOffer.price &&
      matchingPlatform.platform === lowestDisplayedOffer.platform
    ) {
      resolvedBestDeal = {
        ...matchingPlatform,
        platform: backendStore,
        price: backendPrice
      };
    } else {
      console.warn(
        `[PriceComparison] Defensive correction: backend bestDeal (${backendStore} @ ₹${backendPrice}) ` +
        `did not match lowest displayed offer (${lowestDisplayedOffer.platform} @ ₹${lowestDisplayedOffer.price}). ` +
        `Aligning with displayed offer.`
      );
      resolvedBestDeal = lowestDisplayedOffer;
    }
  } else {
    resolvedBestDeal = lowestDisplayedOffer;
  }

  const bestPlatform = resolvedBestDeal || {};

  // 3. Synchronize isBestPrice on all displayed platforms
  const platforms = rawPlatforms.map((plat) => ({
    ...plat,
    isBestPrice: Boolean(
      bestPlatform.platform &&
      plat.platform === bestPlatform.platform &&
      plat.price === bestPlatform.price
    )
  }));

  const highestPrice = platforms.length > 0 ? Math.max(...platforms.map((p) => p.price)) : 0;
  const maxSavings = Math.max(0, highestPrice - (bestPlatform.price || 0));

  const handleOpenStore = (url) => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
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

      {loading ? (
        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--db-text-secondary)' }}>
          <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem', color: '#2563EB' }} />
          <span style={{ fontSize: '0.85rem' }}>Querying store adapters...</span>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default PriceComparison;
