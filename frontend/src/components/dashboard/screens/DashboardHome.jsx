import React from 'react';
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

export const DashboardHome = () => {
  return (
    <div className="pl-homepage-editorial-container db-page-fade">
      {/* 1. Cinematic Hero and Dual Search/Link Paste Engine */}
      <Hero />

      {/* 2. Chrome Extension Assistant Banner (Flipshope & Buyhatke Signature) */}
      <div id="extension-section">
        <ExtensionPromo />
      </div>

      {/* 3. Hot Price Drops / Flash Loot Deals Detected in Real Time */}
      <LivePriceDropsTicker />

      {/* 4. Supported Multi-Store Surveillance Strip */}
      <RetailerStrip />

      {/* 5. Popular Price Drops Grid with Sparklines & Wishlist */}
      <div id="popular-deals">
        <PopularPriceDrops />
      </div>

      {/* 6. Verified Store Coupons & Bank Codes Hub (Buyhatke Auto-Coupon Feature) */}
      <div id="coupons-section">
        <CouponsSection />
      </div>

      {/* 7. Product Category Discovery */}
      <div id="category">
        <CategoryDiscovery />
      </div>

      {/* 8. Multi-Store Comparison Preview & Interactive Price-History Graph */}
      <section
        id="price-comparison-section"
        className="pl-comparison-history-dual-section"
        aria-label="Multi-Store Price Comparison and Historical Telemetry"
      >
        <div className="pl-section-header-row">
          <div className="pl-section-title-col">
            <span className="pl-section-eyebrow">INTELLIGENCE SUITE</span>
            <h2 className="pl-section-title">Multi-store comparison &amp; price history</h2>
            <p className="pl-section-subtitle">
              Verify live checkout pricing across Amazon, Flipkart, Croma &amp; Reliance Digital and audit full historical price movement graphs
            </p>
          </div>
        </div>

        <div className="pl-home-bottom-grid">
          {/* Multi-Store Comparison Table */}
          <CompareStoresCard />

          {/* Interactive Keepa / Buyhatke Price History Graph */}
          <PriceHistoryInsightsCard />
        </div>
      </section>

      {/* 9. Buy-Now Versus Wait Recommendation (Buyhatke Deal Index Engine) */}
      <div id="buy-advisor">
        <BuyAdvisorSection />
      </div>

      {/* 10. Price-Alert Call To Action (WhatsApp & Email Drop Dispatcher) */}
      <div id="alerts">
        <PriceAlertCTA />
      </div>

      {/* 11. Trust Indicators and How-It-Works Methodology */}
      <div id="how-it-works">
        <HowItWorksSection />
      </div>
    </div>
  );
};

export default DashboardHome;
