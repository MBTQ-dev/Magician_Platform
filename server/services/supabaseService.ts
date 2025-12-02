/**
 * Supabase Service - Database and storage operations with Supabase
 * 
 * This service provides integration with Supabase for:
 * - Database operations (users, profiles, businesses)
 * - Real-time subscriptions
 * - Storage management
 * - Row Level Security (RLS) integration
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

/**
 * Database types for Supabase tables
 */
export interface SupabaseProfile {
  id: string;
  email: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  is_deaf: boolean;
  prefer_asl: boolean;
  communication_preference: 'asl' | 'text' | 'mixed';
  asl_verified: boolean;
  accessibility_settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SupabaseBusiness {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  business_type: string | null;
  formation_state: string | null;
  formation_status: string | null;
  api_data: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

/**
 * Supabase Service Class
 */
class SupabaseService {
  private client: SupabaseClient | null = null;
  private adminClient: SupabaseClient | null = null;
  private initialized: boolean = false;

  /**
   * Initialize the Supabase service
   */
  initialize(): boolean {
    if (this.initialized) {
      return true;
    }

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.warn('Supabase: Credentials not configured. Running in mock mode.');
      this.initialized = true;
      return true;
    }

    try {
      // Create client-side Supabase client
      this.client = createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: {
          autoRefreshToken: true,
          persistSession: false,
        },
      });

      // Create admin client for server-side operations (bypasses RLS)
      if (SUPABASE_SERVICE_KEY) {
        this.adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        });
      }

      this.initialized = true;
      console.log('Supabase: Service initialized successfully');
      return true;
    } catch (error) {
      console.error('Supabase: Failed to initialize client:', error);
      return false;
    }
  }

  /**
   * Check if the service is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Check if Supabase is configured
   */
  hasConfig(): boolean {
    return !!(SUPABASE_URL && SUPABASE_KEY);
  }

  /**
   * Get the Supabase client
   */
  getClient(): SupabaseClient | null {
    this.ensureInitialized();
    return this.client;
  }

  /**
   * Get the admin Supabase client (for server-side operations)
   */
  getAdminClient(): SupabaseClient | null {
    this.ensureInitialized();
    return this.adminClient || this.client;
  }

  /**
   * Create or update a user profile
   */
  async upsertProfile(profile: Partial<SupabaseProfile>): Promise<{ data: SupabaseProfile | null; error: Error | null }> {
    this.ensureInitialized();

    if (!this.client) {
      // Mock mode - return mock profile
      const mockProfile: SupabaseProfile = {
        id: profile.id || `mock-${Date.now()}`,
        email: profile.email || '',
        username: profile.username || '',
        full_name: profile.full_name || null,
        avatar_url: profile.avatar_url || null,
        is_deaf: profile.is_deaf || false,
        prefer_asl: profile.prefer_asl || false,
        communication_preference: profile.communication_preference || 'text',
        asl_verified: profile.asl_verified || false,
        accessibility_settings: profile.accessibility_settings || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return { data: mockProfile, error: null };
    }

    try {
      const { data, error } = await this.client
        .from('profiles')
        .upsert({
          ...profile,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data: data as SupabaseProfile, error: null };
    } catch (error) {
      console.error('Supabase: Profile upsert error:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get a user profile by ID
   */
  async getProfile(userId: string): Promise<{ data: SupabaseProfile | null; error: Error | null }> {
    this.ensureInitialized();

    if (!this.client) {
      return { data: null, error: new Error('Supabase not configured') };
    }

    try {
      const { data, error } = await this.client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data: data as SupabaseProfile, error: null };
    } catch (error) {
      console.error('Supabase: Get profile error:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get user's businesses
   */
  async getUserBusinesses(userId: string): Promise<{ data: SupabaseBusiness[]; error: Error | null }> {
    this.ensureInitialized();

    if (!this.client) {
      return { data: [], error: new Error('Supabase not configured') };
    }

    try {
      const { data, error } = await this.client
        .from('businesses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: [], error: new Error(error.message) };
      }

      return { data: data as SupabaseBusiness[], error: null };
    } catch (error) {
      console.error('Supabase: Get businesses error:', error);
      return { data: [], error: error as Error };
    }
  }

  /**
   * Create a new business
   */
  async createBusiness(business: Partial<SupabaseBusiness>): Promise<{ data: SupabaseBusiness | null; error: Error | null }> {
    this.ensureInitialized();

    if (!this.client) {
      // Mock mode
      const mockBusiness: SupabaseBusiness = {
        id: `mock-${Date.now()}`,
        user_id: business.user_id || '',
        name: business.name || '',
        description: business.description || null,
        business_type: business.business_type || null,
        formation_state: business.formation_state || null,
        formation_status: business.formation_status || null,
        api_data: business.api_data || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return { data: mockBusiness, error: null };
    }

    try {
      const { data, error } = await this.client
        .from('businesses')
        .insert({
          ...business,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data: data as SupabaseBusiness, error: null };
    } catch (error) {
      console.error('Supabase: Create business error:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Upload a file to Supabase Storage
   */
  async uploadFile(
    bucket: string,
    path: string,
    file: Buffer | Blob,
    options?: { contentType?: string }
  ): Promise<{ data: { path: string } | null; error: Error | null }> {
    this.ensureInitialized();

    if (!this.client) {
      return { data: null, error: new Error('Supabase not configured') };
    }

    try {
      const { data, error } = await this.client.storage
        .from(bucket)
        .upload(path, file, {
          contentType: options?.contentType,
          upsert: true,
        });

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data: { path: data.path }, error: null };
    } catch (error) {
      console.error('Supabase: File upload error:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get a public URL for a file
   */
  getPublicUrl(bucket: string, path: string): string | null {
    this.ensureInitialized();

    if (!this.client) {
      return null;
    }

    const { data } = this.client.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  /**
   * Subscribe to real-time changes on a table
   */
  subscribeToTable(
    table: string,
    callback: (payload: any) => void,
    filter?: { column: string; value: string }
  ): { unsubscribe: () => void } {
    this.ensureInitialized();

    if (!this.client) {
      return { unsubscribe: () => {} };
    }

    let channel = this.client
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter: filter ? `${filter.column}=eq.${filter.value}` : undefined,
        },
        callback
      )
      .subscribe();

    return {
      unsubscribe: () => {
        channel.unsubscribe();
      },
    };
  }

  /**
   * Ensure the service is initialized
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      this.initialize();
    }
  }
}

// Create singleton instance
export const supabaseService = new SupabaseService();

// Initialize on module load
supabaseService.initialize();

export default supabaseService;
