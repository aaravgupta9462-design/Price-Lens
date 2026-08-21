import React from 'react';
import { ArrowDownRight, ArrowUpRight, Trash2, Scale, ExternalLink, Heart, Plus } from 'lucide-react';
import { formatPrice } from '../../../data/mockData';
import { useDashboard } from '../../../context/DashboardContext';
import EmptyState from '../EmptyState';

const WishlistScreen = () => {
  const {
    savedProducts,
    removeSavedProduct,
    viewPriceComparison,
    viewProductDetail,
    setActiveNav,
  } = useDashboard();

  return (
    <div className="db-page-fade">
      <div className="db-screen-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="db-screen-title">Saved Products</h1>
          <p className="db-screen-subtitle">
            Products you want to keep an eye on. Price drop alerts are tracked automatically.
          </p>
        </div>
        <button
          className="db-btn-clean db-btn-clean-primary"
          onClick={() => setActiveNav('search')}
        >
          <Plus size={14} /> Add Products
        </button>
      </div>

      {savedProducts.length === 0 ? (
        <EmptyState
          title="Your saved products list is empty"
          message="Keep track of products you care about and get notified when prices drop."
          onReset={() => setActiveNav('search')}
        />
      ) : (
        <div className="db-wishlist-grid">
          {savedProducts.map((item) => (
            <div key={item.id} className="db-card db-card-primary" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                  <div className="db-saved-thumb" style={{ width: '48px', height: '48px', fontSize: '1.5rem' }}>
                    {item.emoji}
                  </div>
                  <div>
                    <h3
                      className="db-deal-name"
                      style={{ cursor: 'pointer', fontSize: '0.95rem' }}
                      onClick={() => viewProductDetail(item.productId)}
                    >
                      {item.name}
                    </h3>
                    <span className="db-deal-store">Lowest on {item.store}</span>
                  </div>
                </div>

                <button
                  className="db-btn-clean db-btn-clean-icon"
                  style={{ color: '#EF4444', borderColor: '#FEE2E2' }}
                  onClick={() => removeSavedProduct(item.id)}
                  title="Remove from saved products"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <div className="db-saved-price-box">
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--db-text-muted)', display: 'block' }}>Current Best Price</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--db-text-main)' }}>
                    {formatPrice(item.currentPrice)}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--db-text-muted)', display: 'block' }}>Price Movement</span>
                  {item.isDrop ? (
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#16A34A', display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'flex-end' }}>
                      <ArrowDownRight size={14} /> {item.priceChange}
                    </span>
                  ) : item.priceChange?.includes('↑') ? (
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#DC2626', display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'flex-end' }}>
                      <ArrowUpRight size={14} /> {item.priceChange}
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--db-text-muted)' }}>Steady</span>
                  )}
                </div>
              </div>

              <div className="db-deal-actions" style={{ marginTop: '1rem', paddingTop: '0.85rem' }}>
                <button
                  className="db-btn-clean db-btn-clean-primary"
                  style={{ flex: 1 }}
                  onClick={() => viewPriceComparison(item.productId)}
                >
                  <Scale size={13} /> Compare Stores
                </button>
                <button
                  className="db-btn-clean db-btn-clean-outline"
                  onClick={() => viewProductDetail(item.productId)}
                >
                  View Details <ExternalLink size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistScreen;
