import type { AttributeRank } from "@/types";
import { ATTRIBUTE_RANKS } from "@/lib/config";

export function getAttributeRank(value: number): AttributeRank {
  for (const tier of ATTRIBUTE_RANKS) {
    if (value >= tier.min && value <= tier.max) return tier.rank;
  }
  return "Novice";
}
