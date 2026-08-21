import React from 'react';
import { Sparkles, Info } from 'lucide-react';
import { REVIEW_INTELLIGENCE } from '../../data/mockData';

const ReviewIntelligence = () => {
  const { score, maxScore, breakdown } = REVIEW_INTELLIGENCE;

  return (
    <div className="db-review-card-refined" id="review-intelligence-section">
      <div className="db-section-head" style={{ marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <h2 className="db-section-title-clean">Review Intelligence</h2>
            <span className="db-badge-soft-blue" style={{ background: '#F5F3FF', color: '#7C3AED' }}>
              <Sparkles size={10} style={{ display: 'inline', marginRight: '3px' }} />
              AI-powered
            </span>
          </div>
          <p className="db-section-subtitle-clean">
            Authenticity and sentiment breakdown across shopper feedback
          </p>
        </div>
      </div>

      <div className="db-review-inner">
        {/* Clean Circular Progress Visualization */}
        <div className="db-score-circle-wrap">
          <div style={{ position: 'relative', width: '110px', height: '110px' }}>
            <svg className="db-ring-svg-clean" viewBox="0 0 100 100">
              <circle className="db-ring-bg-clean" cx="50" cy="50" r="42" />
              <circle className="db-ring-bar-clean" cx="50" cy="50" r="42" />
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
              <span className="db-ring-score-text">{score}</span>
              <span className="db-ring-score-max">/ {maxScore}</span>
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--db-text-secondary)', marginTop: '0.35rem' }}>
            Review Trust Score
          </span>
        </div>

        {/* Breakdown Bars */}
        <div className="db-review-bars-clean">
          {breakdown.map((item) => (
            <div key={item.label} className="db-rev-row">
              <div className="db-rev-head">
                <span style={{ fontWeight: 500, color: 'var(--db-text-main)' }}>{item.label}</span>
                <span style={{ fontWeight: 700 }}>{item.pct}%</span>
              </div>
              <div className="db-rev-bar-track">
                <div
                  className={`db-rev-bar-fill db-rev-${item.color === 'orange' ? 'amber' : item.color}`}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="db-ai-note">
        <Info size={14} style={{ flexShrink: 0 }} />
        <span>
          <strong>Note:</strong> AI review analysis coming soon. Sentiment checks are currently simulated for demonstration.
        </span>
      </div>
    </div>
  );
};

export default ReviewIntelligence;
