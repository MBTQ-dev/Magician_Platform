/**
 * DeafAuth Service
 * 
 * Provides identity verification, authentication, and access control
 * for the MBTQ ecosystem. This is the root of truth for all user permissions.
 */

import { db } from '../db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { comparePassword } from '../utils/passwordUtils';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = '7d';

export interface DeafAuthUser {
  id: number;
  username: string;
  email: string;
  isDeaf: boolean;
  preferASL: boolean;
  roles: string[];
  permissions: string[];
  createdAt: Date;
}

export interface DeafAuthToken {
  userId: number;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
}

export interface AuthResult {
  success: boolean;
  token?: string;
  user?: DeafAuthUser;
  error?: string;
}

/**
 * Verify DeafAuth token
 */
export async function verifyToken(token: string): Promise<DeafAuthToken | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DeafAuthToken;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Generate DeafAuth token
 */
export function generateToken(user: DeafAuthUser): string {
  const payload = {
    userId: user.id,
    username: user.username,
    email: user.email,
    roles: user.roles,
    permissions: user.permissions,
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

/**
 * Authenticate user with credentials
 */
export async function authenticate(
  username: string,
  password: string
): Promise<AuthResult> {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (result.length === 0) {
      return {
        success: false,
        error: 'Invalid credentials',
      };
    }

    const user = result[0];

    // Use bcrypt to securely compare passwords
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return {
        success: false,
        error: 'Invalid credentials',
      };
    }

    const deafAuthUser: DeafAuthUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      isDeaf: user.isDeaf || false,
      preferASL: user.preferASL || false,
      roles: ['member'], // Default role
      permissions: ['read', 'write'],
      createdAt: user.createdAt || new Date(),
    };

    const token = generateToken(deafAuthUser);

    return {
      success: true,
      token,
      user: deafAuthUser,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      error: 'Authentication failed',
    };
  }
}

/**
 * Validate user has specific permission
 */
export function hasPermission(user: DeafAuthToken, permission: string): boolean {
  return user.permissions.includes(permission) || user.permissions.includes('*');
}

/**
 * Validate user has specific role
 */
export function hasRole(user: DeafAuthToken, role: string): boolean {
  return user.roles.includes(role) || user.roles.includes('admin');
}

/**
 * Check if user can access specific app/module
 */
export function canAccessApp(
  user: DeafAuthToken,
  appName: string,
  requiredFibonroseLevel?: number
): {
  canAccess: boolean;
  reason?: string;
} {
  // Basic permission check
  if (!hasPermission(user, 'read')) {
    return {
      canAccess: false,
      reason: 'No read permission',
    };
  }

  // App-specific logic would go here
  // For now, allow access to all apps for authenticated users
  
  return {
    canAccess: true,
  };
}

/**
 * Log authentication attempt for audit trail
 */
export function logAuthAttempt(
  username: string,
  success: boolean,
  ipAddress?: string,
  userAgent?: string
): void {
  // In production, this would persist to database for security monitoring
  console.log('[DeafAuth] Authentication attempt:', {
    username,
    success,
    ipAddress,
    userAgent,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Detect suspicious activity
 */
export function detectSuspiciousActivity(
  userId: number,
  activityType: string,
  details: any
): {
  isSuspicious: boolean;
  flags: string[];
} {
  const flags: string[] = [];

  // Simple heuristics - in production, this would be more sophisticated
  
  // Example: Multiple login attempts from different IPs
  // Example: Unusual access patterns
  // Example: Bot-like behavior
  
  return {
    isSuspicious: flags.length > 0,
    flags,
  };
}

export default {
  authenticate,
  verifyToken,
  generateToken,
  hasPermission,
  hasRole,
  canAccessApp,
  logAuthAttempt,
  detectSuspiciousActivity,
};
