import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export const TwinklingStars = () => {
  // Generate 85 stationary twinkling stars with randomized positions, sizes, durations, and delays
  const stars = useMemo(() => {
    return Array.from({ length: 85 }).map((_, index) => {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const size = Math.random() * 2.2 + 1; // 1px to 3.2px
      const duration = Math.random() * 3 + 2; // 2s to 5s
      const delay = Math.random() * 4; // 0s to 4s
      const isCyan = index % 4 === 0;
      const color = isCyan ? '#a5f3fc' : '#ffffff';

      return {
        id: index,
        top: `${top}%`,
        left: `${left}%`,
        size,
        duration,
        delay,
        color
      };
    });
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden'
      }}
    >
      {/* 85 Pure Stationary Twinkling Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ opacity: 0.2, scale: 0.85 }}
          animate={{
            opacity: [0.2, 1, 0.35, 0.9, 0.2],
            scale: [0.85, 1.2, 0.9, 1.1, 0.85]
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut'
          }}
          style={{
            position: 'absolute',
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            borderRadius: '50%',
            backgroundColor: star.color,
            boxShadow: `0 0 4px ${star.color}`
          }}
        />
      ))}
    </div>
  );
};
