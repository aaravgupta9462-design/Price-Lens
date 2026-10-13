import React, { useState } from 'react';
import {
  Tag,
  Scale,
  Search,
  Star,
  Bell,
  Heart,
  TrendingUp,
  Zap,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { useAuth } from '../../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';

const TopNavbar = () => {
  const {
    activeNav,
    setActiveNav,
    savedProducts,
    priceAlerts,
    notifications,
    notifDropdownOpen,
    setNotifDropdownOpen,
  } = useDashboard();

  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const displayName = user?.name || user?.email?.split('@')[0] || 'Aarav Gupta';
  const initial = displayName.charAt(0).toUpperCase();
  const unreadCount = notifications.filter((n) => n.unread).length;

  const navTabs = [
    { id: 'dashboard', label: 'Deals',     icon: '🛍️' },
    { id: 'search',    label: 'Search',    icon: '🔍' },
    { id: 'compare',   label: 'Compare',   icon: '⚖️' },
    { id: 'reviews',   label: 'Reviews',   icon: '✨' },
    { id: 'wishlist',  label: 'Wishlist',  icon: '💖', badge: savedProducts.length },
    { id: 'alerts',    label: 'Alerts',    icon: '🔔', badge: priceAlerts.length },
    { id: 'history',   label: 'History',   icon: '📈' },
  ];

  const handleTabClick = (id) => {
    setActiveNav(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="db-top-header-wrapper">
      {/* 1. Top Ribbon Banner (Refined Minimal) */}
      <div className="db-top-ribbon">
        <div className="db-top-ribbon-content">
          <div className="db-top-ribbon-left">
            <span className="db-ribbon-live-badge">Live</span>
            <span>Real-time price comparisons & review authenticity intelligence across 100+ stores</span>
          </div>
          <div className="db-top-ribbon-right">
            <span className="db-ribbon-meta">IN · INR (₹)</span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="db-navbar-main">
        <div className="db-navbar-container">
          {/* Logo */}
          <div
            className="db-brand-logo"
            onClick={() => handleTabClick('dashboard')}
            title="PriceLens Home"
          >
            <div className="db-brand-icon-box">
              <Zap size={19} />
            </div>
            <div className="db-brand-text-col">
              <span className="db-brand-title">
                Price<span>Lens</span>
              </span>
              <span className="db-brand-subtitle">Shopping Intelligence</span>
            </div>
          </div>

          {/* Center Category & Feature Tabs */}
          <nav className="db-center-nav-tabs">
            {navTabs.map((tab) => {
              const isActive = activeNav === tab.id;
              return (
                <button
                  key={tab.id}
                  className={`db-nav-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleTabClick(tab.id)}
                >
                  <span className="db-nav-tab-emoji">{tab.icon}</span>
                  <span className="db-nav-tab-label">{tab.label}</span>
                  {tab.badge > 0 && (
                    <span className="db-nav-tab-badge">{tab.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="db-navbar-actions">
            {/* Wishlist shortcut */}
            <button
              className={`db-action-circle-btn ${activeNav === 'wishlist' ? 'active' : ''}`}
              onClick={() => handleTabClick('wishlist')}
              title="Saved Wishlist"
              aria-label="Wishlist"
            >
              <Heart size={17} />
              {savedProducts.length > 0 && (
                <span className="db-badge-dot-num">{savedProducts.length}</span>
              )}
            </button>

            {/* Notifications Popover */}
            <div style={{ position: 'relative' }}>
              <button
                className={`db-action-circle-btn ${notifDropdownOpen ? 'active' : ''}`}
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell size={17} />
                {unreadCount > 0 && <span className="db-badge-dot" />}
              </button>
              <NotificationDropdown />
            </div>

            {/* User Profile / Menu */}
            <div style={{ position: 'relative' }}>
              <div
                className="db-user-pill-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                title="User Account"
              >
                <div className="db-user-avatar-circle">{initial}</div>
                <span className="db-user-name-text">{displayName}</span>
                <ChevronDown size={14} className="db-user-chevron" />
              </div>

              {userMenuOpen && (
                <>
                  <div
                    className="db-menu-backdrop"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="db-user-dropdown-menu">
                    <div className="db-user-dropdown-header">
                      <strong>{displayName}</strong>
                      <span>{user?.email || 'aarav@pricelens.io'}</span>
                    </div>

                    <div className="db-user-dropdown-body">
                      <button
                        className="db-dropdown-item"
                        onClick={() => {
                          setUserMenuOpen(false);
                          setActiveNav('settings');
                        }}
                      >
                        <Settings size={15} />
                        <span>Account Settings</span>
                      </button>

                      <button
                        className="db-dropdown-item"
                        onClick={() => {
                          setUserMenuOpen(false);
                          setActiveNav('wishlist');
                        }}
                      >
                        <Heart size={15} />
                        <span>Saved Products ({savedProducts.length})</span>
                      </button>

                      <button
                        className="db-dropdown-item"
                        onClick={() => {
                          setUserMenuOpen(false);
                          setActiveNav('alerts');
                        }}
                      >
                        <Bell size={15} />
                        <span>Price Alerts ({priceAlerts.length})</span>
                      </button>

                      <div className="db-dropdown-divider" />

                      <button
                        className="db-dropdown-item logout"
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                      >
                        <LogOut size={15} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
