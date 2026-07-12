import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { CardIdSchema } from "@/lib/validation";

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

  const { data, error } = await admin
    .from("profiles")
    .select("username, display_name, avatar_url, card, updated_at")
    .eq("id", cardId.replace("DM-", "").toLowerCase())
    .single();

  // Try by card JSONB lookup if direct match fails
  if (error || !data) {
    const { data: allProfiles } = await admin
      .from("profiles")
      .select("username, display_name, avatar_url, card, updated_at")
      .not("card", "is", null);

    const match = allProfiles?.find(
      (p) => (p.card as Record<string, unknown>)?.verification &&
        ((p.card as Record<string, unknown>).verification as Record<string, unknown>)?.cardId === cardId
    );

    if (!match) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
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
    });
  }

  const card = data.card as Record<string, unknown>;
  const verification = card?.verification as Record<string, unknown>;
  return NextResponse.json({
    verified: true,
    card: {
      username: data.username,
      displayName: data.display_name,
      avatarUrl: data.avatar_url,
      rarity: card?.rarity,
      rarityScore: card?.rarityScore,
      primaryClass: card?.primaryClass,
      secondaryClass: card?.secondaryClass,
      stats: card?.stats,
      signatureMove: card?.signatureMove,
      flavorText: card?.flavorText,
      heroStat: card?.heroStat,
      verification,
      generatedAt: data.updated_at,
    },
  });
}
