import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { SocialLogin } from './SocialLogin';
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, ShieldCheck } from 'lucide-react';

export const Signup = ({ onSwitchToLogin }) => {
  const { signup, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // CREATIVE FEATURE: Password Strength Meter Calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'transparent' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 25, label: 'Weak', color: '#ef4444' };
    if (score <= 3) return { score: 65, label: 'Medium', color: '#f59e0b' };
    return { score: 100, label: 'Strong', color: '#10b981' };
  };

  const strength = getPasswordStrength(formData.password);

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

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required.';
    } else {
      const mobileRegex = /^\d{10}$/;
      if (!mobileRegex.test(formData.mobile.trim())) {
        newErrors.mobile = 'Mobile number must be exactly 10 digits.';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await signup({
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password
      });
    } catch (err) {
      // Error handled in AuthContext
    }
  };

  return (
    <div className="glass-card">
      <div className="form-header">
        <h2 className="form-title">Create Account</h2>
        <p className="form-subtitle">
          Join PriceLens to start comparing deals & review insights.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form-stack" noValidate>
        {/* Full Name */}
        <Input
          label="Full Name"
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="John Doe"
          leftIcon={User}
          error={errors.fullName}
          required
        />

        {/* Email Address */}
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="name@example.com"
          leftIcon={Mail}
          error={errors.email}
          required
          autoComplete="email"
        />

        {/* Mobile Number (10 digits) */}
        <Input
          label="Mobile Number"
          type="tel"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="10-digit Mobile Number"
          leftIcon={Phone}
          error={errors.mobile}
          maxLength={10}
          required
        />

        {/* Password + Strength Meter */}
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
            rightElement={
              <button
                type="button"
                className="input-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />
          {formData.password && (
            <div style={{ marginTop: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                <span>Password Strength</span>
                <span style={{ color: strength.color, fontWeight: '700' }}>{strength.label}</span>
              </div>
              <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${strength.score}%`, background: strength.color, transition: 'all 0.3s ease' }} />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <Input
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          leftIcon={Lock}
          error={errors.confirmPassword}
          required
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          icon={UserPlus}
        >
          Sign Up
        </Button>
      </form>

      <div className="divider-container">
        <div className="divider-line" />
        <span className="divider-text">Or sign up with</span>
        <div className="divider-line" />
      </div>

      <SocialLogin />

      <div className="switch-mode-text">
        Already have an account?
        <button
          type="button"
          className="switch-mode-btn"
          onClick={onSwitchToLogin}
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export const SignUpForm = Signup;
