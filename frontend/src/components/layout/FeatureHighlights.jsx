import React from 'react';
import { TrendingDown, MessageSquareQuote, ShieldCheck, Sparkles } from 'lucide-react';

export const FeatureHighlights = () => {
  return (
    <div className="showcase-panel">
      {/* Capsule Badge Tag */}
      <div className="showcase-badge">
        <Sparkles size={14} />
        <span>✦ Next-Gen Shopping Intelligence</span>
      </div>

      {/* Main Heading */}
      <h1 className="showcase-title">
        Buy Smarter with <span>AI-Driven Insights</span>
      </h1>

      {/* Subtitle */}
      <p className="showcase-desc">
        PriceLens aggregates real-time prices across major online stores and analyzes thousands of customer reviews to give you instant, trustworthy purchase recommendations.
      </p>

      {/* 3 Feature Cards */}
      <div className="features-list">
        <div className="feature-item-card">
          <div className="feature-icon-box feature-icon-emerald">
            <TrendingDown size={22} />
          </div>
          <div>
            <h3 className="feature-text-h">Real-Time Price Comparison</h3>
            <p className="feature-text-p">
              Track historical price drops and find the absolute lowest price across verified sellers.
            </p>
          </div>
        </div>

        <div className="feature-item-card">
          <div className="feature-icon-box feature-icon-cyan">
            <MessageSquareQuote size={22} />
          </div>
          <div>
            <h3 className="feature-text-h">AI Sentiment & Review Summary</h3>
            <p className="feature-text-p">
              Skip endless reading. AI summarizes pros, cons, and genuine buyer sentiment in seconds.
            </p>
          </div>
        </div>

        <div className="feature-item-card">
          <div className="feature-icon-box feature-icon-indigo">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h3 className="feature-text-h">Fake Review Protection</h3>
            <p className="feature-text-p">
              Advanced algorithms filter out bot-generated and incentivized seller reviews.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
