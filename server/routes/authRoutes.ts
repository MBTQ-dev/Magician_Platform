/**
 * Authentication Routes - API endpoints for DeafAuth authentication
 * 
 * This module provides REST API endpoints for:
 * - User registration
 * - User login
 * - User logout
 * - Session management
 * - Password reset
 * - Accessibility settings
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { deafAuthService, RegistrationData, LoginData } from '../services/deafAuthService';
import { 
  requireAuth, 
  optionalAuth, 
  authRateLimiter, 
  authLogger,
  AuthenticatedRequest 
} from '../middleware/deafAuthMiddleware';

const router = Router();

// Apply auth logger to all routes
router.use(authLogger);

/**
 * Registration schema validation
 */
const registrationSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username must be at most 50 characters'),
  isDeaf: z.boolean().optional().default(false),
  preferASL: z.boolean().optional().default(false),
  communicationPreference: z.enum(['asl', 'text', 'mixed']).optional().default('text'),
  accessibilitySettings: z.object({
    highContrast: z.boolean().optional(),
    largeText: z.boolean().optional(),
    visualAlerts: z.boolean().optional(),
    vibrationFeedback: z.boolean().optional(),
    captionsEnabled: z.boolean().optional(),
    aslVideoSpeed: z.number().min(0.5).max(2.0).optional(),
    preferredLanguage: z.string().optional(),
  }).optional(),
});

/**
 * Login schema validation
 */
const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', authRateLimiter, async (req: Request, res: Response) => {
  try {
    const validatedData = registrationSchema.parse(req.body);
    const registrationData: RegistrationData = {
      email: validatedData.email,
      password: validatedData.password,
      username: validatedData.username,
      isDeaf: validatedData.isDeaf,
      preferASL: validatedData.preferASL,
      communicationPreference: validatedData.communicationPreference,
      accessibilitySettings: validatedData.accessibilitySettings,
    };

    const result = await deafAuthService.register(registrationData);

    if (result.success) {
      // Set token in cookie for browser clients
      if (result.token) {
        res.cookie('deafauth_token', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });
      }

      res.status(201).json({
        success: true,
        message: result.message,
        user: result.user,
        token: result.token,
        expiresIn: result.expiresIn,
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: fromZodError(error).message,
        errors: error.errors,
      });
    } else {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed. Please try again.',
      });
    }
  }
});

/**
 * POST /api/auth/login
 * Login a user
 */
router.post('/login', authRateLimiter, async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const loginData: LoginData = {
      email: validatedData.email,
      password: validatedData.password,
    };

    const result = await deafAuthService.login(loginData);

    if (result.success) {
      // Set token in cookie for browser clients
      if (result.token) {
        res.cookie('deafauth_token', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });
      }

      res.status(200).json({
        success: true,
        message: result.message,
        user: result.user,
        token: result.token,
        expiresIn: result.expiresIn,
      });
    } else {
      res.status(401).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: fromZodError(error).message,
        errors: error.errors,
      });
    } else {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed. Please try again.',
      });
    }
  }
});

/**
 * POST /api/auth/logout
 * Logout the current user
 */
router.post('/logout', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await deafAuthService.logout();

    // Clear the auth cookie
    res.clearCookie('deafauth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed. Please try again.',
    });
  }
});

/**
 * GET /api/auth/me
 * Get the current authenticated user
 */
router.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user information',
    });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh the authentication session
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const result = await deafAuthService.refreshSession();

    if (result.success) {
      if (result.token) {
        res.cookie('deafauth_token', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 * 1000,
        });
      }

      res.status(200).json({
        success: true,
        message: result.message,
        user: result.user,
        token: result.token,
        expiresIn: result.expiresIn,
      });
    } else {
      res.status(401).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error('Session refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Session refresh failed',
    });
  }
});

/**
 * POST /api/auth/forgot-password
 * Request a password reset
 */
router.post('/forgot-password', authRateLimiter, async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required',
      });
      return;
    }

    const result = await deafAuthService.requestPasswordReset(email);

    // Always return success to prevent email enumeration
    res.status(200).json({
      success: true,
      message: 'If an account exists with that email, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request',
    });
  }
});

/**
 * PUT /api/auth/accessibility-settings
 * Update user accessibility settings
 */
router.put('/accessibility-settings', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const settingsSchema = z.object({
      highContrast: z.boolean().optional(),
      largeText: z.boolean().optional(),
      visualAlerts: z.boolean().optional(),
      vibrationFeedback: z.boolean().optional(),
      captionsEnabled: z.boolean().optional(),
      aslVideoSpeed: z.number().min(0.5).max(2.0).optional(),
      preferredLanguage: z.string().optional(),
    });

    const validatedSettings = settingsSchema.parse(req.body);
    const result = await deafAuthService.updateAccessibilitySettings(req.user.id, validatedSettings);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Accessibility settings updated',
        user: result.user,
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: fromZodError(error).message,
        errors: error.errors,
      });
    } else {
      console.error('Settings update error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update settings',
      });
    }
  }
});

/**
 * GET /api/auth/status
 * Check authentication status (public endpoint)
 */
router.get('/status', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    authenticated: req.isAuthenticated || false,
    user: req.user ? {
      id: req.user.id,
      username: req.user.username,
      isDeaf: req.user.isDeaf,
      preferASL: req.user.preferASL,
    } : null,
    supabaseConfigured: deafAuthService.hasSupabaseConfig(),
  });
});

export default router;
