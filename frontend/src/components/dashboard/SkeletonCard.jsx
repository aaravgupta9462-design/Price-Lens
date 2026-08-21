import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="db-skeleton-card">
      <div className="db-skeleton-pulse" style={{ height: '140px', width: '100%', marginBottom: '1rem' }} />
      <div className="db-skeleton-pulse" style={{ height: '14px', width: '35%', marginBottom: '0.5rem' }} />
      <div className="db-skeleton-pulse" style={{ height: '18px', width: '80%', marginBottom: '0.75rem' }} />
      <div className="db-skeleton-pulse" style={{ height: '14px', width: '50%', marginBottom: '1rem' }} />
      <div className="db-skeleton-pulse" style={{ height: '36px', width: '100%' }} />
    </div>
  );
};

export default SkeletonCard;
