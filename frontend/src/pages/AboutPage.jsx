import React, { useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  Scale,
  ShieldCheck,
  AlertTriangle,
  Zap,
  TrendingDown,
  ShoppingBag,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import DashboardFooter from '../components/dashboard/DashboardFooter';
import '../dashboard.css';

export const AboutPage = ({ navigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'About PriceLens - How Price Comparison Works';
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
              <Zap size={19} />
            </div>
            <div className="db-brand-text-col">
              <span className="db-brand-title">
                Price<span>Lens</span>
              </span>
              <span className="db-brand-subtitle">Shopping Intelligence</span>
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
              <ShieldCheck size={13} className="db-hero-sparkle" />
              <span>Independent Shopping Intelligence</span>
            </div>
            <h1 className="db-screen-title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              About PriceLens &mdash; Kaise Kaam Karta Hai
            </h1>
            <p className="db-screen-subtitle" style={{ fontSize: '1rem', color: '#64748B' }}>
              Learn how PriceLens empowers Indian online shoppers to compare electronics prices, track deals, and shop smarter.
            </p>
          </div>

          {/* Section 1: What is PriceLens? */}
          <h2>
            <ShoppingBag size={20} color="var(--db-primary)" />
            1. PriceLens Kya Hai? (What is PriceLens?)
          </h2>
          <p>
            <strong>PriceLens</strong> ek smart, independent price comparison aur shopping intelligence platform hai, jo khas taur par Indian online shoppers ke liye banaya gaya hai.
          </p>
          <p>
            Jab aap koi smartphone (jaise iPhone 16 ya Samsung Galaxy S25), laptop, wireless earbuds, ya electronic gadget khareedte hain, toh alag-alag e-commerce stores par unke prices mein hazaron rupaye ka farq hota hai. PriceLens ka maksad hai aapka samay aur paise bachana—ek single search mein sabhi verified Indian retailers ke live offers aapke samne laana.
          </p>

          {/* Section 2: How It Works */}
          <h2>
            <Zap size={20} color="#0284C7" />
            2. Ye Kaise Kaam Karta Hai? (Step-by-Step Workflow)
          </h2>
          <p>
            PriceLens par product search karna aur best deal dhundhna behad saral aur transparent hai:
          </p>

          <ol>
            <li>
              <strong>Search Query (Aap Search Karte Hain):</strong> User search box mein koi bhi product ka naam, model number, ya brand likhte hain (e.g. <em>&ldquo;iPhone 16 128GB&rdquo;</em>, <em>&ldquo;Sony XM5&rdquo;</em>, <em>&ldquo;MacBook Air M3&rdquo;</em>).
            </li>
            <li>
              <strong>Multi-Store Aggregation &amp; Normalization:</strong> Hamara system verified Indian retailers—jaise <strong>Amazon.in</strong>, <strong>Flipkart</strong>, <strong>Croma</strong>, <strong>Reliance Digital</strong>, aur Google Shopping feeds—se live listing data fetch karta hai.
            </li>
            <li>
              <strong>Smart Quality Filtering:</strong> Junk accessories (covers, tempered glass, cables), duplicate listings, foreign import listings, aur carrier-locked phones ko automatically filter kar diya jata hai taaki aapko sirf asli, matching product mile.
            </li>
            <li>
              <strong>Best Deal Identification:</strong> Sabhi stores ke in-stock offers ko price ke hisaab se sort karke sabse kam daam wale store ko <em>Best Deal</em> ke roop mein highlight kiya jata hai.
            </li>
            <li>
              <strong>Direct Store Redirect:</strong> Jab aapko sahi deal milti hai, aap <em>&ldquo;View on Store&rdquo;</em> par click karke seedhe official retailer ki website par jaate hain aur wahan apna order complete karte hain.
            </li>
          </ol>

          {/* Section 3: Important Price Fluctuation Disclaimer */}
          <div className="db-disclaimer-callout">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <AlertTriangle size={18} color="#D97706" />
              <strong style={{ fontSize: '0.98rem' }}>
                Zaroori Suchna: Prices Badal Sakte Hain (Price Accuracy Disclaimer)
              </strong>
            </div>
            <p style={{ margin: 0, marginBottom: '0.5rem' }}>
              Online e-commerce platforms (Amazon, Flipkart, Croma, etc.) par prices, lightning deals, bank instant discounts, aur coupons <strong>real-time mein har ghante badalte rehte hain</strong>.
            </p>
            <p style={{ margin: 0 }}>
              PriceLens periodic intervals par updated prices fetch karta hai, lekin <strong>khareedne se pehle retailer store par antim price zaroor confirm karein</strong>. Checkout page par jo price dikhega, wahi aakhiri aur maanya price hoga. PriceLens kisi bhi store ke price change ya stock availability ke liye zimmedar nahi hai.
            </p>
          </div>

          {/* Section 4: Retailer Programs & Amazon Associates */}
          <h2>
            <Scale size={20} color="#7C3AED" />
            3. Affiliate Transparency &amp; Amazon Associates Disclosure
          </h2>
          <p>
            PriceLens har shopper ke liye <strong>100% free</strong> hai. Hum users se koi subscription fee ya payment charge nahi karte. Is platform ko maintain karne aur servers ka kharch chalane ke liye hum verified affiliate programs mein hissa lete hain.
          </p>

          <div className="db-amazon-disclosure-box">
            <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>
              Amazon Associates Program Disclosure:
            </div>
            <p style={{ margin: 0, fontWeight: 600, color: '#1E293B', marginBottom: '0.35rem' }}>
              &ldquo;As an Amazon Associate I earn from qualifying purchases.&rdquo;
            </p>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569' }}>
              Jab aap PriceLens ke referral link par click karke Amazon.in ya kisi partner store se qualifying purchase karte hain, toh humein ek chhota commission mil sakta hai. <strong>Isse aapki purchasing price par koi asar nahi padta aur na hi aapko koi extra charge dena hota hai.</strong>
            </p>
          </div>

          {/* Section 5: Features Overview */}
          <h2>
            <CheckCircle2 size={20} color="#059669" />
            4. Hamare Core Features
          </h2>
          <ul>
            <li>
              <strong>Live Price Comparison:</strong> Ek hi screen par Amazon, Flipkart, aur verified stores ke rate dekhein.
            </li>
            <li>
              <strong>Price Drop Alerts:</strong> Apna manpasand target price set karein aur price drop hote hi notification paayein.
            </li>
            <li>
              <strong>Review Intelligence:</strong> AI sentiment analysis ke zariye verified customer feedback aur fake review warnings dekhein.
            </li>
            <li>
              <strong>Price History Tracking:</strong> Pata karein ki product ka daam pehle kitna tha aur kya abhi khareedna sahi deal hai.
            </li>
          </ul>

          <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--db-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Koi sawaal ya feedback hai? Contact: <code style={{ background: '#F1F5F9', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>aaravgupta9462@gmail.com</code>
            </span>
            <a href="/" onClick={handleBack} className="db-btn-clean db-btn-clean-primary" style={{ fontSize: '0.85rem' }}>
              Start Comparing Deals &rarr;
            </a>
          </div>
        </div>
      </main>

      {/* Universal Footer */}
      <DashboardFooter onNavigate={navigate} />
    </div>
  );
};

export default AboutPage;
