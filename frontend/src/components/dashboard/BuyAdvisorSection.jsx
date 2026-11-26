import React from 'react';
import {
  TrendingDown,
  CheckCircle2,
  Clock,
  Calendar,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { PRODUCTS, PLATFORM_COMPARISONS, formatPrice } from '../../data/mockData';

export const BuyAdvisorSection = () => {
  const { selectedProductId, viewPriceComparison, showToast } = useDashboard();

  const product =
    PRODUCTS.find((p) => p.id === selectedProductId) ||
    PRODUCTS.find((p) => p.id === 'iphone-16-128');

  const comparisons =
    PLATFORM_COMPARISONS[selectedProductId] ||
    PLATFORM_COMPARISONS['iphone-16-128'] ||
    [];

  const lowestOffer = comparisons.find((c) => c.isLowestPrice || c.isBestPrice) || comparisons[0] || {
    platform: 'Amazon',
    price: 69990,
    url: 'https://www.amazon.in',
  };

  const currentPrice = lowestOffer.price || 69990;
  const lowestRecorded = 67999;
  const averagePrice = 74800;
  const highestRecorded = 109900;
  const dealScore = 94; // Out of 100

  const handleOpenStore = () => {
    if (lowestOffer.url) {
      window.open(lowestOffer.url, '_blank', 'noopener,noreferrer');
      showToast(`Redirecting to ${lowestOffer.platform}...`, 'info');
    }
  };

  return (
    <section className="pl-buy-advisor-section" aria-label="Buy Now vs Wait Recommendation">
      <div className="pl-buy-advisor-container">
        {/* Section Header */}
        <div className="pl-section-header-row">
          <div className="pl-section-title-col">
            <div className="pl-section-eyebrow-pill">
              <Zap size={13} className="pl-eyebrow-zap" />
              <span>SHOPPING TIMING INTELLIGENCE</span>
            </div>
            <h2 className="pl-section-title">Buy-now versus wait recommendation</h2>
            <p className="pl-section-subtitle">
              Algorithmic buying recommendation based on 90-day moving price cycles, discount velocity, and upcoming festive sale schedules
            </p>
          </div>
        </div>

        {/* Main Recommendation Card */}
        <div className="pl-advisor-card">
          <div className="pl-advisor-header">
            <div className="pl-advisor-product-meta">
              <span className="pl-advisor-analyzing-tag">ANALYSIS FOR</span>
              <h3 className="pl-advisor-product-name">{product?.name || 'iPhone 16 (128GB)'}</h3>
              <span className="pl-advisor-current-price-tag">
                Current Best: <strong>{formatPrice(currentPrice)}</strong> on {lowestOffer.platform}
              </span>
            </div>

            {/* Deal Score Gauge */}
            <div className="pl-advisor-score-box">
              <div className="pl-advisor-score-circle">
                <svg viewBox="0 0 80 80" className="pl-score-svg">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="#E3E6F0"
                    strokeWidth="6"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="url(#plScoreGradient)"
                    strokeWidth="6"
                    strokeDasharray="213.6"
                    strokeDashoffset={213.6 * (1 - dealScore / 100)}
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)"
                  />
                  <defs>
                    <linearGradient id="plScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#119B67" />
                      <stop offset="100%" stopColor="#3478F6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="pl-score-number-overlay">
                  <span className="pl-score-val">{dealScore}</span>
                  <span className="pl-score-max">/100</span>
                </div>
              </div>
              <div className="pl-score-label-col">
                <span className="pl-score-verdict-title">DEAL INDEX</span>
                <span className="pl-score-verdict-sub">Exceptional Value</span>
              </div>
            </div>
          </div>

          {/* Verdict Banner */}
          <div className="pl-advisor-verdict-banner">
            <div className="pl-verdict-left">
              <div className="pl-verdict-icon-pulse">
                <CheckCircle2 size={22} color="#119B67" />
              </div>
              <div>
                <span className="pl-verdict-pill">RECOMMENDATION</span>
                <h4 className="pl-verdict-headline">BUY NOW — Near 90-Day Low</h4>
                <p className="pl-verdict-summary">
                  The current price is within 2.9% of its historical lowest mark. Waiting carries a 76% likelihood of a price rebound before the next festive sale window.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="pl-verdict-buy-btn"
              onClick={handleOpenStore}
            >
              <span>Buy on {lowestOffer.platform} for {formatPrice(currentPrice)}</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* 3 Decision Drivers Grid */}
          <div className="pl-advisor-drivers-grid">
            <div className="pl-driver-item">
              <div className="pl-driver-icon-circle green">
                <TrendingDown size={18} />
              </div>
              <div className="pl-driver-content">
                <span className="pl-driver-title">Within 2.9% of Lowest Recorded</span>
                <p className="pl-driver-desc">
                  Lowest recorded was {formatPrice(lowestRecorded)} during flash sale. Today's {formatPrice(currentPrice)} is among the top 5% lowest price points recorded all year.
                </p>
              </div>
            </div>

            <div className="pl-driver-item">
              <div className="pl-driver-icon-circle blue">
                <Clock size={18} />
              </div>
              <div className="pl-driver-content">
                <span className="pl-driver-title">Stable Markdown Phase</span>
                <p className="pl-driver-desc">
                  Price dropped {formatPrice(12000)} over the last 30 days. Volatility indicators show price has stabilized at floor levels with high stock velocity.
                </p>
              </div>
            </div>

            <div className="pl-driver-item">
              <div className="pl-driver-icon-circle purple">
                <Calendar size={18} />
              </div>
              <div className="pl-driver-content">
                <span className="pl-driver-title">Upcoming Sale Window: 48 Days</span>
                <p className="pl-driver-desc">
                  Next major Indian e-commerce festival is 48 days away. Historic models show post-launch restocks typically hold or increase price by ₹2,000–₹4,000 in interim.
                </p>
              </div>
            </div>
          </div>

          {/* Historical Benchmarks Bar */}
          <div className="pl-advisor-benchmarks-row">
            <div className="pl-benchmark-col">
              <span className="pl-benchmark-label">All-Time Lowest</span>
              <span className="pl-benchmark-value green">{formatPrice(lowestRecorded)}</span>
              <span className="pl-benchmark-sub">Recorded 28 Sep</span>
            </div>

            <div className="pl-benchmark-col">
              <span className="pl-benchmark-label">30-Day Average</span>
              <span className="pl-benchmark-value">{formatPrice(averagePrice)}</span>
              <span className="pl-benchmark-sub">Across 4 Stores</span>
            </div>

            <div className="pl-benchmark-col">
              <span className="pl-benchmark-label">All-Time Highest</span>
              <span className="pl-benchmark-value">{formatPrice(highestRecorded)}</span>
              <span className="pl-benchmark-sub">Launch MRP</span>
            </div>

            <div className="pl-benchmark-col">
              <span className="pl-benchmark-label">Target Buy Threshold</span>
              <span className="pl-benchmark-value purple">Under ₹70,500</span>
              <span className="pl-benchmark-sub">Achieved Today ✓</span>
            </div>
          </div>

          {/* Transparent Logic Disclaimer */}
          <div className="pl-advisor-disclaimer">
            <ShieldAlert size={14} className="pl-disclaimer-icon" />
            <span>
              <strong>Transparent Mock Logic:</strong> Recommendations are calculated using algorithmic moving averages, recent price volatility, and seasonal calendar metrics from historical demo data. This is not predictive financial advice.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuyAdvisorSection;
