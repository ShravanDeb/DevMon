import type { RawGitHubStats, CardData, CardDataDebug, Rarity, ClassName, FlavorTone, EngineContext } from "@/types";
import { normalizeAll } from "./normalization";
import { computeAttributes } from "./attributes";
import { computeArchetype } from "./archetypes";
import { computeRarityFromAttributes } from "./rarity";
import { selectHeroStat } from "./hero-stat";
import { generateSignatureMove } from "./signature-move";
import { generateAchievements } from "./achievements";
import { assignClasses } from "./classes";
import { generateFlavorText } from "./flavor-text";
import { generateVerification } from "./verification";
import { buildDebugMetadata } from "./explainability";
import { computeHarmony } from "./harmony";
import { ENGINE_VERSIONS, ENGINE_FLAGS } from "@/lib/config";

function createEngineContext(raw: RawGitHubStats): EngineContext {
  return {
    rawMetrics: raw,
    normalizedMetrics: {
      followers: 0, stars: 0, commits: 0, recentCommits: 0,
      mergedPRs: 0, closedIssues: 0, repositories: 0, originalRepositories: 0,
      contributedTo: 0, organizations: 0, languages: 0, accountAge: 0,
      forks: 0, currentStreak: 0, longestStreak: 0,
    },
    attributeComponents: {},
    behaviouralAttributes: { execution: 0, impact: 0, synergy: 0, consistency: 0, mastery: 0 },
    attributeExplanations: [],
    normalizationExplanations: {},
    archetype: "Builder",
    topAttribute: "execution",
    secondAttribute: "impact",
    weakestAttribute: "mastery",
    rarityScore: 0,
    rarity: "Common",
    rarityBreakdown: {
      weightedAverage: 0, harmonyBonus: 0,
      harmonyFactors: { weakestAttribute: "mastery", weakestScore: 0, spread: 0 },
      finalScore: 0, tier: "Common",
    },
    rarityExplanation: { weightedAverage: 0, harmonyBonus: 0, finalScore: 0, tier: "Common", reason: "" },
    harmonyExplanation: { bonus: 0, weakestAttribute: "mastery", weakestScore: 0, spread: 0, reason: "" },
    heroAttribute: { attribute: "execution", label: "Execution", score: 0, rank: "Novice" },
    heroAttributeExplanation: { attribute: "execution", score: 0, rank: "Novice", tieBreakingApplied: false, reason: "" },
    signatureMove: { name: "", description: "", icon: "" },
    signatureMoveExplanation: {
      move: { name: "", description: "", icon: "" },
      topAttribute: "execution", secondAttribute: "impact",
      topScore: 0, secondScore: 0, thresholdMet: false, reason: "",
    },
    achievements: [],
    primaryClass: "Stack Guardian",
    secondaryClass: null,
    className: "Stack Guardian",
    classExplanation: {
      primaryClass: "Stack Guardian", secondaryClass: null,
      archetype: "Builder", scores: {} as Record<ClassName, number>,
      reason: "",
    },
    engineVersions: ENGINE_VERSIONS,
    engineFlags: ENGINE_FLAGS,
  };
}

export function generateCard(
  raw: RawGitHubStats,
  tone?: FlavorTone,
  rarityOverride?: Rarity
): CardData {
  const ctx = createEngineContext(raw);

  const normalized = normalizeAll(raw, ctx);
  const { attributes } = computeAttributes(normalized, ctx);
  const { archetype, attributeRanks } = computeArchetype(attributes, ctx);
  const { rarity, score } = computeRarityFromAttributes(attributes, ctx);
  const { bonus } = computeHarmony(attributes, ctx);
  const heroStat = selectHeroStat(attributes);
  const { move } = generateSignatureMove(attributes, ctx);
  const achievements = generateAchievements(attributes);
  const { primary, secondary } = assignClasses(raw, attributes, archetype, ctx);

  ctx.behaviouralAttributes = attributes;
  ctx.rarityScore = score;
  ctx.rarity = rarityOverride || rarity;
  ctx.heroAttribute = heroStat;
  ctx.signatureMove = move;
  ctx.achievements = achievements;
  ctx.primaryClass = primary;
  ctx.secondaryClass = secondary;
  ctx.className = primary;

  const effectiveRarity = rarityOverride || rarity;
  const flavorText = generateFlavorText(raw, attributes, archetype, effectiveRarity, primary, tone);
  const verification = generateVerification(raw, effectiveRarity, 0);

  return {
    username: raw.login,
    displayName: raw.name || raw.login,
    avatarUrl: raw.avatarUrl,
    bio: raw.bio,
    attributes,
    attributeRanks,
    rarity: effectiveRarity,
    rarityScore: score,
    harmonyBonus: bonus,
    primaryClass: primary,
    secondaryClass: secondary,
    flavorText,
    signatureMove: move,
    achievements,
    heroStat,
    verification,
    generatedAt: new Date().toISOString(),
  };
}

export function generateCardDebug(raw: RawGitHubStats, tone?: FlavorTone): CardDataDebug {
  const card = generateCard(raw, tone);

  const ctx = createEngineContext(raw);
  normalizeAll(raw, ctx);
  computeAttributes(ctx.normalizedMetrics, ctx);
  computeArchetype(ctx.behaviouralAttributes, ctx);
  computeRarityFromAttributes(ctx.behaviouralAttributes, ctx);
  selectHeroStat(ctx.behaviouralAttributes);
  generateSignatureMove(ctx.behaviouralAttributes, ctx);
  generateAchievements(ctx.behaviouralAttributes);
  assignClasses(raw, ctx.behaviouralAttributes, ctx.archetype, ctx);

  const debug = buildDebugMetadata(ctx);

  return {
    ...card,
    _debug: debug,
  };
}

export function getRarityFromScore(score: number): Rarity {
  if (score >= 97) return "Mythic";
  if (score >= 89) return "Legendary";
  if (score >= 71) return "Epic";
  if (score >= 46) return "Rare";
  return "Common";
}
