import type { RawGitHubStats, CardStats, ClassName } from "@/types";

interface ClassRule {
  name: ClassName;
  score: (raw: RawGitHubStats, stats: CardStats) => number;
}

function isNightOwl(raw: RawGitHubStats): boolean {
  if (raw.commitHourDistribution.length === 0) return false;
  const nightHours = raw.commitHourDistribution.filter((h) => h >= 0 && h < 5).length;
  return nightHours / raw.commitHourDistribution.length > 0.3;
}

function hasNecroCommit(raw: RawGitHubStats): boolean {
  const now = Date.now();
  const oneYearMs = 365 * 24 * 60 * 60 * 1000;
  for (const pushedAt of raw.repoPushedAts) {
    const pushed = new Date(pushedAt).getTime();
    const created = new Date(raw.createdAt).getTime();
    if (pushed - created > oneYearMs && now - pushed < 90 * 24 * 60 * 60 * 1000) {
      return true;
    }
  }
  return false;
}

const rules: ClassRule[] = [
  {
    name: "PR Titan",
    score: (raw) => Math.min(100, raw.mergedPRs * 1.8),
  },
  {
    name: "Bug Hunter",
    score: (raw) => {
      const total = raw.mergedPRs + raw.closedIssues;
      const ratio = total > 0 ? raw.closedIssues / total : 0;
      return Math.min(100, raw.closedIssues * 1.5 + ratio * 40);
    },
  },
  {
    name: "Night Owl",
    score: (raw) => (isNightOwl(raw) ? 85 : 0),
  },
  {
    name: "Fork Warden",
    score: (raw) => {
      const ratio = raw.originalRepos > 0 ? raw.forkedRepos / raw.originalRepos : raw.forkedRepos;
      return Math.min(100, ratio * 30);
    },
  },
  {
    name: "Commit Phantom",
    score: (raw) => (hasNecroCommit(raw) ? 90 : 0),
  },
  {
    name: "Open Source Sentinel",
    score: (raw) => Math.min(100, raw.contributedTo * 5 + raw.orgCount * 15),
  },
  {
    name: "Merge Griffin",
    score: (raw, stats) => {
      const mergeScore = Math.min(100, raw.mergedPRs * 1.2);
      const velocityBonus = stats.codeVelocity > 70 ? 20 : 0;
      return Math.min(100, mergeScore + velocityBonus);
    },
  },
  {
    name: "Stack Guardian",
    score: (raw) => {
      const repoBreadth = Math.min(60, raw.originalRepos * 3);
      const langDepth = Math.min(40, raw.languages.length * 8);
      return Math.min(100, repoBreadth + langDepth);
    },
  },
  {
    name: "Polyglot Artisan",
    score: (raw) => Math.min(100, raw.languages.length * 12),
  },
  {
    name: "Code Archivist",
    score: (raw) => Math.min(100, raw.archivedRepos * 15 + raw.originalRepos * 2),
  },
  {
    name: "Green Sprout",
    score: (raw) => {
      const accountAge = (Date.now() - new Date(raw.createdAt).getTime()) / (365 * 24 * 60 * 60 * 1000);
      const isNew = accountAge < 2;
      const hasActivity = raw.recentCommits > 10;
      if (!isNew) return 0;
      return Math.min(100, (raw.originalRepos * 5 + (hasActivity ? 40 : 0)));
    },
  },
  {
    name: "Zen Coder",
    score: (raw) => {
      const hasRepos = raw.originalRepos > 5;
      if (!hasRepos) return 0;
      const cleanRatio = raw.zeroStarRepos > 0 ? raw.zeroStarRepos / raw.originalRepos : 0;
      return Math.min(100, cleanRatio * 80 + raw.originalRepos * 2);
    },
  },
];

export function assignClasses(
  raw: RawGitHubStats,
  stats: CardStats
): { primary: ClassName; secondary: ClassName | null } {
  const scored = rules
    .map((rule) => ({ name: rule.name, score: rule.score(raw, stats) }))
    .sort((a, b) => b.score - a.score)
    .filter((r) => r.score > 0);

  if (scored.length === 0) {
    return { primary: "Stack Guardian", secondary: null };
  }

  const primary = scored[0].name;
  const secondary = scored.length > 1 ? scored[1].name : null;

  return { primary, secondary };
}
