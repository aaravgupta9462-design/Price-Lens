import React, { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Eye, EyeOff, Sparkles } from 'lucide-react';

// Lazy load Spline component to ensure smooth web app loading
const Spline = lazy(() => import('@splinetool/react-spline'));

export const Interactive3DCharacter = ({ isEmailFocused, isPasswordFocused, isTyping }) => {
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);

  return (
    <div className="w-full flex flex-col items-center justify-center relative">
      {/* Dynamic 3D Interactive Mascot Area */}
      <div className="relative w-full h-[320px] flex items-center justify-center overflow-hidden">
        
        {/* Spline 3D Scene Container */}
        {!splineError && (
          <Suspense
            fallback={
              <div className="absolute inset-0 flex items-center justify-center text-white/50 text-xs">
                <div className="w-6 h-6 border-2 border-amber-400/40 border-t-amber-400 rounded-full animate-spin mr-2" />
                Loading 3D Character Scene...
              </div>
            }
          >
            <div className={`w-full h-full transition-opacity duration-500 ${splineLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <Spline
                scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
                onLoad={() => setSplineLoaded(true)}
                onError={() => setSplineError(true)}
              />
            </div>
          </Suspense>
        )}

        {/* Interactive 3D Mascot Fallback (Active when Spline loads or as dynamic overlay) */}
        {(!splineLoaded || splineError) && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative flex flex-col items-center justify-center"
          >
            {/* Ambient Glowing Aura Orbs behind mascot */}
            <div className="absolute w-48 h-48 bg-amber-500/20 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute w-40 h-40 bg-cyan-500/20 rounded-full blur-2xl -z-10" />

            {/* 3D Mascot Sphere Head */}
            <motion.div
              animate={
                isPasswordFocused
                  ? { rotateX: 18, rotateY: 0, y: 6 }
                  : isEmailFocused
                  ? { rotateX: -10, rotateY: 15, y: -4 }
                  : { rotateX: [0, -5, 5, 0], y: [0, -6, 0] }
              }
              transition={
                isPasswordFocused || isEmailFocused
                  ? { type: 'spring', stiffness: 260, damping: 20 }
                  : { repeat: Infinity, duration: 4, ease: 'easeInOut' }
              }
              style={{ transformStyle: 'preserve-3d', perspective: 800 }}
              className="w-36 h-36 rounded-full bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 border-2 border-amber-400/40 shadow-[0_0_35px_rgba(245,158,11,0.35)] relative flex items-center justify-center p-4"
            >
              {/* Gold Metallic Head Band Rim */}
              <div className="absolute inset-2 rounded-full border border-amber-400/20 pointer-events-none" />

              {/* Eyes Container */}
              <div className="flex items-center gap-6 relative z-10">
                {/* Left Eye */}
                <motion.div
                  animate={
                    isPasswordFocused
                      ? { scaleY: 0.1 }
                      : isTyping
                      ? { scale: [1, 1.2, 1] }
                      : { scale: 1 }
                  }
                  className="w-7 h-7 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] flex items-center justify-center relative"
                >
                  <motion.div
                    animate={
                      isEmailFocused ? { x: 3, y: 2 } : { x: 0, y: 0 }
                    }
                    className="w-3 h-3 rounded-full bg-slate-950"
                  />
                </motion.div>

                {/* Right Eye */}
                <motion.div
                  animate={
                    isPasswordFocused
                      ? { scaleY: 0.1 }
                      : isTyping
                      ? { scale: [1, 1.2, 1] }
                      : { scale: 1 }
                  }
                  className="w-7 h-7 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] flex items-center justify-center relative"
                >
                  <motion.div
                    animate={
                      isEmailFocused ? { x: 3, y: 2 } : { x: 0, y: 0 }
                    }
                    className="w-3 h-3 rounded-full bg-slate-950"
                  />
                </motion.div>
              </div>

              {/* Cute Mouth Expression */}
              <motion.div
                animate={
                  isPasswordFocused
                    ? { width: 14, height: 4, borderRadius: 2 }
                    : isTyping
                    ? { width: 18, height: 10, borderRadius: '0 0 10px 10px' }
                    : { width: 22, height: 6, borderRadius: '0 0 12px 12px' }
                }
                className="absolute bottom-6 bg-amber-400 shadow-[0_0_8px_#f59e0b]"
              />

              {/* 3D Hands Covering Eyes when Password Field Focused */}
              <AnimatePresence>
                {isPasswordFocused && (
                  <motion.div
                    initial={{ y: 30, opacity: 0, scale: 0.5 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 30, opacity: 0, scale: 0.5 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                    className="absolute inset-0 flex items-center justify-center gap-2 z-20"
                  >
                    {/* Left Metallic Hand */}
                    <div className="w-12 h-10 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 border border-amber-200 shadow-lg transform -rotate-12" />
                    {/* Right Metallic Hand */}
                    <div className="w-12 h-10 rounded-2xl bg-gradient-to-l from-amber-400 to-amber-500 border border-amber-200 shadow-lg transform rotate-12" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* 3D Character Interactive Status Pill */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="mt-3 px-4 py-2 rounded-full bg-black/60 border border-amber-500/30 backdrop-blur-md text-xs font-medium text-amber-300 flex items-center gap-2 shadow-lg"
      >
        {isPasswordFocused ? (
          <>
            <EyeOff size={14} className="text-rose-400 animate-pulse" />
            <span className="text-rose-300 font-semibold">Security Mode: Eyes Covered 🙈</span>
          </>
        ) : isEmailFocused ? (
          <>
            <Eye size={14} className="text-cyan-400 animate-bounce" />
            <span className="text-cyan-300 font-semibold">Attentive Mode: Watching Field 👀</span>
          </>
        ) : (
          <>
            <Sparkles size={14} className="text-amber-400" />
            <span>PriceLens 3D AI Assistant Ready ✨</span>
          </>
        )}
      </motion.div>
    </div>
  );
};
