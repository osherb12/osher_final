import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginInput, RegisterInput, ApiResponse } from '@osher/shared';
import api from '../api/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginInput) => Promise<ApiResponse<{ token: string, user: User }>>;
  register: (data: RegisterInput) => Promise<ApiResponse<{ token: string, user: User }>>;
  updateProfile: (data: Partial<User>) => Promise<ApiResponse<User>>;
  logout: () => void;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  // true while the initial profile fetch is in-flight — ProtectedRoute waits for this
  const [loading, setLoading] = useState<boolean>(!!localStorage.getItem('token'));

  const refreshProfile = async () => {
    if (token) {
      try {
        const data: any = await api.get('/users/profile');
        if (data.success) {
          setUser(data.data);
        } else {
          logout();
        }
      } catch (_err) {
        logout();
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (token) {
      setLoading(true);
      refreshProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (credentials: LoginInput) => {
    try {
      const data: any = await api.post('/auth/login', credentials);
      if (data.success) {
        setToken(data.data.token);
        setUser(data.data.user);
        localStorage.setItem('token', data.data.token);
      }
      return data;
    } catch (err: any) {
      return err;
    }
  };

  const register = async (input: RegisterInput) => {
    try {
      const data: any = await api.post('/auth/register', input);
      if (data.success) {
        setToken(data.data.token);
        setUser(data.data.user);
        localStorage.setItem('token', data.data.token);
      }
      return data;
    } catch (err: any) {
      return err;
    }
  };

  const updateProfile = async (input: Partial<User>) => {
    try {
      const data: any = await api.put('/users/profile', input);
      if (data.success) {
        setUser(data.data);
      }
      return data;
    } catch (err: any) {
      return err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, updateProfile, logout, isAdmin, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
