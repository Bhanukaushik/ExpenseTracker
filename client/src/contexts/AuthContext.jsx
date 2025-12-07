import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token }); // Backend will verify token
    }
    setLoading(false);
  }, []);

  const signup = async (formData) => {
    try {
      const { data } = await authAPI.signup(formData);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      toast.success('Account created!');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Signup failed');
      throw error;
    }
  };

  const login = async (formData) => {
    try {
      const { data } = await authAPI.login(formData);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      toast.success('Welcome back!');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out');
  };

  const value = { user, login, signup, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
