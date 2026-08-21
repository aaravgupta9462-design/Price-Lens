import React, { useState } from 'react';
import { TrendingDown, TrendingUp, Calendar, Info, Scale, ArrowRight } from 'lucide-react';
import { PRODUCTS, PRICE_HISTORY_DATA, formatPrice } from '../../../data/mockData';
import { useDashboard } from '../../../context/DashboardContext';

const PriceHistoryScreen = () => {
  const { selectedProductId, setSelectedProductId, viewPriceComparison } = useDashboard();
  const [timeline, setTimeline] = useState('30D');

  const currentProduct =
    PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];
  const historyData =
    PRICE_HISTORY_DATA[currentProduct.id] || PRICE_HISTORY_DATA['iphone-16-128'];

  const points = historyData.timelines[timeline] || historyData.timelines['30D'];

  const minPriceInTimeline = Math.min(...points.map((p) => p.price));
  const maxPriceInTimeline = Math.max(...points.map((p) => p.price));

  return (
    <div className="db-page-fade">
      <div className="db-screen-header">
        <h1 className="db-screen-title">Price History</h1>
        <p className="db-screen-subtitle">
          Understand how a product's price has fluctuated across sales cycles and retail drops.
        </p>
      </div>

      {/* Product Selector */}
      <div className="db-selector-scroll-wrap">
        <span className="db-selector-label">Select Tracked Product:</span>
        <div className="db-selector-scroll-list">
          {PRODUCTS.map((prod) => (
            <button
              key={prod.id}
              className={`db-selector-pill ${prod.id === currentProduct.id ? 'active' : ''}`}
              onClick={() => setSelectedProductId(prod.id)}
            >
              <span>{prod.emoji}</span>
              <span>{prod.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="db-stats-row" style={{ marginBottom: '1.5rem' }}>
        <div className="db-stat-box">
          <span className="db-stat-label-clean">Current Listed Price</span>
          <div className="db-stat-number">{formatPrice(historyData.current)}</div>
          <div className="db-stat-support" style={{ color: '#16A34A' }}>
            <TrendingDown size={12} style={{ display: 'inline', marginRight: '3px' }} />
            Active lowest store deal
          </div>
        </div>

        <div className="db-stat-box">
          <span className="db-stat-label-clean">All-Time Lowest</span>
          <div className="db-stat-number" style={{ color: '#16A34A' }}>
            {formatPrice(historyData.lowest)}
          </div>
          <div className="db-stat-support">Recorded during seasonal sale</div>
        </div>

        <div className="db-stat-box">
          <span className="db-stat-label-clean">All-Time Highest</span>
          <div className="db-stat-number" style={{ color: '#64748B' }}>
            {formatPrice(historyData.highest)}
          </div>
          <div className="db-stat-support">Launch MSRP retail</div>
        </div>

        <div className="db-stat-box">
          <span className="db-stat-label-clean">Average Price (90D)</span>
          <div className="db-stat-number">{formatPrice(historyData.average)}</div>
          <div className="db-stat-support">Across certified retailers</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="db-card db-card-primary" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.85rem' }}>
          <div>
            <h3 className="db-card-title-sm">{currentProduct.name} — Historical Trend</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--db-text-secondary)' }}>
              Range: {formatPrice(minPriceInTimeline)} – {formatPrice(maxPriceInTimeline)}
            </span>
          </div>

          {/* Timeline Pills */}
          <div className="db-timeline-toggle">
            {['7D', '30D', '3M', '6M'].map((t) => (
              <button
                key={t}
                className={`db-timeline-btn ${timeline === t ? 'active' : ''}`}
                onClick={() => setTimeline(t)}
              >
                {t === '7D' ? '7 Days' : t === '30D' ? '30 Days' : t === '3M' ? '3 Months' : '6 Months'}
              </button>
            ))}
          </div>
        </div>

        {/* Clean, Non-complicated Interactive Chart Visual */}
        <div className="db-chart-container">
          <div className="db-chart-bars-wrap">
            {points.map((pt, idx) => {
              const heightPct =
                maxPriceInTimeline === minPriceInTimeline
                  ? 60
                  : 35 + ((pt.price - minPriceInTimeline) / (maxPriceInTimeline - minPriceInTimeline)) * 55;
              const isLowest = pt.price === minPriceInTimeline;

              return (
                <div key={idx} className="db-chart-col">
                  <div className="db-chart-tooltip">
                    {formatPrice(pt.price)}
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

        <div className="db-chart-foot">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--db-text-secondary)' }}>
            <Info size={14} color="#2563EB" />
            <span>Prices reflect verified seller listings scraped daily. Excludes special coupon codes.</span>
          </div>

          <button
            className="db-btn-clean db-btn-clean-primary"
            onClick={() => viewPriceComparison(currentProduct.id)}
          >
            <Scale size={13} /> Compare Current Stores <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceHistoryScreen;
