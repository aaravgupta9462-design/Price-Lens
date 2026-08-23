import React from 'react';
import { motion } from 'framer-motion';

export const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Search',
      description: 'Find the product you\'re interested in.'
    },
    {
      number: '02',
      title: 'Compare',
      description: 'See prices across multiple stores.'
    },
    {
      number: '03',
      title: 'Understand',
      description: 'Check price history and deal score.'
    },
    {
      number: '04',
      title: 'Save',
      description: 'Buy confidently when the price is right.'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Smarter Shopping in 4 Steps.
          </h2>
          <p className="text-lg text-slate-600">
            Get the best deals with our simple, intuitive process.
          </p>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden md:block">
          <motion.div
            className="grid grid-cols-4 gap-4 relative"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Connecting Line */}
            <div className="absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-600 to-slate-200 pointer-events-none" />

            {steps.map((step, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <div className="relative">
                  {/* Circle */}
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg relative z-10">
                    {step.number}
                  </div>
                  
                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-600 text-sm">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mobile Timeline */}
        <motion.div
          className="md:hidden space-y-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, idx) => (
            <motion.div key={idx} variants={itemVariants} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {step.number}
                </div>
              </div>
              <div className="pt-2">
                <h3 className="text-lg font-bold text-slate-900 mb-1">{step.title}</h3>
                <p className="text-slate-600 text-sm">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
