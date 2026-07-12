import { describe, it, expect } from "vitest";
import { computeStats, getRarityFromScore, generateCard } from "@/lib/scoring";
import type { RawGitHubStats } from "@/types";

const mockRaw: RawGitHubStats = {
  login: "testuser",
  name: "Test User",
  avatarUrl: "https://example.com/avatar.png",
  bio: "Test bio",
  company: "TestCo",
  createdAt: "2020-01-01T00:00:00Z",
  followers: 100,
  following: 50,
  totalStars: 500,
  totalForks: 50,
  totalCommits: 2000,
  mergedPRs: 100,
  closedIssues: 80,
  totalRepos: 30,
  originalRepos: 20,
  forkedRepos: 10,
  archivedRepos: 2,
  zeroStarRepos: 3,
  allCapsRepos: ["README"],
  languages: [{ name: "TypeScript", count: 10 }],
  contributedTo: 15,
  orgCount: 3,
  recentCommits: 20,
  currentStreak: 7,
  longestStreak: 30,
  commitHourDistribution: Array(24).fill(1),
  repoAges: [365],
  repoPushedAts: [new Date().toISOString()],
};

const emptyRaw: RawGitHubStats = {
  login: "newuser",
  name: "",
  avatarUrl: "",
  bio: "",
  company: "",
  createdAt: new Date().toISOString(),
  followers: 0,
  following: 0,
  totalStars: 0,
  totalForks: 0,
  totalCommits: 0,
  mergedPRs: 0,
  closedIssues: 0,
  totalRepos: 0,
  originalRepos: 0,
  forkedRepos: 0,
  archivedRepos: 0,
  zeroStarRepos: 0,
  allCapsRepos: [],
  languages: [],
  contributedTo: 0,
  orgCount: 0,
  recentCommits: 0,
  currentStreak: 0,
  longestStreak: 0,
  commitHourDistribution: Array(24).fill(0),
  repoAges: [],
  repoPushedAts: [],
};

describe("computeStats", () => {
  it("returns all stats between 0 and 100", () => {
    const stats = computeStats(mockRaw);
    for (const val of Object.values(stats)) {
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThanOrEqual(100);
    }
  });

  it("returns zeros for empty user", () => {
    const stats = computeStats(emptyRaw);
    for (const val of Object.values(stats)) {
      expect(val).toBe(0);
    }
  });

  it("gives higher scores to active users", () => {
    const active = computeStats(mockRaw);
    const inactive = computeStats(emptyRaw);
    expect(active.mergeForce).toBeGreaterThan(inactive.mergeForce);
    expect(active.codeVelocity).toBeGreaterThan(inactive.codeVelocity);
  });
});

describe("getRarityFromScore", () => {
  it("maps score ranges correctly", () => {
    expect(getRarityFromScore(100)).toBe("Mythic");
    expect(getRarityFromScore(97)).toBe("Mythic");
    expect(getRarityFromScore(89)).toBe("Legendary");
    expect(getRarityFromScore(71)).toBe("Epic");
    expect(getRarityFromScore(46)).toBe("Rare");
    expect(getRarityFromScore(0)).toBe("Common");
    expect(getRarityFromScore(45)).toBe("Common");
  });
});

describe("generateCard", () => {
  it("generates a complete card", () => {
    const card = generateCard(mockRaw);
    expect(card.username).toBe("testuser");
    expect(card.rarity).toBeDefined();
    expect(card.primaryClass).toBeDefined();
    expect(card.secondaryClass).toBeDefined();
    expect(card.flavorText).toBeTruthy();
    expect(card.signatureMove).toBeTruthy();
    expect(card.achievements.length).toBeGreaterThan(0);
    expect(card.verification.cardId).toMatch(/^DM-[A-Z0-9]{6}$/);
    expect(card.heroStat).toBeDefined();
  });

  it("respects rarity override", () => {
    const card = generateCard(mockRaw, undefined, "Legendary");
    expect(card.rarity).toBe("Legendary");
  });

  it("produces consistent structure for empty user", () => {
    const card = generateCard(emptyRaw);
    expect(card.username).toBe("newuser");
    expect(card.stats.mergeForce).toBe(0);
    expect(card.rarity).toBe("Common");
  });
});
