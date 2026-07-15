import type { RawGitHubStats, BehaviouralAttributes, ClassName, Archetype } from "@/types";

export interface ClassDefinition {
  name: ClassName;
  archetype: Archetype;
  required: Partial<Record<keyof BehaviouralAttributes, number>>;
  preferred: Partial<Record<keyof BehaviouralAttributes, number>>;
  preferredWeight: number;
  rawMetricOverride?: (raw: RawGitHubStats) => number | undefined;
}

export const CLASS_DEFINITIONS: ClassDefinition[] = [
  {
    name: "PR Titan",
    archetype: "Collaborator",
    required: { synergy: 40 },
    preferred: { execution: 50, synergy: 60 },
    preferredWeight: 15,
  },
  {
    name: "Bug Hunter",
    archetype: "Maintainer",
    required: { synergy: 40 },
    preferred: { synergy: 60, impact: 40 },
    preferredWeight: 15,
  },
  {
    name: "Night Owl",
    archetype: "Creator",
    required: {},
    preferred: {},
    preferredWeight: 0,
    rawMetricOverride: (raw) => {
      if (raw.commitHourDistribution.length === 0) return 0;
      const nightHours = raw.commitHourDistribution.filter((h) => h >= 0 && h < 5).length;
      return nightHours / raw.commitHourDistribution.length > 0.3 ? 85 : 0;
    },
  },
  {
    name: "Fork Warden",
    archetype: "Explorer",
    required: { impact: 30 },
    preferred: { impact: 50, synergy: 40 },
    preferredWeight: 15,
  },
  {
    name: "Commit Phantom",
    archetype: "Creator",
    required: {},
    preferred: {},
    preferredWeight: 0,
    rawMetricOverride: (raw) => {
      const now = Date.now();
      const oneYearMs = 365 * 24 * 60 * 60 * 1000;
      for (const pushedAt of raw.repoPushedAts) {
        const pushed = new Date(pushedAt).getTime();
        const created = new Date(raw.createdAt).getTime();
        if (pushed - created > oneYearMs && now - pushed < 90 * 24 * 60 * 60 * 1000) {
          return 90;
        }
      }
      return 0;
    },
  },
  {
    name: "Open Source Sentinel",
    archetype: "Collaborator",
    required: { synergy: 30 },
    preferred: { synergy: 50, impact: 40 },
    preferredWeight: 15,
  },
  {
    name: "Merge Griffin",
    archetype: "Builder",
    required: { execution: 40 },
    preferred: { execution: 60, consistency: 50 },
    preferredWeight: 15,
  },
  {
    name: "Stack Guardian",
    archetype: "Architect",
    required: { mastery: 30 },
    preferred: { mastery: 50, execution: 40 },
    preferredWeight: 15,
  },
  {
    name: "Polyglot Artisan",
    archetype: "Explorer",
    required: { mastery: 40 },
    preferred: { mastery: 60, execution: 40 },
    preferredWeight: 15,
  },
  {
    name: "Code Archivist",
    archetype: "Maintainer",
    required: { mastery: 30, consistency: 30 },
    preferred: { mastery: 50, consistency: 50 },
    preferredWeight: 15,
  },
  {
    name: "Green Sprout",
    archetype: "Builder",
    required: {},
    preferred: { execution: 30, consistency: 30 },
    preferredWeight: 15,
    rawMetricOverride: (raw) => {
      const accountAge = (Date.now() - new Date(raw.createdAt).getTime()) / (365 * 24 * 60 * 60 * 1000);
      return accountAge < 2 ? undefined : 0;
    },
  },
  {
    name: "Zen Coder",
    archetype: "Maintainer",
    required: { consistency: 40 },
    preferred: { consistency: 60, mastery: 50 },
    preferredWeight: 15,
  },
];
