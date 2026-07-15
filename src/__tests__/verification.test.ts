import { describe, it, expect } from "vitest";
import { generateVerification } from "@/lib/verification";
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

describe("generateVerification", () => {
  it("generates valid card ID format (DM-XXXXXX)", () => {
    const v = generateVerification(mockRaw, "Rare", 0);
    expect(v.cardId).toMatch(/^DM-[A-Z0-9]{6}$/);
  });

  it("generates unique card IDs", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 50; i++) {
      const v = generateVerification(mockRaw, "Common", 0);
      ids.add(v.cardId);
    }
    expect(ids.size).toBe(50);
  });

  it("includes digital signature starting with hmac_", () => {
    const v = generateVerification(mockRaw, "Epic", 0);
    expect(v.digitalSignature).toMatch(/^hmac_[a-f0-9]{64}$/);
  });

  it("sets edition to provided value", () => {
    const v = generateVerification(mockRaw, "Legendary", 42);
    expect(v.edition).toBe(42);
  });

  it("sets version to 2.0.0", () => {
    const v = generateVerification(mockRaw, "Mythic", 0);
    expect(v.version).toBe("2.0.0");
  });

  it("generates valid ISO timestamp", () => {
    const v = generateVerification(mockRaw, "Rare", 0);
    const parsed = new Date(v.generatedAt);
    expect(parsed.toISOString()).toBe(v.generatedAt);
  });

  it("includes balanceVersion", () => {
    const v = generateVerification(mockRaw, "Rare", 0);
    expect(v.balanceVersion).toBeDefined();
    expect(typeof v.balanceVersion).toBe("string");
  });
});
