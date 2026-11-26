import React, { useEffect } from 'react';
import {
  ArrowLeft,
  Shield,
  Lock,
  KeyRound,
  Bell,
  Search,
  Database,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import DashboardFooter from '../components/dashboard/DashboardFooter';
import '../dashboard.css';

export const PrivacyPage = ({ navigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Privacy Policy - PriceLens';
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
              <Shield size={19} />
            </div>
            <div className="db-brand-text-col">
              <span className="db-brand-title">
                Price<span>Lens</span>
              </span>
              <span className="db-brand-subtitle">Privacy &amp; Security</span>
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
              Back to Home
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
              <Lock size={13} className="db-hero-sparkle" />
              <span>Transparent Data Practices</span>
            </div>
            <h1 className="db-screen-title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              Privacy Policy
            </h1>
            <p className="db-screen-subtitle" style={{ fontSize: '0.95rem', color: '#64748B' }}>
              Effective Date: January 1, 2026 &bull; Last Updated: October 2026
            </p>
          </div>

          <p>
            Hum PriceLens (<strong>&ldquo;PriceLens&rdquo;</strong>, <strong>&ldquo;hum&rdquo;</strong>, ya <strong>&ldquo;hamara&rdquo;</strong>) par aapki privacy ka poora sammaan karte hain. Ye Privacy Policy batati hai ki jab aap hamari website aur price comparison tools ka upyog karte hain, toh hum kaun sa data collect karte hain aur uska upyog kaise hota hai.
          </p>

          {/* Section 1: Information We Collect */}
          <h2>
            <Database size={20} color="var(--db-primary)" />
            1. Hum Kaun Si Information Collect Karte Hain?
          </h2>
          <p>
            Hum sirf wahi information collect karte hain jo PriceLens ke features (jaise search, account login, aur price drop alerts) ko chalane ke liye zaroori hai:
          </p>

          <ul>
            <li>
              <strong>Email aur Password Registration:</strong> Agar aap PriceLens par account banate hain, toh hum aapka naam, email address, aur password collect karte hain. Hamare backend par passwords ko <strong>bcrypt</strong> cryptographic algorithm se hash karke surakshit kiya jata hai. Hum kabhi bhi aapka password plain-text mein store nahi karte.
            </li>
            <li>
              <strong>Google Sign-In Authentication:</strong> Agar aap Google OAuth ke zariye sign in karte hain, toh hum Google Identity Services ke madhyam se aapka basic public profile data (naam, verified email address, aur profile picture) prapt karte hain taaki aapka account access ho sake.
            </li>
            <li>
              <strong>Authentication Tokens (JWT / Local Storage):</strong> Login ke baad session maintain rakhne ke liye ek JSON Web Token (JWT) generate hota hai jo aapke browser ke <code>localStorage</code> (key: <code>pricelens_user</code>) mein store rehta hai. Isse aapko har page refresh par dobara login nahi karna padta.
            </li>
            <li>
              <strong>Price Drop Alerts Data:</strong> Jab aap kisi product par price drop alert set karte hain, toh hum aapka target price, product name/ID, chuni hui store (agar koi ho), aur aapka user identifier hamare database mein save karte hain taaki price drop hone par aapko notify kiya ja sake.
            </li>
            <li>
              <strong>Search Queries:</strong> Jab aap products search karte hain (jaise &ldquo;iPhone 16&rdquo; ya &ldquo;Sony XM5&rdquo;), toh ye keywords comparison engine ko bheje jaate hain. System performance aur speed badhane ke liye in search queries aur results ko short-term in-memory cache mein rakha jata hai.
            </li>
          </ul>

          {/* Section 2: How We Use Your Data */}
          <h2>
            <KeyRound size={20} color="#0284C7" />
            2. Hum Aapka Data Kaise Upyog Karte Hain?
          </h2>
          <ul>
            <li>Multi-store price comparisons aur authentic reviews display karne ke liye.</li>
            <li>Aapke saved wishlist items aur price drop alerts ko track karne ke liye.</li>
            <li>User account authenticate karne aur unauthorized access rokne ke liye.</li>
            <li>Platform ki speed, accuracy, aur caching system ko behtar banane ke liye.</li>
          </ul>
          <p>
            <strong>Hum aapka personal data kisi bhi third-party data broker, marketing agency, ya advertiser ko SELL ya RENT nahi karte.</strong>
          </p>

          {/* Section 3: Third-Party Links & Affiliate Tracking */}
          <h2>
            <ExternalLink size={20} color="#7C3AED" />
            3. Third-Party Links aur Affiliate Cookies
          </h2>
          <p>
            PriceLens par alag-alag verified retailers ke links hote hain (jaise Amazon India, Flipkart, Croma, Reliance Digital, etc.):
          </p>
          <ul>
            <li>
              <strong>External Retailer Sites:</strong> Jab aap kisi product ke <em>&ldquo;View on Store&rdquo;</em> button par click karte hain, toh aap PriceLens chhodkar us retailer ki official website par chale jaate hain. Us store par aapki browsing aur transaction unki apni Privacy Policy aur Terms of Service ke tahat hoti hai.
            </li>
            <li>
              <strong>Affiliate Tracking:</strong> PriceLens affiliate networks (including the Amazon Associates Program) mein bhaag leta hai. Jab aap hamare referral link ke zariye koi product khareedte hain, toh retailer affiliate tracking cookies use kar sakta hai taaki qualify hone par referral credit attribute ho sake.
            </li>
            <li>
              <strong>Amazon Disclosure:</strong> <em>&ldquo;As an Amazon Associate I earn from qualifying purchases.&rdquo;</em>
            </li>
          </ul>

          {/* Section 4: Data Retention & Security */}
          <h2>
            <Lock size={20} color="#059669" />
            4. Data Suraksha aur Retention
          </h2>
          <p>
            Hamari team security best practices follow karti hai:
          </p>
          <ul>
            <li>Backend database communication Surakshit SSL/TLS encrypted connections par hoti hai.</li>
            <li>Passwords hamesha salted bcrypt hashes ke roop mein store hote hain.</li>
            <li>Sensitive retailer API credentials frontend bundle mein shamil nahi ki jaati hain aur sirf protected backend servers par rehti hain.</li>
            <li>Aap jab chahein apne price alerts ko delete kar sakte hain ya account logout kar sakte hain.</li>
          </ul>

          {/* Section 5: Contact Information */}
          <h2>
            <Bell size={20} color="#EA580C" />
            5. Contact Us
          </h2>
          <p>
            Agar aapke paas hamari Privacy Policy, aapke personal data, ya account deletion ke baare mein koi sawaal hai, toh aap humse is email par contact kar sakte hain:
          </p>
          <p style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A' }}>
            Email: <code style={{ background: '#F1F5F9', padding: '0.25rem 0.6rem', borderRadius: '4px', color: '#0284C7' }}>aaravgupta9462@gmail.com</code>
          </p>

          {/* Legal Note Box */}
          <div className="db-disclaimer-callout" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <AlertCircle size={18} color="#D97706" />
              <strong>Zaroori Note (Legal Notice):</strong>
            </div>
            <p style={{ margin: 0, fontStyle: 'italic' }}>
              &ldquo;Ye template hai, legal advice nahi.&rdquo;
            </p>
            <p style={{ margin: 0, marginTop: '0.35rem', fontSize: '0.82rem', color: '#78350F' }}>
              This privacy statement reflects the actual data collection and technical operation of the PriceLens application. It is provided for informational and transparency purposes for project deployment and Amazon Associates compliance, and does not substitute for customized formal legal counsel.
            </p>
          </div>
        </div>
      </main>

      {/* Universal Footer */}
      <DashboardFooter onNavigate={navigate} />
    </div>
  );
};

export default PrivacyPage;
