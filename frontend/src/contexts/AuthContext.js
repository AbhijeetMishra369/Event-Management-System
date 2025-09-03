import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizeUser = (rawUser) => {
    if (!rawUser || typeof rawUser !== 'object') {
      return null;
    }
    const inferredRole = rawUser.role || rawUser.Role || rawUser.userRole || rawUser.user_type || rawUser.type;
    const normalizedRole = typeof inferredRole === 'string' ? inferredRole.toUpperCase() : undefined;
    return {
      ...rawUser,
      role: normalizedRole,
    };
  };

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (token) {
      // For now, just set loading to false and assume token is valid
      // In production, you'd want to validate the token with the server
      try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData && userData.email) {
          const normalized = normalizeUser(userData);
          // Persist normalized structure so rest of app can rely on user.role
          localStorage.setItem('user', JSON.stringify(normalized));
          setUser(normalized);
        }
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authService.login(email, password);
      const { accessToken, user: userData } = response;
      const normalized = normalizeUser(userData);
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(normalized));
      setUser(normalized);
      return response;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authService.register(userData);
      const { accessToken, user: newUser } = response;
      const normalized = normalizeUser(newUser);
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(normalized));
      setUser(normalized);
      return response;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Profile update failed');
      throw err;
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      setError(null);
      await authService.changePassword(oldPassword, newPassword);
    } catch (err) {
      setError(err.message || 'Password change failed');
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};