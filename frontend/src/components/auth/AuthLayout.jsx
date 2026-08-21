import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../layout/Header';
import { FeatureHighlights } from '../layout/FeatureHighlights';
import { Login } from './Login';
import { Signup } from './Signup';
import { ForgotPassword } from './ForgotPassword';
import { TiltCard } from '../common/TiltCard';
import { NotificationToast } from '../common/NotificationToast';

const pageVariants = {
  initial: {
    opacity: 0,
    rotateY: -90,
    scale: 0.9
  },
  animate: {
    opacity: 1,
    rotateY: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  exit: {
    opacity: 0,
    rotateY: 90,
    scale: 0.9,
    transition: {
      duration: 0.3,
      ease: [0.7, 0, 0.84, 0]
    }
  }
};

export const AuthLayout = () => {
  // 'login' | 'signup' | 'forgot'
  const [currentView, setCurrentView] = useState('login');

  return (
    <div className="app-viewport">
      {/* 3D Animated Aurora Background with Parallax Orbs */}
      <div className="bg-ambient-wrapper">
        <motion.div
          className="ambient-blob ambient-blob-1"
          animate={{
            y: [0, -50, 30, 0],
            x: [0, 40, -40, 0],
            scale: [1, 1.25, 0.9, 1]
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="ambient-blob ambient-blob-2"
          animate={{
            y: [0, 40, -50, 0],
            x: [0, -35, 45, 0],
            scale: [1, 0.95, 1.3, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="ambient-blob ambient-blob-3"
          animate={{
            y: [0, -30, 40, 0],
            x: [0, 50, -25, 0],
            scale: [1, 1.15, 0.85, 1]
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="ambient-blob ambient-blob-4"
          animate={{
            y: [0, 35, -35, 0],
            x: [0, -40, 30, 0],
            scale: [1, 1.2, 0.9, 1]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut'
          }}
        />
      </div>

      {/* Brand Header */}
      <Header />

      {/* Main Content Layout */}
      <main className="main-content">
        <div className="auth-grid">
          {/* Left Side Showcase */}
          <FeatureHighlights />

          {/* Right Side: Fluid 3D Entry & 3D Tilt Wrapper */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotateY: 15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ type: 'spring', stiffness: 90, damping: 14 }}
            style={{ perspective: 1200 }}
          >
            <TiltCard>
              <AnimatePresence mode="wait">
                {currentView === 'login' && (
                  <motion.div
                    key="login"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <Login
                      onSwitchToSignUp={() => setCurrentView('signup')}
                      onOpenForgotPassword={() => setCurrentView('forgot')}
                    />
                  </motion.div>
                )}

                {currentView === 'signup' && (
                  <motion.div
                    key="signup"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <Signup
                      onSwitchToLogin={() => setCurrentView('login')}
                    />
                  </motion.div>
                )}

                {currentView === 'forgot' && (
                  <motion.div
                    key="forgot"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <ForgotPassword
                      onBackToLogin={() => setCurrentView('login')}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </TiltCard>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          PriceLens &copy; {new Date().getFullYear()} — AI-Powered Price Comparison & Review Analysis Platform.
        </p>
      </footer>

      <NotificationToast />
    </div>
  );
};
