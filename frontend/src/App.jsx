import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthLayout } from './components/auth/AuthLayout';
import { MockDashboard } from './components/layout/MockDashboard';

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="app-viewport">
        <div className="bg-ambient-wrapper">
          <div className="ambient-blob ambient-blob-1" />
          <div className="ambient-blob ambient-blob-2" />
        </div>
        <main className="main-content">
          <MockDashboard />
        </main>
      </div>
    );
  }

  return <AuthLayout />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
