import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabaseAdmin: SupabaseClient | null = null;
let _supabaseAnon: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error("Supabase admin client not configured: missing env vars");
    }
    _supabaseAdmin = createClient(url, key);
  }
  return _supabaseAdmin;
}

export function getSupabaseAnon(): SupabaseClient {
  if (!_supabaseAnon) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error("Supabase anon client not configured: missing env vars");
    }
    _supabaseAnon = createClient(url, key);
  }
  return _supabaseAnon;
}
