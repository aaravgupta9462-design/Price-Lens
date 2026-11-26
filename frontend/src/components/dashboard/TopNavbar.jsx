import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  TrendingDown,
  Layers,
  Ticket,
  LayoutGrid,
  Sparkles,
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

const TopNavbar = ({ onOpenAuth }) => {
  const {
    activeNav,
    setActiveNav,
    savedProducts,
    priceAlerts,
  } = useDashboard();

  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('deals');
  const isProgrammaticScrollRef = useRef(false);

  const displayName = user?.name || user?.email?.split('@')[0] || 'Purvansh Khandelwal';
  const initial = displayName.charAt(0).toUpperCase();

  const navTabs = [
    {
      id: 'deals',
      label: 'Deals',
      icon: Flame,
      scrollId: 'popular-deals',
    },
    {
      id: 'compare',
      label: 'Compare',
      icon: Layers,
      scrollId: 'price-comparison-section',
    },
    {
      id: 'history',
      label: 'Price Graph',
      icon: TrendingDown,
      scrollId: 'price-history-section',
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
      if (isProgrammaticScrollRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY < 260) {
            setActiveTab('deals');
            ticking = false;
            return;
          }

          const orderedSections = [
            { scrollId: 'extension-section', tabId: 'extension' },
            { scrollId: 'popular-deals', tabId: 'deals' },
            { scrollId: 'coupons-section', tabId: 'coupons' },
            { scrollId: 'category', tabId: 'categories' },
            { scrollId: 'price-comparison-section', tabId: 'compare' },
            { scrollId: 'price-history-section', tabId: 'history' },
            { scrollId: 'buy-advisor', tabId: 'advisor' },
          ];

          let currentActive = 'deals';
          for (const sec of orderedSections) {
            const el = document.getElementById(sec.scrollId);
            if (el) {
              const rect = el.getBoundingClientRect();
              const top = rect.top + window.scrollY - 140;
              if (window.scrollY >= top) {
                currentActive = sec.tabId;
              }
            }
          }
          setActiveTab(currentActive);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeNav]);

  const handleTabClick = (tab) => {
    const tabObj = typeof tab === 'string' ? navTabs.find((t) => t.id === tab) : tab;
    const tabId = tabObj ? tabObj.id : tab;
    setActiveTab(tabId);
    isProgrammaticScrollRef.current = true;
    setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 800);

    if (activeNav !== 'dashboard') {
      setActiveNav('dashboard');
    }

    const scrollTarget = tabObj && tabObj.scrollId ? tabObj.scrollId : null;

    if (scrollTarget) {
      setTimeout(() => {
        const el = document.getElementById(scrollTarget);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="db-top-header-wrapper">
      {/* Main Navigation Bar */}
      <div className="db-navbar-main">
        <div className="db-navbar-container">
          {/* Brand Logo */}
          <div
            className="db-brand-logo"
            onClick={() => handleTabClick({ id: 'deals', scrollId: null })}
            title="PriceLens Home"
          >
            <img
              src="/logo.png"
              alt="PriceLens — Compare • Track • Save"
              className="db-navbar-brand-logo-img"
            />
          </div>

          {/* Enriched & Enlarged Center Category/Feature Capsule Bar */}
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
                  {isTabActive && (
                    <motion.span
                      layoutId="plNavbarActivePill"
                      className="db-nav-active-pill-bg"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="db-nav-tab-content">
                    <IconComp size={16} className="db-nav-tab-icon" />
                    <span className="db-nav-tab-label">{tab.label}</span>
                    {tab.badge && (
                      <span className={`db-tab-micro-badge db-tab-badge-${tab.badgeType || 'default'}`}>
                        {tab.badge}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Wishlist & Alerts removed as requested; clean user profile */}
          <div className="db-navbar-actions">
            {/* User Profile / Menu Pill */}
            <div style={{ position: 'relative' }}>
              <div
                className="db-user-pill-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                title="User Account"
              >
                <div className="db-user-avatar-circle">{initial}</div>
                <span className="db-user-name-text">
                  {displayName.length > 16 ? displayName.substring(0, 15) + '...' : displayName}
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
                      <span>{user?.email || 'purvansh@pricelens.io'}</span>
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
                        <span>Saved Wishlist ({savedProducts.length})</span>
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
