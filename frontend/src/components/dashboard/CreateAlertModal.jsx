import React, { useState, useEffect } from 'react';
import { X, Bell, AlertCircle } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { formatPrice } from '../../data/mockData';

const CreateAlertModal = () => {
  const { createAlertModal, closeCreateAlertModal, createPriceAlert, fetchAlerts } = useDashboard();

  const [selectedStore, setSelectedStore] = useState('ANY');
  const [targetPriceInput, setTargetPriceInput] = useState('');
  const [validationError, setValidationError] = useState('');
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const product = createAlertModal.product;

  useEffect(() => {
    if (product) {
      setSelectedStore('ANY');
      const curr = Number(product.currentPrice);
      if (curr && !isNaN(curr) && curr > 0) {
        // Suggest a target price 5% lower than current price
        const suggested = Math.floor(curr * 0.95);
        setTargetPriceInput(suggested.toString());
      } else {
        setTargetPriceInput('');
      }
      setValidationError('');
      setApiError('');
    }
  }, [product]);

  if (!createAlertModal.open || !product) return null;

  const currentPrice = Number(product.currentPrice || 0);
  const storeList = Array.isArray(product.stores) ? product.stores : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setApiError('');

    const trimmedInput = targetPriceInput.trim();
    if (!trimmedInput) {
      setValidationError('Target price is required.');
      return;
    }

    const numericTarget = Number(trimmedInput);
    if (isNaN(numericTarget) || numericTarget <= 0) {
      setValidationError('Target price must be a valid number greater than 0.');
      return;
    }

    if (currentPrice > 0 && numericTarget >= currentPrice) {
      setValidationError(`Target price must be lower than the current price (${formatPrice(currentPrice)}).`);
      return;
    }

    const payload = {
      productId: product.id,
      store: selectedStore === 'ANY' ? null : selectedStore,
      targetPrice: numericTarget,
    };

    setIsSubmitting(true);
    try {
      await createPriceAlert(payload);
      // Invalidate and refetch user alerts from backend
      await fetchAlerts();
      closeCreateAlertModal();
    } catch (err) {
      console.warn('[CreateAlertModal] Creation error:', err);
      if (err.message && (err.message.includes('409') || err.message.includes('DUPLICATE'))) {
        setApiError('You already have an active price alert for this product and store setting.');
      } else if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('Network') || err.message.includes('connect'))) {
        setApiError('Price alerts service abhi available nahi hai. Kripya backend connection check karein.');
      } else {
        setApiError(err.message || 'Price alert create nahi ho paaya. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="db-overlay" onClick={closeCreateAlertModal}>
      <div className="db-modal" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="db-modal-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: '#EFF6FF', padding: '0.45rem', borderRadius: '10px', color: '#2563EB', display: 'flex' }}>
              <Bell size={18} />
            </div>
            <div>
              <div className="db-modal-title">Set Target Price Alert</div>
              <div className="db-modal-subtitle">Get notified when price drops to your target</div>
            </div>
          </div>
          <button className="db-modal-close-btn" onClick={closeCreateAlertModal} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          {/* Product Summary */}
          <div className="db-alert-stat-card" style={{ marginBottom: '1rem', background: '#F8FAFC' }}>
            <span className="db-stat-label-clean">Product</span>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--db-text-main)', marginTop: '0.1rem' }}>
              {product.name}
            </div>
            {currentPrice > 0 && (
              <div style={{ fontSize: '0.82rem', color: 'var(--db-text-secondary)', marginTop: '0.2rem' }}>
                Current Listed Price: <strong style={{ color: '#16A34A' }}>{formatPrice(currentPrice)}</strong>
              </div>
            )}
          </div>

          {/* Store Selector */}
          <div style={{ marginBottom: '1rem' }}>
            <label className="db-form-label" style={{ fontSize: '0.8rem', marginBottom: '0.35rem', display: 'block' }}>
              Target Store
            </label>
            <select
              className="db-search-input"
              style={{ width: '100%', height: '38px', fontSize: '0.85rem', padding: '0 0.6rem' }}
              value={selectedStore}
              onChange={(e) => {
                setSelectedStore(e.target.value);
                setValidationError('');
                setApiError('');
              }}
              disabled={isSubmitting}
            >
              <option value="ANY">Any Store (Lowest across all retailers)</option>
              {storeList.map((st) => (
                <option key={st} value={st}>
                  {st} only
                </option>
              ))}
            </select>
          </div>

          {/* Target Price Input */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="db-form-label" style={{ fontSize: '0.8rem', marginBottom: '0.35rem', display: 'block' }}>
              Target Price (₹)
            </label>
            <input
              type="number"
              className="db-search-input"
              style={{ width: '100%', height: '38px', fontSize: '0.9rem', padding: '0 0.75rem' }}
              placeholder="e.g. 60000"
              value={targetPriceInput}
              onChange={(e) => {
                setTargetPriceInput(e.target.value);
                setValidationError('');
                setApiError('');
              }}
              disabled={isSubmitting}
            />
          </div>

          {/* Validation Error Message */}
          {validationError && (
            <div
              style={{
                color: '#DC2626',
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <AlertCircle size={14} style={{ flexShrink: 0 }} />
              <span>{validationError}</span>
            </div>
          )}

          {/* API Error Message (e.g. 409 Duplicate) */}
          {apiError && (
            <div
              style={{
                color: '#991B1B',
                background: '#FEE2E2',
                border: '1px solid #F87171',
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <AlertCircle size={14} style={{ flexShrink: 0 }} />
              <span>{apiError}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
            <button
              type="button"
              className="db-btn-clean db-btn-clean-outline"
              onClick={closeCreateAlertModal}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="db-btn-clean db-btn-clean-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Alert...' : 'Set Price Alert'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAlertModal;
