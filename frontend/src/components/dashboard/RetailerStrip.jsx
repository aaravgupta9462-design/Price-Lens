import React from 'react';
import { ShieldCheck, CheckCircle2, Sparkles, Clock } from 'lucide-react';
import StoreLogo from './StoreLogo';

const LIVE_RETAILERS = [
  { id: 'amazon', name: 'Amazon India', speed: 'Same-Day Prime', deals: '12.4k Active Deals' },
  { id: 'flipkart', name: 'Flipkart Plus', speed: 'Next-Day SuperCoins', deals: '14.8k Active Deals' },
];

const FUTURE_RETAILERS = [
  { id: 'croma', name: 'Croma Tata', speed: 'Store Pickup' },
  { id: 'reliance', name: 'Reliance Digital', speed: 'Pan-India Stores' },
  { id: 'tatacliq', name: 'Tata CLiQ Luxury', speed: 'Brand Certified' },
  { id: 'vijaysales', name: 'Vijay Sales', speed: 'In-Store Warranty' },
];

export const RetailerStrip = () => {
  return (
    <section className="pl-retailer-strip-section" aria-label="Supported Retailer Network">
      <div className="pl-retailer-strip-container">
        <div className="pl-strip-header-row">
          <div className="pl-strip-eyebrow">
            <ShieldCheck size={14} className="pl-eyebrow-shield-icon" />
            <span>CONTINUOUS MULTI-STORE SURVEILLANCE &bull; ZERO SPONSORED BIAS</span>
          </div>
          <div className="pl-strip-live-indicator">
            <span className="pl-live-pulse-dot" />
            <span className="pl-live-pulse-text">Auditing Amazon &amp; Flipkart Live</span>
          </div>
        </div>

        <div className="pl-retailer-pills-row">
          {/* Active Live Stores */}
          {LIVE_RETAILERS.map((ret) => (
            <div key={ret.id} className="pl-retailer-chip-box pl-retailer-live-active">
              <StoreLogo store={ret.id} size="md" />
              <div className="pl-retailer-meta-col">
                <div className="pl-retailer-status-badge live">
                  <span className="pl-status-dot-green" />
                  <span>LIVE</span>
                </div>
                <span className="pl-retailer-speed-tag">{ret.speed}</span>
              </div>
            </div>
          ))}

          {/* Separator / Future Updates Divider */}
          <div className="pl-retailer-divider-chip">
            <Sparkles size={12} className="text-violet" />
            <span>FUTURE UPDATES</span>
          </div>

          {/* Upcoming Future Stores */}
          {FUTURE_RETAILERS.map((ret) => (
            <div key={ret.id} className="pl-retailer-chip-box pl-retailer-future-box">
              <StoreLogo store={ret.id} size="md" />
              <div className="pl-retailer-meta-col">
                <span className="pl-retailer-status-badge future">
                  <Clock size={10} />
                  <span>Coming Soon</span>
                </span>
                <span className="pl-retailer-speed-tag">{ret.speed}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RetailerStrip;
