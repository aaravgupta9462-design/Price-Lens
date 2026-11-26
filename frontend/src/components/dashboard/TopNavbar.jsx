import React, { useState, useEffect } from 'react';
import {
  Flame,
  TrendingDown,
  Layers,
  Ticket,
  LayoutGrid,
  Sparkles,
  BellRing,
  Puzzle,
  Bell,
  Heart,
  Settings,
  LogOut,
  ChevronDown,
  Zap,
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { useAuth } from '../../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';

const TopNavbar = ({ onOpenAuth }) => {
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
  const [activeTab, setActiveTab] = useState('deals');

  const displayName = user?.name || user?.email?.split('@')[0] || 'Purvansh Khandelwal';
  const initial = displayName.charAt(0).toUpperCase();
  const unreadCount = 4; // Matching screenshot notification count

  const navTabs = [
    {
      id: 'deals',
      label: 'Deals',
      icon: Flame,
      scrollId: 'popular-deals',
    },
    {
      id: 'history',
      label: 'Price Graph',
      icon: TrendingDown,
      scrollId: 'price-comparison-section',
    },
    {
      id: 'compare',
      label: 'Compare',
      icon: Layers,
      scrollId: 'price-comparison-section',
    },
    {
      id: 'coupons',
      label: 'Coupons',
      icon: Ticket,
      scrollId: 'coupons-section',
      badge: 'Codes',
      badgeType: 'codes',
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: LayoutGrid,
      scrollId: 'category',
    },
    {
      id: 'advisor',
      label: 'Buy Advisor',
      icon: Sparkles,
      scrollId: 'buy-advisor',
      badge: 'AI',
      badgeType: 'ai',
    },
    {
      id: 'alerts',
      label: 'Price Alerts',
      icon: BellRing,
      scrollId: 'alerts',
    },
    {
      id: 'extension',
      label: 'Extension',
      icon: Puzzle,
      scrollId: 'extension-section',
      badge: 'Free',
      badgeType: 'free',
    },
  ];

  // Auto-highlight active tab based on scroll position
  useEffect(() => {
    if (activeNav !== 'dashboard') return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY < 260) {
            setActiveTab('deals');
            ticking = false;
            return;
          }

          const sections = [
            { scrollId: 'alerts', tabId: 'alerts' },
            { scrollId: 'buy-advisor', tabId: 'advisor' },
            { scrollId: 'price-comparison-section', tabId: 'history' },
            { scrollId: 'category', tabId: 'categories' },
            { scrollId: 'coupons-section', tabId: 'coupons' },
            { scrollId: 'popular-deals', tabId: 'deals' },
            { scrollId: 'extension-section', tabId: 'extension' },
          ];

          for (const sec of sections) {
            const el = document.getElementById(sec.scrollId);
            if (el) {
              const top = el.offsetTop - 120;
              const height = el.offsetHeight;
              if (window.scrollY >= top && window.scrollY < top + height) {
                if (sec.scrollId === 'price-comparison-section') {
                  setActiveTab((prev) => (prev === 'compare' ? 'compare' : 'history'));
                } else {
                  setActiveTab(sec.tabId);
                }
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeNav]);

  const handleTabClick = (tab) => {
    if (typeof tab === 'object') {
      setActiveTab(tab.id);
    }

    if (activeNav !== 'dashboard') {
      setActiveNav('dashboard');
    }

    const scrollTarget = typeof tab === 'object' && tab.scrollId ? tab.scrollId : null;

    if (scrollTarget) {
      setTimeout(() => {
        const el = document.getElementById(scrollTarget);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="db-top-header-wrapper">
      {/* Main Navigation Bar */}
      <div className="db-navbar-main">
        <div className="db-navbar-container">
          {/* Logo */}
          <div
            className="db-brand-logo"
            onClick={() => handleTabClick({ id: 'deals', scrollId: null })}
            title="PriceLens Home"
          >
            <div className="db-brand-icon-box">
              <Zap size={18} fill="#FFFFFF" color="#FFFFFF" />
            </div>
            <div className="db-brand-text-col">
              <span className="db-brand-title">PriceLens</span>
            </div>
          </div>

          {/* Center Category & Feature Tabs */}
          <nav className="db-center-nav-tabs" aria-label="Section navigation">
            {navTabs.map((tab) => {
              const IconComp = tab.icon;
              const isTabActive = activeNav === 'dashboard' && activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  className={`db-nav-tab-btn ${isTabActive ? 'active' : ''}`}
                  onClick={() => handleTabClick(tab)}
                  title={`Navigate to ${tab.label}`}
                  type="button"
                >
                  <IconComp size={14} className="db-nav-tab-icon" />
                  <span className="db-nav-tab-label">{tab.label}</span>
                  {tab.badge && (
                    <span className={`db-tab-micro-badge db-tab-badge-${tab.badgeType || 'default'}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="db-navbar-actions">
            {/* Wishlist text button */}
            <button
              className={`db-nav-text-action ${activeNav === 'wishlist' ? 'active' : ''}`}
              onClick={() => handleTabClick('wishlist')}
              title="Saved Wishlist"
              aria-label="Wishlist"
            >
              <Heart size={16} />
              <span>Wishlist</span>
              {savedProducts.length > 0 && (
                <span className="db-action-count-pill">{savedProducts.length}</span>
              )}
            </button>

            {/* Alerts with Popover */}
            <div style={{ position: 'relative' }}>
              <button
                className={`db-nav-text-action ${notifDropdownOpen ? 'active' : ''}`}
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                title="Price Alerts"
                aria-label="Alerts"
              >
                <Bell size={16} />
                <span>Alerts</span>
                <span className="db-action-count-badge red">4</span>
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
                <span className="db-user-name-text">
                  {displayName.length > 15 ? displayName.substring(0, 14) + '...' : displayName}
                </span>
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

                      {user ? (
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
                      ) : (
                        <button
                          className="db-dropdown-item"
                          onClick={() => {
                            setUserMenuOpen(false);
                            if (onOpenAuth) onOpenAuth();
                          }}
                        >
                          <LogOut size={15} style={{ transform: 'rotate(180deg)' }} />
                          <span>Sign In / Create Account</span>
                        </button>
                      )}
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
