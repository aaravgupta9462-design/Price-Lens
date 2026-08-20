import React, { createContext, useContext, useState } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

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

  // Logout handler
  const logout = () => {
    setUser(null);
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
