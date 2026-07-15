import { ImageResponse } from "next/og";
import { fetchGitHubStats } from "@/lib/github";
import { generateCard } from "@/lib/scoring";
import { getSupabaseAnon } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("user") || searchParams.get("username");

    if (!username) {
      return new Response("Missing user parameter", { status: 400 });
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return new Response("OG generation not configured", { status: 503 });
    }

    let card;
    try {
      const raw = await fetchGitHubStats(token, { username });
      card = generateCard(raw);
    } catch {
      // Try reading from Supabase cache (cards table)
      const db = getSupabaseAnon();
      const { data } = await db
        .from("cards")
        .select("stats, rarity, rarity_score, primary_class, display_name, avatar_url")
        .eq("github_username", username)
        .maybeSingle();
      if (data) {
        card = {
          stats: data.stats,
          rarity: data.rarity,
          rarityScore: data.rarity_score,
          primaryClass: data.primary_class,
          displayName: data.display_name,
          avatarUrl: data.avatar_url,
        };
      }
    }

    const rarityColorMap: Record<string, string> = {
      Common: "#8A8F98",
      Rare: "#3E6FE0",
      Epic: "#6C4BA6",
      Legendary: "#E0932E",
      Mythic: "#B23A48",
    };

    const rarity = card?.rarity || "Common";
    const accentColor = rarityColorMap[rarity] || "#8A8F98";

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#0A0A0B",
            fontFamily: "Geist, sans-serif",
            padding: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              maxWidth: 600,
              padding: "32px",
              background: "#131316",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 24px rgba(0,0,0,0.2), 0 0 30px ${accentColor}22`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24, width: "100%" }}>
              <img
                src={card?.avatarUrl || `https://avatars.githubusercontent.com/${username}`}
                width={80}
                height={80}
                style={{ borderRadius: 40, border: "2px solid rgba(242,241,238,0.15)" }}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 28, fontWeight: 600, color: "#F2F1EE", fontFamily: "Fraunces, serif" }}>
                  {card?.displayName || username}
                </div>
                <div style={{ fontSize: 13, color: "#9B9995", fontFamily: "Geist Mono, monospace" }}>
                  @{username}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 24, alignItems: "center" }}>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: 6,
                  background: accentColor,
                  color: "#0A0A0B",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "Geist Mono, monospace",
                  textTransform: "uppercase",
                }}
              >
                {rarity}
              </span>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: 6,
                  background: "#1B1B1F",
                  color: "#9B9995",
                  fontSize: 13,
                  fontFamily: "Geist Mono, monospace",
                }}
              >
                {card?.primaryClass || "Unknown"}
              </span>
            </div>

            {card && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
                {([
                  { label: "MERGE FORCE", key: "mergeForce" },
                  { label: "CODE VELOCITY", key: "codeVelocity" },
                  { label: "PROBLEM SOLVING", key: "problemSolving" },
                  { label: "OPEN SOURCE", key: "openSource" },
                  { label: "CONSISTENCY", key: "consistency" },
                ] as const).map(({ label, key }) => {
                  const value = (card.stats as Record<string, number>)?.[key] ?? 0;
                  return (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ width: 100, fontSize: 13, fontWeight: 500, color: "#65635D", fontFamily: "Geist Mono, monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        {label}
                      </span>
                      <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 6, overflow: "hidden" }}>
                        <div style={{ width: `${value}%`, height: "100%", background: accentColor, borderRadius: 6 }} />
                      </div>
                      <span style={{ width: 28, fontSize: 13, fontWeight: 500, color: "#F2F1EE", textAlign: "right", fontFamily: "Geist Mono, monospace" }}>
                        {value}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ marginTop: 24, fontSize: 13, color: "#65635D", textAlign: "center", fontFamily: "Geist Mono, monospace" }}>
              DevMon — Open-Source Developer Credentials
            </div>
          </div>
        </div>
      ),
      {
        width: 800,
        height: 500,
        headers: {
          "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
        },
      }
    );
  } catch {
    return new Response("OG generation error", { status: 500 });
  }
}
