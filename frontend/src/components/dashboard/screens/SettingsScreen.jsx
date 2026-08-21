import React, { useState } from 'react';
import { User, Bell, Palette, Shield, Save, Check } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useDashboard } from '../../../context/DashboardContext';

const SettingsScreen = () => {
  const { user } = useAuth();
  const { showToast } = useDashboard();

  const [name, setName] = useState(user?.name || 'Aarav Gupta');
  const [email, setEmail] = useState(user?.email || 'aarav@pricelens.io');
  const [currency, setCurrency] = useState('INR');
  const [defaultStore, setDefaultStore] = useState('All');
  const [notifyPriceDrops, setNotifyPriceDrops] = useState(true);
  const [notifyDeals, setNotifyDeals] = useState(true);
  const [theme, setTheme] = useState('light');

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Settings saved successfully!', 'success');
  };

  return (
    <div className="db-page-fade">
      <div className="db-screen-header">
        <h1 className="db-screen-title">Account Settings</h1>
        <p className="db-screen-subtitle">
          Manage your shopping preferences, notification thresholds, and profile details.
        </p>
      </div>

      <form onSubmit={handleSave} className="db-settings-container">
        {/* 1. Profile Section */}
        <div className="db-card db-card-primary" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="db-card-header-clean" style={{ padding: '0 0 1rem 0', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} color="#2563EB" />
              <h3 className="db-card-title-sm">Profile Details</h3>
            </div>
            <span className="db-badge-soft-blue">Free Member</span>
          </div>

          <div className="db-settings-grid">
            <div className="db-form-group">
              <label className="db-form-label">Full Name</label>
              <input
                type="text"
                className="db-search-input"
                style={{ height: '42px', padding: '0 0.85rem' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="db-form-group">
              <label className="db-form-label">Email Address</label>
              <input
                type="email"
                className="db-search-input"
                style={{ height: '42px', padding: '0 0.85rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 2. Preferences */}
        <div className="db-card db-card-primary" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="db-card-header-clean" style={{ padding: '0 0 1rem 0', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={18} color="#2563EB" />
              <h3 className="db-card-title-sm">Shopping & Notification Preferences</h3>
            </div>
          </div>

          <div className="db-settings-grid" style={{ marginBottom: '1.25rem' }}>
            <div className="db-form-group">
              <label className="db-form-label">Preferred Currency</label>
              <select
                className="db-sort-select"
                style={{ width: '100%', height: '42px' }}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
              </select>
            </div>

            <div className="db-form-group">
              <label className="db-form-label">Default Preferred Retailer</label>
              <select
                className="db-sort-select"
                style={{ width: '100%', height: '42px' }}
                value={defaultStore}
                onChange={(e) => setDefaultStore(e.target.value)}
              >
                <option value="All">Compare All Stores (Recommended)</option>
                <option value="Flipkart">Flipkart Preferred</option>
                <option value="Amazon">Amazon Prime Preferred</option>
                <option value="Croma">Croma Preferred</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <label className="db-checkbox-row">
              <input
                type="checkbox"
                checked={notifyPriceDrops}
                onChange={(e) => setNotifyPriceDrops(e.target.checked)}
              />
              <div>
                <strong style={{ fontSize: '0.85rem' }}>Instant Price Drop Notifications</strong>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--db-text-muted)' }}>
                  Receive instant alerts whenever a tracked wishlist item decreases in price.
                </span>
              </div>
            </label>

            <label className="db-checkbox-row">
              <input
                type="checkbox"
                checked={notifyDeals}
                onChange={(e) => setNotifyDeals(e.target.checked)}
              />
              <div>
                <strong style={{ fontSize: '0.85rem' }}>Daily Best Deal Digest</strong>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--db-text-muted)' }}>
                  Hand-picked discounts exceeding 20% across electronics and gadgets.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* 3. Appearance */}
        <div className="db-card db-card-primary" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="db-card-header-clean" style={{ padding: '0 0 1rem 0', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Palette size={18} color="#2563EB" />
              <h3 className="db-card-title-sm">Interface Appearance</h3>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div
              className={`db-theme-option ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
            >
              <div style={{ width: '100%', height: '36px', background: '#FFFFFF', borderRadius: '4px', border: '1px solid #CBD5E1', marginBottom: '0.5rem' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Light SaaS Theme</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--db-text-muted)' }}>High contrast, clean white</span>
            </div>

            <div
              className={`db-theme-option ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
            >
              <div style={{ width: '100%', height: '36px', background: '#0F172A', borderRadius: '4px', marginBottom: '0.5rem' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>System Default</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--db-text-muted)' }}>Follows OS dark mode</span>
            </div>
          </div>
        </div>

        {/* 4. Privacy & Save Button */}
        <div className="db-card db-card-primary" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="db-card-header-clean" style={{ padding: '0 0 1rem 0', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={18} color="#2563EB" />
              <h3 className="db-card-title-sm">Data & Privacy</h3>
            </div>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--db-text-secondary)', marginBottom: '1rem' }}>
            PriceLens operates with zero tracking cookies and never sells your browsing history or saved products.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              className="db-btn-clean db-btn-clean-outline"
              onClick={() => showToast('Search history cleared from browser', 'info')}
            >
              Clear Local Search History
            </button>
            <button
              type="button"
              className="db-btn-clean db-btn-clean-outline"
              onClick={() => showToast('All price alert cookies reset', 'info')}
            >
              Reset Tracking Cache
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="db-btn-clean db-btn-clean-primary" style={{ padding: '0.7rem 1.75rem', fontSize: '0.9rem' }}>
            <Save size={15} /> Save All Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsScreen;
