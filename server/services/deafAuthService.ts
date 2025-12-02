/**
 * DeafAuth Service - Custom authentication service for deaf-first platforms
 * 
 * This service provides authentication functionality tailored for the deaf community,
 * supporting ASL video verification, visual notifications, and accessibility-first authentication.
 * It integrates with Supabase for backend authentication and session management.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

// Environment variables for Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
const JWT_SECRET = process.env.JWT_SECRET || 'deaf-auth-secret-key-change-in-production';

/**
 * DeafAuth user profile interface
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
 * Accessibility settings for user preferences
 */
export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  visualAlerts: boolean;
  vibrationFeedback: boolean;
  captionsEnabled: boolean;
  aslVideoSpeed: number; // 0.5 - 2.0
  preferredLanguage: string;
}

/**
 * Default accessibility settings
 */
const defaultAccessibilitySettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  visualAlerts: true,
  vibrationFeedback: true,
  captionsEnabled: true,
  aslVideoSpeed: 1.0,
  preferredLanguage: 'en',
};

/**
 * Authentication response interface
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: DeafAuthUser;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
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
 * DeafAuth Service Class
 */
class DeafAuthService {
  private supabase: SupabaseClient | null = null;
  private initialized: boolean = false;

  /**
   * Initialize the DeafAuth service with Supabase connection
   */
  initialize(): boolean {
    if (this.initialized && this.supabase) {
      return true;
    }

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.warn('DeafAuth: Supabase credentials not configured. Running in mock mode.');
      this.initialized = true;
      return true;
    }

