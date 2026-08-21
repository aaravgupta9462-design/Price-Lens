import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export const TwinklingStars = () => {
  // Generate 75 stars with randomized positions, sizes, durations, and colors
  const stars = useMemo(() => {
    return Array.from({ length: 75 }).map((_, index) => {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const size = Math.random() * 2.5 + 1; // 1px to 3.5px
      const duration = Math.random() * 3 + 1.5; // 1.5s to 4.5s
      const delay = Math.random() * 3; // 0s to 3s
      const isCyan = index % 4 === 0;
      const isEmerald = index % 7 === 0;
      const color = isEmerald ? '#6ee7b7' : isCyan ? '#a5f3fc' : '#ffffff';

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
      {/* 75 Organic Twinkling Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ opacity: 0.2, scale: 0.8 }}
          animate={{
            opacity: [0.1, 1, 0.3, 0.95, 0.15],
            scale: [0.8, 1.25, 0.9, 1.15, 0.85]
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
            boxShadow: `0 0 6px ${star.color}`
          }}
        />
      ))}

      {/* Shooting Star 1 */}
      <motion.div
        initial={{ x: '-10%', y: '-10%', opacity: 0, scaleX: 0.5 }}
        animate={{
          x: ['-10%', '110%'],
          y: ['0%', '80%'],
          opacity: [0, 1, 1, 0],
          scaleX: [0.5, 2.5, 1, 0.2]
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          repeatDelay: 5,
          ease: 'easeOut'
        }}
        style={{
          position: 'absolute',
          top: '15%',
          left: '0%',
          width: '120px',
          height: '2px',
          background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(16,185,129,0.9) 50%, rgba(255,255,255,1) 100%)',
          borderRadius: '9999px',
          boxShadow: '0 0 10px rgba(16, 185, 129, 0.8)',
          transformOrigin: 'left center',
          rotate: '25deg'
        }}
      />

      {/* Shooting Star 2 */}
      <motion.div
        initial={{ x: '-10%', y: '-10%', opacity: 0, scaleX: 0.5 }}
        animate={{
          x: ['-10%', '110%'],
          y: ['10%', '90%'],
          opacity: [0, 1, 1, 0],
          scaleX: [0.5, 2.8, 1, 0.2]
        }}
        transition={{
          duration: 2.6,
          repeat: Infinity,
          repeatDelay: 8,
          delay: 3.5,
          ease: 'easeOut'
        }}
        style={{
          position: 'absolute',
          top: '5%',
          left: '20%',
          width: '140px',
          height: '2px',
          background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(6,182,212,0.9) 50%, rgba(255,255,255,1) 100%)',
          borderRadius: '9999px',
          boxShadow: '0 0 12px rgba(6, 182, 212, 0.8)',
          transformOrigin: 'left center',
          rotate: '30deg'
        }}
      />
    </div>
  );
};
