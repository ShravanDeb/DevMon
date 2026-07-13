import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { CardIdSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  const { cardId } = await params;

  const parsed = CardIdSchema.safeParse(cardId);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid card ID format" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  // Fetch all profiles, find by verification.cardId in JS
  const { data: allProfiles, error: queryError } = await admin
    .from("profiles")
    .select("id, username, display_name, avatar_url, card, updated_at");

  if (queryError) {
    return NextResponse.json({ error: "Query failed", detail: queryError.message }, { status: 500 });
  }

  const match = (allProfiles ?? []).find(
    (p) => {
      const c = p.card as Record<string, unknown> | null;
      if (!c?.verification) return false;
      return (c.verification as Record<string, unknown>).cardId === cardId;
    }
  );

  if (!match) {
    return NextResponse.json(
      { error: "Card not found" },
      { status: 404, headers: { "Cache-Control": "no-store" } }
    );
  }

  const card = match.card as Record<string, unknown>;
  const verification = card.verification as Record<string, unknown>;
  return NextResponse.json({
    verified: true,
    card: {
      username: match.username,
      displayName: match.display_name,
      avatarUrl: match.avatar_url,
      rarity: card.rarity,
      rarityScore: card.rarityScore,
      primaryClass: card.primaryClass,
      secondaryClass: card.secondaryClass,
      stats: card.stats,
      signatureMove: card.signatureMove,
      flavorText: card.flavorText,
      heroStat: card.heroStat,
      verification,
      generatedAt: match.updated_at,
    },
  }, { headers: { "Cache-Control": "no-store" } });
}
