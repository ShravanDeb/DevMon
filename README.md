# DevMon

Your GitHub profile, reimagined as a collectible trading card.

Turn your real GitHub stats into a Pokémon-style card with game stats (POWER, SPEED, DEFENSE, MAGIC, LUCK), an imaginary creature class, a rarity tier, and a personalized flavor-text roast or compliment. Share it, compare it, battle it.

> **Not affiliated with GitHub, Nintendo, or The Pokémon Company.**
> No developer metrics were taken seriously in the making of this app.

## Features

- **GitHub OAuth** — sign in with read-only scopes (`read:user`, `public_repo`)
- **Stat Engine** — logarithmic-scaled 0-100 stats computed from your repos, commits, PRs, issues, languages, and stars
- **12 Creature Classes** — e.g. Bughiss (bug slayer), Lumsprite (night coder), Forkit (fork hoarder), Wraithink (commit necromancer)
- **5 Rarity Tiers** — Common → Rare → Epic → Legendary → Mythic (deliberately harsh distribution)
- **Flavor Text** — template-based roasts/compliments pulling real numbers and quirks from your profile
- **Download as PNG** — client-side via html-to-image
- **3D Card Tilt** — mouse-driven perspective transform on hover
- **Holographic Shimmer** — CSS gradient overlay animation
- **OG Image** — dynamic share preview via `@vercel/og`
- **Battle Mode** — compare two profiles side-by-side with stat breakdown and verdict
- **Leaderboard** — global ranking filterable by company and language

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) |
| Auth | NextAuth.js v4 with GitHub OAuth |
| Database | Supabase (Postgres) |
| Styling | Tailwind CSS |
| Card Render | HTML + Tailwind (pure DOM) |
| Download | html-to-image (client-side) |
| OG Images | @vercel/og (Satori) |
| Deployment | Vercel (free tier) |

## Prerequisites

- Node.js 18+
- A [GitHub OAuth App](https://github.com/settings/developers) (Homepage URL: `http://localhost:3000`, Callback URL: `http://localhost:3000/api/auth/callback/github`)
- A [Supabase](https://supabase.com) project (free tier)
- (Optional) A `BATTLE_GITHUB_TOKEN` for battle mode to look up other users' profiles

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
# NextAuth.js
AUTH_SECRET=<generate: openssl rand -base64 32>
AUTH_GITHUB_ID=your-github-oauth-client-id
AUTH_GITHUB_SECRET=your-github-oauth-client-secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Battle mode token (optional)
BATTLE_GITHUB_TOKEN=ghp_your-token-here
```

## Setup

```bash
# Install dependencies
npm install

# Set up the database
# Go to your Supabase dashboard → SQL Editor → paste and run supabase/schema.sql

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

Run `supabase/schema.sql` in your Supabase SQL editor. It creates:

- `profiles` — caches GitHub stats and generated cards (24h TTL)
- `card_count` — tracks total cards generated for the landing page counter
- `leaderboard` — stores cards for public ranking

## Deployment to Vercel

1. Push this repo to GitHub
2. Import into [Vercel](https://vercel.com/new)
3. Add all environment variables from `.env.local` in Vercel's project settings
4. Deploy — the app is free-tier compatible

### OG Image Route

The `/api/og` route generates dynamic preview images. When sharing on social media, use:

```
https://your-app.vercel.app/api/og?user=octocat
```

This route sets `Cache-Control: public, max-age=86400` so crawler re-fetches are free.

## Architecture Notes

- **Rate limiting**: GitHub GraphQL calls use the signed-in user's own OAuth token, so rate limits scale per-user, not globally
- **Caching**: Profile stats are cached in Supabase for 24h — repeated visits don't re-fetch from GitHub
- **No LLM costs**: Flavor text uses template-based generation with a large bank of templates — no paid API calls per request
- **Scoring module**: All stat/rarity/class logic lives in `src/lib/scoring.ts` (and related files) for easy tuning

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts   # NextAuth handler
│   │   ├── battle/route.ts                # Battle comparison
│   │   ├── card/route.ts                  # Card generation
│   │   ├── count/route.ts                 # Card counter
│   │   ├── leaderboard/route.ts           # Leaderboard CRUD
│   │   └── og/route.tsx                   # OG image generation
│   ├── battle/page.tsx                    # Battle mode UI
│   ├── card/page.tsx                      # Card result page
│   ├── leaderboard/page.tsx               # Leaderboard UI
│   ├── layout.tsx                         # Root layout
│   ├── page.tsx                           # Landing page
│   └── providers.tsx                      # NextAuth SessionProvider
├── components/
│   ├── CardFace.tsx                       # Main card component (3D tilt, shimmer)
│   ├── DownloadButton.tsx                 # PNG download via html-to-image
│   ├── RarityBadge.tsx                    # Rarity pill badge
│   └── StatBar.tsx                        # Individual stat bar
├── lib/
│   ├── auth.ts                            # NextAuth options/config
│   ├── classes.ts                         # Class assignment rules
│   ├── flavor-text.ts                     # Template bank for roasts/hype
│   ├── graphql.ts                         # GitHub GraphQL fetcher
│   ├── rarity.ts                          # Rarity score computation
│   ├── scoring.ts                         # Stat computation + card generation
│   └── supabase.ts                        # Supabase client
└── types/
    └── index.ts                           # TypeScript types and constants
```
