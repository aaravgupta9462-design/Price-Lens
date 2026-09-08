import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthContainer } from './components/auth/AuthContainer';
import LandingPage from './components/LandingPage';
import DashboardLayout from './components/dashboard/DashboardLayout';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'landing'

  // For unauthenticated users: show Login / Register Auth Page
  if (!isAuthenticated) {
    return <AuthContainer />;
  }

  // If viewing the Landing Page while logged in
  if (view === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setView('dashboard')}
        isAuthenticated={true}
      />
    );
  }

  // For authenticated users: show the PriceLens multi-store comparison dashboard
  return <DashboardLayout onGoToLanding={() => setView('landing')} />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
