import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  IndianRupee,
  Sparkles,
  Link2,
  Clipboard,
  ExternalLink,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { POPULAR_SEARCHES, PRODUCTS } from '../../data/mockData';

const SAMPLE_STORE_LINKS = [
  {
    label: 'Flipkart: iPhone 16',
    url: 'https://www.flipkart.com/apple-iphone-16-teal-128-gb/p/itm123',
    productId: 'iphone-16-128',
    store: 'Flipkart',
  },
  {
    label: 'Amazon: MacBook Air M3',
    url: 'https://www.amazon.in/Apple-MacBook-Air-13-inch-M3/dp/B0CX234',
    productId: 'macbook-air-m3',
    store: 'Amazon',
  },
  {
    label: 'Croma: Sony WH-1000XM5',
    url: 'https://www.croma.com/sony-wh-1000xm5-bluetooth-headphone/p/258900',
    productId: 'sony-xm5',
    store: 'Croma',
  },
  {
    label: 'Amazon: Galaxy S25',
    url: 'https://www.amazon.in/Samsung-Galaxy-S25-5G-256GB/dp/B0D5678',
    productId: 'samsung-s25',
    store: 'Amazon',
  },
];

const Hero = () => {
  const { searchQuery, setSearchQuery, setSelectedProductId, setActiveNav, showToast } = useDashboard();
  const [searchMode, setSearchMode] = useState('keyword'); // 'keyword' | 'link'
  const [inputValue, setInputValue] = useState(searchQuery);

  // Auto-detect store from entered URL
  const detectedStore = (() => {
    const val = inputValue.toLowerCase();
    if (val.includes('flipkart.com')) return 'Flipkart';
    if (val.includes('amazon.in') || val.includes('amazon.com')) return 'Amazon';
    if (val.includes('croma.com')) return 'Croma';
    if (val.includes('reliancedigital.in')) return 'Reliance Digital';
    if (val.includes('apple.com')) return 'Apple Store';
    if (val.includes('samsung.com')) return 'Samsung Store';
    return null;
  })();

  const isUrlInput = inputValue.trim().startsWith('http://') ||
    inputValue.trim().startsWith('https://') ||
    inputValue.trim().startsWith('www.') ||
    detectedStore !== null;

  const handlePasteFromClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputValue(text);
          if (showToast) showToast('Pasted link from clipboard!', 'info');
        }
      } else {
        const promptText = window.prompt('Paste your product link here:');
        if (promptText) setInputValue(promptText);
      }
    } catch {
      const promptText = window.prompt('Paste your product link here:');
      if (promptText) setInputValue(promptText);
    }
  };

  const handleProcessSubmission = (queryOrUrl) => {
    const text = (queryOrUrl || inputValue).trim();
    if (!text) return;

    const lower = text.toLowerCase();

    // Match product based on URL keywords or query
    let matchedId = 'iphone-16-128';
    let matchedName = 'iPhone 16 128GB';

    if (lower.includes('macbook') || lower.includes('m3') || lower.includes('apple-macbook')) {
      matchedId = 'macbook-air-m3';
      matchedName = 'MacBook Air 13-inch M3';
    } else if (lower.includes('samsung') || lower.includes('s25') || lower.includes('galaxy')) {
      matchedId = 'samsung-s25';
      matchedName = 'Samsung Galaxy S25 256GB';
    } else if (lower.includes('sony') || lower.includes('xm5') || lower.includes('wh-1000xm5')) {
      matchedId = 'sony-xm5';
      matchedName = 'Sony WH-1000XM5 Headphones';
    } else if (lower.includes('airpods') || lower.includes('airpod')) {
      matchedId = 'airpods-pro-2';
      matchedName = 'AirPods Pro (2nd Gen)';
    } else if (lower.includes('watch') || lower.includes('series-10')) {
      matchedId = 'apple-watch-s10';
      matchedName = 'Apple Watch Series 10';
    } else if (lower.includes('oneplus')) {
      matchedId = 'oneplus-13';
      matchedName = 'OnePlus 13 5G';
    } else if (lower.includes('ipad')) {
      matchedId = 'ipad-air-m2';
      matchedName = 'iPad Air 11-inch M2';
    } else if (lower.includes('bose')) {
      matchedId = 'bose-qc-ultra';
      matchedName = 'Bose QuietComfort Ultra';
    } else {
      // Find direct product match from catalog
      const found = PRODUCTS.find((p) =>
        lower.includes(p.name.toLowerCase()) || lower.includes(p.brand.toLowerCase())
      );
      if (found) {
        matchedId = found.id;
        matchedName = found.name;
      }
    }

    setSelectedProductId(matchedId);
    setSearchQuery(text);

    if (isUrlInput || searchMode === 'link') {
      if (showToast) {
        showToast(`🔗 Checked online link for ${matchedName}! Comparing stores...`, 'success');
      }
      // Scroll to comparison section or switch to compare view
      const compEl = document.getElementById('price-comparison-section');
      if (compEl) {
        compEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        setActiveNav('compare');
      }
    } else {
      setActiveNav('search');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue && inputValue.trim().length >= 2) {
      setSearchQuery(inputValue.trim());
      setActiveNav('compare');
    }
  };

  const handleChip = (term) => {
    setInputValue(term);
    setSearchQuery(term);
    setActiveNav('compare');
  };

  const handleSampleLinkClick = (sample) => {
    setSearchMode('link');
    setInputValue(sample.url);
    setSelectedProductId(sample.productId);
    setSearchQuery(sample.url);
    if (showToast) {
      showToast(`🔗 Loaded ${sample.store} online link for ${sample.label.split(':')[1]}!`, 'success');
    }
    const compEl = document.getElementById('price-comparison-section');
    if (compEl) {
      compEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveNav('compare');
    }
  };

  return (
    <div className="db-hero-premium-section">
      <div className="db-hero-premium-card">
        {/* Subtle decorative background glow */}
        <div className="db-hero-glow-1" />
        <div className="db-hero-glow-2" />

        <div className="db-hero-inner-content">
          <div className="db-hero-badge-pill">
            <Sparkles size={13} className="db-hero-sparkle" />
            <span>Price History &amp; Cheapest Store Finder</span>
          </div>

          <h1 className="db-hero-headline">
            Price History &amp; <span>Multi-Store Tracker</span>
          </h1>
          <p className="db-hero-description">
            Find where your product is cheapest across <strong>Flipkart, Amazon, Croma, and Reliance Digital</strong>. Paste any product link or search directly to check price drop history, buy recommendations, and active coupons.
          </p>

          {/* Search Mode Switcher */}
          <div className="db-search-mode-switcher">
            <button
              type="button"
              className={`db-search-mode-btn ${searchMode === 'keyword' ? 'active' : ''}`}
              onClick={() => setSearchMode('keyword')}
            >
              <Search size={14} /> Search by Product
            </button>
            <button
              type="button"
              className={`db-search-mode-btn ${searchMode === 'link' ? 'active' : ''}`}
              onClick={() => setSearchMode('link')}
            >
              <Link2 size={14} /> Check by Store Link
              <span className="db-mode-badge-live">Paste URL</span>
            </button>
          </div>

          {/* Premium Search / Link Field */}
          <form className="db-hero-search-box" onSubmit={handleSubmit}>
            {searchMode === 'link' || isUrlInput ? (
              <Globe size={20} className="db-search-icon-hero" style={{ color: 'var(--db-primary)' }} />
            ) : (
              <Search size={20} className="db-search-icon-hero" />
            )}

            <input
              type="text"
              className="db-search-input-hero"
              placeholder={
                searchMode === 'link'
                  ? 'Paste Flipkart, Amazon, Croma, or Reliance product link...'
                  : 'Search smartphones, laptops, headphones, or paste store link...'
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />

            {/* Quick Paste Button when in link mode or empty */}
            {searchMode === 'link' && (
              <button
                type="button"
                className="db-paste-action-btn"
                onClick={handlePasteFromClipboard}
                title="Paste URL from Clipboard"
              >
                <Clipboard size={12} /> Paste Link
              </button>
            )}

            {/* Detected Store Tag or Store Badges */}
            {detectedStore ? (
              <span className="db-detected-store-badge">
                <CheckCircle2 size={12} /> {detectedStore} Link Detected
              </span>
            ) : (
              <div className="db-search-stores-inline">
                <span className="db-store-tag">🛍️ Flipkart</span>
                <span className="db-store-tag">🛒 Amazon</span>
                <span className="db-store-tag">🏪 Croma</span>
              </div>
            )}

            <button type="submit" className="db-search-submit-btn">
              {searchMode === 'link' || isUrlInput ? (
                <>
                  Find Cheapest Price <ArrowRight size={15} />
                </>
              ) : (
                <>
                  Compare Stores <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Sample Online Product Links Bar (When in Link Mode or Always Available) */}
          {searchMode === 'link' ? (
            <div className="db-quick-links-row">
              <span className="db-trending-label">Try Sample Links:</span>
              {SAMPLE_STORE_LINKS.map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  className="db-quick-link-pill"
                  onClick={() => handleSampleLinkClick(sample)}
                >
                  <Link2 size={11} color="var(--db-primary)" />
                  <span>{sample.label}</span>
                </button>
              ))}
            </div>
          ) : (
            /* Trending Searches */
            <div className="db-hero-trending-row">
              <span className="db-trending-label">Trending Searches:</span>
              {POPULAR_SEARCHES.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  className="db-trending-pill"
                  onClick={() => handleChip(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Trust Highlights */}
          <div className="db-hero-trust-row" style={{ marginTop: '1.35rem', marginBottom: 0 }}>
            <div className="db-trust-card">
              <ShieldCheck size={16} className="db-trust-card-icon green" />
              <span>100+ Verified Stores</span>
            </div>
            <div className="db-trust-card">
              <Zap size={16} className="db-trust-card-icon blue" />
              <span>Live Online URL Inspector</span>
            </div>
            <div className="db-trust-card">
              <IndianRupee size={16} className="db-trust-card-icon purple" />
              <span>₹3,240 Avg. User Savings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
