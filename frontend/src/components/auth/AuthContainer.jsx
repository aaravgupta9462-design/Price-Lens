import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, Eye, EyeOff, KeyRound, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AuthContainer.css';

// SVG Social Icons (Clean Slate Light Styling)
const FacebookIcon = () => (
  <svg className="w-4 h-4 fill-current text-slate-600 hover:text-blue-600 transition-colors" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-4 h-4 fill-current text-slate-600 hover:text-slate-900 transition-colors" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4 fill-current text-slate-600 hover:text-blue-700 transition-colors" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.762-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4 fill-current text-slate-600 hover:text-pink-600 transition-colors" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

export const AuthContainer = () => {
  const { login, signup, loginWithGoogle, isLoading, addToast } = useAuth();

  // View State: 'login' | 'register' | 'forgot'
  const [viewState, setViewState] = useState('login');

  // Login Form State
  const [loginData, setLoginData] = useState({ identifier: '', password: '', rememberMe: false });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});

  // Register Form State
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

  const switchView = (view) => {
    setViewState(view);
    setLoginErrors({});
    setRegisterErrors({});
    setForgotStep(1);
    setForgotIdentifierError('');
    setOtpError('');
    setForgotPasswordErrors({});
  };

  const handleGoogleAuth = () => {
    if (loginWithGoogle) {
      loginWithGoogle();
    } else {
      if (addToast) addToast('Connecting to Google OAuth...', 'info');
    }
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
    setForgotStep(4);
  };

  const cardVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2, ease: 'easeIn' } }
  };

  return (
    <div className="saas-bg-viewport min-h-screen w-full flex flex-col justify-between overflow-hidden">
      {/* ─── Top Navbar matching Home Page ────────────────────────────────── */}
      <header className="saas-navbar">
        <a href="/" className="saas-brand-badge">
          <img src="/logo.jpg" alt="PriceLens Logo" className="saas-brand-img" />
          <div className="saas-brand-name">
            <span className="text-price">Price</span>
            <span className="text-lens">Lens</span>
          </div>
        </a>

        <nav className="saas-nav-links hidden sm:flex items-center">
          <a href="/" className="saas-nav-link">Home</a>
          <a href="#features" className="saas-nav-link">Features</a>
          <a href="#pricing" className="saas-nav-link">Pricing</a>
          <button
            onClick={() => switchView(viewState === 'login' ? 'register' : 'login')}
            className="saas-nav-btn"
          >
            {viewState === 'login' ? 'Register' : 'Login'}
          </button>
        </nav>
      </header>

      {/* ─── Center Authentication Card ───────────────────────────────────── */}
      <main className="saas-main-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="saas-card"
        >
          <AnimatePresence mode="wait">
            {/* ─── 1. LOGIN VIEW ────────────────────────────────────────── */}
            {viewState === 'login' && (
              <motion.div
                key="login-view"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <h2 className="saas-title">Welcome Back</h2>
                <p className="saas-subtitle">Login to access real-time price intelligence</p>

                <form onSubmit={handleLoginSubmit} noValidate>
                  {/* Email / Mobile Input */}
                  <div className="saas-input-group">
                    <label className="saas-input-label">Email or Mobile Number</label>
                    <div className="saas-input-wrapper">
                      <Mail size={18} className="saas-input-icon" />
                      <input
                        type="text"
                        value={loginData.identifier}
                        onChange={(e) => {
                          setLoginData({ ...loginData, identifier: e.target.value });
                          if (loginErrors.identifier) setLoginErrors({ ...loginErrors, identifier: '' });
                        }}
                        placeholder="name@example.com or 10-digit mobile"
                        className="saas-input"
                      />
                    </div>
                    {loginErrors.identifier && (
                      <p className="saas-error-text">{loginErrors.identifier}</p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div className="saas-input-group">
                    <label className="saas-input-label">Password</label>
                    <div className="saas-input-wrapper">
                      <Lock size={18} className="saas-input-icon" />
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginData.password}
                        onChange={(e) => {
                          setLoginData({ ...loginData, password: e.target.value });
                          if (loginErrors.password) setLoginErrors({ ...loginErrors, password: '' });
                        }}
                        placeholder="••••••••"
                        className="saas-input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="saas-toggle-btn"
                        aria-label="Toggle password visibility"
                      >
                        {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {loginErrors.password && (
                      <p className="saas-error-text">{loginErrors.password}</p>
                    )}
                  </div>

                  {/* Options: Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={loginData.rememberMe}
                        onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="font-medium text-slate-600">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => switchView('forgot')}
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="saas-btn-primary"
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </button>

                  {/* Divider: OR */}
                  <div className="relative my-4 flex items-center justify-center select-none">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative bg-white px-3 text-[10px] uppercase font-bold tracking-widest text-slate-400 rounded-full border border-slate-200">
                      OR
                    </div>
                  </div>

                  {/* Google OAuth Button */}
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={isLoading}
                    className="saas-btn-google"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </form>

                {/* Switch to Register */}
                <p className="text-center text-xs text-slate-600 mt-4">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchView('register')}
                    className="text-blue-600 hover:text-blue-700 font-bold hover:underline"
                  >
                    Register
                  </button>
                </p>

                {/* Social Icons Row */}
                <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100 mt-5">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all hover:scale-110 shadow-sm" aria-label="Facebook">
                    <FacebookIcon />
                  </a>
                  <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all hover:scale-110 shadow-sm" aria-label="X / Twitter">
                    <TwitterIcon />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all hover:scale-110 shadow-sm" aria-label="LinkedIn">
                    <LinkedinIcon />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all hover:scale-110 shadow-sm" aria-label="Instagram">
                    <InstagramIcon />
                  </a>
                </div>
              </motion.div>
            )}

            {/* ─── 2. REGISTER VIEW ─────────────────────────────────────── */}
            {viewState === 'register' && (
              <motion.div
                key="register-view"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <h2 className="saas-title">Create Account</h2>
                <p className="saas-subtitle">Join PriceLens to start tracking best deals</p>

                <form onSubmit={handleRegisterSubmit} noValidate>
                  {/* Full Name */}
                  <div className="saas-input-group">
                    <label className="saas-input-label">Full Name</label>
                    <div className="saas-input-wrapper">
                      <User size={18} className="saas-input-icon" />
                      <input
                        type="text"
                        value={registerData.fullName}
                        onChange={(e) => {
                          setRegisterData({ ...registerData, fullName: e.target.value });
                          if (registerErrors.fullName) setRegisterErrors({ ...registerErrors, fullName: '' });
                        }}
                        placeholder="Alex Johnson"
                        className="saas-input"
                      />
                    </div>
                    {registerErrors.fullName && <p className="saas-error-text">{registerErrors.fullName}</p>}
                  </div>

                  {/* Email Address */}
                  <div className="saas-input-group">
                    <label className="saas-input-label">Email Address</label>
                    <div className="saas-input-wrapper">
                      <Mail size={18} className="saas-input-icon" />
                      <input
                        type="email"
                        value={registerData.email}
                        onChange={(e) => {
                          setRegisterData({ ...registerData, email: e.target.value });
                          if (registerErrors.email) setRegisterErrors({ ...registerErrors, email: '' });
                        }}
                        placeholder="alex@example.com"
                        className="saas-input"
                      />
                    </div>
                    {registerErrors.email && <p className="saas-error-text">{registerErrors.email}</p>}
                  </div>

                  {/* Mobile Number */}
                  <div className="saas-input-group">
                    <label className="saas-input-label">Mobile Number</label>
                    <div className="saas-input-wrapper">
                      <Phone size={18} className="saas-input-icon" />
                      <input
                        type="tel"
                        value={registerData.mobile}
                        onChange={(e) => {
                          setRegisterData({ ...registerData, mobile: e.target.value });
                          if (registerErrors.mobile) setRegisterErrors({ ...registerErrors, mobile: '' });
                        }}
                        placeholder="9876543210"
                        className="saas-input"
                      />
                    </div>
                    {registerErrors.mobile && <p className="saas-error-text">{registerErrors.mobile}</p>}
                  </div>

                  {/* Password */}
                  <div className="saas-input-group">
                    <label className="saas-input-label">Password</label>
                    <div className="saas-input-wrapper">
                      <Lock size={18} className="saas-input-icon" />
                      <input
                        type={showRegisterPassword ? 'text' : 'password'}
                        value={registerData.password}
                        onChange={(e) => {
                          setRegisterData({ ...registerData, password: e.target.value });
                          if (registerErrors.password) setRegisterErrors({ ...registerErrors, password: '' });
                        }}
                        placeholder="At least 6 characters"
                        className="saas-input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="saas-toggle-btn"
                      >
                        {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {registerErrors.password && <p className="saas-error-text">{registerErrors.password}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="saas-btn-primary"
                  >
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                  </button>

                  {/* Divider: OR */}
                  <div className="relative my-4 flex items-center justify-center select-none">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative bg-white px-3 text-[10px] uppercase font-bold tracking-widest text-slate-400 rounded-full border border-slate-200">
                      OR
                    </div>
                  </div>

                  {/* Google OAuth Button */}
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={isLoading}
                    className="saas-btn-google"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </form>

                {/* Switch to Login */}
                <p className="text-center text-xs text-slate-600 mt-4">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchView('login')}
                    className="text-blue-600 hover:text-blue-700 font-bold hover:underline"
                  >
                    Login
                  </button>
                </p>

                {/* Social Icons Row */}
                <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100 mt-5">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all hover:scale-110 shadow-sm" aria-label="Facebook">
                    <FacebookIcon />
                  </a>
                  <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all hover:scale-110 shadow-sm" aria-label="X / Twitter">
                    <TwitterIcon />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all hover:scale-110 shadow-sm" aria-label="LinkedIn">
                    <LinkedinIcon />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all hover:scale-110 shadow-sm" aria-label="Instagram">
                    <InstagramIcon />
                  </a>
                </div>
              </motion.div>
            )}

            {/* ─── 3. FORGOT PASSWORD 3-STEP VIEW ───────────────────────── */}
            {viewState === 'forgot' && (
              <motion.div
                key="forgot-view"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <h2 className="saas-title">Reset Password</h2>
                <p className="saas-subtitle">
                  {forgotStep === 1 && 'Step 1: Enter your registered Email or Mobile'}
                  {forgotStep === 2 && 'Step 2: Enter the 6-digit OTP sent to you'}
                  {forgotStep === 3 && 'Step 3: Set your new password'}
                  {forgotStep === 4 && 'Password Reset Complete!'}
                </p>

                {/* STEP 1: Request OTP */}
                {forgotStep === 1 && (
                  <form onSubmit={handleSendOtp} noValidate>
                    <div className="saas-input-group">
                      <label className="saas-input-label">Email or Mobile Number</label>
                      <div className="saas-input-wrapper">
                        <Mail size={18} className="saas-input-icon" />
                        <input
                          type="text"
                          value={forgotIdentifier}
                          onChange={(e) => {
                            setForgotIdentifier(e.target.value);
                            if (forgotIdentifierError) setForgotIdentifierError('');
                          }}
                          placeholder="name@example.com or 10-digit mobile"
                          className="saas-input"
                        />
                      </div>
                      {forgotIdentifierError && <p className="saas-error-text">{forgotIdentifierError}</p>}
                    </div>

                    <button type="submit" className="saas-btn-primary">
                      Send OTP Code
                    </button>
                  </form>
                )}

                {/* STEP 2: Verify OTP */}
                {forgotStep === 2 && (
                  <form onSubmit={handleVerifyOtp} noValidate>
                    <div className="saas-input-group">
                      <label className="saas-input-label">6-Digit Verification OTP</label>
                      <div className="saas-input-wrapper">
                        <KeyRound size={18} className="saas-input-icon" />
                        <input
                          type="text"
                          maxLength={6}
                          value={otp}
                          onChange={(e) => {
                            setOtp(e.target.value);
                            if (otpError) setOtpError('');
                          }}
                          placeholder="123456"
                          className="saas-input text-center tracking-widest font-bold text-lg"
                        />
                      </div>
                      {otpError && <p className="saas-error-text">{otpError}</p>}
                    </div>

                    <button type="submit" className="saas-btn-primary">
                      Verify OTP
                    </button>
                  </form>
                )}

                {/* STEP 3: Reset Password */}
                {forgotStep === 3 && (
                  <form onSubmit={handleResetPassword} noValidate>
                    <div className="saas-input-group">
                      <label className="saas-input-label">New Password</label>
                      <div className="saas-input-wrapper">
                        <Lock size={18} className="saas-input-icon" />
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            if (forgotPasswordErrors.newPassword) setForgotPasswordErrors({ ...forgotPasswordErrors, newPassword: '' });
                          }}
                          placeholder="At least 6 characters"
                          className="saas-input"
                        />
                      </div>
                      {forgotPasswordErrors.newPassword && <p className="saas-error-text">{forgotPasswordErrors.newPassword}</p>}
                    </div>

                    <div className="saas-input-group">
                      <label className="saas-input-label">Confirm New Password</label>
                      <div className="saas-input-wrapper">
                        <Lock size={18} className="saas-input-icon" />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (forgotPasswordErrors.confirmPassword) setForgotPasswordErrors({ ...forgotPasswordErrors, confirmPassword: '' });
                          }}
                          placeholder="Re-enter password"
                          className="saas-input"
                        />
                      </div>
                      {forgotPasswordErrors.confirmPassword && <p className="saas-error-text">{forgotPasswordErrors.confirmPassword}</p>}
                    </div>

                    <button type="submit" className="saas-btn-primary">
                      Reset Password
                    </button>
                  </form>
                )}

                {/* STEP 4: Success */}
                {forgotStep === 4 && (
                  <div className="text-center py-4 space-y-4">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={28} />
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      Your password has been updated successfully!
                    </p>
                    <button
                      type="button"
                      onClick={() => switchView('login')}
                      className="saas-btn-primary"
                    >
                      Back to Login
                    </button>
                  </div>
                )}

                {/* Back to Login Link */}
                {forgotStep !== 4 && (
                  <p className="text-center text-xs text-slate-600 mt-4">
                    Remembered password?{' '}
                    <button
                      type="button"
                      onClick={() => switchView('login')}
                      className="text-blue-600 hover:text-blue-700 font-bold hover:underline"
                    >
                      Back to Login
                    </button>
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* ─── Footer ───────────────────────────────────────────────────────── */}
      <footer className="saas-footer-text">
        PriceLens © 2026 — Modern SaaS Price Intelligence Platform. All rights reserved.
      </footer>
    </div>
  );
};
