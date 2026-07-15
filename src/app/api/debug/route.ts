import { NextResponse } from "next/server";
import { getSupabaseAdmin, getSupabaseAnon } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface ClientResult {
  count: number;
  rows: { id: string; github_username: string; created_at: string }[];
  error: string | null;
}

export async function GET() {
  let anon: ClientResult = { count: 0, rows: [], error: null };
  let admin: ClientResult = { count: 0, rows: [], error: null };

  try {
    const client = getSupabaseAnon();
    const { data, error } = await client
      .from("cards")
      .select("id, github_username, created_at")
      .order("created_at", { ascending: false });
    anon = { count: data?.length ?? 0, rows: data ?? [], error: error?.message ?? null };
  } catch (err) {
    anon.error = String(err);
  }

  try {
    const client = getSupabaseAdmin();
    const { data, error } = await client
      .from("cards")
      .select("id, github_username, created_at")
      .order("created_at", { ascending: false });
    admin = { count: data?.length ?? 0, rows: data ?? [], error: error?.message ?? null };
  } catch (err) {
    admin.error = String(err);
  }

  return NextResponse.json(
    {
      anon,
      admin,
      match: anon.count === admin.count,
      env: {
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "not set",
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "not set",
        anonKeyPrefix: (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "not set").substring(0, 12) + "...",
        serviceRoleKeyPrefix: (process.env.SUPABASE_SERVICE_ROLE_KEY || "not set").substring(0, 12) + "...",
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
