import React, { useState, useEffect, useCallback } from 'react';
import {
  TrendingDown,
  TrendingUp,
  Calendar,
  Info,
  Scale,
  ArrowRight,
  Loader2,
  AlertCircle,
  RefreshCw,
  Clock
} from 'lucide-react';
import { PRODUCTS, formatPrice } from '../../../data/mockData';
import { useDashboard } from '../../../context/DashboardContext';
import { apiService } from '../../../services/api';

const PriceHistoryScreen = () => {
  const { selectedProductId, setSelectedProductId, viewPriceComparison } = useDashboard();
  const [timeline, setTimeline] = useState('30D');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historyData, setHistoryData] = useState(null);

  const currentProduct =
    PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];

  const fetchHistory = useCallback(async (productId, selectedTimeline) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiService.getPriceHistory(productId, selectedTimeline);
      setHistoryData(data);
    } catch (err) {
      console.warn('[PriceHistoryScreen] Failed to load history:', err.message);
      setError(err.message || 'Unable to retrieve historical price data.');
      setHistoryData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory(currentProduct.id, timeline);
  }, [currentProduct.id, timeline, fetchHistory]);

  const hasHistory = Boolean(historyData?.hasHistory && historyData?.points?.length > 0);
  const points = historyData?.points || [];

  const minPriceInTimeline = points.length > 0 ? Math.min(...points.map((p) => p.price)) : 0;
  const maxPriceInTimeline = points.length > 0 ? Math.max(...points.map((p) => p.price)) : 0;

  return (
    <div className="db-page-fade">
      {/* Screen Header */}
      <div className="db-screen-header">
        <h1 className="db-screen-title">Price History</h1>
        <p className="db-screen-subtitle">
          Track genuine price changes over time based on real multi-store snapshots recorded by Price Lens.
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

      {/* Error Alert */}
      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1.25rem',
            marginBottom: '1.5rem',
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
            onClick={() => fetchHistory(currentProduct.id, timeline)}
          >
            <RefreshCw size={12} style={{ display: 'inline', marginRight: '4px' }} /> Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="db-card db-card-primary" style={{ padding: '3rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#2563EB' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--db-text-main)' }}>
            Retrieving Historical Price Snapshots...
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--db-text-secondary)', marginTop: '0.35rem' }}>
            Aggregating price readings from store databases.
          </p>
        </div>
      ) : !hasHistory ? (
        /* Empty State */
        <div className="db-card db-card-primary" style={{ padding: '3.5rem 2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: '56px', height: '56px', margin: '0 auto 1.25rem', background: '#EFF6FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
            <Clock size={28} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--db-text-main)', marginBottom: '0.5rem' }}>
            Price history will appear as Price Lens tracks this product.
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--db-text-secondary)', maxWidth: '460px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
            No price snapshots have been recorded yet for <strong>{currentProduct.name}</strong>.
            Trigger a store check now to capture its inaugural price snapshot across Amazon, Flipkart, Croma, and Reliance Digital.
          </p>
          <button
            className="db-btn-clean db-btn-clean-primary"
            style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}
            onClick={() => viewPriceComparison(currentProduct.id)}
          >
            <Scale size={15} style={{ marginRight: '6px' }} /> Check Prices &amp; Track Now
          </button>
        </div>
      ) : (
        <>
          {/* 4 Metric Cards */}
          <div className="db-stats-row" style={{ marginBottom: '1.5rem' }}>
            <div className="db-stat-box">
              <span className="db-stat-label-clean">Current Listed Price</span>
              <div className="db-stat-number">{formatPrice(historyData.currentPrice)}</div>
              <div
                className="db-stat-support"
                style={{
                  color: historyData.priceChangePercentage < 0 ? '#16A34A' : historyData.priceChangePercentage > 0 ? '#DC2626' : '#64748B',
                  fontWeight: 600
                }}
              >
                {historyData.priceChangePercentage < 0 ? (
                  <>
                    <TrendingDown size={13} style={{ display: 'inline', marginRight: '3px' }} />
                    {Math.abs(historyData.priceChangePercentage)}% drop ({timeline})
                  </>
                ) : historyData.priceChangePercentage > 0 ? (
                  <>
                    <TrendingUp size={13} style={{ display: 'inline', marginRight: '3px' }} />
                    +{historyData.priceChangePercentage}% increase ({timeline})
                  </>
                ) : (
                  'Steady price in this period'
                )}
              </div>
            </div>

            <div className="db-stat-box">
              <span className="db-stat-label-clean">All-Time Lowest</span>
              <div className="db-stat-number" style={{ color: '#16A34A' }}>
                {formatPrice(historyData.lowestPrice)}
              </div>
              <div className="db-stat-support">Recorded store drop</div>
            </div>

            <div className="db-stat-box">
              <span className="db-stat-label-clean">All-Time Highest</span>
              <div className="db-stat-number" style={{ color: '#64748B' }}>
                {formatPrice(historyData.highestPrice)}
              </div>
              <div className="db-stat-support">Peak recorded price</div>
            </div>

            <div className="db-stat-box">
              <span className="db-stat-label-clean">90-Day Trend</span>
              <div className="db-stat-number">{formatPrice(historyData.ninetyDayLowest || historyData.averagePrice)}</div>
              <div className="db-stat-support">
                Peak in 90D: {formatPrice(historyData.ninetyDayHighest || historyData.highestPrice)}
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="db-card db-card-primary" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '0.85rem',
              }}
            >
              <div>
                <h3 className="db-card-title-sm">{currentProduct.name} — Historical Trend</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--db-text-secondary)' }}>
                  Range: {formatPrice(minPriceInTimeline)} – {formatPrice(maxPriceInTimeline)} · {historyData.totalSnapshots} recorded snapshot{historyData.totalSnapshots > 1 ? 's' : ''}
                </span>
              </div>

              {/* Timeline Selector Pills */}
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

            {/* Interactive Price Chart */}
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
                        <div><strong>{formatPrice(pt.price)}</strong></div>
                        <div style={{ fontSize: '0.7rem', color: '#93C5FD' }}>
                          {pt.store} {pt.isDevelopmentProvider !== false ? '(Dev Provider)' : ''}
                        </div>
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
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.78rem',
                  color: 'var(--db-text-secondary)',
                }}
              >
                <Info size={14} color="#2563EB" />
                <span>
                  Prices reflect tracked store provider snapshots.
                </span>
              </div>

              <button
                className="db-btn-clean db-btn-clean-primary"
                onClick={() => viewPriceComparison(currentProduct.id)}
              >
                <Scale size={13} /> Compare Current Stores <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PriceHistoryScreen;
