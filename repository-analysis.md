# DevMon Repository Analysis Report

> **Generated:** 2026-07-15T13:12:37.559Z | **Duration:** 0.3s | **Total Files Scanned:** 100

---

## Executive Summary

This report is a production-grade static analysis of the DevMon repository at `C:\Users\Shrav\Desktop\DevMon`. It identifies unused code, security concerns, performance optimization opportunities, documentation issues, and structural improvements across 100 files.

### Health Dashboard

| Metric | Score | Status |
|--------|-------|--------|
| **Repository Health** | 56/100 | 🟠 |
| **Security** | 92/100 | 🟢 |
| **Documentation** | 100/100 | 🟢 |
| **Performance** | 75/100 | 🟡 |
| **Architecture** | 96/100 | 🟢 |
| **Maintainability** | 90/100 | 🟢 |
| **Technical Debt** | 46/100 | 🟠 |
| **Overall** | **79/100** | **🟡** |

### Issue Breakdown

| Severity | Count |
|----------|-------|
| 🔴 Critical | 0 |
| 🟠 High | 2 |
| 🟡 Medium | 1 |
| 🔵 Low | 26 |
| ℹ️ Info | 44 |
| **Total** | **73** |

## Repository Statistics

| Category | Count | Total Size |
|----------|-------|------------|
| **Source Files** (ts/tsx/js/jsx) | 70 | 366.2 KB |
| **Styles** (css/scss) | 1 | 21.4 KB |
| **Documentation** (md/mdx) | 14 | 181.2 KB |
| **Assets** (png/jpg/svg/ico/webp) | 4 | 463.1 KB |
| **Fonts** | 0 | 0.0 KB |
| **SQL** | 1 | 5.4 KB |
| **Configuration** | 5 | 12.5 KB |
| **Scripts** | 0 | 0.0 KB |
| **Other** | 5 | 42.4 KB |
| **Total** | **100** | **1092.2 KB** |

## Next.js Architecture

### Findings

- **src/app/card/error.tsx** — Client Component boundary (✅ NONE, ★★★★★)
- **src/app/card/layout.tsx** — Static metadata export (good practice) (✅ NONE, ★★★★★)
- **src/app/card/page.tsx** — Client Component boundary (✅ NONE, ★★★★★)
- **src/app/contact/page.tsx** — Static metadata export (good practice) (✅ NONE, ★★★★★)
- **src/app/error.tsx** — Client Component boundary (✅ NONE, ★★★★★)
- **src/app/faq/layout.tsx** — Static metadata export (good practice) (✅ NONE, ★★★★★)
- **src/app/faq/page.tsx** — Client Component boundary (✅ NONE, ★★★★★)
- **src/app/layout.tsx** — Static metadata export (good practice) (✅ NONE, ★★★★★)
- **src/app/layout.tsx** — Static viewport export (good practice) (✅ NONE, ★★★★★)
- **src/app/leaderboard/error.tsx** — Client Component boundary (✅ NONE, ★★★★★)
- **src/app/leaderboard/layout.tsx** — Static metadata export (good practice) (✅ NONE, ★★★★★)
- **src/app/leaderboard/page.tsx** — Client Component boundary (✅ NONE, ★★★★★)
- **src/app/page.tsx** — Client Component boundary (✅ NONE, ★★★★★)
- **src/app/privacy/page.tsx** — Static metadata export (good practice) (✅ NONE, ★★★★★)
- **src/app/providers.tsx** — Client Component boundary (✅ NONE, ★★★★★)
- **src/app/terms/page.tsx** — Static metadata export (good practice) (✅ NONE, ★★★★★)
- **src/app/verify/[cardId]/error.tsx** — Client Component boundary (✅ NONE, ★★★★★)
- **src/app/verify/[cardId]/page.tsx** — Client Component boundary (✅ NONE, ★★★★★)
- **src/app/api/auth/callback/route.ts** — API Route Handler: GET (✅ NONE, ★★★★★)
- **src/app/api/auth/signout/route.ts** — API Route Handler: POST (✅ NONE, ★★★★★)
- **src/app/api/card/route.ts** — API Route Handler: GET, POST (✅ NONE, ★★★★★)
- **src/app/api/debug/route.ts** — API Route Handler: GET (✅ NONE, ★★★★★)
- **src/app/api/health/route.ts** — API Route Handler: GET (✅ NONE, ★★★★★)
- **src/app/api/leaderboard/route.ts** — API Route Handler: GET (✅ NONE, ★★★★★)
- **src/app/api/og/route.tsx** — API Route Handler: GET (✅ NONE, ★★★★★)
- **src/app/api/verify/[cardId]/route.ts** — API Route Handler: GET (✅ NONE, ★★★★★)
- **src/app/globals.css** — Unused CSS variable "--elevation-1" (🔵 LOW, ★★★☆☆)
- **src/app/globals.css** — Unused CSS variable "--elevation-2" (🔵 LOW, ★★★☆☆)
- **src/app/globals.css** — Unused CSS variable "--orb-glow" (🔵 LOW, ★★★☆☆)
- **src/app/api/card/route.ts** — console.error() found in production code (ℹ️ INFO, ★★★★★)
- **src/app/api/card/route.ts** — console.error() found in production code (ℹ️ INFO, ★★★★★)
- **src/app/api/card/route.ts** — console.error() found in production code (ℹ️ INFO, ★★★★★)
- **src/app/api/leaderboard/route.ts** — console.error() found in production code (ℹ️ INFO, ★★★★★)
- **src/app/api/verify/[cardId]/route.ts** — console.error() found in production code (ℹ️ INFO, ★★★★★)
- **src/app/api/verify/[cardId]/route.ts** — console.error() found in production code (ℹ️ INFO, ★★★★★)
- **src/app/page.tsx** — console.error() found in production code (ℹ️ INFO, ★★★★★)
- **next.config.mjs** — CSP allows 'unsafe-inline' for scripts (🟡 MEDIUM, ★★★★★)
- **next.config.mjs** — CSP allows 'unsafe-eval' for scripts (ℹ️ INFO, ★★★★★)
- **src/app/api/debug/route.ts** — Debug API endpoint should not be public in production (🟠 HIGH, ★★★★★)
- **src/app/card/page.tsx** — Large file (513 lines) (🔵 LOW, ★★★★★)
- **src/app/card/page.tsx** — Large component without dynamic import (🔵 LOW, ★★☆☆☆)
- **src/app/leaderboard/page.tsx** — Large component without dynamic import (🔵 LOW, ★★☆☆☆)
- **src/app/page.tsx** — Large file (960 lines) (🔵 LOW, ★★★★★)
- **src/app/page.tsx** — Large component without dynamic import (🔵 LOW, ★★☆☆☆)
- **src/app/privacy/page.tsx** — Large file (614 lines) (🔵 LOW, ★★★★★)
- **src/app/privacy/page.tsx** — Large component without dynamic import (🔵 LOW, ★★☆☆☆)
- **src/app/terms/page.tsx** — Large component without dynamic import (🔵 LOW, ★★☆☆☆)
- **src/app/verify/[cardId]/page.tsx** — Large component without dynamic import (🔵 LOW, ★★☆☆☆)

