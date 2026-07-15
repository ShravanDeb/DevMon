import type { MetricConfig, RawGitHubStats, NormalizedMetrics, EngineContext } from "@/types";
import { NORMALIZATION_CONFIG } from "@/lib/config";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function normalizeMetric(raw: number, config: MetricConfig): { score: number; explanation: string } {
  let score: number;

  switch (config.curve) {
    case "log":
      score = Math.log(1 + raw) / Math.log(1 + config.target);
      break;
    case "logistic":
      score = 1 / (1 + Math.exp(-config.steepness * (raw - config.target)));
      score = (score - 0.5) * 2;
      break;
    case "sqrt":
      score = Math.sqrt(raw) / Math.sqrt(config.target);
      break;
    case "power":
      score = Math.pow(raw / config.target, config.steepness);
      break;
    default:
      score = 0;
  }

  const clamped = clamp(score, 0, 1);
  const normalized = Math.round(clamped * config.maxScore);
  const clampedScore = clamp(normalized, 0, config.maxScore);
  const finalScore = Math.round(clampedScore);

  const explanation = `${raw} → ${config.curve} curve (target=${config.target}, steepness=${config.steepness}) → ${finalScore}`;

  return { score: finalScore, explanation };
}

export function getAgeYears(createdAt: string): number {
  const age = (Date.now() - new Date(createdAt).getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  return Math.max(0, age);
}

export function normalizeAll(raw: RawGitHubStats, ctx: EngineContext): NormalizedMetrics {
  const years = getAgeYears(raw.createdAt);
  const rawForAge: Record<string, number> = {
    followers: raw.followers,
    stars: raw.totalStars,
    commits: raw.totalCommits,
    recentCommits: raw.recentCommits,
    mergedPRs: raw.mergedPRs,
    closedIssues: raw.closedIssues,
    repositories: raw.totalRepos,
    originalRepositories: raw.originalRepos,
    contributedTo: raw.contributedTo,
    organizations: raw.orgCount,
    languages: raw.languages.length,
    accountAge: years,
    forks: raw.totalForks,
    currentStreak: raw.currentStreak,
    longestStreak: raw.longestStreak,
  };

  const explanations: Record<string, string> = {};
  const metrics: Record<string, number> = {};

  for (const [key, value] of Object.entries(rawForAge)) {
    const config = NORMALIZATION_CONFIG[key];
    if (config) {
      const { score, explanation } = normalizeMetric(value, config);
      metrics[key] = score;
      explanations[key] = explanation;
    } else {
      metrics[key] = 0;
      explanations[key] = "no config";
    }
  }

  ctx.normalizationExplanations = explanations;

  return {
    followers: metrics.followers,
    stars: metrics.stars,
    commits: metrics.commits,
    recentCommits: metrics.recentCommits,
    mergedPRs: metrics.mergedPRs,
    closedIssues: metrics.closedIssues,
    repositories: metrics.repositories,
    originalRepositories: metrics.originalRepositories,
    contributedTo: metrics.contributedTo,
    organizations: metrics.organizations,
    languages: metrics.languages,
    accountAge: metrics.accountAge,
    forks: metrics.forks,
    currentStreak: metrics.currentStreak,
    longestStreak: metrics.longestStreak,
  };
}
