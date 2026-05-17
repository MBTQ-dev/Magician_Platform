/**
 * Supabase Client Configuration for Deno
 * 
 * Provides centralized Supabase client initialization for authentication,
 * database operations, and real-time capabilities.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

/**
 * Get Supabase configuration from environment variables
 */
export function getSupabaseConfig(): SupabaseConfig {
  const url = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_KEY");

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_KEY environment variables."
    );
  }

  return { url, anonKey };
}

/**
 * Create Supabase client instance
 */
export function createSupabaseClient() {
  const config = getSupabaseConfig();
  return createClient(config.url, config.anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}

/**
 * Create Supabase service role client (for server-side operations)
 */
export function createSupabaseServiceClient() {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !serviceKey) {
    throw new Error(
      "Missing Supabase service role configuration. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Export default client instance
export const supabase = createSupabaseClient();
