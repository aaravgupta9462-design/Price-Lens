import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { triggerGoogleLogin } from '../services/googleAuth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('pricelens_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  // Sync user state with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('pricelens_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pricelens_user');
    }
  }, [user]);

  // Helper to add toast notifications
  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Login handler
  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const response = await apiService.login(credentials);
      setUser(response.user);
      addToast(`Welcome back, ${response.user.name || 'User'}!`, 'success');
      return response;
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up handler
  const signup = async (userData) => {
    setIsLoading(true);
    try {
      const response = await apiService.signup(userData);
      setUser(response.user);
      addToast('Account created successfully!', 'success');
      return response;
    } catch (err) {
      addToast(err.message || 'Sign up failed', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Real Google OAuth handler
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      addToast('Opening Google Sign-In...', 'info');
      const result = await triggerGoogleLogin();
      setUser(result.user);
      addToast(`Welcome, ${result.user.name}! Signed in with Google.`, 'success');
      return result;
    } catch (err) {
      console.error('Google Auth Error:', err);
      addToast(err.message || 'Google Sign-In failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Update Profile handler
  const updateProfile = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...(prev || {}), ...updatedFields };
      localStorage.setItem('pricelens_user', JSON.stringify(updated));
      return updated;
    });
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    localStorage.removeItem('pricelens_user');
    addToast('Logged out successfully.', 'info');
  };

  // Reset password simulation
  const resetPassword = async (email) => {
    setIsLoading(true);
    try {
      const response = await apiService.resetPassword(email);
      addToast(response.message, 'success');
      setIsForgotModalOpen(false);
      return response;
    } catch (err) {
      addToast(err.message || 'Reset failed', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        signup,
        loginWithGoogle,
        updateProfile,
        logout,
        resetPassword,
        toasts,
        addToast,
        removeToast,
        isForgotModalOpen,
        setIsForgotModalOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
