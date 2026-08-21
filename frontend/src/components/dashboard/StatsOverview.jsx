import React from 'react';
import { Bookmark, Bell, Tag, IndianRupee } from 'lucide-react';
import { STATS } from '../../data/mockData';

const iconMap = {
  Bookmark,
  Bell,
  Tag,
  IndianRupee,
};

const StatsOverview = () => {
  return (
    <div className="db-stats-row">
      {STATS.map((stat) => {
        const IconComponent = iconMap[stat.icon] || Tag;
        return (
          <div key={stat.id} className="db-stat-box">
            <div className="db-stat-top">
              <span className="db-stat-label-clean">{stat.label}</span>
              <div className={`db-stat-mini-icon db-stat-mini-${stat.accent}`}>
                <IconComponent size={14} />
              </div>
            </div>
            <div className="db-stat-number">{stat.displayValue}</div>
            <div className="db-stat-support">{stat.supporting}</div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsOverview;
