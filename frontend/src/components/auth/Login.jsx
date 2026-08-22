import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const Login = ({ onSwitchToSignUp, onOpenForgotPassword }) => {
  const { login, isLoading, addToast } = useAuth();

  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const identifierVal = formData.identifier.trim();

    if (!identifierVal) {
      newErrors.identifier = 'Email address or Mobile number is required.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log('TODO: Execute POST /api/v1/auth/login payload:', formData);

    try {
      await login({
        email: formData.identifier,
        password: formData.password
      });
    } catch (err) {
      // Handled via AuthContext Toast
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 md:p-8 font-sans">
      {/* Main White Split Card Container */}
      <div className="bg-white w-full max-w-[1100px] h-auto md:h-[750px] rounded-[2.5rem] p-2 flex flex-col md:flex-row shadow-2xl overflow-hidden">
        
        {/* LEFT SIDE (Visuals - 50% Width) */}
        <div className="relative w-full md:w-1/2 h-[300px] md:h-full rounded-[2rem] overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1000&auto=format&fit=crop')`
            }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />

          {/* Top Nav (Absolute) */}
          <div className="absolute top-8 left-8 right-8 flex justify-between items-center text-white z-10">
            <span className="text-sm font-semibold tracking-wide">Selected Works</span>
            <div className="flex items-center gap-4 text-sm font-medium">
              <button
                type="button"
                onClick={onSwitchToSignUp}
                className="hover:underline cursor-pointer"
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => {
                  if (addToast) addToast('Join Us Community Triggered', 'info');
                }}
                className="border border-white rounded-full px-5 py-1.5 hover:bg-white/20 transition-all cursor-pointer"
              >
                Join Us
              </button>
            </div>
          </div>

          {/* Bottom Nav (Absolute) */}
          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end text-white z-10">
            <div className="flex items-center gap-3">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Andrew.ui"
                className="w-11 h-11 rounded-full border-2 border-white/40 object-cover"
              />
              <div>
                <h4 className="font-bold text-sm leading-tight">Andrew.ui</h4>
                <p className="text-xs text-white/80">UI & Illustration</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all cursor-pointer"
                aria-label="Previous Slide"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all cursor-pointer"
                aria-label="Next Slide"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (Form - 50% Width) */}
        <div className="w-full md:w-1/2 flex flex-col justify-between px-8 py-10 md:px-16 md:py-12 relative bg-white">
          
          {/* Top Header */}
          <div className="flex justify-between items-center">
            <span className="text-2xl font-black tracking-tighter uppercase text-slate-900">
              PRICELENS
            </span>
            <button
              type="button"
              className="border border-gray-200 rounded-full px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>🇬🇧 EN</span>
              <span className="text-xs">⌄</span>
            </button>
          </div>

          {/* Headlines & Form */}
          <div className="my-auto py-4">
            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
              Hi Shopper
            </h1>
            <p className="text-gray-500 mt-2 text-sm mb-6">
              Welcome to PriceLens. Compare prices and buy smarter.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              {/* Email Input (NO LABELS) */}
              <div className="mb-4">
                <input
                  type="text"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full border border-gray-200 rounded-xl px-5 py-4 text-gray-800 placeholder-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 outline-none transition-all"
                />
                {errors.identifier && (
                  <p className="text-[#E94E44] text-xs mt-1 font-medium">{errors.identifier}</p>
                )}
              </div>

              {/* Password Input (NO LABELS) */}
              <div className="mb-2 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full border border-gray-200 rounded-xl px-5 py-4 text-gray-800 placeholder-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 outline-none transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && (
                  <p className="text-[#E94E44] text-xs mt-1 font-medium">{errors.password}</p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="text-right mb-4">
                <button
                  type="button"
                  onClick={onOpenForgotPassword}
                  className="text-sm font-semibold text-[#E94E44] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 my-4">
                <div className="flex-1 h-[1px] bg-gray-200" />
                <span className="text-gray-400 text-xs font-semibold uppercase">or</span>
                <div className="flex-1 h-[1px] bg-gray-200" />
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={() => {
                  if (addToast) addToast('Google OAuth Authentication Triggered', 'info');
                }}
                className="w-full border border-gray-200 rounded-xl py-3.5 flex items-center justify-center gap-3 text-gray-700 font-semibold text-sm bg-white hover:bg-gray-50 transition-colors shadow-sm cursor-pointer mb-2"
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

              {/* Primary RED Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#E94E44] hover:bg-[#d6453b] text-white rounded-full py-4 text-lg font-bold shadow-[0_8px_20px_rgba(233,78,68,0.3)] mt-4 transition-all duration-200 active:scale-[0.99] cursor-pointer"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Footer Text */}
            <div className="text-center text-sm text-gray-500 font-medium mt-6">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToSignUp}
                className="text-[#E94E44] font-bold hover:underline ml-1 cursor-pointer"
              >
                Sign up
              </button>
            </div>
          </div>

          {/* Social Icons (Centered at Bottom) */}
          <div className="flex justify-center items-center gap-6 pt-4 border-t border-gray-100 text-gray-400">
            <a href="#facebook" className="hover:text-gray-800 transition-colors" aria-label="Facebook">
              <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#twitter" className="hover:text-gray-800 transition-colors" aria-label="Twitter">
              <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#linkedin" className="hover:text-gray-800 transition-colors" aria-label="LinkedIn">
              <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="#instagram" className="hover:text-gray-800 transition-colors" aria-label="Instagram">
              <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LoginForm = Login;
