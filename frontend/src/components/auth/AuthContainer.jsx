import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Mail, Lock, User, Phone, Eye, EyeOff, X, KeyRound, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TwinklingStars } from '../common/TwinklingStars';
import { Interactive3DCharacter } from '../common/Interactive3DCharacter';
import './AuthContainer.css';

export const AuthContainer = () => {
  const { login, signup, isLoading, addToast } = useAuth();

  // State: 'login' | 'register' | 'forgot'
  const [viewState, setViewState] = useState('login');

  // 3D Focus & Micro-Interaction States for Spline/Mascot character
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // 3D Mouse Tilt & Floating Animation States for Auth Card
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
    setIsEmailFocused(false);
    setIsPasswordFocused(false);
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
    <div
      className="lofi-bg-viewport min-h-screen w-full bg-cover bg-center bg-no-repeat relative flex flex-col justify-between overflow-x-hidden"
      style={{ backgroundImage: "url('/bg-auth.png')" }}
    >
      {/* Dark Vignette Overlay */}
      <div className="lofi-overlay absolute inset-0 bg-black/40 backdrop-brightness-90 pointer-events-none" style={{ zIndex: -5 }} />

      {/* Re-enabled Twinkling Stars Overlay */}
      <TwinklingStars />

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

      {/* Main Split-Screen Desktop / Stacked Mobile 3D Layout */}
      <main className="lofi-main-center relative z-10 flex-1 flex items-center justify-center p-4 my-auto">
        <div className="lofi-split-layout">
          
          {/* LEFT SIDE: Interactive 3D Spline / Mascot Character Showcase */}
          <div className="spline-glass-wrapper">
            <Interactive3DCharacter
              isEmailFocused={isEmailFocused}
              isPasswordFocused={isPasswordFocused}
              isTyping={isTyping}
            />
          </div>

          {/* RIGHT SIDE: Pure Glassmorphism Auth Card with 3D Tilt */}
          <div className="w-full max-w-md style-3d-perspective" style={{ perspective: 1000 }}>
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
                    <h2 className="lofi-title text-3xl font-bold text-center text-white mb-8 tracking-wide">
                      Login
                    </h2>

                    <form onSubmit={handleLoginSubmit} className="space-y-6" noValidate>
                      {/* Email / Mobile Input */}
                      <div className="lofi-input-group relative">
                        <div className="lofi-input-wrapper flex items-center border-b border-white/40 pb-2 focus-within:border-white transition-colors">
                          <input
                            type="text"
                            value={loginData.identifier}
                            onFocus={() => {
                              setIsEmailFocused(true);
                              setIsPasswordFocused(false);
                            }}
                            onBlur={() => setIsEmailFocused(false)}
                            onChange={(e) => {
                              setLoginData({ ...loginData, identifier: e.target.value });
                              if (loginErrors.identifier) setLoginErrors({ ...loginErrors, identifier: '' });
                              setIsTyping(true);
                              setTimeout(() => setIsTyping(false), 600);
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
                            onFocus={() => {
                              setIsPasswordFocused(true);
                              setIsEmailFocused(false);
                            }}
                            onBlur={() => setIsPasswordFocused(false)}
                            onChange={(e) => {
                              setLoginData({ ...loginData, password: e.target.value });
                              if (loginErrors.password) setLoginErrors({ ...loginErrors, password: '' });
                              setIsTyping(true);
                              setTimeout(() => setIsTyping(false), 600);
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

                      {/* Submit Button with 3D Push Tap Effect */}
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={isLoading}
                        className="lofi-btn-dark w-full py-3 mt-4 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-sm shadow-lg border border-white/10 transition-all"
                      >
                        {isLoading ? 'Logging in...' : 'Login'}
                      </motion.button>
                    </form>

                    {/* Register Switcher */}
                    <div className="text-center text-xs text-white/70 mt-6" style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
                      Don't have an account?{' '}
                      <button
                        onClick={() => switchView('register')}
                        className="text-white font-semibold hover:text-emerald-300 transition-colors ml-1 underline"
                        style={{ background: 'none', border: 'none', color: '#34d399', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Register
                      </button>
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
                    <h2 className="lofi-title text-3xl font-bold text-center text-white mb-6 tracking-wide">
                      Register
                    </h2>

                    <form onSubmit={handleRegisterSubmit} className="space-y-5" noValidate>
                      {/* Full Name */}
                      <div className="lofi-input-group relative">
                        <div className="lofi-input-wrapper flex items-center border-b border-white/40 pb-2 focus-within:border-white transition-colors">
                          <input
                            type="text"
                            value={registerData.fullName}
                            onFocus={() => setIsEmailFocused(true)}
                            onBlur={() => setIsEmailFocused(false)}
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
                        <div className="lofi-input-wrapper flex items-center border-b border-white/40 pb-2 focus-within:border-white transition-colors">
                          <input
                            type="email"
                            value={registerData.email}
                            onFocus={() => setIsEmailFocused(true)}
                            onBlur={() => setIsEmailFocused(false)}
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
                        <div className="lofi-input-wrapper flex items-center border-b border-white/40 pb-2 focus-within:border-white transition-colors">
                          <input
                            type="tel"
                            value={registerData.mobile}
                            onFocus={() => setIsEmailFocused(true)}
                            onBlur={() => setIsEmailFocused(false)}
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
                        <div className="lofi-input-wrapper flex items-center border-b border-white/40 pb-2 focus-within:border-white transition-colors">
                          <input
                            type={showRegisterPassword ? 'text' : 'password'}
                            value={registerData.password}
                            onFocus={() => setIsPasswordFocused(true)}
                            onBlur={() => setIsPasswordFocused(false)}
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

                      {/* Submit Button with 3D Push Tap Effect */}
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={isLoading}
                        className="lofi-btn-dark w-full py-3 mt-4 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-sm shadow-lg border border-white/10 transition-all"
                      >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                      </motion.button>
                    </form>

                    {/* Login Switcher */}
                    <div className="text-center text-xs text-white/70 mt-6" style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
                      Already have an account?{' '}
                      <button
                        onClick={() => switchView('login')}
                        className="text-white font-semibold hover:text-emerald-300 transition-colors ml-1 underline"
                        style={{ background: 'none', border: 'none', color: '#34d399', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Login
                      </button>
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
                              onFocus={() => setIsEmailFocused(true)}
                              onBlur={() => setIsEmailFocused(false)}
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
                              onFocus={() => setIsPasswordFocused(true)}
                              onBlur={() => setIsPasswordFocused(false)}
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
                              onFocus={() => setIsPasswordFocused(true)}
                              onBlur={() => setIsPasswordFocused(false)}
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
        </div>
      </main>
    </div>
  );
};
