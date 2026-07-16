# Changelog

All notable changes to DevMon will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] — 2026-07-16

### Changed

- **Scoring engine v2.0.0**: Replaced v1 five-metric engine with a 15-metric normalization pipeline
  - 15 raw GitHub metrics → log/sqrt normalization curves → 15 intermediate components → 5 behavioural attributes
  - Component and attribute aggregation with configurable weights
  - Harmony bonus for balanced attribute profiles
  - Rarity score from weighted attribute sum + harmony bonus
- **12 developer classes**: Rule-based scoring with required/preferred attribute thresholds
- **10 signature moves**: Selected by top+second attribute pair, threshold-gated (default: "Novice Punch")
- **20 achievement tiers**: 4 tiers × 5 attributes + 3 special achievements (Grandmaster, Balanced Elite)
- **Hero stat**: Highest attribute highlighted with rank (Novice–Grandmaster)
- **40 flavor text templates**: 30 hype + 10 roast with variable interpolation
- **Debug mode**: Full scoring breakdown accessible via `?debug=true` query parameter
- **Engine versioning**: `ENGINE_VERSIONS` and `ENGINE_FLAGS` in `config/engine.ts`
- **Archetypes**: Builder, Collaborator, Architect, Creator, Maintainer, Explorer derived from attribute pairs

### Deprecated

- v1 five-metric scoring engine (Merge Force, Code Velocity, Problem Solving, Open Source, Consistency) — replaced by v2.0.0

### Removed

- Legacy `log2`-based normalization formulas
- Old `factor/max` normalization config format (replaced by `target/steepness/maxScore`)

## [1.0.0] — 2026-07-15

### Added

- Initial public release of DevMon
- GitHub OAuth authentication via Supabase Auth
- Five-metric scoring engine v1 (legacy: Merge Force, Code Velocity, Problem Solving, Open Source, Consistency)
- Twelve developer classes with rule-based scoring
- Five rarity tiers (Common, Rare, Epic, Legendary, Mythic) with percentile distribution
- HMAC-SHA-256 cryptographic credential verification
- Public verification URLs (`/verify/DM-XXXXXX`)
- Leaderboard with sorting and company filtering
- Flavor text generation (hype and roast tones)
- Signature move selection (rule-based moves)
- Hero stat highlighting
- PNG card export via html-to-image
- LinkedIn share integration
- Dynamic OG image generation
- Dark and light theme support
- Rate limiting via Upstash Redis
- DPDP Act 2023 compliance (India)
- Responsive card design (desktop and mobile)
