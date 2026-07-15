import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock dependencies
vi.mock("@/lib/github", () => ({
  fetchGitHubStats: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  getSupabaseAdmin: vi.fn(),
}));

vi.mock("@/lib/auth-helpers", () => ({
  getSessionUser: vi.fn(),
}));

vi.mock("@/lib/rate-limit", () => ({
  rateLimit: vi.fn().mockResolvedValue({ success: true, remaining: 99 }),
  RATE_LIMITS: { cardGen: { windowMs: 60000, max: 10 } },
}));

import { GET, POST } from "@/app/api/card/route";
import { fetchGitHubStats } from "@/lib/github";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getSessionUser } from "@/lib/auth-helpers";
import type { RawGitHubStats } from "@/types";
import { NextRequest } from "next/server";

const mockFetchGitHubStats = vi.mocked(fetchGitHubStats);
const mockGetSupabaseAdmin = vi.mocked(getSupabaseAdmin);
const mockGetSessionUser = vi.mocked(getSessionUser);

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

function makeRequest(body?: Record<string, unknown>) {
  return new NextRequest("http://localhost/api/card", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
}

function mockAdmin(overrides?: { upsertResult?: unknown; upsertError?: unknown }) {
  const upsertFn = vi.fn().mockResolvedValue({
    data: overrides?.upsertResult ?? [
      { card_id: "DM-ABC123", edition: 1, was_inserted: true },
    ],
    error: overrides?.upsertError ?? null,
  });

  // For the rank/count queries
  const queryMethods = {
    eq: vi.fn().mockResolvedValue({ error: null, data: null }),
  };

  const fromFn = vi.fn().mockReturnValue({
    select: vi.fn().mockImplementation((_cols: string, opts?: { count?: string; head?: boolean }) => {
      if (opts?.head) {
        return Promise.resolve({ count: 5, data: null, error: null });
      }
      return {
        gt: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        then: (resolve: (val: { data: unknown[] }) => void) => resolve({ data: [] }),
      };
    }),
    update: vi.fn().mockReturnValue(queryMethods),
  });

  return {
    rpc: upsertFn,
    from: fromFn,
  };
}

describe("POST /api/card", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockGetSessionUser.mockResolvedValue(null);

    const req = makeRequest({});
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("creates a new card with a fresh card_id", async () => {
    mockGetSessionUser.mockResolvedValue({
      userId: "user-123",
      accessToken: "ghp_token",
      email: "test@example.com",
    });
    mockFetchGitHubStats.mockResolvedValue(mockRaw);

    const admin = mockAdmin({
      upsertResult: [{ card_id: "DM-ABC123", edition: 1, was_inserted: true }],
    });
    mockGetSupabaseAdmin.mockReturnValue(admin as never);

    const req = makeRequest({});
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.card).toBeDefined();
    expect(data.card.verification.cardId).toBe("DM-ABC123");
    expect(data.card.verification.edition).toBe(1);
    expect(data.card.rank).toBeDefined();
    expect(data.card.totalCards).toBeDefined();
  });

  it("preserves card_id on regeneration (tone switch)", async () => {
    mockGetSessionUser.mockResolvedValue({
      userId: "user-123",
      accessToken: "ghp_token",
      email: "test@example.com",
    });
    mockFetchGitHubStats.mockResolvedValue(mockRaw);

    const admin = mockAdmin({
      upsertResult: [{ card_id: "DM-ABC123", edition: 1, was_inserted: false }],
    });
    mockGetSupabaseAdmin.mockReturnValue(admin as never);

    const req = makeRequest({ tone: "roast" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.card.verification.cardId).toBe("DM-ABC123");
    expect(data.card.verification.edition).toBe(1);
  });

  it("returns 429 when rate limited", async () => {
    mockGetSessionUser.mockResolvedValue({
      userId: "user-123",
      accessToken: "ghp_token",
      email: "test@example.com",
    });

    const { rateLimit } = await import("@/lib/rate-limit");
    vi.mocked(rateLimit).mockResolvedValue({ success: false, remaining: 0 });

    const req = makeRequest({});
    const res = await POST(req);

    expect(res.status).toBe(429);
  });
});

describe("GET /api/card", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns card count from cards table", async () => {
    const admin = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({ count: 42, data: null, error: null }),
      }),
    };
    mockGetSupabaseAdmin.mockReturnValue(admin as never);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.count).toBe(42);
  });
});