### App Router Structure

| Route | Files |
|-------|-------|
| `/` | error.tsx, globals.css, layout.tsx, loading.tsx, not-found.tsx, page.tsx, providers.tsx, robots.ts, sitemap.ts |
| `/api/auth/callback` | route.ts |
| `/api/auth/signout` | route.ts |
| `/api/card` | route.ts |
| `/api/debug` | route.ts |
| `/api/health` | route.ts |
| `/api/leaderboard` | route.ts |
| `/api/og` | route.tsx |
| `/api/verify/[cardId]` | route.ts |
| `/card` | error.tsx, layout.tsx, page.tsx |
| `/contact` | page.tsx |
| `/faq` | layout.tsx, page.tsx |
| `/leaderboard` | error.tsx, layout.tsx, page.tsx |
| `/privacy` | page.tsx |
| `/terms` | page.tsx |
| `/verify/[cardId]` | error.tsx, page.tsx |

## Safe To Delete

> ⚠️ Items in this section are **safe to delete** with high confidence. Remove with normal caution.

| File | Issue | Confidence | Risk |
|------|-------|------------|------|
| `next.config.mjs` | CSP allows 'unsafe-inline' for scripts | 100% | 🟡 MEDIUM |
| `src/app/api/debug/route.ts` | Debug API endpoint should not be public in production | 100% | 🟠 HIGH |
| `src/app/card/page.tsx` | Large file (513 lines) | 100% | 🔵 LOW |
| `src/app/page.tsx` | Large file (960 lines) | 100% | 🔵 LOW |
| `src/app/privacy/page.tsx` | Large file (614 lines) | 100% | 🔵 LOW |
| `src/components/CardFace.tsx` | Large file (609 lines) | 100% | 🔵 LOW |
| `src/components/CardFaceMobile.tsx` | Large file (538 lines) | 100% | 🔵 LOW |
| `.github/workflows/` | No CI/CD workflows configured | 100% | 🟠 HIGH |
| `.github/CODEOWNERS` | No CODEOWNERS file | 100% | 🔵 LOW |

## Possibly Unused

> 🔍 These items appear unused but need confirmation. Review before deleting.

### .env

- **Issue:** Environment variable "SUPABASE_DB_PASSWORD" in .env but not in .env.example
- **Evidence:** "SUPABASE_DB_PASSWORD" exists in .env but is missing from .env.example
- **Confidence:** 80% ★★★☆☆
- **Risk:** 🔵 LOW
- **Recommendation:** Add to .env.example (with placeholder) to document required variables.
- **Suggested Fix:** Add to .env.example:
# SUPABASE_DB_PASSWORD
SUPABASE_DB_PASSWORD=your-value-here

### src/app/globals.css

- **Issue:** Unused CSS variable "--elevation-1"
- **Evidence:** CSS variable --elevation-1 defined in src/app/globals.css but never referenced via var() in any source or CSS file
- **Confidence:** 80% ★★★☆☆
- **Risk:** 🔵 LOW
- **Recommendation:** Remove unused CSS variable.
- **Suggested Fix:** Delete ----elevation-1 declaration

### src/app/globals.css

- **Issue:** Unused CSS variable "--elevation-2"
- **Evidence:** CSS variable --elevation-2 defined in src/app/globals.css but never referenced via var() in any source or CSS file
- **Confidence:** 80% ★★★☆☆
- **Risk:** 🔵 LOW
- **Recommendation:** Remove unused CSS variable.
- **Suggested Fix:** Delete ----elevation-2 declaration

### src/app/globals.css

- **Issue:** Unused CSS variable "--orb-glow"
- **Evidence:** CSS variable --orb-glow defined in src/app/globals.css but never referenced via var() in any source or CSS file
- **Confidence:** 80% ★★★☆☆
- **Risk:** 🔵 LOW
- **Recommendation:** Remove unused CSS variable.
- **Suggested Fix:** Delete ----orb-glow declaration

## Manual Review Required

### src/app/card/page.tsx

