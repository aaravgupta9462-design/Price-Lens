import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, TrendingUp, Cpu, BarChart2 } from 'lucide-react';

export const PriceLens3D = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      className="relative hidden lg:flex items-center justify-center pointer-events-none select-none z-0"
      style={{ width: '380px', height: '440px' }}
    >
      {/* Subtle Ambient Glow behind Lens */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-amber-500/15 to-transparent rounded-full blur-3xl" />

      {/* Floating 3D Magnifying Glass Structure */}
      <motion.div
        animate={{ y: [0, -12, 0], rotateZ: [-1, 1.5, -1] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        className="relative flex flex-col items-center justify-center"
      >
        {/* Glass Lens Lens Container */}
        <div
          className="relative rounded-full flex items-center justify-center overflow-hidden"
          style={{
            width: '280px',
            height: '280px',
            background: 'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.12) 0%, rgba(15, 23, 42, 0.75) 80%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '8px solid transparent',
            backgroundImage: 'linear-gradient(135deg, rgba(254, 240, 138, 0.9) 0%, rgba(245, 158, 11, 0.8) 50%, rgba(180, 83, 9, 0.9) 100%)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6), inset 0 0 30px rgba(6, 182, 212, 0.25), 0 0 25px rgba(245, 158, 11, 0.35)'
          }}
        >
          {/* Glass Specular Reflection Highlight Curve */}
          <div className="absolute top-3 left-6 right-12 h-20 bg-gradient-to-b from-white/25 to-transparent rounded-t-full pointer-events-none transform -rotate-12 blur-[1px]" />

          {/* Subtle Cybernetic Blue Grid inside Lens */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(6, 182, 212, 0.3) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(6, 182, 212, 0.3) 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}
          />

          {/* Inside Lens: Futuristic Price Intelligence Analytics Visualization */}
          <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center w-full h-full">

            {/* AI Engine Status Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[10px] font-semibold tracking-wider text-cyan-300 uppercase shadow-sm mb-3">
              <Cpu size={11} className="text-cyan-400 animate-pulse" />
              <span>AI PRICE INTEL</span>
            </div>

            {/* Central ₹ Rupee Symbol & Shopping Cart Badge */}
            <div className="relative flex items-center justify-center my-1">
              <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 filter drop-shadow-[0_4px_12px_rgba(245,158,11,0.6)] tracking-tight">
                ₹
              </span>

              {/* Shopping Cart Glass Icon Floating Badge */}
              <motion.div
                animate={{ y: [-2, 3, -2], rotate: [-4, 4, -4] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                className="absolute -top-3 -right-8 p-2 rounded-xl bg-slate-900/80 border border-cyan-400/40 text-cyan-300 backdrop-blur-md shadow-lg"
              >
                <ShoppingCart size={16} />
              </motion.div>

              {/* Trending Up Icon Badge */}
              <motion.div
                animate={{ y: [3, -3, 3] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute -bottom-2 -left-8 p-2 rounded-xl bg-slate-900/80 border border-emerald-400/40 text-emerald-300 backdrop-blur-md shadow-lg"
              >
                <TrendingUp size={16} />
              </motion.div>
            </div>

            {/* Price Trend SVG Sparkline Graph */}
            <div className="w-full px-4 mt-2">
              <svg className="w-full h-10 overflow-visible" viewBox="0 0 160 40">
                <defs>
                  <linearGradient id="lensGraphGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area Fill */}
                <path
                  d="M0,35 Q30,10 60,25 T120,8 T160,18 L160,40 L0,40 Z"
                  fill="url(#lensGraphGrad)"
                />
                {/* Gradient Stroke Line */}
                <path
                  d="M0,35 Q30,10 60,25 T120,8 T160,18"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Glowing Data Dots */}
                <circle cx="60" cy="25" r="3.5" fill="#f59e0b" className="animate-ping" />
                <circle cx="60" cy="25" r="3.5" fill="#f59e0b" />
                <circle cx="120" cy="8" r="3.5" fill="#10b981" />
              </svg>
            </div>

            {/* Micro Bar Chart Visualization at bottom of Lens */}
            <div className="flex items-end justify-center gap-1.5 h-6 mt-2">
              <div className="w-1.5 h-3 rounded-full bg-cyan-500/60" />
              <div className="w-1.5 h-5 rounded-full bg-cyan-400/80" />
              <div className="w-1.5 h-4 rounded-full bg-amber-500/70" />
              <div className="w-1.5 h-6 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <div className="w-1.5 h-3.5 rounded-full bg-cyan-500/60" />
            </div>
          </div>
        </div>

        {/* 3D Dark Metallic Handle */}
        <div
          className="relative -mt-4 transform rotate-45 rounded-b-2xl"
          style={{
            width: '24px',
            height: '110px',
            background: 'linear-gradient(90deg, #0f172a 0%, #334155 40%, #1e293b 70%, #020617 100%)',
            boxShadow: '8px 12px 25px rgba(0, 0, 0, 0.7), inset -2px 0 6px rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Gold Metallic Connector Ring */}
          <div
            className="absolute top-0 left-0 right-0 h-4 rounded-t-sm"
            style={{
              background: 'linear-gradient(90deg, #b45309 0%, #fef08a 50%, #f59e0b 100%)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
            }}
          />
        </div>
      </motion.div>

      {/* Realistic Shadow on Floor */}
      <div className="absolute bottom-2 w-48 h-4 rounded-full bg-black/60 blur-md transform scale-x-125" />
    </motion.div>
  );
};
