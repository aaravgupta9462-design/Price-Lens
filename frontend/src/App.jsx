import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthContainer } from './components/auth/AuthContainer';
import DashboardLayout from './components/dashboard/DashboardLayout';

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  // For unauthenticated users: show Login / Register Auth Page
  if (!isAuthenticated) {
    return <AuthContainer />;
  }

  // For authenticated users: directly render the PriceLens dashboard
  return <DashboardLayout />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
