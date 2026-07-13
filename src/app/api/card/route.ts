import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubStats } from "@/lib/graphql";
import { generateCard } from "@/lib/scoring";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getSessionUser } from "@/lib/auth-helpers";
import { CardPostSchema } from "@/lib/validation";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const reqId = crypto.randomUUID().slice(0, 8);
  const ts = new Date().toISOString();
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
  const ua = req.headers.get("user-agent") ?? "unknown";
  const referer = req.headers.get("referer") ?? req.headers.get("origin") ?? "none";
  console.log(JSON.stringify({ reqId, ts, event: "POST_START", ip, ua: ua.slice(0, 120), referer }));

  try {
    const session = await getSessionUser();
    if (!session?.accessToken) {
      console.log(JSON.stringify({ reqId, event: "POST_AUTH_FAIL" }));
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log(JSON.stringify({ reqId, event: "POST_AUTH_OK", userId: session.userId }));

    // Rate limit: 10 card generations per minute per user
    const rl = await rateLimit("card-gen", session.userId, RATE_LIMITS.cardGen);
    if (!rl.success) {
      console.log(JSON.stringify({ reqId, event: "RATE_LIMITED" }));
      return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
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
    const card = generateCard(raw, tone, rarity);
    console.log(JSON.stringify({ reqId, event: "CARD_GENERATED", login: raw.login, newCardId: card.verification.cardId }));

    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    // Check if user already has a card — preserve cardId so old verify links stay valid
    const { data: allProfiles, error: profileQueryErr } = await admin
      .from("profiles")
      .select("username, card")
      .not("card", "is", null);

    if (profileQueryErr) {
      console.log(JSON.stringify({ reqId, event: "PROFILE_QUERY_ERROR", error: profileQueryErr.message }));
    }

    const existingProfile = Array.isArray(allProfiles)
      ? allProfiles.find((p) => p.username === raw.login)
      : null;

    const existingCardObj = existingProfile?.card as Record<string, unknown> | null | undefined;
    const existingVerification = existingCardObj?.verification as Record<string, unknown> | undefined;
    const foundExisting = !!existingVerification?.cardId;

    console.log(JSON.stringify({
      reqId,
      event: "EXISTING_LOOKUP",
      profileCount: allProfiles?.length ?? 0,
      foundExisting,
      existingCardId: existingVerification?.cardId ?? null,
      lookupUsername: raw.login,
      profileUsernames: (allProfiles ?? []).map((p) => p.username),
    }));

    if (existingVerification?.cardId) {
      // Preserve existing cardId and edition — only update stats/class/flavor
      card.verification.cardId = existingVerification.cardId as string;
      card.verification.edition = (existingVerification.edition as number) ?? 0;
      console.log(JSON.stringify({ reqId, event: "PRESERVED_CARD_ID", cardId: card.verification.cardId, edition: card.verification.edition }));
    } else {
      // First time — get atomic edition number
      const { data: editionNum, error: editionErr } = await admin.rpc("increment_edition", {
        p_card_id: card.verification.cardId,
      });
      if (!editionErr && typeof editionNum === "number") {
        card.verification.edition = editionNum;
      }
      console.log(JSON.stringify({ reqId, event: "NEW_CARD_ID", cardId: card.verification.cardId, edition: card.verification.edition }));
    }

    const topLang = raw.languages[0]?.name || null;

    // Upsert profile
    const { error: profileErr } = await admin.from("profiles").upsert(
      {
        id: raw.login,
        user_id: session.userId,
        username: raw.login,
        display_name: raw.name,
        avatar_url: raw.avatarUrl,
        stats: raw as unknown as Record<string, unknown>,
        card: card as unknown as Record<string, unknown>,
        company: raw.company || null,
        primary_language: topLang,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
    if (profileErr) {
      console.log(JSON.stringify({ reqId, event: "UPSERT_ERROR", error: profileErr.message }));
      return NextResponse.json({ error: `Failed to save profile: ${profileErr.message}` }, { status: 500 });
    }

    // Upsert leaderboard entry
    await admin.from("leaderboard").upsert(
      {
        username: raw.login,
        display_name: raw.name,
        avatar_url: raw.avatarUrl,
        rarity: card.rarity,
        rarity_score: card.rarityScore,
        primary_class: card.primaryClass,
        stats: card.stats as unknown as Record<string, unknown>,
        company: raw.company || null,
        primary_language: topLang,
        generated_at: new Date().toISOString(),
      },
      { onConflict: "username" }
    );

    // Increment card count atomically
    await admin.rpc("increment_card_count");

    // Get rank
    const { count: totalCards } = await admin
      .from("leaderboard")
      .select("*", { count: "exact", head: true });

    const { data: rankData } = await admin
      .from("leaderboard")
      .select("username")
      .gt("rarity_score", card.rarityScore)
      .order("rarity_score", { ascending: false });
    const rank = (rankData?.length ?? 0) + 1;

    console.log(JSON.stringify({ reqId, event: "POST_COMPLETE", finalCardId: card.verification.cardId, rank, totalCards: totalCards ?? 0 }));
    return NextResponse.json({ card: { ...card, rank, totalCards: totalCards ?? 0 } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate card";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const admin = getSupabaseAdmin();
  let count = 0;
  if (admin) {
    const { data } = await admin
      .from("card_count")
      .select("count")
      .eq("id", 1)
      .single();
    count = data?.count ?? 0;
  }
  return NextResponse.json({ count });
}
