import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AuthContainer } from './components/auth/AuthContainer';
import DashboardLayout from './components/dashboard/DashboardLayout';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

const AppContent = () => {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname || '/');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to) => {
    if (window.location.pathname !== to) {
      window.history.pushState({}, '', to);
      setCurrentPath(to);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Normalize path string
  const cleanPath = (currentPath || '/').toLowerCase().replace(/\/+$/, '') || '/';

  // 1. Static Public Pages (Amazon Associates Compliance & Legal Transparency)
  if (cleanPath === '/about') {
    return <AboutPage navigate={navigate} />;
  }

  if (cleanPath === '/privacy') {
    return <PrivacyPage navigate={navigate} />;
  }

  if (cleanPath === '/terms') {
    return <TermsPage navigate={navigate} />;
  }

  // 2. Auth routes
  if (cleanPath === '/login' || cleanPath === '/register' || cleanPath === '/auth') {
    return <AuthContainer />;
  }

  // 3. Default: Open, accessible real shopping intelligence dashboard
  return <DashboardLayout />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
