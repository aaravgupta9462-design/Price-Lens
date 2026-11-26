import React from 'react';
import { ShieldCheck, CheckCircle2, Zap } from 'lucide-react';
import StoreLogo from './StoreLogo';

const RETAILERS = [
  { id: 'amazon', name: 'Amazon India', speed: 'Same-Day Prime', deals: '12.4k Active Deals' },
  { id: 'flipkart', name: 'Flipkart Plus', speed: 'Next-Day SuperCoins', deals: '14.8k Active Deals' },
  { id: 'croma', name: 'Croma Tata', speed: '2h Express Store Pickup', deals: '4.2k Active Deals' },
  { id: 'reliance', name: 'Reliance Digital', speed: 'Pan-India Stores', deals: '3.9k Active Deals' },
  { id: 'tatacliq', name: 'Tata CLiQ Luxury', speed: 'Brand Certified', deals: '2.1k Active Deals' },
  { id: 'vijaysales', name: 'Vijay Sales', speed: 'In-Store Warranty', deals: '1.8k Active Deals' },
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
            <span className="pl-live-pulse-text">Auditing 42,000+ Gadgets Live</span>
          </div>
        </div>

        <div className="pl-retailer-pills-row">
          {RETAILERS.map((ret) => (
            <div key={ret.id} className="pl-retailer-chip-box">
              <StoreLogo store={ret.id} size="md" />
              <div className="pl-retailer-meta-col">
                <span className="pl-retailer-speed-tag">{ret.speed}</span>
                <span className="pl-retailer-deals-tag">{ret.deals}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RetailerStrip;
