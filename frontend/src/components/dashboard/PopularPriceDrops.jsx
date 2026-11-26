import React, { useState, useMemo } from 'react';
import {
  Heart,
  Bookmark,
  BookmarkCheck,
  Star,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Sparkles
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { POPULAR_PRICE_DROPS_ITEMS, formatPrice } from '../../data/mockData';
import StoreLogo from './StoreLogo';

// Enriched with Festive Sale Audit & All-Time Low telemetry
const AUDITED_DEALS = [
  {
    ...POPULAR_PRICE_DROPS_ITEMS[0],
    category: 'Mobiles',
    isAllTimeLow: true,
    audit: {
      type: 'real_drop',
      label: 'Verified Real Drop',
      desc: '₹5,000 below 60-day average price'
    }
  },
  {
    ...POPULAR_PRICE_DROPS_ITEMS[1],
    category: 'Audio',
    isAllTimeLow: true,
    audit: {
      type: 'all_time_low',
      label: 'All-Time Historic Low',
      desc: 'Lowest price ever recorded in 365 days'
    }
  },
  {
    ...POPULAR_PRICE_DROPS_ITEMS[2],
    category: 'Laptops',
    isAllTimeLow: false,
    audit: {
      type: 'real_drop',
      label: 'Verified Real Drop',
      desc: '₹3,000 below 30-day average'
    }
  },
  {
    ...POPULAR_PRICE_DROPS_ITEMS[3],
    category: 'Wearables',
    isAllTimeLow: false,
    audit: {
      type: 'fake_warning',
      label: 'MRP Inflated Alert',
      desc: 'MRP was hiked before sale. True drop is only 8%'
    }
  }
];

export const PopularPriceDrops = () => {
  const {
    setSelectedProductId,
    viewPriceComparison,
    toggleSaveProduct,
    savedProducts,
    setActiveNav,
    showToast
  } = useDashboard();

  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'all-time-low' | 'Mobiles' | 'Laptops' | 'Audio' | 'Wearables'

  const toggleBookmark = (item, e) => {
    e.stopPropagation();
    if (bookmarkedIds.includes(item.id)) {
      setBookmarkedIds((prev) => prev.filter((id) => id !== item.id));
      showToast(`Removed ${item.name} from saved items`, 'info');
    } else {
      setBookmarkedIds((prev) => [...prev, item.id]);
      showToast(`Bookmarked ${item.name}!`, 'success');
    }
  };

  const handleCardClick = (item) => {
    setSelectedProductId(item.id);
    const compareEl = document.getElementById('price-comparison-section');
    if (compareEl) {
      compareEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      viewPriceComparison(item.id);
    }
  };

  const filteredDeals = useMemo(() => {
    if (selectedFilter === 'all-time-low') {
      return AUDITED_DEALS.filter((d) => d.isAllTimeLow);
    }
    if (selectedFilter !== 'all') {
      return AUDITED_DEALS.filter((d) => d.category === selectedFilter);
    }
    return AUDITED_DEALS;
  }, [selectedFilter]);

  return (
    <section className="pl-popular-section">
      {/* Section Header */}
      <div className="pl-section-header-row">
        <div className="pl-section-title-col">
          <h2 className="pl-section-title">Popular price drops &amp; festive sale audit</h2>
          <p className="pl-section-subtitle">
            Audited deals from Amazon, Flipkart, Croma and Reliance Digital with AI Fake-Discount verification
          </p>
        </div>
        <button
          type="button"
          className="pl-view-all-link"
          onClick={() => {
            setActiveNav('search');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <span>View all deals</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Filter Tabs Bar (Including 'All-Time Lows' deal-hunter filter) */}
      <div className="pl-deals-filter-bar">
        <button
          type="button"
          className={`pl-filter-chip ${selectedFilter === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('all')}
        >
          All Deals ({AUDITED_DEALS.length})
        </button>
        <button
          type="button"
          className={`pl-filter-chip pl-filter-chip-atl ${selectedFilter === 'all-time-low' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('all-time-low')}
        >
          <Flame size={13} className="text-orange" />
          <span>🔥 At All-Time Low ({AUDITED_DEALS.filter(d => d.isAllTimeLow).length})</span>
        </button>
        <button
          type="button"
          className={`pl-filter-chip ${selectedFilter === 'Mobiles' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('Mobiles')}
        >
          Mobiles
        </button>
        <button
          type="button"
          className={`pl-filter-chip ${selectedFilter === 'Laptops' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('Laptops')}
        >
          Laptops
        </button>
        <button
          type="button"
          className={`pl-filter-chip ${selectedFilter === 'Audio' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('Audio')}
        >
          Audio
        </button>
        <button
          type="button"
          className={`pl-filter-chip ${selectedFilter === 'Wearables' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('Wearables')}
        >
          Wearables
        </button>
      </div>

      {/* Audited Cards Grid */}
      <div className="pl-popular-cards-grid">
        {filteredDeals.map((item) => {
          const isSaved = savedProducts.some((p) => p.productId === item.id || p.id === item.id);
          const isBookmarked = bookmarkedIds.includes(item.id);
          const isFakeWarning = item.audit.type === 'fake_warning';
          const isAllTimeLow = item.audit.type === 'all_time_low';

          return (
            <div
              key={item.id}
              className="pl-product-deal-card"
              onClick={() => handleCardClick(item)}
            >
              {/* Card Top Row: Discount Badge, Fake Discount Audit & Wishlist Heart */}
              <div className="pl-deal-card-top">
                <div className="pl-badges-stack">
                  <span className="pl-deal-discount-badge">
                    {item.discountPercent}% OFF
                  </span>
                  {/* Verified Fake Discount Audit Badge */}
                  <span className={`pl-audit-badge pl-audit-${item.audit.type}`} title={item.audit.desc}>
                    {isFakeWarning ? (
                      <AlertTriangle size={11} />
                    ) : isAllTimeLow ? (
                      <Flame size={11} />
                    ) : (
                      <ShieldCheck size={11} />
                    )}
                    <span>{item.audit.label}</span>
                  </span>
                </div>

                <button
                  type="button"
                  className={`pl-deal-heart-btn ${isSaved ? 'saved' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaveProduct(item);
                  }}
                  title="Add to Wishlist"
                  aria-label="Wishlist"
                >
                  <Heart
                    size={16}
                    fill={isSaved ? '#EF4444' : 'none'}
                    color={isSaved ? '#EF4444' : '#64748B'}
                  />
                </button>
              </div>

              {/* Product Image */}
              <div className="pl-deal-img-wrapper">
                <img
                  src={item.image}
                  alt={item.name}
                  className="pl-deal-product-img"
                  loading="lazy"
                />
              </div>

              {/* Product Title */}
              <h3 className="pl-deal-title" title={item.name}>
                {item.name}
              </h3>

              {/* Price & Sparkline Row */}
              <div className="pl-deal-price-row">
                <div className="pl-deal-price-group">
                  <span className="pl-deal-current-price">
                    {formatPrice(item.currentPrice)}
                  </span>
                  <span className="pl-deal-original-price">
                    {formatPrice(item.originalPrice)}
                  </span>
                </div>

                {/* Mini SVG Sparkline */}
                <div className="pl-deal-sparkline-box">
                  <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
                    <path
                      d="M2 17L12 11L24 15L36 7L48 12L58 3"
                      stroke="#5B45FF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Audit Explanation Note */}
              <div className="pl-deal-audit-note">
                <span className="pl-audit-desc">{item.audit.desc}</span>
              </div>

              {/* Store & Rating Row */}
              <div className="pl-deal-meta-row">
                <StoreLogo store={item.store} size="sm" />
                <div className="pl-deal-rating">
                  <Star size={12} fill="#F59E0B" color="#F59E0B" />
                  <span className="pl-rating-val">{item.rating}</span>
                  <span className="pl-rating-count">({item.reviewCount})</span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pl-deal-actions-row">
                <button
                  type="button"
                  className="pl-deal-compare-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(item);
                  }}
                >
                  <span>Compare prices</span>
                  <ArrowRight size={13} />
                </button>
                <button
                  type="button"
                  className={`pl-deal-bookmark-btn ${isBookmarked ? 'active' : ''}`}
                  onClick={(e) => toggleBookmark(item, e)}
                  title="Bookmark item"
                  aria-label="Bookmark"
                >
                  {isBookmarked ? (
                    <BookmarkCheck size={16} color="#5B45FF" />
                  ) : (
                    <Bookmark size={16} color="#64748B" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PopularPriceDrops;
