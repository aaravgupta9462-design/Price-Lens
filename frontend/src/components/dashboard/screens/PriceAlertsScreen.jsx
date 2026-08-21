import React, { useState } from 'react';
import { Bell, Edit3, Trash2, Scale, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatPrice } from '../../../data/mockData';
import { useDashboard } from '../../../context/DashboardContext';
import EmptyState from '../EmptyState';

const PriceAlertsScreen = () => {
  const {
    priceAlerts,
    removePriceAlert,
    viewPriceComparison,
    showToast,
    setActiveNav,
  } = useDashboard();

  const [editingAlertId, setEditingAlertId] = useState(null);
  const [newTarget, setNewTarget] = useState('');

  const handleStartEdit = (alert) => {
    setEditingAlertId(alert.id);
    setNewTarget(alert.targetPrice.toString());
  };

  const handleSaveEdit = (alertId) => {
    setEditingAlertId(null);
    showToast('Target price alert updated successfully!', 'success');
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

      {priceAlerts.length === 0 ? (
        <EmptyState
          title="No active price alerts"
          message="Search for products and create price drop targets to get notified."
          onReset={() => setActiveNav('search')}
        />
      ) : (
        <div className="db-wishlist-grid">
          {priceAlerts.map((alert) => {
            const diff = alert.currentPrice - alert.targetPrice;
            const isEditing = editingAlertId === alert.id;

            return (
              <div key={alert.id} className="db-card db-card-primary" style={{ padding: '1.35rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                    <div className="db-saved-thumb" style={{ width: '46px', height: '46px', fontSize: '1.4rem' }}>
                      {alert.emoji}
                    </div>
                    <div>
                      <h3 className="db-deal-name" style={{ fontSize: '0.95rem' }}>
                        {alert.productName}
                      </h3>
                      <span className="db-deal-store">Tracked on {alert.store} · Created {alert.createdDate}</span>
                    </div>
                  </div>

                  <button
                    className="db-btn-clean db-btn-clean-icon"
                    style={{ color: '#EF4444', borderColor: '#FEE2E2' }}
                    onClick={() => removePriceAlert(alert.id)}
                    title="Remove alert"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="db-alert-prices-grid">
                  <div className="db-alert-stat-card">
                    <span className="db-stat-label-clean">Current Listed Price</span>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--db-text-main)' }}>
                      {formatPrice(alert.currentPrice)}
                    </span>
                  </div>

                  <div className="db-alert-stat-card" style={{ background: '#EFF6FF', borderColor: '#BFDBFE' }}>
                    <span className="db-stat-label-clean" style={{ color: '#2563EB' }}>Target Price</span>
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.2rem' }}>
                        <input
                          type="number"
                          value={newTarget}
                          onChange={(e) => setNewTarget(e.target.value)}
                          className="db-search-input"
                          style={{ height: '30px', padding: '0 0.5rem', fontSize: '0.85rem', width: '90px' }}
                        />
                        <button
                          className="db-btn-clean db-btn-clean-primary"
                          style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                          onClick={() => handleSaveEdit(alert.id)}
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1E40AF' }}>
                        {formatPrice(alert.targetPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Towards Target Bar */}
                <div style={{ marginTop: '1rem', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                    <span style={{ color: 'var(--db-text-secondary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <AlertCircle size={12} color="#2563EB" /> {alert.status}
                    </span>
                    <span style={{ fontWeight: 700, color: '#2563EB' }}>
                      {diff > 0 ? `₹${diff.toLocaleString('en-IN')} away` : 'Target Met!'}
                    </span>
                  </div>

                  <div className="db-compare-bar-track" style={{ height: '7px' }}>
                    <div
                      className="db-compare-bar-fill"
                      style={{
                        width: `${alert.progressPercent}%`,
                        background: alert.progressPercent > 80 ? '#16A34A' : '#2563EB',
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
