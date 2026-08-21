import React from 'react';
import {
  LayoutDashboard,
  Search,
  Scale,
  Heart,
  Bell,
  TrendingUp,
  Star,
  Settings,
  LogOut,
  Zap,
} from 'lucide-react';
import { MAIN_NAV_ITEMS, ACCOUNT_NAV_ITEMS } from '../../data/mockData';
import { useDashboard } from '../../context/DashboardContext';
import { useAuth } from '../../context/AuthContext';

const iconMap = {
  LayoutDashboard,
  Search,
  Scale,
  Heart,
  Bell,
  TrendingUp,
  Star,
  Settings,
};

const Sidebar = () => {
  const { activeNav, setActiveNav, sidebarOpen, setSidebarOpen, savedProducts, priceAlerts } = useDashboard();
  const { logout } = useAuth();

  const handleNavClick = (id) => {
    setActiveNav(id);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`db-sidebar-overlay ${sidebarOpen ? 'db-overlay-open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`db-sidebar ${sidebarOpen ? 'db-sidebar-open' : ''}`}>
        <div className="db-sidebar-header">
          <div
            className="db-sidebar-brand"
            style={{ cursor: 'pointer' }}
            onClick={() => handleNavClick('dashboard')}
          >
            <div className="db-sidebar-brand-icon">
              <Zap size={18} />
            </div>
            <div>
              <div className="db-sidebar-brand-name">
                Price<span>Lens</span>
              </div>
            </div>
          </div>
          <div className="db-sidebar-tagline">Smart Shopping Intelligence</div>
        </div>

        <nav className="db-nav">
          <div className="db-nav-label">MAIN</div>

          {MAIN_NAV_ITEMS.map((item) => {
            const IconComponent = iconMap[item.icon] || LayoutDashboard;
            const isActive = activeNav === item.id;
            const badgeValue =
              item.id === 'wishlist'
                ? savedProducts.length
                : item.id === 'alerts'
                ? priceAlerts.length
                : null;

            return (
              <button
                key={item.id}
                className={`db-nav-item ${isActive ? 'db-nav-active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <IconComponent size={17} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {badgeValue !== null && badgeValue > 0 && (
                  <span className={`db-sidebar-badge ${isActive ? 'active' : ''}`}>
                    {badgeValue}
                  </span>
                )}
              </button>
            );
          })}

          <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.06)', margin: '0.75rem 0.25rem' }} />

          <div className="db-nav-label">ACCOUNT</div>

          {ACCOUNT_NAV_ITEMS.map((item) => {
            const IconComponent = iconMap[item.icon] || Settings;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                className={`db-nav-item ${isActive ? 'db-nav-active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <IconComponent size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="db-sidebar-bottom">
          <button
            className="db-nav-item"
            style={{ color: '#F87171' }}
            onClick={logout}
          >
            <LogOut size={17} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
