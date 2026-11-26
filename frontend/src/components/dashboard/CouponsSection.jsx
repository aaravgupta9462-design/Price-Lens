import React, { useState } from 'react';
import { Tag, Copy, Check, ExternalLink, ShieldCheck, Sparkles, Scissors } from 'lucide-react';
import { VERIFIED_COUPONS } from '../../data/mockData';
import { useDashboard } from '../../context/DashboardContext';
import StoreLogo from './StoreLogo';
import { getAffiliateUrl } from '../../utils/affiliate';

export const CouponsSection = () => {
  const { showToast } = useDashboard();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (coupon) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(coupon.code);
    }
    setCopiedId(coupon.id);
    if (showToast) {
      showToast(`Coupon code ${coupon.code} copied for ${coupon.store}!`, 'success');
    }
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  const handleVisitStore = (store) => {
    const rawUrls = {
      Flipkart: 'https://www.flipkart.com',
      Amazon: 'https://www.amazon.in',
      Croma: 'https://www.croma.com',
      'Reliance Digital': 'https://www.reliancedigital.in',
    };
    const targetUrl = rawUrls[store] || 'https://www.flipkart.com';
    const affiliateUrl = getAffiliateUrl(targetUrl, store);
    window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="coupons-section" className="pl-coupons-section" aria-label="Verified Coupons & Bank Codes">
      <div className="pl-coupons-container">
        {/* Section Header */}
        <div className="pl-section-header-row">
          <div className="pl-section-title-col">
            <div className="pl-section-eyebrow-pill">
              <Scissors size={13} className="pl-eyebrow-zap" />
              <span>AUTO-APPLY COUPON HUB</span>
            </div>
            <h2 className="pl-section-title">Verified store coupons &amp; bank codes</h2>
            <p className="pl-section-subtitle">
              Tested promo codes for Amazon, Flipkart, Croma &amp; Reliance Digital. Copy with one click or auto-apply at checkout.
            </p>
          </div>

          <div className="pl-coupons-guarantee-badge">
            <ShieldCheck size={16} color="#119B67" />
            <span>100% Tested Today &bull; Zero Expired Codes</span>
          </div>
        </div>

        {/* Coupon Cards Grid */}
        <div className="pl-coupons-cards-grid">
          {VERIFIED_COUPONS.map((coupon) => {
            const isCopied = copiedId === coupon.id;

            return (
              <div key={coupon.id} className="pl-coupon-ticket-card">
                <div className="pl-coupon-card-header">
                  <div className="pl-coupon-store-pill">
                    <StoreLogo store={coupon.store} size="sm" />
                  </div>
                  <span className="pl-coupon-expiry-tag">{coupon.expiry}</span>
                </div>

                <div className="pl-coupon-discount-title">{coupon.discount}</div>

                <div className="pl-coupon-meta-line">
                  <span>Min Order: <strong>{coupon.minOrder}</strong></span>
                  <span>&bull;</span>
                  <span>{coupon.category}</span>
                </div>

                <div className="pl-coupon-action-row">
                  <div className="pl-coupon-code-pill" onClick={() => handleCopy(coupon)}>
                    <span className="pl-coupon-code-text">{coupon.code}</span>
                    <button
                      type="button"
                      className="pl-coupon-copy-btn"
                      title="Copy promo code"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(coupon);
                      }}
                    >
                      {isCopied ? (
                        <>
                          <Check size={13} color="#119B67" />
                          <span className="text-green">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    className="pl-coupon-visit-btn"
                    onClick={() => handleVisitStore(coupon.store)}
                    title={`Open ${coupon.store}`}
                  >
                    <span>Store</span>
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CouponsSection;
