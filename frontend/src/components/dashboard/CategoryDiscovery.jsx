import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Laptop, Headphones, Watch, Home, ArrowUpRight } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

const CATEGORIES_DATA = [
  {
    id: 'Mobiles',
    name: 'Smartphones & Flagships',
    count: '1,420 Tracked',
    avgSaving: 'Avg. Save ₹3,400',
    icon: Smartphone,
    popular: 'iPhone 16, Galaxy S25, OnePlus 13',
    gradient: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
    accentColor: '#6842FF',
  },
  {
    id: 'Laptops',
    name: 'Laptops & MacBooks',
    count: '890 Tracked',
    avgSaving: 'Avg. Save ₹8,200',
    icon: Laptop,
    popular: 'MacBook Air M3, ASUS TUF, Dell XPS',
    gradient: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
    accentColor: '#3478F6',
  },
  {
    id: 'Audio',
    name: 'Headphones & Audio',
    count: '1,150 Tracked',
    avgSaving: 'Avg. Save ₹1,950',
    icon: Headphones,
    popular: 'Sony XM5, AirPods Pro 2, Bose QC',
    gradient: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
    accentColor: '#119B67',
  },
  {
    id: 'Wearables',
    name: 'Smartwatches & Fitness',
    count: '760 Tracked',
    avgSaving: 'Avg. Save ₹1,200',
    icon: Watch,
    popular: 'Apple Watch S10, Galaxy Watch, boAt',
    gradient: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
    accentColor: '#EA580C',
  },
  {
    id: 'Home Appliances',
    name: 'Smart Home & Tech',
    count: '980 Tracked',
    avgSaving: 'Avg. Save ₹4,500',
    icon: Home,
    popular: 'Dyson Vacuums, Robot Mops, Air Purifiers',
    gradient: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)',
    accentColor: '#9333EA',
  },
];

export const CategoryDiscovery = () => {
  const { setActiveNav, setSearchQuery } = useDashboard();

  const handleCategoryClick = (category) => {
    setSearchQuery(category.id);
    setActiveNav('search');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  return (
    <section className="pl-category-section" aria-label="Category Discovery">
      <div className="pl-category-container">
        <div className="pl-section-header-row">
          <div className="pl-section-title-col">
            <span className="pl-section-eyebrow">MARKET TAXONOMY</span>
            <h2 className="pl-section-title">Explore by tech category</h2>
            <p className="pl-section-subtitle">
              Continuous price surveillance across 5,000+ top electronics & gadgets in India
            </p>
          </div>
        </div>

        <div className="pl-category-grid">
          {CATEGORIES_DATA.map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pl-category-card"
                onClick={() => handleCategoryClick(cat)}
              >
                <div
                  className="pl-category-icon-box"
                  style={{ background: cat.gradient, color: cat.accentColor }}
                >
                  <IconComponent size={22} />
                </div>

                <div className="pl-category-body">
                  <div className="pl-category-header-line">
                    <h3 className="pl-category-name">{cat.name}</h3>
                    <ArrowUpRight size={16} className="pl-category-arrow" />
                  </div>
                  <span className="pl-category-count">{cat.count}</span>
                  <p className="pl-category-popular">{cat.popular}</p>
                </div>

                <div className="pl-category-footer">
                  <span className="pl-category-saving-pill">{cat.avgSaving}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryDiscovery;
