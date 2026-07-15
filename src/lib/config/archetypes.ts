import type { Archetype, BehaviouralAttributes } from "@/types";

export interface ArchetypeRule {
  archetype: Archetype;
  primary: keyof BehaviouralAttributes;
  secondary: keyof BehaviouralAttributes;
  description: string;
}

export const ARCHETYPE_RULES: ArchetypeRule[] = [
  { archetype: "Builder",      primary: "execution",    secondary: "consistency", description: "Ships relentlessly and sustains the rhythm" },
  { archetype: "Collaborator", primary: "synergy",      secondary: "impact",      description: "Amplifies others and builds community" },
  { archetype: "Architect",    primary: "mastery",      secondary: "execution",   description: "Designs systems and builds with precision" },
  { archetype: "Creator",      primary: "impact",       secondary: "execution",   description: "Builds things people notice" },
  { archetype: "Maintainer",   primary: "consistency",  secondary: "synergy",     description: "Keeps the engine running and teams aligned" },
  { archetype: "Explorer",     primary: "mastery",      secondary: "impact",      description: "Explores widely and inspires others" },
];
