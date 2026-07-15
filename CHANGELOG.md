# Changelog

All notable changes to DevMon will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — 2026-07-15

### Added

- Initial public release of DevMon
- GitHub OAuth authentication via Supabase Auth
- Five-metric scoring engine (Merge Force, Code Velocity, Problem Solving, Open Source, Consistency)
- Twelve developer classes with rule-based scoring
- Five rarity tiers (Common, Rare, Epic, Legendary, Mythic) with percentile distribution
- HMAC-SHA-256 cryptographic credential verification
- Public verification URLs (`/verify/DM-XXXXXX`)
- Leaderboard with sorting and company filtering
- Flavor text generation (40 templates, hype and roast tones)
- Signature move selection (14 rule-based moves)
- Hero stat highlighting
- PNG card export via html-to-image
- LinkedIn share integration
- Dynamic OG image generation
- Dark and light theme support
- Rate limiting via Upstash Redis
- DPDP Act 2023 compliance (India)
- Responsive card design (desktop and mobile)
