import type { BehaviouralAttributes, NormalizedMetrics, ComponentBreakdown, AttributeExplanation, EngineContext } from "@/types";
import { COMPONENTS, ATTRIBUTE_AGGREGATION } from "@/lib/config";
import { getAttributeRank } from "./ranks";

function computeComponentsForAttribute(
  normalized: NormalizedMetrics,
  componentWeights: Record<string, number>
): ComponentBreakdown[] {
  return Object.entries(componentWeights).map(([name, weight]) => {
    const config = COMPONENTS[name];
    if (!config) return { name, label: name, score: 0, weight, contribution: 0 };

    let score = 0;
    for (const [metricKey, metricWeight] of Object.entries(config.weights)) {
      const metricValue = (normalized as unknown as Record<string, number>)[metricKey] ?? 0;
      score += metricValue * metricWeight;
    }

    const contribution = Math.round(score * weight);
    return {
      name,
      label: config.label,
      score: Math.round(score),
      weight,
      contribution,
    };
  });
}

export function computeAttributes(
  normalized: NormalizedMetrics,
  ctx: EngineContext
): { attributes: BehaviouralAttributes; explanations: AttributeExplanation[] } {
  const attributes: Record<string, number> = {};
  const explanations: AttributeExplanation[] = [];

  for (const [attrName, componentWeights] of Object.entries(ATTRIBUTE_AGGREGATION)) {
    const components = computeComponentsForAttribute(normalized, componentWeights);
    const total = components.reduce((sum, c) => sum + c.contribution, 0);
    const score = Math.round(Math.min(100, total));

    attributes[attrName] = score;

    explanations.push({
      attribute: attrName as keyof BehaviouralAttributes,
      score,
      rank: getAttributeRank(score),
      components,
      summary: `${attrName}: ${score}/100 (${components.length} components)`,
      confidence: 1.0,
    });
  }

  ctx.attributeExplanations = explanations;

  return {
    attributes: attributes as unknown as BehaviouralAttributes,
    explanations,
  };
}
