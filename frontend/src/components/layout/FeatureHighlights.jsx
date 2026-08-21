import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, MessageSquareQuote, ShieldCheck, Sparkles } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -30, rotateY: -10 },
  visible: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
};

export const FeatureHighlights = () => {
  return (
    <motion.div
      className="showcase-panel"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Capsule Tag Badge */}
      <motion.div className="showcase-badge" variants={itemVariants}>
        <Sparkles size={14} />
        <span>✦ Next-Gen Shopping Intelligence</span>
      </motion.div>

      {/* Main Title */}
      <motion.h1 className="showcase-title" variants={itemVariants}>
        Buy Smarter with <span>AI-Driven Insights</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p className="showcase-desc" variants={itemVariants}>
        PriceLens aggregates real-time prices across major online stores and analyzes thousands of customer reviews to give you instant, trustworthy purchase recommendations.
      </motion.p>

      {/* 3 Feature Cards */}
      <div className="features-list">
        <motion.div
          className="feature-item-card"
          variants={itemVariants}
          whileHover={{ scale: 1.02, x: 6, transition: { duration: 0.2 } }}
        >
          <div className="feature-icon-box feature-icon-emerald">
            <TrendingDown size={22} />
          </div>
          <div>
            <h3 className="feature-text-h">Real-Time Price Comparison</h3>
            <p className="feature-text-p">
              Track historical price drops and find the absolute lowest price across verified sellers.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="feature-item-card"
          variants={itemVariants}
          whileHover={{ scale: 1.02, x: 6, transition: { duration: 0.2 } }}
        >
          <div className="feature-icon-box feature-icon-cyan">
            <MessageSquareQuote size={22} />
          </div>
          <div>
            <h3 className="feature-text-h">AI Sentiment & Review Summary</h3>
            <p className="feature-text-p">
              Skip endless reading. AI summarizes pros, cons, and genuine buyer sentiment in seconds.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="feature-item-card"
          variants={itemVariants}
          whileHover={{ scale: 1.02, x: 6, transition: { duration: 0.2 } }}
        >
          <div className="feature-icon-box feature-icon-indigo">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h3 className="feature-text-h">Fake Review Protection</h3>
            <p className="feature-text-p">
              Advanced algorithms filter out bot-generated and incentivized seller reviews.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
