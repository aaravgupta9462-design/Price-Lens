import React, { useState } from 'react';
import {
  Search, Plus, Bell, HelpCircle, UserCheck, Sliders, LayoutTemplate,
  BellRing, History, ShieldCheck, Headphones, Mail, Phone, Edit3,
  Download, Globe, Languages, Zap, Palette, ChevronDown, Check,
  X, AlertTriangle, Shield, CheckCircle2, Lock, Smartphone
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useDashboard } from '../../../context/DashboardContext';
import './SettingsScreen.css';

const SettingsScreen = () => {
  const { user } = useAuth();
  const { showToast } = useDashboard();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('account_details');
  const [searchQuery, setSearchQuery] = useState('');

  // Editable Account Details State
  const [accountName, setAccountName] = useState(user?.name || 'Superspark Workspace');
  const [email, setEmail] = useState(user?.email || 'superspark@mincorp.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [activeSince, setActiveSince] = useState('01 May 2025 (4 months)');

  // Preferences State
  const [language, setLanguage] = useState('English');
  const [country, setCountry] = useState('Netherlands');
  const [currency, setCurrency] = useState('INR (₹)');
  const [syncRate, setSyncRate] = useState('Real-time (Instant)');
  const [themeMode, setThemeMode] = useState('Light SaaS');

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [priceDropPush, setPriceDropPush] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [tempName, setTempName] = useState(accountName);
  const [tempPhone, setTempPhone] = useState(phone);

  // Initial avatar letter
  const userInitial = accountName.trim().charAt(0).toUpperCase() || 'S';

  // Handler for Exporting Data as JSON file
  const handleExportData = () => {
    const exportPayload = {
      account: {
        name: accountName,
        email,
        phone,
        activeSince,
        exportDate: new Date().toISOString(),
      },
      preferences: {
        language,
        country,
        currency,
        syncRate,
        themeMode,
      },
      notifications: {
        emailAlerts,
        priceDropPush,
        dailyDigest,
      },
      system: 'PriceLens Enterprise Price Intelligence v2.4'
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `pricelens_account_data_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    if (showToast) {
      showToast('Account data exported successfully (JSON format)', 'success');
    }
  };

  // Save Edit Profile Modal
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setAccountName(tempName);
    setPhone(tempPhone);
    setIsEditModalOpen(false);
    if (showToast) {
      showToast('Account details updated successfully!', 'success');
    }
  };

  // Nav menu items definition
  const navGeneral = [
    { id: 'account_details', label: 'Account details', icon: UserCheck },
    { id: 'preference', label: 'Preference', icon: Sliders },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    { id: 'notification', label: 'Notification', icon: BellRing },
  ];

  const navSecurity = [
    { id: 'audit_log', label: 'Audit log', icon: History },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'help_desk', label: 'Help desk', icon: Headphones },
  ];

  return (
    <div className="as-root">
      {/* ─── Breadcrumb & Top Action Header ───────────────────────────────────── */}
      <div className="as-breadcrumb-bar">
        <div className="as-breadcrumb">
          <span className="as-bc-link" onClick={() => setActiveTab('account_details')}>Settings</span>
          <span className="as-bc-separator">&gt;</span>
          <span className="as-bc-link" onClick={() => setActiveTab('account_details')}>Admin</span>
          <span className="as-bc-separator">&gt;</span>
          <span className="as-bc-current">
            {activeTab === 'account_details' && 'General settings'}
            {activeTab === 'preference' && 'Account preferences'}
            {activeTab === 'templates' && 'Templates & Rules'}
            {activeTab === 'notification' && 'Notification channels'}
            {activeTab === 'audit_log' && 'Audit logs & activity'}
            {activeTab === 'security' && 'Security & Access'}
            {activeTab === 'help_desk' && 'Help desk & Support'}
          </span>
        </div>

        <div className="as-topbar-actions">
          <div className="as-search-box">
            <Search size={15} />
            <input
              type="text"
              className="as-search-input"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            className="as-btn-new"
            onClick={() => {
              if (showToast) showToast('Quick Action menu triggered', 'info');
            }}
          >
            <Plus size={15} />
            <span>+ New</span>
            <ChevronDown size={13} style={{ marginLeft: '2px', opacity: 0.8 }} />
          </button>

          <button
            className="as-icon-btn"
            title="8 Unread Notifications"
            onClick={() => {
              if (showToast) showToast('You have 8 unread price alerts', 'info');
            }}
          >
            <Bell size={16} />
            <span className="as-badge-count">8</span>
          </button>

          <button
            className="as-icon-btn"
            title="Help & Documentation"
            onClick={() => setActiveTab('help_desk')}
          >
            <HelpCircle size={16} />
          </button>
        </div>
      </div>

      {/* ─── Main Two-Column Layout ───────────────────────────────────────────── */}
      <div className="as-layout">
        {/* Left Sub-Sidebar Menu */}
        <aside className="as-sidebar">
          <div className="as-nav-section">
            <div className="as-section-label">GENERAL</div>
            {navGeneral.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`as-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="as-nav-section">
            <div className="as-section-label">SECURITY</div>
            {navSecurity.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`as-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Main Settings Workspace */}
        <main className="as-content">
          {/* ══════════ TAB 1: ACCOUNT DETAILS ══════════ */}
          {activeTab === 'account_details' && (
            <>
              {/* Block 1: Account Details */}
              <section>
                <div className="as-block-header">
                  <h2 className="as-block-title">Account details</h2>
                  <p className="as-block-subtitle">Your organizational account details, activity status</p>
                </div>

                <div className="as-card">
                  {/* Identity Row */}
                  <div className="as-profile-row">
                    <div className="as-profile-identity">
                      <div className="as-avatar-box">
                        {user?.avatar ? (
                          <img src={user.avatar} alt="Profile" />
                        ) : (
                          <span>{userInitial}</span>
                        )}
                      </div>

                      <div className="as-identity-info">
                        <div className="as-name-line">
                          <span className="as-user-name">{accountName}</span>
                          <span className="as-status-pill">
                            <Check size={12} strokeWidth={3} /> Active
                          </span>
                        </div>

                        <div className="as-contact-line">
                          <Mail size={14} />
                          <span>{email}</span>
                        </div>

                        <div className="as-contact-line">
                          <Phone size={14} />
                          <span>{phone}</span>
                        </div>

                        <div className="as-tenure-text">
                          Account active since <span className="as-tenure-date">{activeSince}</span>
                        </div>
                      </div>
                    </div>

                    <div className="as-profile-actions">
                      <button className="as-btn-edit" onClick={() => setIsEditModalOpen(true)}>
                        <Edit3 size={14} />
                        <span>Edit</span>
                      </button>
                      <button className="as-btn-cancel-acc" onClick={() => setIsCancelModalOpen(true)}>
                        <span>Cancel account</span>
                      </button>
                    </div>
                  </div>

                  <div className="as-card-divider" />

                  {/* Export Account Data */}
                  <div className="as-export-section">
                    <div>
                      <h4 className="as-export-title">Export account data</h4>
                      <p className="as-export-desc">Create with XML/JSON file all your account data</p>
                    </div>
                    <button className="as-export-btn" onClick={handleExportData}>
                      <Download size={15} />
                      <span>Export data</span>
                    </button>
                  </div>
                </div>
              </section>

              {/* Block 2: Account Preference */}
              <section>
                <div className="as-block-header">
                  <h2 className="as-block-title">Account preference</h2>
                  <p className="as-block-subtitle">
                    Your organizational account interface, language, data synchronization, etc
                  </p>
                </div>

                <div className="as-card">
                  <div className="as-pref-list">
                    {/* Row 1: Language */}
                    <div className="as-pref-item">
                      <div className="as-pref-info">
                        <div className="as-pref-icon">
                          <Languages size={18} />
                        </div>
                        <div className="as-pref-text">
                          <h4>Language</h4>
                          <p>Your organizational language</p>
                        </div>
                      </div>
                      <div className="as-select-wrapper">
                        <select
                          className="as-select"
                          value={language}
                          onChange={(e) => {
                            setLanguage(e.target.value);
                            if (showToast) showToast(`Language changed to ${e.target.value}`, 'success');
                          }}
                        >
                          <option value="English">English</option>
                          <option value="Hindi">Hindi (हिंदी)</option>
                          <option value="Spanish">Spanish (Español)</option>
                          <option value="Dutch">Dutch (Nederlands)</option>
                          <option value="German">German (Deutsch)</option>
                        </select>
                        <ChevronDown size={14} className="as-select-arrow" />
                      </div>
                    </div>

                    {/* Row 2: Country */}
                    <div className="as-pref-item">
                      <div className="as-pref-info">
                        <div className="as-pref-icon">
                          <Globe size={18} />
                        </div>
                        <div className="as-pref-text">
                          <h4>Country</h4>
                          <p>Country preference</p>
                        </div>
                      </div>
                      <div className="as-select-wrapper">
                        <select
                          className="as-select"
                          value={country}
                          onChange={(e) => {
                            setCountry(e.target.value);
                            if (showToast) showToast(`Country set to ${e.target.value}`, 'success');
                          }}
                        >
                          <option value="Netherlands">Netherlands</option>
                          <option value="India">India</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Germany">Germany</option>
                          <option value="Singapore">Singapore</option>
                        </select>
                        <ChevronDown size={14} className="as-select-arrow" />
                      </div>
                    </div>

                    {/* Row 3: Live Sync Rate */}
                    <div className="as-pref-item">
                      <div className="as-pref-info">
                        <div className="as-pref-icon">
                          <Zap size={18} />
                        </div>
                        <div className="as-pref-text">
                          <h4>Live Price Sync Rate</h4>
                          <p>Background price tracking cadence across Amazon, Flipkart & Croma</p>
                        </div>
                      </div>
                      <div className="as-select-wrapper">
                        <select
                          className="as-select"
                          value={syncRate}
                          onChange={(e) => {
                            setSyncRate(e.target.value);
                            if (showToast) showToast(`Sync rate set to ${e.target.value}`, 'success');
                          }}
                        >
                          <option value="Real-time (Instant)">Real-time (Instant)</option>
                          <option value="Every 15 Minutes">Every 15 Minutes</option>
                          <option value="Hourly">Hourly</option>
                          <option value="Daily">Daily</option>
                        </select>
                        <ChevronDown size={14} className="as-select-arrow" />
                      </div>
                    </div>

                    {/* Row 4: Theme Mode */}
                    <div className="as-pref-item">
                      <div className="as-pref-info">
                        <div className="as-pref-icon">
                          <Palette size={18} />
                        </div>
                        <div className="as-pref-text">
                          <h4>Interface Theme</h4>
                          <p>Modern high contrast Light SaaS layout</p>
                        </div>
                      </div>
                      <div className="as-select-wrapper">
                        <select
                          className="as-select"
                          value={themeMode}
                          onChange={(e) => {
                            setThemeMode(e.target.value);
                            if (showToast) showToast(`Theme updated to ${e.target.value}`, 'success');
                          }}
                        >
                          <option value="Light SaaS">Light SaaS (Active)</option>
                          <option value="Dark Mode">Dark Slate Mode</option>
                          <option value="System Default">System Default</option>
                        </select>
                        <ChevronDown size={14} className="as-select-arrow" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* ══════════ TAB 2: PREFERENCE ══════════ */}
          {activeTab === 'preference' && (
            <section>
              <div className="as-block-header">
                <h2 className="as-block-title">Shopping & Store Preferences</h2>
                <p className="as-block-subtitle">Configure preferred e-commerce stores, discount thresholds and search filters</p>
              </div>

              <div className="as-card">
                <div className="as-pref-list">
                  <div className="as-pref-item">
                    <div className="as-pref-info">
                      <div className="as-pref-icon"><Sliders size={18} /></div>
                      <div className="as-pref-text">
                        <h4>Default Store Priority</h4>
                        <p>Preferred storefront displayed first on price comparison lists</p>
                      </div>
                    </div>
                    <div className="as-select-wrapper">
                      <select className="as-select" defaultValue="Compare All Stores">
                        <option value="Compare All Stores">Compare All Stores (Recommended)</option>
                        <option value="Amazon">Amazon India</option>
                        <option value="Flipkart">Flipkart</option>
                        <option value="Croma">Croma</option>
                        <option value="Reliance Digital">Reliance Digital</option>
                      </select>
                      <ChevronDown size={14} className="as-select-arrow" />
                    </div>
                  </div>

                  <div className="as-pref-item">
                    <div className="as-pref-info">
                      <div className="as-pref-icon"><Zap size={18} /></div>
                      <div className="as-pref-text">
                        <h4>Price Drop Alert Threshold</h4>
                        <p>Trigger alerts when product price drops by at least this percentage</p>
                      </div>
                    </div>
                    <div className="as-select-wrapper">
                      <select className="as-select" defaultValue="5% Drop">
                        <option value="Any Drop">Any Price Drop (1%+)</option>
                        <option value="5% Drop">5% Price Drop</option>
                        <option value="10% Drop">10% Price Drop</option>
                        <option value="20% Drop">20% Flash Deal</option>
                      </select>
                      <ChevronDown size={14} className="as-select-arrow" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ══════════ TAB 3: TEMPLATES ══════════ */}
          {activeTab === 'templates' && (
            <section>
              <div className="as-block-header">
                <h2 className="as-block-title">Alert & Comparison Templates</h2>
                <p className="as-block-subtitle">Pre-configured rules for electronics, smartphones and gadget price trackers</p>
              </div>

              <div className="as-card">
                <div className="as-pref-list">
                  <div className="as-pref-item">
                    <div className="as-pref-info">
                      <div className="as-pref-icon"><LayoutTemplate size={18} /></div>
                      <div className="as-pref-text">
                        <h4>Smartphones & Laptops Template</h4>
                        <p>Tracks Apple, Samsung, Dell across 4 stores with bank offers included</p>
                      </div>
                    </div>
                    <span className="as-status-pill"><Check size={12} /> Default Active</span>
                  </div>

                  <div className="as-pref-item">
                    <div className="as-pref-info">
                      <div className="as-pref-icon"><LayoutTemplate size={18} /></div>
                      <div className="as-pref-text">
                        <h4>Festive Season Mega Deals Template</h4>
                        <p>Aggressive 15-minute sync interval for Big Billion Days & Great Indian Festival</p>
                      </div>
                    </div>
                    <button className="as-btn-edit" onClick={() => showToast('Template activated!', 'success')}>
                      Activate
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ══════════ TAB 4: NOTIFICATION ══════════ */}
          {activeTab === 'notification' && (
            <section>
              <div className="as-block-header">
                <h2 className="as-block-title">Notification Channels</h2>
                <p className="as-block-subtitle">Manage how and when PriceLens delivers price alerts and deal digests</p>
              </div>

              <div className="as-card">
                <div className="as-pref-list">
                  <div className="as-pref-item">
                    <div className="as-pref-info">
                      <div className="as-pref-icon"><Mail size={18} /></div>
                      <div className="as-pref-text">
                        <h4>Email Price Drop Alerts</h4>
                        <p>Receive immediate emails when any tracked product hits your target price</p>
                      </div>
                    </div>
                    <label className="as-toggle">
                      <input
                        type="checkbox"
                        checked={emailAlerts}
                        onChange={(e) => {
                          setEmailAlerts(e.target.checked);
                          showToast(`Email alerts ${e.target.checked ? 'enabled' : 'disabled'}`, 'info');
                        }}
                      />
                      <span className="as-toggle-slider" />
                    </label>
                  </div>

                  <div className="as-pref-item">
                    <div className="as-pref-info">
                      <div className="as-pref-icon"><BellRing size={18} /></div>
                      <div className="as-pref-text">
                        <h4>Browser Push Notifications</h4>
                        <p>Instant desktop alerts when price comparisons detect a new lowest price</p>
                      </div>
                    </div>
                    <label className="as-toggle">
                      <input
                        type="checkbox"
                        checked={priceDropPush}
                        onChange={(e) => {
                          setPriceDropPush(e.target.checked);
                          showToast(`Push notifications ${e.target.checked ? 'enabled' : 'disabled'}`, 'info');
                        }}
                      />
                      <span className="as-toggle-slider" />
                    </label>
                  </div>

                  <div className="as-pref-item">
                    <div className="as-pref-info">
                      <div className="as-pref-icon"><Smartphone size={18} /></div>
                      <div className="as-pref-text">
                        <h4>Daily Top Deals Digest</h4>
                        <p>Hand-picked discounts exceeding 20% delivered every morning at 9:00 AM</p>
                      </div>
                    </div>
                    <label className="as-toggle">
                      <input
                        type="checkbox"
                        checked={dailyDigest}
                        onChange={(e) => {
                          setDailyDigest(e.target.checked);
                          showToast(`Daily digest ${e.target.checked ? 'enabled' : 'disabled'}`, 'info');
                        }}
                      />
                      <span className="as-toggle-slider" />
                    </label>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ══════════ TAB 5: AUDIT LOG ══════════ */}
          {activeTab === 'audit_log' && (
            <section>
              <div className="as-block-header">
                <h2 className="as-block-title">Audit Logs & Activity</h2>
                <p className="as-block-subtitle">Historical record of all account sessions, price comparisons, and alerts triggered</p>
              </div>

              <div className="as-card" style={{ padding: '0.5rem 0' }}>
                <table className="as-audit-table">
                  <thead>
                    <tr>
                      <th>Action / Event</th>
                      <th>Source</th>
                      <th>IP & Location</th>
                      <th>Date / Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Google OAuth Sign-In</strong></td>
                      <td>Web Client</td>
                      <td>127.0.0.1 (Localhost)</td>
                      <td>Just now</td>
                      <td><span className="as-audit-badge success"><CheckCircle2 size={12} /> Verified</span></td>
                    </tr>
                    <tr>
                      <td><strong>Product Compare Executed</strong></td>
                      <td>Compare Engine</td>
                      <td>iPhone 16 Pro (128GB)</td>
                      <td>10 mins ago</td>
                      <td><span className="as-audit-badge info">4 Stores</span></td>
                    </tr>
                    <tr>
                      <td><strong>Price Alert Triggered</strong></td>
                      <td>Notification Bot</td>
                      <td>Flipkart ₹1,09,990</td>
                      <td>2 hours ago</td>
                      <td><span className="as-audit-badge success">Sent</span></td>
                    </tr>
                    <tr>
                      <td><strong>Export Account Data</strong></td>
                      <td>Admin Console</td>
                      <td>JSON Archive</td>
                      <td>Yesterday</td>
                      <td><span className="as-audit-badge info">Downloaded</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ══════════ TAB 6: SECURITY ══════════ */}
          {activeTab === 'security' && (
            <section>
              <div className="as-block-header">
                <h2 className="as-block-title">Security & Credentials</h2>
                <p className="as-block-subtitle">Connected OAuth accounts, two-factor authentication, and active sessions</p>
              </div>

              <div className="as-card">
                <div className="as-pref-list">
                  <div className="as-pref-item">
                    <div className="as-pref-info">
                      <div className="as-pref-icon"><Globe size={18} color="#4285F4" /></div>
                      <div className="as-pref-text">
                        <h4>Connected Google Account</h4>
                        <p>{user?.email || email} (Authorized via Google Identity Services)</p>
                      </div>
                    </div>
                    <span className="as-status-pill"><Check size={12} /> Connected</span>
                  </div>

                  <div className="as-pref-item">
                    <div className="as-pref-info">
                      <div className="as-pref-icon"><Lock size={18} /></div>
                      <div className="as-pref-text">
                        <h4>Two-Factor Authentication (2FA)</h4>
                        <p>Add an extra layer of biometric or OTP security on sign in</p>
                      </div>
                    </div>
                    <label className="as-toggle">
                      <input
                        type="checkbox"
                        checked={twoFactorAuth}
                        onChange={(e) => {
                          setTwoFactorAuth(e.target.checked);
                          showToast(`Two-factor auth ${e.target.checked ? 'enabled' : 'disabled'}`, 'info');
                        }}
                      />
                      <span className="as-toggle-slider" />
                    </label>
                  </div>

                  <div className="as-pref-item">
                    <div className="as-pref-info">
                      <div className="as-pref-icon"><Shield size={18} /></div>
                      <div className="as-pref-text">
                        <h4>Active Web Session</h4>
                        <p>Safari on macOS • Current Active Session</p>
                      </div>
                    </div>
                    <button className="as-btn-edit" onClick={() => showToast('Session is active & secure', 'info')}>
                      Active Now
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ══════════ TAB 7: HELP DESK ══════════ */}
          {activeTab === 'help_desk' && (
            <section>
              <div className="as-block-header">
                <h2 className="as-block-title">Help Desk & Support</h2>
                <p className="as-block-subtitle">Access enterprise documentation, API integration guides, or contact support</p>
              </div>

              <div className="as-card">
                <div className="as-pref-list">
                  <div className="as-pref-item">
                    <div className="as-pref-info">
                      <div className="as-pref-icon"><Headphones size={18} /></div>
                      <div className="as-pref-text">
                        <h4>24/7 Price Intelligence Support</h4>
                        <p>Get in touch with our engineering team for scraper and store inquiries</p>
                      </div>
                    </div>
                    <button
                      className="as-btn-edit"
                      onClick={() => showToast('Support ticket form opened', 'info')}
                    >
                      Open Ticket
                    </button>
                  </div>

                  <div className="as-pref-item">
                    <div className="as-pref-info">
                      <div className="as-pref-icon"><ShieldCheck size={18} /></div>
                      <div className="as-pref-text">
                        <h4>API Contracts & Store Scraper Specs</h4>
                        <p>Review API_CONTRACTS.md specification for Amazon, Flipkart & Croma adapters</p>
                      </div>
                    </div>
                    <button
                      className="as-btn-edit"
                      onClick={() => showToast('Documentation is available in API_CONTRACTS.md', 'info')}
                    >
                      View Specs
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* ─── Modal 1: Edit Account Details ────────────────────────────────────── */}
      {isEditModalOpen && (
        <div className="as-modal-backdrop" onClick={() => setIsEditModalOpen(false)}>
          <div className="as-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="as-modal-header">
              <h3 className="as-modal-title">Edit Account Details</h3>
              <button className="as-modal-close" onClick={() => setIsEditModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div className="db-form-group">
                  <label className="db-form-label">Account / Workspace Name</label>
                  <input
                    type="text"
                    className="as-select"
                    style={{ height: '42px' }}
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    required
                  />
                </div>

                <div className="db-form-group">
                  <label className="db-form-label">Email (Managed by OAuth / Auth)</label>
                  <input
                    type="email"
                    className="as-select"
                    style={{ height: '42px', background: '#F8FAFC', color: '#64748B' }}
                    value={email}
                    disabled
                  />
                </div>

                <div className="db-form-group">
                  <label className="db-form-label">Phone Number</label>
                  <input
                    type="text"
                    className="as-select"
                    style={{ height: '42px' }}
                    value={tempPhone}
                    onChange={(e) => setTempPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="as-modal-footer">
                <button
                  type="button"
                  className="as-btn-edit"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="as-btn-new"
                  style={{ height: '38px', padding: '0 1.25rem' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal 2: Cancel Account Confirmation ─────────────────────────────── */}
      {isCancelModalOpen && (
        <div className="as-modal-backdrop" onClick={() => setIsCancelModalOpen(false)}>
          <div className="as-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="as-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EF4444' }}>
                <AlertTriangle size={20} />
                <h3 className="as-modal-title" style={{ color: '#EF4444' }}>Cancel Account</h3>
              </div>
              <button className="as-modal-close" onClick={() => setIsCancelModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              Are you sure you want to cancel your <strong>{accountName}</strong> PriceLens account?
              This will deactivate your price drop alerts and remove all saved products from tracking.
            </p>

            <div className="as-modal-footer">
              <button
                type="button"
                className="as-btn-edit"
                onClick={() => setIsCancelModalOpen(false)}
              >
                Keep Account
              </button>
              <button
                type="button"
                className="as-btn-cancel-acc"
                style={{ height: '38px' }}
                onClick={() => {
                  setIsCancelModalOpen(false);
                  if (showToast) showToast('Account deactivation request logged', 'info');
                }}
              >
                Yes, Cancel Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsScreen;
