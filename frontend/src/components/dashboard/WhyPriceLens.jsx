import React from 'react';
import { WHY_FEATURES } from '../../data/mockData';

const WhyPriceLens = () => {
  return (
    <section className="db-section" id="why-pricelens-section">
      <div className="db-section-header">
        <div>
          <h2 className="db-section-title">
            <span>✨</span> Why PriceLens?
          </h2>
          <p className="db-section-subtitle">
            Built to give shoppers complete transparency, fair pricing, and trustworthy product insights
          </p>
        </div>
      </div>

      <div className="db-why-grid">
        {WHY_FEATURES.map((feat) => (
          <div key={feat.id} className="db-why-card">
            <div className={`db-why-icon-box db-why-icon-${feat.iconColor}`}>
              {feat.icon}
            </div>
            <h3 className="db-why-title">{feat.title}</h3>
            <p className="db-why-desc">{feat.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyPriceLens;
