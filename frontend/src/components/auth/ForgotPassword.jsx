import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Mail, Phone, KeyRound, Lock, Eye, EyeOff, CheckCircle2, ArrowLeft, RefreshCw } from 'lucide-react';

export const ForgotPassword = ({ onBackToLogin }) => {
  // Step 1: Request OTP, Step 2: Verify OTP, Step 3: Reset Password, Step 4: Success Message
  const [step, setStep] = useState(1);

  // Step 1 State
  const [identifier, setIdentifier] = useState('');
  const [identifierError, setIdentifierError] = useState('');

  // Step 2 State
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  // Step 3 State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  // Step 1 Handler: Validate Email/Mobile & Send OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    const val = identifier.trim();
    if (!val) {
      setIdentifierError('Email address or Mobile number is required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^\d{10}$/;

    if (!emailRegex.test(val) && !mobileRegex.test(val)) {
      setIdentifierError('Please enter a valid Email or 10-digit Mobile Number.');
      return;
    }

    setIdentifierError('');
    console.log('OTP Sent to:', val);
    setStep(2);
  };

  // Step 2 Handler: Verify 6-digit OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const cleanOtp = otp.trim();
    if (!cleanOtp) {
      setOtpError('Please enter the 6-digit OTP.');
      return;
    }

    if (!/^\d{6}$/.test(cleanOtp)) {
      setOtpError('OTP must be exactly 6 numeric digits.');
      return;
    }

    setOtpError('');
    console.log('OTP Verified successfully:', cleanOtp);
    setStep(3);
  };

  const handleResendOtp = () => {
    setIsResending(true);
    setResendMessage('');
    setTimeout(() => {
      setIsResending(false);
      setResendMessage('A new 6-digit OTP has been sent!');
      console.log('Resent OTP to:', identifier);
    }, 1000);
  };

  // Step 3 Handler: Validate Passwords & Reset
  const handleResetPassword = (e) => {
    e.preventDefault();
    const errors = {};

    if (!newPassword) {
      errors.newPassword = 'New Password is required.';
    } else if (newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters long.';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password.';
    } else if (confirmPassword !== newPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordErrors({});
    console.log('Password successfully reset for:', identifier);
    setStep(4); // Success state
  };

  return (
    <div className="glass-card">
      {/* Header back button if not in success state */}
      {step < 4 && (
        <button
          type="button"
          onClick={onBackToLogin}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            padding: 0
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Sign In</span>
        </button>
      )}

      {/* STEP 1: REQUEST OTP */}
      {step === 1 && (
        <>
          <div className="form-header">
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.15)',
                color: 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}
            >
              <KeyRound size={22} />
            </div>
            <h2 className="form-title">Forgot Password</h2>
            <p className="form-subtitle">
              Enter your registered email or 10-digit mobile number to receive a verification OTP.
            </p>
          </div>

          <form onSubmit={handleSendOtp} className="form-stack" noValidate>
            <Input
              label="Email Address or Mobile Number"
              type="text"
              name="identifier"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (identifierError) setIdentifierError('');
              }}
              placeholder="name@example.com or 9876543210"
              leftIcon={identifier && /^\d+$/.test(identifier) ? Phone : Mail}
              error={identifierError}
              required
            />

            <Button type="submit" variant="primary">
              Send OTP
            </Button>
          </form>
        </>
      )}

      {/* STEP 2: VERIFY OTP */}
      {step === 2 && (
        <>
          <div className="form-header">
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--primary-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}
            >
              <Mail size={22} />
            </div>
            <h2 className="form-title">Enter OTP Code</h2>
            <p className="form-subtitle">
              We sent a 6-digit OTP code to <strong style={{ color: 'var(--text-primary)' }}>{identifier}</strong>.
            </p>
          </div>

          <form onSubmit={handleVerifyOtp} className="form-stack" noValidate>
            <Input
              label="6-Digit OTP Code"
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                if (otpError) setOtpError('');
              }}
              placeholder="123456"
              maxLength={6}
              leftIcon={KeyRound}
              error={otpError}
              required
            />

            <Button type="submit" variant="primary">
              Verify OTP
            </Button>
          </form>

          <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Didn't receive code?{' '}
            <button
              type="button"
              className="switch-mode-btn"
              onClick={handleResendOtp}
              disabled={isResending}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <RefreshCw size={12} className={isResending ? 'spin' : ''} />
              <span>{isResending ? 'Sending...' : 'Resend OTP'}</span>
            </button>
          </div>

          {resendMessage && (
            <div style={{ fontSize: '0.8rem', color: 'var(--primary-emerald)', textAlign: 'center', marginTop: '0.5rem' }}>
              {resendMessage}
            </div>
          )}
        </>
      )}

      {/* STEP 3: RESET PASSWORD */}
      {step === 3 && (
        <>
          <div className="form-header">
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--accent-indigo)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}
            >
              <Lock size={22} />
            </div>
            <h2 className="form-title">Set New Password</h2>
            <p className="form-subtitle">
              Your identity is verified! Enter a strong new password below.
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="form-stack" noValidate>
            <Input
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              name="newPassword"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (passwordErrors.newPassword) setPasswordErrors((prev) => ({ ...prev, newPassword: '' }));
              }}
              placeholder="••••••••"
              leftIcon={Lock}
              error={passwordErrors.newPassword}
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

            <Input
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (passwordErrors.confirmPassword) setPasswordErrors((prev) => ({ ...prev, confirmPassword: '' }));
              }}
              placeholder="••••••••"
              leftIcon={Lock}
              error={passwordErrors.confirmPassword}
              required
            />

            <Button type="submit" variant="primary">
              Reset Password
            </Button>
          </form>
        </>
      )}

      {/* STEP 4: SUCCESS CONFIRMATION */}
      {step === 4 && (
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--primary-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              border: '2px solid rgba(16, 185, 129, 0.4)'
            }}
          >
            <CheckCircle2 size={32} />
          </div>

          <h2 className="form-title" style={{ fontSize: '1.6rem' }}>Password Reset Complete!</h2>
          <p className="form-subtitle" style={{ marginBottom: '1.75rem' }}>
            Your password has been updated successfully. You can now sign in with your new credentials.
          </p>

          <Button variant="primary" onClick={onBackToLogin}>
            Sign In Now
          </Button>
        </div>
      )}
    </div>
  );
};
