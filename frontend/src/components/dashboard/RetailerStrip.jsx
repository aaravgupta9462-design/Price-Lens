import React from 'react';
import {
  ShieldCheck,
  Zap,
  Activity,
  Clock,
  Sparkles,
  ArrowRight,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import StoreLogo from './StoreLogo';

const LIVE_STORES = [
  {
    id: 'amazon',
    name: 'Amazon India',
    domain: 'amazon.in',
    accent: '#FF9900',
    dealsCount: '12,450+',
    speed: 'Same-Day Prime Delivery',
    accuracy: '99.4% Accuracy',
    syncedAgo: 'Synced 1m ago',
    tagline: 'Lightning deals, Prime bank discounts & Keepa-depth telemetry',
  },
  {
    id: 'flipkart',
    name: 'Flipkart Plus',
    domain: 'flipkart.com',
    accent: '#2874F0',
    dealsCount: '14,820+',
    speed: 'Next-Day SuperCoin Express',
    accuracy: '99.1% Accuracy',
    syncedAgo: 'Synced 2m ago',
    tagline: 'SuperCoin rewards, festive price hikes & flash discounts audited',
  },
];

const FUTURE_STORES = [
  {
    id: 'croma',
    name: 'Croma',
    specialty: '2h Express Store Pickup',
    status: 'API In Dev',
  },
  {
    id: 'reliance',
    name: 'Reliance Digital',
    specialty: 'Pan-India 500+ Stores',
    status: 'API In Dev',
  },
  {
    id: 'tatacliq',
    name: 'Tata CLiQ',
    specialty: 'Brand-Certified Luxury',
    status: 'Roadmap',
  },
  {
    id: 'vijaysales',
    name: 'Vijay Sales',
    specialty: 'In-Store Warranty Tech',
    status: 'Roadmap',
  },
];

export const RetailerStrip = () => {
  return (
    <section className="pl-telemetry-radar-section" aria-label="Live Store Surveillance Telemetry">
      <div className="pl-telemetry-card">
        {/* Top Command Bar */}
        <div className="pl-radar-header">
          <div className="pl-radar-left">
            <div className="pl-radar-icon-box">
              <Activity size={16} className="pl-radar-pulse-icon" />
            </div>
            <div className="pl-radar-title-col">
              <div className="pl-radar-badge-row">
                <span className="pl-radar-badge">MULTI-STORE SURVEILLANCE RADAR</span>
                <span className="pl-radar-unbiased-tag">100% UNBIASED &bull; ZERO SPONSORED BIAS</span>
              </div>
              <p className="pl-radar-sub">
                Auditing 42,000+ live gadget listings 24/7 with sub-minute price drop detection
              </p>
            </div>
          </div>

          <div className="pl-radar-status-pill">
            <span className="pl-radar-dot-pulse">
              <span className="pl-dot-core" />
              <span className="pl-dot-wave" />
            </span>
            <span className="pl-radar-status-text">Live Dual-Engine Active</span>
          </div>
        </div>

        {/* ─── Zone 1: Active Live Surveillance Dual Cards (Amazon & Flipkart) ─── */}
        <div className="pl-live-dual-grid">
          {LIVE_STORES.map((store) => (
            <div key={store.id} className={`pl-live-store-card pl-card-${store.id}`}>
              <div className="pl-live-card-top">
                <div className="pl-live-store-branding">
                  <StoreLogo store={store.id} size="md" />
                  <span className="pl-live-domain-badge">{store.domain}</span>
                </div>

                <div className="pl-live-status-chip">
                  <span className="pl-green-pulse-dot" />
                  <span>ACTIVE FEED</span>
                </div>
              </div>

              <p className="pl-live-card-tagline">{store.tagline}</p>

              <div className="pl-live-metrics-row">
                <div className="pl-metric-cell">
                  <span className="pl-metric-val">{store.dealsCount}</span>
                  <span className="pl-metric-lbl">Audited Deals</span>
                </div>
                <div className="pl-metric-divider" />
                <div className="pl-metric-cell">
                  <span className="pl-metric-val green">{store.accuracy}</span>
                  <span className="pl-metric-lbl">Sync Reliability</span>
                </div>
                <div className="pl-metric-divider" />
                <div className="pl-metric-cell">
                  <span className="pl-metric-val">{store.speed}</span>
                  <span className="pl-metric-lbl">Delivery Guarantee</span>
                </div>
              </div>

              <div className="pl-live-card-footer">
                <div className="pl-footer-sync-info">
                  <Zap size={12} className="pl-sync-zap" />
                  <span>{store.syncedAgo}</span>
                </div>
                <span className="pl-footer-status-pill">Verified Impartial</span>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Zone 2: Upcoming Stores Roadmap Dock ─── */}
        <div className="pl-roadmap-dock">
          <div className="pl-roadmap-dock-header">
            <div className="pl-dock-title-group">
              <Sparkles size={14} className="pl-dock-sparkle" />
              <span className="pl-dock-title">FUTURE EXPANSION NETWORK</span>
            </div>
            <span className="pl-dock-subtitle">
              Direct API scrapers &amp; affiliate integrations in progress for upcoming release
            </span>
          </div>

          <div className="pl-roadmap-stores-grid">
            {FUTURE_STORES.map((fut) => (
              <div key={fut.id} className="pl-future-dock-item">
                <div className="pl-future-dock-head">
                  <StoreLogo store={fut.id} size="sm" />
                  <span className="pl-future-eta-badge">
                    <Clock size={10} />
                    <span>{fut.status}</span>
                  </span>
                </div>
                <span className="pl-future-dock-specialty">{fut.specialty}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RetailerStrip;
