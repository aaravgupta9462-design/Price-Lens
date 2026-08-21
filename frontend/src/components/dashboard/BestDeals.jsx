import React from 'react';
import { PRODUCTS } from '../../data/mockData';
import { useDashboard } from '../../context/DashboardContext';
import ProductCard from './ProductCard';
import EmptyState from './EmptyState';

const BestDeals = () => {
  const { searchQuery, setSearchQuery } = useDashboard();

  const filteredProducts = PRODUCTS.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  return (
    <section id="best-deals-section">
      <div className="db-section-head">
        <div>
          <h2 className="db-section-title-clean">Today's Best Deals</h2>
          <p className="db-section-subtitle-clean">
            Verified price drops and maximum discounts across certified stores
          </p>
        </div>
        {searchQuery && (
          <button
            className="db-btn-clean db-btn-clean-outline"
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
            onClick={() => setSearchQuery('')}
          >
            Clear Filter
          </button>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <EmptyState
          title={`No deals found for "${searchQuery}"`}
          message="Try searching for iPhone, MacBook, Samsung, or Sony."
          onReset={() => setSearchQuery('')}
        />
      ) : (
        <div className="db-deals-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default BestDeals;
