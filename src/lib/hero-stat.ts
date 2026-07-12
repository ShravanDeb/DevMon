import type { RawGitHubStats, CardStats, HeroStat } from "@/types";

function fmt(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

interface Candidate {
  key: HeroStat["key"];
  label: string;
  value: number;
  unit: string;
  qualifier: string;
  weight: number;
}

export function selectHeroStat(raw: RawGitHubStats, stats: CardStats): HeroStat {
  const candidates: Candidate[] = [
    {
      key: "stars",
      label: "Stars",
      value: raw.totalStars,
      unit: "★",
      qualifier: "earned",
      weight: raw.totalStars * 3,
    },
    {
      key: "contributions",
      label: "Contributions",
      value: raw.totalCommits,
      unit: "",
      qualifier: "all time",
      weight: raw.totalCommits * 0.5,
    },
    {
      key: "streak",
      label: "Day Streak",
      value: raw.longestStreak,
      unit: "days",
      qualifier: "maintained",
      weight: raw.longestStreak * 8,
    },
    {
      key: "prs",
      label: "PRs Shipped",
      value: raw.mergedPRs,
      unit: "",
      qualifier: "shipped",
      weight: raw.mergedPRs * 4,
    },
    {
      key: "repos",
      label: "Repos Built",
      value: raw.originalRepos,
      unit: "",
      qualifier: "built",
      weight: raw.originalRepos * 5,
    },
    {
      key: "languages",
      label: "Languages",
      value: raw.languages.length,
      unit: "",
      qualifier: "mastered",
      weight: raw.languages.length * 10,
    },
    {
      key: "followers",
      label: "Followers",
      value: raw.followers,
      unit: "",
      qualifier: "watching",
      weight: raw.followers * 2,
    },
    {
      key: "openSource",
      label: "Repos Contributed To",
      value: raw.contributedTo,
      unit: "",
      qualifier: "supported",
      weight: raw.contributedTo * 6,
    },
    {
      key: "consistency",
      label: "Consistency Score",
      value: stats.consistency,
      unit: "/100",
      qualifier: "earned",
      weight: stats.consistency * 2,
    },
  ];

  const eligible = candidates.filter((c) => c.value > 0);
  if (eligible.length === 0) {
    return {
      key: "contributions",
      label: "Contributions",
      value: "0",
      unit: "",
      qualifier: "and counting",
    };
  }

  eligible.sort((a, b) => b.weight - a.weight);
  const best = eligible[0];

  return {
    key: best.key,
    label: best.label,
    value: fmt(best.value),
    unit: best.unit,
    qualifier: best.qualifier,
  };
}
