import type { MetricConfig } from "@/types";

export const NORMALIZATION_CONFIG: Record<string, MetricConfig> = {
  followers:            { curve: "log",  target: 100,  steepness: 1.0, maxScore: 100 },
  stars:                { curve: "log",  target: 500,  steepness: 1.0, maxScore: 100 },
  commits:              { curve: "log",  target: 1000, steepness: 1.0, maxScore: 100 },
  recentCommits:        { curve: "log",  target: 200,  steepness: 1.0, maxScore: 100 },
  mergedPRs:            { curve: "log",  target: 100,  steepness: 1.0, maxScore: 100 },
  closedIssues:         { curve: "log",  target: 100,  steepness: 1.0, maxScore: 100 },
  repositories:         { curve: "log",  target: 30,   steepness: 1.0, maxScore: 100 },
  originalRepositories: { curve: "log",  target: 20,   steepness: 1.0, maxScore: 100 },
  contributedTo:        { curve: "log",  target: 20,   steepness: 1.0, maxScore: 100 },
  organizations:        { curve: "sqrt", target: 5,    steepness: 1.0, maxScore: 100 },
  languages:            { curve: "log",  target: 8,    steepness: 0.8, maxScore: 100 },
  accountAge:           { curve: "log",  target: 5,    steepness: 0.6, maxScore: 100 },
  forks:                { curve: "log",  target: 50,   steepness: 1.0, maxScore: 100 },
  currentStreak:        { curve: "log",  target: 30,   steepness: 1.0, maxScore: 100 },
  longestStreak:        { curve: "log",  target: 60,   steepness: 1.0, maxScore: 100 },
};
