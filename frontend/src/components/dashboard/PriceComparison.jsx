import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  Share2,
  Sparkles,
  Star,
  Loader2,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  Bell,
  Tag,
  Info,
  CheckCircle2,
  Scale,
  ArrowRight
} from 'lucide-react';
import {
  PRODUCTS,
  PLATFORM_COMPARISONS,
  PRICE_HISTORY_DATA,
  BUY_ADVISOR_DATA,
  VERIFIED_COUPONS,
  formatPrice
} from '../../data/mockData';
import { useDashboard } from '../../context/DashboardContext';
import { apiService } from '../../services/api';

const PriceComparison = () => {
  const { selectedProductId, setSelectedProductId, openShareModal, showToast, setActiveNav } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [liveComparison, setLiveComparison] = useState(null);
  const [activeTab, setActiveTab] = useState('stores'); // 'stores' | 'graph' | 'coupons' | 'alert'
  const [graphTimeline, setGraphTimeline] = useState('30D'); // '7D' | '30D' | '3M' | '6M'
  const [alertTargetPrice, setAlertTargetPrice] = useState('');
  const [alertEmail, setAlertEmail] = useState('');

  const selectedProduct = PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setLiveComparison(null);

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
    PLATFORM_COMPARISONS[selectedProduct.id] || PLATFORM_COMPARISONS['iphone-16-128'] || [];

  const rawPlatforms = liveComparison?.offers?.length
    ? liveComparison.offers.map((o) => ({
        platform: o.store,
        emoji: o.storeEmoji || '🏬',
        price: o.price,
        originalPrice: o.originalPrice || o.price,
        discount: o.discount || 0,
        rating: o.rating || 4.5,
        delivery: o.delivery || 'Free Delivery',
        bankOffer: o.bankOffer || 'Bank discount available',
        url: o.productUrl || 'https://www.flipkart.com',
        isBestPrice: o.isBestPrice,
        isAvailable: o.isAvailable !== false,
        barPercent: o.barPercent || 85,
      }))
    : fallbackPlatforms;

  const validAvailablePlatforms = rawPlatforms
    .filter((p) => p.isAvailable !== false && typeof p.price === 'number' && p.price > 0 && !isNaN(p.price))
    .sort((a, b) => a.price - b.price);

  const lowestDisplayedOffer = validAvailablePlatforms[0] || rawPlatforms[0] || {};
  const bestPlatform = lowestDisplayedOffer;

  const platforms = rawPlatforms.map((plat) => ({
    ...plat,
    isBestPrice: Boolean(
      bestPlatform.platform &&
      plat.platform === bestPlatform.platform &&
      plat.price === bestPlatform.price
    ),
  }));

  const highestPrice = platforms.length > 0 ? Math.max(...platforms.map((p) => p.price)) : 0;
  const maxSavings = Math.max(0, highestPrice - (bestPlatform.price || 0));

  // Advisor & History Data for Selected Product
  const advisorInfo = BUY_ADVISOR_DATA[selectedProduct.id] || {
    verdict: 'BUY NOW',
    score: 90,
    color: '#059669',
    badge: 'Good Deal',
    reason: 'Cheapest price verified across top Indian retailers with instant bank card savings.',
    lowestEver: selectedProduct.currentPrice - 2000,
    highestEver: selectedProduct.originalPrice,
    avgPrice: selectedProduct.currentPrice + 1500,
    festiveEstimate: selectedProduct.currentPrice - 3000,
    cheapestStore: bestPlatform.platform || 'Flipkart',
  };

  const historyPoints =
    PRICE_HISTORY_DATA[selectedProduct.id]?.timelines?.[graphTimeline] ||
    PRICE_HISTORY_DATA['iphone-16-128'].timelines[graphTimeline];

  const minGraphPrice = Math.min(...historyPoints.map((pt) => pt.price));
  const maxGraphPrice = Math.max(...historyPoints.map((pt) => pt.price));

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

  const handleSetAlert = (e) => {
    e.preventDefault();
    if (!alertTargetPrice) {
      if (showToast) showToast('Please enter your target price.', 'error');
      return;
    }
    if (showToast) {
      showToast(
        `🔔 Price Alert set for ${selectedProduct.name} at ₹${Number(alertTargetPrice).toLocaleString('en-IN')}!`,
        'success'
      );
    }
    setAlertTargetPrice('');
    setAlertEmail('');
  };

  return (
    <div className="db-compare-card" id="price-comparison-section" style={{ position: 'relative' }}>
      {/* Top Header & Product Quick Select Carousel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: 'rgba(91, 69, 255, 0.12)', color: 'var(--db-primary)' }}>
              LIVE PRICE ANALYZER
            </span>
            <span style={{ fontSize: '0.76rem', color: 'var(--db-text-muted)' }}>Updated 2 mins ago</span>
          </div>
          <h2 className="db-section-title-clean" style={{ margin: 0, fontSize: '1.4rem' }}>
            Where is <span style={{ color: 'var(--db-primary)' }}>{selectedProduct.name}</span> cheapest?
          </h2>
        </div>

        <button
          type="button"
          className="db-btn-clean db-btn-clean-outline"
          style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
          onClick={() => setActiveNav('compare')}
        >
          <Scale size={13} /> Full Comparison View
        </button>
      </div>

      {/* Product Quick-Select Bar */}
      <div className="db-compare-selector-row" style={{ marginBottom: '1.25rem' }}>
        {PRODUCTS.map((prod) => (
          <button
            key={prod.id}
            type="button"
            className={`db-selector-pill ${prod.id === selectedProduct.id ? 'active' : ''}`}
            onClick={() => setSelectedProductId(prod.id)}
          >
            <span>{prod.emoji}</span>
            <span>{prod.name}</span>
          </button>
        ))}
      </div>

      {/* Main 2-Column Balanced Layout */}
      <div className="db-analyzer-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 1.15fr) minmax(360px, 1.85fr)',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Product Summary & Buy Advisor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Product Overview Box */}
          <div style={{
            padding: '1.15rem',
            borderRadius: '14px',
            background: 'var(--db-surface-card)',
            border: '1px solid var(--db-border)',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <div style={{
              width: '74px',
              height: '74px',
              borderRadius: '12px',
              background: selectedProduct.bgGradient || '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.4rem',
              flexShrink: 0,
              border: '1px solid var(--db-border)'
            }}>
              {selectedProduct.emoji}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--db-primary)', fontWeight: 750, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {selectedProduct.brand} · {selectedProduct.category}
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--db-text-main)', margin: '2px 0 4px 0', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedProduct.name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--db-text-secondary)' }}>
                <Star size={13} fill="#F59E0B" color="#F59E0B" />
                <strong style={{ color: 'var(--db-text-main)' }}>{selectedProduct.rating}</strong>
                <span>({(selectedProduct.reviewCount / 1000).toFixed(1)}k verified ratings)</span>
              </div>
            </div>
          </div>

          {/* Cheapest Store Highlight Box */}
          <div
            style={{
              padding: '1.15rem',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.08) 0%, rgba(91, 69, 255, 0.05) 100%)',
              border: '1.5px solid rgba(5, 150, 105, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '3px 9px',
                borderRadius: '20px',
                background: '#059669',
                color: '#fff',
                letterSpacing: '0.5px'
              }}>
                🏆 CHEAPEST STORE
              </span>
              <span style={{ fontWeight: 750, fontSize: '0.92rem', color: 'var(--db-text-main)' }}>
                {bestPlatform.emoji} {bestPlatform.platform}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 850, color: '#059669', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
                {formatPrice(bestPlatform.price)}
              </span>
              {maxSavings > 0 && (
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#16A34A' }}>
                  Save {formatPrice(maxSavings)} vs others
                </span>
              )}
            </div>

            <div style={{ fontSize: '0.76rem', color: 'var(--db-text-secondary)', lineHeight: 1.4 }}>
              {bestPlatform.delivery} · {bestPlatform.bankOffer}
            </div>

            <button
              type="button"
              className="db-btn-clean db-btn-clean-primary"
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '0.25rem',
                boxShadow: '0 4px 14px rgba(91, 69, 255, 0.28)'
              }}
              onClick={() => handleOpenStore(bestPlatform.url)}
            >
              <span>Buy on {bestPlatform.platform} at Lowest Price</span>
              <ExternalLink size={14} />
            </button>
          </div>

          {/* BuyHatke Smart Buy Advisor Box */}
          <div
            style={{
              padding: '1.15rem',
              borderRadius: '14px',
              background: 'var(--db-surface-card)',
              border: '1px solid var(--db-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'rgba(5, 150, 105, 0.12)',
                  color: advisorInfo.color
                }}>
                  {advisorInfo.verdict} ({advisorInfo.score}/100)
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--db-text-main)' }}>
                  Buy Recommendation
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--db-text-muted)', fontWeight: 600 }}>
                AI Price Advisor
              </span>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--db-text-secondary)', margin: 0, lineHeight: 1.45 }}>
              {advisorInfo.reason}
            </p>

            {/* 4 Key Price Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.5rem',
              paddingTop: '0.5rem',
              borderTop: '1px solid var(--db-border)'
            }}>
              <div style={{ padding: '0.4rem 0.5rem', background: '#F8FAFC', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--db-text-muted)', display: 'block' }}>All-Time Lowest</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#059669' }}>
                  {formatPrice(advisorInfo.lowestEver)}
                </span>
              </div>
              <div style={{ padding: '0.4rem 0.5rem', background: '#F8FAFC', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--db-text-muted)', display: 'block' }}>Average Price</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--db-text-main)' }}>
                  {formatPrice(advisorInfo.avgPrice)}
                </span>
              </div>
              <div style={{ padding: '0.4rem 0.5rem', background: '#F8FAFC', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--db-text-muted)', display: 'block' }}>All-Time Highest</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#64748B' }}>
                  {formatPrice(advisorInfo.highestEver)}
                </span>
              </div>
              <div style={{ padding: '0.4rem 0.5rem', background: '#F8FAFC', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--db-text-muted)', display: 'block' }}>Festive Sale Est.</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--db-primary)' }}>
                  {formatPrice(advisorInfo.festiveEstimate)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Store Comparison, Price Graph & Coupons */}
        <div style={{
          padding: '1.25rem',
          borderRadius: '14px',
          background: 'var(--db-surface-card)',
          border: '1px solid var(--db-border)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%'
        }}>
          {/* Feature Tabs */}
          <div className="db-tabs-bar" style={{ marginBottom: '1rem' }}>
            <button
              type="button"
              className={`db-tab-btn ${activeTab === 'stores' ? 'active' : ''}`}
              onClick={() => setActiveTab('stores')}
            >
              🏬 Store Breakdown ({platforms.length})
            </button>
            <button
              type="button"
              className={`db-tab-btn ${activeTab === 'graph' ? 'active' : ''}`}
              onClick={() => setActiveTab('graph')}
            >
              📈 Price Graph
            </button>
            <button
              type="button"
              className={`db-tab-btn ${activeTab === 'coupons' ? 'active' : ''}`}
              onClick={() => setActiveTab('coupons')}
            >
              🏷️ Store Coupons ({VERIFIED_COUPONS.length})
            </button>
            <button
              type="button"
              className={`db-tab-btn ${activeTab === 'alert' ? 'active' : ''}`}
              onClick={() => setActiveTab('alert')}
            >
              🔔 Set Drop Alert
            </button>
          </div>

          {/* Tab 1: Store Breakdown */}
          {activeTab === 'stores' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {loading ? (
                <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--db-text-secondary)' }}>
                  <Loader2 size={26} className="animate-spin" style={{ margin: '0 auto 0.5rem', color: 'var(--db-primary)' }} />
                  <span style={{ fontSize: '0.85rem' }}>Querying store adapters...</span>
                </div>
              ) : (
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
                                CHEAPEST
                              </span>
                            )}
                          </div>
                        </div>
                        <div className={`db-store-price ${plat.isBestPrice ? 'best' : ''}`}>
                          {formatPrice(plat.price)}
                        </div>
                      </div>

                      {/* Visual Comparison Bar */}
                      <div className="db-compare-bar-track">
                        <div
                          className={`db-compare-bar-fill ${plat.isBestPrice ? 'best' : ''}`}
                          style={{ width: `${plat.barPercent}%` }}
                        />
                      </div>

                      <div className="db-store-foot">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.76rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#F59E0B' }}>
                            <Star size={12} fill="#F59E0B" /> {plat.rating}
                          </span>
                          <span>· {plat.delivery}</span>
                        </div>

                        <div className="db-store-actions">
                          <button
                            type="button"
                            className="db-btn-clean db-btn-clean-primary"
                            style={{ fontSize: '0.74rem', padding: '0.3rem 0.65rem' }}
                            onClick={() => handleOpenStore(plat.url)}
                          >
                            Buy on {plat.platform} <ExternalLink size={11} />
                          </button>
                          <button
                            type="button"
                            className="db-btn-clean db-btn-clean-icon"
                            style={{ width: '28px', height: '28px' }}
                            onClick={() => handleShare(plat)}
                            title="Share link"
                            aria-label="Share link"
                          >
                            <Share2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Price Graph */}
          {activeTab === 'graph' && (
            <div style={{ padding: '0.5rem 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--db-text-secondary)' }}>
                  Range: <strong>{formatPrice(minGraphPrice)}</strong> – <strong>{formatPrice(maxGraphPrice)}</strong>
                </span>
                <div className="db-timeline-toggle">
                  {['7D', '30D', '3M', '6M'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`db-timeline-btn ${graphTimeline === t ? 'active' : ''}`}
                      onClick={() => setGraphTimeline(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="db-chart-container" style={{ height: '220px', marginBottom: '0.85rem' }}>
                <div className="db-chart-bars-wrap">
                  {historyPoints.map((pt, idx) => {
                    const heightPct =
                      maxGraphPrice === minGraphPrice
                        ? 60
                        : 35 + ((pt.price - minGraphPrice) / (maxGraphPrice - minGraphPrice)) * 55;
                    const isLowest = pt.price === minGraphPrice;
                    return (
                      <div key={idx} className="db-chart-col">
                        <div className="db-chart-tooltip">
                          <div><strong>{formatPrice(pt.price)}</strong></div>
                          <div style={{ fontSize: '0.7rem', color: '#93C5FD' }}>{pt.label}</div>
                        </div>
                        <div className="db-chart-bar-outer">
                          <div
                            className={`db-chart-bar-inner ${isLowest ? 'lowest' : ''}`}
                            style={{ height: `${heightPct}%` }}
                          />
                        </div>
                        <span className="db-chart-x-label">{pt.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--db-text-muted)', marginTop: 'auto' }}>
                <span>Lowest recorded in {graphTimeline}: <strong style={{ color: '#059669' }}>{formatPrice(minGraphPrice)}</strong></span>
                <button
                  type="button"
                  className="db-btn-clean"
                  style={{ fontSize: '0.75rem', color: 'var(--db-primary)', textDecoration: 'underline' }}
                  onClick={() => setActiveNav('history')}
                >
                  View Full History Screen →
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Store Coupons */}
          {activeTab === 'coupons' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
              {VERIFIED_COUPONS.map((cp) => (
                <div
                  key={cp.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '1px dashed var(--db-border-strong)',
                    background: '#F8FAFC'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 750, fontSize: '0.85rem', color: 'var(--db-text-main)' }}>
                      {cp.logo} {cp.store} — {cp.discount}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--db-text-muted)' }}>
                      Min order: {cp.minOrder} · {cp.expiry}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="db-btn-clean db-btn-clean-primary"
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                    onClick={() => {
                      if (navigator.clipboard) navigator.clipboard.writeText(cp.code);
                      if (showToast) showToast(`Copied ${cp.code}!`, 'success');
                    }}
                  >
                    Copy {cp.code}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Set Price Alert */}
          {activeTab === 'alert' && (
            <form onSubmit={handleSetAlert} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', padding: '0.5rem 0', flex: 1 }}>
              <div style={{ fontSize: '0.84rem', color: 'var(--db-text-secondary)', lineHeight: 1.5 }}>
                We'll notify you via Email or WhatsApp the moment <strong>{selectedProduct.name}</strong> drops below your target price.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <input
                  type="number"
                  className="db-search-input"
                  style={{ width: '100%', height: '42px', fontSize: '0.88rem' }}
                  placeholder={`Enter target price (Current lowest: ${formatPrice(bestPlatform.price)})`}
                  value={alertTargetPrice}
                  onChange={(e) => setAlertTargetPrice(e.target.value)}
                  required
                />
                <input
                  type="email"
                  className="db-search-input"
                  style={{ width: '100%', height: '42px', fontSize: '0.88rem' }}
                  placeholder="Your email address or phone number"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="db-btn-clean db-btn-clean-primary"
                  style={{ height: '42px', padding: '0 1.25rem', fontSize: '0.88rem', justifyContent: 'center' }}
                >
                  <Bell size={14} /> Activate Price Drop Alert
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceComparison;
