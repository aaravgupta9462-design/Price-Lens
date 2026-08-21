import React from 'react';
import { Bookmark, Bell, Tag, IndianRupee, TrendingUp } from 'lucide-react';

const iconMap = {
  Bookmark: Bookmark,
  Bell: Bell,
  Tag: Tag,
  IndianRupee: IndianRupee,
};

const StatCard = ({ stat }) => {
  const IconComponent = iconMap[stat.icon] || Tag;

  return (
    <div className="db-stat-card">
      <div className={`db-stat-icon-box db-stat-icon-${stat.color}`}>
        <IconComponent size={22} strokeWidth={2.2} />
      </div>
      <div className="db-stat-info">
        <div className="db-stat-value">{stat.displayValue}</div>
        <div className="db-stat-label">{stat.label}</div>
        {stat.trend && (
          <div className="db-stat-trend">
            <TrendingUp size={12} />
            <span>{stat.trend}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
