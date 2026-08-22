import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Eye, Sparkles } from 'lucide-react';

export const Interactive3DCharacter = ({ isEmailFocused, isPasswordFocused }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative bg-transparent pointer-events-none select-none">
      {/* Floating 3D Character Illustration */}
      <motion.div
        animate={
          isPasswordFocused
            ? { y: [ -5, 5, -5 ], scale: 0.96, rotate: -3 }
            : isEmailFocused
            ? { y: [ -12, 12, -12 ], scale: 1.03, rotate: 2 }
            : { y: [ -15, 15, -15 ] }
        }
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: 'easeInOut'
        }}
        className="relative flex items-center justify-center"
      >
        {/* Soft Ambient Radial Glow Behind 3D Character */}
        <div className="absolute w-72 h-72 bg-gradient-to-tr from-amber-500/20 via-cyan-500/20 to-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* 3D Character Image */}
        <img
          src="https://cdn3d.iconscout.com/3d/premium/thumb/boy-working-on-laptop-4556488-3783777.png"
          alt="3D AI Assistant"
          className="w-full max-w-lg object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.7)] pointer-events-none select-none"
        />
      </motion.div>

      {/* Floating Interactive Badge (Naked & Transparent) */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
        className="mt-2 px-4 py-2 rounded-full bg-black/60 border border-amber-500/30 backdrop-blur-md text-xs font-medium text-amber-300 flex items-center gap-2 shadow-xl pointer-events-auto"
      >
        {isPasswordFocused ? (
          <>
            <ShieldCheck size={14} className="text-rose-400 animate-pulse" />
            <span className="text-rose-300 font-semibold">Security Mode Activated 🔒</span>
          </>
        ) : isEmailFocused ? (
          <>
            <Eye size={14} className="text-cyan-400 animate-bounce" />
            <span className="text-cyan-300 font-semibold">Attentive Mode 👀</span>
          </>
        ) : (
          <>
            <Sparkles size={14} className="text-amber-400" />
            <span>PriceLens 3D AI Assistant ✨</span>
          </>
        )}
      </motion.div>
    </div>
  );
};
