import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubStats } from "@/lib/github";
import { generateCard } from "@/lib/scoring";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getSessionUser } from "@/lib/auth-helpers";
import { CardPostSchema } from "@/lib/validation";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" } as const;

export async function POST(req: NextRequest) {
  const start = Date.now();

  try {
    const session = await getSessionUser();
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE });
    }

    const rl = await rateLimit("card-gen", session.userId, RATE_LIMITS.cardGen);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again in a minute." },
        { status: 429, headers: NO_STORE }
      );
    }

    let tone: "hype" | "roast" | undefined;
    let rarity: "Common" | "Rare" | "Epic" | "Legendary" | "Mythic" | undefined;

    try {
      const body = await req.json();
      const parsed = CardPostSchema.safeParse(body);
      if (parsed.success) {
        tone = parsed.data.tone;
        rarity = parsed.data.rarity;
      }
    } catch {
      // Empty body is fine
    }

    const raw = await fetchGitHubStats(session.accessToken);
    const admin = getSupabaseAdmin();

    const card = generateCard(raw, tone, rarity);

    const topLang = raw.languages[0]?.name || null;

    // Single atomic upsert — SELECT FOR UPDATE, RETURNING every column
    const { data: upsertResult, error: upsertErr } = await admin.rpc("upsert_card_v2", {
      p_user_id: session.userId,
      p_github_username: raw.login,
      p_username: raw.login,
      p_display_name: raw.name || raw.login,
      p_avatar_url: raw.avatarUrl,
      p_company: raw.company || null,
      p_primary_language: topLang,
      p_card_id: card.verification.cardId,
      p_edition: card.verification.edition,
      p_raw_stats: raw as unknown as Record<string, unknown>,
      p_stats: card.stats as unknown as Record<string, unknown>,
      p_rarity: card.rarity,
      p_rarity_score: card.rarityScore,
      p_primary_class: card.primaryClass,
      p_secondary_class: card.secondaryClass || null,
      p_hero_stat: card.heroStat as unknown as Record<string, unknown>,
      p_signature_move: card.signatureMove as unknown as Record<string, unknown>,
      p_achievements: card.achievements as unknown as Record<string, unknown>[],
      p_flavor_text: card.flavorText,
      p_flavor_tone: tone || "hype",
      p_sha256_hash: card.verification.sha256Hash,
      p_digital_signature: card.verification.digitalSignature,
      p_version: card.verification.version,
    });

    if (upsertErr) {
      console.error("upsert_card error:", upsertErr.message);
      return NextResponse.json(
        { error: `Failed to save card: ${upsertErr.message}` },
        { status: 500, headers: NO_STORE }
      );
    }

    // row is the full cards row from RETURNING *
    const row = (Array.isArray(upsertResult) ? upsertResult[0] : upsertResult) as Record<string, unknown> | undefined;
    if (!row?.card_id) {
      console.error("upsert_card returned no row:", JSON.stringify(upsertResult));
      return NextResponse.json({ error: "Failed to generate card: upsert returned no data" }, { status: 500, headers: NO_STORE });
    }

    // Re-sign using fresh card data (not DB row) for verification integrity
    const { reSignVerification } = await import("@/lib/verification");
    const finalVerification = reSignVerification(raw, card.stats, card.rarity, row.card_id as string, row.edition as number);

    // Write the re-signed hash/sig back to the same row
    const { error: signUpdateErr } = await admin
      .from("cards")
      .update({
        sha256_hash: finalVerification.sha256Hash,
        digital_signature: finalVerification.digitalSignature,
        updated_at: new Date(finalVerification.generatedAt).toISOString(),
      })
      .eq("card_id", row.card_id);

    if (signUpdateErr) {
      console.error("re-sign update error:", signUpdateErr.message);
    }

    // Compute rank and total from the cards table directly
    const { count: totalCards } = await admin
      .from("cards")
      .select("*", { count: "exact", head: true });

    const { data: rankData } = await admin
      .from("cards")
      .select("user_id")
      .gt("rarity_score", (row.rarity_score as number))
      .order("rarity_score", { ascending: false });
    const rank = (rankData?.length ?? 0) + 1;

    const duration = Date.now() - start;
    console.log(
      JSON.stringify({
        method: "POST",
        route: "/api/card",
        userId: session.userId,
        cardId: row.card_id,
        duration,
      })
    );

    return NextResponse.json({
      card: {
        username: row.username as string,
        displayName: row.display_name as string,
        avatarUrl: row.avatar_url as string,
        stats: row.stats as Record<string, number>,
        rarity: row.rarity as string,
        rarityScore: row.rarity_score as number,
        primaryClass: row.primary_class as string,
        secondaryClass: row.secondary_class as string | null,
        flavorText: row.flavor_text as string,
        signatureMove: row.signature_move as { name: string; description: string; icon: string },
        achievements: row.achievements as { label: string; value: string; icon: string }[],
        verification: {
          cardId: row.card_id as string,
          edition: row.edition as number,
          generatedAt: finalVerification.generatedAt,
          version: finalVerification.version,
          sha256Hash: finalVerification.sha256Hash,
          digitalSignature: finalVerification.digitalSignature,
        },
        heroStat: row.hero_stat as { key: string; label: string; value: string; unit: string; qualifier: string },
        className: row.primary_class as string,
        generatedAt: finalVerification.generatedAt,
        rank,
        totalCards: totalCards ?? 0,
      },
    }, { headers: NO_STORE });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate card";
    return NextResponse.json({ error: message }, { status: 500, headers: NO_STORE });
  }
}

export async function GET() {
  try {
    const admin = getSupabaseAdmin();
    const { count } = await admin
      .from("cards")
      .select("*", { count: "exact", head: true });
    return NextResponse.json({ count: count ?? 0 }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ count: 0 }, { headers: NO_STORE });
  }
}
