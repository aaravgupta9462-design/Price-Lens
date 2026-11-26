import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Scale, Mail, CheckCircle2, AlertCircle, HeartHandshake } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const LegalModal = ({ isOpen, onClose, initialTab = 'privacy' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: 'Price Discrepancy', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useDashboard();

  if (!isOpen) return null;

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.email || !contactForm.message) {
      if (showToast) showToast('Please provide your email and message', 'alert');
      return;
    }
    setSubmitted(true);
    if (showToast) showToast('Message received! Our team will respond within 24 hours.', 'success');
    setTimeout(() => {
      setSubmitted(false);
      setContactForm({ name: '', email: '', subject: 'Price Discrepancy', message: '' });
      onClose();
    }, 2000);
  };

  return (
    <div className="pl-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="pl-legal-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="pl-legal-modal-header">
          <div className="pl-legal-header-title-group">
            <ShieldCheck size={20} className="text-violet" />
            <h3>Trust, Transparency &amp; Legal Policies</h3>
          </div>
          <button type="button" className="pl-modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="pl-legal-tabs-bar">
          <button
            type="button"
            className={`pl-legal-tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            <FileText size={14} />
            <span>Privacy Policy</span>
          </button>
          <button
            type="button"
            className={`pl-legal-tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
            onClick={() => setActiveTab('terms')}
          >
            <Scale size={14} />
            <span>Terms of Service</span>
          </button>
          <button
            type="button"
            className={`pl-legal-tab-btn ${activeTab === 'affiliate' ? 'active' : ''}`}
            onClick={() => setActiveTab('affiliate')}
          >
            <HeartHandshake size={14} />
            <span>Affiliate Disclosure</span>
          </button>
          <button
            type="button"
            className={`pl-legal-tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <Mail size={14} />
            <span>Contact &amp; Support</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="pl-legal-modal-body">
          {activeTab === 'privacy' && (
            <div className="pl-legal-text-block">
              <h4>Privacy Policy (DPDP Act &amp; GDPR Compliant)</h4>
              <p className="text-muted">Last updated: November 2026</p>
              
              <h5>1. Information We Collect</h5>
              <p>
                PriceLens collects information you provide directly to us (e.g., your email or WhatsApp phone number when configuring price-drop alerts, saved items in your Wishlist, and anonymized search queries). We do not collect payment card information or sensitive government IDs.
              </p>

              <h5>2. How We Use Information</h5>
              <p>
                We use collected information solely to:
              </p>
              <ul>
                <li>Dispatch automated price drop alerts when a tracked retailer's price falls below your threshold.</li>
                <li>Maintain your saved Wishlist and recent search history across browser sessions.</li>
                <li>Protect against fraudulent scraping, rate abuse, and malicious traffic.</li>
              </ul>

              <h5>3. Zero Sale of Personal Data</h5>
              <p>
                <strong>We never sell, rent, or trade your personal data</strong> to third-party data brokers or marketing networks.
              </p>

              <h5>4. Cookies and Local Storage</h5>
              <p>
                PriceLens utilizes local storage and first-party cookies to remember your preferences (e.g., theme, saved products, and active comparison tables) without tracking your browsing activity across other websites.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="pl-legal-text-block">
              <h4>Terms of Service</h4>
              <p className="text-muted">Effective Date: November 2026</p>

              <h5>1. Purpose of Service</h5>
              <p>
                PriceLens is an independent shopping intelligence and comparison platform. We provide automated price aggregation, historical tracking curves, and coupon discovery across Indian e-commerce platforms.
              </p>

              <h5>2. Pricing &amp; Inventory Accuracy</h5>
              <p>
                Prices, stock availability, bank discounts, and shipping estimates change dynamically on third-party retailer platforms (Amazon, Flipkart, Croma, Reliance Digital). While PriceLens audits prices frequently, the final checkout price on the merchant's website is the legally binding price. Always verify final totals before paying.
              </p>

              <h5>3. Intellectual Property</h5>
              <p>
                All product brand names, merchant trademarks, logos, and product photographs displayed belong exclusively to their respective owners. Their display does not imply endorsement by or affiliation with the trademark owners.
              </p>
            </div>
          )}

          {activeTab === 'affiliate' && (
            <div className="pl-legal-text-block">
              <h4>Affiliate Program &amp; Advertising Disclosure</h4>
              <div className="pl-affiliate-highlight-box">
                <strong>Mandatory Amazon Disclosure:</strong>
                <p>
                  "PriceLens is a participant in the Amazon Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by linking to Amazon.in. Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates."
                </p>
              </div>

              <h5>How PriceLens Earns Revenue</h5>
              <p>
                To provide PriceLens as a 100% free service to Indian shoppers, we participate in affiliate programs with e-commerce retailers, including Amazon India, Flipkart, and partner affiliate networks (Croma, Reliance Digital).
              </p>
              <p>
                When you click a link from PriceLens to visit a store and complete a qualifying purchase, the merchant may pay us a small referral commission at <strong>zero additional cost to you</strong>. You pay the exact same price (or lower with our verified coupon codes).
              </p>

              <h5>Editorial Independence</h5>
              <p>
                Our comparison algorithms, lowest price badges, and "Buy vs Wait" recommendations are strictly mathematical and objective. Retailers cannot pay for fake discounts or artificial rank boosting.
              </p>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="pl-legal-text-block">
              <h4>Contact Us &amp; Report Price Discrepancies</h4>
              <p>
                Notice a price that doesn't match a live store? Have feedback or want to partner? Fill out the form below or email us directly at <strong>support@pricelens.io</strong>.
              </p>

              {submitted ? (
                <div className="pl-contact-success-state">
                  <CheckCircle2 size={32} color="#119B67" />
                  <h5>Thank you for your message!</h5>
                  <p>Our engineering team has received your note and will review it shortly.</p>
                </div>
              ) : (
                <form className="pl-contact-modal-form" onSubmit={handleContactSubmit}>
                  <div className="pl-form-row">
                    <div className="pl-form-group">
                      <label htmlFor="contact-name">Your Name</label>
                      <input
                        id="contact-name"
                        type="text"
                        placeholder="Purvansh Khandelwal"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      />
                    </div>
                    <div className="pl-form-group">
                      <label htmlFor="contact-email">Email Address *</label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="pl-form-group">
                    <label htmlFor="contact-subject">Topic / Subject</label>
                    <select
                      id="contact-subject"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    >
                      <option value="Price Discrepancy">Report Price Discrepancy</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Chrome Extension Beta">Chrome Extension Beta Inquiry</option>
                      <option value="Partnership">Affiliate / Partnership</option>
                      <option value="Other">Other Query</option>
                    </select>
                  </div>

                  <div className="pl-form-group">
                    <label htmlFor="contact-message">Message *</label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      placeholder="Describe the issue, paste product link, or share your thoughts..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="pl-contact-submit-btn">
                    <span>Send Message to Team</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
