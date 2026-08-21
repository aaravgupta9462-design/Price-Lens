import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthContainer } from './components/auth/AuthContainer';
import { MockDashboard } from './components/layout/MockDashboard';

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="app-viewport">
        <main className="main-content">
          <MockDashboard />
        </main>
      </div>
    );
  }

  return <AuthContainer />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
