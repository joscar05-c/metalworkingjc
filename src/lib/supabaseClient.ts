import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_PUBLIC_SUPABASE_URL = "https://kmaczacciluzzosdjzpd.supabase.co";
const DEFAULT_PUBLIC_SUPABASE_ANON_KEY =
  "sb_publishable_aAyLQw2Z4oRoPZHF-fMLmg_f_FVmPYx";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL?.trim() || DEFAULT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ||
  DEFAULT_PUBLIC_SUPABASE_ANON_KEY;

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
