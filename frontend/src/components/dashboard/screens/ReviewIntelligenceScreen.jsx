import React from 'react';
import { Sparkles, ThumbsUp, ThumbsDown, CheckCircle2, AlertTriangle, ShieldAlert, Star, MessageSquare } from 'lucide-react';
import { PRODUCTS, REVIEW_INTELLIGENCE } from '../../../data/mockData';
import { useDashboard } from '../../../context/DashboardContext';

const ReviewIntelligenceScreen = () => {
  const { selectedProductId, setSelectedProductId, viewPriceComparison } = useDashboard();
  const currentProduct = PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];
  const { score, maxScore, breakdown, sentiment, positivePoints, complaintPoints, sampleReviews } = REVIEW_INTELLIGENCE;

  return (
    <div className="db-page-fade">
      <div className="db-screen-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <h1 className="db-screen-title">Review Intelligence</h1>
          <span className="db-badge-soft-blue" style={{ background: '#F5F3FF', color: '#7C3AED', border: '1px solid #DDD6FE' }}>
            <Sparkles size={11} style={{ display: 'inline', marginRight: '3px' }} />
            AI-powered
          </span>
        </div>
        <p className="db-screen-subtitle">
          Understand what customers are really saying. Fake-review pattern screening and automated feedback summarization.
        </p>
      </div>

      {/* Product Selector */}
      <div className="db-selector-scroll-wrap">
        <span className="db-selector-label">Analyzing Reviews For:</span>
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

      {/* Top Section: Trust Score + Distribution + Sentiment */}
      <div className="db-grid-2col" style={{ marginBottom: '1.5rem' }}>
        {/* Left: Trust Score & Authenticity Ring */}
        <div className="db-card db-card-primary" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <span className="db-deal-store" style={{ marginBottom: '0.25rem' }}>Trust Rating</span>
          <h3 className="db-card-title-sm" style={{ marginBottom: '1rem' }}>Review Trust Score</h3>

          <div style={{ position: 'relative', width: '130px', height: '130px', margin: '0 auto 1rem' }}>
            <svg className="db-ring-svg-clean" style={{ width: '130px', height: '130px' }} viewBox="0 0 100 100">
              <circle className="db-ring-bg-clean" cx="50" cy="50" r="42" />
              <circle className="db-ring-bar-clean" cx="50" cy="50" r="42" stroke="#7C3AED" strokeDashoffset={40} />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--db-text-main)', lineHeight: 1 }}>
                {score}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--db-text-muted)', fontWeight: 600 }}>
                / {maxScore}
              </span>
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={15} /> High Review Reliability
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--db-text-muted)', marginTop: '0.4rem', maxWidth: '280px' }}>
            Based on natural language verification and cross-retailer verified purchase stamps.
          </p>
        </div>

        {/* Right: Authenticity & Sentiment Breakdown */}
        <div className="db-card db-card-primary" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 className="db-card-title-sm" style={{ marginBottom: '1rem' }}>
              Review Distribution & Sentiment
            </h3>

            {/* Authenticity Bars */}
            <div className="db-review-bars-clean" style={{ marginBottom: '1.5rem' }}>
              {breakdown.map((b) => (
                <div key={b.label} className="db-rev-row">
                  <div className="db-rev-head">
                    <span style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--db-text-main)' }}>{b.label}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>{b.pct}%</span>
                  </div>
                  <div className="db-rev-bar-track">
                    <div
                      className={`db-rev-bar-fill db-rev-${b.color}`}
                      style={{ width: `${b.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sentiment Summary 3 Blocks */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <div className="db-sentiment-box positive">
              <span className="db-sentiment-label">Positive</span>
              <span className="db-sentiment-pct">{sentiment.positive}%</span>
            </div>
            <div className="db-sentiment-box neutral">
              <span className="db-sentiment-label">Neutral</span>
              <span className="db-sentiment-pct">{sentiment.neutral}%</span>
            </div>
            <div className="db-sentiment-box negative">
              <span className="db-sentiment-label">Negative</span>
              <span className="db-sentiment-pct">{sentiment.negative}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Common Likes vs Complaints Grid */}
      <div className="db-grid-2col" style={{ marginBottom: '1.5rem' }}>
        <div className="db-card db-card-primary" style={{ padding: '1.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#16A34A' }}>
            <ThumbsUp size={16} />
            <h3 className="db-card-title-sm" style={{ color: '#15803D' }}>Common Positive Points</h3>
          </div>
          <ul className="db-feedback-list">
            {positivePoints.map((pt, idx) => (
              <li key={idx} className="db-feedback-item positive">
                <CheckCircle2 size={14} />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="db-card db-card-primary" style={{ padding: '1.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#DC2626' }}>
            <ThumbsDown size={16} />
            <h3 className="db-card-title-sm" style={{ color: '#B91C1C' }}>Common Complaints</h3>
          </div>
          <ul className="db-feedback-list">
            {complaintPoints.map((pt, idx) => (
              <li key={idx} className="db-feedback-item negative">
                <AlertTriangle size={14} />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Review Examples */}
      <div className="db-card db-card-primary" style={{ padding: '1.5rem' }}>
        <div className="db-card-header-clean" style={{ padding: '0 0 1rem 0', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={18} color="#2563EB" />
            <h3 className="db-card-title-sm">Representative Buyer Feedback</h3>
          </div>
          <span className="db-badge-soft-blue">Mock Dataset</span>
        </div>

        <div className="db-reviews-grid">
          {sampleReviews.map((rev) => (
            <div key={rev.id} className="db-sample-review-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Star size={13} fill="#F59E0B" color="#F59E0B" />
                  <strong style={{ fontSize: '0.85rem' }}>{rev.rating.toFixed(1)}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--db-text-muted)' }}>· {rev.store} ({rev.date})</span>
                </div>
                <span className={`db-review-tag ${rev.tag.toLowerCase()}`}>
                  {rev.tag}
                </span>
              </div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.3rem' }}>{rev.title}</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--db-text-secondary)', lineHeight: 1.5 }}>
                "{rev.comment}"
              </p>
              <div style={{ fontSize: '0.72rem', color: 'var(--db-text-muted)', marginTop: '0.5rem', fontWeight: 500 }}>
                {rev.author}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewIntelligenceScreen;
