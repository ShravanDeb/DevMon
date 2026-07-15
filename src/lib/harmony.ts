import type { BehaviouralAttributes, HarmonyExplanation, EngineContext } from "@/types";
import { HARMONY_CONFIG } from "@/lib/config";

export function computeHarmony(
  attributes: BehaviouralAttributes,
  ctx: EngineContext
): { bonus: number; explanation: HarmonyExplanation } {
  const entries = Object.entries(attributes) as [keyof BehaviouralAttributes, number][];
  let weakestAttr: keyof BehaviouralAttributes = entries[0][0];
  let weakestScore = entries[0][1];
  let highestScore = entries[0][1];

  for (const [key, val] of entries) {
    if (val < weakestScore) { weakestScore = val; weakestAttr = key; }
    if (val > highestScore) { highestScore = val; }
  }

  const spread = highestScore - weakestScore;
  const { maxBonus, weakestFloor, spreadCeiling } = HARMONY_CONFIG;

  const weakestFactor = Math.min(1, weakestScore / weakestFloor);
  const spreadFactor = Math.max(0, 1 - spread / spreadCeiling);
  const rawBonus = Math.round(weakestFactor * spreadFactor * maxBonus);
  const bonus = Math.min(maxBonus, Math.max(0, rawBonus));

  const explanation: HarmonyExplanation = {
    bonus,
    weakestAttribute: weakestAttr,
    weakestScore,
    spread,
    reason: `weakest=${weakestAttr}(${weakestScore}), spread=${spread} → bonus=${bonus}`,
  };

  ctx.harmonyExplanation = explanation;

  return { bonus, explanation };
}
