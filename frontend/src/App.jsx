import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthContainer } from './components/auth/AuthContainer';
import DashboardLayout from './components/dashboard/DashboardLayout';
import ShowcaseLanding from './components/ShowcaseLanding';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname || '/');
  const [showShowcase, setShowShowcase] = useState(() => {
    const path = (window.location.pathname || '/').toLowerCase();
    if (path === '/showcase' || path === '/story') return true;
    return !sessionStorage.getItem('pl_entered_dashboard');
  });

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

  const enterDashboard = () => {
    sessionStorage.setItem('pl_entered_dashboard', '1');
    setShowShowcase(false);
    if (cleanPath === '/showcase' || cleanPath === '/story') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const openShowcase = () => {
    sessionStorage.removeItem('pl_entered_dashboard');
    setShowShowcase(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // 2. Auth routes or modal
  if (showAuthModal || cleanPath === '/login' || cleanPath === '/register' || cleanPath === '/auth') {
    return (
      <AuthContainer
        onClose={() => {
          setShowAuthModal(false);
          enterDashboard();
          if (cleanPath !== '/') navigate('/');
        }}
      />
    );
  }

  // 3. Awwwards-Style 3D Scroll-Telling Showcase
  if (showShowcase || cleanPath === '/showcase' || cleanPath === '/story') {
    return (
      <ShowcaseLanding
        onLaunchDashboard={enterDashboard}
        onOpenAuth={() => setShowAuthModal(true)}
      />
    );
  }

  // 4. Default: Open, accessible real shopping intelligence dashboard
  return (
    <DashboardLayout
      onOpenAuth={() => setShowAuthModal(true)}
      onOpenShowcase={openShowcase}
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
