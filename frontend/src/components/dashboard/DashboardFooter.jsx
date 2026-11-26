import React, { useState } from 'react';
import { Zap, ShieldCheck, Heart, ArrowUp, HeartHandshake } from 'lucide-react';
import LegalModal from './LegalModal';

export const DashboardFooter = () => {
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState('privacy');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openLegal = (tab) => {
    setLegalTab(tab);
    setLegalModalOpen(true);
  };

  return (
    <>
      <footer className="pl-editorial-footer" aria-label="Site Footer">
        <div className="pl-footer-container">
          {/* Top Tagline & Brand Row */}
          <div className="pl-footer-top-brand-row">
            <div className="pl-footer-brand-col">
              <div className="pl-footer-logo-wrap" onClick={scrollToTop}>
                <div className="pl-footer-logo-icon">
                  <Zap size={18} fill="#FFFFFF" color="#FFFFFF" />
                </div>
                <span className="pl-footer-logo-title">PriceLens</span>
              </div>
              <p className="pl-footer-tagline">
                SEE THE REAL PRICE. COMPARE SMARTER. BUY BETTER.
              </p>
              <p className="pl-footer-mission">
                Empowering Indian online shoppers with impartial multi-store price intelligence, historical tracking telemetry, and verified instant price-drop alerts.
              </p>
            </div>

            <div className="pl-footer-nav-columns">
              <div className="pl-footer-nav-col">
                <h4 className="pl-footer-col-title">Intelligence</h4>
                <ul className="pl-footer-links-list">
                  <li><a href="#price-comparison-section">Multi-Store Compare</a></li>
                  <li><a href="#price-comparison-section">Price History Curves</a></li>
                  <li><a href="#buy-advisor">Buy-Now vs Wait</a></li>
                  <li><a href="#popular-deals">Popular Price Drops</a></li>
                  <li><a href="#alerts">Drop Dispatcher</a></li>
                </ul>
              </div>

              <div className="pl-footer-nav-col">
                <h4 className="pl-footer-col-title">Retailers Monitored</h4>
                <ul className="pl-footer-links-list">
                  <li><a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer">Amazon India <span className="pl-footer-live-badge">Live</span></a></li>
                  <li><a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer">Flipkart <span className="pl-footer-live-badge">Live</span></a></li>
                  <li><span className="pl-footer-future-tag">Croma (Future Update)</span></li>
                  <li><span className="pl-footer-future-tag">Reliance Digital (Future Update)</span></li>
                  <li><span className="pl-footer-future-tag">Tata CLiQ (Future Update)</span></li>
                </ul>
              </div>

              <div className="pl-footer-nav-col">
                <h4 className="pl-footer-col-title">Categories</h4>
                <ul className="pl-footer-links-list">
                  <li><a href="#category">Smartphones &amp; Flagships</a></li>
                  <li><a href="#category">Laptops &amp; MacBooks</a></li>
                  <li><a href="#category">Wireless Headphones</a></li>
                  <li><a href="#category">Smartwatches &amp; Fitness</a></li>
                  <li><a href="#category">Smart Home Tech</a></li>
                </ul>
              </div>

              <div className="pl-footer-nav-col">
                <h4 className="pl-footer-col-title">Trust &amp; Transparency</h4>
                <ul className="pl-footer-links-list">
                  <li>
                    <button type="button" className="pl-footer-text-btn" onClick={() => openLegal('privacy')}>
                      Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button type="button" className="pl-footer-text-btn" onClick={() => openLegal('terms')}>
                      Terms of Service
                    </button>
                  </li>
                  <li>
                    <button type="button" className="pl-footer-text-btn" onClick={() => openLegal('affiliate')}>
                      Affiliate Disclosure
                    </button>
                  </li>
                  <li>
                    <button type="button" className="pl-footer-text-btn" onClick={() => openLegal('contact')}>
                      Contact &amp; Report Issue
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Mandatory Affiliate & Trademark Disclosure Banner */}
          <div className="pl-footer-affiliate-banner">
            <HeartHandshake size={15} className="pl-affiliate-icon" />
            <p className="pl-affiliate-text">
              <strong>Affiliate Disclosure:</strong> PriceLens is a participant in the Amazon Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by linking to Amazon.in. Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates. We also participate in the Flipkart Affiliate program and earn commissions on qualifying purchases at zero additional cost to you.
            </p>
          </div>

          {/* Divider */}
          <div className="pl-footer-divider" />

          {/* Bottom Disclaimer & Copyright */}
          <div className="pl-footer-bottom-row">
            <div className="pl-footer-disclaimer-text">
              <span>
                <strong>Disclaimer:</strong> PriceLens is an independent price comparison &amp; shopping intelligence platform. We are not owned or operated by Amazon, Flipkart, Croma, or Reliance Digital. Product trademarks and logos belong strictly to their respective owners. Prices and promotions are subject to rapid change by retailers.
              </span>
            </div>

            <div className="pl-footer-copyright-col">
              <span className="pl-footer-copy">© 2026 PriceLens Technologies Inc. All rights reserved.</span>
              <button type="button" className="pl-back-to-top-btn" onClick={scrollToTop}>
                <span>Back to Top</span>
                <ArrowUp size={13} />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Legal, Privacy & Contact Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalTab}
      />
    </>
  );
};

export default DashboardFooter;
