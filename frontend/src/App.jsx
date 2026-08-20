import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { FeatureHighlights } from './components/layout/FeatureHighlights';
import { LoginForm } from './components/auth/LoginForm';
import { SignUpForm } from './components/auth/SignUpForm';
import { MockDashboard } from './components/layout/MockDashboard';
import { ForgotPasswordModal } from './components/auth/ForgotPasswordModal';
import { NotificationToast } from './components/common/NotificationToast';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'

  return (
    <div className="app-viewport">
      {/* Dynamic Background Glowing FX */}
      <div className="bg-ambient-wrapper">
        <div className="ambient-blob ambient-blob-1" />
        <div className="ambient-blob ambient-blob-2" />
        <div className="ambient-blob ambient-blob-3" />
      </div>

      {/* Brand Header */}
      <Header />

      {/* Main Content Area */}
      <main className="main-content">
        {isAuthenticated ? (
          <MockDashboard />
        ) : (
          <div className="auth-grid">
            {/* Desktop Highlights Panel */}
            <FeatureHighlights />

            {/* Form View (Login or Sign Up) */}
            <div>
              {authMode === 'login' ? (
                <LoginForm onSwitchToSignUp={() => setAuthMode('signup')} />
              ) : (
                <SignUpForm onSwitchToLogin={() => setAuthMode('login')} />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          PriceLens &copy; {new Date().getFullYear()} — AI-Powered Price Comparison & Review Analysis Platform. All rights reserved.
        </p>
      </footer>

      {/* Modals & Overlay Components */}
      <ForgotPasswordModal />
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