- **Issue:** Large component without dynamic import
- **Evidence:** src/app/card/page.tsx has 513 lines but no dynamic() or React.lazy() usage
- **Confidence:** 50% ★★☆☆☆
- **Risk:** 🔵 LOW
- **Recommendation:** Consider lazy loading sub-components if they are not needed on initial render.
- **Suggested Fix:** Use next/dynamic() for heavy sub-components: const HeavyComponent = dynamic(() => import('./HeavyComponent'))

### src/app/leaderboard/page.tsx

- **Issue:** Large component without dynamic import
- **Evidence:** src/app/leaderboard/page.tsx has 284 lines but no dynamic() or React.lazy() usage
- **Confidence:** 50% ★★☆☆☆
- **Risk:** 🔵 LOW
- **Recommendation:** Consider lazy loading sub-components if they are not needed on initial render.
- **Suggested Fix:** Use next/dynamic() for heavy sub-components: const HeavyComponent = dynamic(() => import('./HeavyComponent'))

### src/app/page.tsx

- **Issue:** Large component without dynamic import
- **Evidence:** src/app/page.tsx has 960 lines but no dynamic() or React.lazy() usage
- **Confidence:** 50% ★★☆☆☆
- **Risk:** 🔵 LOW
- **Recommendation:** Consider lazy loading sub-components if they are not needed on initial render.
- **Suggested Fix:** Use next/dynamic() for heavy sub-components: const HeavyComponent = dynamic(() => import('./HeavyComponent'))

### src/app/privacy/page.tsx

- **Issue:** Large component without dynamic import
- **Evidence:** src/app/privacy/page.tsx has 614 lines but no dynamic() or React.lazy() usage
- **Confidence:** 50% ★★☆☆☆
- **Risk:** 🔵 LOW
- **Recommendation:** Consider lazy loading sub-components if they are not needed on initial render.
- **Suggested Fix:** Use next/dynamic() for heavy sub-components: const HeavyComponent = dynamic(() => import('./HeavyComponent'))

### src/app/terms/page.tsx

- **Issue:** Large component without dynamic import
- **Evidence:** src/app/terms/page.tsx has 464 lines but no dynamic() or React.lazy() usage
- **Confidence:** 50% ★★☆☆☆
- **Risk:** 🔵 LOW
- **Recommendation:** Consider lazy loading sub-components if they are not needed on initial render.
- **Suggested Fix:** Use next/dynamic() for heavy sub-components: const HeavyComponent = dynamic(() => import('./HeavyComponent'))

### src/app/verify/[cardId]/page.tsx

- **Issue:** Large component without dynamic import
- **Evidence:** src/app/verify/[cardId]/page.tsx has 419 lines but no dynamic() or React.lazy() usage
- **Confidence:** 50% ★★☆☆☆
- **Risk:** 🔵 LOW
- **Recommendation:** Consider lazy loading sub-components if they are not needed on initial render.
- **Suggested Fix:** Use next/dynamic() for heavy sub-components: const HeavyComponent = dynamic(() => import('./HeavyComponent'))

### src/components/CardFace.tsx

- **Issue:** Large component without dynamic import
- **Evidence:** src/components/CardFace.tsx has 609 lines but no dynamic() or React.lazy() usage
- **Confidence:** 50% ★★☆☆☆
- **Risk:** 🔵 LOW
- **Recommendation:** Consider lazy loading sub-components if they are not needed on initial render.
- **Suggested Fix:** Use next/dynamic() for heavy sub-components: const HeavyComponent = dynamic(() => import('./HeavyComponent'))

### src/components/CardFaceMobile.tsx

- **Issue:** Large component without dynamic import
- **Evidence:** src/components/CardFaceMobile.tsx has 538 lines but no dynamic() or React.lazy() usage
- **Confidence:** 50% ★★☆☆☆
- **Risk:** 🔵 LOW
- **Recommendation:** Consider lazy loading sub-components if they are not needed on initial render.
- **Suggested Fix:** Use next/dynamic() for heavy sub-components: const HeavyComponent = dynamic(() => import('./HeavyComponent'))

### src/components/DownloadButton.tsx

- **Issue:** Large component without dynamic import
- **Evidence:** src/components/DownloadButton.tsx has 451 lines but no dynamic() or React.lazy() usage
- **Confidence:** 50% ★★☆☆☆
- **Risk:** 🔵 LOW
- **Recommendation:** Consider lazy loading sub-components if they are not needed on initial render.
- **Suggested Fix:** Use next/dynamic() for heavy sub-components: const HeavyComponent = dynamic(() => import('./HeavyComponent'))

### src/components/LinkedInShareModal.tsx

- **Issue:** Large component without dynamic import
- **Evidence:** src/components/LinkedInShareModal.tsx has 270 lines but no dynamic() or React.lazy() usage
- **Confidence:** 50% ★★☆☆☆
- **Risk:** 🔵 LOW
- **Recommendation:** Consider lazy loading sub-components if they are not needed on initial render.
- **Suggested Fix:** Use next/dynamic() for heavy sub-components: const HeavyComponent = dynamic(() => import('./HeavyComponent'))

## Duplicate Code

> ✅ No duplicate code detected.

## Security Findings

### scripts/migrate.js

- **Issue:** console.log() found in production code
- **Evidence:** Line 32: console.log(`Connected to ${url.substring(0, 60)}...`);
- **Confidence:** 100% ★★★★★
- **Risk:** 🔵 LOW
- **Recommendation:** Remove or replace with proper logging.
- **Suggested Fix:** Remove console statement or use a structured logging library.

### scripts/migrate.js

