import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubStats } from "@/lib/github";
import { generateCard } from "@/lib/scoring";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getSessionUser } from "@/lib/auth-helpers";
import { CardPostSchema } from "@/lib/validation";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const start = Date.now();

  try {
    const session = await getSessionUser();
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = await rateLimit("card-gen", session.userId, RATE_LIMITS.cardGen);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again in a minute." },
        { status: 429 }
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

    // Generate a candidate card_id + HMAC (only used on insert; discarded on conflict)
    const candidateCardId = card.verification.cardId;
    const candidateEdition = card.verification.edition;
    const candidateSha256 = card.verification.sha256Hash;
    const candidateSignature = card.verification.digitalSignature;

    // Single atomic upsert — one row, one statement, race-safe
    const { data: upsertResult, error: upsertErr } = await admin.rpc("upsert_card", {
      p_user_id: session.userId,
      p_github_username: raw.login,
      p_display_name: raw.name || raw.login,
      p_avatar_url: raw.avatarUrl,
      p_company: raw.company || null,
      p_primary_language: topLang,
      p_card_id: candidateCardId,
      p_edition: candidateEdition,
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
      p_sha256_hash: candidateSha256,
      p_digital_signature: candidateSignature,
    });

    if (upsertErr) {
      console.error("upsert_card error:", upsertErr.message);
      return NextResponse.json(
        { error: `Failed to save card: ${upsertErr.message}` },
        { status: 500 }
      );
    }

    // upsertResult is an array from .rpc(); extract first row
    const row = (Array.isArray(upsertResult) ? upsertResult[0] : upsertResult) as Record<string, unknown> | undefined;
    if (!row?.card_id) {
      console.error("upsert_card returned no row:", JSON.stringify(upsertResult));
      return NextResponse.json({ error: "Failed to generate card: upsert returned no data" }, { status: 500 });
    }
    const finalCardId = row.card_id as string;
    const finalEdition = row.edition as number;
    const wasInserted = row.was_inserted as boolean;

    // Re-sign with the authoritative card_id + edition from the DB
    const { reSignVerification } = await import("@/lib/verification");
    const finalVerification = reSignVerification(raw, card.stats, card.rarity, finalCardId, finalEdition);

    // Compute rank and total from the cards table directly
    const { count: totalCards } = await admin
      .from("cards")
      .select("*", { count: "exact", head: true });

    const { data: rankData } = await admin
      .from("cards")
      .select("user_id")
      .gt("rarity_score", card.rarityScore)
      .order("rarity_score", { ascending: false });
    const rank = (rankData?.length ?? 0) + 1;

    const duration = Date.now() - start;
    console.log(
      JSON.stringify({
        method: "POST",
        route: "/api/card",
        userId: session.userId,
        outcome: wasInserted ? "created" : "updated",
        cardId: finalCardId,
        duration,
      })
    );

    return NextResponse.json({
      card: {
        ...card,
        verification: finalVerification,
        rank,
        totalCards: totalCards ?? 0,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate card";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const admin = getSupabaseAdmin();
    const { count } = await admin
      .from("cards")
      .select("*", { count: "exact", head: true });
    return NextResponse.json({ count: count ?? 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
