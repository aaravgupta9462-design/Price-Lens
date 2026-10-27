import React, { useState, useEffect, useCallback } from 'react';
import {
  ExternalLink,
  Share2,
  Sparkles,
  Star,
  ShieldCheck,
  Heart,
  Search,
  RefreshCw,
  AlertCircle,
  AlertTriangle,
  Loader2,
  TrendingDown,
  Bell,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { PRODUCTS, formatPrice } from '../../../data/mockData';
import { useDashboard } from '../../../context/DashboardContext';
import { searchCompare } from '../../../services/compareApi';

const ComparePricesScreen = () => {
  const {
    openShareModal,
    openCreateAlertModal,
    searchQuery,
    setSearchQuery,
    viewPriceHistory
  } = useDashboard();

  const [searchInput, setSearchInput] = useState(searchQuery || '');
  const [activeQuery, setActiveQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [liveComparison, setLiveComparison] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Execute live comparison search (strictly triggered on Enter or Button Click)
  const executeSearch = useCallback(async (query) => {
    const cleanQuery = String(query || '').trim();
    if (cleanQuery.length < 2) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);
    setActiveQuery(cleanQuery);

    try {
      const data = await searchCompare(cleanQuery);
      setLiveComparison(data);
    } catch (err) {
      console.warn('[ComparePricesScreen] Live search failed:', err.message);
      // Requirement 6: Display clear failure notice; do NOT silently fall back to mock data
      setError(err.message || 'Live data nahi mila');
      setLiveComparison(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Form submit handler (triggers only on form submission - Enter or button click)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim().length >= 2) {
      setSearchQuery(searchInput.trim());
      executeSearch(searchInput.trim());
    }
  };

  // If searchQuery was provided externally (e.g. from Hero or nav), run search once
  useEffect(() => {
    if (searchQuery && searchQuery.trim().length >= 2 && searchQuery !== activeQuery) {
      setSearchInput(searchQuery.trim());
      executeSearch(searchQuery.trim());
    }
  }, [searchQuery, activeQuery, executeSearch]);

  const offers = liveComparison?.offers || [];
  const minPrice = offers.length > 0 ? Math.min(...offers.map((o) => Number(o.price) || Infinity)) : 0;
  const bestDeal = liveComparison?.bestDeal || (offers.find((o) => o.price === minPrice) || offers[0]);
  const highestPrice = offers.length > 0 ? Math.max(...offers.map((o) => Number(o.price) || 0)) : 0;
  const maxSavings = highestPrice > minPrice ? highestPrice - minPrice : 0;

  return (
    <div className="db-page-fade">
      {/* ─── Screen Header ─────────────────────────────────────────────────── */}
      <div className="db-screen-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="db-screen-title">Compare Prices</h1>
            <p className="db-screen-subtitle">
              Live multi-store price comparisons across Amazon, Flipkart, Croma, and verified Indian retailers.
            </p>
          </div>

          {/* Search Input Bar (Submits only on Enter or Button Click - No keystroke API calls) */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', minWidth: '320px', flex: '1 1 360px', maxWidth: '520px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--db-text-muted)' }}
              />
              <input
                type="text"
                className="db-search-input"
                style={{ paddingLeft: '2.2rem', width: '100%', height: '42px', fontSize: '0.88rem' }}
                placeholder="Search any product (e.g. iphone 15, macbook air)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="db-btn-clean db-btn-clean-primary"
              style={{ height: '42px', padding: '0 1.25rem', whiteSpace: 'nowrap' }}
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : 'Compare'}
            </button>
          </form>
        </div>
      </div>

      {/* ─── Low Confidence Warning Banner ─────────────────────────────────── */}
      {liveComparison?.lowConfidence && (
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
            fontSize: '0.86rem'
          }}
        >
          <AlertTriangle size={18} style={{ flexShrink: 0, color: '#D97706' }} />
          <div style={{ flex: 1, fontWeight: 600 }}>
            {liveComparison.confidenceMessage || 'Kam reliable results mile'}
          </div>
        </div>
      )}

      {/* ─── Error Notice (Friendly Hinglish / English - No silent mock fallback) ─── */}
      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            padding: '1rem 1.25rem',
            marginBottom: '1.25rem',
            borderRadius: '10px',
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#991B1B',
            fontSize: '0.88rem'
          }}
        >
          <AlertCircle size={20} style={{ flexShrink: 0, color: '#DC2626' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.94rem', marginBottom: '0.15rem' }}>
              Live prices abhi available nahi hain
            </div>
            <div style={{ fontSize: '0.84rem', color: '#7F1D1D' }}>
              Server se connect nahi ho pa raha hai. Kripya thodi der baad dobara koshish karein ya connection check karein.
            </div>
          </div>
          <button
            className="db-btn-clean"
            style={{
              fontSize: '0.78rem',
              padding: '0.35rem 0.8rem',
              background: '#DC2626',
              color: '#FFFFFF',
              borderRadius: '6px'
            }}
            onClick={() => executeSearch(activeQuery || searchInput)}
          >
            <RefreshCw size={13} style={{ display: 'inline', marginRight: '4px' }} /> Retry
          </button>
        </div>
      )}

      {/* ─── Loading State ─────────────────────────────────────────────────── */}
      {loading ? (
        <div className="db-card db-card-primary" style={{ padding: '3.5rem 2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#2563EB' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--db-text-main)' }}>
            Stores se live prices fetch kar rahe hain...
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--db-text-secondary)', marginTop: '0.4rem' }}>
            "{activeQuery}" ke best offers dhoondhe ja rahe hain across Indian stores.
          </p>
        </div>
      ) : !hasSearched ? (
        /* ─── Initial State (Before First Search) ─────────────────────────── */
        <div className="db-card db-card-primary" style={{ padding: '3rem 2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.6rem' }}>⚖️</div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--db-text-main)' }}>
            Real-Time Multi-Store Price Comparison
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--db-text-secondary)', marginTop: '0.35rem', maxWidth: '460px', margin: '0.35rem auto 1.25rem' }}>
            Kisi bhi product ka naam search bar mein enter karein aur live prices compare karein.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['iphone 15', 'macbook air m3', 'sony xm5'].map((example) => (
              <button
                key={example}
                type="button"
                className="db-selector-pill"
                onClick={() => {
                  setSearchInput(example);
                  setSearchQuery(example);
                  executeSearch(example);
                }}
              >
                🔍 {example}
              </button>
            ))}
          </div>
        </div>
      ) : offers.length === 0 ? (
        /* ─── Empty Results State ─────────────────────────────────────────── */
        <div className="db-card db-card-primary" style={{ padding: '3.5rem 2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.6rem' }}>🔍</div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--db-text-main)' }}>
            Koi offers nahi mile
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--db-text-secondary)', marginTop: '0.4rem', maxWidth: '420px', margin: '0.4rem auto 1.25rem' }}>
            "{activeQuery}" ke liye koi verified offers nahi mile. Kripya doosra keyword ya model try karein.
          </p>
        </div>
      ) : (
        /* ─── Results View ────────────────────────────────────────────────── */
        <>
          {/* Summary / Best Deal Banner */}
          <div className="db-compare-hero-panel" style={{ marginBottom: '1.5rem' }}>
            <div className="db-compare-hero-visual" style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)' }}>
              <span style={{ fontSize: '4rem' }}>📱</span>
            </div>

            <div className="db-compare-hero-info">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span className="db-deal-store">Live Comparison · "{activeQuery}"</span>
                  <h2 className="db-compare-hero-title">
                    {liveComparison.productName || offers[0]?.title || activeQuery}
                  </h2>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    className="db-btn-clean db-btn-clean-outline"
                    onClick={() =>
                      openCreateAlertModal({
                        id: liveComparison.productId || activeQuery.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                        name: liveComparison.productName || offers[0]?.title || activeQuery,
                        currentPrice: minPrice,
                        stores: offers.map((o) => o.store)
                      })
                    }
                    title="Set Price Alert"
                  >
                    <Bell size={14} />
                    <span>Set Alert</span>
                  </button>
                  <button
                    className="db-btn-clean db-btn-clean-outline"
                    onClick={() => viewPriceHistory(liveComparison.productId || 'iphone-16-128')}
                    title="View Price History"
                  >
                    <TrendingDown size={14} />
                    <span>Price History</span>
                  </button>
                </div>
              </div>

              <div className="db-deal-meta" style={{ marginTop: '0.4rem' }}>
                <ShieldCheck size={14} style={{ color: '#16A34A' }} />
                <strong style={{ color: 'var(--db-text-main)', fontSize: '0.88rem' }}>
                  {offers.length} Offers Found
                </strong>
                <span>· Total checked: {liveComparison.totalStoresChecked || offers.length}</span>
                {liveComparison.isCached && (
                  <span style={{ color: '#2563EB', fontWeight: 600, fontSize: '0.78rem' }}>
                    · ⚡ Cached
                  </span>
                )}
                {liveComparison.latencyMs && (
                  <span style={{ color: 'var(--db-text-muted)', fontSize: '0.75rem' }}>
                    ({liveComparison.latencyMs}ms)
                  </span>
                )}
              </div>

              {/* Best Deal Metric */}
              <div className="db-compare-savings-banner" style={{ marginTop: '1rem' }}>
                <div>
                  <div className="db-cs-label">
                    Best Deal on <strong>{bestDeal.store}</strong>
                  </div>
                  <div className="db-cs-val" style={{ color: '#16A34A' }}>
                    {formatPrice(bestDeal.price)}{' '}
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>· Lowest price</span>
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

          {/* ─── Results Cards Grid (Requirement 4) ─────────────────────────── */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--db-text-main)' }}>
                Store Offers ({offers.length})
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--db-text-secondary)' }}>
                Sorted by lowest selling price
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                gap: '1.25rem'
              }}
            >
              {offers.map((offer, idx) => {
                const isLowest = offer.price === minPrice || offer.isBestPrice;
                const imageUrl = offer.imageUrl || offer.image;
                const productUrl = offer.productUrl || offer.url;
                const isRefurbished = (offer.condition || '').toLowerCase() === 'refurbished';

                return (
                  <div
                    key={`${offer.store}-${idx}`}
                    className="db-deal-card"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      border: isLowest ? '2px solid #22C55E' : '1px solid var(--db-border)',
                      position: 'relative',
                      background: '#FFFFFF',
                      borderRadius: '12px',
                      padding: '1.2rem'
                    }}
                  >
                    <div>
                      {/* Top Badges Row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', minHeight: '24px' }}>
                        {isLowest ? (
                          <span
                            className="db-deal-badge-best"
                            style={{
                              position: 'static',
                              background: '#DCFCE7',
                              color: '#15803D',
                              border: '1px solid #BBF7D0',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.55rem',
                              borderRadius: '4px'
                            }}
                          >
                            Lowest price
                          </span>
                        ) : <span />}

                        {/* Condition Badge */}
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            background: isRefurbished ? '#FEF3C7' : '#EFF6FF',
                            color: isRefurbished ? '#92400E' : '#1D4ED8',
                            border: `1px solid ${isRefurbished ? '#FDE68A' : '#BFDBFE'}`,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em'
                          }}
                        >
                          {isRefurbished ? 'Refurbished' : 'New'}
                        </span>
                      </div>

                      {/* Thumbnail / Product Image */}
                      <div
                        className="db-deal-thumb"
                        style={{
                          height: '140px',
                          background: '#F8FAFC',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          marginBottom: '0.85rem'
                        }}
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={offer.title}
                            style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'contain' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: '2.8rem' }}>🏬</span>
                        )}
                      </div>

                      {/* Store Name */}
                      <div className="db-deal-store" style={{ marginBottom: '0.25rem', fontSize: '0.75rem' }}>
                        {offer.store}
                      </div>

                      {/* Product Title */}
                      <h4
                        className="db-deal-name"
                        title={offer.title}
                        style={{
                          fontSize: '0.92rem',
                          fontWeight: 700,
                          lineHeight: '1.35',
                          marginBottom: '0.6rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: '2.5em'
                        }}
                      >
                        {offer.title}
                      </h4>
                    </div>

                    {/* Price and CTA Button */}
                    <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <span
                          style={{
                            fontSize: '1.35rem',
                            fontWeight: 800,
                            color: isLowest ? '#16A34A' : 'var(--db-text-main)'
                          }}
                        >
                          {formatPrice(offer.price)}
                        </span>
                        {offer.originalPrice > offer.price && (
                          <span style={{ fontSize: '0.78rem', color: 'var(--db-text-muted)', textDecoration: 'line-through' }}>
                            {formatPrice(offer.originalPrice)}
                          </span>
                        )}
                        {offer.discount > 0 && (
                          <span style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 700 }}>
                            {offer.discount}% OFF
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <a
                          href={productUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="db-btn-clean db-btn-clean-primary"
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.35rem',
                            padding: '0.55rem',
                            fontSize: '0.82rem',
                            textDecoration: 'none'
                          }}
                        >
                          <span>View on {offer.store}</span>
                          <ExternalLink size={13} />
                        </a>
                        <button
                          type="button"
                          className="db-btn-clean db-btn-clean-icon"
                          onClick={() =>
                            openShareModal({
                              productName: offer.title,
                              platform: offer.store,
                              url: productUrl || 'https://www.pricelens.io'
                            })
                          }
                          title="Share deal"
                          aria-label="Share deal"
                        >
                          <Share2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── Detailed Store Comparisons Table ───────────────────────────── */}
          <div className="db-card db-card-primary" style={{ overflow: 'hidden', marginBottom: '1.5rem' }}>
            <div className="db-card-header-clean">
              <h3 className="db-card-title-sm">Direct Retailer Price Table</h3>
              <span className="db-badge-soft-blue">{offers.length} verified listings</span>
            </div>

            <div className="db-table-responsive">
              <table className="db-full-table">
                <thead>
                  <tr>
                    <th>Store</th>
                    <th>Product Title</th>
                    <th>Condition</th>
                    <th>Price</th>
                    <th style={{ textAlign: 'right' }}>Direct Link</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((offer, idx) => {
                    const isLowest = offer.price === minPrice || offer.isBestPrice;
                    const productUrl = offer.productUrl || offer.url;
                    return (
                      <tr key={`table-${offer.store}-${idx}`} className={isLowest ? 'db-table-row-best' : ''}>
                        <td>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{offer.store}</span>
                            {isLowest && (
                              <span className="db-deal-badge-best" style={{ position: 'static' }}>
                                Lowest
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ maxWidth: '300px' }}>
                          <span style={{ fontSize: '0.82rem', color: 'var(--db-text-main)' }}>
                            {offer.title}
                          </span>
                        </td>
                        <td>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              padding: '0.15rem 0.45rem',
                              borderRadius: '4px',
                              background: (offer.condition || '').toLowerCase() === 'refurbished' ? '#FEF3C7' : '#EFF6FF',
                              color: (offer.condition || '').toLowerCase() === 'refurbished' ? '#92400E' : '#1D4ED8'
                            }}
                          >
                            {offer.condition === 'refurbished' ? 'Refurbished' : 'New'}
                          </span>
                        </td>
                        <td>
                          <strong style={{ fontSize: '1rem', color: isLowest ? '#16A34A' : 'var(--db-text-main)' }}>
                            {formatPrice(offer.price)}
                          </strong>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <a
                            href={productUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="db-btn-clean db-btn-clean-primary"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontSize: '0.78rem',
                              padding: '0.35rem 0.75rem',
                              textDecoration: 'none'
                            }}
                          >
                            <span>Open Store</span>
                            <ExternalLink size={12} />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ComparePricesScreen;
