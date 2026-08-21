import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

const ShoppingInsight = () => {
  const { setSelectedProductId } = useDashboard();

  const handleViewComparison = () => {
    setSelectedProductId('iphone-16-128');
    const compEl = document.getElementById('price-comparison-section');
    if (compEl) {
      compEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="db-card-insight">
      <div className="db-insight-body">
        <div>
          <div className="db-insight-tag">
            <Sparkles size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
            Your Shopping Insight
          </div>
          <div className="db-insight-title">
            You could save ₹2,500 on your recent search.
          </div>
          <div className="db-insight-desc">
            We found a lower listed price on Flipkart for iPhone 16 compared to standard retail.
          </div>
        </div>
        <button className="db-insight-btn" onClick={handleViewComparison}>
          View Comparison <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default ShoppingInsight;
