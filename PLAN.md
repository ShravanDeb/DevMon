# DevMon Production Migration Plan — HISTORICAL

> **Status:** This plan documents the completed migration from the prototype/pre-release architecture to the current production architecture. All phases have been implemented. This file is kept for historical reference only.

## Decisions (Locked)
- **Leaderboard POST + Count POST**: Keep, auth-protected
- **OG image data source**: Service `GITHUB_TOKEN` env var
- **Rate limiter**: Upstash Redis (`@upstash/ratelimit` + `@upstash/redis`)
- **Production domain**: `NEXT_PUBLIC_SITE_URL` env var (no hardcoded domain)
- **Auth**: NextAuth v4 → Supabase Auth (via `@supabase/ssr`)

---

## Phase 1 — Auth Migration: NextAuth → Supabase Auth
*Effort: L*

### Create
- `src/lib/supabase/server.ts` — Server client with `@supabase/ssr` `createServerClient`, uses Next.js `cookies()`/`headers()`
- `src/lib/supabase/client.ts` — Browser client with `@supabase/ssr` `createBrowserClient`
- `src/middleware.ts` — Session refresh on every request. Skip: static assets, `/`, `/leaderboard`, `/verify/*`, `/api/auth/*`. Protect: `/card` (redirect to `/` if unauthenticated)
- `src/lib/auth-helpers.ts` — `getSessionUser(req)` for Route Handlers: reads Supabase session from cookies, returns `{ userId, accessToken }` or null
- `src/app/api/auth/callback/route.ts` — OAuth callback: exchanges `?code=` for session via `supabase.auth.exchangeCodeForSession()`, redirects to `/card`
- `src/app/api/auth/signout/route.ts` — Calls `supabase.auth.signOut()`, clears cookies, redirects `/`

### Modify
- `src/app/providers.tsx` — Remove NextAuth `SessionProvider`. Keep only `ThemeProvider`
- `src/app/layout.tsx` — Add client-side Supabase session context
- `src/app/page.tsx` — Replace `useSession()`/`signIn("github")` with Supabase OAuth button. Remove all `isDev`/`?dev=true`/dev input/`handleDevGenerate`
- `src/app/card/page.tsx` — Remove `useSession` from next-auth, remove `devUsername`/`searchParams.get("dev")`. POST to `/api/card` with `{ tone?, rarity? }` only (no accessToken in body). 401 → redirect `/`

