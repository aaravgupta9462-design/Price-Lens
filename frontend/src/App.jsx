import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthContainer } from './components/auth/AuthContainer';
import LandingPage from './components/LandingPage';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  // If auth form was requested and user is now authenticated, go back to landing
  if (isAuthenticated) {
    return <LandingPage onGetStarted={() => {}} isAuthenticated />;
  }

  // Show auth form when user clicks Get Started
  if (showAuth) {
    return <AuthContainer />;
  }

  // Default: show marketing landing page
  return <LandingPage onGetStarted={() => setShowAuth(true)} isAuthenticated={false} />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