- **Issue:** console.log() found in production code
- **Evidence:** Line 36: console.log(`  Failed: ${err.message}`);
- **Confidence:** 100% ★★★★★
- **Risk:** 🔵 LOW
- **Recommendation:** Remove or replace with proper logging.
- **Suggested Fix:** Remove console statement or use a structured logging library.

### scripts/migrate.js

- **Issue:** console.log() found in production code
- **Evidence:** Line 47: console.log(`\nRunning migration (${sql.length} chars)...\n`);
- **Confidence:** 100% ★★★★★
- **Risk:** 🔵 LOW
- **Recommendation:** Remove or replace with proper logging.
- **Suggested Fix:** Remove console statement or use a structured logging library.

### scripts/migrate.js

- **Issue:** console.log() found in production code
- **Evidence:** Line 73: console.log(`  OK   ${label}`);
- **Confidence:** 100% ★★★★★
- **Risk:** 🔵 LOW
- **Recommendation:** Remove or replace with proper logging.
- **Suggested Fix:** Remove console statement or use a structured logging library.

### scripts/migrate.js

- **Issue:** console.log() found in production code
- **Evidence:** Line 76: console.log(`  SKIP ${label}`);
- **Confidence:** 100% ★★★★★
- **Risk:** 🔵 LOW
- **Recommendation:** Remove or replace with proper logging.
- **Suggested Fix:** Remove console statement or use a structured logging library.

### scripts/migrate.js

- **Issue:** console.log() found in production code
- **Evidence:** Line 85: console.log('\nMigration complete!');
- **Confidence:** 100% ★★★★★
- **Risk:** 🔵 LOW
- **Recommendation:** Remove or replace with proper logging.
- **Suggested Fix:** Remove console statement or use a structured logging library.

### scripts/migrate.js

- **Issue:** console.error() found in production code
- **Evidence:** Line 16: console.error('SUPABASE_DB_PASSWORD not found in .env');
- **Confidence:** 100% ★★★★★
- **Risk:** ℹ️ INFO
- **Recommendation:** console.error() may be intentional — review context.
- **Suggested Fix:** Remove console statement or use a structured logging library.

### scripts/migrate.js

- **Issue:** console.error() found in production code
- **Evidence:** Line 17: console.error('Add it from: Supabase Dashboard → Settings → Database → Connection string');
- **Confidence:** 100% ★★★★★
- **Risk:** ℹ️ INFO
- **Recommendation:** console.error() may be intentional — review context.
- **Suggested Fix:** Remove console statement or use a structured logging library.

### scripts/migrate.js

- **Issue:** console.error() found in production code
- **Evidence:** Line 41: console.error('\nCould not connect. Reset your database password at:');
- **Confidence:** 100% ★★★★★
- **Risk:** ℹ️ INFO
- **Recommendation:** console.error() may be intentional — review context.
- **Suggested Fix:** Remove console statement or use a structured logging library.

### scripts/migrate.js

- **Issue:** console.error() found in production code
- **Evidence:** Line 42: console.error('https://supabase.com/dashboard/project/' + projectRef + '/settings/database');
- **Confidence:** 100% ★★★★★
- **Risk:** ℹ️ INFO
- **Recommendation:** console.error() may be intentional — review context.
- **Suggested Fix:** Remove console statement or use a structured logging library.

### scripts/migrate.js

- **Issue:** console.error() found in production code
- **Evidence:** Line 78: console.error(`  ERR  ${label}`);
- **Confidence:** 100% ★★★★★
- **Risk:** ℹ️ INFO
- **Recommendation:** console.error() may be intentional — review context.
- **Suggested Fix:** Remove console statement or use a structured logging library.

### scripts/migrate.js

- **Issue:** console.error() found in production code
- **Evidence:** Line 79: console.error(`       ${err.message}`);
- **Confidence:** 100% ★★★★★
- **Risk:** ℹ️ INFO
- **Recommendation:** console.error() may be intentional — review context.
- **Suggested Fix:** Remove console statement or use a structured logging library.

### src/app/api/card/route.ts

- **Issue:** console.error() found in production code
- **Evidence:** Line 77: console.error("upsert_card error:", upsertErr.message);
- **Confidence:** 100% ★★★★★
- **Risk:** ℹ️ INFO
- **Recommendation:** console.error() may be intentional — review context.
- **Suggested Fix:** Remove console statement or use a structured logging library.

### src/app/api/card/route.ts

- **Issue:** console.error() found in production code
- **Evidence:** Line 87: console.error("upsert_card returned no row:", JSON.stringify(upsertResult));
- **Confidence:** 100% ★★★★★
- **Risk:** ℹ️ INFO
- **Recommendation:** console.error() may be intentional — review context.
- **Suggested Fix:** Remove console statement or use a structured logging library.

### src/app/api/card/route.ts

- **Issue:** console.error() found in production code
- **Evidence:** Line 106: console.error("re-sign update error:", signUpdateErr.message);
- **Confidence:** 100% ★★★★★
- **Risk:** ℹ️ INFO
- **Recommendation:** console.error() may be intentional — review context.
- **Suggested Fix:** Remove console statement or use a structured logging library.

### src/app/api/leaderboard/route.ts

- **Issue:** console.error() found in production code
- **Evidence:** Line 53: console.error("[leaderboard] error:", err);
- **Confidence:** 100% ★★★★★
- **Risk:** ℹ️ INFO
- **Recommendation:** console.error() may be intentional — review context.
- **Suggested Fix:** Remove console statement or use a structured logging library.

### src/app/api/verify/[cardId]/route.ts

