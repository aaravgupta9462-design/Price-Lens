import React from 'react';
import { ArrowDownRight, ArrowUpRight, Bookmark, ArrowRight } from 'lucide-react';
import { formatPrice } from '../../data/mockData';
import { useDashboard } from '../../context/DashboardContext';

const SavedProducts = () => {
  const { savedProducts, viewProductDetail, setActiveNav } = useDashboard();

  return (
    <div className="db-card db-card-primary">
      <div className="db-card-header-clean">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bookmark size={18} style={{ color: '#2563EB' }} />
          <h3 className="db-card-title-sm">Saved for Later</h3>
        </div>
        <button
          className="db-badge-soft-blue"
          style={{ border: 'none', cursor: 'pointer' }}
          onClick={() => setActiveNav('wishlist')}
        >
          {savedProducts.length} items →
        </button>
      </div>

      <div className="db-saved-list">
        {savedProducts.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="db-saved-row"
            onClick={() => viewProductDetail(item.productId)}
            title="Click to view details"
          >
            <div className="db-saved-thumb">{item.emoji}</div>
            <div className="db-saved-info">
              <div className="db-saved-name">{item.name}</div>
              <div className="db-saved-store">Lowest on {item.store}</div>
            </div>
            <div className="db-saved-price-col">
              <div className="db-saved-price">{formatPrice(item.currentPrice)}</div>
              {item.isDrop ? (
                <div className="db-saved-drop">
                  <ArrowDownRight size={12} /> {item.priceChange}
                </div>
              ) : item.priceChange?.includes('↑') ? (
                <div style={{ fontSize: '0.72rem', color: '#DC2626', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <ArrowUpRight size={12} /> {item.priceChange}
                </div>
              ) : (
                <div className="db-saved-stable">Steady</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedProducts;
