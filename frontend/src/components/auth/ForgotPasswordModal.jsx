import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Mail, X, KeyRound } from 'lucide-react';

export const ForgotPasswordModal = () => {
  const { isForgotModalOpen, setIsForgotModalOpen, resetPassword, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  if (!isForgotModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your account email.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    try {
      await resetPassword(email);
      setEmail('');
    } catch (err) {
      setError(err.message || 'Failed to send reset link.');
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsForgotModalOpen(false)}>
      <div className="glass-card modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={() => setIsForgotModalOpen(false)}>
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(6, 182, 212, 0.15)',
              color: 'var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}
          >
            <KeyRound size={24} />
          </div>
          <h3 className="form-title" style={{ fontSize: '1.35rem' }}>Reset Password</h3>
          <p className="form-subtitle">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="form-stack">
          <Input
            label="Email Address"
            type="email"
            name="reset-email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            placeholder="name@company.com"
            leftIcon={Mail}
            error={error}
            required
          />

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsForgotModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Send Link
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
