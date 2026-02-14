import { createClient as supabaseCreateClient } from "@supabase/supabase-js";

// Database type will be replaced with generated types from Supabase CLI later.
// For now, use `any` as a placeholder.
type Database = any;

/**
 * Create a Supabase client for browser-side usage.
 * Relies on NEXT_PUBLIC_ environment variables that are exposed to the client bundle.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set."
    );
  }

  return supabaseCreateClient<Database>(supabaseUrl, supabaseAnonKey);
}

/**
 * Create a Supabase client for server-side usage with the service role key.
 * This client bypasses Row Level Security and should ONLY be used in trusted
 * server contexts (API routes, server actions, cron jobs, etc.).
 */
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set."
    );
  }

  return supabaseCreateClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