- **Issue:** console.error() found in production code
- **Evidence:** Line 31: console.error("verify query error:", queryError.message);
- **Confidence:** 100% ★★★★★
- **Risk:** ℹ️ INFO
- **Recommendation:** console.error() may be intentional — review context.
- **Suggested Fix:** Remove console statement or use a structured logging library.

### src/app/api/verify/[cardId]/route.ts

- **Issue:** console.error() found in production code
- **Evidence:** Line 76: console.error("verify error:", message);
- **Confidence:** 100% ★★★★★
- **Risk:** ℹ️ INFO
- **Recommendation:** console.error() may be intentional — review context.
- **Suggested Fix:** Remove console statement or use a structured logging library.

### src/app/page.tsx

- **Issue:** console.error() found in production code
- **Evidence:** Line 199: console.error("Leaderboard fetch failed:", err);
- **Confidence:** 100% ★★★★★
- **Risk:** ℹ️ INFO
- **Recommendation:** console.error() may be intentional — review context.
- **Suggested Fix:** Remove console statement or use a structured logging library.

### src/components/DownloadButton.tsx

- **Issue:** console.warn() found in production code
- **Evidence:** Line 183: console.warn("DownloadButton: could not inline image", img.src, e);
- **Confidence:** 100% ★★★★★
- **Risk:** ℹ️ INFO
- **Recommendation:** console.warn() may be intentional — review context.
- **Suggested Fix:** Remove console statement or use a structured logging library.

### src/components/DownloadButton.tsx

- **Issue:** console.warn() found in production code
- **Evidence:** Line 296: console.warn("DownloadButton: canvas hero-stat render failed", e);
- **Confidence:** 100% ★★★★★
- **Risk:** ℹ️ INFO
- **Recommendation:** console.warn() may be intentional — review context.
- **Suggested Fix:** Remove console statement or use a structured logging library.

### src/components/DownloadButton.tsx

- **Issue:** console.error() found in production code
- **Evidence:** Line 337: console.error("DevMon download failed:", err);
- **Confidence:** 100% ★★★★★
- **Risk:** ℹ️ INFO
- **Recommendation:** console.error() may be intentional — review context.
- **Suggested Fix:** Remove console statement or use a structured logging library.

### next.config.mjs

- **Issue:** CSP allows 'unsafe-inline' for scripts
- **Evidence:** Content-Security-Policy script-src includes 'unsafe-inline' which weakens XSS protection
- **Confidence:** 100% ★★★★★
- **Risk:** 🟡 MEDIUM
- **Recommendation:** Consider using strict CSP with nonces or hashes instead of 'unsafe-inline'.
- **Suggested Fix:** Replace 'unsafe-inline' with a nonce-based approach: script-src 'self' 'nonce-{random}'

### next.config.mjs

- **Issue:** CSP allows 'unsafe-eval' for scripts
- **Evidence:** Content-Security-Policy script-src includes 'unsafe-eval' which allows eval()
- **Confidence:** 100% ★★★★★
- **Risk:** ℹ️ INFO
- **Recommendation:** If possible, remove 'unsafe-eval'. Required by some frameworks/libraries like GSAP.
- **Suggested Fix:** Remove 'unsafe-eval' from script-src or document why it's needed in a comment.

### src/app/api/debug/route.ts

- **Issue:** Debug API endpoint should not be public in production
- **Evidence:** Route handler at src/app/api/debug/route.ts is a debug endpoint accessible via HTTP
- **Confidence:** 100% ★★★★★
- **Risk:** 🟠 HIGH
- **Recommendation:** Protect debug endpoints with authentication or disable in production.
- **Suggested Fix:** Add authentication check or environment guard: if (process.env.NODE_ENV === 'production') return NextResponse.json({ error: 'Not found' }, { status: 404 })

## Unused Dependencies

> ✅ No unused dependencies detected.

## Environment Variables

> ✅ No environment variable issues found.

## Documentation Issues

> ✅ No documentation issues found.

## Performance Findings

### src/app/card/page.tsx

- **Issue:** Large file (513 lines)
- **Evidence:** src/app/card/page.tsx has 513 lines of code
- **Confidence:** 100% ★★★★★
- **Risk:** 🔵 LOW
- **Recommendation:** Consider splitting into smaller, focused modules.
- **Suggested Fix:** Split src/app/card/page.tsx into multiple files grouped by concern.

### src/app/card/page.tsx

- **Issue:** Large component without dynamic import
- **Evidence:** src/app/card/page.tsx has 513 lines but no dynamic() or React.lazy() usage
- **Confidence:** 50% ★★☆☆☆
- **Risk:** 🔵 LOW
- **Recommendation:** Consider lazy loading sub-components if they are not needed on initial render.
- **Suggested Fix:** Use next/dynamic() for heavy sub-components: const HeavyComponent = dynamic(() => import('./HeavyComponent'))

### src/app/leaderboard/page.tsx

- **Issue:** Large component without dynamic import
- **Evidence:** src/app/leaderboard/page.tsx has 284 lines but no dynamic() or React.lazy() usage
- **Confidence:** 50% ★★☆☆☆
- **Risk:** 🔵 LOW
- **Recommendation:** Consider lazy loading sub-components if they are not needed on initial render.
- **Suggested Fix:** Use next/dynamic() for heavy sub-components: const HeavyComponent = dynamic(() => import('./HeavyComponent'))

### src/app/page.tsx

- **Issue:** Large file (960 lines)
- **Evidence:** src/app/page.tsx has 960 lines of code
- **Confidence:** 100% ★★★★★
- **Risk:** 🔵 LOW
- **Recommendation:** Consider splitting into smaller, focused modules.
- **Suggested Fix:** Split src/app/page.tsx into multiple files grouped by concern.

