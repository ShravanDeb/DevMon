import { z } from "zod";

export const CardPostSchema = z.object({
  tone: z.enum(["hype", "roast"]).optional(),
  rarity: z.enum(["Common", "Rare", "Epic", "Legendary", "Mythic"]).optional(),
});

export const LeaderboardQuerySchema = z.object({
  company: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});

export const CardIdSchema = z.string().regex(/^DM-[A-Z0-9]{6}$/, "Invalid card ID format");

export const LeaderboardPostSchema = z.object({
  entry: z.object({
    username: z.string().min(1),
    displayName: z.string().optional(),
    avatarUrl: z.string().url().optional(),
    rarity: z.string(),
    rarityScore: z.number(),
    primaryClass: z.string(),
    stats: z.record(z.string(), z.unknown()).optional(),
    company: z.string().nullable().optional(),
    primaryLanguage: z.string().nullable().optional(),
  }),
});
