import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthContainer } from './components/auth/AuthContainer';
import LandingPage from './components/LandingPage';

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  // If user is authenticated, show the approved Home Landing Page
  if (isAuthenticated) {
    return <LandingPage onGetStarted={() => {}} isAuthenticated={true} />;
  }

  // Default for unauthenticated users: show the Login / Register Auth Page
  return <AuthContainer />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
