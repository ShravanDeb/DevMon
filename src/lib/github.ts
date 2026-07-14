import type { RawGitHubStats } from "@/types";

const GITHUB_GRAPHQL = "https://api.github.com/graphql";

interface ContributionDay {
  date: string;
  contributionCount: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface CommitEdge {
  node: { committedDate: string };
}

interface RepoNode {
  name: string;
  stargazerCount: number;
  forkCount: number;
  isFork: boolean;
  isArchived: boolean;
  primaryLanguage: { name: string } | null;
  languages: { edges: { node: { name: string }; size: number }[] } | null;
  defaultBranchRef: {
    target: {
      history: {
        totalCount: number;
        edges: CommitEdge[];
      };
    };
  } | null;
  pushedAt: string;
  createdAt: string;
}

interface ViewerResponse {
  login: string;
  name: string;
  avatarUrl: string;
  bio: string;
  company: string;
  createdAt: string;
  followers: { totalCount: number };
  following: { totalCount: number };
  repositories: {
    totalCount: number;
    nodes: RepoNode[];
  };
  contributionsCollection: {
    contributionCalendar: {
      totalContributions: number;
      weeks: {
        contributionDays: {
          contributionCount: number;
          date: string;
        }[];
      }[];
    };
  };
  pullRequests: { totalCount: number };
  issues: { totalCount: number };
  repositoriesContributedTo: { totalCount: number };
  organizations: { totalCount: number };
}

interface GraphQLResponse {
  data?: { viewer: ViewerResponse; user?: ViewerResponse };
  errors?: { message: string }[];
}

const STATS_QUERY = `
query($from: DateTime!, $to: DateTime!) {
  viewer {
    login
    name
    avatarUrl
    bio
    company
    createdAt
    followers { totalCount }
    following { totalCount }
    organizations(first: 1) { totalCount }
    repositories(first: 100, ownerAffiliations: [OWNER], orderBy: {field: STARGAZERS, direction: DESC}) {
      totalCount
      nodes {
        name
        stargazerCount
        forkCount
        isFork
        isArchived
        primaryLanguage { name }
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges { node { name } size }
        }
        defaultBranchRef {
          target {
            ... on Commit {
              history(first: 100) { totalCount edges { node { committedDate } } }
            }
          }
        }
        pushedAt
        createdAt
      }
    }
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
    pullRequests(first: 0, states: [MERGED]) { totalCount }
    issues(first: 0, states: [CLOSED]) { totalCount }
    repositoriesContributedTo(first: 0) { totalCount }
  }
}
`;

const USER_STATS_QUERY = `
query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    login
    name
    avatarUrl
    bio
    company
    createdAt
    followers { totalCount }
    following { totalCount }
    organizations(first: 1) { totalCount }
    repositories(first: 100, ownerAffiliations: [OWNER], orderBy: {field: STARGAZERS, direction: DESC}) {
      totalCount
      nodes {
        name
        stargazerCount
        forkCount
        isFork
        isArchived
        primaryLanguage { name }
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges { node { name } size }
        }
        defaultBranchRef {
          target {
            ... on Commit {
              history(first: 100) { totalCount edges { node { committedDate } } }
            }
          }
        }
        pushedAt
        createdAt
      }
    }
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays { contributionCount date }
        }
      }
    }
    pullRequests(first: 0, states: [MERGED]) { totalCount }
    issues(first: 0, states: [CLOSED]) { totalCount }
    repositoriesContributedTo(first: 0) { totalCount }
  }
}
`;

function processViewerData(v: ViewerResponse): RawGitHubStats {
  const now = new Date();
  const repos = v.repositories.nodes;
  const calendar = v.contributionsCollection.contributionCalendar;

  let totalStars = 0;
  let totalForks = 0;
  let totalCommits = 0;
  let originalRepos = 0;
  let forkedRepos = 0;
  let archivedRepos = 0;
  let zeroStarRepos = 0;
  const allCapsRepos: string[] = [];
  const langCount: Record<string, number> = {};
  const repoAges: number[] = [];
  const repoPushedAts: string[] = [];
  const commitHours: number[] = [];

  for (const repo of repos) {
    totalStars += repo.stargazerCount;
    totalForks += repo.forkCount;
    if (repo.isFork) forkedRepos++;
    else originalRepos++;
    if (repo.isArchived) archivedRepos++;
    if (repo.stargazerCount === 0) zeroStarRepos++;
    if (/^[A-Z0-9_]+$/.test(repo.name.replace(/[^A-Z0-9]/g, "")) && repo.name.length > 2) {
      allCapsRepos.push(repo.name);
    }
    if (repo.languages?.edges) {
      for (const edge of repo.languages.edges) {
        langCount[edge.node.name] = (langCount[edge.node.name] || 0) + 1;
      }
    }
    const created = new Date(repo.createdAt);
    const age = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    repoAges.push(age);
    repoPushedAts.push(repo.pushedAt);
    const branch = repo.defaultBranchRef;
    if (branch) {
      totalCommits += branch.target.history.totalCount;
      for (const edge of branch.target.history.edges) {
        commitHours.push(new Date(edge.node.committedDate).getHours());
      }
    }
  }

  const contributionDays = calendar.weeks.flatMap((w: ContributionWeek) => w.contributionDays);
  const recentCommits = contributionDays
    .filter((d: ContributionDay) => {
      const day = new Date(d.date);
      const daysAgo = (now.getTime() - day.getTime()) / (1000 * 60 * 60 * 24);
      return daysAgo <= 30 && daysAgo >= 0;
    })
    .reduce((sum: number, d: ContributionDay) => sum + d.contributionCount, 0);

  let currentStreak = 0;
  let longestStreak = 0;
  let streak = 0;
  const sortedDays = [...contributionDays].sort(
    (a: ContributionDay, b: ContributionDay) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  for (const day of sortedDays) {
    const daysAgo = (now.getTime() - new Date(day.date).getTime()) / (1000 * 60 * 60 * 24);
    if (daysAgo > 365) break;
    if (day.contributionCount > 0) {
      streak++;
      longestStreak = Math.max(longestStreak, streak);
      if (daysAgo < 2) currentStreak = streak;
    } else {
      streak = 0;
    }
  }

  const languages = Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  return {
    login: v.login,
    name: v.name || v.login,
    avatarUrl: v.avatarUrl,
    bio: v.bio || "",
    company: v.company || "",
    createdAt: v.createdAt,
    followers: v.followers.totalCount,
    following: v.following.totalCount,
    totalStars,
    totalForks,
    totalCommits,
    mergedPRs: v.pullRequests.totalCount,
    closedIssues: v.issues.totalCount,
    totalRepos: v.repositories.totalCount,
    originalRepos,
    forkedRepos,
    archivedRepos,
    zeroStarRepos,
    allCapsRepos,
    languages,
    contributedTo: v.repositoriesContributedTo.totalCount,
    orgCount: v.organizations.totalCount,
    recentCommits,
    currentStreak,
    longestStreak,
    commitHourDistribution: commitHours,
    repoAges,
    repoPushedAts,
  };
}

export async function fetchGitHubStats(
  token: string,
  opts?: { username?: string }
): Promise<RawGitHubStats> {
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

  const isUserQuery = !!opts?.username;
  const query = isUserQuery ? USER_STATS_QUERY : STATS_QUERY;
  const variables: Record<string, string> = {
    from: oneYearAgo.toISOString(),
    to: now.toISOString(),
  };
  if (isUserQuery) {
    variables.login = opts!.username!;
  }

  const res = await fetch(GITHUB_GRAPHQL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`GitHub API responded with ${res.status}`);
  }

  const json: GraphQLResponse = await res.json();

  if (json.errors) {
    throw new Error(`GraphQL error: ${json.errors.map((e) => e.message).join(", ")}`);
  }

  const v = isUserQuery ? json.data!.user! : json.data!.viewer;
  return processViewerData(v);
}
