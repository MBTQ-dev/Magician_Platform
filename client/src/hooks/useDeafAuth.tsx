/**
 * DeafAuth Context - React context for authentication state management
 * 
 * This context provides authentication state and methods for:
 * - User login/logout
 * - Registration
 * - Session management
 * - Accessibility settings
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

/**
 * User interface for authenticated users
 */
export interface DeafAuthUser {
  id: string;
  email: string;
  username: string;
  isDeaf: boolean;
  preferASL: boolean;
  communicationPreference: 'asl' | 'text' | 'mixed';
  aslVerified: boolean;
  accessibilitySettings: AccessibilitySettings;
  createdAt: Date;
  lastLoginAt: Date;
}

/**
 * Accessibility settings interface
 */
export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  visualAlerts: boolean;
  vibrationFeedback: boolean;
  captionsEnabled: boolean;
  aslVideoSpeed: number;
  preferredLanguage: string;
}

/**
 * Registration data interface
 */
export interface RegistrationData {
  email: string;
  password: string;
  username: string;
  isDeaf?: boolean;
  preferASL?: boolean;
  communicationPreference?: 'asl' | 'text' | 'mixed';
  accessibilitySettings?: Partial<AccessibilitySettings>;
}

/**
 * Login data interface
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * Authentication context interface
 */
export interface DeafAuthContextType {
  user: DeafAuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<boolean>;
  register: (data: RegistrationData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  updateAccessibilitySettings: (settings: Partial<AccessibilitySettings>) => Promise<boolean>;
  clearError: () => void;
}

/**
 * Default context value
 */
const defaultContextValue: DeafAuthContextType = {
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  refreshSession: async () => false,
  updateAccessibilitySettings: async () => false,
  clearError: () => {},
};

/**
 * Create the DeafAuth context
 */
const DeafAuthContext = createContext<DeafAuthContextType>(defaultContextValue);

/**
 * API base URL
 */
const API_BASE_URL = '/api/auth';

/**
 * DeafAuth Provider Props
 */
interface DeafAuthProviderProps {
  children: ReactNode;
}

/**
 * DeafAuth Provider Component
 */
export function DeafAuthProvider({ children }: DeafAuthProviderProps) {
  const [user, setUser] = useState<DeafAuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Check authentication status on mount
   */
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Check current authentication status
   */
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Auth status check failed:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login with email and password
   */
  const login = useCallback(async (data: LoginData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setUser(result.user);
        
        // Store token in localStorage as backup
        if (result.token) {
          localStorage.setItem('deafauth_token', result.token);
        }
        
        return true;
      } else {
        setError(result.message || 'Login failed');
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your connection and try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Register a new user
   */
  const register = useCallback(async (data: RegistrationData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setUser(result.user);
        
        // Store token in localStorage as backup
        if (result.token) {
          localStorage.setItem('deafauth_token', result.token);
        }
        
        return true;
      } else {
        setError(result.message || 'Registration failed');
        return false;
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please check your connection and try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout the current user
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Clear user state
      setUser(null);
      
      // Clear stored token
      localStorage.removeItem('deafauth_token');
    } catch (err) {
      console.error('Logout error:', err);
      // Still clear user state even if logout request fails
      setUser(null);
      localStorage.removeItem('deafauth_token');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh the current session
   */
  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setUser(result.user);
        
        if (result.token) {
          localStorage.setItem('deafauth_token', result.token);
        }
        
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Session refresh error:', err);
      return false;
    }
  }, []);

  /**
   * Update accessibility settings
   */
  const updateAccessibilitySettings = useCallback(async (settings: Partial<AccessibilitySettings>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/accessibility-settings`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setUser(result.user);
        return true;
      } else {
        setError(result.message || 'Failed to update settings');
        return false;
      }
    } catch (err) {
      console.error('Settings update error:', err);
      setError('Failed to update settings. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear any error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: DeafAuthContextType = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshSession,
    updateAccessibilitySettings,
    clearError,
  };

  return (
    <DeafAuthContext.Provider value={value}>
      {children}
    </DeafAuthContext.Provider>
  );
}

/**
 * Custom hook to use the DeafAuth context
 */
export function useDeafAuth(): DeafAuthContextType {
  const context = useContext(DeafAuthContext);
  
  if (!context) {
    throw new Error('useDeafAuth must be used within a DeafAuthProvider');
  }
  
  return context;
}

/**
 * Higher-order component for protected routes
 */
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: { redirectTo?: string }
): React.FC<P> {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, loading } = useDeafAuth();

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      // Redirect to login page or show unauthorized message
      if (options?.redirectTo && typeof window !== 'undefined') {
        window.location.href = options.redirectTo;
        return null;
      }
      
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Authentication Required</h2>
            <p className="text-slate-600 mb-6">
              Please sign in to access this page.
            </p>
            <a 
              href="/login" 
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}

export default DeafAuthContext;
