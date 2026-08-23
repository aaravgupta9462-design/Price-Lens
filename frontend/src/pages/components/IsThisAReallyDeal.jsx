import React from 'react';
import { motion } from 'framer-motion';

export const IsThisAReallyDeal = () => {
  const chartData = [
    { day: 1, price: 52000 },
    { day: 5, price: 51500 },
    { day: 10, price: 53200 },
    { day: 15, price: 52800 },
    { day: 20, price: 51000 },
    { day: 25, price: 49999 },
    { day: 30, price: 49500 },
  ];

  const minPrice = Math.min(...chartData.map(d => d.price));
  const maxPrice = Math.max(...chartData.map(d => d.price));
  const range = maxPrice - minPrice;

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Is <span className="text-blue-600 font-mono">₹49,999</span> Actually a Good Price?
          </h2>
        </div>

        {/* Analytics Card */}
        <motion.div
          className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-1 bg-slate-50">
            {[
              { label: 'Current Price', value: '₹49,999', color: 'bg-blue-50' },
              { label: '30-Day Avg', value: '₹53,499', color: 'bg-slate-50' },
              { label: 'Lowest Price', value: '₹47,999', color: 'bg-slate-50' },
              { label: 'Deal Score', value: '87/100', color: 'bg-green-50' },
            ].map((stat, idx) => (
              <div key={idx} className={`${stat.color} p-6 border-r border-b border-slate-200 ${idx === 3 ? 'border-r-0' : ''} ${idx >= 2 ? 'sm:border-r' : ''}`}>
                <div className="text-xs font-medium text-slate-500 mb-1">{stat.label}</div>
                <div className={`text-2xl font-bold ${stat.label === 'Deal Score' ? 'text-green-600' : 'text-slate-900'}`}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="p-6 sm:p-8 border-t border-slate-200">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-900 mb-4">30-Day Price Trend</h3>
              <div className="flex items-end gap-2 h-40 bg-slate-50 p-4 rounded-lg">
                {chartData.map((point, idx) => {
                  const normalizedPrice = (point.price - minPrice) / range;
                  const isCurrentPrice = idx === chartData.length - 1;
                  
                  return (
                    <motion.div
                      key={idx}
                      className={`flex-1 rounded-t ${isCurrentPrice ? 'bg-blue-600' : 'bg-slate-300'} cursor-pointer hover:opacity-80 transition relative group`}
                      style={{ height: `${30 + normalizedPrice * 70}%` }}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${30 + normalizedPrice * 70}%` }}
                      transition={{ delay: idx * 0.05, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                        ₹{point.price}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>30 days ago</span>
                <span>Today</span>
              </div>
            </div>

            {/* Insight */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="text-sm font-bold text-green-900 mb-1">✓ Smart Insight</div>
              <p className="text-sm text-green-800">
                Today's price is <strong>6.5% below</strong> the 30-day average. This is an <strong>excellent time to buy</strong>. Historically, this product tends to maintain this price through the month.
              </p>
            </div>

            {/* CTA */}
            <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold">
              Check a Product
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
