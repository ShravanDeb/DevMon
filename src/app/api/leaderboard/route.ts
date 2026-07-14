import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Client } from "pg";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" } as const;

async function rawSqlCount(): Promise<{ count: number; sample: unknown[]; error?: string }> {
  const dbPassword = process.env.SUPABASE_DB_PASSWORD;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const projectRef = url.replace("https://", "").replace(".supabase.co", "");
  if (!dbPassword || !projectRef) return { count: -1, sample: [], error: "missing env" };
  const pg = new Client({
    connectionString: `postgresql://postgres:${dbPassword}@db.${projectRef}.supabase.co:5432/postgres`,
    ssl: { rejectUnauthorized: false },
  });
  try {
    await pg.connect();
    const countRes = await pg.query("SELECT count(*)::int as cnt FROM cards");
    const sampleRes = await pg.query("SELECT github_username, card_id, edition FROM cards LIMIT 5");
    await pg.end();
    return { count: countRes.rows[0].cnt, sample: sampleRes.rows };
  } catch (err) {
    await pg.end().catch(() => {});
    return { count: -1, sample: [], error: String(err) };
  }
}

export async function GET(req: NextRequest) {
  try {
    const admin = getSupabaseAdmin();
    const { searchParams } = new URL(req.url);
    const company = searchParams.get("company");
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const offset = Math.max(0, parseInt(searchParams.get("offset") || "0"));

    const noRange = searchParams.get("noRange") === "1";

    let query = admin
      .from("cards")
      .select("github_username, display_name, avatar_url, rarity, rarity_score, primary_class, stats, company, primary_language, updated_at", { count: "exact" })
      .order("rarity_score", { ascending: false });

    if (!noRange) {
      query = query.range(offset, offset + limit - 1);
    }

    if (company) {
      query = query.eq("company", company);
    }

    const rawLimit = searchParams.get("limit");
    const rawOffset = searchParams.get("offset");

    const { data, error, count } = await query;

    const sqlDebug = await rawSqlCount();

    if (error) {
      return NextResponse.json({ debugBuildId: "diag-2", error: error.message, sqlDebug }, { status: 500, headers: NO_STORE });
    }

    const entries = (data || []).map((row) => ({
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

    return NextResponse.json({
      debugBuildId: "diag-2",
      entries,
      total: count ?? entries.length,
      debug: {
        supabaseCount: count,
        supabaseDataLength: data?.length,
        rawSqlCount: sqlDebug.count,
        rawSqlSample: sqlDebug.sample,
        rawSqlError: sqlDebug.error,
      },
    }, { headers: NO_STORE });
  } catch (err) {
    console.error("[leaderboard] error:", err);
    return NextResponse.json({ entries: [], total: 0, error: String(err) }, { headers: NO_STORE });
  }
}
