import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export const Login = ({ onSwitchToSignUp, onOpenForgotPassword }) => {
  const { login, isLoading, addToast } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailVal = formData.email.trim();

    if (!emailVal) {
      newErrors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailVal)) {
        newErrors.email = 'Please enter a valid email address.';
      }
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
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });
    } catch (err) {
      // Handled via AuthContext Toast
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] flex items-center justify-center p-4 md:p-8 font-sans text-gray-900">
      {/* Main Card Container */}
      <div className="w-full max-w-[1050px] min-h-[650px] bg-white rounded-[2rem] flex flex-col md:flex-row overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
        
        {/* LEFT SECTION (Visuals & 3D - 50% Width) */}
        <div className="hidden md:flex w-1/2 bg-[#F8FAFC] flex-col items-center justify-center p-10 relative">
          {/* Brand Logo (Top Left) */}
          <div className="absolute top-10 left-10 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black text-emerald-400 font-black text-sm flex items-center justify-center shadow-sm">
              PL
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">PriceLens</span>
          </div>

          {/* 3D Floating Animation */}
          <motion.div
            animate={{ y: [-15, 15, -15] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="flex items-center justify-center my-auto"
          >
            <img
              src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Laptop.png"
              alt="3D Laptop AI Assistant"
              className="w-64 h-64 object-contain drop-shadow-2xl"
            />
          </motion.div>
        </div>

        {/* RIGHT SECTION (Minimalist Form - 50% Width) */}
        <div className="w-full md:w-1/2 bg-white px-10 py-12 md:px-16 flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-[#111]">
            Welcome back
          </h1>
          <p className="text-gray-500 text-sm mb-10">
            Please enter your details to sign in.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email Input */}
            <div className="mb-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full bg-[#F5F7FA] border-none rounded-xl px-5 py-4 text-gray-800 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-black transition-all outline-none"
              />
              {errors.email && (
                <p className="text-rose-500 text-xs mt-1 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="mb-4 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#F5F7FA] border-none rounded-xl px-5 py-4 text-gray-800 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-black transition-all outline-none pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && (
                <p className="text-rose-500 text-xs mt-1 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Form Options (Row) */}
            <div className="flex justify-between items-center my-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 select-none">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-black rounded border-gray-300 focus:ring-black"
                />
                <span>Remember for 30 days</span>
              </label>

              <button
                type="button"
                onClick={onOpenForgotPassword}
                className="text-sm font-semibold text-black hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Primary Black Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black hover:bg-gray-800 text-white rounded-xl py-4 font-semibold text-base transition-all mt-2 cursor-pointer active:scale-[0.99]"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            {/* Google Button */}
            <button
              type="button"
              onClick={() => {
                if (addToast) addToast('Google OAuth Authentication Triggered', 'info');
              }}
              className="w-full bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 rounded-xl py-3.5 flex items-center justify-center gap-3 mt-4 font-semibold transition-all shadow-sm cursor-pointer"
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
              <span>Sign in with Google</span>
            </button>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 mt-10">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="text-black font-bold hover:underline cursor-pointer"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LoginForm = Login;
