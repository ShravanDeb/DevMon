import type { RawGitHubStats, CardStats, Achievement } from "@/types";

interface AchievementDef {
  label: string;
  value: (raw: RawGitHubStats, stats: CardStats) => string;
  priority: (raw: RawGitHubStats, stats: CardStats) => number;
  icon: string;
}

function fmt(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

const defs: AchievementDef[] = [
  {
    label: "Stars",
    value: (raw) => fmt(raw.totalStars),
    priority: (raw) => Math.min(100, raw.totalStars * 0.3),
    icon: "★",
  },
  {
    label: "Day Streak",
    value: (raw) => String(raw.longestStreak),
    priority: (raw) => Math.min(100, raw.longestStreak * 3),
    icon: "F",
  },
  {
    label: "Repositories",
    value: (raw) => String(raw.originalRepos),
    priority: (raw) => Math.min(100, raw.originalRepos * 2.5),
    icon: "R",
  },
  {
    label: "Languages",
    value: (raw) => String(raw.languages.length),
    priority: (raw) => Math.min(100, raw.languages.length * 12),
    icon: "L",
  },
  {
    label: "Contributions",
    value: (raw) => fmt(raw.totalCommits),
    priority: (raw) => Math.min(100, raw.totalCommits * 0.08),
    icon: "C",
  },
  {
    label: "PRs Merged",
    value: (raw) => fmt(raw.mergedPRs),
    priority: (raw) => Math.min(100, raw.mergedPRs * 1.2),
    icon: "M",
  },
  {
    label: "Followers",
    value: (raw) => fmt(raw.followers),
    priority: (raw) => Math.min(100, raw.followers * 1.5),
    icon: "♥",
  },
  {
    label: "Issues Closed",
    value: (raw) => fmt(raw.closedIssues),
    priority: (raw) => Math.min(100, raw.closedIssues * 1.2),
    icon: "X",
  },
];

export function generateAchievements(raw: RawGitHubStats, stats: CardStats): Achievement[] {
  const scored = defs
    .map((d) => ({
      label: d.label,
      value: d.value(raw, stats),
      icon: d.icon,
      score: d.priority(raw, stats),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return scored.map(({ label, value, icon }) => ({ label, value, icon }));
}
