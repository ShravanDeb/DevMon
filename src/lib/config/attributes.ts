import type { ComponentConfig } from "@/types";

export const COMPONENTS: Record<string, ComponentConfig> = {
  commitOutput:           { label: "Commit Output",           weights: { commits: 0.6, recentCommits: 0.4 } },
  repositoryBuilding:     { label: "Repository Building",     weights: { originalRepositories: 0.7, repositories: 0.3 } },
  delivery:               { label: "Delivery",                weights: { mergedPRs: 1.0 } },
  starPower:              { label: "Star Power",              weights: { stars: 1.0 } },
  communityReach:         { label: "Community Reach",         weights: { followers: 0.7, forks: 0.3 } },
  adoption:               { label: "Adoption",                weights: { forks: 0.5, organizations: 0.5 } },
  prCollaboration:        { label: "PR Collaboration",        weights: { mergedPRs: 0.5, contributedTo: 0.5 } },
  issueEngagement:        { label: "Issue Engagement",        weights: { closedIssues: 1.0 } },
  organizationalPresence: { label: "Organizational Presence", weights: { organizations: 1.0 } },
  streakPower:            { label: "Streak Power",            weights: { currentStreak: 0.6, longestStreak: 0.4 } },
  activityRegularity:     { label: "Activity Regularity",     weights: { recentCommits: 0.5, commits: 0.5 } },
  longevity:              { label: "Longevity",               weights: { accountAge: 1.0 } },
  languageBreadth:        { label: "Language Breadth",         weights: { languages: 1.0 } },
  projectDiversity:       { label: "Project Diversity",       weights: { originalRepositories: 0.6, repositories: 0.4 } },
  qualitySignal:          { label: "Quality Signal",          weights: { stars: 0.6, contributedTo: 0.4 } },
};

export const ATTRIBUTE_AGGREGATION: Record<string, Record<string, number>> = {
  execution: {
    commitOutput: 0.35,
    repositoryBuilding: 0.30,
    delivery: 0.35,
  },
  impact: {
    starPower: 0.40,
    communityReach: 0.30,
    adoption: 0.30,
  },
  synergy: {
    prCollaboration: 0.40,
    issueEngagement: 0.35,
    organizationalPresence: 0.25,
  },
  consistency: {
    streakPower: 0.40,
    activityRegularity: 0.35,
    longevity: 0.25,
  },
  mastery: {
    languageBreadth: 0.35,
    projectDiversity: 0.35,
    qualitySignal: 0.30,
  },
};
