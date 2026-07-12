import type { RawGitHubStats, CardStats, SignatureMove } from "@/types";

interface MoveRule {
  name: string;
  description: string;
  icon: string;
  score: (raw: RawGitHubStats, stats: CardStats) => number;
}

const moves: MoveRule[] = [
  {
    name: "PR Storm",
    description: "Merged {{prs}} pull requests and counting",
    icon: "M",
    score: (raw) => Math.min(100, raw.mergedPRs * 2),
  },
  {
    name: "Recursive Refactor",
    description: "{{commits}} commits of continuous improvement",
    icon: "R",
    score: (raw) => Math.min(100, raw.totalCommits * 0.1 + (raw.originalRepos > 10 ? 30 : 0)),
  },
  {
    name: "Production Shield",
    description: "Closed {{issues}} issues like a fortress",
    icon: "P",
    score: (raw) => Math.min(100, raw.closedIssues * 2),
  },
  {
    name: "Commit Barrage",
    description: "{{recent}} commits in the last 30 days",
    icon: "C",
    score: (raw) => Math.min(100, raw.recentCommits * 1.5),
  },
  {
    name: "Infinite Merge",
    description: "A {{streak}}-day streak of unbroken delivery",
    icon: "I",
    score: (raw) => Math.min(100, raw.currentStreak * 6 + raw.longestStreak * 2),
  },
  {
    name: "Cherry Pick Strike",
    description: "Selected contributions across {{contributed}} repositories",
    icon: "S",
    score: (raw) => Math.min(100, raw.contributedTo * 8),
  },
  {
    name: "Dependency Crusher",
    description: "Forked {{forks}} repos and made them better",
    icon: "D",
    score: (raw) => Math.min(100, raw.forkedRepos * 4),
  },
  {
    name: "Star Forge",
    description: "{{stars}} stars earned through quality code",
    icon: "★",
    score: (raw) => Math.min(100, raw.totalStars * 0.5),
  },
  {
    name: "Branch Collapse",
    description: "{{repos}} repositories in the portfolio",
    icon: "B",
    score: (raw) => Math.min(100, raw.originalRepos * 3),
  },
  {
    name: "Language Weaver",
    description: "Fluent in {{langs}} programming languages",
    icon: "L",
    score: (raw) => Math.min(100, raw.languages.length * 14),
  },
  {
    name: "Night Shift",
    description: "Forging code while the world sleeps",
    icon: "N",
    score: (raw) => {
      if (raw.commitHourDistribution.length === 0) return 0;
      const night = raw.commitHourDistribution.filter((h) => h >= 0 && h < 5).length;
      return night / raw.commitHourDistribution.length > 0.3 ? 80 : 0;
    },
  },
  {
    name: "Community Pulse",
    description: "{{followers}} developers watching the journey",
    icon: "♥",
    score: (raw) => Math.min(100, raw.followers * 1.5),
  },
  {
    name: "Necro Commit",
    description: "Resurrected a dormant repository from the depths",
    icon: "Z",
    score: (raw) => {
      const now = Date.now();
      const oneYearMs = 365 * 24 * 60 * 60 * 1000;
      for (const pushedAt of raw.repoPushedAts) {
        const pushed = new Date(pushedAt).getTime();
        const created = new Date(raw.createdAt).getTime();
        if (pushed - created > oneYearMs && now - pushed < 90 * 24 * 60 * 60 * 1000) {
          return 85;
        }
      }
      return 0;
    },
  },
  {
    name: "Stack Sovereign",
    description: "Commands a full-stack empire across {{repos}} projects",
    icon: "K",
    score: (raw) => Math.min(100, raw.originalRepos * 2 + raw.languages.length * 10),
  },
];

export function generateSignatureMove(raw: RawGitHubStats, stats: CardStats): SignatureMove {
  const scored = moves
    .map((m) => ({ ...m, score: m.score(raw, stats) }))
    .sort((a, b) => b.score - a.score);

  const best = scored[0];

  const description = best.description
    .replace(/\{\{prs\}\}/g, String(raw.mergedPRs))
    .replace(/\{\{commits\}\}/g, String(raw.totalCommits))
    .replace(/\{\{issues\}\}/g, String(raw.closedIssues))
    .replace(/\{\{recent\}\}/g, String(raw.recentCommits))
    .replace(/\{\{streak\}\}/g, String(raw.currentStreak))
    .replace(/\{\{contributed\}\}/g, String(raw.contributedTo))
    .replace(/\{\{forks\}\}/g, String(raw.forkedRepos))
    .replace(/\{\{stars\}\}/g, String(raw.totalStars))
    .replace(/\{\{repos\}\}/g, String(raw.originalRepos))
    .replace(/\{\{langs\}\}/g, String(raw.languages.length))
    .replace(/\{\{followers\}\}/g, String(raw.followers));

  return {
    name: best.name,
    description,
    icon: best.icon,
  };
}
