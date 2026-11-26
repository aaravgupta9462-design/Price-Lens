import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ArrowRight,
  Sparkles,
  Layers,
  BarChart2,
  Bell,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  ExternalLink,
  Link as LinkIcon,
  ClipboardPaste,
  Clock,
  Zap,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { PRODUCTS, registerRealProduct } from '../../data/mockData';
import { apiService } from '../../services/api';
import StoreLogo from './StoreLogo';
import AnimatedBackground from '../common/AnimatedBackground';

const POPULAR_CHIPS = [
  { name: 'iPhone 16 Pro', id: 'iphone-16-128' },
  { name: 'Sony WH-1000XM5', id: 'sony-xm5' },
  { name: 'MacBook Air M3', id: 'macbook-air-m3' },
  { name: 'ASUS TUF Gaming', id: 'asus-tuf-f15' },
  { name: 'boAt Wave Call', id: 'boat-wave-call-plus' },
];

const AUTOCOMPLETE_SUGGESTIONS = [
  {
    id: 'iphone-16-128',
    name: 'iPhone 16 (128GB)',
    category: 'Smartphones',
    lowestPrice: '₹69,990',
    store: 'Amazon',
    image: '/products/iphone-16.jpg',
  },
  {
    id: 'sony-xm5',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    category: 'Audio',
    lowestPrice: '₹24,990',
    store: 'Flipkart',
    image: '/products/sony-xm5.jpg',
  },
  {
    id: 'asus-tuf-f15',
    name: 'ASUS TUF Gaming F15 Laptop',
    category: 'Laptops',
    lowestPrice: '₹62,990',
    store: 'Amazon',
    image: '/products/asus-f15.jpg',
  },
  {
    id: 'boat-wave-call-plus',
    name: 'boAt Wave Call Plus Smartwatch',
    category: 'Wearables',
    lowestPrice: '₹1,199',
    store: 'Flipkart',
    image: '/products/boat-watch.jpg',
  },
];

