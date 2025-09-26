import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface User {
  email: string;
  role: 'admin' | 'developer';
  first_login: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
  createUser: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  // Get API base URL from environment variables
  const apiBaseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  // Check authentication status on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('userData');
    
    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
      } catch (error) {
        // Invalid stored data, clear it
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
      }
    }
    setIsLoading(false);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${apiBaseURL}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Store authentication data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.data));
        localStorage.setItem('userRole', data.data.role);
        localStorage.setItem('userEmail', data.data.email);
        
        setToken(data.token);
        setUser(data.data);
        
        return { success: true };
      } else {
        // Handle login errors
        if (response.status === 404) {
          return { success: false, error: 'User not found' };
        } else if (response.status === 401) {
          return { success: false, error: 'Invalid password' };
        } else {
          return { success: false, error: data.details || 'Login failed' };
        }
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const updatePassword = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${apiBaseURL}/api/auth/update-password/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.ok) {
        // Update user data to reflect that first_login is now false
        const updatedUser = { ...user!, first_login: false };
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        return { success: true };
      } else {
        if (response.status === 400) {
          return { success: false, error: data.details || 'Password is required' };
        } else if (response.status === 401) {
          return { success: false, error: 'Authentication credentials were not provided' };
        } else if (response.status === 403) {
          return { success: false, error: 'You do not have permission to perform this action' };
        } else {
          return { success: false, error: data.details || 'Failed to update password' };
        }
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const createUser = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${apiBaseURL}/api/auth/create-user/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        if (response.status === 400) {
          return { success: false, error: data.details || 'Email and password are required' };
        } else if (response.status === 401) {
          return { success: false, error: 'Authentication credentials were not provided' };
        } else if (response.status === 403) {
          return { success: false, error: 'Only admin users can create new users' };
        } else {
          return { success: false, error: data.details || 'Failed to create user' };
        }
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    // Clear all possible token storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // Clear session storage as well
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    
    // Reset state
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    updatePassword,
    createUser,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
