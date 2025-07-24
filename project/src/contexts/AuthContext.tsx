import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '../types';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  refreshUser:()=> Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'https://esb-ats-bndke8f0gza5e8d0.eastus2-01.azurewebsites.net';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.get('/users/me');
      const userData = response.data;
      
      const user: User = {
        id: userData.id.toString(),
        username: userData.username,
        full_name: userData.full_name || `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
        email: userData.email,
        phone:userData.phone,
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
        role: userData.role_name || 'Employee',
        role_name: userData.role_name || 'Employee',
        role_id: userData.role_id || 3,
        status: userData.is_active ? 'Active' : 'Inactive',

         company: userData.company || '',
         department: userData.department || '',
         location: userData.location || '',
         bio: userData.bio || '',    
        
      };

      setUser(user);
    } catch (err) {
      if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
        console.warn('Session expired, invalid token, or insufficient permissions - logging out');
        logout();
      } else {
        console.error('Failed to fetch user profile:', err);
      }
    }
  };

  const refreshUser = async () => {
  await fetchUserProfile();
};
  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true);
       fetchUserProfile(); 
    }
  }, []);

  const login = async (emailOrUsername: string, password: string) => {
    try {
      setError(null);
      
      const formData = new URLSearchParams();
      formData.append('username', emailOrUsername);
      formData.append('password', password);

      const response = await axios.post(`${API_BASE_URL}/auth/login`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      });

      const { access_token } = response.data;
      const token = `Bearer ${access_token}`;
      
      localStorage.setItem('auth_token', token);
      setIsAuthenticated(true);
      await fetchUserProfile();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.detail || 'Invalid username or password';
        setError(message);
      } else {
        setError('An unexpected error occurred');
      }
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, error,refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};