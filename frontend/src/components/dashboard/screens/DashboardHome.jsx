import React from 'react';
import { useDashboard } from '../../../context/DashboardContext';
import Hero from '../Hero';
import LivePriceDropsTicker from '../LivePriceDropsTicker';
import StatsOverview from '../StatsOverview';
import ShoppingInsight from '../ShoppingInsight';
import BestDeals from '../BestDeals';
import PriceComparison from '../PriceComparison';
import CouponsSection from '../CouponsSection';
import ExtensionPromo from '../ExtensionPromo';
import RecentSearches from '../RecentSearches';
import SavedProducts from '../SavedProducts';
import ReviewIntelligence from '../ReviewIntelligence';

const DashboardHome = () => {
  return (
    <div className="db-page-fade">
      {/* 1. Hero / URL & Product Inspector */}
      <Hero />

      {/* 2. BuyHatke Style Real-Time Price Drops Ticker */}
      <LivePriceDropsTicker />

      {/* 3. Stats Overview */}
      <StatsOverview />

      {/* 4. Live Multi-Store Price Analyzer & Buy Advisor */}
      <PriceComparison />

      {/* 5. Today's Best Deals Across All Stores */}
      <BestDeals />

      {/* 5. Flipshope Style Verified Store Coupons & Promo Codes */}
      <CouponsSection />

      {/* 6. BuyHatke / Flipshope Chrome Addon Showcase Banner */}
      <ExtensionPromo />

      {/* 7. Personal Shopping Insight */}
      <ShoppingInsight />

      {/* 8. Secondary Grid: Recent Searches + Saved Wishlist & Review Intelligence */}
      <div className="db-grid-2col">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <RecentSearches />
          <SavedProducts />
        </div>
        <div>
          <ReviewIntelligence />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
