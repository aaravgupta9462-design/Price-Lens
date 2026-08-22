import React, { useState } from 'react';
import { Mail, Lock, User, Phone, Eye, EyeOff, Globe, ChevronDown, ArrowLeft, ArrowRight, CheckCircle2, Share2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthContainer = () => {
  const { login, signup, isLoading, addToast } = useAuth();

  // View state: 'login' | 'register' | 'forgot'
  const [viewState, setViewState] = useState('login');

  // Testimonial slider state for left visual panel
  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Smart Shopper',
      quote: 'PriceLens saved me over ₹15,000 on my tech purchases this year. Unbelievable AI comparison tool!',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200'
    },
    {
      name: 'Rohan Sharma',
      role: 'Gadget Enthusiast',
      quote: 'The fake review analyzer is a game-changer. I never buy anything online without scanning it on PriceLens first.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200'
    }
  ];
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Form States
  const [loginData, setLoginData] = useState({ identifier: '', password: '', rememberMe: false });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});

  const [registerData, setRegisterData] = useState({ fullName: '', email: '', mobile: '', password: '' });
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerErrors, setRegisterErrors] = useState({});

  // Forgot Password State
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
    setForgotStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otp.trim() || !/^\d{6}$/.test(otp.trim())) {
      setOtpError('Enter a valid 6-digit OTP');
      return;
    }
    setOtpError('');
    setForgotStep(3);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    const errors = {};
    if (!newPassword || newPassword.length < 6) errors.newPassword = 'Password must be at least 6 characters';
    if (confirmPassword !== newPassword) errors.confirmPassword = 'Passwords do not match';
    if (Object.keys(errors).length > 0) {
      setForgotPasswordErrors(errors);
      return;
    }
    setForgotPasswordErrors({});
    setForgotStep(4);
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-4 lg:p-8 font-sans">
      {/* Main Container Card (White Split Card) */}
      <div className="max-w-6xl w-full bg-white rounded-[2.5rem] shadow-2xl p-2.5 flex flex-col lg:flex-row overflow-hidden border border-gray-100 min-h-[640px]">
        
        {/* LEFT SIDE (Visual / Image Section - 50% width on Desktop, hidden on mobile) */}
        <div
          className="hidden lg:flex lg:w-1/2 relative rounded-[2rem] overflow-hidden min-h-[620px] flex-col justify-between p-10 bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')`
          }}
        >
          {/* Dark Overlay for High Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/30 pointer-events-none" />

          {/* Top Bar inside Left Visual Image */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <img src="/logo.jpg" alt="PriceLens Logo" className="w-8 h-8 object-contain rounded-md" />
              <span className="text-white font-extrabold tracking-wider text-sm">PRICELENS AI</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => switchView('register')}
                className="px-4 py-1.5 rounded-full border border-white/40 backdrop-blur-md text-white text-xs font-semibold hover:bg-white/20 transition-all"
              >
                Sign Up
              </button>
              <button
                onClick={() => {
                  if (addToast) addToast('Join Us Community Modal', 'info');
                }}
                className="px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-all shadow-md"
              >
                Join Us
              </button>
            </div>
          </div>

          {/* Bottom Testimonial Box inside Left Visual Image */}
          <div className="relative z-10 space-y-4">
            <p className="text-white/90 text-sm font-medium leading-relaxed italic bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              "{testimonials[activeTestimonial].quote}"
            </p>

            <div className="flex items-center justify-between pt-2">
              {/* User Profile Info */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonials[activeTestimonial].avatar}
                  alt={testimonials[activeTestimonial].name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-emerald-400 shadow-md"
                />
                <div>
                  <h4 className="text-white font-bold text-sm leading-snug">{testimonials[activeTestimonial].name}</h4>
                  <p className="text-emerald-300 text-xs font-medium">{testimonials[activeTestimonial].role}</p>
                </div>
              </div>

              {/* Slider Arrow Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all"
                  aria-label="Previous Testimonial"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  onClick={() => setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all"
                  aria-label="Next Testimonial"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (Clean White Form Section - 50% width Desktop, 100% Mobile) */}
        <div className="w-full lg:w-1/2 p-8 lg:p-14 flex flex-col justify-between bg-white rounded-[2.5rem]">
          
          {/* Top Bar: Logo & Language Selector */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <img src="/logo.jpg" alt="PriceLens" className="w-9 h-9 object-contain rounded-lg shadow-sm" />
              <span className="text-2xl font-black text-slate-900 tracking-tight">Price<span className="text-emerald-500">Lens</span></span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-slate-700 text-xs font-semibold bg-gray-50/80 cursor-pointer hover:bg-gray-100 transition-colors">
              <Globe size={14} className="text-gray-500" />
              <span>EN</span>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
          </div>

          {/* Main Form Content Area */}
          <div className="my-auto py-4">
            {/* LOGIN STATE */}
            {viewState === 'login' && (
              <div>
                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-2">
                  Hi Shopper 👋
                </h1>
                <p className="text-gray-500 text-sm mb-8">
                  Welcome to PriceLens. Compare prices and buy smarter.
                </p>

                <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email or Mobile
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={loginData.identifier}
                        onChange={(e) => {
                          setLoginData({ ...loginData, identifier: e.target.value });
                          if (loginErrors.identifier) setLoginErrors({ ...loginErrors, identifier: '' });
                        }}
                        placeholder="name@example.com or 10-digit mobile"
                        className="w-full bg-gray-50/60 focus:bg-white text-slate-900 text-sm rounded-xl border border-gray-200 px-4 py-3.5 pl-10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      />
                      <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    {loginErrors.identifier && (
                      <p className="text-rose-500 text-xs mt-1 font-medium">{loginErrors.identifier}</p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => switchView('forgot')}
                        className="text-xs text-emerald-600 font-semibold hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginData.password}
                        onChange={(e) => {
                          setLoginData({ ...loginData, password: e.target.value });
                          if (loginErrors.password) setLoginErrors({ ...loginErrors, password: '' });
                        }}
                        placeholder="••••••••"
                        className="w-full bg-gray-50/60 focus:bg-white text-slate-900 text-sm rounded-xl border border-gray-200 px-4 py-3.5 pl-10 pr-10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      />
                      <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {loginErrors.password && (
                      <p className="text-rose-500 text-xs mt-1 font-medium">{loginErrors.password}</p>
                    )}
                  </div>

                  {/* Primary Login Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm tracking-wider uppercase shadow-lg shadow-emerald-500/25 transition-all duration-200 active:scale-[0.99] mt-2"
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <span className="relative bg-white px-4 text-xs font-semibold text-gray-400 uppercase">
                    or
                  </span>
                </div>

                {/* Google Login Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (addToast) addToast('Google OAuth Authentication Triggered', 'info');
                  }}
                  className="w-full py-3.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-slate-700 font-semibold text-sm flex items-center justify-center gap-3 transition-colors shadow-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Login with Google</span>
                </button>

                {/* Switcher Text */}
                <div className="text-center text-xs text-gray-500 font-medium mt-6">
                  Don't have an account?{' '}
                  <button
                    onClick={() => switchView('register')}
                    className="text-emerald-600 font-bold hover:underline ml-1"
                  >
                    Sign up
                  </button>
                </div>
              </div>
            )}

            {/* REGISTER / SIGNUP STATE */}
            {viewState === 'register' && (
              <div>
                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-2">
                  Create Account ✨
                </h1>
                <p className="text-gray-500 text-sm mb-6">
                  Join PriceLens to compare prices & unlock AI review insights.
                </p>

                <form onSubmit={handleRegisterSubmit} className="space-y-3.5" noValidate>
                  {/* Full Name */}
                  <div>
                    <input
                      type="text"
                      value={registerData.fullName}
                      onChange={(e) => {
                        setRegisterData({ ...registerData, fullName: e.target.value });
                        if (registerErrors.fullName) setRegisterErrors({ ...registerErrors, fullName: '' });
                      }}
                      placeholder="Full Name"
                      className="w-full bg-gray-50/60 focus:bg-white text-slate-900 text-sm rounded-xl border border-gray-200 px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    />
                    {registerErrors.fullName && (
                      <p className="text-rose-500 text-xs mt-1">{registerErrors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <input
                      type="email"
                      value={registerData.email}
                      onChange={(e) => {
                        setRegisterData({ ...registerData, email: e.target.value });
                        if (registerErrors.email) setRegisterErrors({ ...registerErrors, email: '' });
                      }}
                      placeholder="Email Address"
                      className="w-full bg-gray-50/60 focus:bg-white text-slate-900 text-sm rounded-xl border border-gray-200 px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    />
                    {registerErrors.email && (
                      <p className="text-rose-500 text-xs mt-1">{registerErrors.email}</p>
                    )}
                  </div>

                  {/* Mobile */}
                  <div>
                    <input
                      type="tel"
                      value={registerData.mobile}
                      onChange={(e) => {
                        setRegisterData({ ...registerData, mobile: e.target.value });
                        if (registerErrors.mobile) setRegisterErrors({ ...registerErrors, mobile: '' });
                      }}
                      placeholder="Mobile Number (10 digits)"
                      maxLength={10}
                      className="w-full bg-gray-50/60 focus:bg-white text-slate-900 text-sm rounded-xl border border-gray-200 px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    />
                    {registerErrors.mobile && (
                      <p className="text-rose-500 text-xs mt-1">{registerErrors.mobile}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <input
                      type={showRegisterPassword ? 'text' : 'password'}
                      value={registerData.password}
                      onChange={(e) => {
                        setRegisterData({ ...registerData, password: e.target.value });
                        if (registerErrors.password) setRegisterErrors({ ...registerErrors, password: '' });
                      }}
                      placeholder="Create Password (min 6 chars)"
                      className="w-full bg-gray-50/60 focus:bg-white text-slate-900 text-sm rounded-xl border border-gray-200 px-4 py-3 pr-10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {registerErrors.password && (
                      <p className="text-rose-500 text-xs mt-1">{registerErrors.password}</p>
                    )}
                  </div>

                  {/* Primary Signup Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm tracking-wider uppercase shadow-lg shadow-emerald-500/25 transition-all duration-200 active:scale-[0.99] mt-2"
                  >
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                  </button>
                </form>

                {/* Switcher Text */}
                <div className="text-center text-xs text-gray-500 font-medium mt-6">
                  Already have an account?{' '}
                  <button
                    onClick={() => switchView('login')}
                    className="text-emerald-600 font-bold hover:underline ml-1"
                  >
                    Login
                  </button>
                </div>
              </div>
            )}

            {/* FORGOT PASSWORD STATE */}
            {viewState === 'forgot' && (
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                  Reset Password 🔑
                </h1>
                <p className="text-gray-500 text-xs mb-6">
                  {forgotStep === 1 && 'Enter your registered Email or Mobile number to receive an OTP.'}
                  {forgotStep === 2 && `Enter 6-digit OTP code sent to ${forgotIdentifier}`}
                  {forgotStep === 3 && 'Enter your new password.'}
                  {forgotStep === 4 && 'Password updated successfully!'}
                </p>

                {/* STEP 1 */}
                {forgotStep === 1 && (
                  <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
                    <input
                      type="text"
                      value={forgotIdentifier}
                      onChange={(e) => {
                        setForgotIdentifier(e.target.value);
                        if (forgotIdentifierError) setForgotIdentifierError('');
                      }}
                      placeholder="Email or Mobile Number"
                      className="w-full bg-gray-50/60 focus:bg-white text-slate-900 text-sm rounded-xl border border-gray-200 px-4 py-3.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                    {forgotIdentifierError && <p className="text-rose-500 text-xs">{forgotIdentifierError}</p>}
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm tracking-wider uppercase shadow-lg shadow-emerald-500/25"
                    >
                      Send OTP
                    </button>
                  </form>
                )}

                {/* STEP 2 */}
                {forgotStep === 2 && (
                  <form onSubmit={handleVerifyOtp} className="space-y-4" noValidate>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value);
                        if (otpError) setOtpError('');
                      }}
                      placeholder="6-Digit OTP"
                      maxLength={6}
                      className="w-full bg-gray-50/60 focus:bg-white text-slate-900 text-sm rounded-xl border border-gray-200 px-4 py-3.5 text-center tracking-widest font-bold focus:border-emerald-500 outline-none"
                    />
                    {otpError && <p className="text-rose-500 text-xs text-center">{otpError}</p>}
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm tracking-wider uppercase shadow-lg shadow-emerald-500/25"
                    >
                      Verify OTP
                    </button>
                  </form>
                )}

                {/* STEP 3 */}
                {forgotStep === 3 && (
                  <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New Password"
                      className="w-full bg-gray-50/60 focus:bg-white text-slate-900 text-sm rounded-xl border border-gray-200 px-4 py-3.5 focus:border-emerald-500 outline-none"
                    />
                    {forgotPasswordErrors.newPassword && <p className="text-rose-500 text-xs">{forgotPasswordErrors.newPassword}</p>}
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      className="w-full bg-gray-50/60 focus:bg-white text-slate-900 text-sm rounded-xl border border-gray-200 px-4 py-3.5 focus:border-emerald-500 outline-none"
                    />
                    {forgotPasswordErrors.confirmPassword && <p className="text-rose-500 text-xs">{forgotPasswordErrors.confirmPassword}</p>}
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm tracking-wider uppercase shadow-lg shadow-emerald-500/25"
                    >
                      Reset Password
                    </button>
                  </form>
                )}

                {/* STEP 4 */}
                {forgotStep === 4 && (
                  <div className="text-center py-4 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 size={24} />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">Your password has been reset successfully!</p>
                    <button
                      onClick={() => switchView('login')}
                      className="w-full py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm uppercase"
                    >
                      Back to Login
                    </button>
                  </div>
                )}

                {forgotStep < 4 && (
                  <div className="text-center text-xs text-gray-500 font-medium mt-6">
                    Remembered password?{' '}
                    <button
                      onClick={() => switchView('login')}
                      className="text-emerald-600 font-bold hover:underline ml-1"
                    >
                      Back to Login
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Social Icons at Very Bottom */}
          <div className="flex items-center justify-center gap-5 pt-4 border-t border-gray-100 text-gray-400">
            <a href="#facebook" className="hover:text-emerald-500 transition-colors" aria-label="Facebook">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#twitter" className="hover:text-emerald-500 transition-colors" aria-label="Twitter">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#linkedin" className="hover:text-emerald-500 transition-colors" aria-label="LinkedIn">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="#instagram" className="hover:text-emerald-500 transition-colors" aria-label="Instagram">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
