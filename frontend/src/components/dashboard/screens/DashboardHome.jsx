import React from 'react';
import { useDashboard } from '../../../context/DashboardContext';
import Hero from '../Hero';
import ExtensionPromo from '../ExtensionPromo';
import LivePriceDropsTicker from '../LivePriceDropsTicker';
import RetailerStrip from '../RetailerStrip';
import PopularPriceDrops from '../PopularPriceDrops';
import CouponsSection from '../CouponsSection';
import CategoryDiscovery from '../CategoryDiscovery';
import CompareStoresCard from '../CompareStoresCard';
import PriceHistoryInsightsCard from '../PriceHistoryInsightsCard';
import BuyAdvisorSection from '../BuyAdvisorSection';
import PriceAlertCTA from '../PriceAlertCTA';
import HowItWorksSection from '../HowItWorksSection';
import FAQSection from '../FAQSection';
import ScrollReveal from '../../common/ScrollReveal';

const SHOWCASE_PRODUCTS = [
  { id: 'iphone-16-128', label: 'iPhone 16 (128GB)' },
  { id: 'samsung-s25', label: 'Galaxy S25 Ultra' },
  { id: 'macbook-air-m3', label: 'MacBook Air M3' },
  { id: 'sony-xm5', label: 'Sony WH-1000XM5' },
  { id: 'airpods-pro-2', label: 'AirPods Pro 2' },
];

export const DashboardHome = () => {
  const { selectedProductId, setSelectedProductId } = useDashboard();

  const renderProductSwitcher = () => (
    <div className="pl-showcase-switcher" role="group" aria-label="Select flagship product to inspect">
      <span className="pl-switcher-label">Quick Switch Product:</span>
      <div className="pl-switcher-pills">
        {SHOWCASE_PRODUCTS.map((prod) => (
          <button
            key={prod.id}
            type="button"
            className={`pl-switcher-pill ${(selectedProductId || 'iphone-16-128') === prod.id ? 'active' : ''}`}
            onClick={() => setSelectedProductId(prod.id)}
          >
            {prod.label}
          </button>
        ))}
      </div>
    </div>
  );
  return (
    <div className="pl-homepage-editorial-container db-page-fade">
      {/* 1. Cinematic Hero and Dual Search/Link Paste Engine */}
      <Hero />

      {/* 2. Product Category Discovery (Prominent at Top) */}
      <ScrollReveal delay={0.03}>
        <div id="category">
          <CategoryDiscovery />
        </div>
      </ScrollReveal>

      {/* 3. Hot Price Drops / Flash Loot Deals Detected in Real Time */}
      <ScrollReveal delay={0.04}>
        <LivePriceDropsTicker />
      </ScrollReveal>

      {/* 4. Supported Multi-Store Surveillance Strip */}
      <ScrollReveal delay={0.04}>
        <RetailerStrip />
      </ScrollReveal>

      {/* 5. Popular Price Drops Grid with Sparklines & Wishlist */}
      <ScrollReveal delay={0.04}>
        <div id="popular-deals">
          <PopularPriceDrops />
        </div>
      </ScrollReveal>

      {/* 6. Verified Store Coupons & Bank Codes Hub (Buyhatke Auto-Coupon Feature) */}
      <ScrollReveal delay={0.04}>
        <div id="coupons-section">
          <CouponsSection />
        </div>
      </ScrollReveal>

      {/* 7. Chrome Extension Assistant Banner (Flipshope & Buyhatke Signature) */}
      <ScrollReveal delay={0.04}>
        <div id="extension-section">
          <ExtensionPromo />
        </div>
      </ScrollReveal>

      {/* 8. Dedicated Multi-Store Comparison Section */}
      <ScrollReveal delay={0.04}>
        <section
          id="price-comparison-section"
          className="pl-comparison-section-full"
          aria-label="Multi-Store Price Comparison"
        >
          <div className="pl-section-header-row">
            <div className="pl-section-title-col">
              <span className="pl-section-eyebrow">LIVE PRICING INTELLIGENCE</span>
              <h2 className="pl-section-title">Multi-store price comparison</h2>
              <p className="pl-section-subtitle">
                Verify real-time checkout pricing and calculate effective card discounts across Amazon &amp; Flipkart
              </p>
            </div>
            {renderProductSwitcher()}
          </div>

          <div className="pl-fullwidth-card-container">
            <CompareStoresCard />
          </div>
        </section>
      </ScrollReveal>

      {/* 9. Dedicated Interactive Price History Graph Section */}
      <ScrollReveal delay={0.04}>
        <section
          id="price-history-section"
          className="pl-history-section-full"
          aria-label="Interactive Historical Price Telemetry"
        >
          <div className="pl-section-header-row">
            <div className="pl-section-title-col">
              <span className="pl-section-eyebrow">KEEPA-STYLE TELEMETRY</span>
              <h2 className="pl-section-title">Interactive price history graph</h2>
              <p className="pl-section-subtitle">
                Audit 1-year historical price curves, spot fake festive discount inflation, and set instant price-drop alerts
              </p>
            </div>
            {renderProductSwitcher()}
          </div>

          <div className="pl-fullwidth-card-container">
            <PriceHistoryInsightsCard />
          </div>
        </section>
      </ScrollReveal>

      {/* 10. Buy-Now Versus Wait Recommendation (Buyhatke Deal Index Engine) */}
      <ScrollReveal delay={0.04}>
        <div id="buy-advisor">
          <BuyAdvisorSection />
        </div>
      </ScrollReveal>

      {/* 11. Price-Alert Call To Action (WhatsApp & Email Drop Dispatcher) */}
      <ScrollReveal delay={0.04}>
        <div id="alerts">
          <PriceAlertCTA />
        </div>
      </ScrollReveal>

      {/* 12. Trust Indicators and How-It-Works Methodology */}
      <ScrollReveal delay={0.04}>
        <div id="how-it-works">
          <HowItWorksSection />
        </div>
      </ScrollReveal>

      {/* 13. Frequently Asked Questions */}
      <ScrollReveal delay={0.04}>
        <FAQSection />
      </ScrollReveal>
    </div>
  );
};

export default DashboardHome;
