import React, { useState, useEffect } from 'react';
import { Bell, Edit3, Trash2, Scale, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { PRODUCTS, formatPrice } from '../../../data/mockData';
import { useDashboard } from '../../../context/DashboardContext';
import EmptyState from '../EmptyState';

const PriceAlertsScreen = () => {
  const {
    priceAlerts,
    isLoadingAlerts,
    alertsError,
    fetchAlerts,
    updatePriceAlert,
    removePriceAlert,
    viewPriceComparison,
    showToast,
    setActiveNav,
  } = useDashboard();

  const [editingAlertId, setEditingAlertId] = useState(null);
  const [newTarget, setNewTarget] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch alerts from API on screen load
  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleStartEdit = (alert) => {
    setEditingAlertId(alert.id);
    setNewTarget(alert.targetPrice ? alert.targetPrice.toString() : '');
  };

  const handleSaveEdit = async (alertId) => {
    const parsedTarget = Number(newTarget);
    if (isNaN(parsedTarget) || parsedTarget <= 0) {
      showToast('Please enter a valid target price greater than 0.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await updatePriceAlert(alertId, { targetPrice: parsedTarget });
      setEditingAlertId(null);
    } catch (err) {
      // Error toast handled by context
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (alertId) => {
    try {
      await removePriceAlert(alertId);
    } catch (err) {
      // Error toast handled by context
    }
  };

  return (
    <div className="db-page-fade">
      <div className="db-screen-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="db-screen-title">Price Alerts</h1>
          <p className="db-screen-subtitle">
            Set your target price and receive immediate notifications the moment any store drops below it.
          </p>
        </div>
        <button
          className="db-btn-clean db-btn-clean-primary"
          onClick={() => setActiveNav('search')}
        >
          <Plus size={14} /> Create Alert
        </button>
      </div>

      {/* Loading State */}
      {isLoadingAlerts ? (
        <div className="db-card db-card-primary" style={{ padding: '3rem', textAlign: 'center', color: 'var(--db-text-muted)' }}>
          <Bell size={28} className="db-spin" style={{ marginBottom: '0.75rem', color: '#2563EB' }} />
          <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>Loading active price alerts...</p>
        </div>
      ) : alertsError ? (
        /* Error State (No fake INITIAL_PRICE_ALERTS fallback) */
        <div className="db-card db-card-primary" style={{ padding: '2.5rem', textAlign: 'center', borderColor: '#FCA5A5', background: '#FEF2F2' }}>
          <AlertCircle size={32} color="#DC2626" style={{ marginBottom: '0.5rem', display: 'inline-block' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#991B1B', marginBottom: '0.35rem' }}>
            Unable to Load Price Alerts
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#B91C1C', marginBottom: '1.25rem' }}>
            {alertsError}
          </p>
          <button className="db-btn-clean db-btn-clean-primary" onClick={fetchAlerts}>
            Retry API Connection
          </button>
        </div>
      ) : priceAlerts.length === 0 ? (
        /* Empty State */
        <EmptyState
          title="No active price alerts"
          message="Search for products and create price drop targets to get notified."
          onReset={() => setActiveNav('search')}
        />
      ) : (
        /* Alert List Grid */
        <div className="db-wishlist-grid">
          {priceAlerts.map((alert) => {
            const product = PRODUCTS.find((p) => p.id === alert.productId);
            const productName = product ? product.name : (alert.productId || 'Tracked Product').replace(/-/g, ' ');
            const emoji = product ? product.emoji : '📦';
            const storeText = alert.store ? `Tracked on ${alert.store}` : 'Tracked on Any Store';
            const createdDate = alert.createdAt
              ? new Date(alert.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              : 'Recently';

            const currentPrice = Number(alert.currentPrice || 0);
            const targetPrice = Number(alert.targetPrice || 0);
            const initialPrice = Number(alert.initialPrice || currentPrice);
            const diff = currentPrice - targetPrice;
            const isEditing = editingAlertId === alert.id;

            // Triggered status evaluation from backend flags
            const isTriggered = alert.isTriggered;
            const isActive = alert.isActive;

            let statusText = 'Price Drop Tracking';
            if (isTriggered) {
              statusText = 'Target Met!';
            } else if (!isActive) {
              statusText = 'Alert Paused';
            }

            // Calculate progress percent towards target price
            let progressPercent = 0;
            if (isTriggered || (currentPrice > 0 && currentPrice <= targetPrice)) {
              progressPercent = 100;
            } else if (initialPrice > targetPrice && currentPrice > 0) {
              const neededDrop = initialPrice - targetPrice;
              const actualDrop = initialPrice - currentPrice;
              progressPercent = Math.min(100, Math.max(0, Math.round((actualDrop / neededDrop) * 100)));
            }

            return (
              <div key={alert.id} className="db-card db-card-primary" style={{ padding: '1.35rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                    <div className="db-saved-thumb" style={{ width: '46px', height: '46px', fontSize: '1.4rem' }}>
                      {emoji}
                    </div>
                    <div>
                      <h3 className="db-deal-name" style={{ fontSize: '0.95rem', textTransform: 'capitalize' }}>
                        {productName}
                      </h3>
                      <span className="db-deal-store">
                        {storeText} · Created {createdDate}
                      </span>
                    </div>
                  </div>

                  <button
                    className="db-btn-clean db-btn-clean-icon"
                    style={{ color: '#EF4444', borderColor: '#FEE2E2' }}
                    onClick={() => handleDelete(alert.id)}
                    title="Remove alert"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="db-alert-prices-grid">
                  <div className="db-alert-stat-card">
                    <span className="db-stat-label-clean">Current Listed Price</span>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--db-text-main)' }}>
                      {currentPrice > 0 ? formatPrice(currentPrice) : 'Checking...'}
                    </span>
                  </div>

                  <div className="db-alert-stat-card" style={{ background: 'var(--db-primary-light)', borderColor: 'var(--db-primary-border)' }}>
                    <span className="db-stat-label-clean" style={{ color: 'var(--db-primary)' }}>Target Price</span>
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.2rem' }}>
                        <input
                          type="number"
                          value={newTarget}
                          onChange={(e) => setNewTarget(e.target.value)}
                          className="db-search-input"
                          style={{ height: '30px', padding: '0 0.5rem', fontSize: '0.85rem', width: '90px' }}
                          disabled={isSaving}
                        />
                        <button
                          className="db-btn-clean db-btn-clean-primary"
                          style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                          onClick={() => handleSaveEdit(alert.id)}
                          disabled={isSaving}
                        >
                          {isSaving ? '...' : 'Save'}
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--db-primary)' }}>
                        {formatPrice(targetPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Towards Target Bar */}
                <div style={{ marginTop: '1rem', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                    <span style={{ color: 'var(--db-text-secondary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      {isTriggered ? (
                        <CheckCircle2 size={12} color="var(--db-success)" />
                      ) : (
                        <AlertCircle size={12} color="var(--db-primary)" />
                      )}
                      {statusText}
                    </span>
                    <span style={{ fontWeight: 700, color: isTriggered ? 'var(--db-success)' : 'var(--db-primary)' }}>
                      {isTriggered ? 'Target Met!' : diff > 0 ? `₹${diff.toLocaleString('en-IN')} away` : 'Target Met!'}
                    </span>
                  </div>

                  <div className="db-compare-bar-track" style={{ height: '7px' }}>
                    <div
                      className="db-compare-bar-fill"
                      style={{
                        width: `${progressPercent}%`,
                        background: isTriggered || progressPercent >= 100 ? 'var(--db-success)' : 'var(--db-primary)',
                      }}
                    />
                  </div>
                </div>

                <div className="db-deal-actions" style={{ paddingTop: '0.85rem' }}>
                  <button
                    className="db-btn-clean db-btn-clean-primary"
                    style={{ flex: 1 }}
                    onClick={() => viewPriceComparison(alert.productId)}
                  >
                    <Scale size={13} /> Check Live Stores
                  </button>
                  <button
                    className="db-btn-clean db-btn-clean-outline"
                    onClick={() => handleStartEdit(alert)}
                  >
                    <Edit3 size={12} /> Edit Target
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PriceAlertsScreen;

