import { createHmac, randomBytes } from "crypto";
import type { RawGitHubStats, Rarity, VerificationData } from "@/types";
import { ENGINE_VERSIONS } from "@/lib/config";

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

function computeHmac(raw: RawGitHubStats, rarity: Rarity, cardId: string): string {
  const payload = JSON.stringify({
    username: raw.login,
    rarity,
    cardId,
  });
  return createHmac("sha256", HMAC_SECRET).update(payload).digest("hex");
}

export function generateVerification(
  raw: RawGitHubStats,
  rarity: Rarity,
  edition: number
): VerificationData {
  const cardId = generateCardId();
  const now = new Date().toISOString();
  const hmacHex = computeHmac(raw, rarity, cardId);

  return {
    cardId,
    edition,
    generatedAt: now,
    version: "2.0.0",
    balanceVersion: ENGINE_VERSIONS.balance,
    digitalSignature: `hmac_${hmacHex}`,
    sha256Hash: hmacHex,
  };
}

export function reSignVerification(
  raw: RawGitHubStats,
  rarity: Rarity,
  existingCardId: string,
  existingEdition: number
): VerificationData {
  const now = new Date().toISOString();
  const hmacHex = computeHmac(raw, rarity, existingCardId);

  return {
    cardId: existingCardId,
    edition: existingEdition,
    generatedAt: now,
    version: "2.0.0",
    balanceVersion: ENGINE_VERSIONS.balance,
    digitalSignature: `hmac_${hmacHex}`,
    sha256Hash: hmacHex,
  };
}
