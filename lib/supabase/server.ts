import { createClient } from "@supabase/supabase-js";

// Server-side client (uses service role for API routes that need elevated access)
// Falls back to anon key if service role not configured (dev/demo mode)
export function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || (!serviceKey && !anonKey)) {
    return null;
  }

  const key = serviceKey || anonKey!;
  return createClient(url, key, { auth: { persistSession: false } });
}

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
