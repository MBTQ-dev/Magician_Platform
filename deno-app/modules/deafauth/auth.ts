/**
 * DeafAuth Module - Authentication Logic
 * 
 * Handles user authentication using Supabase Auth with support for
 * email/password, OAuth providers, and JWT token management.
 */

import { createSupabaseClient, createSupabaseServiceClient } from "../../lib/supabase.ts";
import type {
  AuthCredentials,
  AuthResult,
  DeafAuthUser,
  OAuthProvider,
  PasswordResetRequest,
  PasswordUpdateRequest,
  TokenPayload,
  UserProfile,
} from "./types.ts";

/**
 * Authenticate user with email and password
 */
export async function authenticateUser(
  credentials: AuthCredentials
): Promise<AuthResult> {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data.user || !data.session) {
      return {
        success: false,
        error: "Authentication failed",
      };
    }

    // Get user profile from database
    const profile = await getUserProfileById(data.user.id);

    return {
      success: true,
      user: profile || mapSupabaseUserToDeafAuthUser(data.user),
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Register new user
 */
export async function registerUser(
  credentials: AuthCredentials & {
    username: string;
    isDeaf?: boolean;
    preferASL?: boolean;
  }
): Promise<AuthResult> {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          username: credentials.username,
          is_deaf: credentials.isDeaf || false,
          prefer_asl: credentials.preferASL || false,
        },
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: "Registration failed",
      };
    }

    return {
      success: true,
      user: mapSupabaseUserToDeafAuthUser(data.user),
      token: data.session?.access_token,
      refreshToken: data.session?.refresh_token,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Sign out user
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Verify JWT token and get user
 */
export async function verifyToken(token: string): Promise<DeafAuthUser | null> {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return null;
    }

    const profile = await getUserProfileById(data.user.id);
    return profile || mapSupabaseUserToDeafAuthUser(data.user);
  } catch {
    return null;
  }
}

/**
 * Get OAuth URL for provider
 */
export async function getOAuthUrl(
  provider: OAuthProvider
): Promise<{ url: string } | { error: string }> {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider.provider,
      options: {
        redirectTo: provider.redirectUrl,
      },
    });

    if (error) {
      return { error: error.message };
    }

    return { url: data.url };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(
  request: PasswordResetRequest
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.resetPasswordForEmail(request.email);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Update user password
 */
export async function updatePassword(
  request: PasswordUpdateRequest
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.updateUser({
      password: request.newPassword,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get user profile by ID
 */
export async function getUserProfileById(
  userId: string
): Promise<UserProfile | null> {
  try {
    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      username: data.username,
      fullName: data.full_name,
      avatarUrl: data.avatar_url,
      isDeaf: data.is_deaf || false,
      preferASL: data.prefer_asl || false,
      bio: data.bio,
      location: data.location,
      website: data.website,
      roles: data.roles || [],
      permissions: data.permissions || [],
      fibonroseScore: data.fibonrose_score,
      vrCounselorId: data.vr_counselor_id,
      workforceCertified: data.workforce_certified || false,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch {
    return null;
  }
}

/**
 * Map Supabase user to DeafAuthUser
 */
function mapSupabaseUserToDeafAuthUser(user: any): DeafAuthUser {
  return {
    id: user.id,
    email: user.email || "",
    username: user.user_metadata?.username || user.email?.split("@")[0] || "",
    isDeaf: user.user_metadata?.is_deaf || false,
    preferASL: user.user_metadata?.prefer_asl || false,
    roles: user.user_metadata?.roles || ["user"],
    permissions: user.user_metadata?.permissions || [],
    metadata: user.user_metadata,
    createdAt: user.created_at,
    updatedAt: user.updated_at || user.created_at,
  };
}
