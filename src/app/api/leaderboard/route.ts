import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getSessionUser } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ entries: [], total: 0 });
  }

  const { searchParams } = new URL(req.url);
  const company = searchParams.get("company");
  const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
  const offset = parseInt(searchParams.get("offset") || "0");

  let query = admin
    .from("leaderboard")
    .select("*")
    .order("rarity_score", { ascending: false })
    .range(offset, offset + limit - 1);

  if (company) {
    query = query.eq("company", company);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entries: data || [], total: data?.length || 0 });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { entry } = await req.json();
    if (!entry || !entry.username) {
      return NextResponse.json({ error: "Invalid entry" }, { status: 400 });
    }

    // Users can only upsert their own leaderboard entry
    if (entry.username !== session.userId) {
      return NextResponse.json({ error: "Can only update own entry" }, { status: 403 });
    }

    const { error } = await admin.from("leaderboard").upsert(
      {
        username: entry.username,
        display_name: entry.displayName,
        avatar_url: entry.avatarUrl,
        rarity: entry.rarity,
        rarity_score: entry.rarityScore,
        primary_class: entry.primaryClass,
        stats: entry.stats as unknown as Record<string, unknown>,
        company: entry.company || null,
        primary_language: entry.primaryLanguage || null,
        generated_at: new Date().toISOString(),
      },
      { onConflict: "username" }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
