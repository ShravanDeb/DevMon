import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAnon } from "@/lib/supabase";
import { CardIdSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  const { cardId } = await params;

  const parsed = CardIdSchema.safeParse(cardId);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_format", message: "This doesn't look like a valid card ID." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const db = getSupabaseAnon();
    const { data: card, error: queryError } = await db
      .from("cards")
      .select("*")
      .eq("card_id", cardId)
      .maybeSingle();

    if (queryError) {
      console.error("verify query error:", queryError.message);
      return NextResponse.json(
        { error: "database_error", message: "Something went wrong verifying this credential. Try again shortly." },
        { status: 500, headers: { "Cache-Control": "no-store" } }
      );
    }

    if (!card) {
      return NextResponse.json(
        { error: "not_found", message: "No credential exists with this ID." },
        { status: 404, headers: { "Cache-Control": "no-store" } }
      );
    }

    return NextResponse.json(
      {
        verified: true,
        card: {
          username: card.username || card.github_username,
          displayName: card.display_name,
          avatarUrl: card.avatar_url,
          rarity: card.rarity,
          rarityScore: card.rarity_score,
          primaryClass: card.primary_class,
          secondaryClass: card.secondary_class,
          attributes: card.stats,
          signatureMove: card.signature_move,
          flavorText: card.flavor_text,
          heroStat: card.hero_stat,
          achievements: card.achievements,
          verification: {
            cardId: card.card_id,
            edition: card.edition,
            generatedAt: card.updated_at,
            version: card.version || card.verification_version,
            digitalSignature: card.digital_signature,
            sha256Hash: card.sha256_hash,
          },
          generatedAt: card.updated_at,
        },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("verify error:", message);
    return NextResponse.json(
      { error: "database_error", message: "Something went wrong verifying this credential. Try again shortly." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
