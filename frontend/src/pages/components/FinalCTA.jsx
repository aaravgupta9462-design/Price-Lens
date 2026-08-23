import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const FinalCTA = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-700">
      <div className="max-w-4xl mx-auto text-center">
        {/* Heading */}
        <motion.h2
          className="text-4xl sm:text-5xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Before You Buy, Check Price Lens.
        </motion.h2>

        {/* Subheading */}
        <motion.p
          className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Compare smarter. Understand the price. Buy with confidence.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-bold text-lg inline-flex items-center gap-2 group shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Start Comparing <ArrowRight className="group-hover:translate-x-1 transition" />
        </motion.button>
      </div>
    </section>
  );
};
