import { describe, it, expect } from "vitest";
import {
  CardPostSchema,
  LeaderboardQuerySchema,
  CardIdSchema,
  LeaderboardPostSchema,
} from "@/lib/validation";

describe("CardPostSchema", () => {
  it("accepts empty body", () => {
    const result = CardPostSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts valid tone and rarity", () => {
    const result = CardPostSchema.safeParse({ tone: "roast", rarity: "Legendary" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid tone", () => {
    const result = CardPostSchema.safeParse({ tone: "burn" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid rarity", () => {
    const result = CardPostSchema.safeParse({ rarity: "Ultra" });
    expect(result.success).toBe(false);
  });
});

describe("LeaderboardQuerySchema", () => {
  it("applies defaults", () => {
    const result = LeaderboardQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBe(20);
      expect(result.data.offset).toBe(0);
    }
  });

  it("coerces string numbers", () => {
    const result = LeaderboardQuerySchema.safeParse({ limit: "50", offset: "10" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBe(50);
      expect(result.data.offset).toBe(10);
    }
  });

  it("rejects limit > 100", () => {
    const result = LeaderboardQuerySchema.safeParse({ limit: 200 });
    expect(result.success).toBe(false);
  });

  it("rejects negative offset", () => {
    const result = LeaderboardQuerySchema.safeParse({ offset: -1 });
    expect(result.success).toBe(false);
  });
});

describe("CardIdSchema", () => {
  it("accepts valid card ID", () => {
    expect(CardIdSchema.safeParse("DM-ABC123").success).toBe(true);
    expect(CardIdSchema.safeParse("DM-X9Z4K7").success).toBe(true);
  });

  it("rejects invalid formats", () => {
    expect(CardIdSchema.safeParse("dm-abc123").success).toBe(false);
    expect(CardIdSchema.safeParse("DM-ABC").success).toBe(false);
    expect(CardIdSchema.safeParse("DM-ABC1234").success).toBe(false);
    expect(CardIdSchema.safeParse("abc123").success).toBe(false);
  });
});

describe("LeaderboardPostSchema", () => {
  it("accepts valid entry", () => {
    const result = LeaderboardPostSchema.safeParse({
      entry: {
        username: "testuser",
        rarity: "Rare",
        rarityScore: 55,
        primaryClass: "Night Owl",
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing username", () => {
    const result = LeaderboardPostSchema.safeParse({
      entry: {
        rarity: "Rare",
        rarityScore: 55,
        primaryClass: "Night Owl",
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty username", () => {
    const result = LeaderboardPostSchema.safeParse({
      entry: {
        username: "",
        rarity: "Rare",
        rarityScore: 55,
        primaryClass: "Night Owl",
      },
    });
    expect(result.success).toBe(false);
  });
});
