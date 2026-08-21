import React, { useState } from 'react';
import { Search, ArrowRight, ShieldCheck, Zap, IndianRupee, Sparkles } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { POPULAR_SEARCHES } from '../../data/mockData';

const Hero = () => {
  const { searchQuery, setSearchQuery, setSelectedProductId, setActiveNav } = useDashboard();
  const [inputValue, setInputValue] = useState(searchQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(inputValue);
    setActiveNav('search');
  };

  const handleChip = (term) => {
    setInputValue(term);
    setSearchQuery(term);
    if (term.toLowerCase().includes('iphone')) setSelectedProductId('iphone-16-128');
    else if (term.toLowerCase().includes('macbook')) setSelectedProductId('macbook-air-m3');
    else if (term.toLowerCase().includes('samsung')) setSelectedProductId('samsung-s25');
    else if (term.toLowerCase().includes('sony')) setSelectedProductId('sony-xm5');
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
            <span>Smart Shopping Intelligence</span>
          </div>

          <h1 className="db-hero-headline">
            Compare prices. Trust reviews. <span>Buy smarter.</span>
          </h1>
          <p className="db-hero-description">
            Track real-time price drops across Amazon, Flipkart, Croma, and 100+ certified stores before making a purchase.
          </p>

          {/* Premium Search Field */}
          <form className="db-hero-search-box" onSubmit={handleSubmit}>
            <Search size={20} className="db-search-icon-hero" />
            <input
              type="text"
              className="db-search-input-hero"
              placeholder="Search smartphones, laptops, audio, or paste store link..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setSearchQuery(e.target.value);
              }}
            />
            <div className="db-search-stores-inline">
              <span className="db-store-tag">Flipkart</span>
              <span className="db-store-tag">Amazon</span>
              <span className="db-store-tag">Croma</span>
            </div>
            <button type="submit" className="db-search-submit-btn">
              Compare Prices <ArrowRight size={15} />
            </button>
          </form>

          {/* Trust Highlights */}
          <div className="db-hero-trust-row">
            <div className="db-trust-card">
              <ShieldCheck size={16} className="db-trust-card-icon green" />
              <span>100+ Verified Stores</span>
            </div>
            <div className="db-trust-card">
              <Zap size={16} className="db-trust-card-icon blue" />
              <span>Live Price Tracking</span>
            </div>
            <div className="db-trust-card">
              <IndianRupee size={16} className="db-trust-card-icon purple" />
              <span>₹3,240 Avg. User Savings</span>
            </div>
          </div>

          {/* Trending Searches */}
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
        </div>
      </div>
    </div>
  );
};

export default Hero;
