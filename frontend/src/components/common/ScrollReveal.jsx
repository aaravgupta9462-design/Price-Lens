import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable GPU-friendly scroll reveal wrapper for PriceLens sections.
 */
export const ScrollReveal = ({
  children,
  delay = 0,
  direction = 'up',
  distance = 28,
  className = '',
}) => {
  const initialOffset =
    direction === 'up'
      ? { y: distance, x: 0 }
      : direction === 'down'
      ? { y: -distance, x: 0 }
      : direction === 'left'
      ? { x: distance, y: 0 }
      : direction === 'right'
      ? { x: -distance, y: 0 }
      : { x: 0, y: 0 };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...initialOffset, scale: 0.985 }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
