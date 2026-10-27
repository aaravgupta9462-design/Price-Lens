import React, { createContext, useContext, useState, useCallback } from 'react';
import { INITIAL_SAVED_PRODUCTS, NOTIFICATIONS } from '../data/mockData';
import { apiService } from '../services/api';

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

  // Real backend price alerts state (no mock INITIAL_PRICE_ALERTS fallback)
  const [priceAlerts, setPriceAlerts] = useState([]);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(false);
  const [alertsError, setAlertsError] = useState(null);

  // Real backend Review Intelligence state (no mock REVIEW_INTELLIGENCE fallback)
  const [reviewIntelligence, setReviewIntelligence] = useState(null);
  const [isLoadingReviewIntelligence, setIsLoadingReviewIntelligence] = useState(false);
  const [reviewIntelligenceError, setReviewIntelligenceError] = useState(null);

  // Global Create Alert Modal
  const [createAlertModal, setCreateAlertModal] = useState({
    open: false,
    product: null,
  });

  const openCreateAlertModal = (product) => {
    setCreateAlertModal({ open: true, product });
  };

  const closeCreateAlertModal = () => {
    setCreateAlertModal({ open: false, product: null });
  };

  // Global Share Modal
  const [shareModal, setShareModal] = useState({
    open: false,
    platform: '',
    productName: '',
    url: '',
  });

  const openShareModal = ({ platform, productName, url }) => {
    setShareModal({ open: true, platform, productName, url });
  };

  const closeShareModal = () => {
    setShareModal({ open: false, platform: '', productName: '', url: '' });
  };

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

  // Navigation handlers
  const viewProductDetail = (productId) => {
    if (productId) setSelectedProductId(productId);
    setActiveNav('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const viewPriceComparison = (productId) => {
    if (productId) setSelectedProductId(productId);
    setActiveNav('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const viewPriceHistory = (productId) => {
    if (productId) setSelectedProductId(productId);
    setActiveNav('history');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Wishlist handlers
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

  // Alerts API handlers
  const fetchAlerts = useCallback(async () => {
    setIsLoadingAlerts(true);
    setAlertsError(null);
    try {
      const data = await apiService.getAlerts();
      setPriceAlerts(data || []);
    } catch (err) {
      console.warn('[DashboardContext] Failed to load alerts:', err.message);
      setAlertsError(err.message || 'Failed to load price target alerts.');
      setPriceAlerts([]);
    } finally {
      setIsLoadingAlerts(false);
    }
  }, []);

  const createPriceAlert = async (alertData) => {
    try {
      const created = await apiService.createAlert(alertData);
      setPriceAlerts((prev) => [created, ...prev]);
      showToast('Price alert created successfully!', 'success');
      return created;
    } catch (err) {
      showToast(err.message || 'Failed to create price alert', 'error');
      throw err;
    }
  };

  const updatePriceAlert = async (id, updateData) => {
    try {
      const updated = await apiService.updateAlert(id, updateData);
      setPriceAlerts((prev) => prev.map((a) => (a.id === id ? updated : a)));
      showToast('Price alert updated successfully!', 'success');
      return updated;
    } catch (err) {
      showToast(err.message || 'Failed to update price alert', 'error');
      throw err;
    }
  };

  const removePriceAlert = async (id) => {
    try {
      await apiService.deleteAlert(id);
      setPriceAlerts((prev) => prev.filter((a) => a.id !== id));
      showToast('Price alert removed', 'info');
    } catch (err) {
      showToast(err.message || 'Failed to delete price alert', 'error');
      throw err;
    }
  };

  // Review Intelligence API handlers
  const fetchReviewIntelligence = useCallback(async (targetProductId) => {
    const pId = targetProductId || selectedProductId;
    if (!pId) return;

    setIsLoadingReviewIntelligence(true);
    setReviewIntelligenceError(null);
    setReviewIntelligence(null); // Clear stale review data when fetching/switching products

    try {
      const data = await apiService.getReviewIntelligence(pId);
      setReviewIntelligence(data);
      setReviewIntelligenceError(null);
    } catch (err) {
      console.warn('[DashboardContext] Failed to load review intelligence:', err.message);
      setReviewIntelligenceError(err.message || 'Failed to load Review Intelligence.');
      setReviewIntelligence(null);
    } finally {
      setIsLoadingReviewIntelligence(false);
    }
  }, [selectedProductId]);

  const viewReviewIntelligence = useCallback((productId) => {
    const idToUse = productId || selectedProductId;
    if (idToUse) {
      setSelectedProductId(idToUse);
      fetchReviewIntelligence(idToUse);
    }
    setActiveNav('reviews');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedProductId, fetchReviewIntelligence]);

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
        isLoadingAlerts,
        alertsError,
        fetchAlerts,
        createPriceAlert,
        updatePriceAlert,
        removePriceAlert,
        reviewIntelligence,
        isLoadingReviewIntelligence,
        reviewIntelligenceError,
        fetchReviewIntelligence,
        viewReviewIntelligence,
        shareModal,
        openShareModal,
        closeShareModal,
        createAlertModal,
        openCreateAlertModal,
        closeCreateAlertModal,
        viewProductDetail,
        viewPriceComparison,
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
