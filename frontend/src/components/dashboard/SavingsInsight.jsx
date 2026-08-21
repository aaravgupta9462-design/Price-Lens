import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

const SavingsInsight = () => {
  const { setSelectedProductId } = useDashboard();

  const handleCompareDeal = () => {
    setSelectedProductId('iphone-16-128');
    const compEl = document.getElementById('price-comparison-section');
    if (compEl) {
      compEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="db-savings-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div className="db-savings-icon-box">
          ⚡
        </div>
        <div className="db-savings-content">
          <div className="db-savings-label">Smart Shopping Insight</div>
          <div className="db-savings-title">
            You can save up to ₹1,500 on iPhone 16 128GB today!
          </div>
          <div className="db-savings-sub">
            Flipkart currently offers the lowest verified price at ₹68,499 compared to ₹69,999 on Amazon.
          </div>
        </div>
      </div>
      <button className="db-savings-btn" onClick={handleCompareDeal}>
        Compare Deal <ArrowUpRight size={16} />
      </button>
    </div>
  );
};

export default SavingsInsight;
