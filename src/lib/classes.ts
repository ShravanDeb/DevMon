import type { RawGitHubStats, BehaviouralAttributes, ClassName, Archetype, ClassExplanation, EngineContext } from "@/types";
import { CLASS_DEFINITIONS } from "@/lib/config";

export function assignClasses(
  raw: RawGitHubStats,
  attributes: BehaviouralAttributes,
  archetype: Archetype,
  ctx: EngineContext
): { primary: ClassName; secondary: ClassName | null; explanation: ClassExplanation } {
  const scores: Record<ClassName, number> = {} as Record<ClassName, number>;

  for (const def of CLASS_DEFINITIONS) {
    let score = 0;

    const allRequiredMet = (Object.entries(def.required) as [keyof BehaviouralAttributes, number][]).every(
      ([attr, min]) => attributes[attr] >= min
    );
    if (!allRequiredMet) {
      scores[def.name] = 0;
      continue;
    }

    if (def.rawMetricOverride) {
      const override = def.rawMetricOverride(raw);
      if (override !== undefined) {
        scores[def.name] = override;
        continue;
      }
    }

    for (const [attr, weight] of Object.entries(def.preferred) as [keyof BehaviouralAttributes, number][]) {
      score += attributes[attr] * weight;
    }

    const preferredWeightTotal = Object.values(def.preferred).reduce((a, b) => a + b, 0);
    const maxPossible = preferredWeightTotal * 100;
    const normalized = maxPossible > 0 ? (score / maxPossible) * 100 : 0;
    scores[def.name] = Math.round(normalized * (def.preferredWeight / 100));
  }

  const sorted = (Object.entries(scores) as [ClassName, number][])
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1]);

  const primary = sorted[0]?.[0] ?? "Stack Guardian";
  const secondary = sorted[1]?.[0] ?? null;

  const explanation: ClassExplanation = {
    primaryClass: primary,
    secondaryClass: secondary,
    archetype,
    scores: scores,
    reason: `Primary: ${primary}, Secondary: ${secondary ?? "none"}`,
  };

  ctx.classExplanation = explanation;

  return { primary, secondary, explanation };
}
