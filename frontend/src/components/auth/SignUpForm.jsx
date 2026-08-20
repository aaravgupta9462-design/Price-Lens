import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../common/Input';
import { Checkbox } from '../common/Checkbox';
import { Button } from '../common/Button';
import { SocialLogin } from './SocialLogin';
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';

export const SignUpForm = ({ onSwitchToLogin }) => {
  const { signup, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
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

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

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

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms of service.';
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
        password: formData.password
      });
    } catch (err) {
      // Error handled in AuthContext
    }
  };

  return (
    <div className="glass-card">
      <div className="form-header">
        <h2 className="form-title">Create an Account</h2>
        <p className="form-subtitle">
          Join PriceLens to start comparing deals and analyzing reviews.
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
          placeholder="Alex Johnson"
          leftIcon={User}
          error={errors.fullName}
          required
        />

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

        {/* Terms Checkbox */}
        <div style={{ marginTop: '0.2rem' }}>
          <Checkbox
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            label="I agree to the Terms of Service & Privacy Policy"
          />
          {errors.acceptTerms && (
            <div className="input-error-msg" style={{ marginTop: '0.25rem' }}>
              <span>{errors.acceptTerms}</span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          icon={UserPlus}
        >
          Create Free Account
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
