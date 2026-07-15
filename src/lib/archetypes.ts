import type { BehaviouralAttributes, Archetype, AttributeRank, EngineContext } from "@/types";
import { ARCHETYPE_RULES } from "@/lib/config";
import { getAttributeRank } from "@/lib/ranks";

export function computeArchetype(
  attributes: BehaviouralAttributes,
  ctx: EngineContext
): { archetype: Archetype; attributeRanks: Record<keyof BehaviouralAttributes, AttributeRank>; summary: string } {
  const sorted = (Object.entries(attributes) as [keyof BehaviouralAttributes, number][])
    .sort((a, b) => b[1] - a[1]);

  const top: keyof BehaviouralAttributes = sorted[0][0];
  const second: keyof BehaviouralAttributes = sorted[1][0];

  ctx.topAttribute = top;
  ctx.secondAttribute = second;
  ctx.weakestAttribute = sorted[sorted.length - 1][0];

  const match = ARCHETYPE_RULES.find(
    (r) => r.primary === top && r.secondary === second
  );

  const archetype: Archetype = match?.archetype ?? "Builder";

  const attributeRanks = Object.fromEntries(
    (Object.entries(attributes) as [keyof BehaviouralAttributes, number][]).map(([key, val]) => [
      key,
      getAttributeRank(val),
    ])
  ) as Record<keyof BehaviouralAttributes, AttributeRank>;

  ctx.archetype = archetype;

  const summary = `Archetype: ${archetype} (${top} + ${second})`;

  return { archetype, attributeRanks, summary };
}
