import type { BehaviouralAttributes } from "@/types";
import { ACHIEVEMENT_TIERS } from "@/lib/config";

export interface AchievementResult {
  label: string;
  value: string;
  icon: string;
}

const ATTRIBUTE_KEYS: (keyof BehaviouralAttributes)[] = [
  "execution", "impact", "synergy", "consistency", "mastery",
];

export function generateAchievements(attributes: BehaviouralAttributes): AchievementResult[] {
  const results: AchievementResult[] = [];

  // Only the highest unlocked tier per attribute
  for (const attr of ATTRIBUTE_KEYS) {
    const attrTiers = ACHIEVEMENT_TIERS
      .filter((t) => t.attribute === attr && attributes[attr] >= t.threshold)
      .sort((a, b) => b.tier - a.tier);

    if (attrTiers.length > 0) {
      const highest = attrTiers[0];
      results.push({
        label: highest.title,
        value: `${highest.attribute} ${highest.threshold}+`,
        icon: highest.icon,
      });
    }
  }

  // Add special achievements for outstanding scores
  if (attributes.mastery >= 95) {
    results.push({ label: "Grandmaster", value: "mastery 95+", icon: "GM" });
  }
  if (attributes.execution >= 95) {
    results.push({ label: "Grandmaster", value: "execution 95+", icon: "GM" });
  }
  if (hasBalancedElite(attributes)) {
    results.push({ label: "Balanced Elite", value: "all 70+", icon: "BE" });
  }

  // Sort: special achievements (icon length > 2) first, then by label
  results.sort((a, b) => {
    const aSpecial = a.icon.length > 2 ? 0 : 1;
    const bSpecial = b.icon.length > 2 ? 0 : 1;
    if (aSpecial !== bSpecial) return aSpecial - bSpecial;
    return b.label.localeCompare(a.label);
  });

  return results.slice(0, 6);
}

function hasBalancedElite(attributes: BehaviouralAttributes): boolean {
  return Object.values(attributes).every((v) => v >= 70);
}
