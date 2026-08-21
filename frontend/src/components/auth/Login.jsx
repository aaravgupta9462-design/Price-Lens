import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../common/Input';
import { Checkbox } from '../common/Checkbox';
import { Button } from '../common/Button';
import { SocialLogin } from './SocialLogin';
import { Mail, Lock, Eye, EyeOff, LogIn, Phone, ArrowRight } from 'lucide-react';

export const Login = ({ onSwitchToSignUp, onOpenForgotPassword }) => {
  const { login, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    identifier: '', // Email OR 10-digit Mobile Number
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
    const identifierVal = formData.identifier.trim();

    if (!identifierVal) {
      newErrors.identifier = 'Email address or Mobile number is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const mobileRegex = /^\d{10}$/;

      if (!emailRegex.test(identifierVal) && !mobileRegex.test(identifierVal)) {
        newErrors.identifier = 'Please enter a valid Email or 10-digit Mobile Number.';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // TODO: POST /api/v1/auth/login API call (See API_CONTRACTS.md)
    console.log('TODO: Execute POST /api/v1/auth/login payload:', {
      identifier: formData.identifier,
      password: formData.password,
      rememberMe: formData.rememberMe
    });

    try {
      await login({
        email: formData.identifier,
        password: formData.password,
        rememberMe: formData.rememberMe
      });
    } catch (err) {
      // Handled in AuthContext via Toast
    }
  };

  return (
    <div className="glass-card">
      {/* Logo & Tagline Header */}
      <div className="form-header">
        <h2 className="form-title" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          PriceLens<span style={{ color: 'var(--primary-emerald)' }}>.</span>
        </h2>
        <p className="form-subtitle" style={{ color: 'var(--primary-emerald)', fontWeight: '500' }}>
          Compare Prices. Trust Reviews. Buy Smarter.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form-stack" noValidate>
        {/* Email Address or Mobile Number Field */}
        <Input
          label="Email Address or Mobile Number"
          type="text"
          name="identifier"
          value={formData.identifier}
          onChange={handleChange}
          placeholder="name@example.com or 9876543210"
          leftIcon={formData.identifier && /^\d+$/.test(formData.identifier) ? Phone : Mail}
          error={errors.identifier}
          required
        />

        {/* Password Field with Eye/EyeOff Toggle */}
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

        {/* Remember Me Checkbox & Forgot Password Link */}
        <div className="form-options-row">
          <Checkbox
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            label="Remember Me"
          />
          <a
            href="#forgot-password"
            className="forgot-link"
            onClick={(e) => {
              e.preventDefault();
              if (onOpenForgotPassword) onOpenForgotPassword();
            }}
          >
            Forgot Password?
          </a>
        </div>

        {/* Full-width Emerald/Cyan Gradient Button → Login */}
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          icon={ArrowRight}
        >
          Login
        </Button>
      </form>

      {/* Divider */}
      <div className="divider-container">
        <div className="divider-line" />
        <span className="divider-text">Or continue with</span>
        <div className="divider-line" />
      </div>

      {/* Google Login Button */}
      <SocialLogin />

      {/* View Switcher */}
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

export const LoginForm = Login;
