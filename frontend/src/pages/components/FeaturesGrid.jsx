import React from 'react';
import { TrendingDown, Bell, Eye, Lock, Gift, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';

export const FeaturesGrid = () => {
  const features = [
    {
      icon: TrendingDown,
      title: 'Price Comparison',
      description: 'Compare prices across stores in real-time.'
    },
    {
      icon: Lock,
      title: 'Price History',
      description: 'Understand historical pricing trends.'
    },
    {
      icon: Eye,
      title: 'Smart Deal Score',
      description: 'Know whether a deal is actually good.'
    },
    {
      icon: Bell,
      title: 'Price Alerts',
      description: 'Get notified when prices drop.'
    },
    {
      icon: Gift,
      title: 'Coupons & Offers',
      description: 'Discover available savings.'
    },
    {
      icon: Bookmark,
      title: 'Wishlist',
      description: 'Track products you want to buy later.'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Powerful Features.
          </h2>
          <p className="text-lg text-slate-600">
            Everything you need to shop smarter.
          </p>
        </div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition group cursor-pointer"
                variants={itemVariants}
                whileHover={{ y: -4 }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition">
                  <Icon className="text-blue-600" size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
