import React from 'react';

/**
 * Authentic vector store badge & logo component
 * Supports: 'amazon', 'flipkart', 'croma', 'reliancedigital'
 */
export const StoreLogo = ({ store, size = 'md', showName = true }) => {
  const norm = String(store || '').toLowerCase().replace(/[\s_]/g, '');

  if (norm.includes('amazon')) {
    return (
      <div className={`pl-store-pill pl-store-amazon size-${size}`}>
        <span className="pl-store-icon-amazon">a</span>
        {showName && <span className="pl-store-text">Amazon</span>}
      </div>
    );
  }

  if (norm.includes('flipkart')) {
    return (
      <div className={`pl-store-pill pl-store-flipkart size-${size}`}>
        <span className="pl-store-icon-flipkart">🛍️</span>
        {showName && <span className="pl-store-text">Flipkart</span>}
      </div>
    );
  }

  if (norm.includes('croma')) {
    return (
      <div className={`pl-store-pill pl-store-croma size-${size}`}>
        <span className="pl-store-icon-croma">croma</span>
      </div>
    );
  }

  if (norm.includes('reliance')) {
    return (
      <div className={`pl-store-pill pl-store-reliance size-${size}`}>
        <span className="pl-store-icon-reliance">Reliance Digital</span>
      </div>
    );
  }

  if (norm.includes('tatacliq')) {
    return (
      <div className={`pl-store-pill pl-store-tatacliq size-${size}`}>
        <span className="pl-store-icon-tatacliq">TATA CLiQ</span>
      </div>
    );
  }

  if (norm.includes('vijaysales') || norm.includes('Vijay')) {
    return (
      <div className={`pl-store-pill pl-store-vijaysales size-${size}`}>
        <span className="pl-store-icon-vijaysales">VIJAY SALES</span>
      </div>
    );
  }

  return (
    <div className={`pl-store-pill pl-store-default size-${size}`}>
      <span className="pl-store-text">{store}</span>
    </div>
  );
};

export default StoreLogo;
