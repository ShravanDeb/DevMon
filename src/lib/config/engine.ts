import type { EngineVersions, EngineFlags } from "@/types";

export const ENGINE_VERSIONS: EngineVersions = {
  engine: "2.0.0",
  balance: "2026.07",
  normalization: "2.0.0",
  configuration: "2.0.0",
};

export const ENGINE_FLAGS: EngineFlags = {
  enableHarmony: true,
  enableConfidence: false,
  enablePercentileNormalization: false,
  enableExperimentalClasses: false,
  enableExperimentalMoves: false,
  enableArchetypeLayer: true,
  enableScoringExplanation: true,
};