### src/app/page.tsx

- **Issue:** Large component without dynamic import
- **Evidence:** src/app/page.tsx has 960 lines but no dynamic() or React.lazy() usage
- **Confidence:** 50% ★★☆☆☆
- **Risk:** 🔵 LOW
- **Recommendation:** Consider lazy loading sub-components if they are not needed on initial render.
- **Suggested Fix:** Use next/dynamic() for heavy sub-components: const HeavyComponent = dynamic(() => import('./HeavyComponent'))

### src/app/privacy/page.tsx

- **Issue:** Large file (614 lines)
- **Evidence:** src/app/privacy/page.tsx has 614 lines of code
- **Confidence:** 100% ★★★★★
- **Risk:** 🔵 LOW
- **Recommendation:** Consider splitting into smaller, focused modules.
- **Suggested Fix:** Split src/app/privacy/page.tsx into multiple files grouped by concern.

### src/app/privacy/page.tsx

- **Issue:** Large component without dynamic import
- **Evidence:** src/app/privacy/page.tsx has 614 lines but no dynamic() or React.lazy() usage
- **Confidence:** 50% ★★☆☆☆
- **Risk:** 🔵 LOW
- **Recommendation:** Consider lazy loading sub-components if they are not needed on initial render.
- **Suggested Fix:** Use next/dynamic() for heavy sub-components: const HeavyComponent = dynamic(() => import('./HeavyComponent'))

### src/app/terms/page.tsx

- **Issue:** Large component without dynamic import
- **Evidence:** src/app/terms/page.tsx has 464 lines but no dynamic() or React.lazy() usage
- **Confidence:** 50% ★★☆☆☆
- **Risk:** 🔵 LOW
- **Recommendation:** Consider lazy loading sub-components if they are not needed on initial render.
- **Suggested Fix:** Use next/dynamic() for heavy sub-components: const HeavyComponent = dynamic(() => import('./HeavyComponent'))

### src/app/verify/[cardId]/page.tsx

- **Issue:** Large component without dynamic import
- **Evidence:** src/app/verify/[cardId]/page.tsx has 419 lines but no dynamic() or React.lazy() usage
- **Confidence:** 50% ★★☆☆☆
- **Risk:** 🔵 LOW
- **Recommendation:** Consider lazy loading sub-components if they are not needed on initial render.
- **Suggested Fix:** Use next/dynamic() for heavy sub-components: const HeavyComponent = dynamic(() => import('./HeavyComponent'))

### src/components/CardFace.tsx

- **Issue:** Large file (609 lines)
- **Evidence:** src/components/CardFace.tsx has 609 lines of code
- **Confidence:** 100% ★★★★★
- **Risk:** 🔵 LOW
- **Recommendation:** Consider splitting into smaller, focused modules.
- **Suggested Fix:** Split src/components/CardFace.tsx into multiple files grouped by concern.

### src/components/CardFace.tsx

- **Issue:** Large component without dynamic import
- **Evidence:** src/components/CardFace.tsx has 609 lines but no dynamic() or React.lazy() usage
- **Confidence:** 50% ★★☆☆☆
- **Risk:** 🔵 LOW
- **Recommendation:** Consider lazy loading sub-components if they are not needed on initial render.
- **Suggested Fix:** Use next/dynamic() for heavy sub-components: const HeavyComponent = dynamic(() => import('./HeavyComponent'))

### src/components/CardFaceMobile.tsx

- **Issue:** Large file (538 lines)
- **Evidence:** src/components/CardFaceMobile.tsx has 538 lines of code
- **Confidence:** 100% ★★★★★
- **Risk:** 🔵 LOW
- **Recommendation:** Consider splitting into smaller, focused modules.
- **Suggested Fix:** Split src/components/CardFaceMobile.tsx into multiple files grouped by concern.

### src/components/CardFaceMobile.tsx

- **Issue:** Large component without dynamic import
- **Evidence:** src/components/CardFaceMobile.tsx has 538 lines but no dynamic() or React.lazy() usage
- **Confidence:** 50% ★★☆☆☆
- **Risk:** 🔵 LOW
- **Recommendation:** Consider lazy loading sub-components if they are not needed on initial render.
- **Suggested Fix:** Use next/dynamic() for heavy sub-components: const HeavyComponent = dynamic(() => import('./HeavyComponent'))

### src/components/DownloadButton.tsx

- **Issue:** Large component without dynamic import
- **Evidence:** src/components/DownloadButton.tsx has 451 lines but no dynamic() or React.lazy() usage
- **Confidence:** 50% ★★☆☆☆
- **Risk:** 🔵 LOW
- **Recommendation:** Consider lazy loading sub-components if they are not needed on initial render.
- **Suggested Fix:** Use next/dynamic() for heavy sub-components: const HeavyComponent = dynamic(() => import('./HeavyComponent'))

### src/components/LinkedInShareModal.tsx

- **Issue:** Large component without dynamic import
- **Evidence:** src/components/LinkedInShareModal.tsx has 270 lines but no dynamic() or React.lazy() usage
- **Confidence:** 50% ★★☆☆☆
- **Risk:** 🔵 LOW
- **Recommendation:** Consider lazy loading sub-components if they are not needed on initial render.
- **Suggested Fix:** Use next/dynamic() for heavy sub-components: const HeavyComponent = dynamic(() => import('./HeavyComponent'))

## Supabase / Database Analysis

### Database Objects

