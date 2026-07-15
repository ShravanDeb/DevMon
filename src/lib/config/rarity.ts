import type { Rarity } from "@/types";

export interface RarityConfig {
  weights: Record<string, number>;
  thresholds: Record<Rarity, number>;
}

export const RARITY_CONFIG: RarityConfig = {
  weights: {
    execution: 0.28,
    impact: 0.24,
    synergy: 0.18,
    consistency: 0.15,
    mastery: 0.15,
  },
  thresholds: {
    Common: 0,
    Rare: 46,
    Epic: 71,
    Legendary: 89,
    Mythic: 97,
  },
};
