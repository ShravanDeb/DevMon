import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase", () => ({
  getSupabaseAdmin: vi.fn(),
}));

import { GET } from "@/app/api/verify/[cardId]/route";
import { getSupabaseAdmin } from "@/lib/supabase";
import { NextRequest } from "next/server";

const mockGetSupabaseAdmin = vi.mocked(getSupabaseAdmin);

function makeRequest(cardId: string) {
  return new NextRequest(`http://localhost/api/verify/${cardId}`);
}

function mockAdmin(cardData: Record<string, unknown> | null, error?: { message: string }) {
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
      stats: { mergeForce: 70, codeVelocity: 65, problemSolving: 60, openSource: 50, consistency: 55 },
      signature_move: { name: "PR Storm", description: "A", icon: "S" },
      flavor_text: "Test flavor text",
      hero_stat: { key: "codeVelocity", label: "Code Velocity", value: "65", unit: "", qualifier: "" },
      card_id: "DM-ABC123",
      edition: 1,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-02T00:00:00Z",
      verification_version: "v1",
      digital_signature: "hmac_abc123",
      sha256_hash: "abc123hash",
    };

    const admin = mockAdmin(cardRow);
    mockGetSupabaseAdmin.mockReturnValue(admin as never);

    const req = makeRequest("DM-ABC123");
    const res = await GET(req, { params: Promise.resolve({ cardId: "DM-ABC123" }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.verified).toBe(true);
    expect(data.card.username).toBe("testuser");
    expect(data.card.verification.cardId).toBe("DM-ABC123");
    expect(data.card.verification.edition).toBe(1);
  });

  it("returns 404 for nonexistent card ID", async () => {
    const admin = mockAdmin(null);
    mockGetSupabaseAdmin.mockReturnValue(admin as never);

    const req = makeRequest("DM-XXXXXX");
    const res = await GET(req, { params: Promise.resolve({ cardId: "DM-XXXXXX" }) });
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe("not_found");
  });

  it("returns 500 on database error", async () => {
    const admin = mockAdmin(null, { message: "Connection refused" });
    mockGetSupabaseAdmin.mockReturnValue(admin as never);

    const req = makeRequest("DM-ABC123");
    const res = await GET(req, { params: Promise.resolve({ cardId: "DM-ABC123" }) });
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("database_error");
  });
});
