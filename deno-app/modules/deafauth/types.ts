/**
 * DeafAuth Module - Type Definitions
 * 
 * TypeScript types for authentication, users, and permissions
 */

export interface DeafAuthUser {
  id: string;
  email: string;
  username: string;
  isDeaf: boolean;
  preferASL: boolean;
  roles: string[];
  permissions: string[];
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: DeafAuthUser;
  token?: string;
  refreshToken?: string;
  error?: string;
}

export interface OAuthProvider {
  provider: "google" | "github" | "discord" | "twitter";
  redirectUrl: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  avatarUrl?: string;
  isDeaf: boolean;
  preferASL: boolean;
  bio?: string;
  location?: string;
  website?: string;
  roles: string[];
  permissions: string[];
  fibonroseScore?: number;
  vrCounselorId?: string;
  workforceCertified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  username?: string;
  fullName?: string;
  bio?: string;
  location?: string;
  website?: string;
  isDeaf?: boolean;
  preferASL?: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
}