### Delete
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/lib/auth.ts`

---

## Phase 2 — Database Schema + RLS + Migrations
*Effort: M*

### Create
- `supabase/migrations/001_initial_schema.sql`
  - `profiles`: id text PK (github username), username text unique, display_name text, avatar_url text, stats jsonb, card jsonb, company text, primary_language text, updated_at timestamptz
  - `leaderboard`: username text PK, display_name text, avatar_url text, rarity text, rarity_score int, primary_class text, stats jsonb, company text, primary_language text, generated_at timestamptz
  - `card_count`: id int PK default 1, count int default 0
  - Indexes: `idx_leaderboard_rarity_score DESC`, `idx_leaderboard_company`, `idx_profiles_updated_at`
- `supabase/migrations/002_rls_policies.sql`
  - Enable RLS on all 3 tables
  - `profiles`: SELECT for authenticated, INSERT/UPDATE for service_role
  - `leaderboard`: SELECT for anon+authenticated (public), INSERT/UPDATE for service_role
  - `card_count`: SELECT for anon+authenticated, UPDATE for service_role
- `supabase/migrations/003_functions.sql`
  - `increment_card_count()`: atomic read+upsert via SQL function, avoids race condition
  - `increment_edition(p_card_id text)`: atomic edition counter per card, replaces in-memory counter

### Modify
- `src/lib/supabase.ts` — Keep as admin-only (service role) client. Remove `getSupabase()` (browser client moves to `supabase/client.ts`)

---

## Phase 3 — Delete Mocks + Rewrite API Routes
*Effort: L | depends on 1+2*

### Delete
- `src/lib/mock-stats.ts`
- `src/lib/card-store.ts`
- `src/lib/leaderboard-local.ts`
- `.devmon-cards.json`, `.devmon-leaderboard.json`

### Rewrite
- `src/app/api/card/route.ts`
  - POST: `getSessionUser(req)` → 401 if null → get `session.provider_token` → `fetchGitHubStats(token)` → `generateCard(raw, tone, rarity)` → Supabase upserts (profiles + leaderboard + increment_card_count RPC). Accept only `{ tone?, rarity? }`. No `accessToken`, `username`, `raw`, `DEV_GITHUB_TOKEN`, or `generateMockStats`. No local file fallback
  - GET: Keep as-is (public card_count read)
- `src/app/api/leaderboard/route.ts`
  - GET: Keep public (Supabase query). Add rate limiting
  - POST: Auth-protected (admin only or self-upsert via session). Add Zod validation
- `src/app/api/count/route.ts`
  - GET: Keep public
  - POST: Auth-protected (use `increment_card_count()` RPC)
- `src/app/api/verify/[cardId]/route.ts` — Supabase lookup: `profiles` where `card->>'verification'->>'cardId' = $1`. Return 404 if not found
- `src/app/api/og/route.tsx` — Remove `token` query param. Use service `GITHUB_TOKEN` env var to call `fetchGitHubStatsForUser`. Add rate limiting (5 req/min)

### Modify
- `src/lib/graphql.ts` — Keep `fetchGitHubStatsForUser` (now used by OG route with service token). Keep `fetchGitHubStats`

---

## Phase 4 — Verification Rewrite + Input Validation
*Effort: M | depends on Phase 3*

### Install
- `zod`

### Create
- `src/lib/validation.ts` — Zod schemas: `CardPostSchema` (`{ tone?: "hype"|"roast", rarity?: Rarity }`), `LeaderboardQuerySchema` (`{ company?: string, limit: 1-100 default 20, offset: 0+ default 0 }`), `CardIdSchema` (format `DM-[A-Z0-9]{6}`)

### Rewrite
- `src/lib/verification.ts`
  - Replace FNV-1a hash with `crypto.createHmac('sha256', HMAC_SECRET)` — real HMAC-SHA256
  - Card ID via `crypto.randomBytes(3).toString('hex').toUpperCase()` (6 char, cryptographically random)
  - Edition via `increment_edition()` RPC (atomic DB counter, persistent)
  - `digitalSignature` = `hmac_${hmacHex}`
  - Remove in-memory `editionCounter`

### Modify
- `src/app/api/card/route.ts` — use `CardPostSchema.parse()` (safeParse + 400 on failure)
- `src/app/api/leaderboard/route.ts` — use `LeaderboardQuerySchema.parse()` on query params
- `src/app/api/verify/[cardId]/route.ts` — validate cardId with `CardIdSchema`

---

## Phase 5 — Rate Limiting + Security Headers
*Effort: M | depends on Phase 1*

### Install
- `@upstash/ratelimit`
- `@upstash/redis`

### Create
- `src/lib/rate-limit.ts` — Upstash rate limiter factory. Configs: 10 req/min for card gen, 60 req/min for reads, 5 req/min for OG

### Modify
- `src/app/api/card/route.ts` — apply rate limiter at top of POST
- `src/app/api/og/route.tsx` — apply rate limiter (5/min)
- `src/app/api/leaderboard/route.ts` — apply rate limiter on GET
- `next.config.mjs` — add security headers via `headers()`:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `X-DNS-Prefetch-Control: on`
  - Remove `X-Powered-By` via `poweredByHeader: false`
  - CSP: allow `avatars.githubusercontent.com`, Google Fonts, inline styles (framer-motion), `next/image`

---

## Phase 6 — Error Boundaries + Component Fixes
*Effort: S*

### Create
- `src/app/error.tsx` — global error boundary (client, "use client"), styled error page with retry
- `src/app/card/error.tsx` — card-specific error boundary
- `src/app/not-found.tsx` — custom 404 page
- `src/app/loading.tsx` — global loading skeleton

### Modify
- `src/components/CardFace.tsx:139` — replace hardcoded `https://devmon.dev/verify/` with `process.env.NEXT_PUBLIC_SITE_URL` (via a const or prop)
- `src/app/page.tsx` — remove fake testimonials (lines 155-160). Keep demo stat bars
- Remove `console.error` in: `src/app/api/card/route.ts`, `src/lib/card-store.ts` (deleted), `src/lib/leaderboard-local.ts` (deleted). Replace remaining with structured logging or remove

