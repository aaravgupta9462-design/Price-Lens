import React from 'react';
import {
  Search,
  Scale,
  ShoppingBag,
  ShieldCheck,
  TrendingDown,
  Sparkles,
  Lock,
  Eye,
  CheckCircle2
} from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Search or Paste Any URL',
    desc: 'Enter any product name or directly paste a product link from Amazon or Flipkart.',
    icon: Search,
    highlight: 'Instant multi-store lookup',
  },
  {
    step: '02',
    title: 'Audit the True Price Across Stores',
    desc: 'See 1-year historical price curves, uncover artificial markup tricks during sales, and evaluate side-by-side store pricing.',
    icon: Scale,
    highlight: 'Keepa-depth price telemetry',
  },
  {
    step: '03',
    title: 'Buy at the Real Lowest Price',
    desc: 'Purchase directly through the verified lowest retailer, with verified bank discount codes and shipping timelines in hand.',
    icon: ShoppingBag,
    highlight: 'Maximum net savings',
  },
];

const TRUST_STATS = [
  {
    value: '₹4.8 Cr+',
    label: 'Calculated Shopper Savings',
    subtext: 'Across 140,000+ purchases',
  },
  {
    value: 'Amazon & Flipkart',
    label: 'Continuous 24/7 Auditing',
    subtext: 'More stores in future updates',
  },
  {
    value: '92,000+',
    label: 'Active Drop Monitors',
    subtext: 'Firing instant alerts daily',
  },
  {
    value: '100% Objective',
    label: 'Zero Sponsored Placement',
    subtext: 'Rankings strictly by real price',
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="pl-how-it-works-section" aria-label="How PriceLens Works & Trust Indicators">
      <div className="pl-how-it-works-container">
        {/* Section Header */}
        <div className="pl-section-header-row text-center">
          <div className="pl-section-title-col pl-mx-auto">
            <div className="pl-section-eyebrow-pill">
              <ShieldCheck size={13} className="pl-eyebrow-shield" />
              <span>TRANSPARENT SHOPPING METHODOLOGY</span>
            </div>
            <h2 className="pl-section-title">How PriceLens delivers the real price</h2>
            <p className="pl-section-subtitle">
              Three simple steps to avoid fake festive discounts and secure the authentic lowest market price in India
            </p>
          </div>
        </div>

        {/* 3 Step Editorial Cards */}
        <div className="pl-steps-grid">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.step} className="pl-step-card">
                <div className="pl-step-number-tag">{s.step}</div>
                <div className="pl-step-icon-box">
                  <Icon size={24} />
                </div>
                <h3 className="pl-step-title">{s.title}</h3>
                <p className="pl-step-desc">{s.desc}</p>
                <div className="pl-step-highlight-pill">
                  <CheckCircle2 size={13} color="#119B67" />
                  <span>{s.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Indicators Strip */}
        <div className="pl-trust-stats-box">
          <div className="pl-trust-stats-header">
            <span className="pl-trust-header-tag">VERIFIED MARKET IMPACT</span>
            <h3 className="pl-trust-header-title">Built for savvy Indian shoppers who demand proof, not promises</h3>
          </div>

          <div className="pl-trust-metrics-grid">
            {TRUST_STATS.map((stat, idx) => (
              <div key={idx} className="pl-trust-metric-col">
                <span className="pl-trust-val">{stat.value}</span>
                <span className="pl-trust-label">{stat.label}</span>
                <span className="pl-trust-subtext">{stat.subtext}</span>
              </div>
            ))}
          </div>

          <div className="pl-trust-guarantees-row">
            <div className="pl-guarantee-badge">
              <Eye size={15} />
              <span>Full Price Transparency</span>
            </div>
            <div className="pl-guarantee-badge">
              <Lock size={15} />
              <span>Privacy-First Tracker</span>
            </div>
            <div className="pl-guarantee-badge">
              <Sparkles size={15} />
              <span>No Retailer Kickbacks</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
