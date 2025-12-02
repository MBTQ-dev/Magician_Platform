/**
 * DeafAuth Middleware - Authentication middleware for Express routes
 * 
 * This middleware provides authentication and authorization functionality
 * for the Magician Platform API routes using DeafAuth and Supabase.
 */

import type { Request, Response, NextFunction } from 'express';
import { deafAuthService, DeafAuthUser } from '../services/deafAuthService';

/**
 * Extended Express Request with authenticated user
 */
export interface AuthenticatedRequest extends Request {
  user?: DeafAuthUser;
  isAuthenticated?: boolean;
}

/**
 * Authentication result for middleware
 */
interface AuthResult {
  authenticated: boolean;
  user?: DeafAuthUser;
  error?: string;
}

/**
 * Extract token from request headers or cookies
 */
function extractToken(req: Request): string | null {
  // Check Authorization header (Bearer token)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check for token in cookies
  if (req.cookies && req.cookies.deafauth_token) {
    return req.cookies.deafauth_token;
  }

  // Check for token in query parameters (for WebSocket connections)
  if (req.query && req.query.token) {
    return req.query.token as string;
  }

  return null;
}

/**
 * Verify authentication token
 */
async function verifyAuthentication(req: Request): Promise<AuthResult> {
  const token = extractToken(req);

  if (!token) {
    return {
      authenticated: false,
      error: 'No authentication token provided',
    };
  }

  try {
    const user = await deafAuthService.verifyToken(token);

    if (!user) {
      return {
        authenticated: false,
        error: 'Invalid or expired token',
      };
    }

    return {
      authenticated: true,
      user,
    };
  } catch (error) {
    console.error('DeafAuth Middleware: Token verification error:', error);
    return {
      authenticated: false,
      error: 'Token verification failed',
    };
  }
}

/**
 * Required authentication middleware
 * Blocks unauthenticated requests with 401 status
 */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  verifyAuthentication(req)
    .then((result) => {
      if (result.authenticated && result.user) {
        req.user = result.user;
        req.isAuthenticated = true;
        next();
      } else {
        res.status(401).json({
          success: false,
          message: result.error || 'Authentication required',
          code: 'UNAUTHORIZED',
        });
      }
    })
    .catch((error) => {
      console.error('DeafAuth Middleware: Authentication error:', error);
      res.status(500).json({
        success: false,
        message: 'Authentication service error',
        code: 'AUTH_ERROR',
      });
    });
}

/**
 * Optional authentication middleware
 * Attaches user to request if authenticated, but allows unauthenticated requests
 */
export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  verifyAuthentication(req)
    .then((result) => {
      if (result.authenticated && result.user) {
        req.user = result.user;
        req.isAuthenticated = true;
      } else {
        req.isAuthenticated = false;
      }
      next();
    })
    .catch((error) => {
      console.error('DeafAuth Middleware: Optional auth error:', error);
      req.isAuthenticated = false;
      next();
    });
}

/**
 * Check if user has ASL verification
 * Use after requireAuth middleware
 */
export function requireASLVerified(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
      code: 'UNAUTHORIZED',
    });
    return;
  }

  if (!req.user.aslVerified) {
    res.status(403).json({
      success: false,
      message: 'ASL verification required for this action',
      code: 'ASL_VERIFICATION_REQUIRED',
    });
    return;
  }

  next();
}

/**
 * Check if user prefers ASL communication
 * Use after requireAuth or optionalAuth middleware
 */
export function checkASLPreference(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (req.user && req.user.preferASL) {
    // Add header to indicate ASL content should be provided
    res.setHeader('X-ASL-Preferred', 'true');
  }
  next();
}

/**
 * Rate limiting middleware for authentication routes
 * Prevents brute force attacks
 */
const authAttempts: Map<string, { count: number; lastAttempt: number }> = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

export function authRateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const attempt = authAttempts.get(ip);

  if (attempt) {
    // Check if lockout period has passed
    if (now - attempt.lastAttempt > LOCKOUT_TIME) {
      authAttempts.delete(ip);
    } else if (attempt.count >= MAX_ATTEMPTS) {
      const remainingTime = Math.ceil((LOCKOUT_TIME - (now - attempt.lastAttempt)) / 1000 / 60);
      res.status(429).json({
        success: false,
        message: `Too many login attempts. Please try again in ${remainingTime} minutes.`,
        code: 'RATE_LIMITED',
      });
      return;
    }
  }

  // Update attempt count after response
  res.on('finish', () => {
    if (res.statusCode === 401) {
      const current = authAttempts.get(ip) || { count: 0, lastAttempt: now };
      authAttempts.set(ip, {
        count: current.count + 1,
        lastAttempt: now,
      });
    } else if (res.statusCode === 200) {
      // Clear attempts on successful login
      authAttempts.delete(ip);
    }
  });

  next();
}

/**
 * Middleware to log authentication events
 */
export function authLogger(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const userId = req.user?.id || 'anonymous';
    const method = req.method;
    const path = req.path;
    const status = res.statusCode;

    if (path.includes('/auth/')) {
      console.log(`[DeafAuth] ${method} ${path} - User: ${userId} - Status: ${status} - ${duration}ms`);
    }
  });

  next();
}

export default {
  requireAuth,
  optionalAuth,
  requireASLVerified,
  checkASLPreference,
  authRateLimiter,
  authLogger,
};
