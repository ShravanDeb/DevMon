import { describe, it, expect } from "vitest";
import { CardPostSchema, CardIdSchema } from "@/lib/validation";

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


