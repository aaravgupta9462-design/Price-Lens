import React, { useState } from 'react';
import { Search, ArrowRight, TrendingDown, Bell, Star, BarChart3, ShieldCheck, Zap, ChevronRight, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

const LandingPage = ({ onGetStarted, isAuthenticated }) => {
  const { user, logout } = useAuth();
  const displayName = user?.name || user?.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="lp-root">
      {/* ─── Floating Background Blobs ───────────────────────────────────────── */}
      <div className="lp-blob lp-blob-1" />
      <div className="lp-blob lp-blob-2" />
      <div className="lp-blob lp-blob-3" />

      {/* ─── Top Navbar ──────────────────────────────────────────────────────── */}
      <header className="lp-navbar">
        <div className="lp-nav-container">
          {/* Logo */}
          <div className="lp-logo">
            <div className="lp-logo-icon">
              <Zap size={18} />
            </div>
            <span className="lp-logo-text">Price<span>Lens</span></span>
          </div>

          {/* Pill Nav Links */}
          <nav className="lp-nav-pill">
            <a href="#" className="lp-nav-link active">Home</a>
            <a href="#features" className="lp-nav-link">Features</a>
            <a href="#how" className="lp-nav-link">How It Works</a>
            <a href="#pricing" className="lp-nav-link">Pricing</a>
          </nav>

          {/* Right Side — Auth CTA or User Pill */}
          {isAuthenticated ? (
            <div className="lp-user-pill">
              <div className="lp-user-avatar">{initial}</div>
              <span className="lp-user-name">{displayName}</span>
              <button className="lp-logout-btn" onClick={logout} title="Sign Out">
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button className="lp-cta-btn" onClick={onGetStarted}>
              Get Started →
            </button>
          )}
        </div>
      </header>

      {/* ─── Hero Section ────────────────────────────────────────────────────── */}
      <main className="lp-hero">
        <div className="lp-hero-content">
          {/* Badge */}
          <div className="lp-hero-badge">
            <span className="lp-live-dot" />
            Live across 100+ stores · Real-time tracking
          </div>

          {/* Headline */}
          <h1 className="lp-hero-headline">
            STOP OVERPAYING.
            <br />
            COMPARE <span className="lp-headline-accent">EVERY</span>
            <br />
            PRICE...
          </h1>

          {/* Sub text */}
          <p className="lp-hero-sub">
            PriceLens tracks real-time prices, detects fake reviews and finds the best deal across Amazon, Flipkart, Croma &amp; 100+ stores before you click buy.
          </p>

          {/* CTA Row */}
          <div className="lp-hero-actions">
            {isAuthenticated ? (
              <>
                <a href="#features" className="lp-btn-start">
                  Explore Features <ArrowRight size={18} />
                </a>
                <button className="lp-btn-how" onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}>
                  How It Works
                </button>
              </>
            ) : (
              <>
                <button className="lp-btn-start" onClick={onGetStarted}>
                  Start Comparing Free <ArrowRight size={18} />
                </button>
                <button className="lp-btn-how" onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}>
                  How It Works
                </button>
              </>
            )}
          </div>

          {/* Trust Strip */}
          <div className="lp-trust-strip">
            <div className="lp-trust-item">
              <ShieldCheck size={14} />
              <span>100+ Verified Stores</span>
            </div>
            <div className="lp-trust-sep">·</div>
            <div className="lp-trust-item">
              <TrendingDown size={14} />
              <span>₹10K CR+ Saved</span>
            </div>
            <div className="lp-trust-sep">·</div>
            <div className="lp-trust-item">
              <Star size={14} />
              <span>AI Review Guard</span>
            </div>
          </div>
        </div>

        {/* ─── Floating Feature Cards ─────────────────────────────────────────── */}
        <div className="lp-float-cards">

          {/* Card 1 — Price Drop Alert */}
          <div className="lp-card lp-card-1">
            <div className="lp-card-icon-box" style={{ background: '#D1FAE5' }}>
              <TrendingDown size={22} color="#065F46" />
            </div>
            <div className="lp-card-body">
              <span className="lp-card-label">PRICE DROP</span>
              <span className="lp-card-name">iPhone 16 Pro 256GB</span>
              <span className="lp-card-price">₹1,08,900 <span className="lp-card-was">₹1,19,900</span></span>
              <span className="lp-card-save">Save ₹11,000 on Flipkart</span>
            </div>
          </div>

          {/* Card 2 — Compare Card */}
          <div className="lp-card lp-card-2">
            <div className="lp-card-icon-box" style={{ background: '#EDE9FE' }}>
              <BarChart3 size={22} color="#5B21B6" />
            </div>
            <div className="lp-card-body">
              <span className="lp-card-label">COMPARE STORES</span>
              <span className="lp-card-name">MacBook Air M3</span>
              <div className="lp-compare-rows">
                <div className="lp-compare-row">
                  <span>Amazon</span>
                  <span className="lp-compare-price">₹1,14,900</span>
                </div>
                <div className="lp-compare-row best">
                  <span>Croma</span>
                  <span className="lp-compare-price best">₹1,09,990 ✓</span>
                </div>
                <div className="lp-compare-row">
                  <span>Flipkart</span>
                  <span className="lp-compare-price">₹1,17,490</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 — Review Intelligence */}
          <div className="lp-card lp-card-3">
            <div className="lp-card-icon-box" style={{ background: '#FEF3C7' }}>
              <ShieldCheck size={22} color="#92400E" />
            </div>
            <div className="lp-card-body">
              <span className="lp-card-label">REVIEW GUARD</span>
              <span className="lp-card-name">Trust Score</span>
              <div className="lp-score-ring-row">
                <div className="lp-score-circle">
                  <span className="lp-score-num">8.4</span>
                  <span className="lp-score-den">/10</span>
                </div>
                <div className="lp-score-bars">
                  <div className="lp-sbar">
                    <span>Genuine</span>
                    <div className="lp-sbar-track"><div className="lp-sbar-fill" style={{ width: '82%', background: '#10B981' }} /></div>
                    <span className="lp-sbar-pct">82%</span>
                  </div>
                  <div className="lp-sbar">
                    <span>Suspicious</span>
                    <div className="lp-sbar-track"><div className="lp-sbar-fill" style={{ width: '13%', background: '#F59E0B' }} /></div>
                    <span className="lp-sbar-pct">13%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 — Price Alert Bell */}
          <div className="lp-card lp-card-4">
            <div className="lp-card-icon-box" style={{ background: '#DBEAFE' }}>
              <Bell size={22} color="#1E40AF" />
            </div>
            <div className="lp-card-body">
              <span className="lp-card-label">ALERT SET</span>
              <span className="lp-card-name">Sony WH-1000XM5</span>
              <div className="lp-alert-target">
                <span className="lp-alert-label">Target Price</span>
                <span className="lp-alert-val">₹22,000</span>
              </div>
              <div className="lp-alert-now">
                <span>Now: ₹26,990</span>
                <span className="lp-alert-close">88% to target ↓</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ─── How It Works Strip ──────────────────────────────────────────────── */}
      <section className="lp-how-section" id="how">
        <div className="lp-how-inner">
          <div className="lp-how-step">
            <div className="lp-how-num">01</div>
            <div className="lp-how-text">
              <strong>Search any product</strong>
              <span>Type a name, model, or paste a store link</span>
            </div>
          </div>
          <div className="lp-how-arrow"><ChevronRight size={20} /></div>
          <div className="lp-how-step">
            <div className="lp-how-num">02</div>
            <div className="lp-how-text">
              <strong>Compare real prices</strong>
              <span>Live data from 100+ certified stores</span>
            </div>
          </div>
          <div className="lp-how-arrow"><ChevronRight size={20} /></div>
          <div className="lp-how-step">
            <div className="lp-how-num">03</div>
            <div className="lp-how-text">
              <strong>Trust the reviews</strong>
              <span>AI-powered authenticity scoring</span>
            </div>
          </div>
          <div className="lp-how-arrow"><ChevronRight size={20} /></div>
          <div className="lp-how-step">
            <div className="lp-how-num">04</div>
            <div className="lp-how-text">
              <strong>Buy smarter</strong>
              <span>Visit the store &amp; save instantly</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Section ─────────────────────────────────────────────────── */}
      <section className="lp-features-section" id="features">
        <div className="lp-features-inner">
          <div className="lp-features-header">
            <span className="lp-features-tag">SMART FEATURES</span>
            <h2 className="lp-features-title">Everything you need to buy smarter</h2>
          </div>
          <div className="lp-features-grid">
            {[
              { icon: '⚖️', color: '#EEF2FF', title: 'Multi-Store Compare', desc: 'Side-by-side comparison across Amazon, Flipkart, Croma, Reliance Digital and more.' },
              { icon: '📈', color: '#F0FDF4', title: 'Price History', desc: 'See all-time lows, highs, and 90-day trends with an interactive chart.' },
              { icon: '🔔', color: '#FFF7ED', title: 'Price Alerts', desc: 'Set your target price. Get notified the moment the price drops.' },
              { icon: '✨', color: '#F5F3FF', title: 'Review Intelligence', desc: 'AI-powered trust score. Spot suspicious and fake reviews instantly.' },
              { icon: '💖', color: '#FFF1F2', title: 'Wishlist Tracking', desc: 'Save products and monitor their price movements in real time.' },
              { icon: '🔗', color: '#EFF6FF', title: 'Easy Sharing', desc: 'Share the best deal link with friends or family in one click.' },
            ].map((f) => (
              <div key={f.title} className="lp-feature-card">
                <div className="lp-feature-icon-box" style={{ background: f.color }}>
                  <span className="lp-feature-icon-emoji">{f.icon}</span>
                </div>
                <h3 className="lp-feature-title">{f.title}</h3>
                <p className="lp-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ───────────────────────────────────────────────────────── */}
      <section className="lp-stats-bar">
        <div className="lp-stats-inner">
          <div className="lp-stat">
            <span className="lp-stat-num">8M+</span>
            <span className="lp-stat-label">Active Shoppers</span>
          </div>
          <div className="lp-stat-sep" />
          <div className="lp-stat">
            <span className="lp-stat-num">₹10K CR</span>
            <span className="lp-stat-label">Total Savings</span>
          </div>
          <div className="lp-stat-sep" />
          <div className="lp-stat">
            <span className="lp-stat-num">100+</span>
            <span className="lp-stat-label">Verified Stores</span>
          </div>
          <div className="lp-stat-sep" />
          <div className="lp-stat">
            <span className="lp-stat-num">₹3,240</span>
            <span className="lp-stat-label">Avg. User Savings</span>
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA Band ─────────────────────────────────────────────────── */}
      <section className="lp-bottom-cta">
        <div className="lp-bottom-cta-inner">
          <h2 className="lp-bottom-cta-title">Stop guessing. Start comparing.</h2>
          <p className="lp-bottom-cta-sub">Join 8 million smart shoppers who never overpay.</p>
          {isAuthenticated ? (
            <button className="lp-btn-start large" onClick={logout}>
              Sign Out <LogOut size={18} />
            </button>
          ) : (
            <button className="lp-btn-start large" onClick={onGetStarted}>
              Compare Prices Free <ArrowRight size={18} />
            </button>
          )}
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-brand">
            <div className="lp-logo-icon small">
              <Zap size={14} />
            </div>
            <span className="lp-logo-text small">Price<span>Lens</span></span>
          </div>
          <p className="lp-footer-copy">© 2026 PriceLens · Compare Prices. Trust Reviews. Buy Smarter.</p>
          <div className="lp-footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
