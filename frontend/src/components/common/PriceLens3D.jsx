import React from 'react';
import { motion } from 'framer-motion';

export const PriceLens3D = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      className="relative hidden lg:flex items-center justify-center pointer-events-none select-none z-0"
      style={{ width: '420px', height: '460px' }}
    >
      {/* Volumetric Blue & Gold Glow behind 3D Lens */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-amber-500/25 to-transparent rounded-full blur-3xl" />

      {/* Floating Realistic 3D Cinematic Render Magnifying Glass */}
      <motion.div
        animate={{ y: [0, -12, 0], rotateZ: [-1, 1.5, -1] }}
        transition={{ repeat: Infinity, duration: 5.5, delay: 0.2, ease: 'easeInOut' }}
        className="relative flex flex-col items-center justify-center"
      >
        <img
          src="/lens-3d.jpg"
          alt="3D Price Lens Analytics"
          className="w-[360px] h-[360px] object-contain rounded-full filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.85)] drop-shadow-[0_0_35px_rgba(245,158,11,0.3)] transition-transform"
        />
      </motion.div>

      {/* Realistic Shadow on Floor dynamically reacting to float */}
      <motion.div
        animate={{ scaleX: [1.2, 1.0, 1.2], opacity: [0.8, 0.5, 0.8] }}
        transition={{ repeat: Infinity, duration: 5.5, delay: 0.2, ease: 'easeInOut' }}
        className="absolute bottom-2 w-56 h-4 rounded-full bg-black/80 blur-md"
      />
    </motion.div>
  );
};
