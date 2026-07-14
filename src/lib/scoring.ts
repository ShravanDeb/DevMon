import type { RawGitHubStats, CardStats, CardData, Rarity, FlavorTone } from "@/types";
import { computeRarity } from "./rarity";
import { assignClasses } from "./classes";
import { generateFlavorText } from "./flavor-text";
import { generateSignatureMove } from "./signature-move";
import { generateAchievements } from "./achievements";
import { generateVerification } from "./verification";
import { selectHeroStat } from "./hero-stat";

function logScale(value: number, factor: number = 10, max: number = 100): number {
  if (value <= 0) return 0;
  return Math.min(max, Math.round(Math.log2(value + 1) * factor));
}

function clamp(v: number): number {
  return Math.min(100, Math.max(0, Math.round(v)));
}

export function computeStats(raw: RawGitHubStats): CardStats {
  const prTotal = raw.mergedPRs + raw.closedIssues;
  const prCloseRate = prTotal > 0 ? raw.closedIssues / prTotal : 0;

  const mergeForce = clamp(
    logScale(raw.mergedPRs, 10) * 0.5 +
    logScale(raw.closedIssues, 10) * 0.3 +
    Math.min(100, raw.mergedPRs * 0.8) * 0.2
  );

  const streakComponent = Math.min(100, raw.currentStreak * 6);
  const recentComponent = logScale(raw.recentCommits, 18);
  const codeVelocity = clamp(
    recentComponent * 0.6 +
    streakComponent * 0.3 +
    logScale(raw.totalCommits, 8) * 0.1
  );

  const closeRateScore = clamp(prCloseRate * 120);
  const volumeScore = logScale(prTotal, 10);
  const issueDepth = raw.closedIssues > 0 ? Math.min(100, raw.closedIssues * 1.5) : 0;
  const problemSolving = clamp(
    closeRateScore * 0.4 +
    volumeScore * 0.35 +
    issueDepth * 0.25
  );

  const collabBase = raw.contributedTo * 6 + raw.orgCount * 12;
  const forkEngagement = raw.forkedRepos > 0 ? Math.min(40, raw.forkedRepos * 4) : 0;
  const communityPresence = Math.min(30, raw.followers * 0.5);
  const openSource = clamp(collabBase + forkEngagement + communityPresence);

  const longestStreakScore = Math.min(100, raw.longestStreak * 4);
  const currentStreakBonus = Math.min(100, raw.currentStreak * 6);
  const regularity = raw.totalRepos > 0
    ? Math.min(100, (raw.totalCommits / raw.totalRepos) * 2)
    : 0;
  const consistency = clamp(
    longestStreakScore * 0.4 +
    currentStreakBonus * 0.35 +
    regularity * 0.25
  );

  return { mergeForce, codeVelocity, problemSolving, openSource, consistency };
}

export function generateCard(raw: RawGitHubStats, tone?: FlavorTone, rarityOverride?: Rarity): CardData {
  const stats = computeStats(raw);
  const rarityScore = computeRarity(raw);
  const rarity = rarityOverride || getRarityFromScore(rarityScore);
  const { primary, secondary } = assignClasses(raw, stats);
  const flavorText = generateFlavorText(raw, stats, rarity, primary, tone);
  const signatureMove = generateSignatureMove(raw, stats);
  const achievements = generateAchievements(raw, stats);
  const verification = generateVerification(raw, stats, rarity, 0);
  const heroStat = selectHeroStat(raw, stats);

  return {
    username: raw.login,
    displayName: raw.name || raw.login,
    avatarUrl: raw.avatarUrl,
    bio: raw.bio,
    stats,
    rarity,
    rarityScore,
    primaryClass: primary,
    secondaryClass: secondary,
    flavorText,
    signatureMove,
    achievements,
    verification,
    heroStat,
    className: primary,
    generatedAt: new Date().toISOString(),
  };
}

export function getRarityFromScore(score: number): Rarity {
  if (score >= 97) return "Mythic";
  if (score >= 89) return "Legendary";
  if (score >= 71) return "Epic";
  if (score >= 46) return "Rare";
  return "Common";
}
