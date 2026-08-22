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
      style={{ width: '400px', height: '460px' }}
    >
      {/* Subtle Ambient Lighting & Volumetric Glow behind Lens */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/15 via-amber-500/20 to-transparent rounded-full blur-3xl" />

      {/* Floating Realistic 3D Magnifying Glass */}
      <motion.div
        animate={{ y: [0, -14, 0], rotateZ: [-1, 2, -1] }}
        transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }}
        className="relative flex flex-col items-center justify-center"
      >
        {/* 3D Multi-Layered Metallic Outer Rim & Glass Lens */}
        <div
          className="relative rounded-full flex items-center justify-center"
          style={{
            width: '290px',
            height: '290px',
            padding: '12px',
            background: 'linear-gradient(135deg, #fef08a 0%, #f59e0b 20%, #78350f 40%, #fff 55%, #fef08a 70%, #d97706 85%, #451a03 100%)',
            borderRadius: '50%',
            boxShadow: `
              0 25px 50px rgba(0, 0, 0, 0.85),
              0 0 35px rgba(245, 158, 11, 0.35),
              0 0 25px rgba(6, 182, 212, 0.25),
              inset 0 4px 8px rgba(255, 255, 255, 0.6),
              inset 0 -6px 12px rgba(0, 0, 0, 0.9)
            `
          }}
        >
          {/* Inner Metallic Bevel Ring */}
          <div
            className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden"
            style={{
              background: 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.18) 0%, rgba(15, 23, 42, 0.65) 55%, rgba(2, 6, 23, 0.92) 90%)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '2px solid rgba(254, 240, 138, 0.45)',
              boxShadow: 'inset 0 0 25px rgba(0, 0, 0, 0.8), inset 0 0 15px rgba(6, 182, 212, 0.3)'
            }}
          >
            {/* Cinematic Glass Arc Glare Highlight */}
            <div className="absolute top-2 left-4 right-10 h-24 bg-gradient-to-b from-white/30 via-white/10 to-transparent rounded-t-full pointer-events-none transform -rotate-12 blur-[0.5px]" />
            <div className="absolute bottom-3 right-6 w-16 h-8 bg-gradient-to-t from-cyan-400/20 to-transparent rounded-b-full pointer-events-none transform rotate-45 blur-[1px]" />

            {/* Subtle Cybernetic Blue Grid Background inside Lens */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(6, 182, 212, 0.35) 1px, transparent 1px),
                                  linear-gradient(to bottom, rgba(6, 182, 212, 0.35) 1px, transparent 1px)`,
                backgroundSize: '24px 24px'
              }}
            />

            {/* Inside Lens: Futuristic Price Intelligence Analytics HUD */}
            <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center w-full h-full">

              {/* AI Engine Status Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/75 border border-cyan-500/40 text-[10px] font-bold tracking-wider text-cyan-300 uppercase shadow-md mb-2">
                <Cpu size={11} className="text-cyan-400 animate-pulse" />
                <span>AI PRICE INTEL</span>
              </div>

              {/* Central Metallic 3D ₹ Symbol & Shopping Cart Badge */}
              <div className="relative flex items-center justify-center my-1">
                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-400 to-amber-600 filter drop-shadow-[0_4px_16px_rgba(245,158,11,0.7)] tracking-tight">
                  ₹
                </span>

                {/* Shopping Cart Glass Icon Badge */}
                <motion.div
                  animate={{ y: [-2, 3, -2], rotate: [-4, 4, -4] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                  className="absolute -top-2 -right-9 p-2 rounded-xl bg-slate-900/85 border border-cyan-400/50 text-cyan-300 backdrop-blur-md shadow-xl"
                >
                  <ShoppingCart size={16} />
                </motion.div>

                {/* Trending Up Icon Badge */}
                <motion.div
                  animate={{ y: [3, -3, 3] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="absolute -bottom-2 -left-9 p-2 rounded-xl bg-slate-900/85 border border-emerald-400/50 text-emerald-300 backdrop-blur-md shadow-xl"
                >
                  <TrendingUp size={16} />
                </motion.div>
              </div>

              {/* Price Trend SVG Sparkline Graph */}
              <div className="w-full px-4 mt-2">
                <svg className="w-full h-10 overflow-visible" viewBox="0 0 160 40">
                  <defs>
                    <linearGradient id="lensGraphGrad3D" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Area Fill */}
                  <path
                    d="M0,35 Q30,10 60,25 T120,8 T160,18 L160,40 L0,40 Z"
                    fill="url(#lensGraphGrad3D)"
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

              {/* Gold & Cyan Micro Bar Chart Visualization at bottom */}
              <div className="flex items-end justify-center gap-1.5 h-6 mt-2">
                <div className="w-1.5 h-3 rounded-full bg-cyan-500/60" />
                <div className="w-1.5 h-5 rounded-full bg-cyan-400/80" />
                <div className="w-1.5 h-4 rounded-full bg-amber-500/80" />
                <div className="w-1.5 h-6 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.9)]" />
                <div className="w-1.5 h-3.5 rounded-full bg-cyan-500/60" />
              </div>
            </div>
          </div>
        </div>

        {/* 3D Dark Metallic Handle with Gold Metallic Ring Connector */}
        <div className="relative -mt-6 flex flex-col items-center transform rotate-45">
          {/* Gold Metallic Joint Connector Ring */}
          <div
            className="w-8 h-5 rounded-t-md relative z-10"
            style={{
              background: 'linear-gradient(90deg, #78350f 0%, #fef08a 40%, #f59e0b 70%, #451a03 100%)',
              boxShadow: '0 3px 8px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.6)'
            }}
          />

          {/* 3D Cylindrical Dark Metallic Handle Body */}
          <div
            className="rounded-b-2xl relative"
            style={{
              width: '26px',
              height: '115px',
              background: 'linear-gradient(90deg, #020617 0%, #1e293b 25%, #475569 50%, #1e293b 75%, #0f172a 100%)',
              boxShadow: `
                10px 15px 30px rgba(0, 0, 0, 0.85),
                inset -3px 0 6px rgba(255, 255, 255, 0.2),
                inset 3px 0 6px rgba(0, 0, 0, 0.8)
              `,
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}
          >
            {/* Metallic Grip Rings */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-amber-500/40" />
            <div className="absolute top-10 left-0 right-0 h-1 bg-amber-500/40" />
            <div className="absolute bottom-6 left-0 right-0 h-2 rounded-b-xl bg-gradient-to-r from-amber-700 via-amber-400 to-amber-800" />
          </div>
        </div>
      </motion.div>

      {/* Realistic Shadow on Floor */}
      <div className="absolute bottom-2 w-52 h-4 rounded-full bg-black/75 blur-md transform scale-x-125" />
    </motion.div>
  );
};
