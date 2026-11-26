import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, Copy, Check, ExternalLink, ShieldCheck, Sparkles, Scissors } from 'lucide-react';
import { VERIFIED_COUPONS } from '../../data/mockData';
import { useDashboard } from '../../context/DashboardContext';
import StoreLogo from './StoreLogo';
import { getAffiliateUrl } from '../../utils/affiliate';

export const CouponsSection = () => {
  const { showToast } = useDashboard();
  const [copiedId, setCopiedId] = useState(null);
  const [selectedStore, setSelectedStore] = useState('ALL');

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
    const targetUrl = rawUrls[store] || 'https://www.amazon.in';
    const affiliateUrl = getAffiliateUrl(targetUrl, store);
    window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  const displayedCoupons = selectedStore === 'ALL'
    ? VERIFIED_COUPONS
    : VERIFIED_COUPONS.filter((c) => c.store.toLowerCase() === selectedStore.toLowerCase());

  const amazonCount = VERIFIED_COUPONS.filter((c) => c.store.toLowerCase() === 'amazon').length;
  const flipkartCount = VERIFIED_COUPONS.filter((c) => c.store.toLowerCase() === 'flipkart').length;

  return (
    <section className="pl-coupons-section" aria-label="Verified Coupons & Bank Codes">
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
              Tested promo codes for Amazon &amp; Flipkart. Copy with one click or auto-apply at checkout. (More stores coming soon)
            </p>
          </div>

          <div className="pl-coupons-guarantee-badge">
            <ShieldCheck size={16} color="#119B67" />
            <span>100% Tested Today &bull; Zero Expired Codes</span>
          </div>
        </div>

        {/* Store Filter Tabs (Amazon First, Flipkart Second) */}
        <div className="pl-coupons-filter-bar" role="tablist" aria-label="Filter coupons by store">
          <button
            type="button"
            className={`pl-coupon-filter-tab ${selectedStore === 'ALL' ? 'active' : ''}`}
            onClick={() => setSelectedStore('ALL')}
            role="tab"
            aria-selected={selectedStore === 'ALL'}
          >
            <span>All Stores</span>
            <span className="pl-filter-count">{VERIFIED_COUPONS.length}</span>
          </button>

          <button
            type="button"
            className={`pl-coupon-filter-tab ${selectedStore === 'Amazon' ? 'active' : ''}`}
            onClick={() => setSelectedStore('Amazon')}
            role="tab"
            aria-selected={selectedStore === 'Amazon'}
          >
            <span className="pl-store-filter-dot amazon" />
            <span>Amazon</span>
            <span className="pl-filter-count">{amazonCount}</span>
          </button>

          <button
            type="button"
            className={`pl-coupon-filter-tab ${selectedStore === 'Flipkart' ? 'active' : ''}`}
            onClick={() => setSelectedStore('Flipkart')}
            role="tab"
            aria-selected={selectedStore === 'Flipkart'}
          >
            <span className="pl-store-filter-dot flipkart" />
            <span>Flipkart</span>
            <span className="pl-filter-count">{flipkartCount}</span>
          </button>
        </div>

        {/* Coupon Cards Grid */}
        <div className="pl-coupons-cards-grid">
          {displayedCoupons.map((coupon, idx) => {
            const isCopied = copiedId === coupon.id;

            return (
              <motion.div
                key={coupon.id}
                layout
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.38, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -5, scale: 1.015 }}
                className="pl-coupon-ticket-card"
              >
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CouponsSection;
