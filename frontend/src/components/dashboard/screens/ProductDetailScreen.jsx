import React, { useState } from 'react';
import { Star, Scale, ExternalLink, Share2, Heart, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { PRODUCTS, PLATFORM_COMPARISONS, formatPrice } from '../../../data/mockData';
import { useDashboard } from '../../../context/DashboardContext';

const ProductDetailScreen = () => {
  const {
    selectedProductId,
    setSelectedProductId,
    viewPriceComparison,
    openShareModal,
    toggleSaveProduct,
    savedProducts,
    setActiveNav,
  } = useDashboard();

  const [activeTab, setActiveTab] = useState('overview');

  const product =
    PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];
  const platforms =
    PLATFORM_COMPARISONS[product.id] || PLATFORM_COMPARISONS['iphone-16-128'];
  const bestPlatform = platforms.find((p) => p.isBestPrice) || platforms[0];
  const isSaved = savedProducts.some((s) => s.productId === product.id || s.id === product.id);

  const handleOpenStore = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="db-page-fade">
      {/* Back Button */}
      <button
        className="db-btn-clean db-btn-clean-outline"
        style={{ marginBottom: '1.25rem' }}
        onClick={() => setActiveNav('search')}
      >
        <ArrowLeft size={14} /> Back to Search
      </button>

      {/* Main Product Header Card */}
      <div className="db-product-detail-hero">
        <div className="db-pd-image-box" style={{ background: product.bgGradient }}>
          {product.isBestDeal && <span className="db-deal-badge-best">Best Price</span>}
          <span style={{ fontSize: '6rem' }}>{product.emoji}</span>
        </div>

        <div className="db-pd-info-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="db-deal-store">{product.brand} · {product.category}</span>
              <h1 className="db-screen-title" style={{ fontSize: '1.6rem', marginTop: '0.2rem' }}>
                {product.name}
              </h1>
            </div>
            <button
              className={`db-btn-clean db-btn-clean-outline ${isSaved ? 'active' : ''}`}
              onClick={() => toggleSaveProduct(product)}
            >
              <Heart size={14} fill={isSaved ? '#EF4444' : 'none'} color={isSaved ? '#EF4444' : 'currentColor'} />
              <span>{isSaved ? 'Saved to Wishlist' : 'Save Product'}</span>
            </button>
          </div>

          <div className="db-deal-meta" style={{ marginTop: '0.6rem' }}>
            <Star size={15} fill="#F59E0B" color="#F59E0B" />
            <strong style={{ fontSize: '0.95rem', color: 'var(--db-text-main)' }}>{product.rating}</strong>
            <span>· {(product.reviewCount).toLocaleString()} verified ratings</span>
            <span>· <ShieldCheck size={14} style={{ display: 'inline', verticalAlign: '-2px', color: '#16A34A' }} /> {product.storesAvailable} Certified Retailers</span>
          </div>

          <div className="db-pd-prices">
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--db-text-main)' }}>
              {formatPrice(product.currentPrice)}
            </span>
            <span style={{ fontSize: '1rem', color: 'var(--db-text-muted)', textDecoration: 'line-through' }}>
              {formatPrice(product.originalPrice)}
            </span>
            <span className="db-deal-badge-discount" style={{ position: 'static' }}>
              {product.discount}% OFF
            </span>
            <span style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 600 }}>
              (Lowest on {product.store})
            </span>
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--db-text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            {product.description}
          </p>

          <div className="db-pd-actions-row">
            <button
              className="db-btn-clean db-btn-clean-primary"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
              onClick={() => viewPriceComparison(product.id)}
            >
              <Scale size={14} /> Compare All {platforms.length} Stores
            </button>
            <button
              className="db-btn-clean db-btn-clean-outline"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
              onClick={() => handleOpenStore(bestPlatform.url)}
            >
              Visit Store ({bestPlatform.platform}) <ExternalLink size={14} />
            </button>
            <button
              className="db-btn-clean db-btn-clean-icon"
              style={{ width: '40px', height: '40px' }}
              onClick={() =>
                openShareModal({
                  productName: product.name,
                  platform: bestPlatform.platform,
                  url: bestPlatform.url,
                })
              }
              title="Share product link"
            >
              <Share2 size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="db-tabs-container">
        <div className="db-tabs-bar">
          <button
            className={`db-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Store Comparison
          </button>
          <button
            className={`db-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            Specifications
          </button>
          <button
            className={`db-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Trust & Sentiment
          </button>
        </div>

        {/* Tab 1: Store Comparison */}
        {activeTab === 'overview' && (
          <div className="db-card db-card-primary" style={{ padding: '1.25rem' }}>
            <h3 className="db-card-title-sm" style={{ marginBottom: '1rem' }}>
              Where to buy {product.name}
            </h3>

            <div className="db-store-comparison-list">
              {platforms.map((plat) => (
                <div key={plat.platform} className={`db-store-row ${plat.isBestPrice ? 'best' : ''}`}>
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

                  <div className="db-compare-bar-track">
                    <div
                      className={`db-compare-bar-fill ${plat.isBestPrice ? 'best' : ''}`}
                      style={{ width: `${plat.barPercent}%` }}
                    />
                  </div>

                  <div className="db-store-foot">
                    <span>{plat.delivery} · {plat.bankOffer}</span>
                    <div className="db-store-actions">
                      <button
                        className="db-btn-clean db-btn-clean-primary"
                        style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem' }}
                        onClick={() => handleOpenStore(plat.url)}
                      >
                        View Store <ExternalLink size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Specifications */}
        {activeTab === 'specs' && (
          <div className="db-card db-card-primary" style={{ padding: '1.5rem' }}>
            <h3 className="db-card-title-sm" style={{ marginBottom: '1.25rem' }}>
              Technical Specifications
            </h3>
            <div className="db-specs-grid">
              {product.specs &&
                Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="db-spec-row">
                    <span className="db-spec-key">{key}</span>
                    <span className="db-spec-val">{val}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === 'reviews' && (
          <div className="db-card db-card-primary" style={{ padding: '1.5rem' }}>
            <h3 className="db-card-title-sm" style={{ marginBottom: '0.5rem' }}>
              Shopper Sentiment Summary
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--db-text-secondary)', marginBottom: '1.25rem' }}>
              {product.trustNote}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button
                className="db-btn-clean db-btn-clean-primary"
                onClick={() => setActiveNav('reviews')}
              >
                Open Full Review Intelligence →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailScreen;