---

## Phase 7 — SEO + Metadata
*Effort: S*

### Modify
- `src/app/layout.tsx` — add `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL)`, `icons` (favicon), `alternates` (canonical). Update title: remove "Pokémon-Style" (IP concern). Add OG image reference: `${SITE_URL}/api/og?user=devmon`

### Create
- `src/app/robots.ts` — `User-agent: * / Allow: / / Sitemap: ${SITE_URL}/sitemap.xml`
- `src/app/sitemap.ts` — static: `[{ url: SITE_URL, priority: 1 }, { url: `${SITE_URL}/leaderboard`, priority: 0.8 }]`
- `public/favicon.ico` or `src/app/icon.tsx`

---

## Phase 8 — Testing
*Effort: L | depends on 2-5*

### Install (devDeps)
- `vitest`, `@vitejs/plugin-react`, `@vitest/coverage-v8`
- `playwright`, `@playwright/test`

### Create
- `vitest.config.ts` — path aliases matching tsconfig
- `playwright.config.ts` — baseURL, webServer config
- `src/lib/__tests__/scoring.test.ts` — `computeStats`, `generateCard`, `getRarityFromScore` with fixture `RawGitHubStats`
- `src/lib/__tests__/rarity.test.ts` — `computeRarity` score ranges per tier
- `src/lib/__tests__/verification.test.ts` — HMAC correctness, cardId format, edition increment
- `src/lib/__tests__/validation.test.ts` — all Zod schemas: valid/invalid inputs
- `tests/e2e/card-flow.spec.ts` — sign in → generate → verify page → download
- `tests/e2e/leaderboard.spec.ts` — load → entries display → filter

### Modify
- `package.json` — add scripts: `"test": "vitest"`, `"test:e2e": "playwright test"`, `"test:coverage": "vitest --coverage"`, `"typecheck": "tsc --noEmit"`

---

## Phase 9 — Cleanup + Deploy
*Effort: S*

### Modify
- `package.json` — remove: `next-auth`, `framer-motion` (duplicate of `motion`), `@vercel/og` (unused, OG uses `next/og`). Add: `zod`, `@upstash/ratelimit`, `@upstash/redis`, `vitest`, `playwright`, `@vitejs/plugin-react`, `@vitest/coverage-v8`, `@playwright/test`
- `.gitignore` — add: `.devmon-cards.json`, `.devmon-leaderboard.json`, `test-results/`, `playwright-report/`
- `.env.example` — rewrite with new vars:
  ```
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  HMAC_SECRET=
  GITHUB_TOKEN=
  NEXT_PUBLIC_SITE_URL=
  ```
- `README.md` — rewrite: accurate file tree, setup, env vars, deploy steps

### Verify
- `npx next lint` — zero errors
- `npx tsc --noEmit` — zero errors
- `npm run build` — clean production build
- `npx vitest run` — all unit tests pass

### Deploy (Netlify)
- Set all env vars from `.env.example` in Netlify dashboard
- Apply Supabase migrations (SQL Editor in Supabase Dashboard)
- Connect repo, auto-deploy from main, preview for PRs
- Configure custom domain if applicable

---

## Files Preserved (UI untouched)
- `src/components/CardFace.tsx` (except hardcoded domain fix)
- `src/components/DownloadButton.tsx`
- `src/components/MagneticButton.tsx`
- `src/components/ThemeToggle.tsx`
- `src/lib/scoring.ts`, `rarity.ts`, `hero-stat.ts`, `classes.ts`, `flavor-text.ts`, `achievements.ts`, `signature-move.ts`
- `src/types/index.ts` (minor updates only)
- `src/app/globals.css` (all neumorphic tokens, shimmer, card classes)
- `src/app/card/page.tsx` (layout/animations preserved)
- `src/app/leaderboard/page.tsx` (table styling preserved)
- `src/app/verify/[cardId]/page.tsx` (UI preserved)
- `tailwind.config.ts`
