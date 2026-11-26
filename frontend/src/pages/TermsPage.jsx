import React, { useEffect } from 'react';
import {
  ArrowLeft,
  FileText,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  Scale
} from 'lucide-react';
import DashboardFooter from '../components/dashboard/DashboardFooter';
import '../dashboard.css';

export const TermsPage = ({ navigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Terms & Disclaimer - PriceLens';
  }, []);

  const handleBack = (e) => {
    e.preventDefault();
    if (typeof navigate === 'function') {
      navigate('/');
    } else {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div className="db-static-page-shell">
      {/* Top Simple Navigation Header */}
      <header className="db-navbar-main" style={{ borderBottom: '1px solid var(--db-border)' }}>
        <div className="db-navbar-container">
          <div
            className="db-brand-logo"
            style={{ cursor: 'pointer' }}
            onClick={handleBack}
            title="PriceLens Home"
          >
            <div className="db-brand-icon-box">
              <Scale size={19} />
            </div>
            <div className="db-brand-text-col">
              <span className="db-brand-title">
                Price<span>Lens</span>
              </span>
              <span className="db-brand-subtitle">Terms &amp; Disclaimers</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <a
              href="/"
              onClick={handleBack}
              className="db-btn-clean db-btn-clean-primary"
              style={{ fontSize: '0.85rem', padding: '0.45rem 0.95rem' }}
            >
              <ArrowLeft size={15} style={{ display: 'inline', marginRight: '4px' }} />
              Back to Compare
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="db-static-page-main">
        <a href="/" onClick={handleBack} className="db-static-back-btn">
          <ArrowLeft size={15} /> Back to Search &amp; Deals
        </a>

        <div className="db-static-card">
          <div style={{ borderBottom: '1px solid var(--db-border)', paddingBottom: '1.5rem', marginBottom: '1.75rem' }}>
            <div className="db-hero-badge-pill" style={{ marginBottom: '0.75rem' }}>
              <FileText size={13} className="db-hero-sparkle" />
              <span>User Agreement &amp; Disclaimers</span>
            </div>
            <h1 className="db-screen-title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              Terms of Service &amp; Disclaimer
            </h1>
            <p className="db-screen-subtitle" style={{ fontSize: '0.95rem', color: '#64748B' }}>
              Please review these terms carefully before using the PriceLens price comparison platform.
            </p>
          </div>

          {/* 1. Overview */}
          <h2>
            <Scale size={19} color="var(--db-primary)" />
            1. Overview
          </h2>
          <p>
            PriceLens ek independent online shopping intelligence aur price comparison service hai. PriceLens ka use karke aap in sharton aur disclaimers ko svikaar karte hain.
          </p>

          {/* 2. No Guarantee on Prices */}
          <h2>
            <AlertTriangle size={19} color="#D97706" />
            2. Prices Ki Accuracy Ki Guarantee Nahi Hai (Price &amp; Inventory Disclaimer)
          </h2>
          <div className="db-disclaimer-callout">
            <p style={{ margin: 0, marginBottom: '0.4rem', fontWeight: 600 }}>
              PriceLens kisi bhi product ke daam, discount ya availability ki guarantee nahi deta:
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
              <li>Online stores (Amazon, Flipkart, Croma, Reliance Digital, etc.) par prices, lightning deals, bank instant discounts, aur coupons <strong>lagatar badalte rehte hain</strong>.</li>
              <li>PriceLens par dikhaye gaye prices search ke samay collect kiye gaye the. Kisi bhi product ko khareedne se pehle <strong>retailer ki official website par antim price zaroor check karein</strong>.</li>
              <li>Checkout page par jo price aur delivery charges dikhte hain, wahi aakhiri maanya amount hota hai.</li>
            </ul>
          </div>

          {/* 3. Third-Party Store Links */}
          <h2>
            <ExternalLink size={19} color="#0284C7" />
            3. Store Links Third-Party Hain (Third-Party Merchants)
          </h2>
          <p>
            PriceLens par dikhaye gaye sabhi store links third-party websites ki taraf le jaate hain:
          </p>
          <ul>
            <li><strong>Hum direct seller nahi hain:</strong> PriceLens koi product khud nahi bechta, na hi koi payment collect karta hai, aur na hi shipping/delivery handle karta hai.</li>
            <li><strong>Merchant Responsibilities:</strong> Aapka har transaction, payment, warranty, shipping, return, aur refund seedhe us retailer (jaise Amazon.in ya Flipkart) ke saath hota hai jahan se aapne order place kiya hai.</li>
            <li><strong>No Liability for Merchant Actions:</strong> Kisi bhi merchant ki delivery delay, out of stock issue, damaged product, ya service dispute ke liye PriceLens kisi bhi tarah se zimmedar nahi hai.</li>
          </ul>

          {/* 4. Amazon Associates & Affiliate Disclosure */}
          <h2>
            <FileText size={19} color="#7C3AED" />
            4. Amazon Associates &amp; Affiliate Disclosure
          </h2>
          <div className="db-amazon-disclosure-box">
            <p style={{ margin: 0, fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
              Amazon Associates Program Statement:
            </p>
            <p style={{ margin: 0, fontWeight: 600, color: '#1E293B', marginBottom: '0.35rem' }}>
              &ldquo;As an Amazon Associate I earn from qualifying purchases.&rdquo;
            </p>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569' }}>
              PriceLens verified retailer affiliate programs mein bhaag leta hai. Agar aap hamare links par click karke purchase karte hain, toh humein referral fee mil sakti hai bina aapko kisi bhi extra cost ke.
            </p>
          </div>

          {/* 5. Limitation of Liability */}
          <h2>
            <ShieldAlert size={19} color="#EA580C" />
            5. Limitation of Liability
          </h2>
          <p>
            PriceLens bina kisi warranty ke &ldquo;as is&rdquo; aur &ldquo;as available&rdquo; aadhar par pradaan kiya jata hai. Hum platform ke uninterrupted ya error-free hone ki guarantee nahi dete. Kisi bhi technical glitch, server downtime, ya data inaccuracy ke chalte hue nuksan ke liye PriceLens liable nahi hoga.
          </p>

          <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--db-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Contact: <code style={{ background: '#F1F5F9', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>aaravgupta9462@gmail.com</code>
            </span>
            <a href="/" onClick={handleBack} className="db-btn-clean db-btn-clean-primary" style={{ fontSize: '0.85rem' }}>
              Back to Home &rarr;
            </a>
          </div>
        </div>
      </main>

      {/* Universal Footer */}
      <DashboardFooter onNavigate={navigate} />
    </div>
  );
};

export default TermsPage;
