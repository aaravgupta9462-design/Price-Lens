import React from 'react';
import { Star, Scale, Clock } from 'lucide-react';
import { RECENT_SEARCHES, formatPrice } from '../../data/mockData';
import { useDashboard } from '../../context/DashboardContext';

const RecentSearches = () => {
  const { setSelectedProductId } = useDashboard();

  const handleCompare = (productId) => {
    setSelectedProductId(productId);
    const compEl = document.getElementById('price-comparison-section');
    if (compEl) {
      compEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="db-card db-card-primary" id="recent-searches-section">
      <div className="db-card-header-clean">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={18} style={{ color: '#2563EB' }} />
          <h3 className="db-card-title-sm">Recent Searches</h3>
        </div>
        <span className="db-badge-soft-blue">3 recent</span>
      </div>

      <div className="db-recent-list">
        {RECENT_SEARCHES.map((item) => (
          <div key={item.id} className="db-recent-item">
            <div className="db-recent-thumb">{item.emoji}</div>
            <div className="db-recent-info">
              <div className="db-recent-name">{item.name}</div>
              <div className="db-recent-status">{item.status}</div>
            </div>
            <div className="db-recent-price">{formatPrice(item.price)}</div>
            <button
              className="db-btn-clean db-btn-clean-outline"
              style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem' }}
              onClick={() => handleCompare(item.productId)}
            >
              <Scale size={11} /> Compare
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
