/**
 * DeafAuth Module - Main Exports
 * 
 * Central export point for all DeafAuth functionality
 */

// Export authentication functions
export {
  authenticateUser,
  getOAuthUrl,
  getUserProfileById,
  registerUser,
  requestPasswordReset,
  signOut,
  updatePassword,
  verifyToken,
} from "./auth.ts";

// Export types
export type {
  AuthCredentials,
  AuthResult,
  DeafAuthUser,
  OAuthProvider,
  PasswordResetRequest,
  PasswordUpdateRequest,
  TokenPayload,
  UpdateProfileRequest,
  UserProfile,
} from "./types.ts";
