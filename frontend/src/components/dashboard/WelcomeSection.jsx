import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { POPULAR_SEARCHES } from '../../data/mockData';

const WelcomeSection = ({ userName = 'Shopper' }) => {
  const { searchQuery, setSearchQuery, setSelectedProductId } = useDashboard();
  const [localInput, setLocalInput] = useState(searchQuery);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localInput);
  };

  const handleChipClick = (term) => {
    setLocalInput(term);
    setSearchQuery(term);
    if (term.toLowerCase().includes('iphone')) setSelectedProductId('iphone-16-128');
    else if (term.toLowerCase().includes('samsung')) setSelectedProductId('samsung-s25');
    else if (term.toLowerCase().includes('sony')) setSelectedProductId('sony-xm5');
  };

  return (
    <div className="db-welcome">
      <div className="db-welcome-orb-1" />
      <div className="db-welcome-orb-2" />

      <div className="db-welcome-body">
        <div className="db-welcome-greeting">
          <Sparkles size={16} />
          <span>Smart Shopping Intelligence</span>
        </div>

        <h1 className="db-welcome-heading">
          Welcome back, {userName}! 👋
        </h1>
        <p className="db-welcome-sub">
          Compare real-time prices across major shopping platforms, analyze review sentiment, and grab the best verified deals.
        </p>

        <form className="db-search-bar" onSubmit={handleSearchSubmit}>
          <div className="db-search-input-wrap">
            <span className="db-search-icon-pos">
              <Search size={20} />
            </span>
            <input
              type="text"
              className="db-search-input"
              placeholder="Search smartphones, headphones, laptops..."
              value={localInput}
              onChange={(e) => {
                setLocalInput(e.target.value);
                setSearchQuery(e.target.value);
              }}
            />
          </div>
          <button type="submit" className="db-search-submit">
            Compare Prices <ArrowRight size={16} />
          </button>
        </form>

        <div className="db-popular-wrap">
          <span className="db-popular-label">Trending:</span>
          {POPULAR_SEARCHES.map((term) => (
            <button
              key={term}
              type="button"
              className="db-popular-chip"
              onClick={() => handleChipClick(term)}
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
