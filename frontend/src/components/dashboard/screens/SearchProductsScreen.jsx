import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Star, Scale, ExternalLink, Share2, Heart, RotateCcw } from 'lucide-react';
import { PRODUCTS, CATEGORIES, STORES, formatPrice } from '../../../data/mockData';
import { useDashboard } from '../../../context/DashboardContext';
import EmptyState from '../EmptyState';

const SearchProductsScreen = () => {
  const {
    searchQuery,
    setSearchQuery,
    viewProductDetail,
    viewPriceComparison,
    openShareModal,
    toggleSaveProduct,
    savedProducts,
  } = useDashboard();

  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStore, setSelectedStore] = useState('All Stores');
  const [minRating, setMinRating] = useState(0);
  const [minDiscount, setMinDiscount] = useState(0);
  const [priceBracket, setPriceBracket] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');

  // Detect if query is a store URL
  const detectedStoreFromQuery = useMemo(() => {
    if (!searchQuery) return null;
    const val = searchQuery.toLowerCase();
    if (val.includes('flipkart.com')) return 'Flipkart';
    if (val.includes('amazon.in') || val.includes('amazon.com')) return 'Amazon';
    if (val.includes('croma.com')) return 'Croma';
    if (val.includes('reliancedigital.in')) return 'Reliance Digital';
    if (val.includes('apple.com')) return 'Apple Store';
    if (val.includes('samsung.com')) return 'Samsung Store';
    return null;
  }, [searchQuery]);

  const isUrlQuery = useMemo(() => {
    if (!searchQuery) return false;
    const val = searchQuery.trim().toLowerCase();
    return (
      val.startsWith('http://') ||
      val.startsWith('https://') ||
      val.startsWith('www.') ||
      detectedStoreFromQuery !== null
    );
  }, [searchQuery, detectedStoreFromQuery]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Query or URL filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();

        if (isUrlQuery) {
          // If URL, check if brand, name, or keywords match the URL string
          const nameTokens = p.name.toLowerCase().split(/\s+/);
          const brandMatch = q.includes(p.brand.toLowerCase());
          const nameMatch = nameTokens.some((tok) => tok.length > 2 && q.includes(tok));
          const idMatch = q.includes(p.id);
          if (!brandMatch && !nameMatch && !idMatch) return false;
        } else {
          // Standard text search
          const matches =
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q);
          if (!matches) return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'All Categories' && p.category !== selectedCategory) {
        return false;
      }

      // Store filter
      if (selectedStore !== 'All Stores' && p.store !== selectedStore) {
        return false;
      }

      // Rating filter
      if (minRating > 0 && p.rating < minRating) {
        return false;
      }

      // Discount filter
      if (minDiscount > 0 && p.discount < minDiscount) {
        return false;
      }

      // Price bracket
      if (priceBracket === 'under30k' && p.currentPrice >= 30000) return false;
      if (priceBracket === '30k-70k' && (p.currentPrice < 30000 || p.currentPrice > 70000)) return false;
      if (priceBracket === 'above70k' && p.currentPrice <= 70000) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.currentPrice - b.currentPrice;
      if (sortBy === 'discount-high') return b.discount - a.discount;
      if (sortBy === 'rating-high') return b.rating - a.rating;
      return 0; // recommended
    });
  }, [searchQuery, isUrlQuery, selectedCategory, selectedStore, minRating, minDiscount, priceBracket, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All Categories');
    setSelectedStore('All Stores');
    setMinRating(0);
    setMinDiscount(0);
    setPriceBracket('all');
    setSortBy('recommended');
    setSearchQuery('');
  };

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) setSearchQuery(text);
      } else {
        const promptText = window.prompt('Paste your product link here:');
        if (promptText) setSearchQuery(promptText);
      }
    } catch {
      const promptText = window.prompt('Paste your product link here:');
      if (promptText) setSearchQuery(promptText);
    }
  };

  return (
    <div className="db-page-fade">
      <div className="db-screen-header">
        <h1 className="db-screen-title">Search & Check Online Prices</h1>
        <p className="db-screen-subtitle">
          Search any gadget or paste direct store links from Amazon, Flipkart, Croma, and Reliance Digital.
        </p>
      </div>

      {/* Main Search / URL Bar */}
      <div className="db-search-large-wrap" style={{ position: 'relative' }}>
        <Search size={20} className="db-search-icon" />
        <input
          type="text"
          className="db-search-input"
          style={{ height: '52px', fontSize: '0.95rem', paddingRight: '140px' }}
          placeholder="Search products, brands or paste store link (Flipkart, Amazon, Croma...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '6px' }}>
          {!searchQuery && (
            <button
              type="button"
              className="db-paste-action-btn"
              onClick={handlePasteClipboard}
              title="Paste link from clipboard"
              style={{ position: 'static' }}
            >
              Paste Link
            </button>
          )}
          {searchQuery && (
            <button
              className="db-btn-clean db-btn-clean-outline"
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
              onClick={() => setSearchQuery('')}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* URL Detected Alert Banner */}
      {isUrlQuery && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            padding: '0.75rem 1.25rem',
            margin: '0.75rem 0 1.25rem 0',
            borderRadius: '12px',
            background: 'rgba(91, 69, 255, 0.08)',
            border: '1px solid rgba(91, 69, 255, 0.25)',
            color: 'var(--db-text-main)',
            fontSize: '0.88rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🔗</span>
            <div>
              <strong>Online Link Detected {detectedStoreFromQuery ? `(${detectedStoreFromQuery})` : ''}</strong>
              <div style={{ fontSize: '0.78rem', color: 'var(--db-text-secondary)' }}>
                Comparing prices across all verified retailers for this product...
              </div>
            </div>
          </div>
          {filteredProducts.length > 0 && (
            <button
              className="db-btn-clean db-btn-clean-primary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
              onClick={() => viewPriceComparison(filteredProducts[0].id)}
            >
              <Scale size={13} /> Compare {filteredProducts[0].name}
            </button>
          )}
        </div>
      )}

      <div className="db-search-layout">
        {/* Filter Sidebar */}
        <aside className="db-filter-sidebar">
          <div className="db-filter-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <SlidersHorizontal size={16} />
              <span style={{ fontWeight: 700 }}>Filters</span>
            </div>
            <button className="db-filter-reset-btn" onClick={handleResetFilters}>
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          {/* Category Filter */}
          <div className="db-filter-group">
            <label className="db-filter-label">Category</label>
            <div className="db-filter-options">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`db-filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="db-filter-group">
            <label className="db-filter-label">Price Range</label>
            <div className="db-filter-options">
              <button
                className={`db-filter-chip ${priceBracket === 'all' ? 'active' : ''}`}
                onClick={() => setPriceBracket('all')}
              >
                All Prices
              </button>
              <button
                className={`db-filter-chip ${priceBracket === 'under30k' ? 'active' : ''}`}
                onClick={() => setPriceBracket('under30k')}
              >
                Under ₹30,000
              </button>
              <button
                className={`db-filter-chip ${priceBracket === '30k-70k' ? 'active' : ''}`}
                onClick={() => setPriceBracket('30k-70k')}
              >
                ₹30,000 – ₹70,000
              </button>
              <button
                className={`db-filter-chip ${priceBracket === 'above70k' ? 'active' : ''}`}
                onClick={() => setPriceBracket('above70k')}
              >
                Above ₹70,000
              </button>
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="db-filter-group">
            <label className="db-filter-label">Customer Rating</label>
            <div className="db-filter-options">
              <button
                className={`db-filter-chip ${minRating === 0 ? 'active' : ''}`}
                onClick={() => setMinRating(0)}
              >
                All Ratings
              </button>
              <button
                className={`db-filter-chip ${minRating === 4.0 ? 'active' : ''}`}
                onClick={() => setMinRating(4.0)}
              >
                4.0★ & above
              </button>
              <button
                className={`db-filter-chip ${minRating === 4.5 ? 'active' : ''}`}
                onClick={() => setMinRating(4.5)}
              >
                4.5★ & above
              </button>
            </div>
          </div>

          {/* Minimum Discount */}
          <div className="db-filter-group">
            <label className="db-filter-label">Discount</label>
            <div className="db-filter-options">
              <button
                className={`db-filter-chip ${minDiscount === 0 ? 'active' : ''}`}
                onClick={() => setMinDiscount(0)}
              >
                All Deals
              </button>
              <button
                className={`db-filter-chip ${minDiscount === 10 ? 'active' : ''}`}
                onClick={() => setMinDiscount(10)}
              >
                10%+ OFF
              </button>
              <button
                className={`db-filter-chip ${minDiscount === 20 ? 'active' : ''}`}
                onClick={() => setMinDiscount(20)}
              >
                20%+ OFF
              </button>
            </div>
          </div>

          {/* Store Filter */}
          <div className="db-filter-group">
            <label className="db-filter-label">Store</label>
            <div className="db-filter-options">
              <button
                className={`db-filter-chip ${selectedStore === 'All Stores' ? 'active' : ''}`}
                onClick={() => setSelectedStore('All Stores')}
              >
                All Stores
              </button>
              {STORES.map((s) => (
                <button
                  key={s}
                  className={`db-filter-chip ${selectedStore === s ? 'active' : ''}`}
                  onClick={() => setSelectedStore(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <main className="db-search-results-area">
          <div className="db-results-topbar">
            <span className="db-results-count">
              Showing <strong>{filteredProducts.length}</strong> products
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--db-text-secondary)' }}>Sort by:</span>
              <select
                className="db-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Lowest Price</option>
                <option value="discount-high">Highest Discount</option>
                <option value="rating-high">Highest Rating</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <EmptyState
              title="No matching products found"
              message="Try adjusting your search query, price range, or category filters."
              onReset={handleResetFilters}
            />
          ) : (
            <div className="db-search-grid">
              {filteredProducts.map((p) => {
                const isSaved = savedProducts.some((s) => s.productId === p.id || s.id === p.id);
                return (
                  <div key={p.id} className="db-deal-card">
                    <div className="db-deal-thumb" style={{ background: p.bgGradient }}>
                      {p.isBestDeal && <span className="db-deal-badge-best">Best Price</span>}
                      {p.discount > 0 && <span className="db-deal-badge-discount">{p.discount}% OFF</span>}
                      <span>{p.emoji}</span>
                      <button
                        className={`db-card-wish-btn ${isSaved ? 'active' : ''}`}
                        onClick={() => toggleSaveProduct(p)}
                        title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
                      >
                        <Heart size={14} fill={isSaved ? '#EF4444' : 'none'} color={isSaved ? '#EF4444' : '#64748B'} />
                      </button>
                    </div>

                    <div className="db-deal-store">Lowest on {p.store}</div>
                    <h3
                      className="db-deal-name"
                      style={{ cursor: 'pointer' }}
                      onClick={() => viewProductDetail(p.id)}
                      title="Click to view details"
                    >
                      {p.name}
                    </h3>

                    <div className="db-deal-meta">
                      <Star size={13} fill="#F59E0B" color="#F59E0B" />
                      <strong style={{ color: 'var(--db-text-main)' }}>{p.rating}</strong>
                      <span>· {(p.reviewCount / 1000).toFixed(1)}k reviews</span>
                    </div>

                    <div className="db-deal-prices">
                      <span className="db-deal-price-now">{formatPrice(p.currentPrice)}</span>
                      <span className="db-deal-price-was">{formatPrice(p.originalPrice)}</span>
                    </div>

                    <div className="db-deal-movement">{p.priceMovement}</div>

                    <div className="db-deal-actions">
                      <button
                        className="db-btn-clean db-btn-clean-primary"
                        style={{ flex: 1 }}
                        onClick={() => viewPriceComparison(p.id)}
                      >
                        <Scale size={13} /> Compare
                      </button>
                      <button
                        className="db-btn-clean db-btn-clean-outline"
                        onClick={() => viewProductDetail(p.id)}
                      >
                        View
                      </button>
                      <button
                        className="db-btn-clean db-btn-clean-icon"
                        onClick={() =>
                          openShareModal({
                            productName: p.name,
                            platform: p.store,
                            url: `https://www.pricelens.io/p/${p.id}`,
                          })
                        }
                        title="Share link"
                      >
                        <Share2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchProductsScreen;
