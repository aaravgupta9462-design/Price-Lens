import React, { useState } from 'react';
import { Header } from '../layout/Header';
import { FeatureHighlights } from '../layout/FeatureHighlights';
import { Login } from './Login';
import { Signup } from './Signup';
import { ForgotPassword } from './ForgotPassword';
import { TiltCard } from '../common/TiltCard';
import { NotificationToast } from '../common/NotificationToast';

export const AuthLayout = () => {
  // 'login' | 'signup' | 'forgot'
  const [currentView, setCurrentView] = useState('login');

  return (
    <div className="app-viewport">
      {/* Dynamic Ambient Background Blur */}
      <div className="bg-ambient-wrapper">
        <div className="ambient-blob ambient-blob-1" />
        <div className="ambient-blob ambient-blob-2" />
        <div className="ambient-blob ambient-blob-3" />
      </div>

      {/* Brand Header */}
      <Header />

      {/* Main Content Grid */}
      <main className="main-content">
        <div className="auth-grid">
          {/* Left Side: Desktop Features & Highlights */}
          <FeatureHighlights />

          {/* Right Side: 3D Mouse Tilt Card Wrapper */}
          <TiltCard>
            {currentView === 'login' && (
              <Login
                onSwitchToSignUp={() => setCurrentView('signup')}
                onOpenForgotPassword={() => setCurrentView('forgot')}
              />
            )}

            {currentView === 'signup' && (
              <Signup
                onSwitchToLogin={() => setCurrentView('login')}
              />
            )}

            {currentView === 'forgot' && (
              <ForgotPassword
                onBackToLogin={() => setCurrentView('login')}
              />
            )}
          </TiltCard>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          PriceLens &copy; {new Date().getFullYear()} — AI-Powered Price Comparison & Review Analysis Platform.
        </p>
      </footer>

      {/* Toast Container */}
      <NotificationToast />
    </div>
  );
};
