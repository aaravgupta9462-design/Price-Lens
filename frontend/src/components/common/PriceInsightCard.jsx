import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, Award, Wallet } from 'lucide-react';

export const PriceInsightCard = ({
  title,
  value,
  subtitle,
  type = 'drop',
  delay = 0,
  floatDuration = 5.0,
  floatY = [0, -8, 0],
  floatRotate = [0, 0.5, 0],
  floatDelay = 0
}) => {
  // Theme color maps for fintech aesthetics
  const themes = {
    drop: {
      badgeBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
      valueColor: 'text-emerald-400',
      glow: 'shadow-emerald-500/10 hover:border-emerald-500/40',
      icon: TrendingDown
    },
    best: {
      badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
      valueColor: 'text-amber-300',
      glow: 'shadow-amber-500/10 hover:border-amber-500/40',
      icon: Award
    },
    save: {
      badgeBg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
      valueColor: 'text-cyan-300',
      glow: 'shadow-cyan-500/10 hover:border-cyan-500/40',
      icon: Wallet
    }
  };

  const activeTheme = themes[type] || themes.drop;
  const IconComponent = activeTheme.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.9 }}
      animate={{
        opacity: 1,
        x: 0,
        scale: 1,
        y: floatY,
        rotateZ: floatRotate
      }}
      transition={{
        opacity: { duration: 0.5, ease: 'easeOut', delay },
        x: { duration: 0.5, ease: 'easeOut', delay },
        scale: { duration: 0.5, ease: 'easeOut', delay },
        y: { repeat: Infinity, duration: floatDuration, delay: floatDelay, ease: 'easeInOut' },
        rotateZ: { repeat: Infinity, duration: floatDuration, delay: floatDelay, ease: 'easeInOut' }
      }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      className={`w-full max-w-[260px] backdrop-blur-xl bg-slate-900/60 border border-white/15 rounded-xl p-4 shadow-xl transition-all duration-300 ${activeTheme.glow} relative overflow-hidden group`}
    >
      {/* Subtle Specular Top Highlight Beam */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
            {title}
          </span>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-black tracking-tight ${activeTheme.valueColor} drop-shadow-sm`}>
              {value}
            </span>
          </div>
          {subtitle && (
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Dynamic Glass Icon Badge */}
        <div className={`p-2.5 rounded-xl border backdrop-blur-md ${activeTheme.badgeBg} shadow-md group-hover:scale-110 transition-transform`}>
          <IconComponent size={20} />
        </div>
      </div>
    </motion.div>
  );
};
