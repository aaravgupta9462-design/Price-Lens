import React, { useState, useEffect } from 'react';
import { TrendingDown, MessageSquareQuote, ShieldCheck, Sparkles, Tag, Star, ArrowRight } from 'lucide-react';

const DEMO_DEALS = [
  { item: 'Sony WH-1000XM5 Headphones', storeA: 'Amazon ($398)', storeB: 'BestBuy ($328)', savings: 'Save $70 (18%)', rating: '4.8 ★' },
  { item: 'Apple MacBook Air M3', storeA: 'Apple ($1099)', storeB: 'B&H ($999)', savings: 'Save $100 (9%)', rating: '4.9 ★' },
  { item: 'Samsung Galaxy S24 Ultra', storeA: 'Retail ($1299)', storeB: 'Amazon ($1049)', savings: 'Save $250 (19%)', rating: '4.7 ★' }
];

export const FeatureHighlights = () => {
  const [dealIndex, setDealIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDealIndex((prev) => (prev + 1) % DEMO_DEALS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const activeDeal = DEMO_DEALS[dealIndex];

  return (
    <div className="showcase-panel">
      {/* Badge */}
      <div className="showcase-badge">
        <Sparkles size={14} />
        <span>Next-Gen Shopping Intelligence</span>
      </div>

      {/* Main Title & Description */}
      <h1 className="showcase-title">
        Buy Smarter with <span>AI-Driven Insights</span>
      </h1>

      <p className="showcase-desc">
        PriceLens tracks price drops across top stores & analyzes thousands of buyer reviews to give you instant, trustworthy shopping recommendations.
      </p>

      {/* CREATIVE FEATURE: Live Price Deal Ticker Widget */}
      <div
        style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '1.1rem 1.25rem',
          marginBottom: '1.75rem',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-emerald)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Tag size={14} />
            <span>Live Price Alert</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auto-updating</span>
        </div>

        <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
          {activeDeal.item}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--text-secondary)', textDecoration: 'line-through' }}>{activeDeal.storeA}</span>
          <ArrowRight size={14} style={{ color: 'var(--primary-emerald)' }} />
          <span style={{ color: 'var(--primary-emerald)', fontWeight: '700' }}>{activeDeal.storeB}</span>
          <span style={{ background: 'var(--primary-emerald)', color: '#041410', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '800' }}>
            {activeDeal.savings}
          </span>
        </div>
      </div>

      {/* Standard Feature List */}
      <div className="features-list">
        <div className="feature-item-card">
          <div className="feature-icon-box feature-icon-emerald">
            <TrendingDown size={22} />
          </div>
          <div>
            <h3 className="feature-text-h">Real-Time Price Comparison</h3>
            <p className="feature-text-p">
              Track historical price drops across Amazon, Flipkart, BestBuy, and more.
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
              Get Instant Pros, Cons, and Sentiment Scores extracted from verified reviews.
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
              Machine learning algorithms filter out sponsored & bot-generated reviews.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
