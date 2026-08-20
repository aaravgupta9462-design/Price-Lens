import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../common/Input';
import { Checkbox } from '../common/Checkbox';
import { Button } from '../common/Button';
import { SocialLogin } from './SocialLogin';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

export const LoginForm = ({ onSwitchToSignUp }) => {
  const { login, isLoading, setIsForgotModalOpen } = useAuth();

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

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
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

    try {
      await login(formData);
    } catch (err) {
      // Error handled by AuthContext via Toast
    }
  };

  return (
    <div className="glass-card">
      <div className="form-header">
        <h2 className="form-title">Welcome Back</h2>
        <p className="form-subtitle">
          Sign in to access AI price comparison and review insights.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form-stack" noValidate>
        {/* Email Field */}
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="name@company.com"
          leftIcon={Mail}
          error={errors.email}
          required
          autoComplete="email"
        />

        {/* Password Field with Show/Hide Option */}
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          leftIcon={Lock}
          error={errors.password}
          required
          autoComplete="current-password"
          rightElement={
            <button
              type="button"
              className="input-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Hide password' : 'Show password'}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        {/* Options Row: Remember Me & Forgot Password */}
        <div className="form-options-row">
          <Checkbox
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            label="Remember me"
          />
          <a
            href="#forgot-password"
            className="forgot-link"
            onClick={(e) => {
              e.preventDefault();
              setIsForgotModalOpen(true);
            }}
          >
            Forgot Password?
          </a>
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          icon={LogIn}
        >
          Sign In
        </Button>
      </form>

      {/* Social Login */}
      <div className="divider-container">
        <div className="divider-line" />
        <span className="divider-text">Or continue with</span>
        <div className="divider-line" />
      </div>

      <SocialLogin />

      {/* Sign Up Switch */}
      <div className="switch-mode-text">
        Don't have an account?
        <button
          type="button"
          className="switch-mode-btn"
          onClick={onSwitchToSignUp}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};
