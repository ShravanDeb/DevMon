import { describe, it, expect } from "vitest";
import { generateVerification } from "@/lib/verification";
import type { RawGitHubStats, CardStats } from "@/types";

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

const mockStats: CardStats = {
  mergeForce: 72,
  codeVelocity: 65,
  problemSolving: 58,
  openSource: 40,
  consistency: 55,
};

describe("generateVerification", () => {
  it("generates valid card ID format (DM-XXXXXX)", () => {
    const v = generateVerification(mockRaw, mockStats, "Rare", 0);
    expect(v.cardId).toMatch(/^DM-[A-Z0-9]{6}$/);
  });

  it("generates unique card IDs", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 50; i++) {
      const v = generateVerification(mockRaw, mockStats, "Common", 0);
      ids.add(v.cardId);
    }
    expect(ids.size).toBe(50);
  });

  it("includes digital signature starting with hmac_", () => {
    const v = generateVerification(mockRaw, mockStats, "Epic", 0);
    expect(v.digitalSignature).toMatch(/^hmac_[a-f0-9]{64}$/);
  });

  it("sets edition to provided value", () => {
    const v = generateVerification(mockRaw, mockStats, "Legendary", 42);
    expect(v.edition).toBe(42);
  });

  it("sets version to 1.0.0", () => {
    const v = generateVerification(mockRaw, mockStats, "Mythic", 0);
    expect(v.version).toBe("1.0.0");
  });

  it("generates valid ISO timestamp", () => {
    const v = generateVerification(mockRaw, mockStats, "Rare", 0);
    const parsed = new Date(v.generatedAt);
    expect(parsed.toISOString()).toBe(v.generatedAt);
  });
});
