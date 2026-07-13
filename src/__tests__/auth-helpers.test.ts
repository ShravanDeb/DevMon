import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { getSessionUser } from "@/lib/auth-helpers";
import { createClient } from "@/lib/supabase/server";

const mockCreateClient = vi.mocked(createClient);

function mockValidSession(userId: string, email: string, providerToken: string | null) {
  mockCreateClient.mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: userId, email } },
        error: null,
      }),
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: providerToken ? { provider_token: providerToken } : null,
        },
      }),
    },
  } as never);
}

function mockNoSession() {
  mockCreateClient.mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: null },
        error: new Error("Not authenticated"),
      }),
      getSession: vi.fn(),
    },
  } as never);
}

describe("getSessionUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("extracts userId and accessToken from a valid session", async () => {
    mockValidSession("user-123", "test@example.com", "ghp_token123");

    const result = await getSessionUser();

    expect(result).toEqual({
      userId: "user-123",
      accessToken: "ghp_token123",
      email: "test@example.com",
    });
  });

  it("returns null when no session exists", async () => {
    mockNoSession();

    const result = await getSessionUser();

    expect(result).toBeNull();
  });

  it("returns null when getUser throws", async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockRejectedValue(new Error("Network error")),
        getSession: vi.fn(),
      },
    } as never);

    const result = await getSessionUser();

    expect(result).toBeNull();
  });

  it("returns null accessToken when no provider_token", async () => {
    mockValidSession("user-123", "test@example.com", null);

    const result = await getSessionUser();

    expect(result).toEqual({
      userId: "user-123",
      accessToken: null,
      email: "test@example.com",
    });
  });
});
