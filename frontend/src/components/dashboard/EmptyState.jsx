import React from 'react';

const EmptyState = ({ title = 'No results found', message = 'Try adjusting your search or filter keywords.', onReset }) => {
  return (
    <div className="db-empty-state">
      <div className="db-empty-emoji">🔍</div>
      <div className="db-empty-title">{title}</div>
      <div className="db-empty-sub">{message}</div>
      {onReset && (
        <button className="db-btn db-btn-outline" onClick={onReset} style={{ marginTop: '0.75rem' }}>
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;
