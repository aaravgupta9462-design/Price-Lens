import React, { useEffect } from 'react';
import { Sparkles, ThumbsUp, ThumbsDown, CheckCircle2, AlertTriangle, Star, MessageSquare } from 'lucide-react';
import { PRODUCTS } from '../../../data/mockData';
import { useDashboard } from '../../../context/DashboardContext';

const ReviewIntelligenceScreen = () => {
  const {
    selectedProductId,
    setSelectedProductId,
    reviewIntelligence,
    isLoadingReviewIntelligence,
    reviewIntelligenceError,
    fetchReviewIntelligence,
  } = useDashboard();

  useEffect(() => {
    if (selectedProductId) {
      fetchReviewIntelligence(selectedProductId);
    }
  }, [selectedProductId, fetchReviewIntelligence]);

  const revData = reviewIntelligence?.reviewIntelligence;
  const currentProduct = PRODUCTS.find((p) => p.id === selectedProductId) || { id: selectedProductId, name: selectedProductId, emoji: '📦' };

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
              className={`db-selector-pill ${prod.id === selectedProductId ? 'active' : ''}`}
              onClick={() => {
                setSelectedProductId(prod.id);
                fetchReviewIntelligence(prod.id);
              }}
            >
              <span>{prod.emoji}</span>
              <span>{prod.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoadingReviewIntelligence && (
        <div className="db-card db-card-primary" style={{ padding: '3rem 1.5rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid #DDD6FE', borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--db-text-main)', marginBottom: '0.25rem' }}>
            Loading Review Intelligence...
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--db-text-muted)' }}>
            Fetching structured sentiment analysis for {currentProduct.name}.
          </p>
        </div>
      )}

      {/* Error State */}
      {!isLoadingReviewIntelligence && reviewIntelligenceError && (
        <div className="db-card db-card-primary" style={{ padding: '2.5rem 1.5rem', textAlign: 'center', borderColor: '#FCA5A5', marginBottom: '1.5rem' }}>
          <AlertTriangle size={36} color="#EF4444" style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#B91C1C', marginBottom: '0.5rem' }}>
            Review Intelligence Unavailable
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--db-text-secondary)', maxWidth: '500px', margin: '0 auto 1rem' }}>
            {reviewIntelligenceError.includes('404') || reviewIntelligenceError.toLowerCase().includes('not found')
              ? `Review Intelligence data is currently unavailable for ${currentProduct.name} in the database.`
              : reviewIntelligenceError}
          </p>
          <button
            className="db-btn-secondary"
            onClick={() => fetchReviewIntelligence(selectedProductId)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}
          >
            Retry Fetching
          </button>
        </div>
      )}

      {/* Review Intelligence Data View */}
      {!isLoadingReviewIntelligence && !reviewIntelligenceError && revData && (
        <>
          {/* Top Section: Trust Score + Distribution + Sentiment */}
          <div className="db-grid-2col" style={{ marginBottom: '1.5rem' }}>
            {/* Left: Trust Score & Authenticity Ring */}
            <div className="db-card db-card-primary" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <span className="db-deal-store" style={{ marginBottom: '0.25rem' }}>Trust Rating</span>
              <h3 className="db-card-title-sm" style={{ marginBottom: '1rem' }}>Review Trust Score</h3>

              <div style={{ position: 'relative', width: '130px', height: '130px', margin: '0 auto 1rem' }}>
                <svg className="db-ring-svg-clean" style={{ width: '130px', height: '130px' }} viewBox="0 0 100 100">
                  <circle className="db-ring-bg-clean" cx="50" cy="50" r="42" />
                  <circle
                    className="db-ring-bar-clean"
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#7C3AED"
                    strokeDashoffset={264 * (1 - (Number(revData.trustScore) || 0) / 10)}
                  />
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
                    {Number(revData.trustScore).toFixed(1)}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--db-text-muted)', fontWeight: 600 }}>
                    / 10
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={15} /> {revData.reliabilityTag || 'High Review Reliability'}
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
                  {(Array.isArray(revData.authenticityBreakdown) ? revData.authenticityBreakdown : []).map((b, idx) => (
                    <div key={b.label || idx} className="db-rev-row">
                      <div className="db-rev-head">
                        <span style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--db-text-main)' }}>{b.label}</span>
                        <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>{b.pct}%</span>
                      </div>
                      <div className="db-rev-bar-track">
                        <div
                          className={`db-rev-bar-fill db-rev-${b.color || 'purple'}`}
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
                  <span className="db-sentiment-pct">{revData.sentimentDistribution?.positive || 0}%</span>
                </div>
                <div className="db-sentiment-box neutral">
                  <span className="db-sentiment-label">Neutral</span>
                  <span className="db-sentiment-pct">{revData.sentimentDistribution?.neutral || 0}%</span>
                </div>
                <div className="db-sentiment-box negative">
                  <span className="db-sentiment-label">Negative</span>
                  <span className="db-sentiment-pct">{revData.sentimentDistribution?.negative || 0}%</span>
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
                {(Array.isArray(revData.positivePoints) ? revData.positivePoints : []).map((pt, idx) => (
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
                {(Array.isArray(revData.complaintPoints) ? revData.complaintPoints : []).map((pt, idx) => (
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
              <span className="db-badge-soft-blue" style={{ fontSize: '0.72rem' }}>
                Development demo data — not live customer reviews
              </span>
            </div>

            <div className="db-reviews-grid">
              {(Array.isArray(revData.sampleReviews) ? revData.sampleReviews : []).map((rev, idx) => (
                <div key={rev.id || idx} className="db-sample-review-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Star size={13} fill="#F59E0B" color="#F59E0B" />
                      <strong style={{ fontSize: '0.85rem' }}>
                        {typeof rev.rating === 'number' ? rev.rating.toFixed(1) : rev.rating || '5.0'}
                      </strong>
                      {(rev.store || rev.date) && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--db-text-muted)' }}>
                          · {[rev.store, rev.date].filter(Boolean).join(' ')}
                        </span>
                      )}
                    </div>
                    {rev.tag && (
                      <span className={`db-review-tag ${String(rev.tag).toLowerCase()}`}>
                        {rev.tag}
                      </span>
                    )}
                  </div>
                  {rev.title && <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.3rem' }}>{rev.title}</h4>}
                  {(rev.text || rev.comment) && (
                    <p style={{ fontSize: '0.82rem', color: 'var(--db-text-secondary)', lineHeight: 1.5 }}>
                      "{rev.text || rev.comment}"
                    </p>
                  )}
                  {rev.author && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--db-text-muted)', marginTop: '0.5rem', fontWeight: 500 }}>
                      {rev.author}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewIntelligenceScreen;
