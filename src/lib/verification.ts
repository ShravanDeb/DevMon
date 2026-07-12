import { createHmac, randomBytes } from "crypto";
import type { RawGitHubStats, CardStats, Rarity, VerificationData } from "@/types";

const HMAC_SECRET = process.env.HMAC_SECRET || "devmon-dev-secret-change-in-production";

function generateCardId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(6);
  let id = "DM-";
  for (let i = 0; i < 6; i++) {
    id += chars[bytes[i] % chars.length];
  }
  return id;
}

function computeHmac(raw: RawGitHubStats, stats: CardStats, rarity: Rarity, cardId: string): string {
  const payload = JSON.stringify({
    username: raw.login,
    stats,
    rarity,
    cardId,
  });
  return createHmac("sha256", HMAC_SECRET).update(payload).digest("hex");
}

export function generateVerification(
  raw: RawGitHubStats,
  stats: CardStats,
  rarity: Rarity,
  edition?: number
): VerificationData {
  const cardId = generateCardId();
  const now = new Date().toISOString();
  const hmacHex = computeHmac(raw, stats, rarity, cardId);

  return {
    cardId,
    edition: edition ?? 0,
    generatedAt: now,
    version: "1.0.0",
    digitalSignature: `hmac_${hmacHex}`,
    sha256Hash: hmacHex,
  };
}
