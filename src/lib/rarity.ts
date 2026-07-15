import type { BehaviouralAttributes, Rarity, RarityBreakdown, RarityExplanation, EngineContext } from "@/types";
import { RARITY_CONFIG } from "@/lib/config";
import { computeHarmony } from "@/lib/harmony";

export function computeRarityFromAttributes(
  attributes: BehaviouralAttributes,
  ctx: EngineContext
): { rarity: Rarity; score: number; breakdown: RarityBreakdown; explanation: RarityExplanation } {
  const { weights, thresholds } = RARITY_CONFIG;

  let weightedSum = 0;
  for (const [attr, weight] of Object.entries(weights)) {
    weightedSum += (attributes as unknown as Record<string, number>)[attr] * weight;
  }
  const weightedAverage = Math.round(weightedSum);

  const { bonus, explanation: harmonyExplanation } = computeHarmony(attributes, ctx);

  const finalScore = Math.min(100, weightedAverage + bonus);

  let tier: Rarity = "Common";
  const sortedThresholds = (Object.entries(thresholds) as [Rarity, number][]).sort((a, b) => b[1] - a[1]);
  for (const [t, threshold] of sortedThresholds) {
    if (finalScore >= threshold) { tier = t; break; }
  }

  const breakdown: RarityBreakdown = {
    weightedAverage,
    harmonyBonus: bonus,
    harmonyFactors: {
      weakestAttribute: harmonyExplanation.weakestAttribute,
      weakestScore: harmonyExplanation.weakestScore,
      spread: harmonyExplanation.spread,
    },
    finalScore,
    tier,
  };

  const explanation: RarityExplanation = {
    weightedAverage,
    harmonyBonus: bonus,
    finalScore,
    tier,
    reason: `weighted avg=${weightedAverage} + harmony=${bonus} = ${finalScore} → ${tier}`,
  };

  ctx.rarityBreakdown = breakdown;
  ctx.rarityExplanation = explanation;

  return { rarity: tier, score: finalScore, breakdown, explanation };
}

export function rarityLabel(tier: Rarity): string {
  const tierLabels: Record<Rarity, string> = {
    Common: "C",
    Rare: "R",
    Epic: "E",
    Legendary: "L",
    Mythic: "M",
  };
  return tierLabels[tier] ?? "C";
}
