export interface RawGitHubStats {
  login: string;
  name: string;
  avatarUrl: string;
  bio: string;
  company: string;
  createdAt: string;
  followers: number;
  following: number;
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  mergedPRs: number;
  closedIssues: number;
  totalRepos: number;
  originalRepos: number;
  forkedRepos: number;
  archivedRepos: number;
  zeroStarRepos: number;
  allCapsRepos: string[];
  languages: { name: string; count: number }[];
  contributedTo: number;
  orgCount: number;
  recentCommits: number;
  currentStreak: number;
  longestStreak: number;
  commitHourDistribution: number[];
  repoAges: number[];
  repoPushedAts: string[];
}

export interface CardStats {
  mergeForce: number;
  codeVelocity: number;
  problemSolving: number;
  openSource: number;
  consistency: number;
}

export type Rarity = "Common" | "Rare" | "Epic" | "Legendary" | "Mythic";

export type ClassName =
  | "Merge Griffin"
  | "Fork Warden"
  | "Night Owl"
  | "Bug Hunter"
  | "Stack Guardian"
  | "Commit Phantom"
  | "Open Source Sentinel"
  | "Polyglot Artisan"
  | "Code Archivist"
  | "Green Sprout"
  | "PR Titan"
  | "Zen Coder";

export interface SignatureMove {
  name: string;
  description: string;
  icon: string;
}

export interface Achievement {
  label: string;
  value: string;
  icon: string;
}

export interface VerificationData {
  cardId: string;
  edition: number;
  generatedAt: string;
  version: string;
  digitalSignature: string;
  sha256Hash: string;
}

export type FlavorTone = "roast" | "hype";

export interface HeroStat {
  key: keyof CardStats | "stars" | "contributions" | "streak" | "languages" | "repos" | "prs" | "followers" | "reposContributedTo";
  label: string;
  value: string;
  unit: string;
  qualifier: string;
}

export interface CardData {
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  stats: CardStats;
  rarity: Rarity;
  rarityScore: number;
  primaryClass: ClassName;
  secondaryClass: ClassName | null;
  flavorText: string;
  signatureMove: SignatureMove;
  achievements: Achievement[];
  verification: VerificationData;
  heroStat: HeroStat;
  className: ClassName;
  generatedAt: string;
  rank?: number;
  totalCards?: number;
}

export interface LeaderboardEntry {
  username: string;
  displayName: string;
  avatarUrl: string;
  rarity: Rarity;
  rarityScore: number;
  primaryClass: ClassName;
  stats: CardStats;
  generatedAt: string;
}

export interface RarityStyle {
  hex: string;
  border: string;
  glow: string;
  gradientDark: string[];
  gradientLight: string[];
  accentGradient: string;
  foilEnabled: boolean;
}

export const RARITY_COLORS: Record<Rarity, RarityStyle> = {
  Common: {
    hex: "#8B8FA0",
    border: "border-[#8B8FA0]",
    glow: "rgba(139,143,160,0.15)",
    gradientDark: ["#1A1A1E", "#18181C", "#1C1C20", "#161618", "#1A1A1C"],
    gradientLight: ["#F4F2EE", "#F0EEE8", "#F2F0EA", "#EEECE6", "#F2F0EA"],
    accentGradient: "linear-gradient(90deg, #6B6F80, #8B8FA0)",
    foilEnabled: false,
  },
  Rare: {
    hex: "#5B9AE0",
    border: "border-[#5B9AE0]",
    glow: "rgba(91,154,224,0.20)",
    gradientDark: ["#0E1A30", "#0C1628", "#101E34", "#0A1224", "#0E1A2E"],
    gradientLight: ["#E0E8F8", "#DCE4F4", "#E4ECFA", "#D8E0F0", "#DEE6F6"],
    accentGradient: "linear-gradient(90deg, #4A8AD0, #6AAAE0)",
    foilEnabled: false,
  },
  Epic: {
    hex: "#9B72D8",
    border: "border-[#9B72D8]",
    glow: "rgba(155,114,216,0.22)",
    gradientDark: ["#1A1040", "#180E3C", "#1E1448", "#160C38", "#1A1040"],
    gradientLight: ["#E8E0F8", "#E4DCF4", "#ECE4FA", "#E0D8F0", "#E6DEF6"],
    accentGradient: "linear-gradient(90deg, #8A62C8, #AA82E8)",
    foilEnabled: true,
  },
  Legendary: {
    hex: "#E0A830",
    border: "border-[#E0A830]",
    glow: "rgba(224,168,48,0.22)",
    gradientDark: ["#2A2008", "#261C06", "#2E240C", "#221804", "#281E08"],
    gradientLight: ["#F8F0D8", "#F4ECD4", "#FAF4DC", "#F0E8D0", "#F6EED6"],
    accentGradient: "linear-gradient(90deg, #D09820, #F0B840)",
    foilEnabled: true,
  },
  Mythic: {
    hex: "#D84060",
    border: "border-[#D84060]",
    glow: "rgba(216,64,96,0.25)",
    gradientDark: ["#2C0C18", "#280A14", "#30101C", "#240810", "#2A0C16"],
    gradientLight: ["#F8D8E0", "#F4D4DC", "#FCDCE4", "#F0D0D8", "#F6D6DE"],
    accentGradient: "linear-gradient(90deg, #C83050, #E85070)",
    foilEnabled: true,
  },
};

export const STAT_LABELS: Record<keyof CardStats, string> = {
  mergeForce: "Merge Force",
  codeVelocity: "Code Velocity",
  problemSolving: "Problem Solving",
  openSource: "Open Source",
  consistency: "Consistency",
};

export const STAT_ICONS: Record<keyof CardStats, string> = {
  mergeForce: "M",
  codeVelocity: "V",
  problemSolving: "P",
  openSource: "O",
  consistency: "C",
};

export const CLASS_SUBTITLES: Record<ClassName, string> = {
  "Merge Griffin": "The Pull Request Architect",
  "Fork Warden": "The Repository Collector",
  "Night Owl": "The Midnight Forger",
  "Bug Hunter": "The Issue Eliminator",
  "Stack Guardian": "The Full Stack Defender",
  "Commit Phantom": "The Undead Committer",
  "Open Source Sentinel": "The Community Builder",
  "Polyglot Artisan": "The Language Master",
  "Code Archivist": "The Repository Curator",
  "Green Sprout": "The Rising Contributor",
  "PR Titan": "The Review Commander",
  "Zen Coder": "The Code Purifier",
};

export const RARITY_EMBLEM: Record<Rarity, string> = {
  Common: "·",
  Rare: "◆",
  Epic: "★",
  Legendary: "✦",
  Mythic: "♠",
};