    try {
      this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      });
      this.initialized = true;
      console.log('DeafAuth: Service initialized successfully');
      return true;
    } catch (error) {
      console.error('DeafAuth: Failed to initialize Supabase client:', error);
      return false;
    }
  }

  /**
   * Check if the service is properly initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Check if Supabase is configured
   */
  hasSupabaseConfig(): boolean {
    return !!(SUPABASE_URL && SUPABASE_KEY);
  }

  /**
   * Register a new user with DeafAuth
   */
  async register(data: RegistrationData): Promise<AuthResponse> {
    this.ensureInitialized();

    const { email, password, username, isDeaf = false, preferASL = false, communicationPreference = 'text', accessibilitySettings } = data;

    // Validate input
    if (!email || !password || !username) {
      return {
        success: false,
        message: 'Email, password, and username are required',
      };
    }

    // Password validation
    if (password.length < 8) {
      return {
        success: false,
        message: 'Password must be at least 8 characters long',
      };
    }

    try {
      if (this.supabase) {
        // Register with Supabase Auth
        const { data: authData, error: authError } = await this.supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
              is_deaf: isDeaf,
              prefer_asl: preferASL,
              communication_preference: communicationPreference,
              accessibility_settings: { ...defaultAccessibilitySettings, ...accessibilitySettings },
            },
          },
        });

        if (authError) {
          return {
            success: false,
            message: authError.message,
          };
        }

        if (!authData.user) {
          return {
            success: false,
            message: 'Registration failed: No user created',
          };
        }

        const user = this.mapSupabaseUser(authData.user);
        const token = this.generateToken(user);

        return {
          success: true,
          message: 'Registration successful. Please check your email for verification.',
          user,
          token,
          accessToken: authData.session?.access_token,
          refreshToken: authData.session?.refresh_token,
          expiresIn: 3600,
        };
      } else {
        // Mock mode - create a mock user for development
        const mockUser: DeafAuthUser = {
          id: `mock-${Date.now()}`,
          email,
          username,
          isDeaf,
          preferASL,
          communicationPreference,
          aslVerified: false,
          accessibilitySettings: { ...defaultAccessibilitySettings, ...accessibilitySettings },
          createdAt: new Date(),
          lastLoginAt: new Date(),
        };

        const token = this.generateToken(mockUser);

        return {
          success: true,
          message: 'Registration successful (mock mode)',
          user: mockUser,
          token,
          expiresIn: 3600,
        };
      }
    } catch (error) {
      console.error('DeafAuth: Registration error:', error);
      return {
        success: false,
        message: 'Registration failed. Please try again.',
      };
    }
  }

  /**
   * Login a user with DeafAuth
   */
  async login(data: LoginData): Promise<AuthResponse> {
    this.ensureInitialized();

    const { email, password } = data;

    if (!email || !password) {
      return {
        success: false,
        message: 'Email and password are required',
      };
    }

    try {
      if (this.supabase) {
        const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          return {
            success: false,
            message: authError.message,
          };
        }

        if (!authData.user) {
          return {
            success: false,
            message: 'Login failed: Invalid credentials',
          };
        }

        const user = this.mapSupabaseUser(authData.user);
        const token = this.generateToken(user);

        return {
          success: true,
          message: 'Login successful',
          user,
          token,
          accessToken: authData.session?.access_token,
          refreshToken: authData.session?.refresh_token,
          expiresIn: 3600,
        };
      } else {
        // Mock mode login
        const mockUser: DeafAuthUser = {
          id: `mock-${Date.now()}`,
          email,
          username: email.split('@')[0],
          isDeaf: true,
          preferASL: true,
          communicationPreference: 'asl',
          aslVerified: false,
          accessibilitySettings: defaultAccessibilitySettings,
          createdAt: new Date(),
          lastLoginAt: new Date(),
        };

        const token = this.generateToken(mockUser);

        return {
          success: true,
          message: 'Login successful (mock mode)',
          user: mockUser,
          token,
          expiresIn: 3600,
        };
      }
    } catch (error) {
      console.error('DeafAuth: Login error:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.',
      };
    }
  }

  /**
   * Logout the current user
   */
  async logout(): Promise<AuthResponse> {
    this.ensureInitialized();

    try {
      if (this.supabase) {
        const { error } = await this.supabase.auth.signOut();
        if (error) {
          return {
            success: false,
            message: error.message,
          };
        }
      }

      return {
        success: true,
        message: 'Logout successful',
      };
    } catch (error) {
      console.error('DeafAuth: Logout error:', error);
      return {
        success: false,
        message: 'Logout failed. Please try again.',
      };
    }
  }

  /**
   * Verify a JWT token and get user info
   */
  async verifyToken(token: string): Promise<DeafAuthUser | null> {
    this.ensureInitialized();

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as DeafAuthUser;
      return decoded;
    } catch (error) {
      console.error('DeafAuth: Token verification failed:', error);
      return null;
    }
  }

  /**
   * Get the current user session
   */
  async getCurrentUser(): Promise<DeafAuthUser | null> {
    this.ensureInitialized();

    if (!this.supabase) {
      return null;
    }

    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();

      if (error || !user) {
        return null;
      }

      return this.mapSupabaseUser(user);
    } catch (error) {
      console.error('DeafAuth: Failed to get current user:', error);
      return null;
    }
  }

  /**
   * Refresh the user's session token
   */
  async refreshSession(): Promise<AuthResponse> {
    this.ensureInitialized();

    if (!this.supabase) {
      return {
        success: false,
        message: 'Supabase not configured',
      };
    }

    try {
      const { data, error } = await this.supabase.auth.refreshSession();

      if (error) {
        return {
          success: false,
          message: error.message,
        };
      }

      if (!data.user || !data.session) {
        return {
          success: false,
          message: 'Session refresh failed',
        };
      }

      const user = this.mapSupabaseUser(data.user);
      const token = this.generateToken(user);

      return {
        success: true,
        message: 'Session refreshed',
        user,
        token,
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: 3600,
      };
    } catch (error) {
      console.error('DeafAuth: Session refresh error:', error);
      return {
        success: false,
        message: 'Session refresh failed',
      };
    }
  }

  /**
   * Update user accessibility settings
   */
  async updateAccessibilitySettings(userId: string, settings: Partial<AccessibilitySettings>): Promise<AuthResponse> {
    this.ensureInitialized();

    if (!this.supabase) {
      return {
        success: true,
        message: 'Settings updated (mock mode)',
      };
    }

    try {
      const { data, error } = await this.supabase.auth.updateUser({
        data: {
          accessibility_settings: settings,
        },
      });

      if (error) {
        return {
          success: false,
          message: error.message,
        };
      }

      if (data.user) {
        return {
          success: true,
          message: 'Accessibility settings updated',
          user: this.mapSupabaseUser(data.user),
        };
      }

      return {
        success: false,
        message: 'Failed to update settings',
      };
    } catch (error) {
      console.error('DeafAuth: Update settings error:', error);
      return {
        success: false,
        message: 'Failed to update settings',
      };
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<AuthResponse> {
    this.ensureInitialized();

    if (!email) {
      return {
        success: false,
        message: 'Email is required',
      };
    }

    if (!this.supabase) {
      return {
        success: true,
        message: 'Password reset email sent (mock mode)',
      };
    }

    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.APP_URL || 'http://localhost:5000'}/auth/reset-password`,
      });

      if (error) {
        return {
          success: false,
          message: error.message,
        };
      }

      return {
        success: true,
        message: 'Password reset email sent. Check your inbox.',
      };
    } catch (error) {
      console.error('DeafAuth: Password reset error:', error);
      return {
        success: false,
        message: 'Failed to send reset email',
      };
    }
  }

  /**
   * Generate a JWT token for the user
   */
  private generateToken(user: DeafAuthUser): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        isDeaf: user.isDeaf,
        preferASL: user.preferASL,
        communicationPreference: user.communicationPreference,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  /**
   * Map Supabase user to DeafAuth user
   */
  private mapSupabaseUser(supabaseUser: any): DeafAuthUser {
    const metadata = supabaseUser.user_metadata || {};

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      username: metadata.username || supabaseUser.email?.split('@')[0] || '',
      isDeaf: metadata.is_deaf || false,
      preferASL: metadata.prefer_asl || false,
      communicationPreference: metadata.communication_preference || 'text',
      aslVerified: metadata.asl_verified || false,
      accessibilitySettings: metadata.accessibility_settings || defaultAccessibilitySettings,
      createdAt: new Date(supabaseUser.created_at),
      lastLoginAt: new Date(supabaseUser.last_sign_in_at || supabaseUser.created_at),
    };
  }

  /**
   * Ensure the service is initialized before operations
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      this.initialize();
    }
  }
}

// Create singleton instance
export const deafAuthService = new DeafAuthService();

// Initialize on module load
deafAuthService.initialize();

export default deafAuthService;
