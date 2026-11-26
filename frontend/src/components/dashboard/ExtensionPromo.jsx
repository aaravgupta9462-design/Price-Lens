import React, { useState } from 'react';
import { ShieldCheck, Zap, Bell, CheckCircle2, Star, ArrowRight, DownloadCloud, Sparkles } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

const ChromeIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#FFFFFF" fillOpacity="0.15" />
    <circle cx="12" cy="12" r="4.5" fill="#4285F4" />
    <path d="M12 2a10 10 0 0 0-8.66 5l4.33 7.5a5 5 0 0 1 4.33-7.5h8.66A10 10 0 0 0 12 2z" fill="#EA4335" />
    <path d="M22 12a10 10 0 0 0-1.34-5H12a5 5 0 0 1 4.33 2.5L20.66 17A10 10 0 0 0 22 12z" fill="#FBBC05" />
    <path d="M12 22a10 10 0 0 0 8.66-5l-4.33-7.5a5 5 0 0 1-8.66 0L3.34 17A10 10 0 0 0 12 22z" fill="#34A853" />
    <circle cx="12" cy="12" r="4" fill="#FFFFFF" />
    <circle cx="12" cy="12" r="3" fill="#4285F4" />
  </svg>
);

export const ExtensionPromo = () => {
  const { showToast } = useDashboard();
  const [emailInput, setEmailInput] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const handleJoinWaitlist = (e) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      if (showToast) showToast('Please enter a valid email address', 'alert');
      return;
    }
    setIsJoined(true);
    if (showToast) {
      showToast(`VIP Access reserved for ${emailInput}! Check your inbox soon.`, 'success');
    }
  };

  return (
    <section className="pl-extension-promo-section" aria-label="Chrome Extension Assistant">
      <div className="pl-extension-banner-box">
        {/* Ambient background decoration */}
        <div className="pl-extension-glow" />

        <div className="pl-extension-left-col">
          <div className="pl-extension-badge-row">
            <span className="pl-extension-pill-tag">
              <Sparkles size={12} />
              <span>OFFICIAL BROWSER EXTENSION</span>
            </span>
            <div className="pl-extension-rating-pill">
              <div className="pl-stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <span className="pl-rating-text">4.9/5 Rating &bull; Trusted by Early Beta Shoppers across India</span>
            </div>
          </div>

          <h3 className="pl-extension-headline">
            Never overpay again on Amazon &amp; Flipkart.
          </h3>

          <p className="pl-extension-subtext">
            Get the free PriceLens extension to see historical price graphs directly embedded on store pages, automatically test and apply coupon codes at checkout, and get instant price drop alerts without switching tabs.
          </p>

          <div className="pl-extension-perks-row">
            <div className="pl-perk-item">
              <CheckCircle2 size={16} color="#119B67" />
              <span>Auto-Graph on Store Pages</span>
            </div>
            <div className="pl-perk-item">
              <CheckCircle2 size={16} color="#119B67" />
              <span>1-Click Auto Coupon Apply</span>
            </div>
            <div className="pl-perk-item">
              <CheckCircle2 size={16} color="#119B67" />
              <span>Flash Sale Auto-Buy</span>
            </div>
            <div className="pl-perk-item">
              <CheckCircle2 size={16} color="#119B67" />
              <span>WhatsApp Drop Alerts</span>
            </div>
          </div>
        </div>

        <div className="pl-extension-right-cta-col">
          {isJoined ? (
            <div className="pl-waitlist-success-card">
              <CheckCircle2 size={24} color="#119B67" />
              <div className="pl-waitlist-success-text">
                <strong>You're on the VIP Beta List!</strong>
                <span>We'll email you the Chrome Web Store link on release day.</span>
              </div>
            </div>
          ) : showInput ? (
            <form className="pl-extension-waitlist-form" onSubmit={handleJoinWaitlist}>
              <div className="pl-waitlist-input-wrap">
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="Enter email for Beta invite..."
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="pl-waitlist-input"
                />
                <button type="submit" className="pl-waitlist-submit-btn">
                  <span>Get Invite</span>
                  <ArrowRight size={14} />
                </button>
              </div>
              <button
                type="button"
                className="pl-waitlist-cancel-btn"
                onClick={() => setShowInput(false)}
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              type="button"
              className="pl-install-extension-btn"
              onClick={() => setShowInput(true)}
              title="Get early access to the PriceLens Chrome Extension"
            >
              <ChromeIcon size={22} />
              <div className="pl-btn-text-group">
                <span className="pl-btn-main">Add to Chrome</span>
                <span className="pl-btn-sub">Join Beta Waitlist &bull; 100% Free</span>
              </div>
            </button>
          )}
          <span className="pl-extension-guarantee-note">
            Supports Chrome, Edge, Brave &amp; Firefox
          </span>
        </div>
      </div>
    </section>
  );
};

export default ExtensionPromo;
