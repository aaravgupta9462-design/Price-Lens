import React, { createContext, useContext, useState } from 'react';
import { INITIAL_SAVED_PRODUCTS, INITIAL_PRICE_ALERTS, NOTIFICATIONS } from '../data/mockData';

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  // Navigation: 'dashboard' | 'search' | 'compare' | 'wishlist' | 'alerts' | 'history' | 'reviews' | 'settings' | 'product-detail'
  const [activeNav, setActiveNav] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('iphone-16-128');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Saved / Wishlist items
  const [savedProducts, setSavedProducts] = useState(INITIAL_SAVED_PRODUCTS);

  // Price alerts
  const [priceAlerts, setPriceAlerts] = useState(INITIAL_PRICE_ALERTS);

  // Global Share Modal
  const [shareModal, setShareModal] = useState({
    open: false,
    platform: '',
    productName: '',
    url: '',
  });

  // Global Toast
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'info', // 'info' | 'success' | 'alert'
  });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: '', type: 'info' });
    }, 2800);
  };

  const openShareModal = ({ platform, productName, url }) => {
    setShareModal({ open: true, platform, productName, url });
  };

  const closeShareModal = () => {
    setShareModal({ open: false, platform: '', productName: '', url: '' });
  };

  const viewProductDetail = (productId) => {
    setSelectedProductId(productId);
    setActiveNav('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const viewPriceComparison = (productId) => {
    if (productId) setSelectedProductId(productId);
    setActiveNav('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const viewReviewIntelligence = (productId) => {
    if (productId) setSelectedProductId(productId);
    setActiveNav('reviews');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const viewPriceHistory = (productId) => {
    if (productId) setSelectedProductId(productId);
    setActiveNav('history');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSaveProduct = (product) => {
    const exists = savedProducts.find((p) => p.productId === product.id || p.id === product.id);
    if (exists) {
      setSavedProducts((prev) => prev.filter((p) => p.productId !== product.id && p.id !== product.id));
      showToast(`Removed ${product.name} from Wishlist`, 'info');
    } else {
      const newItem = {
        id: `sp-${Date.now()}`,
        productId: product.id,
        name: product.name,
        emoji: product.emoji || '📦',
        currentPrice: product.currentPrice,
        previousPrice: product.originalPrice || product.currentPrice,
        priceChange: 'Tracking active',
        isDrop: false,
        store: product.store || 'Online',
        addedDate: 'Just now',
      };
      setSavedProducts((prev) => [newItem, ...prev]);
      showToast(`Saved ${product.name} to Wishlist!`, 'success');
    }
  };

  const removeSavedProduct = (id) => {
    setSavedProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed from Wishlist', 'info');
  };

  const removePriceAlert = (id) => {
    setPriceAlerts((prev) => prev.filter((a) => a.id !== id));
    showToast('Price alert removed', 'info');
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast('All notifications marked as read', 'info');
  };

  return (
    <DashboardContext.Provider
      value={{
        activeNav,
        setActiveNav,
        searchQuery,
        setSearchQuery,
        selectedProductId,
        setSelectedProductId,
        sidebarOpen,
        setSidebarOpen,
        notifications,
        notifDropdownOpen,
        setNotifDropdownOpen,
        markAllNotificationsRead,
        savedProducts,
        toggleSaveProduct,
        removeSavedProduct,
        priceAlerts,
        removePriceAlert,
        shareModal,
        openShareModal,
        closeShareModal,
        viewProductDetail,
        viewPriceComparison,
        viewReviewIntelligence,
        viewPriceHistory,
        toast,
        showToast,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
};
