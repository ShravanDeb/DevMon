import type { EngineContext, ScoringExplanation, DebugMetadata } from "@/types";
import { ENGINE_VERSIONS } from "@/lib/config";

export function buildExplanation(ctx: EngineContext): ScoringExplanation {
  return {
    attributeExplanations: ctx.attributeExplanations,
    harmonyExplanation: ctx.harmonyExplanation,
    rarityExplanation: ctx.rarityExplanation,
    heroAttributeExplanation: ctx.heroAttributeExplanation,
    classExplanation: ctx.classExplanation,
    signatureMoveExplanation: ctx.signatureMoveExplanation,
  };
}

export function buildDebugMetadata(ctx: EngineContext): DebugMetadata {
  return {
    rawMetrics: ctx.rawMetrics,
    normalizedMetrics: ctx.normalizedMetrics,
    attributeExplanations: ctx.attributeExplanations,
    rarityBreakdown: ctx.rarityBreakdown,
    archetype: ctx.archetype,
    explanation: buildExplanation(ctx),
    engineVersions: ENGINE_VERSIONS,
  };
}
