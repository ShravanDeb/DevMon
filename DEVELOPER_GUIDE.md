# Developer Guide

The complete handbook for contributors and maintainers of DevMon.

Written for engineers joining the project six months from now. Every instruction is reproducible from a fresh clone. No tribal knowledge.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Prerequisites](#2-prerequisites)
3. [Development Environment](#3-development-environment)
4. [Repository Structure](#4-repository-structure)
5. [Installation](#5-installation)
6. [Environment Variables](#6-environment-variables)
7. [Development Workflow](#7-development-workflow)
8. [Coding Standards](#8-coding-standards)
9. [State Management](#9-state-management)
10. [API Development](#10-api-development)
11. [Database Development](#11-database-development)
12. [Adding New Features](#12-adding-new-features)
13. [Debugging Guide](#13-debugging-guide)
14. [Common Problems](#14-common-problems)
15. [Security Best Practices](#15-security-best-practices)
16. [Performance Best Practices](#16-performance-best-practices)
17. [Accessibility Best Practices](#17-accessibility-best-practices)
18. [Deployment Guide](#18-deployment-guide)
19. [Troubleshooting](#19-troubleshooting)
20. [Maintenance Checklist](#20-maintenance-checklist)
21. [Upgrade Guide](#21-upgrade-guide)
22. [Testing Strategy](#22-testing-strategy)
23. [Code Review Checklist](#23-code-review-checklist)
24. [Production Release Checklist](#24-production-release-checklist)
25. [Disaster Recovery](#25-disaster-recovery)
26. [Backup Strategy](#26-backup-strategy)
27. [Documentation Standards](#27-documentation-standards)
28. [FAQ](#28-faq)
29. [Appendix: Useful Commands](#29-appendix-useful-commands)
30. [Appendix: Scripts Reference](#30-appendix-scripts-reference)
31. [Appendix: Reference Tables](#31-appendix-reference-tables)
32. [Appendix: Useful Links](#32-appendix-useful-links)
33. [Appendix: File Quick Reference](#33-appendix-file-quick-reference)

---

## 1. Introduction

DevMon is a verified developer credential platform. It reads a developer's public GitHub activity via OAuth, computes gameplay-style statistics and a rarity tier, renders a collectible credential card, signs it with an HMAC-SHA-256 cryptographic signature, and serves a public verification page.

### What this guide covers

Everything needed to develop, maintain, debug, and deploy DevMon:

- Setting up a local development environment from scratch
- Understanding the codebase architecture and conventions
- Adding features, fixing bugs, and reviewing code
- Deploying to production and maintaining the system
- Debugging problems across frontend, backend, database, and auth

### Related documentation

| Document | Purpose |
|----------|---------|
| `README.md` | Project overview, quick start, features |
| `ARCHITECTURE.md` | Complete technical specification, algorithms, API reference |
| `DESIGN.md` | Locked design system (colors, typography, motion, tokens) |
| `PLAN.md` | Historical migration plan (NextAuth to Supabase) |
| `LICENSE` | AGPL-3.0 license |

---

## 2. Prerequisites

### Required

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 18+ | No version pinning file exists. Use `nvm` or `fnm` to manage versions. |
| npm | 9+ | Primary package manager. `package-lock.json` is committed. |
| Git | 2.30+ | Default branch is `master` (not `main`). |

### External service accounts

All have free tiers sufficient for development:

| Service | Purpose | Sign up |
|---------|---------|---------|
| Supabase | Auth + PostgreSQL database | [supabase.com](https://supabase.com) |
| GitHub | OAuth provider + API access | [github.com](https://github.com) |
| Upstash | Redis for rate limiting (optional) | [upstash.com](https://upstash.com) |
| Netlify | Deployment (optional) | [netlify.com](https://netlify.com) |

---

## 3. Development Environment

### Node.js

Required version: 18 or later. No `.nvmrc`, `.node-version`, or `.tool-versions` file exists in the repository.

Recommended approach:

```bash
# Install fnm (fast Node.js manager)
curl -fsSL https://fnm.vercel.app/install | bash

# Install and use Node 20
fnm install 20
fnm use 20

# Verify
node --version  # Should show v20.x.x
```

### Package manager

npm is the primary package manager. The `package-lock.json` is committed to the repository. yarn and pnpm are not used (no lockfiles for either exist).

```bash
npm install       # Install dependencies
npm run dev       # Start development
npm test          # Run tests
```

### Editors

VS Code is recommended. No `.vscode/settings.json` or `.vscode/extensions.json` exists in the repository.

**Required extensions:**

| Extension | Purpose |
|-----------|---------|
| ESLint (`dbaeumer.vscode-eslint`) | Linting integration |
| Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`) | Class autocomplete and hover previews |

**Optional extensions:**

| Extension | Purpose |
|-----------|---------|
| Pretty TypeScript Errors (`yoavbls.pretty-ts-errors`) | Readable TypeScript error messages |
| GitHub Copilot | AI code completion |

### Git

- Default branch: `master`
- No pre-commit hooks (no husky, no lint-staged)
- No commitlint or conventional commits enforcement
- Branch naming: `feat/short-description` or `fix/short-description`

### Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Copy the **Project URL** (Settings > API > Project URL)
3. Copy the **anon public** key (Settings > API > Project API keys)
4. Copy the **service_role** key (Settings > API > Project API keys) — keep this secret
5. Enable GitHub OAuth provider (Authentication > Providers > GitHub)
6. Set the Authorization Callback URL to `http://localhost:3000/api/auth/callback`

### GitHub

**OAuth App** (for user authentication):

1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Create a new OAuth App
3. Homepage URL: `http://localhost:3000`
4. Authorization Callback URL: `http://localhost:3000/api/auth/callback`
5. Copy the Client ID into Supabase Dashboard > Authentication > Providers > GitHub
6. Generate a Client Secret and add it to Supabase as well

**Personal Access Token** (for OG image generation):

1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate a new token (classic)
3. No scopes required (used only for public API access)
4. Add the token to `GITHUB_TOKEN` in `.env.local`

### Upstash (optional)

1. Create a Redis database at [upstash.com](https://upstash.com)
2. Copy the REST URL and token into `.env.local`
3. If not configured, rate limiting is silently disabled (graceful degradation)

---

## 4. Repository Structure

```
DevMon/
├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── layout.tsx                    # Root layout, fonts, metadata, theme provider (82 lines)
│   │   ├── page.tsx                      # Landing page (890 lines)
│   │   ├── globals.css                   # Design system tokens, Tailwind config (716 lines)
│   │   ├── loading.tsx                   # Root loading skeleton
│   │   ├── error.tsx                     # Root error boundary
│   │   ├── not-found.tsx                 # 404 page
│   │   ├── providers.tsx                 # Theme context provider
│   │   ├── sitemap.ts                    # Dynamic sitemap generation
│   │   ├── robots.ts                     # Robots.txt generation
│   │   ├── card/
│   │   │   ├── layout.tsx                # Card page SEO metadata
│   │   │   ├── page.tsx                  # Card generation UI (478 lines)
│   │   │   └── error.tsx                 # Card-specific error boundary
│   │   ├── leaderboard/
│   │   │   ├── layout.tsx                # Leaderboard SEO metadata
│   │   │   ├── page.tsx                  # Leaderboard display (261 lines)
│   │   │   └── error.tsx                 # Leaderboard error boundary
│   │   ├── verify/
│   │   │   └── [cardId]/
│   │   │       ├── page.tsx              # Public verification page (392 lines)
│   │   │       └── error.tsx             # Verification error boundary
│   │   ├── faq/
│   │   │   ├── layout.tsx                # FAQ SEO metadata
│   │   │   └── page.tsx                  # FAQ accordion (152 lines)
│   │   ├── terms/page.tsx                # Terms of Service
│   │   ├── privacy/page.tsx              # Privacy Policy
│   │   ├── contact/page.tsx              # Contact page
│   │   └── api/
│   │       ├── card/route.ts             # POST: generate card, GET: card count (178 lines)
│   │       ├── leaderboard/route.ts      # GET: paginated leaderboard (51 lines)
│   │       ├── verify/[cardId]/route.ts  # GET: verify card by ID (81 lines)
│   │       ├── og/route.tsx              # GET: OG image generation (174 lines)
│   │       ├── health/route.ts           # GET: health check (7 lines)
│   │       └── auth/
│   │           ├── callback/route.ts     # GET: OAuth callback
│   │           └── signout/route.ts      # POST: sign out
│   ├── components/
│   │   ├── CardFace.tsx                  # Desktop card renderer (566 lines)
│   │   ├── CardFaceMobile.tsx            # Mobile card renderer (498 lines)
│   │   ├── DownloadButton.tsx            # PNG export + download (402 lines)
│   │   ├── CustomCursor.tsx              # GSAP-powered cursor (145 lines)
│   │   ├── LinkedInShareModal.tsx        # LinkedIn share flow (253 lines)
│   │   ├── MagneticButton.tsx            # Magnetic hover button (52 lines)
│   │   ├── PageTransition.tsx            # AnimatePresence wrapper (19 lines)
│   │   ├── RarityCrown.tsx               # Rarity crown icon
│   │   ├── ThemeToggle.tsx               # Dark/light theme toggle
│   │   ├── Footer.tsx                    # Site footer (55 lines)
│   │   └── legal/
│   │       ├── LegalPageKit.tsx          # Reusable legal page layout
│   │       └── ContactForm.tsx           # Contact form component
│   ├── lib/
│   │   ├── scoring.ts                    # Scoring pipeline orchestrator (90 lines)
│   │   ├── rarity.ts                     # 8-factor rarity composite (36 lines)
│   │   ├── classes.ts                    # 12 developer class rules (113 lines)
│   │   ├── flavor-text.ts               # 40 flavor text templates (111 lines)
│   │   ├── achievements.ts              # 8 achievement types (73 lines)
│   │   ├── signature-move.ts            # 14 signature moves (131 lines)
│   │   ├── hero-stat.ts                 # Hero stat selection (108 lines)
│   │   ├── verification.ts              # HMAC-SHA-256 signing (57 lines)
│   │   ├── github.ts                    # GitHub GraphQL fetcher (301 lines)
│   │   ├── validation.ts               # Zod schemas (6 lines)
│   │   ├── rate-limit.ts               # Upstash rate limiter (37 lines)
│   │   ├── auth-helpers.ts             # Session extraction (13 lines)
│   │   ├── motion.ts                   # Framer Motion variants
│   │   ├── theme.tsx                   # Theme context + provider
│   │   └── supabase/
│   │       ├── server.ts               # Server-side Supabase client (25 lines)
│   │       └── client.ts               # Browser-side Supabase client (7 lines)
│   ├── types/
│   │   └── index.ts                    # All types, interfaces, constants (183 lines)
│   ├── middleware.ts                   # Auth middleware, public path allowlist (52 lines)
│   └── __tests__/
│       ├── scoring.test.ts             # Scoring algorithm tests (128 lines)
│       ├── verification.test.ts        # Verification tests (79 lines)
│       ├── validation.test.ts          # Zod schema tests (40 lines)
│       ├── card.test.ts                # Card API route tests (198 lines)
│       ├── verify.test.ts              # Verify API route tests (102 lines)
│       └── auth-helpers.test.ts        # Auth helper tests (89 lines)
├── supabase/
│   └── full_migration.sql              # Authoritative DB schema (149 lines)
├── archive/
│   └── migrations/
│       ├── 001_init.sql                # Historical initial migration
│       ├── 002_upsert_fix.sql          # Historical upsert fix
│       └── 002_reset_and_fix_edition.sql
├── next.config.mjs                     # Security headers, CSP, image config (53 lines)
├── tailwind.config.ts                  # Tailwind theme (57 lines)
├── tsconfig.json                       # TypeScript config (20 lines)
├── postcss.config.js                   # PostCSS plugins (5 lines)
├── .eslintrc.json                      # ESLint config (6 lines)
├── vitest.config.ts                    # Vitest config (13 lines)
├── package.json                        # Dependencies and scripts (39 lines)
├── .env.example                        # Environment variable template (20 lines)
├── .gitignore                          # Git ignore rules
├── README.md                           # Project documentation (677 lines)
├── ARCHITECTURE.md                     # Technical specification (1048 lines)
├── DEVELOPER_GUIDE.md                  # This file
├── DESIGN.md                           # Locked design system (179 lines)
├── PLAN.md                             # Historical migration plan (228 lines)
└── LICENSE                             # AGPL-3.0 license
```

### Directory purposes

| Directory | Purpose |
|-----------|---------|
| `src/app/` | Pages (page.tsx) and API routes (route.ts/route.tsx). Each subdirectory is a route. |
| `src/components/` | Shared UI components. Used across multiple pages. |
| `src/lib/` | Business logic, utilities, third-party integrations. No React components here. |
| `src/types/` | TypeScript type definitions and constants shared across the codebase. |
| `src/__tests__/` | Unit tests. Files named `*.test.ts`. |
| `supabase/` | Database migrations. `full_migration.sql` is the authoritative schema. |
| `archive/` | Historical migration snapshots. Reference only, do not run. |

---

## 5. Installation

### Clone

```bash
git clone https://github.com/ShravanDeb/DevMon.git
cd DevMon
```

### Install

```bash
npm install
```

This installs all dependencies from `package-lock.json`. Do not use `--legacy-peer-deps` unless you encounter peer dependency conflicts.

### Configure

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials. See [Section 6: Environment Variables](#6-environment-variables) for the complete variable reference.

### Database setup

1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Paste the entire contents of `supabase/full_migration.sql`
4. Click "Run"

This creates the `cards` table, indexes, RLS policies, and `upsert_card_v2` RPC function.

### Auth setup

1. In Supabase Dashboard, go to Authentication > Providers
2. Enable GitHub
3. Enter your GitHub OAuth App's Client ID and Client Secret
4. Set the Authorization Callback URL to `http://localhost:3000/api/auth/callback`

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
```

Creates a production build in `.next/`. No errors should appear.

### Test

```bash
npm test
```

All 6 test files should pass.

### Deploy

See [Section 18: Deployment Guide](#18-deployment-guide) for production deployment instructions.

---

## 6. Environment Variables

All environment variables are defined in `.env.example`. Copy to `.env.local` for local development.

| Variable | Required | Default | Description | Security |
|----------|----------|---------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | — | Supabase project URL (e.g., `https://xxx.supabase.co`) | Safe for client. `NEXT_PUBLIC_` prefix. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | — | Supabase anonymous/public key | Safe for client. Used in browser-side Supabase client. |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | — | Supabase service role key | **Server-only.** Bypasses RLS. Never expose to client. |
| `GITHUB_TOKEN` | Yes | — | GitHub Personal Access Token for OG image generation | **Server-only.** No scopes needed. Never expose to client. |
| `HMAC_SECRET` | Yes | — | Secret for HMAC-SHA-256 card signing | **Server-only.** Generate with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`. Never expose to client. |
| `UPSTASH_REDIS_REST_URL` | Optional | — | Upstash Redis REST URL | Rate limiting disabled if missing. |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | — | Upstash Redis auth token | Rate limiting disabled if missing. |
| `NEXT_PUBLIC_SITE_URL` | Yes | `http://localhost:3000` | Public site URL for OG images, verify URLs, metadata | Safe for client. Set to `https://dev-mon.netlify.app/` in production. |

### `NEXT_PUBLIC_` prefix

Variables prefixed with `NEXT_PUBLIC_` are bundled into client-side JavaScript and visible in browser DevTools. Never put secrets in `NEXT_PUBLIC_` variables.

### Graceful degradation

If `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are not set, rate limiting is silently bypassed. The application functions normally — this is by design for local development.

---

## 7. Development Workflow

### Branch strategy

- **Default branch:** `master`
- **Feature branches:** `feat/short-description` (e.g., `feat/add-team-cards`)
- **Bug fixes:** `fix/short-description` (e.g., `fix/leaderboard-pagination`)
- **No develop/staging branch** — direct merge to master

### Commit conventions

No commitlint or conventional commits tool is configured. Observed style from git history:

```
Imperative mood, lowercase, no period, under 72 characters

Examples:
fix leaderboard pagination for empty results
add rarity crown to leaderboard
mobile responsiveness overhaul for card face
```

### Pull requests

**External contributors:** Fork the repository, create a feature branch, submit a PR.

**Maintainers:** Direct push to master (no branch protection rules configured).

### PR checklist

Before submitting a PR, verify:

- [ ] `npm run lint` passes with zero errors
- [ ] `npm test` passes (all 6 test files)
- [ ] `npx tsc --noEmit` compiles without TypeScript errors
- [ ] New features have corresponding tests in `src/__tests__/`
- [ ] Breaking changes are documented in PR description
- [ ] Environment variable changes are reflected in `.env.example`
- [ ] Database schema changes include updated `supabase/full_migration.sql`

---

## 8. Coding Standards

### TypeScript

- **Strict mode** enabled (`"strict": true` in `tsconfig.json`)
- **Module resolution:** `"bundler"` (Next.js 14 default)
- **Path alias:** `@/*` maps to `./src/*` (use `@/lib/scoring` not `../../lib/scoring`)
- **No `any`** — use `unknown` if type is truly unknown
- **Interface over type** for object shapes (observed convention)

### React

- **Server Components** by default (no `"use client"` directive)
- **Client Components** when using hooks, browser APIs, or animations (add `"use client"` at top)
- **Functional components only** — no class components
- **React 18.3+**

### Next.js

- **App Router** (`src/app/` directory)
- **Route Handlers** for API routes (`route.ts` or `route.tsx`)
- **`export const dynamic = "force-dynamic"`** on all API routes (prevents caching)
- **No `getServerSideProps`** or `getStaticProps` (App Router pattern)

### Naming conventions

| Category | Convention | Example |
|----------|-----------|---------|
| Components | PascalCase | `CardFace.tsx`, `DownloadButton.tsx` |
| Pages | `page.tsx` inside kebab-case directory | `src/app/card/page.tsx` |
| API routes | `route.ts` or `route.tsx` | `src/app/api/card/route.ts` |
| Lib modules | kebab-case | `scoring.ts`, `rate-limit.ts`, `hero-stat.ts` |
| Types | PascalCase | `RawGitHubStats`, `CardStats`, `ClassName` |
| CSS classes | Tailwind utilities | `text-text-primary`, `bg-surface-1` |
| Constants | PascalCase for type constants | `RARITY_COLORS`, `STAT_LABELS` |
| Env vars | UPPER_SNAKE_CASE | `SUPABASE_SERVICE_ROLE_KEY` |

### Folder conventions

| Directory | Contents |
|-----------|----------|
| `src/app/` | Pages and API routes only |
| `src/components/` | Shared UI components used across pages |
| `src/lib/` | Business logic, utilities, third-party integrations |
| `src/types/` | TypeScript types and constants |
| `src/__tests__/` | Unit tests |

### Import order

Convention (not enforced by ESLint):

1. React/Next.js imports
2. Third-party libraries (`motion`, `gsap`, `zod`)
3. Internal `@/` aliases (`@/lib/scoring`, `@/types`)
4. Relative imports (`./components`)

### Component structure

```typescript
"use client"; // Only if using hooks/browser APIs

import { useState } from "react";
import { motion } from "motion/react";
import { someUtil } from "@/lib/some-util";

interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  // Hooks first
  const [state, setState] = useState(false);

  // Handlers
  const handleClick = () => {
    setState(!state);
    onAction();
  };

  // Render
  return (
    <div onClick={handleClick}>
      {title}
    </div>
  );
}
```

### Error handling

- **API routes:** try/catch with structured JSON error responses
- **Client components:** Error boundaries (`error.tsx` per route)
- **No global error handler** — each route handles its own errors
- **Console logging:** Structured JSON for card generation, `console.error` for errors

### Accessibility

- Semantic HTML (`button`, `nav`, `main`, `footer`)
- `aria-label` on icon-only buttons
- Keyboard navigation for interactive elements
- Focus visible styles (2px solid `--text-primary`, 2px offset)

### Performance

- No premature optimization
- `html-to-image` for client-side PNG export (avoids server rendering)
- GSAP for hardware-accelerated animations (cursor, loader)
- Next.js `Image` component for GitHub avatars
- `Cache-Control: no-store` on all API responses

---

## 9. State Management

DevMon uses no global state library (no Redux, Zustand, Jotai).

| State type | Solution | Location |
|-----------|----------|----------|
| Local component state | `useState` | Individual components |
| Auth session | Supabase cookies | Managed by middleware |
| Theme | React context | `src/lib/theme.tsx` |
| URL state | `searchParams` | Leaderboard filters |
| Form state | `useState` | Contact form, card generation |

---

## 10. API Development

### Route Handler pattern

All API routes follow this pattern:

```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" } as const;

export async function GET(req: NextRequest) {
  try {
    // Logic here
    return NextResponse.json({ data: "value" }, { headers: NO_STORE });
  } catch (err) {
    console.error("error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500, headers: NO_STORE });
  }
}
```

### Key patterns

- **`export const dynamic = "force-dynamic"`** — prevents Next.js from caching the route
- **`NO_STORE` headers** — all API responses include `Cache-Control: no-store`
- **Zod validation** — validate all inputs with `safeParse()` (see `src/lib/validation.ts`)
- **Rate limiting** — apply on write endpoints (see `src/lib/rate-limit.ts`)
- **Structured logging** — log JSON for card generation routes

### Existing API routes

| Method | Route | Auth | Rate Limit | Purpose |
|--------|-------|------|------------|---------|
| `POST` | `/api/card` | Required | 10 req/min | Generate card |
| `GET` | `/api/card` | None | — | Card count |
| `GET` | `/api/leaderboard` | None | 60 req/min | Paginated leaderboard |
| `GET` | `/api/verify/[cardId]` | None | — | Verify card |
| `GET` | `/api/og?user=` | None | 5 req/min | OG image |
| `GET` | `/api/health` | None | — | Health check |
| `GET` | `/api/auth/callback` | None | — | OAuth callback |
| `POST` | `/api/auth/signout` | None | — | Sign out |

### Adding a new API route

1. Create `src/app/api/<name>/route.ts`
2. Export named functions (`GET`, `POST`, etc.)
3. Add `export const dynamic = "force-dynamic"`
4. Add `const NO_STORE = { "Cache-Control": "no-store" } as const`
5. Validate inputs with Zod
6. Return `NextResponse.json()` with `NO_STORE` headers
7. Add rate limiting if the endpoint writes data

---

## 11. Database Development

### Migration workflow

- **Authoritative source:** `supabase/full_migration.sql` — the single file to run against a clean database
- **Historical snapshots:** `archive/migrations/` — reference only, do not run
- **No Supabase CLI** configured — apply migrations via SQL Editor
- **No versioned migration numbering** — `full_migration.sql` replaces all prior migrations

### Applying migrations

```bash
# Option 1: Supabase Dashboard
# Go to SQL Editor, paste contents of supabase/full_migration.sql, click Run

# Option 2: Supabase CLI (if installed)
supabase db push
```

### RPCs

**`upsert_card_v2`** — the only database function:

- Uses `SELECT FOR UPDATE` for row-level locking (prevents race conditions)
- Preserves `card_id` and `edition` on update (existing users keep their original ID)
- New users get a fresh `card_id` from `generateCardId()` and `edition` from `card_edition_seq`
- `SECURITY DEFINER` — executes with service role permissions, bypassing RLS
- Returns the full card row via `RETURNING *`

### RLS

Two policies on the `cards` table:

| Policy | Operation | Condition | Effect |
|--------|-----------|-----------|--------|
| `public read` | SELECT | `true` | Anyone can read any card |
| `service role full access` | ALL | `auth.role() = 'service_role'` | Service role has full access |

All API routes use the service role client (`getSupabaseAdmin()`), which bypasses RLS.

### Indexes

| Index | Columns | Type | Purpose |
|-------|---------|------|---------|
| `idx_cards_card_id` | `card_id` | UNIQUE | Fast lookup for verification |
| `idx_cards_rarity_score` | `rarity_score DESC` | B-tree | Leaderboard sorting |
| `idx_cards_company` | `company` WHERE `company IS NOT NULL` | Partial | Company-filtered leaderboard |

### Testing migrations

After applying a migration:

```sql
-- Verify table exists
SELECT * FROM cards LIMIT 10;

-- Verify indexes
SELECT * FROM pg_indexes WHERE tablename = 'cards';

-- Verify RLS policies
SELECT * FROM pg_policies WHERE tablename = 'cards';

-- Verify function exists
SELECT * FROM pg_proc WHERE proname = 'upsert_card_v2';
```

---

## 12. Adding New Features

### Step-by-step process

1. **Understand the requirement** — what problem does it solve?
2. **Check if similar functionality exists** — search the codebase
3. **Plan the change** — which files, which patterns, what tests
4. **Create feature branch** — `git checkout -b feat/short-description`
5. **Implement changes** — follow coding standards
6. **Add tests** — if modifying business logic
7. **Run lint and tests** — `npm run lint && npm test`
8. **Update documentation** — if changing APIs, env vars, or architecture
9. **Submit PR** — use the PR checklist

### Specific guides

**Adding a new scoring metric:**

1. Add the metric function in `src/lib/scoring.ts`
2. Add the metric to `CardStats` interface in `src/types/index.ts`
3. Add the metric to `computeStats()` return value
4. Add the metric to `STAT_LABELS` in `src/types/index.ts`
5. Update `CardFace.tsx` and `CardFaceMobile.tsx` to display it
6. Add tests in `src/__tests__/scoring.test.ts`

**Adding a new developer class:**

1. Add the class name to `ClassName` union in `src/types/index.ts`
2. Add the class subtitle to `CLASS_SUBTITLES` in `src/types/index.ts`
3. Add a new rule to the `rules` array in `src/lib/classes.ts`
4. Add flavor text templates for the class in `src/lib/flavor-text.ts`

**Adding a new API route:**

1. Create `src/app/api/<name>/route.ts`
2. Follow the pattern in [Section 10: API Development](#10-api-development)
3. Add tests in `src/__tests__/<name>.test.ts`
4. Update this guide's API routes table

**Adding a new page:**

1. Create `src/app/<name>/page.tsx`
2. Create `src/app/<name>/layout.tsx` for SEO metadata
3. Create `src/app/<name>/error.tsx` for error boundary
4. Add to the middleware public path allowlist in `src/middleware.ts` if public

**Adding a new component:**

1. Create `src/components/<Name>.tsx`
2. Use PascalCase naming
3. Export as named function
4. Use Tailwind CSS for styling (no inline styles except dynamic values)
5. Add `"use client"` if using hooks or browser APIs

---

## 13. Debugging Guide

### Frontend

**Browser DevTools:**
- Elements tab: inspect DOM structure and CSS
- Console tab: check for JavaScript errors
- Network tab: verify API responses and status codes
- Application tab: inspect cookies (Supabase session)

**React DevTools:**
- Install browser extension
- Inspect component tree, props, and state
- Check for unnecessary re-renders

**Next.js DevTools:**
- Error overlay shows detailed error messages in development
- Check server vs client component boundaries

**Tailwind CSS:**
- Use Tailwind CSS IntelliSense extension
- Check computed styles in DevTools

### Backend

**Server logs:**
- Card generation logs structured JSON to stdout:
  ```json
  {"method":"POST","route":"/api/card","userId":"uuid","cardId":"DM-XXX","duration":2340}
  ```
- Errors logged via `console.error` with context

**Supabase Dashboard:**
- Go to Logs > API to see all API requests
- Check Authentication > Users for user data
- Check Database > cards for card data

### Database

**Supabase SQL Editor:**

```sql
-- Check recent cards
SELECT github_username, rarity, rarity_score, created_at
FROM cards
ORDER BY created_at DESC
LIMIT 10;

-- Check card count
SELECT COUNT(*) FROM cards;

-- Check index usage
SELECT * FROM pg_indexes WHERE tablename = 'cards';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'cards';
```

### Authentication

**Common auth issues:**

1. **Redirect loop:** Check that `/api/auth/callback` is in the middleware public path list
2. **No session:** Verify OAuth callback URL matches exactly in both GitHub and Supabase
3. **Expired token:** Sessions expire — sign out and sign in again
4. **Wrong scopes:** GitHub OAuth should request `read:user` and `user:email` only

**Debugging auth:**

```bash
# Check cookies in browser DevTools > Application > Cookies
# Look for sb-<project-ref>-auth-token

# Check session in Supabase Dashboard > Authentication > Sessions
```

### Deployment

**Netlify:**
- Check Deploys tab for build logs
- Check Functions tab for serverless function logs
- Verify environment variables in Site Settings > Build & deploy > Environment

---

## 14. Common Problems

| Problem | Cause | Solution |
|---------|-------|----------|
| 401 on card generation | No session or expired token | Sign out and sign in again |
| 429 on card generation | Rate limit exceeded | Wait 60 seconds before retrying |
| Card shows "Common" for active developer | GitHub API rate limited or token invalid | Check `GITHUB_TOKEN` validity |
| Blank leaderboard | No cards in database | Generate a card first |
| OAuth redirect loop | Callback URL mismatch | Check Supabase Dashboard callback URL matches `http://localhost:3000/api/auth/callback` |
| Build fails with TypeScript errors | Type mismatch after changes | Run `npx tsc --noEmit` to find errors |
| Tests fail with module not found | Path alias not configured | Check `vitest.config.ts` alias matches `tsconfig.json` |
| OG image generation fails | Missing `GITHUB_TOKEN` | Set `GITHUB_TOKEN` in `.env.local` |
| Rate limiting not working | Missing Upstash credentials | Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` |
| HMAC verification fails | Wrong `HMAC_SECRET` | Ensure same secret in all environments (dev, staging, prod) |
| Card download shows blank image | html-to-image DOM access issue | Check browser console, try different browser |
| Stale card data | GitHub API returned cached data | Regenerate card (fresh fetch each time) |
| `MODULE_NOT_FOUND` for `@/` alias | Vitest not resolving paths | Check `vitest.config.ts` has `resolve.alias` matching `tsconfig.json` |
| Middleware redirect on public path | Path not in allowlist | Add path to `publicPaths` array in `src/middleware.ts` |

---

## 15. Security Best Practices

### Environment variables

- **Never commit `.env.local`** (gitignored)
- **Never expose `SUPABASE_SERVICE_ROLE_KEY`** to client-side code
- **Never expose `HMAC_SECRET`** to client-side code
- **Never expose `GITHUB_TOKEN`** to client-side code
- **Use `NEXT_PUBLIC_` prefix** only for variables safe to expose (Supabase URL, anon key, site URL)

### Authentication

- Keep OAuth scopes minimal: `read:user` and `user:email` only
- Never write to a user's GitHub repositories
- Verify sessions server-side via Supabase, never trust client-side auth state

### Cryptographic verification

- HMAC-SHA-256 signatures are computed server-side
- Verification is performed server-side against the stored hash
- Never trust client-provided signatures

### Input validation

- Use Zod schemas on all API inputs
- Validate card ID format: `DM-[A-Z0-9]{6}`
- Validate tone and rarity enums

### Rate limiting

- Apply on all write endpoints
- Use sliding window algorithm (Upstash)
- Graceful degradation when Redis is unavailable

### Database

- RLS enabled on all tables
- Service role only used in API routes (via `getSupabaseAdmin()`)
- Public read policy for card data (verification pages)

---

## 16. Performance Best Practices

### Design targets (from DESIGN.md)

- LCP < 1.8s
- TBT < 200ms
- CLS = 0
- 60fps sustained during scroll animations

### Rendering strategy

| Page | Strategy | Reason |
|------|----------|--------|
| Landing, FAQ, Terms, Privacy, Contact | Static (SSG) | No dynamic data |
| Card, Leaderboard, Verification | Dynamic (SSR) | Requires auth or database |

### Optimization techniques

- **Next.js Image component** for GitHub avatars (automatic format negotiation)
- **Client-side PNG export** via `html-to-image` (avoids server rendering overhead)
- **GSAP animations** use hardware-accelerated `transform` and `opacity`
- **No-cache on API routes** — fresh data every request
- **Code splitting** — Next.js App Router splits code automatically per route

### Bundle size

- No heavy libraries (largest: `gsap` at ~30KB, `motion` at ~25KB)
- No unused imports (ESLint will catch these)
- No duplicate dependencies

---

## 17. Accessibility Best Practices

### Semantic HTML

- Use `<button>` for interactive elements (not `<div onClick>`)
- Use `<nav>` for navigation
- Use `<main>` for main content
- Use `<footer>` for footer

### Keyboard navigation

- All interactive elements must be focusable
- Focus visible styles: 2px solid `--text-primary`, 2px offset
- Tab order must be logical

### Screen readers

- `aria-label` on icon-only buttons
- `alt` text on images
- Meaningful link text (not "click here")

### Color contrast

- Text must meet WCAG AA contrast ratios
- Use the design system tokens (verified contrast ratios)

---

## 18. Deployment Guide

### Development

```bash
npm run dev
# http://localhost:3000
```

### Preview

Netlify automatically creates preview deploys for pull requests. Check the preview URL before merging.

### Production

1. **Environment variables:** Set all variables from `.env.example` in Netlify Dashboard > Site Settings > Build & deploy > Environment
2. **Database:** Apply `supabase/full_migration.sql` to production Supabase project
3. **Deploy:** Connect GitHub repo to Netlify, auto-deploy from master
4. **Domain:** Configure custom domain if applicable

### Rollback

**Netlify:**
1. Go to Deploys tab
2. Find the last working deploy
3. Click "Publish deploy"

**Database:**
- Restore from Supabase backup (see [Section 25: Disaster Recovery](#25-disaster-recovery))

---

## 19. Troubleshooting

### Build errors

**"Module not found: Can't resolve '@/...'"**
- Cause: Path alias not resolving
- Fix: Verify `tsconfig.json` has `"paths": { "@/*": ["./src/*"] }`

**"Type 'X' is not assignable to type 'Y'"**
- Cause: Type mismatch after code changes
- Fix: Run `npx tsc --noEmit` to identify all type errors

**"Hydration mismatch"**
- Cause: Server and client render different content
- Fix: Ensure dynamic content is wrapped in `"use client"` components

### Runtime errors

**"Unauthorized" on card generation**
- Cause: No valid Supabase session
- Fix: Sign out and sign in again. Check cookies in DevTools.

**"Rate limit exceeded"**
- Cause: Too many requests
- Fix: Wait 60 seconds. Check Upstash dashboard for rate limit status.

**Blank page after navigation**
- Cause: Client-side JavaScript error
- Fix: Check browser console for errors. Check error boundary files.

### Database errors

**"relation 'cards' does not exist"**
- Cause: Migration not applied
- Fix: Run `supabase/full_migration.sql` in Supabase SQL Editor

**"permission denied for table cards"**
- Cause: RLS blocking access
- Fix: Ensure API routes use `getSupabaseAdmin()` (service role), not `createClient()` (anon)

---

## 20. Maintenance Checklist

### Daily

- [ ] Check Netlify deploy status
- [ ] Monitor Supabase dashboard for errors

### Weekly

- [ ] Review open PRs and issues
- [ ] Check for dependency updates (`npm outdated`)

### Monthly

- [ ] Security audit: `npm audit` for vulnerable dependencies
- [ ] Performance audit: Lighthouse on landing page
- [ ] Database review: check table size, index usage

### Release

- [ ] Update version in `package.json`
- [ ] Run full test suite (`npm test`)
- [ ] Verify build succeeds (`npm run build`)
- [ ] Check all environment variables are set in production
- [ ] Apply database migrations if needed
- [ ] Deploy to production
- [ ] Verify health check: `curl -I https://dev-mon.netlify.app/api/health`
- [ ] Test OAuth flow end-to-end
- [ ] Test card generation
- [ ] Verify leaderboard displays correctly

---

## 21. Upgrade Guide

### Dependencies

```bash
# Check for outdated packages
npm outdated

# Update within semver range
npm update

# Update to latest major version (test thoroughly)
npm install package@latest
```

### Next.js

1. Check [Next.js changelog](https://nextjs.org/blog) for breaking changes
2. Update `next` and `eslint-config-next` together
3. Check `next.config.mjs` for deprecated options
4. Test all routes after upgrade

### Supabase

1. Check [Supabase changelog](https://supabase.com/changelog) for breaking changes
2. Update `@supabase/ssr` and `@supabase/supabase-js` together
3. Test OAuth flow after upgrade
4. Test database queries after upgrade

---

## 22. Testing Strategy

### Unit tests

**Framework:** Vitest (node environment, not jsdom)

**Location:** `src/__tests__/`

**Run:**
```bash
npm test           # Run all tests once
npm run test:watch # Run in watch mode
```

### What's tested

| Test file | Coverage |
|-----------|----------|
| `scoring.test.ts` | `computeStats`, `getRarityFromScore`, `generateCard` |
| `verification.test.ts` | Card ID format, HMAC signing, uniqueness, edition |
| `validation.test.ts` | Zod schemas: valid/invalid inputs |
| `card.test.ts` | POST `/api/card` and GET `/api/card` routes |
| `verify.test.ts` | GET `/api/verify/[cardId]` route |
| `auth-helpers.test.ts` | Session extraction |

### What's not tested

- UI components (no component tests)
- Pages (no integration tests)
- Middleware (no middleware tests)
- OG image generation
- E2E flows (Playwright mentioned in `.gitignore` but not installed)

### Writing tests

```typescript
import { describe, it, expect } from "vitest";
import { myFunction } from "@/lib/my-module";

describe("myFunction", () => {
  it("returns expected result", () => {
    const result = myFunction(input);
    expect(result).toBe(expected);
  });
});
```

### Mocking

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/some-module", () => ({
  someFunction: vi.fn(),
}));

import { someFunction } from "@/lib/some-module";
const mockFn = vi.mocked(someFunction);

beforeEach(() => {
  vi.clearAllMocks();
});
```

---

## 23. Code Review Checklist

- [ ] TypeScript compiles (`npx tsc --noEmit`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Tests pass (`npm test`)
- [ ] No `console.log` in production code (except structured logging)
- [ ] No hardcoded URLs (use `NEXT_PUBLIC_SITE_URL`)
- [ ] No secrets in code
- [ ] Zod validation on new API inputs
- [ ] Rate limiting on new write endpoints
- [ ] RLS policies cover new tables (if any)
- [ ] Environment variable changes reflected in `.env.example`
- [ ] Documentation updated if needed

---

## 24. Production Release Checklist

- [ ] All tests pass
- [ ] Build succeeds
- [ ] Lighthouse audit: LCP < 1.8s, TBT < 200ms, CLS = 0
- [ ] Environment variables set in Netlify
- [ ] Database migrations applied
- [ ] Health check returns 200: `curl https://dev-mon.netlify.app/api/health`
- [ ] OAuth flow works end-to-end
- [ ] Card generation works
- [ ] Verification page works
- [ ] Leaderboard displays correctly
- [ ] OG image generation works
- [ ] Security headers present: `curl -I https://dev-mon.netlify.app`

---

## 25. Disaster Recovery

### Database

- **Supabase automatic backups:** 7 days (free tier), 30 days (paid tier)
- **Restore:** Supabase Dashboard > Backups > Restore to a point in time
- **Manual backup:** Export via SQL Editor: `pg_dump` or Supabase Dashboard > Database > Backups

### Code

- **GitHub repository** is the source of truth
- **Clone from GitHub** to restore codebase
- **Tagged releases** for stable versions

### Environment variables

- **Documented** in `.env.example`
- **Stored securely** in Netlify Dashboard
- **Recovery:** Re-enter all variables in Netlify Dashboard

### Recovery steps

1. Restore Supabase database from backup
2. Re-deploy from master branch on Netlify
3. Verify all environment variables are set
4. Test OAuth flow
5. Test card generation
6. Verify leaderboard

---

## 26. Backup Strategy

| Component | Backup method | Frequency | Retention |
|-----------|--------------|-----------|-----------|
| Database | Supabase automatic backups | Daily | 7 days (free), 30 days (paid) |
| Code | GitHub repository | On every push | Indefinite |
| Environment variables | Documented in `.env.example` + stored in Netlify | Manual | Indefinite |

No custom backup scripts are configured.

---

## 27. Documentation Standards

### Existing documentation

| Document | Purpose | Audience |
|----------|---------|----------|
| `README.md` | Project overview, quick start | Everyone |
| `ARCHITECTURE.md` | Technical specification, algorithms | Engineers |
| `DEVELOPER_GUIDE.md` | Contributor handbook (this file) | Contributors, maintainers |
| `DESIGN.md` | Locked design system | Designers, frontend engineers |
| `PLAN.md` | Historical migration plan | Maintainers (reference) |
| `LICENSE` | AGPL-3.0 license | Everyone |

### Inline comments

- Use only when explaining non-obvious logic
- Do not comment on obvious code
- No JSDoc annotations (`@param`, `@returns`) — not used in this codebase

### Commit messages

- Imperative mood, lowercase, no period
- Under 72 characters
- Describe what changed, not why (the PR description explains why)

---

## 28. FAQ

**Why Supabase instead of NextAuth?**
Supabase provides auth + PostgreSQL in one service, with built-in RLS and a dashboard. NextAuth required separate database adapters and more configuration.

**Why no E2E tests?**
Not yet implemented. The `.gitignore` references Playwright, indicating intent, but it's not installed. Unit tests cover the core algorithms and API routes.

**Why no CI/CD pipeline?**
Not yet configured. No `.github/workflows/` directory exists. Deploys are triggered manually or via Netlify's GitHub integration.

**Why Netlify instead of Vercel?**
User preference. Netlify provides simple deployment with GitHub integration.

**Can I use yarn or pnpm?**
npm is the primary package manager (`package-lock.json` is committed). yarn and pnpm may work but are not tested.

**How do I reset the database?**
Run `supabase/full_migration.sql` again (it drops and recreates tables), or run `DELETE FROM cards;` to clear data only.

**How do I change the HMAC secret?**
Update `HMAC_SECRET` in `.env.local` and all environment instances. Future cards will use the new secret. Existing cards remain valid (their signatures were computed with the old secret).

**How do I add a new rarity tier?**
1. Add the tier to the `Rarity` type in `src/types/index.ts`
2. Update `getRarityFromScore()` in `src/lib/scoring.ts`
3. Add color tokens in `src/types/index.ts` (`RARITY_COLORS`)
4. Add CSS tokens in `src/app/globals.css`

---

## 29. Appendix: Useful Commands

```bash
# Development
npm run dev              # Start dev server on port 3000
npm run build            # Create production build
npm start                # Start production server
npm run lint             # Run ESLint
npm test                 # Run Vitest tests (single run)
npm run test:watch       # Run Vitest in watch mode

# Type checking
npx tsc --noEmit         # TypeScript type check (no output = success)

# Debugging
curl -I http://localhost:3000/api/health    # Health check
curl http://localhost:3000/api/card         # Card count

# Database (Supabase SQL Editor)
SELECT * FROM cards ORDER BY created_at DESC LIMIT 10;
SELECT COUNT(*) FROM cards;
SELECT * FROM pg_indexes WHERE tablename = 'cards';
SELECT * FROM pg_policies WHERE tablename = 'cards';

# Environment
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"  # Generate HMAC secret

# Git
git log --oneline -10    # Recent commits
git status               # Check working tree
git diff                 # See unstaged changes
```

---

## 30. Appendix: Scripts Reference

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev` | Start development server on port 3000 with hot reload |
| `build` | `next build` | Create optimized production build in `.next/` |
| `start` | `next start` | Start production server (requires `build` first) |
| `lint` | `next lint` | Run ESLint with `next/core-web-vitals` and `next/typescript` |
| `test` | `vitest run` | Run all tests once and exit |
| `test:watch` | `vitest` | Run tests in watch mode (re-runs on file changes) |

---

## 31. Appendix: Reference Tables

### Scoring thresholds

| Stat | Range | Formula summary |
|------|-------|----------------|
| Merge Force | 0-100 | `logScale(mergedPRs) * 0.5 + logScale(closedIssues) * 0.3 + min(100, mergedPRs * 0.8) * 0.2` |
| Code Velocity | 0-100 | `logScale(recentCommits, 18) * 0.6 + streakComponent * 0.3 + logScale(totalCommits, 8) * 0.1` |
| Problem Solving | 0-100 | `closeRateScore * 0.4 + volumeScore * 0.35 + issueDepth * 0.25` |
| Open Source | 0-100 | `contributedTo * 6 + orgCount * 12 + forkEngagement + communityPresence` |
| Consistency | 0-100 | `longestStreakScore * 0.4 + currentStreakBonus * 0.35 + regularity * 0.25` |

### Rarity tiers

| Tier | Score | Color |
|------|-------|-------|
| Common | 0-45 | `#8A8F98` |
| Rare | 46-70 | `#3E6FE0` |
| Epic | 71-88 | `#6C4BA6` |
| Legendary | 89-96 | `#E0932E` |
| Mythic | 97-100 | `#B23A48` |

### Developer classes

| Class | Primary trigger |
|-------|----------------|
| PR Titan | High `mergedPRs` count |
| Bug Hunter | High `closedIssues` count and close rate |
| Night Owl | >30% of commits between 00:00-05:00 |
| Fork Warden | High `forkedRepos` / `originalRepos` ratio |
| Commit Phantom | Necro-commit (repo pushed >1yr after creation) |
| Open Source Sentinel | High `contributedTo` + `orgCount` |
| Merge Griffin | High `mergedPRs` + high `codeVelocity` |
| Stack Guardian | Broad `originalRepos` + `languages` coverage |
| Polyglot Artisan | Many `languages` |
| Code Archivist | Many `archivedRepos` |
| Green Sprout | Account age < 2 years + activity |
| Zen Coder | High `zeroStarRepos` / `originalRepos` ratio |

### Rate limits

| Endpoint | Window | Max | Identifier |
|----------|--------|-----|------------|
| POST `/api/card` | 60s | 10 | User ID |
| GET `/api/leaderboard` | 60s | 60 | IP |
| GET `/api/og` | 60s | 5 | IP |

### Card ID format

- Pattern: `DM-[A-Z0-9]{6}`
- Charset: `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (32 chars, no I/1/0/O)
- Entropy: 32^6 = 1,073,741,824 possible IDs

---

## 32. Appendix: Useful Links

| Resource | URL |
|----------|-----|
| Supabase Docs | https://supabase.com/docs |
| Next.js Docs | https://nextjs.org/docs |
| Tailwind CSS Docs | https://tailwindcss.com/docs |
| GitHub OAuth Docs | https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps |
| Upstash Redis Docs | https://upstash.com/docs |
| Vitest Docs | https://vitest.dev/ |
| Zod Docs | https://zod.dev/ |
| GSAP Docs | https://greensock.com/docs/ |
| Motion (Framer) Docs | https://motion.dev/docs |
| html-to-image Docs | https://github.com/bubkoo/html-to-image |
| Netlify Docs | https://docs.netlify.com/ |

---

## 33. Appendix: File Quick Reference

| File | Purpose | Key exports | Env vars |
|------|---------|-------------|----------|
| `src/lib/scoring.ts` | Scoring pipeline orchestrator | `computeStats`, `generateCard`, `getRarityFromScore` | — |
| `src/lib/rarity.ts` | 8-factor rarity composite | `computeRarity` | — |
| `src/lib/classes.ts` | 12 developer class rules | `assignClasses` | — |
| `src/lib/flavor-text.ts` | 40 flavor text templates | `generateFlavorText` | — |
| `src/lib/achievements.ts` | 8 achievement types | `generateAchievements` | — |
| `src/lib/signature-move.ts` | 14 signature moves | `generateSignatureMove` | — |
| `src/lib/hero-stat.ts` | Hero stat selection | `selectHeroStat` | — |
| `src/lib/verification.ts` | HMAC-SHA-256 signing | `generateVerification`, `reSignVerification` | `HMAC_SECRET` |
| `src/lib/github.ts` | GitHub GraphQL fetcher | `fetchGitHubStats` | `GITHUB_TOKEN` (via route) |
| `src/lib/validation.ts` | Zod schemas | `CardPostSchema`, `CardIdSchema` | — |
| `src/lib/rate-limit.ts` | Upstash rate limiter | `rateLimit`, `RATE_LIMITS` | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` |
| `src/lib/auth-helpers.ts` | Session extraction | `getSessionUser` | — |
| `src/lib/supabase/server.ts` | Server-side Supabase client | `createClient` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `src/lib/supabase/client.ts` | Browser-side Supabase client | `createClient` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `src/types/index.ts` | Types and constants | `RawGitHubStats`, `CardStats`, `RARITY_COLORS`, `STAT_LABELS`, `CLASS_SUBTITLES` | — |
| `src/middleware.ts` | Auth middleware | `middleware`, `config` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `src/app/api/card/route.ts` | Card generation API | `POST`, `GET` | `GITHUB_TOKEN` (via github.ts) |
| `src/app/api/leaderboard/route.ts` | Leaderboard API | `GET` | — |
| `src/app/api/verify/[cardId]/route.ts` | Verification API | `GET` | — |
| `src/app/api/og/route.tsx` | OG image generation | `GET` | `GITHUB_TOKEN` |
| `src/app/api/health/route.ts` | Health check | `GET` | — |
| `src/app/api/auth/callback/route.ts` | OAuth callback | `GET` | — |
| `src/app/api/auth/signout/route.ts` | Sign out | `POST` | — |
| `next.config.mjs` | Security headers, CSP | — | — |
| `supabase/full_migration.sql` | Database schema | — | — |
| `.env.example` | Environment template | — | All 8 vars documented |
