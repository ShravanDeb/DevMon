import type { BehaviouralAttributes, SignatureMove } from "@/types";

export interface SignatureMoveConfig {
  name: string;
  description: string;
  icon: string;
  primaryAttribute: keyof BehaviouralAttributes;
  secondaryAttribute: keyof BehaviouralAttributes;
  minThreshold: number;
}

export const SIGNATURE_MOVE_CONFIG: SignatureMoveConfig[] = [
  { name: "Release Avalanche",   description: "Ships features that reshape the landscape",   icon: "A", primaryAttribute: "execution",    secondaryAttribute: "impact",      minThreshold: 25 },
  { name: "Infinite Merge",      description: "An unbroken chain of delivered work",          icon: "I", primaryAttribute: "execution",    secondaryAttribute: "consistency", minThreshold: 25 },
  { name: "Merge Tempest",       description: "A storm of collaborative PRs",                 icon: "T", primaryAttribute: "execution",    secondaryAttribute: "synergy",     minThreshold: 25 },
  { name: "Precision Architect", description: "Engineered with surgical precision",          icon: "P", primaryAttribute: "execution",    secondaryAttribute: "mastery",     minThreshold: 25 },
  { name: "Community Catalyst",  description: "Ignites open source movements",               icon: "C", primaryAttribute: "impact",       secondaryAttribute: "synergy",     minThreshold: 25 },
  { name: "Framework Forge",     description: "Builds foundations others stand on",           icon: "F", primaryAttribute: "impact",       secondaryAttribute: "mastery",     minThreshold: 25 },
  { name: "Evergreen Legacy",    description: "Impact that compounds over time",             icon: "E", primaryAttribute: "impact",       secondaryAttribute: "consistency", minThreshold: 25 },
  { name: "Open Source Nexus",   description: "Where collaboration meets craft",              icon: "N", primaryAttribute: "synergy",      secondaryAttribute: "mastery",     minThreshold: 25 },
  { name: "Alliance Protocol",   description: "The trusted partner in every project",         icon: "L", primaryAttribute: "synergy",      secondaryAttribute: "consistency", minThreshold: 25 },
  { name: "Eternal Craftsman",   description: "Mastery forged through relentless practice",  icon: "K", primaryAttribute: "mastery",      secondaryAttribute: "consistency", minThreshold: 25 },
];

export const SIGNATURE_MOVE_MIN_THRESHOLD = 25;

export const DEFAULT_SIGNATURE_MOVE: SignatureMove = {
  name: "Novice Punch",
  description: "Every legend starts somewhere",
  icon: "N",
};
