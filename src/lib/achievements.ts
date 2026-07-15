import type { BehaviouralAttributes } from "@/types";
import { ACHIEVEMENT_TIERS } from "@/lib/config";

export interface AchievementResult {
  label: string;
  value: string;
  icon: string;
}

export function generateAchievements(attributes: BehaviouralAttributes): AchievementResult[] {
  const results: AchievementResult[] = [];

  for (const tier of ACHIEVEMENT_TIERS) {
    const attrValue = attributes[tier.attribute];
    if (attrValue >= tier.threshold) {
      results.push({
        label: tier.title,
        value: `${tier.attribute} ${tier.threshold}+`,
        icon: tier.icon,
      });
    }
  }

  results.sort((a, b) => b.label.localeCompare(a.label));
  return results.slice(0, 6);
}
