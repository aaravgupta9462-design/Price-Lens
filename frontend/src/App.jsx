import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthContainer } from './components/auth/AuthContainer';
import DashboardLayout from './components/dashboard/DashboardLayout';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // If user explicitly clicked Sign In / Register
  if (showAuthModal) {
    return (
      <AuthContainer
        onClose={() => setShowAuthModal(false)}
      />
    );
  }

  // Default: Directly render the full PriceLens Shopping Intelligence Homepage
  return (
    <DashboardLayout
      onOpenAuth={() => setShowAuthModal(true)}
    />
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
