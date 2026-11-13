import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

function createOptionalSupabaseClient(): SupabaseClient | undefined {
  if (!supabaseUrl || !supabaseAnonKey) {
    return undefined;
  }
  if (supabaseUrl.includes("tu-proyecto-id.supabase.co")) {
    return undefined;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabaseClient: SupabaseClient | undefined =
  createOptionalSupabaseClient();

export const isSupabaseConfigured: boolean = supabaseClient !== undefined;

