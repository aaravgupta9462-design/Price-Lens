import React from 'react';
import { Star, Scale, ExternalLink, Share2 } from 'lucide-react';
import { formatPrice, PLATFORM_COMPARISONS } from '../../data/mockData';
import { useDashboard } from '../../context/DashboardContext';

const ProductCard = ({ product }) => {
  const { setSelectedProductId, openShareModal } = useDashboard();

  const handleCompare = () => {
    setSelectedProductId(product.id);
    const compEl = document.getElementById('price-comparison-section');
    if (compEl) {
      compEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewProduct = () => {
    const platforms = PLATFORM_COMPARISONS[product.id] || [];
    const bestPlat = platforms.find((p) => p.isBestPrice) || platforms[0];
    const url = bestPlat ? bestPlat.url : 'https://www.flipkart.com';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = () => {
    const platforms = PLATFORM_COMPARISONS[product.id] || [];
    const bestPlat = platforms.find((p) => p.isBestPrice) || platforms[0];
    openShareModal({
      productName: product.name,
      platform: product.store,
      url: bestPlat ? bestPlat.url : 'https://www.pricelens.io',
    });
  };

  return (
    <div className="db-deal-card">
      <div className="db-deal-thumb" style={{ background: product.bgGradient }}>
        {product.isBestDeal && (
          <span className="db-deal-badge-best">Best Price</span>
        )}
        <span className="db-deal-badge-discount">{product.discount}% OFF</span>
        <span>{product.emoji}</span>
      </div>

      <div className="db-deal-store">Lowest on {product.store}</div>
      <h3 className="db-deal-name">{product.name}</h3>

      <div className="db-deal-meta">
        <Star size={13} fill="#F59E0B" color="#F59E0B" />
        <strong style={{ color: 'var(--db-text-main)' }}>{product.rating}</strong>
        <span>· {(product.reviewCount / 1000).toFixed(1)}k reviews</span>
      </div>

      <div className="db-deal-prices">
        <span className="db-deal-price-now">{formatPrice(product.currentPrice)}</span>
        <span className="db-deal-price-was">{formatPrice(product.originalPrice)}</span>
      </div>

      <div className="db-deal-movement">{product.priceMovement}</div>

      <div className="db-deal-actions">
        <button
          className="db-btn-clean db-btn-clean-primary"
          style={{ flex: 1 }}
          onClick={handleCompare}
        >
          <Scale size={13} /> Compare
        </button>
        <button
          className="db-btn-clean db-btn-clean-outline"
          onClick={handleViewProduct}
          title={`View product on ${product.store}`}
        >
          View <ExternalLink size={12} />
        </button>
        <button
          className="db-btn-clean db-btn-clean-icon"
          onClick={handleShare}
          title="Share product link"
          aria-label="Share product link"
        >
          <Share2 size={13} />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
