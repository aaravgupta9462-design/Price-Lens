import React, { useState, useEffect } from 'react';
import {
  User,
  Bell,
  Palette,
  Shield,
  Save,
  Check,
  Smartphone,
  Mail,
  MapPin,
  CreditCard,
  Building2,
  Lock,
  Download,
  Trash2,
  Sparkles,
  ExternalLink,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Globe
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useDashboard } from '../../../context/DashboardContext';

const SettingsScreen = () => {
  const { user, updateProfile } = useAuth();
  const { showToast, savedProducts, priceAlerts } = useDashboard();

  // Active Tab State
  const [activeTab, setActiveTab] = useState('profile');

  // 1. Profile State
  const [name, setName] = useState(user?.name || 'Purvansh Khandelwal');
  const [email, setEmail] = useState(user?.email || 'student@college.edu');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [pincode, setPincode] = useState(user?.pincode || '110001');
  const [city, setCity] = useState(user?.city || 'New Delhi, India');
  const [studentId, setStudentId] = useState(user?.studentId || 'STU-2026-9481');
  const [avatarSeed, setAvatarSeed] = useState(user?.avatar || 'Aarav');
  const [membershipTier, setMembershipTier] = useState('Student Pro Member');

  // 2. Alert & Notification Preferences
  const [priceDropThreshold, setPriceDropThreshold] = useState(10); // 10% drop
  const [minSavingsAmount, setMinSavingsAmount] = useState(500); // ₹500
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifyDailyDigest, setNotifyDailyDigest] = useState(true);
  const [notifyLightningDeals, setNotifyLightningDeals] = useState(false);
  const [alertFrequency, setAlertFrequency] = useState('instant'); // 'instant' | 'daily' | 'weekly'

  // 3. Store & Shopping Preferences
  const [currency, setCurrency] = useState('INR');
  const [defaultStore, setDefaultStore] = useState('All');
  const [enabledStores, setEnabledStores] = useState({
    amazon: true,
    flipkart: true,
    croma: true,
    reliance: true,
    vijaysales: true,
    tatacliq: true
  });
  const [preferredBanks, setPreferredBanks] = useState(['HDFC', 'SBI', 'ICICI']);

  // 4. Security & Authentication State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Load saved settings from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pricelens_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.priceDropThreshold) setPriceDropThreshold(parsed.priceDropThreshold);
        if (parsed.minSavingsAmount) setMinSavingsAmount(parsed.minSavingsAmount);
        if (parsed.notifyEmail !== undefined) setNotifyEmail(parsed.notifyEmail);
        if (parsed.notifyWhatsapp !== undefined) setNotifyWhatsapp(parsed.notifyWhatsapp);
        if (parsed.notifyPush !== undefined) setNotifyPush(parsed.notifyPush);
        if (parsed.notifyDailyDigest !== undefined) setNotifyDailyDigest(parsed.notifyDailyDigest);
        if (parsed.currency) setCurrency(parsed.currency);
        if (parsed.defaultStore) setDefaultStore(parsed.defaultStore);
        if (parsed.enabledStores) setEnabledStores(parsed.enabledStores);
        if (parsed.preferredBanks) setPreferredBanks(parsed.preferredBanks);
        if (parsed.twoFactorEnabled !== undefined) setTwoFactorEnabled(parsed.twoFactorEnabled);
      }
    } catch {
      // ignore parsing error
    }
  }, []);

  // Handle Profile Save
  const handleSaveProfile = (e) => {
    if (e) e.preventDefault();
    if (updateProfile) {
      updateProfile({
        name,
        email,
        phone,
        pincode,
        city,
        studentId
      });
    }

    const settingsObj = {
      priceDropThreshold,
      minSavingsAmount,
      notifyEmail,
      notifyWhatsapp,
      notifyPush,
      notifyDailyDigest,
      notifyLightningDeals,
      alertFrequency,
      currency,
      defaultStore,
      enabledStores,
      preferredBanks,
      twoFactorEnabled
    };

    localStorage.setItem('pricelens_settings', JSON.stringify(settingsObj));
    showToast('Account Settings updated and saved successfully!', 'success');
  };

  // Toggle Store
  const toggleStore = (storeKey) => {
    setEnabledStores((prev) => ({
      ...prev,
      [storeKey]: !prev[storeKey]
    }));
  };

  // Toggle Preferred Bank
  const toggleBank = (bank) => {
    setPreferredBanks((prev) =>
      prev.includes(bank) ? prev.filter((b) => b !== bank) : [...prev, bank]
    );
  };

  // Handle Password Update
  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('New password must be at least 6 characters long.', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Password changed successfully!', 'success');
  };

  // Export User Tracking & Watchlist Data
  const handleExportData = () => {
    const exportPayload = {
      user: { name, email, phone, studentId, membershipTier },
      savedProducts: savedProducts || [],
      priceAlerts: priceAlerts || [],
      exportDate: new Date().toISOString(),
      platform: 'PriceLens Price Intelligence'
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `pricelens_account_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Account data exported successfully (JSON format)!', 'success');
  };

  const navTabs = [
    { id: 'profile', label: 'Profile & Identity', icon: User, badge: 'Active' },
    { id: 'alerts', label: 'Price Alerts & Drops', icon: Bell, badge: `${priceDropThreshold}% Drop` },
    { id: 'stores', label: 'Stores & Currency', icon: Building2, badge: `${currency}` },
    { id: 'security', label: 'Security & 2FA', icon: Shield, badge: 'Protected' },
    { id: 'privacy', label: 'Data & Privacy', icon: Sliders }
  ];

  return (
    <div className="db-page-fade">
      {/* ── Screen Header ────────────────────────────────────────── */}
      <div className="db-screen-header" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <h1 className="db-screen-title" style={{ margin: 0 }}>Account Settings</h1>
              <span className="db-badge-soft-blue" style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem' }}>
                <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {membershipTier}
              </span>
            </div>
            <p className="db-screen-subtitle">
              Manage your personal profile, price drop thresholds, multi-store comparison priorities, and login security.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveProfile}
            className="db-btn-clean db-btn-clean-primary"
            style={{ padding: '0.65rem 1.4rem', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
          >
            <Save size={16} /> Save All Settings
          </button>
        </div>

        {/* ── Settings Sub-Tabs ─────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
            marginTop: '1.25rem',
            borderBottom: '1px solid #E2E8F0'
          }}
        >
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1.1rem',
                  borderRadius: '8px',
                  border: isActive ? '1px solid #2563EB' : '1px solid transparent',
                  background: isActive ? '#EFF6FF' : '#FFFFFF',
                  color: isActive ? '#1D4ED8' : '#64748B',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={15} color={isActive ? '#1D4ED8' : '#64748B'} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    style={{
                      fontSize: '0.68rem',
                      padding: '0.1rem 0.45rem',
                      borderRadius: '12px',
                      background: isActive ? '#DBEAFE' : '#F1F5F9',
                      color: isActive ? '#1E40AF' : '#64748B',
                      fontWeight: 600
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="db-settings-container">
        {/* ══════════════════════════════════════════════════════════
            TAB 1: PROFILE & IDENTITY
        ══════════════════════════════════════════════════════════ */}
        {activeTab === 'profile' && (
          <div className="db-page-fade">
            {/* User Avatar & Header Card */}
            <div className="db-card db-card-primary" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                  }}
                >
                  {name ? name.charAt(0).toUpperCase() : 'U'}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{name}</h2>
                    <span className="db-badge-soft-green" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <CheckCircle2 size={11} /> Verified Account
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0 0 0.4rem 0' }}>{email}</p>
                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: '#475569', flexWrap: 'wrap' }}>
                    <span>📍 {city}</span>
                    <span>•</span>
                    <span>🎓 Student ID: <strong>{studentId}</strong></span>
                    <span>•</span>
                    <span>✨ Plan: <strong style={{ color: '#2563EB' }}>{membershipTier}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Form Details */}
            <div className="db-card db-card-primary" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="db-card-header-clean" style={{ padding: '0 0 1rem 0', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={18} color="#2563EB" />
                  <h3 className="db-card-title-sm">Personal Information</h3>
                </div>
              </div>

              <div className="db-settings-grid" style={{ rowGap: '1.25rem' }}>
                <div className="db-form-group">
                  <label className="db-form-label">Full Name</label>
                  <input
                    type="text"
                    className="db-search-input"
                    style={{ height: '42px', padding: '0 0.85rem' }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="db-form-group">
                  <label className="db-form-label">Email Address (Google Account Linked)</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      className="db-search-input"
                      style={{ height: '42px', padding: '0 0.85rem 0 2.2rem' }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@college.edu"
                    />
                    <Mail size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '13px' }} />
                  </div>
                </div>

                <div className="db-form-group">
                  <label className="db-form-label">Mobile Number (For WhatsApp Price Alerts)</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="tel"
                      className="db-search-input"
                      style={{ height: '42px', padding: '0 0.85rem 0 2.2rem' }}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                    <Smartphone size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '13px' }} />
                  </div>
                </div>

                <div className="db-form-group">
                  <label className="db-form-label">College / Student ID</label>
                  <input
                    type="text"
                    className="db-search-input"
                    style={{ height: '42px', padding: '0 0.85rem' }}
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. STU-2026-9481"
                  />
                </div>

                <div className="db-form-group">
                  <label className="db-form-label">Delivery Pincode (For Accurate Store Shipping)</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="db-search-input"
                      style={{ height: '42px', padding: '0 0.85rem 0 2.2rem' }}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="e.g. 110001"
                    />
                    <MapPin size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '13px' }} />
                  </div>
                </div>

                <div className="db-form-group">
                  <label className="db-form-label">City & State</label>
                  <input
                    type="text"
                    className="db-search-input"
                    style={{ height: '42px', padding: '0 0.85rem' }}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. New Delhi, Delhi"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            TAB 2: PRICE ALERTS & NOTIFICATIONS
        ══════════════════════════════════════════════════════════ */}
        {activeTab === 'alerts' && (
          <div className="db-page-fade">
            <div className="db-card db-card-primary" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="db-card-header-clean" style={{ padding: '0 0 1rem 0', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Bell size={18} color="#2563EB" />
                  <h3 className="db-card-title-sm">Price Drop Trigger Thresholds</h3>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="db-form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Minimum Price Drop Percentage to Trigger Alert</span>
                  <strong style={{ color: '#2563EB', fontSize: '0.95rem' }}>{priceDropThreshold}% or more</strong>
                </label>
                <input
                  type="range"
                  min="2"
                  max="50"
                  step="1"
                  value={priceDropThreshold}
                  onChange={(e) => setPriceDropThreshold(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#2563EB', cursor: 'pointer', height: '6px' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B', marginTop: '0.35rem' }}>
                  <span>2% (High sensitivity)</span>
                  <span>10% (Recommended)</span>
                  <span>25% (Major drops)</span>
                  <span>50% (Flash clearance)</span>
                </div>
              </div>

              <div className="db-settings-grid">
                <div className="db-form-group">
                  <label className="db-form-label">Minimum Savings Amount (₹)</label>
                  <input
                    type="number"
                    className="db-search-input"
                    style={{ height: '42px', padding: '0 0.85rem' }}
                    value={minSavingsAmount}
                    onChange={(e) => setMinSavingsAmount(Number(e.target.value))}
                    placeholder="500"
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.25rem', display: 'block' }}>
                    Only alert if total savings across stores is at least ₹{minSavingsAmount}.
                  </span>
                </div>

                <div className="db-form-group">
                  <label className="db-form-label">Alert Delivery Frequency</label>
                  <select
                    className="db-sort-select"
                    style={{ width: '100%', height: '42px' }}
                    value={alertFrequency}
                    onChange={(e) => setAlertFrequency(e.target.value)}
                  >
                    <option value="instant">⚡ Real-Time Instant Alert (As soon as price drops)</option>
                    <option value="daily">📅 Daily 8:00 PM Summary Digest</option>
                    <option value="weekly">📊 Weekly Weekend Deal Report</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Channels */}
            <div className="db-card db-card-primary" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 className="db-card-title-sm" style={{ marginBottom: '1rem' }}>Active Alert Channels</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label className="db-checkbox-row" style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px' }}>
                  <input
                    type="checkbox"
                    checked={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.checked)}
                  />
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: '#0F172A' }}>📧 Email Price Alerts</strong>
                    <span style={{ display: 'block', fontSize: '0.76rem', color: '#64748B' }}>
                      Sends instant comparison links directly to <strong>{email}</strong> when a store drops price.
                    </span>
                  </div>
                </label>

                <label className="db-checkbox-row" style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px' }}>
                  <input
                    type="checkbox"
                    checked={notifyWhatsapp}
                    onChange={(e) => setNotifyWhatsapp(e.target.checked)}
                  />
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: '#0F172A' }}>💬 WhatsApp & SMS Drop Alerts</strong>
                    <span style={{ display: 'block', fontSize: '0.76rem', color: '#64748B' }}>
                      Sends mobile ping with 1-click Buy Now link to <strong>{phone}</strong>.
                    </span>
                  </div>
                </label>

                <label className="db-checkbox-row" style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px' }}>
                  <input
                    type="checkbox"
                    checked={notifyPush}
                    onChange={(e) => setNotifyPush(e.target.checked)}
                  />
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: '#0F172A' }}>🔔 Browser Desktop Push Notifications</strong>
                    <span style={{ display: 'block', fontSize: '0.76rem', color: '#64748B' }}>
                      Displays instant system notifications in Safari / Chrome when a tracked product hits target price.
                    </span>
                  </div>
                </label>

                <label className="db-checkbox-row" style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px' }}>
                  <input
                    type="checkbox"
                    checked={notifyDailyDigest}
                    onChange={(e) => setNotifyDailyDigest(e.target.checked)}
                  />
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: '#0F172A' }}>📰 Daily Best Deals Digest</strong>
                    <span style={{ display: 'block', fontSize: '0.76rem', color: '#64748B' }}>
                      Curated top 5 discounted electronics deals matching your search history every morning.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            TAB 3: STORES & CURRENCY
        ══════════════════════════════════════════════════════════ */}
        {activeTab === 'stores' && (
          <div className="db-page-fade">
            <div className="db-card db-card-primary" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="db-card-header-clean" style={{ padding: '0 0 1rem 0', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Globe size={18} color="#2563EB" />
                  <h3 className="db-card-title-sm">Regional & Currency Preferences</h3>
                </div>
              </div>

              <div className="db-settings-grid">
                <div className="db-form-group">
                  <label className="db-form-label">Preferred Currency Display</label>
                  <select
                    className="db-sort-select"
                    style={{ width: '100%', height: '42px' }}
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="INR">₹ INR - Indian Rupee (Default)</option>
                    <option value="USD">$ USD - US Dollar</option>
                    <option value="EUR">€ EUR - Euro</option>
                    <option value="GBP">£ GBP - British Pound</option>
                  </select>
                </div>

                <div className="db-form-group">
                  <label className="db-form-label">Default Comparison Priority</label>
                  <select
                    className="db-sort-select"
                    style={{ width: '100%', height: '42px' }}
                    value={defaultStore}
                    onChange={(e) => setDefaultStore(e.target.value)}
                  >
                    <option value="All">Compare All Stores (Recommended)</option>
                    <option value="Amazon">Amazon Prime Preferred</option>
                    <option value="Flipkart">Flipkart Plus Preferred</option>
                    <option value="Croma">Croma Retail Preferred</option>
                    <option value="Reliance">Reliance Digital Preferred</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Multi-Store Priority Toggles */}
            <div className="db-card db-card-primary" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 className="db-card-title-sm">Enabled E-Commerce Platforms</h3>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Toggle stores you want PriceLens to scan</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.85rem' }}>
                {[
                  { key: 'amazon', name: 'Amazon India', speed: 'Fast API Scanner', color: '#FF9900' },
                  { key: 'flipkart', name: 'Flipkart', speed: 'Live Inventory Sync', color: '#2874F0' },
                  { key: 'croma', name: 'Croma Electronics', speed: 'Tata Store Network', color: '#00B5B8' },
                  { key: 'reliance', name: 'Reliance Digital', speed: 'Express Store Pickup', color: '#E42529' },
                  { key: 'vijaysales', name: 'Vijay Sales', speed: 'Direct Retail Price', color: '#C8102E' },
                  { key: 'tatacliq', name: 'Tata CLiQ Luxury', speed: 'Authorized Brands', color: '#000000' }
                ].map((st) => (
                  <div
                    key={st.key}
                    onClick={() => toggleStore(st.key)}
                    style={{
                      padding: '0.85rem',
                      borderRadius: '8px',
                      border: enabledStores[st.key] ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                      background: enabledStores[st.key] ? '#F0F7FF' : '#F8FAFC',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: '#0F172A', display: 'block' }}>{st.name}</strong>
                      <span style={{ fontSize: '0.72rem', color: '#64748B' }}>{st.speed}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(enabledStores[st.key])}
                      onChange={() => {}}
                      style={{ accentColor: '#2563EB', width: '16px', height: '16px', pointerEvents: 'none' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Bank Offers & Cards */}
            <div className="db-card db-card-primary" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <CreditCard size={18} color="#2563EB" />
                <h3 className="db-card-title-sm">Your Preferred Bank Cards (For Instant Discount Calculation)</h3>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '1rem' }}>
                Select the bank cards you own. PriceLens will automatically highlight special 10% instant discount bank offers on product comparison cards.
              </p>

              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                {['HDFC Bank', 'SBI Card', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'OneCard', 'Amazon Pay ICICI'].map((bank) => {
                  const isSelected = preferredBanks.includes(bank);
                  return (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => toggleBank(bank)}
                      style={{
                        padding: '0.45rem 0.9rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        border: isSelected ? '1.5px solid #2563EB' : '1px solid #CBD5E1',
                        background: isSelected ? '#EFF6FF' : '#FFFFFF',
                        color: isSelected ? '#1D4ED8' : '#475569',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isSelected ? <Check size={13} /> : '+'}
                      {bank}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            TAB 4: SECURITY & LOGIN
        ══════════════════════════════════════════════════════════ */}
        {activeTab === 'security' && (
          <div className="db-page-fade">
            {/* Connected Google OAuth Account */}
            <div className="db-card db-card-primary" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 className="db-card-title-sm" style={{ marginBottom: '1rem' }}>Connected Social Accounts</h3>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  borderRadius: '8px',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: '#0F172A', display: 'block' }}>Google Account</strong>
                    <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Connected with {email}</span>
                  </div>
                </div>

                <span className="db-badge-soft-green" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0.3rem 0.75rem' }}>
                  <CheckCircle2 size={13} /> Active OAuth 2.0
                </span>
              </div>
            </div>

            {/* Password Management */}
            <form onSubmit={handlePasswordChange} className="db-card db-card-primary" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="db-card-header-clean" style={{ padding: '0 0 1rem 0', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lock size={18} color="#2563EB" />
                  <h3 className="db-card-title-sm">Change Account Password</h3>
                </div>
              </div>

              <div className="db-settings-grid" style={{ rowGap: '1rem', marginBottom: '1.25rem' }}>
                <div className="db-form-group">
                  <label className="db-form-label">Current Password</label>
                  <input
                    type="password"
                    className="db-search-input"
                    style={{ height: '42px', padding: '0 0.85rem' }}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <div className="db-form-group">
                  <label className="db-form-label">New Password</label>
                  <input
                    type="password"
                    className="db-search-input"
                    style={{ height: '42px', padding: '0 0.85rem' }}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                  />
                </div>

                <div className="db-form-group">
                  <label className="db-form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="db-search-input"
                    style={{ height: '42px', padding: '0 0.85rem' }}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                  />
                </div>
              </div>

              <button type="submit" className="db-btn-clean db-btn-clean-outline" style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}>
                Update Password
              </button>
            </form>

            {/* Active Sessions */}
            <div className="db-card db-card-primary" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 className="db-card-title-sm" style={{ marginBottom: '1rem' }}>Active Login Sessions</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: '#0F172A' }}>macOS • Safari Browser (Current Session)</strong>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748B' }}>IP: 127.0.0.1 • Active Now</span>
                  </div>
                  <span className="db-badge-soft-green">This Device</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: '#0F172A' }}>iOS Mobile • PriceLens Web App</strong>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748B' }}>Last active 2 hours ago</span>
                  </div>
                  <button
                    type="button"
                    className="db-btn-clean"
                    style={{ fontSize: '0.75rem', color: '#DC2626' }}
                    onClick={() => showToast('Session revoked', 'info')}
                  >
                    Revoke
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            TAB 5: DATA, EXPORT & PRIVACY
        ══════════════════════════════════════════════════════════ */}
        {activeTab === 'privacy' && (
          <div className="db-page-fade">
            <div className="db-card db-card-primary" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="db-card-header-clean" style={{ padding: '0 0 1rem 0', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Download size={18} color="#2563EB" />
                  <h3 className="db-card-title-sm">Export Price Tracking & Wishlist Data</h3>
                </div>
              </div>

              <p style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '1.25rem' }}>
                Download a complete portable backup of your saved products ({savedProducts.length}), price alerts ({priceAlerts.length}), and tracking histories in JSON format.
              </p>

              <button
                type="button"
                className="db-btn-clean db-btn-clean-primary"
                onClick={handleExportData}
                style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Download size={15} /> Download Account Backup (.json)
              </button>
            </div>

            <div className="db-card db-card-primary" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="db-card-header-clean" style={{ padding: '0 0 1rem 0', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <RefreshCw size={18} color="#2563EB" />
                  <h3 className="db-card-title-sm">Cache & Local Storage Controls</h3>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="db-btn-clean db-btn-clean-outline"
                  onClick={() => {
                    localStorage.removeItem('pricelens_recent_searches');
                    showToast('Search history cleared from browser cache.', 'info');
                  }}
                >
                  Clear Search History Cache
                </button>
                <button
                  type="button"
                  className="db-btn-clean db-btn-clean-outline"
                  onClick={() => {
                    localStorage.removeItem('pricelens_tracking_cache');
                    showToast('Price comparison caching reset.', 'info');
                  }}
                >
                  Reset Live Store Cache
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="db-card" style={{ padding: '1.5rem', border: '1px solid #FECACA', background: '#FEF2F2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <AlertTriangle size={18} color="#DC2626" />
                <h3 className="db-card-title-sm" style={{ color: '#991B1B' }}>Danger Zone</h3>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#7F1D1D', marginBottom: '1rem' }}>
                Deleting your account will permanently wipe all your saved wishlist items, active price alerts, and custom thresholds. This action cannot be undone.
              </p>
              <button
                type="button"
                className="db-btn-clean"
                style={{ background: '#DC2626', color: '#FFFFFF', padding: '0.55rem 1.25rem', fontSize: '0.85rem', fontWeight: 700 }}
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete all PriceLens data for this account?')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
              >
                <Trash2 size={14} style={{ display: 'inline', marginRight: '4px' }} /> Delete All My Data
              </button>
            </div>
          </div>
        )}

        {/* Floating / Bottom Save Bar */}
        <div
          style={{
            position: 'sticky',
            bottom: '1.5rem',
            background: '#FFFFFF',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            border: '1px solid #CBD5E1',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginTop: '2rem',
            zIndex: 10
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
            <span style={{ fontSize: '0.82rem', color: '#475569' }}>
              Changes are saved locally to your device & account.
            </span>
          </div>

          <button
            type="button"
            onClick={handleSaveProfile}
            className="db-btn-clean db-btn-clean-primary"
            style={{ padding: '0.65rem 1.75rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
          >
            <Save size={16} /> Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