| Object Type | Names |
|-------------|-------|
| Tables | cards |
| Functions/RPCs | upsert_card_v2 |
| Indexes | cards |
| Called RPCs | upsert_card_v2 |
| Active Migrations | 1 |
| Archived Migrations | 0 |

## Cleanup Priority

| Priority | File | Issue | Risk |
|----------|------|-------|------|
| 🟠 P1 | `src/app/api/debug/route.ts` | Debug API endpoint should not be public in production | 🟠 HIGH |
| 🟠 P1 | `.github/workflows/` | No CI/CD workflows configured | 🟠 HIGH |
| 🟠 P1 | `next.config.mjs` | CSP allows 'unsafe-inline' for scripts | 🟡 MEDIUM |
| 🟡 P2 | `scripts/migrate.js` | console.log() found in production code | 🔵 LOW |
| 🟡 P2 | `scripts/migrate.js` | console.log() found in production code | 🔵 LOW |
| 🟡 P2 | `scripts/migrate.js` | console.log() found in production code | 🔵 LOW |
| 🟡 P2 | `scripts/migrate.js` | console.log() found in production code | 🔵 LOW |
| 🟡 P2 | `scripts/migrate.js` | console.log() found in production code | 🔵 LOW |
| 🟡 P2 | `scripts/migrate.js` | console.log() found in production code | 🔵 LOW |
| 🟡 P2 | `scripts/migrate.js` | console.error() found in production code | ℹ️ INFO |
| 🟡 P2 | `scripts/migrate.js` | console.error() found in production code | ℹ️ INFO |
| 🟡 P2 | `scripts/migrate.js` | console.error() found in production code | ℹ️ INFO |
| 🟡 P2 | `scripts/migrate.js` | console.error() found in production code | ℹ️ INFO |
| 🟡 P2 | `scripts/migrate.js` | console.error() found in production code | ℹ️ INFO |
| 🟡 P2 | `scripts/migrate.js` | console.error() found in production code | ℹ️ INFO |

## Repository Health Checks

| Check | Status | Description |
|-------|--------|-------------|
| README.md | ✅ | Repository README |
| LICENSE | ✅ | License file |
| CONTRIBUTING.md | ✅ | Contribution guide |
| SECURITY.md | ✅ | Security policy |
| CODE_OF_CONDUCT.md | ✅ | Code of conduct |
| .gitignore | ✅ | Git ignore rules |
| .env.example | ✅ | Environment template |
| CI/CD Workflows | ❌ | Automated CI/CD |
| PR Template | ✅ | PR template |
| Issue Templates | ✅ | Issue templates |
| tsconfig.json | ✅ | TypeScript config |
| next.config.mjs | ✅ | Next.js config |
| tailwind.config.ts | ✅ | Tailwind config |
| Vitest Config | ✅ | Test runner config |
| ESLint Config | ✅ | Linter config |

## All Findings (73)

