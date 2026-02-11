import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    if (API.isAuthenticated()) {
      try {
        const userData = await API.getMe();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (username, password) => {
    await API.login(username, password);
    await refreshUser();
  };

  const logout = () => {
    API.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
