import type { BehaviouralAttributes, HeroStat } from "@/types";
import { getAttributeRank } from "@/lib/ranks";

const LABELS: Record<keyof BehaviouralAttributes, string> = {
  execution: "Execution",
  impact: "Impact",
  synergy: "Synergy",
  consistency: "Consistency",
  mastery: "Mastery",
};

export function selectHeroStat(attributes: BehaviouralAttributes): HeroStat {
  const entries = (Object.entries(attributes) as [keyof BehaviouralAttributes, number][])
    .sort((a, b) => b[1] - a[1]);

  const best = entries[0];

  return {
    attribute: best[0],
    label: LABELS[best[0]],
    score: best[1],
    rank: getAttributeRank(best[1]),
  };
}
