import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = api.getToken();
    const cachedUser = localStorage.getItem('sushrut_user');
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch (e) {
        localStorage.removeItem('sushrut_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success && res.accessToken) {
      api.setToken(res.accessToken);
      setUser(res.user);
      localStorage.setItem('sushrut_user', JSON.stringify(res.user));
      return res.user;
    }
    throw new Error('Login failed');
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
    localStorage.removeItem('sushrut_user');
  };

  /**
   * 1-Click Fast Role Switcher for instant evaluator testing
   */
  const switchRole = async (targetRole) => {
    const credentials = {
      patient: { email: 'patient@sushrut.com', password: 'Password@123' },
      doctor: { email: 'doctor@sushrut.com', password: 'Password@123' },
      laboratory: { email: 'lab@sushrut.com', password: 'Password@123' },
      admin: { email: 'admin@sushrut.com', password: 'Password@123' }
    };
    const cred = credentials[targetRole];
    if (cred) {
      return await login(cred.email, cred.password);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
