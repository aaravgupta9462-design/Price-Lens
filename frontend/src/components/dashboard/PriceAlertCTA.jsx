import React, { useState } from 'react';
import {
  Bell,
  Check,
  Mail,
  Smartphone,
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { PRODUCTS, formatPrice } from '../../data/mockData';

export const PriceAlertCTA = () => {
  const { selectedProductId, showToast, priceAlerts, setPriceAlerts } = useDashboard();

  const product =
    PRODUCTS.find((p) => p.id === selectedProductId) ||
    PRODUCTS.find((p) => p.id === 'iphone-16-128');

  const basePrice = product?.currentPrice || 69990;

  // Discount options
  const PRESETS = [
    { label: '-5% Drop', percent: 5, target: Math.round(basePrice * 0.95 / 100) * 100 },
    { label: '-10% Drop', percent: 10, target: Math.round(basePrice * 0.90 / 100) * 100 },
    { label: '-15% Drop', percent: 15, target: Math.round(basePrice * 0.85 / 100) * 100 },
  ];

  const [selectedPreset, setSelectedPreset] = useState(10);
  const [customPrice, setCustomPrice] = useState(Math.round(basePrice * 0.90 / 100) * 100);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [contactVal, setContactVal] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset.percent);
    setCustomPrice(preset.target);
  };

  const handleCreateAlert = (e) => {
    e.preventDefault();
    if (!contactVal.trim()) {
      showToast('Please enter your email or phone number', 'error');
      return;
    }

    const newAlert = {
      id: `alert-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      currentPrice: basePrice,
      targetPrice: customPrice,
      channels: { email: emailEnabled, whatsapp: whatsappEnabled },
      createdDate: 'Just now',
    };

    if (setPriceAlerts) {
      setPriceAlerts((prev) => [newAlert, ...prev]);
    }

    setIsSaved(true);
    showToast(`Price Alert activated for ${formatPrice(customPrice)}! We will notify you instantly when it drops.`, 'success');
  };

  return (
    <section className="pl-alert-cta-section" aria-label="Price Drop Alert Builder">
      <div className="pl-alert-cta-container">
        <div className="pl-alert-card-editorial">
          {/* Left Column: Visual & Copy */}
          <div className="pl-alert-left-col">
            <div className="pl-section-eyebrow-pill">
              <Bell size={13} className="pl-eyebrow-bell" />
              <span>INSTANT DISPATCH INTELLIGENCE</span>
            </div>

            <h2 className="pl-alert-main-title">
              Never miss an unexpected price crash again.
            </h2>

            <p className="pl-alert-main-desc">
              We monitor Amazon and Flipkart 24/7. When prices drop to your target, you receive an instantaneous trigger notification. (More stores coming in future updates)
            </p>

            <div className="pl-alert-benefits-list">
              <div className="pl-benefit-line">
                <Check size={16} className="pl-benefit-check" />
                <span>Zero spam guarantee — notifications fire strictly when your target is reached</span>
              </div>
              <div className="pl-benefit-line">
                <Check size={16} className="pl-benefit-check" />
                <span>Includes hidden bank coupon & flash midnight sale price crashes</span>
              </div>
              <div className="pl-benefit-line">
                <Check size={16} className="pl-benefit-check" />
                <span>One-tap unsubscribe or modify thresholds at any time</span>
              </div>
            </div>

            <div className="pl-alert-social-proof">
              <div className="pl-social-avatars-row">
                <span className="pl-avatar-circle a1">AK</span>
                <span className="pl-avatar-circle a2">RP</span>
                <span className="pl-avatar-circle a3">SN</span>
                <span className="pl-avatar-circle a4">+92k</span>
              </div>
              <span className="pl-social-text">Over 92,000 active shoppers tracking price drops today</span>
            </div>
          </div>

          {/* Right Column: Interactive Configuration Form */}
          <div className="pl-alert-right-form-col">
            <div className="pl-alert-form-box">
              <div className="pl-alert-target-product-header">
                <img
                  src={product.image || '/products/iphone-16.jpg'}
                  alt={product.name}
                  className="pl-alert-thumb-img"
                />
                <div className="pl-alert-product-text">
                  <span className="pl-alert-label-sub">ACTIVE PRODUCT TRACKER</span>
                  <h3 className="pl-alert-product-title">{product.name}</h3>
                  <div className="pl-alert-price-current-tag">
                    Current Lowest: <strong>{formatPrice(basePrice)}</strong>
                  </div>
                </div>
              </div>

              {isSaved ? (
                <div className="pl-alert-success-state">
                  <div className="pl-alert-success-icon-box">
                    <Check size={28} color="#119B67" />
                  </div>
                  <h4 className="pl-alert-success-title">Price Alert is Active!</h4>
                  <p className="pl-alert-success-desc">
                    Tracking <strong>{product.name}</strong>. We'll send an instant dispatch to <strong>{contactVal}</strong> when price hits <strong>{formatPrice(customPrice)}</strong> or lower.
                  </p>
                  <button
                    type="button"
                    className="pl-alert-reset-btn"
                    onClick={() => setIsSaved(false)}
                  >
                    Modify Target Price
                  </button>
                </div>
              ) : (
                <form className="pl-alert-interactive-form" onSubmit={handleCreateAlert}>
                  {/* Preset Buttons */}
                  <label className="pl-form-field-label">
                    Select Target Price Drop Threshold:
                  </label>
                  <div className="pl-preset-chips-row">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset.percent}
                        type="button"
                        className={`pl-preset-chip-btn ${selectedPreset === preset.percent ? 'active' : ''}`}
                        onClick={() => handlePresetSelect(preset)}
                      >
                        <span className="pl-preset-drop-val">{preset.label}</span>
                        <span className="pl-preset-target-price">{formatPrice(preset.target)}</span>
                      </button>
                    ))}
                  </div>

                  {/* Custom Number Input */}
                  <div className="pl-custom-target-input-box">
                    <span className="pl-input-currency-prefix">₹</span>
                    <input
                      type="number"
                      className="pl-custom-target-input"
                      value={customPrice}
                      onChange={(e) => {
                        setCustomPrice(Number(e.target.value));
                        setSelectedPreset(null);
                      }}
                      placeholder="Enter target price in INR"
                    />
                    <span className="pl-target-savings-calc">
                      Save {formatPrice(Math.max(0, basePrice - customPrice))}
                    </span>
                  </div>

                  {/* Channel Notification Toggles */}
                  <div className="pl-channels-toggles-row">
                    <label className={`pl-channel-pill-checkbox ${emailEnabled ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        checked={emailEnabled}
                        onChange={(e) => setEmailEnabled(e.target.checked)}
                      />
                      <Mail size={14} />
                      <span>Email Alert</span>
                    </label>

                    <label className={`pl-channel-pill-checkbox ${whatsappEnabled ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        checked={whatsappEnabled}
                        onChange={(e) => setWhatsappEnabled(e.target.checked)}
                      />
                      <Smartphone size={14} />
                      <span>WhatsApp Alert</span>
                    </label>
                  </div>

                  {/* Contact Input Field */}
                  <div className="pl-contact-input-wrapper">
                    <input
                      type="text"
                      className="pl-contact-input-field"
                      value={contactVal}
                      onChange={(e) => setContactVal(e.target.value)}
                      placeholder="youremail@gmail.com"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="pl-alert-submit-btn">
                    <Bell size={16} />
                    <span>Set Alert for {formatPrice(customPrice)}</span>
                  </button>

                  <div className="pl-form-guarantee-note">
                    <ShieldCheck size={13} />
                    <span>Free forever. Instant dispatch. Zero spam.</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceAlertCTA;
