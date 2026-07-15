import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAnon } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const NO_STORE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Surrogate-Control": "no-store",
  "CDN-Cache-Control": "no-store",
} as const;

export async function GET(req: NextRequest) {
  try {
    const db = getSupabaseAnon();
    const { searchParams } = new URL(req.url);
    const company = searchParams.get("company");
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const offset = Math.max(0, parseInt(searchParams.get("offset") || "0"));

    let query = db
      .from("cards")
      .select("github_username, display_name, avatar_url, rarity, rarity_score, primary_class, stats, company, primary_language, updated_at")
      .order("rarity_score", { ascending: false });

    if (company) {
      query = query.eq("company", company);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500, headers: NO_STORE });
    }

    const paged = (data || []).slice(offset, offset + limit);

    const entries = paged.map((row) => ({
      username: row.github_username,
      displayName: row.display_name,
      avatarUrl: row.avatar_url,
      rarity: row.rarity,
      rarityScore: row.rarity_score,
      primaryClass: row.primary_class,
      stats: row.stats,
      company: row.company,
      primaryLanguage: row.primary_language,
      generatedAt: row.updated_at,
    }));

    return NextResponse.json({ entries, total: paged.length }, { headers: NO_STORE });
  } catch (err) {
    console.error("[leaderboard] error:", err);
    return NextResponse.json({ entries: [], total: 0, error: String(err) }, { headers: NO_STORE });
  }
}
