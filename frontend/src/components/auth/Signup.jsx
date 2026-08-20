import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { SocialLogin } from './SocialLogin';
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';

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

    console.log('Signup Successful (Simulated):', {
      fullName: formData.fullName,
      email: formData.email,
      mobile: formData.mobile
    });

    try {
      await signup({
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password
      });
    } catch (err) {
      // Error state handled in AuthContext
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

        {/* Password */}
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

// Also export as SignUpForm for backward compatibility
export const SignUpForm = Signup;
