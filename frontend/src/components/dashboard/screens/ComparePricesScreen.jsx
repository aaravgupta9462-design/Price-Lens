import React from 'react';
import { ExternalLink, Share2, Sparkles, Star, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { PRODUCTS, PLATFORM_COMPARISONS, formatPrice } from '../../../data/mockData';
import { useDashboard } from '../../../context/DashboardContext';

const ComparePricesScreen = () => {
  const {
    selectedProductId,
    setSelectedProductId,
    openShareModal,
    toggleSaveProduct,
    savedProducts,
  } = useDashboard();

  const currentProduct =
    PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];
  const platforms =
    PLATFORM_COMPARISONS[currentProduct.id] || PLATFORM_COMPARISONS['iphone-16-128'];

  const bestPlatform = platforms.find((p) => p.isBestPrice) || platforms[0];
  const highestPrice = Math.max(...platforms.map((p) => p.price));
  const maxSavings = highestPrice - bestPlatform.price;

  const isSaved = savedProducts.some(
    (s) => s.productId === currentProduct.id || s.id === currentProduct.id
  );

  const handleOpenStore = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="db-page-fade">
      <div className="db-screen-header">
        <h1 className="db-screen-title">Compare Prices</h1>
        <p className="db-screen-subtitle">
          See the difference before you choose a store. Transparent pricing across verified retailers.
        </p>
      </div>

      {/* Product Selector Carousel / Pills */}
      <div className="db-selector-scroll-wrap">
        <span className="db-selector-label">Select Product:</span>
        <div className="db-selector-scroll-list">
          {PRODUCTS.map((prod) => (
            <button
              key={prod.id}
              className={`db-selector-pill ${prod.id === currentProduct.id ? 'active' : ''}`}
              onClick={() => setSelectedProductId(prod.id)}
            >
              <span>{prod.emoji}</span>
              <span>{prod.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Large Product Information Panel */}
      <div className="db-compare-hero-panel">
        <div className="db-compare-hero-visual" style={{ background: currentProduct.bgGradient }}>
          <span style={{ fontSize: '4.5rem' }}>{currentProduct.emoji}</span>
        </div>

        <div className="db-compare-hero-info">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="db-deal-store">{currentProduct.brand} · {currentProduct.category}</span>
              <h2 className="db-compare-hero-title">{currentProduct.name}</h2>
            </div>
            <button
              className={`db-btn-clean db-btn-clean-outline ${isSaved ? 'active' : ''}`}
              onClick={() => toggleSaveProduct(currentProduct)}
            >
              <Heart size={14} fill={isSaved ? '#EF4444' : 'none'} color={isSaved ? '#EF4444' : 'currentColor'} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>

          <div className="db-deal-meta" style={{ marginTop: '0.4rem' }}>
            <Star size={14} fill="#F59E0B" color="#F59E0B" />
            <strong style={{ color: 'var(--db-text-main)', fontSize: '0.9rem' }}>{currentProduct.rating}</strong>
            <span>· {(currentProduct.reviewCount).toLocaleString()} verified reviews</span>
            <span>· <ShieldCheck size={13} style={{ display: 'inline', verticalAlign: '-1px', color: '#16A34A' }} /> {currentProduct.storesAvailable} Stores Checked</span>
          </div>

          <p className="db-compare-hero-desc">{currentProduct.description}</p>

          <div className="db-compare-savings-banner">
            <div>
              <div className="db-cs-label">Lowest Price Found</div>
              <div className="db-cs-val" style={{ color: '#16A34A' }}>
                {formatPrice(bestPlatform.price)} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>on {bestPlatform.platform}</span>
              </div>
            </div>

            {maxSavings > 0 && (
              <div style={{ textAlign: 'right' }}>
                <div className="db-cs-label">Potential Store Savings</div>
                <div className="db-cs-val" style={{ color: '#16A34A' }}>
                  Save up to {formatPrice(maxSavings)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visual Price Comparison Horizontal Bars */}
      <div className="db-card db-card-primary" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 className="db-card-title-sm" style={{ marginBottom: '1.25rem' }}>
          Price Spread & Retailer Index
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {platforms.map((plat) => (
            <div key={plat.platform} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>{plat.emoji}</span>
                  <span>{plat.platform}</span>
                  {plat.isBestPrice && (
                    <span className="db-deal-badge-best" style={{ position: 'static' }}>
                      BEST PRICE
                    </span>
                  )}
                </span>
                <span style={{ fontWeight: 700, color: plat.isBestPrice ? '#16A34A' : 'var(--db-text-main)' }}>
                  {formatPrice(plat.price)}
                </span>
              </div>

              <div className="db-compare-bar-track" style={{ height: '8px' }}>
                <div
                  className={`db-compare-bar-fill ${plat.isBestPrice ? 'best' : ''}`}
                  style={{ width: `${plat.barPercent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Multi-Store Comparison Table */}
      <div className="db-card db-card-primary" style={{ overflow: 'hidden' }}>
        <div className="db-card-header-clean">
          <h3 className="db-card-title-sm">Direct Store Comparisons</h3>
          <span className="db-badge-soft-blue">{platforms.length} retailers available</span>
        </div>

        <div className="db-table-responsive">
          <table className="db-full-table">
            <thead>
              <tr>
                <th>Store</th>
                <th>Price & Discount</th>
                <th>Rating</th>
                <th>Availability</th>
                <th>Bank Offer / Perks</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {platforms.map((plat) => {
                const diffFromBest = plat.price - bestPlatform.price;
                return (
                  <tr key={plat.platform} className={plat.isBestPrice ? 'db-table-row-best' : ''}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '1.3rem' }}>{plat.emoji}</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{plat.platform}</div>
                          {plat.isBestPrice && (
                            <span className="db-deal-badge-best" style={{ position: 'static', marginTop: '2px' }}>
                              Lowest Price
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: plat.isBestPrice ? '#16A34A' : 'var(--db-text-main)' }}>
                        {formatPrice(plat.price)}
                      </div>
                      {diffFromBest > 0 ? (
                        <div style={{ fontSize: '0.72rem', color: 'var(--db-text-muted)' }}>
                          +{formatPrice(diffFromBest)} difference
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 600 }}>
                          -{plat.discount}% off MSRP
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
                        <Star size={13} fill="#F59E0B" color="#F59E0B" />
                        <strong>{plat.rating}</strong>
                        <span style={{ color: 'var(--db-text-muted)', fontSize: '0.75rem' }}>({plat.reviewCount})</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
                        <span
                          style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            background: plat.stock === 'In Stock' ? '#16A34A' : '#F59E0B',
                          }}
                        />
                        <span>{plat.stock}</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--db-text-muted)' }}>
                        {plat.delivery}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78rem', color: 'var(--db-text-secondary)' }}>
                        {plat.bankOffer}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          className="db-btn-clean db-btn-clean-primary"
                          onClick={() => handleOpenStore(plat.url)}
                        >
                          View Product <ExternalLink size={12} />
                        </button>
                        <button
                          className="db-btn-clean db-btn-clean-icon"
                          onClick={() =>
                            openShareModal({
                              productName: currentProduct.name,
                              platform: plat.platform,
                              url: plat.url,
                            })
                          }
                          title="Share link"
                        >
                          <Share2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparePricesScreen;
