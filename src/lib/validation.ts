import { z } from "zod";

export const CardPostSchema = z.object({
  tone: z.enum(["hype", "roast"]).optional(),
  rarity: z.enum(["Common", "Rare", "Epic", "Legendary", "Mythic"]).optional(),
});

export const CardIdSchema = z.string().regex(/^DM-[A-Z0-9]{6}$/, "Invalid card ID format");