| # | File | Issue | Confidence | Risk |
|---|------|-------|------------|------|
| 1 | `src/app/card/error.tsx` | Client Component boundary | 100% | ✅ NONE |
| 2 | `src/app/card/layout.tsx` | Static metadata export (good practice) | 100% | ✅ NONE |
| 3 | `src/app/card/page.tsx` | Client Component boundary | 100% | ✅ NONE |
| 4 | `src/app/contact/page.tsx` | Static metadata export (good practice) | 100% | ✅ NONE |
| 5 | `src/app/error.tsx` | Client Component boundary | 100% | ✅ NONE |
| 6 | `src/app/faq/layout.tsx` | Static metadata export (good practice) | 100% | ✅ NONE |
| 7 | `src/app/faq/page.tsx` | Client Component boundary | 100% | ✅ NONE |
| 8 | `src/app/layout.tsx` | Static metadata export (good practice) | 100% | ✅ NONE |
| 9 | `src/app/layout.tsx` | Static viewport export (good practice) | 100% | ✅ NONE |
| 10 | `src/app/leaderboard/error.tsx` | Client Component boundary | 100% | ✅ NONE |
| 11 | `src/app/leaderboard/layout.tsx` | Static metadata export (good practice) | 100% | ✅ NONE |
| 12 | `src/app/leaderboard/page.tsx` | Client Component boundary | 100% | ✅ NONE |
| 13 | `src/app/page.tsx` | Client Component boundary | 100% | ✅ NONE |
| 14 | `src/app/privacy/page.tsx` | Static metadata export (good practice) | 100% | ✅ NONE |
| 15 | `src/app/providers.tsx` | Client Component boundary | 100% | ✅ NONE |
| 16 | `src/app/terms/page.tsx` | Static metadata export (good practice) | 100% | ✅ NONE |
| 17 | `src/app/verify/[cardId]/error.tsx` | Client Component boundary | 100% | ✅ NONE |
| 18 | `src/app/verify/[cardId]/page.tsx` | Client Component boundary | 100% | ✅ NONE |
| 19 | `src/app/api/auth/callback/route.ts` | API Route Handler: GET | 100% | ✅ NONE |
| 20 | `src/app/api/auth/signout/route.ts` | API Route Handler: POST | 100% | ✅ NONE |
| 21 | `src/app/api/card/route.ts` | API Route Handler: GET, POST | 100% | ✅ NONE |
| 22 | `src/app/api/debug/route.ts` | API Route Handler: GET | 100% | ✅ NONE |
| 23 | `src/app/api/health/route.ts` | API Route Handler: GET | 100% | ✅ NONE |
| 24 | `src/app/api/leaderboard/route.ts` | API Route Handler: GET | 100% | ✅ NONE |
| 25 | `src/app/api/og/route.tsx` | API Route Handler: GET | 100% | ✅ NONE |
| 26 | `src/app/api/verify/[cardId]/route.ts` | API Route Handler: GET | 100% | ✅ NONE |
| 27 | `.env` | Environment variable "SUPABASE_DB_PASSWORD" in .env but not in .env.example | 80% | 🔵 LOW |
| 28 | `src/app/globals.css` | Unused CSS variable "--elevation-1" | 80% | 🔵 LOW |
| 29 | `src/app/globals.css` | Unused CSS variable "--elevation-2" | 80% | 🔵 LOW |
| 30 | `src/app/globals.css` | Unused CSS variable "--orb-glow" | 80% | 🔵 LOW |
| 31 | `scripts/migrate.js` | console.log() found in production code | 100% | 🔵 LOW |
| 32 | `scripts/migrate.js` | console.log() found in production code | 100% | 🔵 LOW |
| 33 | `scripts/migrate.js` | console.log() found in production code | 100% | 🔵 LOW |
| 34 | `scripts/migrate.js` | console.log() found in production code | 100% | 🔵 LOW |
| 35 | `scripts/migrate.js` | console.log() found in production code | 100% | 🔵 LOW |
| 36 | `scripts/migrate.js` | console.log() found in production code | 100% | 🔵 LOW |
| 37 | `scripts/migrate.js` | console.error() found in production code | 100% | ℹ️ INFO |
| 38 | `scripts/migrate.js` | console.error() found in production code | 100% | ℹ️ INFO |
| 39 | `scripts/migrate.js` | console.error() found in production code | 100% | ℹ️ INFO |
| 40 | `scripts/migrate.js` | console.error() found in production code | 100% | ℹ️ INFO |
| 41 | `scripts/migrate.js` | console.error() found in production code | 100% | ℹ️ INFO |
| 42 | `scripts/migrate.js` | console.error() found in production code | 100% | ℹ️ INFO |
| 43 | `src/app/api/card/route.ts` | console.error() found in production code | 100% | ℹ️ INFO |
| 44 | `src/app/api/card/route.ts` | console.error() found in production code | 100% | ℹ️ INFO |
| 45 | `src/app/api/card/route.ts` | console.error() found in production code | 100% | ℹ️ INFO |
| 46 | `src/app/api/leaderboard/route.ts` | console.error() found in production code | 100% | ℹ️ INFO |
| 47 | `src/app/api/verify/[cardId]/route.ts` | console.error() found in production code | 100% | ℹ️ INFO |
| 48 | `src/app/api/verify/[cardId]/route.ts` | console.error() found in production code | 100% | ℹ️ INFO |
| 49 | `src/app/page.tsx` | console.error() found in production code | 100% | ℹ️ INFO |
| 50 | `src/components/DownloadButton.tsx` | console.warn() found in production code | 100% | ℹ️ INFO |
| 51 | `src/components/DownloadButton.tsx` | console.warn() found in production code | 100% | ℹ️ INFO |
| 52 | `src/components/DownloadButton.tsx` | console.error() found in production code | 100% | ℹ️ INFO |
| 53 | `next.config.mjs` | CSP allows 'unsafe-inline' for scripts | 100% | 🟡 MEDIUM |
| 54 | `next.config.mjs` | CSP allows 'unsafe-eval' for scripts | 100% | ℹ️ INFO |
| 55 | `src/app/api/debug/route.ts` | Debug API endpoint should not be public in production | 100% | 🟠 HIGH |
| 56 | `src/app/card/page.tsx` | Large file (513 lines) | 100% | 🔵 LOW |
| 57 | `src/app/card/page.tsx` | Large component without dynamic import | 50% | 🔵 LOW |
| 58 | `src/app/leaderboard/page.tsx` | Large component without dynamic import | 50% | 🔵 LOW |
| 59 | `src/app/page.tsx` | Large file (960 lines) | 100% | 🔵 LOW |
| 60 | `src/app/page.tsx` | Large component without dynamic import | 50% | 🔵 LOW |
| 61 | `src/app/privacy/page.tsx` | Large file (614 lines) | 100% | 🔵 LOW |
| 62 | `src/app/privacy/page.tsx` | Large component without dynamic import | 50% | 🔵 LOW |
| 63 | `src/app/terms/page.tsx` | Large component without dynamic import | 50% | 🔵 LOW |
| 64 | `src/app/verify/[cardId]/page.tsx` | Large component without dynamic import | 50% | 🔵 LOW |
| 65 | `src/components/CardFace.tsx` | Large file (609 lines) | 100% | 🔵 LOW |
| 66 | `src/components/CardFace.tsx` | Large component without dynamic import | 50% | 🔵 LOW |
| 67 | `src/components/CardFaceMobile.tsx` | Large file (538 lines) | 100% | 🔵 LOW |
| 68 | `src/components/CardFaceMobile.tsx` | Large component without dynamic import | 50% | 🔵 LOW |
| 69 | `src/components/DownloadButton.tsx` | Large component without dynamic import | 50% | 🔵 LOW |
| 70 | `src/components/LinkedInShareModal.tsx` | Large component without dynamic import | 50% | 🔵 LOW |
| 71 | `.github/workflows/` | No CI/CD workflows configured | 100% | 🟠 HIGH |
| 72 | `.github/CODEOWNERS` | No CODEOWNERS file | 100% | 🔵 LOW |
| 73 | `.github/FUNDING.yml` | No FUNDING.yml | 100% | ℹ️ INFO |

---

> **Report generated by DevMon Repository Analyzer v1.0.0**
> Run `node analyze-repo.js` to regenerate.
> Scanned 100 files in 0.3s.
