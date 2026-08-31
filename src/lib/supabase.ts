import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

const supabaseUrl = (import.meta.env["VITE_SUPABASE_URL"] as string | undefined)?.trim();
const supabaseAnonKey = (
  (import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined) ||
  (import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined)
)?.trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "https://your-project-id.supabase.co" &&
    supabaseAnonKey !== "your-supabase-anon-public-key-here" &&
    supabaseUrl.startsWith("http"),
);

// Fallback placeholder URL for initial development before .env.local is populated
const resolvedUrl = isSupabaseConfigured ? (supabaseUrl as string) : "https://placeholder-acadin.supabase.co";
const resolvedKey = isSupabaseConfigured ? (supabaseAnonKey as string) : "placeholder-anon-key";

export const supabase = createClient<Database>(resolvedUrl, resolvedKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});