export const Hero = () => {
  const {
    searchQuery,
    setSearchQuery,
    setSelectedProductId,
    setActiveNav,
    viewPriceComparison,
    showToast,
    setCustomStoreLink,
  } = useDashboard();

  const [inputVal, setInputVal] = useState(searchQuery || '');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'link'
  const searchContainerRef = useRef(null);

  // Close autocomplete on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const resolveProductFromQuery = (query) => {
    const lower = query.toLowerCase();
    if (lower.includes('iphone 16') || lower.includes('iphone-16')) {
      return 'iphone-16-128';
    } else if (lower.includes('sony') && (lower.includes('xm5') || lower.includes('headphone'))) {
      return 'sony-xm5';
    } else if (lower.includes('asus') && lower.includes('tuf')) {
      return 'asus-tuf-f15';
    } else if (lower.includes('macbook air m3') || lower.includes('macbook-air-m3')) {
      return 'macbook-air-m3';
    } else if (lower.includes('boat wave') || lower.includes('boat-wave')) {
      return 'boat-wave-call-plus';
    } else if (lower.includes('samsung') && lower.includes('s25')) {
      return 'samsung-s25';
    }
    // Return null for uncatalogued queries / new models (e.g. iPhone 17 Pro)
    return null;
  };

  const detectLinkInfo = (val) => {
    if (!val || typeof val !== 'string') return null;
    const str = val.trim();
    const isUrl =
      str.startsWith('http://') ||
      str.startsWith('https://') ||
      str.includes('amazon.') ||
      str.includes('flipkart.') ||
      str.includes('croma.') ||
      str.includes('reliancedigital.') ||
      str.includes('myntra.') ||
      str.includes('tatacliq.') ||
      (str.includes('.com') && str.includes('/')) ||
      (str.includes('.in') && str.includes('/'));

    if (!isUrl) return null;

    let store = 'Store';
    let isSupportedNow = false;
    const cleanUrl = str.startsWith('http') ? str : `https://${str}`;

    if (str.includes('amazon.')) {
      store = 'Amazon';
      isSupportedNow = true;
    } else if (str.includes('flipkart.')) {
      store = 'Flipkart';
      isSupportedNow = true;
    } else if (str.includes('croma.')) {
      store = 'Croma';
      isSupportedNow = false;
    } else if (str.includes('reliancedigital.')) {
      store = 'Reliance Digital';
      isSupportedNow = false;
    } else if (str.includes('myntra.')) {
      store = 'Myntra';
      isSupportedNow = false;
    } else if (str.includes('tatacliq.')) {
      store = 'Tata CLiQ';
      isSupportedNow = false;
    }

    const targetProductId = resolveProductFromQuery(str);
    const matchedProduct = targetProductId ? PRODUCTS.find((p) => p.id === targetProductId) : null;

    // Extract clean product title from URL path slug when not in local catalog
    let extractedTitle = matchedProduct?.name || null;
    if (!extractedTitle) {
      try {
        const parsed = new URL(cleanUrl);
        const segs = parsed.pathname
          .split('/')
          .map((s) => s.trim())
          .filter((s) => s.length > 3 && !/^(dp|gp|product|p|s|itm[a-z0-9]+|[A-Z0-9]{10})$/i.test(s));
        if (segs[0]) {
          extractedTitle = decodeURIComponent(segs[0])
            .replace(/[-_+]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 64);
        }
      } catch {
        // Ignore malformed URL
      }
    }

    return {
      isUrl: true,
      url: cleanUrl,
      store,
      isSupportedNow,
      productId: targetProductId,
      productName: extractedTitle || `${store} Product Link`,
      productPrice: matchedProduct ? matchedProduct.currentPrice : null,
    };
  };

  const linkInfo = detectLinkInfo(inputVal);

  const handleOpenStoreDirect = (url, storeName) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      if (showToast) {
        showToast(`Redirecting directly to purchase on ${storeName}...`, 'success');
      }
    }
  };

  const handleViewPriceList = async (info) => {
    const target = info || linkInfo;
    if (target) {
      if (setCustomStoreLink) {
        setCustomStoreLink({ store: target.store, url: target.url });
      }
      if (target.productId) {
        setSelectedProductId(target.productId);
      }
      setSearchQuery(target.productName);
      if (showToast) {
        showToast(`Fetching live Amazon & Flipkart prices for ${target.productName}...`, 'info');
      }

      // Attempt live backend URL resolution (Rainforest / ScrapingBee / SerpApi)
      try {
        const resolved = await apiService.resolveProductUrl(target.url);
        if (resolved && resolved.productName) {
          const livePrice = resolved.liveMetadata?.price;
          const amzOffer = resolved.amazonOffer;
          const fkOffer = resolved.flipkartOffer;
          const baseRefPrice =
            livePrice || amzOffer?.price || fkOffer?.price || resolved.comparison?.lowestPrice || 49990;
          const customId = `url-${(resolved.asin || resolved.pid || Date.now()).toString().toLowerCase()}`;

          const amazonPrice =
            (resolved.store === 'Amazon' && livePrice) || amzOffer?.price || null;
          const flipkartPrice =
            (resolved.store === 'Flipkart' && livePrice) || fkOffer?.price || null;
          const validRef = amazonPrice || flipkartPrice || baseRefPrice;

          registerRealProduct({
            id: customId,
            name: resolved.productName,
            brand: resolved.store,
            category: 'Mobiles',
            image: resolved.liveMetadata?.image || amzOffer?.imageUrl || fkOffer?.imageUrl || '/products/iphone-16.jpg',
            rating: resolved.liveMetadata?.rating || amzOffer?.rating || 4.5,
            amazonPrice,
            flipkartPrice,
            originalPrice:
              resolved.liveMetadata?.originalPrice ||
              Math.round((Math.max(amazonPrice || 0, flipkartPrice || 0) || validRef) * 1.15),
            amazonUrl:
              resolved.store === 'Amazon'
                ? resolved.url
                : (amzOffer?.url && amzOffer.url.includes('amazon.')
                    ? amzOffer.url
                    : `https://www.amazon.in/s?k=${encodeURIComponent(resolved.productName)}&s=price-asc-rank`),
            flipkartUrl:
              resolved.store === 'Flipkart'
                ? resolved.url
                : (fkOffer?.url && fkOffer.url.includes('flipkart.')
                    ? fkOffer.url
                    : `https://www.flipkart.com/search?q=${encodeURIComponent(resolved.productName)}&sort=price_asc`),
          });

          setSelectedProductId(customId);
          setSearchQuery(resolved.productName);
          if (showToast) {
            showToast(`Live Amazon & Flipkart prices loaded for ${resolved.productName}!`, 'success');
          }
        }
      } catch (err) {
        if (showToast) {
          showToast(
            `Could not reach live price server for ${target.productName}. Please ensure backend is running on port 5001.`,
            'error'
          );
        }
      }
    }
    const compareEl = document.getElementById('price-comparison-section');
    if (compareEl) {
      compareEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const query = inputVal.trim() || 'iPhone 16';

    const detected = detectLinkInfo(query);
    if (detected) {
      handleViewPriceList(detected);
      return;
    }

    setSearchQuery(query);
    setIsSearchFocused(false);

    const targetId = resolveProductFromQuery(query);
    if (targetId) {
      setSelectedProductId(targetId);
      if (showToast) {
        showToast(`Auditing live prices & history for ${query}...`, 'success');
      }
      const compareEl = document.getElementById('price-comparison-section');
      if (compareEl) {
        compareEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Route uncatalogued searches to full search screen with filters
      setActiveNav('search');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (showToast) {
        showToast(`Searching PriceLens catalog for "${query}"...`, 'info');
      }
    }
  };

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setInputVal(text.trim());
          setActiveTab('link');
          if (showToast) {
            showToast('Link pasted from clipboard! Click Track Graph to audit.', 'success');
          }
          return;
        }
      }
    } catch (err) {
      // Permission blocked or insecure origin
    }
    setActiveTab('link');
    if (showToast) {
      showToast('Paste mode active: please paste your URL (Cmd/Ctrl + V)', 'info');
    }
  };

  const handleSelectSuggestion = (sug) => {
    setInputVal(sug.name);
    setSearchQuery(sug.name);
    setSelectedProductId(sug.id);
    setIsSearchFocused(false);

    const compareEl = document.getElementById('price-comparison-section');
    if (compareEl) {
      compareEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleChipClick = (chip) => {
    setInputVal(chip.name);
    setSearchQuery(chip.name);
    setSelectedProductId(chip.id);

    const compareEl = document.getElementById('price-comparison-section');
    if (compareEl) {
      compareEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pl-cinematic-hero-section">
      {/* Living Price Graph Animated Background */}
      <AnimatedBackground />

      {/* Asymmetrical 2-Column Hero Grid */}
      <div className="pl-cinematic-hero-grid">
        {/* Left Column: Editorial Content & Refined Search */}
        <div className="pl-hero-editorial-col">
          {/* Eyebrow Label */}
          <div className="pl-hero-eyebrow-pill">
            <span className="pl-eyebrow-dot" />
            <span className="pl-eyebrow-text">SMART SHOPPING INTELLIGENCE</span>
          </div>

          {/* Editorial Headline */}
          <h1 className="pl-editorial-headline">
            Find the{' '}
            <span className="pl-headline-display-accent">
              best price
              {/* Subtle hand-drawn underline SVG */}
              <svg
                className="pl-handdrawn-underline"
                viewBox="0 0 250 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 10C55 3.5 145 2.5 247 9.5"
                  stroke="url(#underlineGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="underlineGrad" x1="3" y1="10" x2="247" y2="9.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6842FF" />
                    <stop offset="0.5" stopColor="#3478F6" />
                    <stop offset="1" stopColor="#119B67" />
                  </linearGradient>
                </defs>
              </svg>
            </span>{' '}
            <br />
            before you buy.
          </h1>

          {/* Supporting Copy */}
          <p className="pl-editorial-subtext">
            PriceLens monitors real-time prices across <strong>Amazon &amp; Flipkart</strong>. Audit 1-year historical curves, uncover fake festive markups, and purchase at the verified lowest price. (More stores coming in future updates)
          </p>

          {/* Premium Functional Search & Paste Engine */}
          <div className="pl-search-composite-wrapper" ref={searchContainerRef}>
            <form
              className={`pl-premium-search-bar ${isSearchFocused ? 'focused' : ''}`}
              onSubmit={handleSearchSubmit}
            >
              <div className="pl-search-input-prefix">
                <Search size={20} className="pl-search-icon" />
              </div>

              <input
                type="text"
                className="pl-premium-search-input"
                placeholder={
                  activeTab === 'link'
                    ? 'Paste product link from Amazon or Flipkart...'
                    : 'Search products or paste any Amazon / Flipkart store link...'
                }
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
              />

              {/* Compact Quick Paste Button */}
              <button
                type="button"
                className="pl-paste-clipboard-btn"
                onClick={handlePasteClipboard}
                title="Paste link from clipboard"
              >
                <ClipboardPaste size={13} />
                <span>Paste</span>
              </button>

              {/* Single High-End Primary Action Button */}
              <button
                type="submit"
                className="pl-premium-search-action-btn"
                title="Search and track prices across stores"
              >
                <Zap size={14} fill="#FFFFFF" />
                <span>Track &amp; Compare</span>
                <ArrowRight size={14} />
              </button>
            </form>

            {/* Smart URL Detection Card for Pasted Links */}
            {linkInfo && (
              <div className="pl-link-detected-card">
                <div className="pl-link-detected-left">
                  <div className="pl-link-store-badge">
                    <StoreLogo store={linkInfo.store} size="xs" />
                    <span>
                      {linkInfo.isSupportedNow
                        ? `Verified ${linkInfo.store} Link`
                        : `${linkInfo.store} (Future Update — Amazon & Flipkart Active)`}
                    </span>
                  </div>
                  <span className="pl-link-detected-title">
                    {linkInfo.productName}
                  </span>
                </div>
                <div className="pl-link-detected-actions">
                  <button
                    type="button"
                    className="pl-link-btn-compare"
                    onClick={() => handleViewPriceList(linkInfo)}
                    title="View Amazon & Flipkart Price Comparison List"
                  >
                    <Layers size={13} />
                    <span>View Price List</span>
                  </button>
                  <button
                    type="button"
                    className="pl-link-btn-store"
                    onClick={() => handleOpenStoreDirect(linkInfo.url, linkInfo.store)}
                    title={`Purchase on ${linkInfo.store}`}
                  >
                    <span>Buy on {linkInfo.store}</span>
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            )}

            {/* Autocomplete Dropdown */}
            {isSearchFocused && (
              <div className="pl-search-autocomplete-dropdown">
                <div className="pl-autocomplete-header">
                  <div className="pl-auto-section-title">
                    <Clock size={12} />
                    <span>RECENT &amp; TRENDING TRACKERS</span>
                  </div>
                </div>

                <div className="pl-autocomplete-list">
                  {AUTOCOMPLETE_SUGGESTIONS.map((sug) => (
                    <div
                      key={sug.id}
                      className="pl-autocomplete-item"
                      onMouseDown={() => handleSelectSuggestion(sug)}
                    >
                      <img
                        src={sug.image}
                        alt={sug.name}
                        className="pl-auto-thumb"
                      />
                      <div className="pl-auto-meta">
                        <span className="pl-auto-name">{sug.name}</span>
                        <span className="pl-auto-category">{sug.category}</span>
                      </div>
                      <div className="pl-auto-price-col">
                        <span className="pl-auto-price">{sug.lowestPrice}</span>
                        <span className="pl-auto-store-tag">Best on {sug.store}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pl-autocomplete-footer">
                  <span className="pl-auto-hint">
                    Press <kbd>Enter</kbd> to track or click any gadget to audit full price history
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Compact Trending Searches Beneath Field */}
          <div className="pl-hero-trending-row">
            <span className="pl-trending-label">Trending:</span>
            <div className="pl-trending-chips">
              {POPULAR_CHIPS.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  className="pl-trending-chip-item"
                  onClick={() => handleChipClick(chip)}
                >
                  <span>{chip.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Compact Feature Indicators (Compare, Price History, Alerts) */}
          <div className="pl-hero-feature-pills-row">
            <div className="pl-feature-indicator-pill">
              <Layers size={14} className="pl-feature-icon" />
              <span>Amazon &amp; Flipkart Live</span>
            </div>
            <div className="pl-feature-indicator-pill">
              <BarChart2 size={14} className="pl-feature-icon" />
              <span>Keepa-Style History</span>
            </div>
            <div className="pl-feature-indicator-pill">
              <Bell size={14} className="pl-feature-icon" />
              <span>Price-Drop Alerts</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Product Stage with Floating Connected Data Panels */}
        <div className="pl-hero-stage-col">
          <div className="pl-stage-perspective-wrapper">
            {/* Ambient Lighting Gradient Orbs */}
            <div className="pl-ambient-glow-lavender" />
            <div className="pl-ambient-glow-blue" />

            {/* Central Product Showcase Stage */}
            <div className="pl-stage-central-showcase">
              {/* Luminous Glow Base Under Devices */}
              <div className="pl-stage-luminous-base" />

              {/* Elevated Device Frame */}
              <div className="pl-stage-device-frame">
                <img
                  src="/products/hero-stage.jpg"
                  alt="PriceLens Featured Product Stage - iPhone 16 Pro & Studio Headphones"
                  className="pl-stage-hero-image"
                  loading="eager"
                />
                <div className="pl-stage-image-overlay" />
              </div>

              {/* Floating Data Panel 1: Amazon (BEST PRICE - Refined Emerald) */}
              <div className="pl-floating-panel panel-amazon">
                <div className="pl-panel-header">
                  <StoreLogo store="amazon" size="sm" />
                  <span className="pl-panel-best-price-badge">
                    <CheckCircle2 size={10} />
                    <span>BEST PRICE</span>
                  </span>
                </div>
                <div className="pl-panel-price-row">
                  <span className="pl-panel-price">₹69,990</span>
                  <span className="pl-panel-original">₹1,19,900</span>
                </div>
                <div className="pl-panel-savings-chip">
                  <TrendingDown size={11} />
                  <span>Save ₹5,009 vs Other Stores</span>
                </div>
              </div>

              {/* Floating Data Panel 2: Flipkart Offer */}
              <div className="pl-floating-panel panel-flipkart">
                <div className="pl-panel-header">
                  <StoreLogo store="flipkart" size="sm" />
                  <span className="pl-panel-diff-badge">+₹1,509</span>
                </div>
                <div className="pl-panel-price-row">
                  <span className="pl-panel-price">₹71,499</span>
                </div>
                <span className="pl-panel-delivery-note">Free 2-Day Delivery</span>
              </div>

              {/* Floating Data Panel 3: Future Stores Roadmap */}
              <div className="pl-floating-panel panel-future-stores">
                <div className="pl-panel-header">
                  <span className="pl-future-pill-tag">FUTURE UPDATE</span>
                  <span className="pl-future-status-pill">Roadmap</span>
                </div>
                <div className="pl-future-content-row">
                  <span className="pl-future-store-names">+ Croma &amp; Reliance</span>
                </div>
                <span className="pl-panel-delivery-note">In Active Development</span>
              </div>

              {/* Floating Mini Historical Price Chart */}
              <div className="pl-floating-chart-panel">
                <div className="pl-mini-chart-header">
                  <span className="pl-mini-chart-title">90-Day Trend</span>
                  <span className="pl-mini-drop-badge">-22% Drop</span>
                </div>
                <svg className="pl-mini-sparkline-svg" viewBox="0 0 110 32" fill="none">
                  <defs>
                    <linearGradient id="sparklineArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#119B67" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#119B67" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M3 26 L22 20 L44 23 L66 12 L88 17 L107 6 L107 32 L3 32 Z"
                    fill="url(#sparklineArea)"
                  />
                  <path
                    d="M3 26 L22 20 L44 23 L66 12 L88 17 L107 6"
                    stroke="#119B67"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="107" cy="6" r="3" fill="#119B67" />
                </svg>
                <span className="pl-mini-chart-sub">Lowest price in 90 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
