import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Mail, Lock, User, Phone, Eye, EyeOff, X, KeyRound, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PriceLens3D } from '../common/PriceLens3D';
import { PriceInsightCard } from '../common/PriceInsightCard';
import './AuthContainer.css';

// SVG Social Icons
const FacebookIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.762-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

export const AuthContainer = () => {
  const { login, signup, loginWithGoogle, isLoading, addToast } = useAuth();

  // Dynamic Price Intelligence Insights Data (Default / API ready)
  const [priceInsights] = useState({
    priceDropPercentage: 32,
    bestPrice: 999,
    savingsAmount: 500
  });

  // State: 'login' | 'register' | 'forgot'
  const [viewState, setViewState] = useState('login');

  // 3D Mouse Tilt & Floating Animation States
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateXRaw = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateYRaw = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

  const rotateX = useSpring(rotateXRaw, { damping: 20, stiffness: 200 });
  const rotateY = useSpring(rotateYRaw, { damping: 20, stiffness: 200 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Google OAuth Trigger Handler
  const handleGoogleAuth = () => {
    if (loginWithGoogle) {
      loginWithGoogle();
    } else {
      console.log('TODO: Execute POST /api/v1/auth/google payload (See API_CONTRACTS.md)');
      if (addToast) addToast('Connecting to Google OAuth...', 'info');
    }
  };

  // Login State
  const [loginData, setLoginData] = useState({ identifier: '', password: '', rememberMe: false });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});

  // Register State
  const [registerData, setRegisterData] = useState({ fullName: '', email: '', mobile: '', password: '' });
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerErrors, setRegisterErrors] = useState({});

  // Forgot Password 3-Step State
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotIdentifierError, setForgotIdentifierError] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotPasswordErrors, setForgotPasswordErrors] = useState({});
  const [isResending, setIsResending] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  const switchView = (view) => {
    setViewState(view);
    setLoginErrors({});
    setRegisterErrors({});
    setForgotStep(1);
    setForgotIdentifierError('');
    setOtpError('');
    setForgotPasswordErrors({});
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    const val = loginData.identifier.trim();

    if (!val) {
      errors.identifier = 'Email or Mobile number is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const mobileRegex = /^\d{10}$/;
      if (!emailRegex.test(val) && !mobileRegex.test(val)) {
        errors.identifier = 'Enter a valid Email or 10-digit Mobile';
      }
    }

    if (!loginData.password) {
      errors.password = 'Password is required';
    } else if (loginData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }

    setLoginErrors({});
    console.log('TODO: Execute POST /api/v1/auth/login payload:', loginData);

    try {
      await login({ email: loginData.identifier, password: loginData.password, rememberMe: loginData.rememberMe });
    } catch (err) {
      // Handled via AuthContext
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!registerData.fullName.trim()) {
      errors.fullName = 'Full Name is required';
    }

    if (!registerData.email.trim()) {
      errors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registerData.email.trim())) {
        errors.email = 'Enter a valid Email address';
      }
    }

    if (!registerData.mobile.trim()) {
      errors.mobile = 'Mobile number is required';
    } else {
      const mobileRegex = /^\d{10}$/;
      if (!mobileRegex.test(registerData.mobile.trim())) {
        errors.mobile = 'Mobile number must be 10 digits';
      }
    }

    if (!registerData.password) {
      errors.password = 'Password is required';
    } else if (registerData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(errors).length > 0) {
      setRegisterErrors(errors);
      return;
    }

    setRegisterErrors({});
    console.log('TODO: Execute POST /api/v1/auth/signup payload:', registerData);

    try {
      await signup(registerData);
    } catch (err) {
      // Handled via AuthContext
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    const val = forgotIdentifier.trim();
    if (!val) {
      setForgotIdentifierError('Email or Mobile number is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^\d{10}$/;
    if (!emailRegex.test(val) && !mobileRegex.test(val)) {
      setForgotIdentifierError('Enter a valid Email or 10-digit Mobile');
      return;
    }

    setForgotIdentifierError('');
    console.log('TODO: Execute POST /api/v1/auth/forgot-password/request-otp payload:', { identifier: val });
    setForgotStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const cleanOtp = otp.trim();
    if (!cleanOtp) {
      setOtpError('Please enter 6-digit OTP');
      return;
    }

    if (!/^\d{6}$/.test(cleanOtp)) {
      setOtpError('OTP must be 6 digits');
      return;
    }

    setOtpError('');
    console.log('TODO: Execute POST /api/v1/auth/forgot-password/verify-otp payload:', { identifier: forgotIdentifier, otp: cleanOtp });
    setForgotStep(3);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    const errors = {};

    if (!newPassword) {
      errors.newPassword = 'New Password is required';
    } else if (newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm password';
    } else if (confirmPassword !== newPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setForgotPasswordErrors(errors);
      return;
    }

    setForgotPasswordErrors({});
    console.log('TODO: Execute POST /api/v1/auth/forgot-password/reset payload:', { identifier: forgotIdentifier, newPassword });
    setForgotStep(4);
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.9, rotateY: -15 },
    animate: { opacity: 1, scale: 1, rotateY: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.9, rotateY: 15, transition: { duration: 0.25, ease: 'easeIn' } }
  };

  return (
    <div className="lofi-bg-viewport min-h-screen w-full bg-cover bg-center bg-no-repeat relative flex flex-col justify-between overflow-hidden">
      {/* Dark Vignette Overlay */}
      <div className="lofi-overlay absolute inset-0 bg-black/40 backdrop-brightness-90 pointer-events-none" style={{ zIndex: -5 }} />

      {/* Top Navbar */}
      <header className="lofi-navbar relative z-10 w-full px-8 py-6 flex items-center justify-between">
        <a href="/" className="lofi-brand-badge">
          <img
            src="/logo.jpg"
            alt="PriceLens Logo"
            className="lofi-brand-img"
          />
          <div className="brand-name">
            <span className="text-price">PRICE</span>
            <span className="text-lens">LENS</span>
          </div>
        </a>

        <nav className="lofi-nav-links hidden md:flex items-center space-x-8 text-white font-medium text-sm">
          <a href="#home" className="lofi-nav-link">Home</a>
          <a href="#about" className="lofi-nav-link">About</a>
          <a href="#services" className="lofi-nav-link">Services</a>
          <a href="#contact" className="lofi-nav-link">Contact</a>
          <button
            onClick={() => switchView('login')}
            className="lofi-nav-btn"
          >
            Login
          </button>
        </nav>
      </header>

      {/* 3-Column Composition: Left (3D Lens) | Center (Login Modal) | Right (3 Price Cards) */}
      <main className="lofi-main-center relative z-10 flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">

          {/* LEFT COLUMN: 3D Price Lens Magnifying Glass */}
          <div className="flex-1 hidden lg:flex justify-center items-center">
            <PriceLens3D />
          </div>

          {/* CENTER COLUMN: Existing Login Modal */}
          <div className="w-full max-w-md style-3d-perspective flex-shrink-0 z-10" style={{ perspective: 1000 }}>
            <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateY: 15 }}
            animate={
              isHovered
                ? { scale: 1, opacity: 1, y: 0 }
                : { scale: 1, opacity: 1, y: [0, -8, 0] }
            }
            style={{
              rotateX: isHovered ? rotateX : 0,
              rotateY: isHovered ? rotateY : 0,
              transformStyle: 'preserve-3d'
            }}
            transition={
              isHovered
                ? { type: 'spring', stiffness: 200, damping: 20 }
                : {
                    scale: { type: 'spring', stiffness: 120, damping: 12 },
                    opacity: { duration: 0.4 },
                    y: { repeat: Infinity, duration: 4, ease: 'easeInOut' }
                  }
            }
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="lofi-glass-card backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl p-8 relative overflow-hidden text-white"
          >
            {/* Close Button ('X') */}
            <button
              onClick={() => {
                if (addToast) addToast('Modal dismiss demo', 'info');
              }}
              className="lofi-close-btn absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Dynamic Animated Content Area */}
            <AnimatePresence mode="wait">
              {/* LOGIN STATE */}
              {viewState === 'login' && (
                <motion.div
                  key="login-view"
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full"
                >
                  <h2 className="lofi-title text-2xl font-bold text-center text-white mb-6 tracking-wide">
                    Login
                  </h2>

                  <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
                    {/* Email / Mobile Input */}
                    <div className="lofi-input-group relative">
                      <div className="lofi-input-wrapper flex items-center border-b border-white/40 pb-2 focus-within:border-white transition-colors">
                        <input
                          type="text"
                          value={loginData.identifier}
                          onChange={(e) => {
                            setLoginData({ ...loginData, identifier: e.target.value });
                            if (loginErrors.identifier) setLoginErrors({ ...loginErrors, identifier: '' });
                          }}
                          placeholder="Email or Mobile Number"
                          className="lofi-input w-full bg-transparent text-white placeholder-white/60 focus:outline-none pr-8 text-sm"
                        />
                        <Mail size={18} className="lofi-input-icon text-white/80 absolute right-0" />
                      </div>
                      {loginErrors.identifier && (
                        <p className="lofi-error-text text-rose-400 text-xs mt-1">{loginErrors.identifier}</p>
                      )}
                    </div>

                    {/* Password Input */}
                    <div className="lofi-input-group relative">
                      <div className="lofi-input-wrapper flex items-center border-b border-white/40 pb-2 focus-within:border-white transition-colors">
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          value={loginData.password}
                          onChange={(e) => {
                            setLoginData({ ...loginData, password: e.target.value });
                            if (loginErrors.password) setLoginErrors({ ...loginErrors, password: '' });
                          }}
                          placeholder="Password"
                          className="lofi-input w-full bg-transparent text-white placeholder-white/60 focus:outline-none pr-8 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="lofi-toggle-btn text-white/80 focus:outline-none absolute right-0"
                        >
                          {showLoginPassword ? <EyeOff size={18} /> : <Lock size={18} />}
                        </button>
                      </div>
                      {loginErrors.password && (
                        <p className="lofi-error-text text-rose-400 text-xs mt-1">{loginErrors.password}</p>
                      )}
                    </div>

                    {/* Options: Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between text-xs text-white/80 pt-1" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <label className="flex items-center gap-2 cursor-pointer select-none" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={loginData.rememberMe}
                          onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
                          className="rounded border-white/40 bg-transparent text-emerald-500 focus:ring-0 cursor-pointer"
                        />
                        <span>Remember me</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => switchView('forgot')}
                        className="hover:text-emerald-300 transition-colors underline-offset-4 hover:underline"
                        style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
                      >
                        Forgot Password?
                      </button>
                    </div>

                    {/* Divider: OR */}
                    <div className="relative my-2 flex items-center justify-center select-none">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/20" />
                      </div>
                      <div className="relative bg-slate-950/80 px-3 text-[10px] uppercase font-bold tracking-widest text-slate-400 rounded-full border border-white/10">
                        OR
                      </div>
                    </div>

                    {/* Google OAuth Glassmorphism Button */}
                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={handleGoogleAuth}
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 text-white font-medium text-xs border border-white/20 shadow-md backdrop-blur-md flex items-center justify-center gap-2 transition-all duration-200 hover:border-amber-400/40 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] cursor-pointer"
                    >
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>Continue with Google</span>
                    </motion.button>

                    {/* Submit Button */}
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={isLoading}
                      className="lofi-btn-dark w-full py-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-sm shadow-lg border border-white/10 transition-all"
                    >
                      {isLoading ? 'Logging in...' : 'Login'}
                    </motion.button>
                  </form>

                  {/* Register Switcher */}
                  <div className="text-center text-xs text-white/70 mt-3" style={{ textAlign: 'center', fontSize: '0.85rem' }}>
                    Don't have an account?{' '}
                    <button
                      onClick={() => switchView('register')}
                      className="text-white font-semibold hover:text-emerald-300 transition-colors ml-1 underline"
                      style={{ background: 'none', border: 'none', color: '#34d399', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Register
                    </button>
                  </div>

                  {/* Social Icons Footer Row */}
                  <div className="flex items-center justify-center gap-3 pt-3 border-t border-white/10 mt-3">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-slate-300 hover:text-white transition-all hover:scale-110 hover:border-amber-400/40 shadow-sm" aria-label="Facebook">
                      <FacebookIcon />
                    </a>
                    <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-slate-300 hover:text-white transition-all hover:scale-110 hover:border-amber-400/40 shadow-sm" aria-label="X / Twitter">
                      <TwitterIcon />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-slate-300 hover:text-white transition-all hover:scale-110 hover:border-amber-400/40 shadow-sm" aria-label="LinkedIn">
                      <LinkedinIcon />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-slate-300 hover:text-white transition-all hover:scale-110 hover:border-amber-400/40 shadow-sm" aria-label="Instagram">
                      <InstagramIcon />
                    </a>
                  </div>
                </motion.div>
              )}

              {/* REGISTER STATE */}
              {viewState === 'register' && (
                <motion.div
                  key="register-view"
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full"
                >
                  <h2 className="lofi-title text-2xl font-bold text-center text-white mb-4 tracking-wide">
                    Register
                  </h2>

                  <form onSubmit={handleRegisterSubmit} className="space-y-3" noValidate>
                    {/* Full Name */}
                    <div className="lofi-input-group relative">
                      <div className="lofi-input-wrapper flex items-center border-b border-white/40 pb-1.5 focus-within:border-white transition-colors">
                        <input
                          type="text"
                          value={registerData.fullName}
                          onChange={(e) => {
                            setRegisterData({ ...registerData, fullName: e.target.value });
                            if (registerErrors.fullName) setRegisterErrors({ ...registerErrors, fullName: '' });
                          }}
                          placeholder="Full Name"
                          className="lofi-input w-full bg-transparent text-white placeholder-white/60 focus:outline-none pr-8 text-sm"
                        />
                        <User size={18} className="lofi-input-icon text-white/80 absolute right-0" />
                      </div>
                      {registerErrors.fullName && (
                        <p className="lofi-error-text text-rose-400 text-xs mt-1">{registerErrors.fullName}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="lofi-input-group relative">
                      <div className="lofi-input-wrapper flex items-center border-b border-white/40 pb-1.5 focus-within:border-white transition-colors">
                        <input
                          type="email"
                          value={registerData.email}
                          onChange={(e) => {
                            setRegisterData({ ...registerData, email: e.target.value });
                            if (registerErrors.email) setRegisterErrors({ ...registerErrors, email: '' });
                          }}
                          placeholder="Email Address"
                          className="lofi-input w-full bg-transparent text-white placeholder-white/60 focus:outline-none pr-8 text-sm"
                        />
                        <Mail size={18} className="lofi-input-icon text-white/80 absolute right-0" />
                      </div>
                      {registerErrors.email && (
                        <p className="lofi-error-text text-rose-400 text-xs mt-1">{registerErrors.email}</p>
                      )}
                    </div>

                    {/* Mobile */}
                    <div className="lofi-input-group relative">
                      <div className="lofi-input-wrapper flex items-center border-b border-white/40 pb-1.5 focus-within:border-white transition-colors">
                        <input
                          type="tel"
                          value={registerData.mobile}
                          onChange={(e) => {
                            setRegisterData({ ...registerData, mobile: e.target.value });
                            if (registerErrors.mobile) setRegisterErrors({ ...registerErrors, mobile: '' });
                          }}
                          placeholder="Mobile Number (10 digits)"
                          maxLength={10}
                          className="lofi-input w-full bg-transparent text-white placeholder-white/60 focus:outline-none pr-8 text-sm"
                        />
                        <Phone size={18} className="lofi-input-icon text-white/80 absolute right-0" />
                      </div>
                      {registerErrors.mobile && (
                        <p className="lofi-error-text text-rose-400 text-xs mt-1">{registerErrors.mobile}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="lofi-input-group relative">
                      <div className="lofi-input-wrapper flex items-center border-b border-white/40 pb-1.5 focus-within:border-white transition-colors">
                        <input
                          type={showRegisterPassword ? 'text' : 'password'}
                          value={registerData.password}
                          onChange={(e) => {
                            setRegisterData({ ...registerData, password: e.target.value });
                            if (registerErrors.password) setRegisterErrors({ ...registerErrors, password: '' });
                          }}
                          placeholder="Password"
                          className="lofi-input w-full bg-transparent text-white placeholder-white/60 focus:outline-none pr-8 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                          className="lofi-toggle-btn text-white/80 focus:outline-none absolute right-0"
                        >
                          {showRegisterPassword ? <EyeOff size={18} /> : <Lock size={18} />}
                        </button>
                      </div>
                      {registerErrors.password && (
                        <p className="lofi-error-text text-rose-400 text-xs mt-1">{registerErrors.password}</p>
                      )}
                    </div>

                    {/* Sign Up Submit Button */}
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={isLoading}
                      className="lofi-btn-dark w-full py-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-sm shadow-lg border border-white/10 transition-all"
                    >
                      {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </motion.button>

                    {/* Divider: OR */}
                    <div className="relative my-2 flex items-center justify-center select-none">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/20" />
                      </div>
                      <div className="relative bg-slate-950/80 px-3 text-[10px] uppercase font-bold tracking-widest text-slate-400 rounded-full border border-white/10">
                        OR
                      </div>
                    </div>

                    {/* Google OAuth Glassmorphism Button */}
                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={handleGoogleAuth}
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 text-white font-medium text-xs border border-white/20 shadow-md backdrop-blur-md flex items-center justify-center gap-2 transition-all duration-200 hover:border-amber-400/40 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] cursor-pointer"
                    >
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>Continue with Google</span>
                    </motion.button>
                  </form>

                  {/* Login Switcher */}
                  <div className="text-center text-xs text-white/70 mt-3" style={{ textAlign: 'center', fontSize: '0.85rem' }}>
                    Already have an account?{' '}
                    <button
                      onClick={() => switchView('login')}
                      className="text-white font-semibold hover:text-emerald-300 transition-colors ml-1 underline"
                      style={{ background: 'none', border: 'none', color: '#34d399', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Login
                    </button>
                  </div>

                  {/* Social Icons Footer Row */}
                  <div className="flex items-center justify-center gap-3 pt-3 border-t border-white/10 mt-3">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-slate-300 hover:text-white transition-all hover:scale-110 hover:border-amber-400/40 shadow-sm" aria-label="Facebook">
                      <FacebookIcon />
                    </a>
                    <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-slate-300 hover:text-white transition-all hover:scale-110 hover:border-amber-400/40 shadow-sm" aria-label="X / Twitter">
                      <TwitterIcon />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-slate-300 hover:text-white transition-all hover:scale-110 hover:border-amber-400/40 shadow-sm" aria-label="LinkedIn">
                      <LinkedinIcon />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-slate-300 hover:text-white transition-all hover:scale-110 hover:border-amber-400/40 shadow-sm" aria-label="Instagram">
                      <InstagramIcon />
                    </a>
                  </div>
                </motion.div>
              )}

              {/* FORGOT PASSWORD STATE */}
              {viewState === 'forgot' && (
                <motion.div
                  key="forgot-view"
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full"
                >
                  <h2 className="lofi-title text-3xl font-bold text-center text-white mb-2 tracking-wide">
                    Reset Password
                  </h2>
                  <p className="text-xs text-white/70 text-center mb-6" style={{ textAlign: 'center', fontSize: '0.8rem', opacity: 0.8, marginBottom: '1.5rem' }}>
                    {forgotStep === 1 && 'Enter your Email or 10-digit Mobile to receive an OTP.'}
                    {forgotStep === 2 && `Enter 6-digit OTP sent to ${forgotIdentifier}`}
                    {forgotStep === 3 && 'Enter your new password below.'}
                  </p>

                  {/* STEP 1: REQUEST OTP */}
                  {forgotStep === 1 && (
                    <form onSubmit={handleSendOtp} className="space-y-6" noValidate>
                      <div className="lofi-input-group relative">
                        <div className="lofi-input-wrapper flex items-center border-b border-white/40 pb-2 focus-within:border-white transition-colors">
                          <input
                            type="text"
                            value={forgotIdentifier}
                            onChange={(e) => {
                              setForgotIdentifier(e.target.value);
                              if (forgotIdentifierError) setForgotIdentifierError('');
                            }}
                            placeholder="Email or Mobile Number"
                            className="lofi-input w-full bg-transparent text-white placeholder-white/60 focus:outline-none pr-8 text-sm"
                          />
                          <Mail size={18} className="lofi-input-icon text-white/80 absolute right-0" />
                        </div>
                        {forgotIdentifierError && (
                          <p className="lofi-error-text text-rose-400 text-xs mt-1">{forgotIdentifierError}</p>
                        )}
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="lofi-btn-dark w-full py-3 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-sm shadow-lg border border-white/10 transition-all"
                      >
                        Send OTP
                      </motion.button>
                    </form>
                  )}

                  {/* STEP 2: VERIFY OTP */}
                  {forgotStep === 2 && (
                    <form onSubmit={handleVerifyOtp} className="space-y-6" noValidate>
                      <div className="lofi-input-group relative">
                        <div className="lofi-input-wrapper flex items-center border-b border-white/40 pb-2 focus-within:border-white transition-colors">
                          <input
                            type="text"
                            value={otp}
                            onChange={(e) => {
                              setOtp(e.target.value);
                              if (otpError) setOtpError('');
                            }}
                            placeholder="6-Digit OTP Code"
                            maxLength={6}
                            className="lofi-input w-full bg-transparent text-white placeholder-white/60 focus:outline-none pr-8 text-sm tracking-widest text-center"
                            style={{ letterSpacing: '0.25em', textAlign: 'center' }}
                          />
                          <KeyRound size={18} className="lofi-input-icon text-white/80 absolute right-0" />
                        </div>
                        {otpError && (
                          <p className="lofi-error-text text-rose-400 text-xs mt-1 text-center">{otpError}</p>
                        )}
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="lofi-btn-dark w-full py-3 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-sm shadow-lg border border-white/10 transition-all"
                      >
                        Verify OTP
                      </motion.button>

                      <div className="text-center text-xs text-white/70" style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem' }}>
                        Didn't receive code?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setIsResending(true);
                            setResendMsg('');
                            setTimeout(() => {
                              setIsResending(false);
                              setResendMsg('New OTP code sent!');
                            }, 800);
                          }}
                          className="text-white font-semibold underline hover:text-emerald-300 ml-1 inline-flex items-center gap-1"
                          style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
                        >
                          <RefreshCw size={11} className={isResending ? 'animate-spin' : ''} />
                          <span>{isResending ? 'Sending...' : 'Resend Code'}</span>
                        </button>
                        {resendMsg && <p className="text-emerald-400 text-xs mt-1" style={{ color: '#34d399' }}>{resendMsg}</p>}
                      </div>
                    </form>
                  )}

                  {/* STEP 3: NEW PASSWORD */}
                  {forgotStep === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-5" noValidate>
                      <div className="lofi-input-group relative">
                        <div className="lofi-input-wrapper flex items-center border-b border-white/40 pb-2 focus-within:border-white transition-colors">
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                              if (forgotPasswordErrors.newPassword) setForgotPasswordErrors({ ...forgotPasswordErrors, newPassword: '' });
                            }}
                            placeholder="New Password"
                            className="lofi-input w-full bg-transparent text-white placeholder-white/60 focus:outline-none pr-8 text-sm"
                          />
                          <Lock size={18} className="lofi-input-icon text-white/80 absolute right-0" />
                        </div>
                        {forgotPasswordErrors.newPassword && (
                          <p className="lofi-error-text text-rose-400 text-xs mt-1">{forgotPasswordErrors.newPassword}</p>
                        )}
                      </div>

                      <div className="lofi-input-group relative">
                        <div className="lofi-input-wrapper flex items-center border-b border-white/40 pb-2 focus-within:border-white transition-colors">
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              if (forgotPasswordErrors.confirmPassword) setForgotPasswordErrors({ ...forgotPasswordErrors, confirmPassword: '' });
                            }}
                            placeholder="Confirm Password"
                            className="lofi-input w-full bg-transparent text-white placeholder-white/60 focus:outline-none pr-8 text-sm"
                          />
                          <Lock size={18} className="lofi-input-icon text-white/80 absolute right-0" />
                        </div>
                        {forgotPasswordErrors.confirmPassword && (
                          <p className="lofi-error-text text-rose-400 text-xs mt-1">{forgotPasswordErrors.confirmPassword}</p>
                        )}
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="lofi-btn-dark w-full py-3 mt-4 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-sm shadow-lg border border-white/10 transition-all"
                      >
                        Reset Password
                      </motion.button>
                    </form>
                  )}

                  {/* STEP 4: SUCCESS */}
                  {forgotStep === 4 && (
                    <div className="text-center py-4 space-y-4" style={{ textAlign: 'center' }}>
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40" style={{ width: '48px', height: '48px', margin: '0 auto 1rem', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle2 size={28} />
                      </div>
                      <p className="text-sm text-white">Password reset successfully!</p>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => switchView('login')}
                        className="lofi-btn-dark w-full py-3 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-sm border border-white/10 transition-all"
                      >
                        Back to Login
                      </motion.button>
                    </div>
                  )}

                  {/* Back to Login Link */}
                  {forgotStep < 4 && (
                    <div className="text-center text-xs text-white/70 mt-6" style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
                      Remember your password?{' '}
                      <button
                        onClick={() => switchView('login')}
                        className="text-white font-semibold hover:text-emerald-300 transition-colors ml-1 underline"
                        style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
                      >
                        Login
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: 3 Floating Price Information Cards */}
        <div className="flex-1 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-4.5 flex-wrap z-10">
          <PriceInsightCard
            title="PRICE DROP"
            value={`-${priceInsights.priceDropPercentage}%`}
            subtitle="Compared to last week"
            type="drop"
            delay={0.3}
            floatDuration={4.8}
            floatY={[0, -7, 0]}
            floatRotate={[0, -0.75, 0]}
            floatDelay={0.0}
          />
          <PriceInsightCard
            title="BEST PRICE"
            value={`₹${priceInsights.bestPrice}`}
            subtitle="Lowest verified price"
            type="best"
            delay={0.45}
            floatDuration={5.2}
            floatY={[0, -9, 0]}
            floatRotate={[0, 0.75, 0]}
            floatDelay={0.5}
          />
          <PriceInsightCard
            title="SAVE MORE"
            value={`₹${priceInsights.savingsAmount}`}
            subtitle="Average buyer savings"
            type="save"
            delay={0.6}
            floatDuration={5.6}
            floatY={[0, -6, 0]}
            floatRotate={[0, -0.5, 0]}
            floatDelay={1.0}
          />
        </div>

      </div>
    </main>
    </div>
  );
};
