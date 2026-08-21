import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useDashboard } from '../../../context/DashboardContext';
import Hero from '../Hero';
import StatsOverview from '../StatsOverview';
import ShoppingInsight from '../ShoppingInsight';
import BestDeals from '../BestDeals';
import PriceComparison from '../PriceComparison';
import RecentSearches from '../RecentSearches';
import SavedProducts from '../SavedProducts';
import ReviewIntelligence from '../ReviewIntelligence';

const DashboardHome = () => {
  const { user } = useAuth();
  const displayName = user?.name || user?.email?.split('@')[0] || 'Aarav';

  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="db-page-fade">
      {/* Personalized Header */}
      <div className="db-welcome-greeting-row">
        <div>
          <h1 className="db-page-greeting">Good morning, {displayName} 👋</h1>
          <p className="db-page-greeting-sub">
            Find better prices. Compare smarter across all major stores.
          </p>
        </div>
        <div className="db-status-pill">
          <span className="db-status-dot" />
          <span>Live Tracking Active · {todayStr}</span>
        </div>
      </div>

      {/* Hero / Search */}
      <Hero />

      {/* Stats Overview (4 Refined White Blocks) */}
      <StatsOverview />

      {/* Personal Shopping Insight */}
      <ShoppingInsight />

      {/* Main Grid: Best Deals & Live Price Comparison */}
      <div className="db-grid-deals">
        <BestDeals />
        <PriceComparison />
      </div>

      {/* Secondary Grid: Recent Searches + Saved For Later & Review Intelligence */}
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
