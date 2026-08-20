import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../common/Input';
import { Checkbox } from '../common/Checkbox';
import { Button } from '../common/Button';
import { SocialLogin } from './SocialLogin';
import { Mail, Lock, Eye, EyeOff, LogIn, Phone, Zap, AlertTriangle } from 'lucide-react';

export const Login = ({ onSwitchToSignUp, onOpenForgotPassword }) => {
  const { login, isLoading, addToast } = useAuth();

  const [formData, setFormData] = useState({
    identifier: '', // Email OR 10-digit Mobile Number
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
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

  // Detect Caps Lock key
  const handleKeyDown = (e) => {
    if (e.getModifierState) {
      setCapsLockOn(e.getModifierState('CapsLock'));
    }
  };

  // CREATIVE FEATURE: 1-Click Demo Auto-fill
  const handleAutoFillDemo = () => {
    setFormData({
      identifier: 'student@pricelens.com',
      password: 'password123',
      rememberMe: true
    });
    setErrors({});
    if (addToast) {
      addToast('Demo credentials auto-filled! Click "Login" to test.', 'info');
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
        newErrors.identifier = 'Enter a valid Email or 10-digit Mobile Number.';
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

    try {
      await login({
        email: formData.identifier,
        password: formData.password,
        rememberMe: formData.rememberMe
      });
    } catch (err) {
      // Error handled via AuthContext Toast
    }
  };

  return (
    <div className="glass-card">
      <div className="form-header">
        <h2 className="form-title">PriceLens</h2>
        <p className="form-subtitle" style={{ color: 'var(--primary-emerald)', fontWeight: '500' }}>
          Compare Prices. Trust Reviews. Buy Smarter.
        </p>
      </div>

      {/* CREATIVE FEATURE: Quick Demo Auto-Fill Pill Button */}
      <button
        type="button"
        onClick={handleAutoFillDemo}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          padding: '0.45rem 0.85rem',
          marginBottom: '1.25rem',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(6, 182, 212, 0.1)',
          border: '1px dashed rgba(6, 182, 212, 0.35)',
          color: 'var(--accent-cyan)',
          fontSize: '0.825rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <Zap size={14} />
        <span>⚡ 1-Click Demo Auto-Fill (For Presentation)</span>
      </button>

      <form onSubmit={handleSubmit} className="form-stack" noValidate>
        {/* Email OR Mobile Input */}
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

        {/* Password Input with Show/Hide Toggle & Caps Lock Detection */}
        <div>
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
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />
          {capsLockOn && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--warning)', fontSize: '0.78rem', marginTop: '0.3rem' }}>
              <AlertTriangle size={13} />
              <span>Caps Lock is ON</span>
            </div>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
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

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          icon={LogIn}
        >
          Login
        </Button>
      </form>

      {/* Social Login */}
      <div className="divider-container">
        <div className="divider-line" />
        <span className="divider-text">Or continue with</span>
        <div className="divider-line" />
      </div>

      <SocialLogin />

      {/* Switch to Signup */}
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
