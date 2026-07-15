import type { AttributeRank } from "@/types";

export const ATTRIBUTE_RANKS: { min: number; max: number; rank: AttributeRank }[] = [
  { min: 0,  max: 19, rank: "Novice" },
  { min: 20, max: 39, rank: "Adept" },
  { min: 40, max: 59, rank: "Veteran" },
  { min: 60, max: 79, rank: "Expert" },
  { min: 80, max: 94, rank: "Master" },
  { min: 95, max: 100, rank: "Grandmaster" },
];
