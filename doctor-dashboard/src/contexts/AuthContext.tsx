import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import type { User } from '../types/types';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config/api';


interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user and token from localStorage on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      const { token, user: userData } = data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      toast.success('Logged in successfully!');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Login failed');
        throw new Error(err.response?.data?.message || 'Login failed');
      } else if (err instanceof Error) {
        toast.error(err.message);
        throw err;
      } else {
        toast.error('An unknown error occurred');
        throw new Error('An unknown error occurred');
      }
    }
  };

  const register = async (email: string, password: string, name: string, role: string) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/register`, { email, password, name, role });
      const { token, user: userData } = data;

      // localStorage.setItem('token', token);
      // localStorage.setItem('user', JSON.stringify(userData));

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);

      toast.success('Registration successful! Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Registration failed');
        throw new Error(err.response?.data?.message || 'Registration failed');
      } else if (err instanceof Error) {
        toast.error(err.message);
        throw err;
      } else {
        toast.error('An unknown error occurred');
        throw new Error('An unknown error occurred');
      }
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
