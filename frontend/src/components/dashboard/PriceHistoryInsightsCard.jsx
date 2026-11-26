import React, { useState } from 'react';
import { Bell, Check, TrendingDown, Star, Sparkles, AlertCircle } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { PRICE_HISTORY_DATA, formatPrice } from '../../data/mockData';

const TIMELINE_OPTIONS = [
  { key: '7D', label: '7-Day' },
  { key: '30D', label: '30-Day' },
  { key: '3M', label: '3-Month' },
  { key: '6M', label: '6-Month' },
  { key: '1Y', label: '1-Year' },
];

export const PriceHistoryInsightsCard = () => {
  const { selectedProductId, showToast, priceAlerts, setPriceAlerts } = useDashboard();
  const [selectedTimeline, setSelectedTimeline] = useState('30D');
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);
  const [isAlertSet, setIsAlertSet] = useState(false);

  const historyData =
    PRICE_HISTORY_DATA[selectedProductId] ||
    PRICE_HISTORY_DATA['iphone-16-128'];

  // Map timeline key to mockData timelines key
  const timelineKeyMap = {
    '7D': '7D',
    '30D': '30D',
    '3M': '3M',
    '6M': '6M',
    '1Y': '1Y',
  };

  const points =
    historyData.timelines[timelineKeyMap[selectedTimeline]] ||
    historyData.timelines['30D'] ||
    historyData.timelines['1M'] ||
    [];

  // Chart dimensions & scaling (Optimized for dedicated full-width section)
  const chartWidth = 980;
  const chartHeight = 220;
  const paddingLeft = 20;
  const paddingRight = 32;
  const paddingTop = 26;
  const paddingBottom = 28;

  // Min and max for Y scale calculation
  const pricesList = points.map((p) => p.price);
  const minP = Math.min(...pricesList, historyData.lowest || 67999);
  const maxP = Math.max(...pricesList, historyData.highest || 119900);
  const yMin = Math.floor(minP * 0.95 / 10000) * 10000;
  const yMax = Math.ceil(maxP * 1.05 / 10000) * 10000;

  // Find lowest price index in current points
  const lowestPointIdx = points.reduce(
    (minIdx, pt, idx, arr) => (pt.price < arr[minIdx].price ? idx : minIdx),
    0
  );

  const getCoordinates = (index, price) => {
    const xStep = (chartWidth - paddingLeft - paddingRight) / Math.max(points.length - 1, 1);
    const x = paddingLeft + index * xStep;
    const clampedPrice = Math.max(yMin, Math.min(yMax, price));
    const normalizedY = (clampedPrice - yMin) / Math.max(yMax - yMin, 1);
    const y = chartHeight - paddingBottom - normalizedY * (chartHeight - paddingTop - paddingBottom);
    return { x, y };
  };

  const coordsList = points.map((pt, idx) => getCoordinates(idx, pt.price));

  // Generate SVG path for line and area
  const linePath = coordsList.reduce((acc, curr, idx) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = coordsList[idx - 1];
    const cpX1 = prev.x + (curr.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (curr.x - prev.x) / 2;
    const cpY2 = curr.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
  }, '');

  const areaPath = coordsList.length > 0
    ? `${linePath} L ${coordsList[coordsList.length - 1].x} ${chartHeight - paddingBottom} L ${coordsList[0].x} ${chartHeight - paddingBottom} Z`
    : '';

  const activeIdx = hoveredPointIndex !== null ? hoveredPointIndex : points.length - 1;
  const activePoint = points[activeIdx] || points[points.length - 1];
  const activeCoord = coordsList[activeIdx] || coordsList[coordsList.length - 1];
  const lowestCoord = coordsList[lowestPointIdx];

  const handleSetAlert = () => {
    setIsAlertSet(true);
    showToast(`Price Alert active for ${formatPrice(historyData.current)}! You will be notified on price drops.`, 'success');
  };

  return (
    <div className="pl-history-insights-card">
      {/* Header with Timeline Filters */}
      <div className="pl-history-card-header">
        <div className="pl-history-header-title-col">
          <span className="pl-history-eyebrow">KEEPA-STYLE TELEMETRY</span>
          <h3 className="pl-history-card-title">Interactive price history</h3>
        </div>

        <div className="pl-timeline-filters-group">
          {TIMELINE_OPTIONS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`pl-timeline-filter-btn ${selectedTimeline === t.key ? 'active' : ''}`}
              onClick={() => {
                setSelectedTimeline(t.key);
                setHoveredPointIndex(null);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Keepa-style Chart Container */}
      <div className="pl-chart-container">
        {/* Y-Axis Price Labels */}
        <div className="pl-chart-y-axis">
          <span>{formatPrice(yMax)}</span>
          <span>{formatPrice(Math.round((yMax * 0.75 + yMin * 0.25) / 1000) * 1000)}</span>
          <span>{formatPrice(Math.round((yMax * 0.5 + yMin * 0.5) / 1000) * 1000)}</span>
          <span>{formatPrice(Math.round((yMax * 0.25 + yMin * 0.75) / 1000) * 1000)}</span>
          <span>{formatPrice(yMin)}</span>
        </div>

        {/* SVG Drawing Canvas */}
        <div className="pl-chart-canvas-wrapper">
          <svg
            className="pl-chart-svg"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="plAreaGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6842FF" stopOpacity="0.22" />
                <stop offset="60%" stopColor="#3478F6" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#3478F6" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
              const y = paddingTop + pct * (chartHeight - paddingTop - paddingBottom);
              return (
                <line
                  key={idx}
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  stroke="#E3E6F0"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              );
            })}

            {/* Area Fill */}
            {areaPath && <path d={areaPath} fill="url(#plAreaGlow)" />}

            {/* Main Price Line */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="#6842FF"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Lowest Recorded Marker Pin on Chart */}
            {lowestCoord && (
              <g className="pl-lowest-marker-pin-group">
                <circle
                  cx={lowestCoord.x}
                  cy={lowestCoord.y}
                  r={8}
                  fill="#119B67"
                  fillOpacity="0.25"
                />
                <circle
                  cx={lowestCoord.x}
                  cy={lowestCoord.y}
                  r={4.5}
                  fill="#119B67"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              </g>
            )}

            {/* Circular Data Points */}
            {coordsList.map((coord, idx) => {
              const isSelected = activeIdx === idx;
              const isLowest = idx === lowestPointIdx;

              return (
                <g key={idx} className="pl-chart-point-group">
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r={isSelected ? 6 : (isLowest ? 5 : 3.5)}
                    fill="#FFFFFF"
                    stroke={isLowest ? '#119B67' : '#6842FF'}
                    strokeWidth={isSelected ? 3 : 2}
                    className="pl-chart-point-circle"
                  />
                  {/* Invisible larger hover hit area */}
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r={20}
                    fill="transparent"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredPointIndex(idx)}
                  />
                </g>
              );
            })}
          </svg>

          {/* Floating Tooltip at active data point */}
          {activePoint && activeCoord && (
            <div
              className="pl-chart-active-tooltip"
              style={{
                left: `${(activeCoord.x / chartWidth) * 100}%`,
                top: `${(activeCoord.y / chartHeight) * 100}%`,
              }}
            >
              <div className="pl-tooltip-price-row">
                <span className="pl-tooltip-price">{formatPrice(activePoint.price)}</span>
                {activeIdx === lowestPointIdx && (
                  <span className="pl-tooltip-lowest-tag">Lowest Recorded</span>
                )}
              </div>
              <span className="pl-tooltip-date">{activePoint.date || activePoint.label}</span>
            </div>
          )}

          {/* X-Axis Date Labels */}
          <div className="pl-chart-x-axis">
            {points.map((pt, idx) => (
              <span
                key={idx}
                className={`pl-x-label ${activeIdx === idx ? 'active' : ''}`}
                onMouseEnter={() => setHoveredPointIndex(idx)}
              >
                {pt.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Bottom Summary Metrics Required by Prompt */}
      <div className="pl-history-card-footer">
        <div className="pl-history-metrics-quad">
          <div className="pl-history-metric-col">
            <span className="pl-metric-sublabel">Current Price</span>
            <span className="pl-metric-val">{formatPrice(historyData.current)}</span>
          </div>

          <div className="pl-history-metric-col">
            <span className="pl-metric-sublabel">Lowest Recorded</span>
            <span className="pl-metric-val green">{formatPrice(historyData.lowest || 67999)}</span>
          </div>

          <div className="pl-history-metric-col">
            <span className="pl-metric-sublabel">Highest Recorded</span>
            <span className="pl-metric-val">{formatPrice(historyData.highest || 109900)}</span>
          </div>

          <div className="pl-history-metric-col">
            <span className="pl-metric-sublabel">Average Price</span>
            <span className="pl-metric-val">{formatPrice(historyData.average || 81500)}</span>
          </div>
        </div>

        <button
          type="button"
          className={`pl-set-alert-btn ${isAlertSet ? 'active' : ''}`}
          onClick={handleSetAlert}
        >
          {isAlertSet ? (
            <>
              <Check size={15} />
              <span>Alert Active</span>
            </>
          ) : (
            <>
              <Bell size={15} />
              <span>Set Price Alert</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PriceHistoryInsightsCard;
