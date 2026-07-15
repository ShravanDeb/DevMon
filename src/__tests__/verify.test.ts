import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase", () => ({
  getSupabaseAnon: vi.fn(),
}));

import { GET } from "@/app/api/verify/[cardId]/route";
import { getSupabaseAnon } from "@/lib/supabase";
import { NextRequest } from "next/server";

const mockGetSupabaseAnon = vi.mocked(getSupabaseAnon);

function makeRequest(cardId: string) {
  return new NextRequest(`http://localhost/api/verify/${cardId}`);
}

function mockAnon(cardData: Record<string, unknown> | null, error?: { message: string }) {
  const query = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: cardData, error: error ?? null }),
  };

  return {
    from: vi.fn().mockReturnValue(query),
  };
}

describe("GET /api/verify/[cardId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 for invalid card ID format", async () => {
    const req = makeRequest("invalid");
    const res = await GET(req, { params: Promise.resolve({ cardId: "invalid" }) });
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("invalid_format");
  });

  it("returns verified card for valid card ID", async () => {
    const cardRow = {
      github_username: "testuser",
      display_name: "Test User",
      avatar_url: "https://example.com/avatar.png",
      rarity: "Rare",
      rarity_score: 65,
      primary_class: "Night Owl",
      secondary_class: null,
      stats: { execution: 68, impact: 55, synergy: 72, consistency: 48, mastery: 60 },
      signature_move: { name: "PR Storm", description: "A", icon: "S" },
      flavor_text: "Test flavor text",
      hero_stat: { attribute: "impact", label: "Impact", score: 55, rank: "Veteran" },
      card_id: "DM-ABC123",
      edition: 1,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-02T00:00:00Z",
      verification_version: "v2",
      digital_signature: "hmac_abc123",
      sha256_hash: "abc123hash",
    };

    const anon = mockAnon(cardRow);
    mockGetSupabaseAnon.mockReturnValue(anon as never);

    const req = makeRequest("DM-ABC123");
    const res = await GET(req, { params: Promise.resolve({ cardId: "DM-ABC123" }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.verified).toBe(true);
    expect(data.card.username).toBe("testuser");
    expect(data.card.verification.cardId).toBe("DM-ABC123");
    expect(data.card.verification.edition).toBe(1);
    expect(data.card.attributes).toBeDefined();
  });

  it("returns 404 for nonexistent card ID", async () => {
    const anon = mockAnon(null);
    mockGetSupabaseAnon.mockReturnValue(anon as never);

    const req = makeRequest("DM-XXXXXX");
    const res = await GET(req, { params: Promise.resolve({ cardId: "DM-XXXXXX" }) });
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe("not_found");
  });

  it("returns 500 on database error", async () => {
    const anon = mockAnon(null, { message: "Connection refused" });
    mockGetSupabaseAnon.mockReturnValue(anon as never);

    const req = makeRequest("DM-ABC123");
    const res = await GET(req, { params: Promise.resolve({ cardId: "DM-ABC123" }) });
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("database_error");
  });
});
