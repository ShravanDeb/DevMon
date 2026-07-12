import type { RawGitHubStats, CardStats, Rarity, ClassName, FlavorTone } from "@/types";

interface TemplateContext {
  raw: RawGitHubStats;
  stats: CardStats;
  rarity: Rarity;
  className: ClassName;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function format(val: number): string {
  return String(val);
}

const hypeTemplates: string[] = [
  "{{stars}} stars across {{repos}} repos! The GitHub gods smile upon you.",
  "A {{rarity}} tier {{className}} with {{stats.mergeForce}} Merge Force! Absolute legend in the making.",
  "{{currentStreak}}-day streak and counting! Consistency is king.",
  "{{prsMerged}} PRs merged and counting. You're the merge hero we don't deserve.",
  "{{langCount}} languages in your arsenal. You're not a developer, you're a linguistic weapon.",
  "{{totalCommits}} commits of pure, unadulterated code wizardry.",
  "{{starsPerRepo}} stars per repo average — quality over quantity, and you've got both.",
  "{{orgCount}} organizations trust your code. You're not just a dev, you're infrastructure.",
  "Your longest streak of {{longestStreak}} days shows you've got the stamina of a marathon runner.",
  "{{closedIssues}} issues closed like a boss.",
  "{{originalRepos}} original repos, each one a masterpiece in progress.",
  "{{repos}} repos and {{stars}} stars — the algorithm loves you, and so do we.",
  "A true {{className}}, forging code like a blacksmith forges steel.",
  "{{contributedTo}} contributions to other repos? Community pillar status achieved.",
  "{{recentCommits}} commits in the last 30 days — you're on fire!",
  "{{topLang}} developer of the highest order. Type-safe and classy.",
  "Account created in {{accountYear}} and still going strong. Veteran status: unlocked.",
  "{{stats.codeVelocity}} Code Velocity? You're not fast, you're a quantum commit entity.",
  "{{stats.consistency}} Consistency? That's not a stat, that's a lifestyle.",
  "Every great codebase started with a single commit. Yours has {{totalCommits}} and counting.",
  "{{langCount}} languages explored. You're building breadth before depth — that's a power move.",
  "{{repos}} repos and growing. The best developers are the ones who keep building.",
  "{{totalCommits}} commits strong. You show up, and that's half the battle.",
  "{{closedIssues}} issues resolved. You don't just write code — you finish it.",
  "{{stars}} stars earned through code that speaks for itself.",
  "A {{className}} who ships. That's the whole bio.",
  "{{originalRepos}} original projects. Creativity isn't your backup plan — it's your default.",
  "{{contributedTo}} repos supported. You make open source better just by showing up.",
  "You've got {{langCount}} languages and {{repos}} repos. That's not scattered — that's versatile.",
  "{{recentCommits}} commits in 30 days. You don't wait for motivation — you just push.",
];

const roastTemplates: string[] = [
  "{{repos}} repos and somehow {{zeroStars}} of them have zero stars. You're not a developer, you're a digital hoarder.",
  "Your {{langCount}} languages are like a box of crayons where half are the same shade of gray.",
  "{{prsMerged}} merged PRs. That's {{prsMerged}} more than most people manage.",
  "You have repos named: {{allCaps}}. Calm down with the caps lock.",
  "{{orgCount}} organizations and {{contributedTo}} contributions to other repos. Touring the ecosystem, are we?",
  "The year is {{year}} and you're still using {{topLang}}. A classic choice.",
  "You've been on GitHub since {{accountYear}}. That's a lot of history in these commit logs.",
  "{{forkedRepos}} forked repos and {{originalRepos}} originals. A collector with a creative streak.",
  "Your commit messages are... concise. Git log would call them 'minimalist'.",
  "{{stars}} stars across {{repos}} repos. You're playing the long game.",
];

function fillTemplate(template: string, ctx: TemplateContext): string {
  const { raw, stats, rarity, className } = ctx;
  const topLang = raw.languages[0]?.name || "Unknown";
  const year = new Date().getFullYear();
  const accountYear = new Date(raw.createdAt).getFullYear();
  const starsPerRepo = raw.totalRepos > 0 ? (raw.totalStars / raw.totalRepos).toFixed(1) : "0.0";

  return template
    .replace(/{{stars}}/g, format(raw.totalStars))
    .replace(/{{repos}}/g, format(raw.totalRepos))
    .replace(/{{starsPerRepo}}/g, starsPerRepo)
    .replace(/{{zeroStars}}/g, format(raw.zeroStarRepos))
    .replace(/{{commitsLastYear}}/g, format(raw.recentCommits))
    .replace(/{{followers}}/g, format(raw.followers))
    .replace(/{{following}}/g, format(raw.following))
    .replace(/{{issuesClosed}}/g, format(raw.closedIssues))
    .replace(/{{prsMerged}}/g, format(raw.mergedPRs))
    .replace(/{{langCount}}/g, format(raw.languages.length))
    .replace(/{{allCaps}}/g, raw.allCapsRepos.slice(0, 3).join(", ") || "nothing notable")
    .replace(/{{totalCommits}}/g, format(raw.totalCommits))
    .replace(/{{longestStreak}}/g, format(raw.longestStreak))
    .replace(/{{orgCount}}/g, format(raw.orgCount))
    .replace(/{{contributedTo}}/g, format(raw.contributedTo))
    .replace(/{{year}}/g, format(year))
    .replace(/{{topLang}}/g, topLang)
    .replace(/{{accountYear}}/g, format(accountYear))
    .replace(/{{recentCommits}}/g, format(raw.recentCommits))
    .replace(/{{rarity}}/g, rarity)
    .replace(/{{className}}/g, className)
    .replace(/{{stats\.mergeForce}}/g, format(stats.mergeForce))
    .replace(/{{stats\.codeVelocity}}/g, format(stats.codeVelocity))
    .replace(/{{stats\.problemSolving}}/g, format(stats.problemSolving))
    .replace(/{{stats\.openSource}}/g, format(stats.openSource))
    .replace(/{{stats\.consistency}}/g, format(stats.consistency))
    .replace(/{{forkedRepos}}/g, format(raw.forkedRepos))
    .replace(/{{originalRepos}}/g, format(raw.originalRepos))
    .replace(/{{currentStreak}}/g, format(raw.currentStreak))
    .replace(/{{closedIssues}}/g, format(raw.closedIssues))
    .replace(/{{topLang}}/g, topLang)
    .replace(/{{accountYear}}/g, format(accountYear));
}

export function generateFlavorText(
  raw: RawGitHubStats,
  stats: CardStats,
  rarity: Rarity,
  className: ClassName,
  tone?: FlavorTone
): string {
  const ctx: TemplateContext = { raw, stats, rarity, className };

  if (tone === "roast") {
    return fillTemplate(pick(roastTemplates), ctx);
  }
  // Default is always hype
  return fillTemplate(pick(hypeTemplates), ctx);
}
