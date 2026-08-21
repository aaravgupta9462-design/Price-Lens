import React from 'react';
import { DashboardProvider, useDashboard } from '../../context/DashboardContext';
import TopNavbar from './TopNavbar';
import DashboardFooter from './DashboardFooter';
import ShareModal from './ShareModal';
import Toast from './Toast';

// Screens
import DashboardHome from './screens/DashboardHome';
import SearchProductsScreen from './screens/SearchProductsScreen';
import ComparePricesScreen from './screens/ComparePricesScreen';
import WishlistScreen from './screens/WishlistScreen';
import PriceAlertsScreen from './screens/PriceAlertsScreen';
import PriceHistoryScreen from './screens/PriceHistoryScreen';
import ReviewIntelligenceScreen from './screens/ReviewIntelligenceScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import SettingsScreen from './screens/SettingsScreen';

import '../../dashboard.css';

const ScreenRenderer = () => {
  const { activeNav } = useDashboard();

  switch (activeNav) {
    case 'search':
      return <SearchProductsScreen />;
    case 'compare':
      return <ComparePricesScreen />;
    case 'wishlist':
      return <WishlistScreen />;
    case 'alerts':
      return <PriceAlertsScreen />;
    case 'history':
      return <PriceHistoryScreen />;
    case 'reviews':
      return <ReviewIntelligenceScreen />;
    case 'product-detail':
      return <ProductDetailScreen />;
    case 'settings':
      return <SettingsScreen />;
    case 'dashboard':
    default:
      return <DashboardHome />;
  }
};

const DashboardContent = () => {
  return (
    <div className="db-shell-topbar-layout">
      {/* Top Header Navbar with Category Tabs */}
      <TopNavbar />

      {/* Main Content Area */}
      <main className="db-main-full-content">
        <div className="db-content-container">
          <ScreenRenderer />
        </div>
      </main>

      {/* Footer */}
      <DashboardFooter />

      {/* Global Overlays & Modals */}
      <ShareModal />
      <Toast />
    </div>
  );
};

export const DashboardLayout = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default DashboardLayout;
