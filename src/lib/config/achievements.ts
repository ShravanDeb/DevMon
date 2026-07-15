import type { BehaviouralAttributes } from "@/types";

export interface AchievementTierConfig {
  id: string;
  attribute: keyof BehaviouralAttributes;
  threshold: number;
  tier: number;
  title: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENT_TIERS: AchievementTierConfig[] = [
  { id: "exec-1", attribute: "execution",    threshold: 30, tier: 1, title: "Builder",           description: "Consistent output",         icon: "E1" },
  { id: "exec-2", attribute: "execution",    threshold: 55, tier: 2, title: "Engineer",          description: "Strong delivery",           icon: "E2" },
  { id: "exec-3", attribute: "execution",    threshold: 75, tier: 3, title: "Master Builder",    description: "Exceptional throughput",    icon: "E3" },
  { id: "exec-4", attribute: "execution",    threshold: 90, tier: 4, title: "Execution Legend",   description: "Unmatched output",          icon: "E4" },
  { id: "imp-1",  attribute: "impact",       threshold: 30, tier: 1, title: "Rising Star",       description: "Growing influence",         icon: "I1" },
  { id: "imp-2",  attribute: "impact",       threshold: 55, tier: 2, title: "Influencer",        description: "Notable presence",          icon: "I2" },
  { id: "imp-3",  attribute: "impact",       threshold: 75, tier: 3, title: "Powerhouse",        description: "Major influence",           icon: "I3" },
  { id: "imp-4",  attribute: "impact",       threshold: 90, tier: 4, title: "Impact Legend",      description: "Industry shaping",          icon: "I4" },
  { id: "syn-1",  attribute: "synergy",      threshold: 30, tier: 1, title: "Team Player",       description: "Collaborative spirit",      icon: "S1" },
  { id: "syn-2",  attribute: "synergy",      threshold: 55, tier: 2, title: "Collaborator",      description: "Strong teamwork",           icon: "S2" },
  { id: "syn-3",  attribute: "synergy",      threshold: 75, tier: 3, title: "Connector",         description: "Community bridge",          icon: "S3" },
  { id: "syn-4",  attribute: "synergy",      threshold: 90, tier: 4, title: "Synergy Legend",     description: "Ecosystem multiplier",      icon: "S4" },
  { id: "con-1",  attribute: "consistency",  threshold: 30, tier: 1, title: "Steady",            description: "Regular contributor",       icon: "C1" },
  { id: "con-2",  attribute: "consistency",  threshold: 55, tier: 2, title: "Reliable",          description: "Dependable presence",       icon: "C2" },
  { id: "con-3",  attribute: "consistency",  threshold: 75, tier: 3, title: "Unwavering",        description: "Consistent force",          icon: "C3" },
  { id: "con-4",  attribute: "consistency",  threshold: 90, tier: 4, title: "Consistency Legend", description: "Iron discipline",            icon: "C4" },
  { id: "mas-1",  attribute: "mastery",      threshold: 30, tier: 1, title: "Apprentice",        description: "Learning the craft",         icon: "M1" },
  { id: "mas-2",  attribute: "mastery",      threshold: 55, tier: 2, title: "Craftsman",         description: "Skilled practitioner",       icon: "M2" },
  { id: "mas-3",  attribute: "mastery",      threshold: 75, tier: 3, title: "Artisan",            description: "Master of tools",           icon: "M3" },
  { id: "mas-4",  attribute: "mastery",      threshold: 90, tier: 4, title: "Mastery Legend",     description: "Unrivaled expertise",       icon: "M4" },
];
