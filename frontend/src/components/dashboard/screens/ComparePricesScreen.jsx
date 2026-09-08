import React, { useState, useEffect, useCallback } from 'react';
import {
  ExternalLink,
  Share2,
  Sparkles,
  Star,
  CheckCircle2,
  ShieldCheck,
  Heart,
  Search,
  RefreshCw,
  AlertCircle,
  Loader2,
  TrendingDown
} from 'lucide-react';
import { PRODUCTS, PLATFORM_COMPARISONS, formatPrice } from '../../../data/mockData';
import { useDashboard } from '../../../context/DashboardContext';
import { apiService } from '../../../services/api';

const ComparePricesScreen = () => {
  const {
    selectedProductId,
    setSelectedProductId,
    openShareModal,
    toggleSaveProduct,
    savedProducts,
    searchQuery,
    setSearchQuery,
    viewPriceHistory
  } = useDashboard();

  const [searchInput, setSearchInput] = useState(searchQuery || '');
  const [activeQuery, setActiveQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [liveComparison, setLiveComparison] = useState(null);

  // Maintain consistent canonical product identity
  const resolvedProductId = liveComparison?.productId || selectedProductId;
  const currentProduct =
    PRODUCTS.find((p) => p.id === resolvedProductId) ||
    PRODUCTS.find((p) => p.id === selectedProductId) ||
    PRODUCTS[0];

  // Fetch comparison from backend API
  const fetchComparison = useCallback(async (productId, query) => {
    setLoading(true);
    setError(null);

    try {
      let data;
      if (query && query.trim().length >= 2) {
        data = await apiService.compareQuery(query.trim());
      } else {
        data = await apiService.compareProduct(productId);
      }
      setLiveComparison(data);
    } catch (err) {
      console.warn('[ComparePricesScreen] API failed, falling back to local data:', err.message);
      setError('Could not connect to live store comparison backend. Displaying cached data.');
      setLiveComparison(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Trigger fetch whenever selectedProductId or activeQuery changes
  useEffect(() => {
    fetchComparison(selectedProductId, activeQuery);
  }, [selectedProductId, activeQuery, fetchComparison]);

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim().length >= 2) {
      setActiveQuery(searchInput.trim());
      setSearchQuery(searchInput.trim());
    } else if (searchInput.trim().length === 0) {
      setActiveQuery('');
    }
  };

  // Derive platforms / offers list from live API or fallback
  const fallbackPlatforms =
    PLATFORM_COMPARISONS[currentProduct.id] || PLATFORM_COMPARISONS['iphone-16-128'] || [];

  const platforms = liveComparison?.offers?.length
    ? liveComparison.offers.map((offer) => ({
        platform: offer.store,
        emoji: offer.storeEmoji || '🏬',
        price: offer.price,
        originalPrice: offer.originalPrice,
        discount: offer.discount,
        rating: offer.rating,
        reviewCount: offer.reviewCount,
        stock: offer.availability,
        delivery: offer.delivery,
        bankOffer: offer.bankOffer || 'Bank discount available at checkout',
        url: offer.productUrl,
        isBestPrice: offer.isBestPrice,
        isAvailable: offer.isAvailable !== false,
        barPercent: offer.barPercent,
        isDevelopmentProvider: offer.isDevelopmentProvider,
        productId: offer.productId || resolvedProductId
      }))
    : fallbackPlatforms.map((p) => ({ ...p, isAvailable: true }));

  const bestPlatform =
    (liveComparison?.bestDeal
      ? platforms.find((p) => p.platform === liveComparison.bestDeal.store)
      : null) ||
    platforms.find((p) => p.isBestPrice) ||
    platforms.find((p) => p.isAvailable) ||
    platforms[0] ||
    {};
  const highestPrice = platforms.length > 0 ? Math.max(...platforms.map((p) => p.price)) : 0;
  const maxSavings = highestPrice - (bestPlatform.price || 0);

  const isSaved = savedProducts.some(
    (s) => s.productId === currentProduct.id || s.id === currentProduct.id
  );

  const handleOpenStore = (url) => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="db-page-fade">
      {/* Screen Header */}
      <div className="db-screen-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="db-screen-title">Compare Prices</h1>
            <p className="db-screen-subtitle">
              Multi-store price comparisons across Amazon, Flipkart, Croma, and Reliance Digital.
            </p>
          </div>

          {/* Search Input Bar for On-the-fly Multi-Store Comparison */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', minWidth: '320px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--db-text-muted)' }}
              />
              <input
                type="text"
                className="db-search-input"
                style={{ paddingLeft: '2.2rem', width: '100%', height: '40px', fontSize: '0.85rem' }}
                placeholder="Search any product or model..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <button type="submit" className="db-btn-clean db-btn-clean-primary" style={{ height: '40px', padding: '0 1rem' }}>
              Compare
            </button>
          </form>
        </div>
      </div>

      {/* Product Selector Carousel / Pills */}
      <div className="db-selector-scroll-wrap">
        <span className="db-selector-label">Quick Select:</span>
        <div className="db-selector-scroll-list">
          {PRODUCTS.map((prod) => (
            <button
              key={prod.id}
              className={`db-selector-pill ${prod.id === currentProduct.id && !activeQuery ? 'active' : ''}`}
              onClick={() => {
                setActiveQuery('');
                setSearchInput('');
                setSelectedProductId(prod.id);
              }}
            >
              <span>{prod.emoji}</span>
              <span>{prod.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error / Fallback Notice Banner */}
      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1.25rem',
            marginBottom: '1.25rem',
            borderRadius: '10px',
            background: '#FEF3C7',
            border: '1px solid #FDE68A',
            color: '#92400E',
            fontSize: '0.85rem'
          }}
        >
          <AlertCircle size={17} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1 }}>{error}</span>
          <button
            className="db-btn-clean"
            style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: '#F59E0B', color: '#fff', borderRadius: '6px' }}
            onClick={() => fetchComparison(selectedProductId, activeQuery)}
          >
            <RefreshCw size={12} style={{ display: 'inline', marginRight: '4px' }} /> Retry
          </button>
        </div>
      )}

      {/* Partial Store Provider Failure Warning */}
      {!loading && liveComparison?.failedStores?.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1.25rem',
            marginBottom: '1.25rem',
            borderRadius: '10px',
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#991B1B',
            fontSize: '0.85rem'
          }}
        >
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1 }}>
            Store provider unavailable: {liveComparison.failedStores.map((f) => `${f.store} (${f.error || 'Connection failed'})`).join(', ')}. Showing results from responding retailers.
          </span>
        </div>
      )}

      {/* Loading Skeleton Indicator */}
      {loading ? (
        <div className="db-card db-card-primary" style={{ padding: '3rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#2563EB' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--db-text-main)' }}>
            Querying Store Adapters...
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--db-text-secondary)', marginTop: '0.35rem' }}>
            Fetching offers from Amazon, Flipkart, Croma, and Reliance Digital.
          </p>
        </div>
      ) : platforms.length === 0 ? (
        /* Empty State */
        <div className="db-card db-card-primary" style={{ padding: '3rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔍</div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--db-text-main)' }}>
            No matching store offers found
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--db-text-secondary)', marginTop: '0.4rem', maxWidth: '400px', margin: '0.4rem auto 1.25rem' }}>
            We couldn't locate any matching deals for "{activeQuery}". Try searching with a different product name or select from the quick list.
          </p>
          <button
            className="db-btn-clean db-btn-clean-primary"
            onClick={() => {
              setActiveQuery('');
              setSearchInput('');
              setSelectedProductId('iphone-16-128');
            }}
          >
            Reset to Popular Products
          </button>
        </div>
      ) : (
        <>
          {/* Large Product Information Panel */}
          <div className="db-compare-hero-panel">
            <div className="db-compare-hero-visual" style={{ background: currentProduct.bgGradient }}>
              <span style={{ fontSize: '4.5rem' }}>{currentProduct.emoji}</span>
            </div>

            <div className="db-compare-hero-info">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="db-deal-store">
                    {activeQuery ? `Search: "${activeQuery}"` : `${currentProduct.brand} · ${currentProduct.category}`}
                  </span>
                  <h2 className="db-compare-hero-title">
                    {activeQuery ? (liveComparison?.offers?.[0]?.title || activeQuery) : currentProduct.name}
                  </h2>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    className={`db-btn-clean db-btn-clean-outline ${isSaved ? 'active' : ''}`}
                    onClick={() => toggleSaveProduct(currentProduct)}
                  >
                    <Heart size={14} fill={isSaved ? '#EF4444' : 'none'} color={isSaved ? '#EF4444' : 'currentColor'} />
                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                  </button>
                  <button
                    className="db-btn-clean db-btn-clean-outline"
                    onClick={() => viewPriceHistory(currentProduct.id)}
                    title="View Price History"
                  >
                    <TrendingDown size={14} />
                    <span>Price History</span>
                  </button>
                </div>
              </div>

              <div className="db-deal-meta" style={{ marginTop: '0.4rem' }}>
                <Star size={14} fill="#F59E0B" color="#F59E0B" />
                <strong style={{ color: 'var(--db-text-main)', fontSize: '0.9rem' }}>
                  {bestPlatform.rating || currentProduct.rating}
                </strong>
                <span>· {(bestPlatform.reviewCount || currentProduct.reviewCount).toLocaleString()} verified reviews</span>
                <span>
                  · <ShieldCheck size={13} style={{ display: 'inline', verticalAlign: '-1px', color: '#16A34A' }} />{' '}
                  {platforms.length} Stores Checked
                </span>
                {liveComparison?.latencyMs && (
                  <span style={{ color: 'var(--db-text-muted)', fontSize: '0.75rem' }}>
                    ({liveComparison.latencyMs}ms)
                  </span>
                )}
              </div>

              <p className="db-compare-hero-desc">
                {activeQuery
                  ? `Comparing best prices, shipping options, and bank discounts across certified Indian retailers.`
                  : currentProduct.description}
              </p>

              <div className="db-compare-savings-banner">
                <div>
                  <div className="db-cs-label">Lowest Price Found</div>
                  <div className="db-cs-val" style={{ color: '#16A34A' }}>
                    {formatPrice(bestPlatform.price)}{' '}
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>on {bestPlatform.platform}</span>
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
                      {plat.isDevelopmentProvider !== false && (
                        <span style={{ fontSize: '0.68rem', fontWeight: 500, color: 'var(--db-text-muted)' }}>
                          (Dev)
                        </span>
                      )}
                      {plat.isBestPrice && (
                        <span className="db-deal-badge-best" style={{ position: 'static' }}>
                          BEST DEAL
                        </span>
                      )}
                      {!plat.isAvailable && (
                        <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px', background: '#FEE2E2', color: '#991B1B', fontWeight: 600 }}>
                          Out of Stock
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
                      style={{ width: `${plat.barPercent || 65}%` }}
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
                    <th>Price &amp; Discount</th>
                    <th>Rating</th>
                    <th>Availability</th>
                    <th>Bank Offer / Perks</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {platforms.map((plat) => {
                    const diffFromBest = plat.price - (bestPlatform.price || 0);
                    return (
                      <tr key={plat.platform} className={plat.isBestPrice ? 'db-table-row-best' : ''}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <span style={{ fontSize: '1.3rem' }}>{plat.emoji}</span>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <span>{plat.platform}</span>
                                {plat.isDevelopmentProvider !== false && (
                                  <span style={{ fontSize: '0.68rem', fontWeight: 500, color: 'var(--db-text-muted)' }}>
                                    (Dev Provider)
                                  </span>
                                )}
                              </div>
                              {plat.isBestPrice && (
                                <span className="db-deal-badge-best" style={{ position: 'static', marginTop: '2px' }}>
                                  Best Deal
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div
                            style={{
                              fontSize: '1.05rem',
                              fontWeight: 800,
                              color: plat.isBestPrice ? '#16A34A' : 'var(--db-text-main)',
                            }}
                          >
                            {formatPrice(plat.price)}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', marginTop: '2px' }}>
                            {plat.originalPrice > plat.price && (
                              <span style={{ textDecoration: 'line-through', color: 'var(--db-text-muted)' }}>
                                {formatPrice(plat.originalPrice)}
                              </span>
                            )}
                            {plat.discount > 0 && (
                              <span style={{ color: '#16A34A', fontWeight: 600 }}>
                                {plat.discount}% off
                              </span>
                            )}
                            {diffFromBest > 0 && (
                              <span style={{ color: 'var(--db-text-muted)' }}>
                                (+{formatPrice(diffFromBest)})
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
                            <Star size={13} fill="#F59E0B" color="#F59E0B" />
                            <strong>{plat.rating}</strong>
                            <span style={{ color: 'var(--db-text-muted)', fontSize: '0.75rem' }}>
                              ({(plat.reviewCount || 0).toLocaleString()})
                            </span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
                            <span
                              style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                background: plat.isAvailable && plat.stock?.toLowerCase().includes('in stock') ? '#16A34A' : '#EF4444',
                              }}
                            />
                            <span style={{ fontWeight: plat.isAvailable ? 500 : 700, color: plat.isAvailable ? 'inherit' : '#DC2626' }}>
                              {plat.isAvailable ? plat.stock : 'Out of Stock'}
                            </span>
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
                              disabled={plat.isAvailable === false}
                              style={plat.isAvailable === false ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                              onClick={() => handleOpenStore(plat.url)}
                            >
                              {plat.isAvailable === false ? (
                                'Out of Stock'
                              ) : (
                                <>View Deal <ExternalLink size={12} /></>
                              )}
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

            <div style={{ padding: '0.75rem 1.25rem', background: '#F8FAFC', borderTop: '1px solid var(--db-border-clean)', fontSize: '0.75rem', color: 'var(--db-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="#2563EB" />
              <span>Prices and store availability reflect tracked store provider snapshots across sales cycles.</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ComparePricesScreen;
