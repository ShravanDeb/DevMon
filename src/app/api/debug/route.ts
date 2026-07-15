import { NextResponse } from "next/server";
import { getSupabaseAdmin, getSupabaseAnon } from "@/lib/supabase";
import { getSessionUser } from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface ClientResult {
  count: number;
  rows: { id: string; github_username: string; created_at: string }[];
  error: string | null;
}

export async function GET() {
  const session = await getSessionUser();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
