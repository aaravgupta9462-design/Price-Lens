import React from 'react';
import { motion } from 'framer-motion';

export const TrustSection = () => {
  const stats = [
    {
      label: 'Products Tracked',
      value: '50K+',
      icon: '📦'
    },
    {
      label: 'Stores Compared',
      value: '10+',
      icon: '🏪'
    },
    {
      label: 'Potential Savings',
      value: '₹XX Lakhs',
      icon: '💰'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Your Shopping Decisions, Backed by Data.
          </h2>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            *Placeholder metrics for demo purposes. Real statistics will reflect actual platform data.
          </p>
        </div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              className="text-center p-6 sm:p-8 rounded-xl border border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50 transition"
              variants={itemVariants}
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-4xl sm:text-5xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <p className="text-slate-600 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
