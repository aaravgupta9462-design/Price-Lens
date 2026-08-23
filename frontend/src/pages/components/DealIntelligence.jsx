import React from 'react';
import { TrendingDown, Zap, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, content }) => (
  <motion.div
    className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition"
    whileHover={{ y: -4 }}
  >
    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
      <Icon className="text-blue-600" size={24} />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 mb-4">{description}</p>
    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
      {content}
    </div>
  </motion.div>
);

export const DealIntelligence = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Know If It's Actually a Deal.
          </h2>
          <p className="text-lg text-slate-600">
            Price Lens does more than compare prices. We analyze trends, history, and market data to tell you if today's price is worth buying.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={Activity}
            title="Price History"
            description="See how the price has changed over time."
            content={
              <div className="h-24 flex items-end gap-1">
                {[12, 18, 15, 22, 19, 25, 20].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t opacity-70 hover:opacity-100 transition"
                    style={{ height: `${height * 2}px` }}
                  />
                ))}
              </div>
            }
          />

          <FeatureCard
            icon={Zap}
            title="Deal Score"
            description="Understand whether today's price is worth buying."
            content={
              <div className="text-center">
                <div className="text-4xl font-bold text-slate-900 mb-2">92/100</div>
                <div className="text-lg font-bold text-green-600">Excellent Deal</div>
              </div>
            }
          />

          <FeatureCard
            icon={TrendingDown}
            title="Price Drop"
            description="Know when a product becomes cheaper."
            content={
              <div className="text-center">
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <TrendingDown className="text-green-600" size={24} />
                  <div className="text-3xl font-bold text-green-600">₹800</div>
                </div>
                <div className="text-sm text-slate-600">price drop today</div>
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
};
