import type { RawGitHubStats } from "@/types";

function logCentile(value: number, target: number, strictness: number = 1): number {
  if (value <= 0) return 0;
  const ratio = value / target;
  const score = Math.log10(ratio + 1) * 50 * strictness;
  return Math.min(100, Math.round(score));
}

function ageScore(createdAt: string): number {
  const ageMs = Date.now() - new Date(createdAt).getTime();
  const ageYears = ageMs / (1000 * 60 * 60 * 24 * 365.25);
  if (ageYears >= 10) return 100;
  if (ageYears >= 5) return 80;
  if (ageYears >= 3) return 60;
  if (ageYears >= 1) return 30;
  return 10;
}

export function computeRarity(raw: RawGitHubStats): number {
  const followerScore = logCentile(raw.followers, 100, 2);
  const starScore = logCentile(raw.totalStars, 500, 2);
  const commitScore = logCentile(raw.totalCommits, 1000, 2);
  const contribScore = logCentile(raw.recentCommits, 200, 2);
  const prScore = logCentile(raw.mergedPRs, 100, 2);
  const issueScore = logCentile(raw.closedIssues, 100, 2);
  const age = ageScore(raw.createdAt);
  const orgScore = Math.min(100, raw.orgCount * 20);

  const composite =
    followerScore * 0.15 +
    starScore * 0.20 +
    commitScore * 0.15 +
    contribScore * 0.10 +
    prScore * 0.10 +
    issueScore * 0.10 +
    age * 0.10 +
    orgScore * 0.10;

  return Math.round(Math.min(100, composite));
}
