# Contributing to DevMon

Thank you for your interest in contributing to DevMon. Every contribution — whether a bug fix, a new feature, a documentation improvement, or a question that helps us identify a gap — makes the project better for the entire community.

DevMon is an open-source developer credential platform licensed under [AGPL-3.0](./LICENSE). It reads public GitHub activity, computes gameplay-style statistics, and produces a cryptographically signed credential. Community contributions help us improve the scoring engine, expand developer classes, strengthen security, and make the platform more useful for developers everywhere.

This guide explains how to contribute effectively while maintaining the project's engineering standards. For detailed technical documentation, see [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md).

---

## Before You Contribute

1. **Read the documentation.** Start with [README.md](./README.md) for a project overview, then [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details, and [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for development setup and conventions.

2. **Search existing issues.** Check [open issues](https://github.com/ShravanDeb/DevMon/issues) and [closed issues](https://github.com/ShravanDeb/DevMon/issues?q=is%3Aissue+is%3Aclosed) before opening a new one.

3. **Discuss large changes before implementation.** If you plan to modify the scoring engine, add new API endpoints, change the database schema, or alter the authentication flow, open an issue first to discuss the approach.

4. **Keep pull requests focused.** A pull request that solves one logical problem is easier to review, easier to test, and less likely to introduce regressions.

---

## Ways to Contribute

| Type | Description |
|------|-------------|
| **Bug reports** | Identify and document issues with clear reproduction steps |
| **Bug fixes** | Fix existing issues with minimal, focused changes |
| **Feature requests** | Propose new functionality with a clear problem statement |
| **Documentation** | Fix errors, fill gaps, add examples, clarify explanations |
| **Accessibility** | Improve keyboard navigation, screen reader support, color contrast |
| **Performance** | Reduce bundle size, improve rendering, optimize API responses |
| **Security** | Identify and fix vulnerabilities, strengthen validation |
| **Tests** | Add missing test coverage for algorithms, routes, or helpers |

Not sure where to start? Look for issues labeled [`good first issue`](https://github.com/ShravanDeb/DevMon/labels/good%20first%20issue) or [`help wanted`](https://github.com/ShravanDeb/DevMon/labels/help%20wanted).

---

## Development Setup

DevMon requires Node.js 18+, npm 9+, and a GitHub account for OAuth. Full setup instructions are in [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) Section 5.

Quick start:

```bash
git clone https://github.com/ShravanDeb/DevMon.git
cd DevMon
npm install
cp .env.example .env.local
```

Edit `.env.local` with your Supabase, GitHub, and Upstash credentials. See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) Section 6 for the complete environment variable reference.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Before submitting a pull request, run the full verification suite:

```bash
npm run lint        # ESLint with next/core-web-vitals
npx tsc --noEmit    # TypeScript type checking
npm test            # Vitest unit tests (all 6 test files)
npm run build       # Production build
```

All four must pass without errors.

---

## Coding Standards

For the complete coding standards reference — including TypeScript conventions, React patterns, Next.js App Router conventions, naming conventions, folder structure, accessibility requirements, and security practices — see [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) Section 8.

Key rules:

- **Strict TypeScript** — no `any`, use `unknown` when the type is truly unknown
- **`@/` path aliases** — use `@/lib/scoring` instead of relative paths
- **Server Components by default** — add `"use client"` only when hooks or browser APIs are needed
- **Functional components only** — no class components
- **Tailwind CSS utility classes** for all styling
- **No inline styles** except for dynamic values

---

## Pull Request Guidelines

### Before Submitting

Every pull request should:

- [ ] Solve one logical problem (unrelated fixes go in separate PRs)
- [ ] Include a clear description of what changed and why
- [ ] Pass `npm run lint` with zero errors
- [ ] Pass `npx tsc --noEmit` without TypeScript errors
- [ ] Pass `npm test` (all 6 test files)
- [ ] Pass `npm run build` without errors
- [ ] Preserve existing functionality (no regressions)
- [ ] Include new tests if adding business logic
- [ ] Update documentation if changing APIs, environment variables, or architecture
- [ ] Include screenshots or screen recordings for UI changes
- [ ] Reflect environment variable changes in `.env.example`
- [ ] Reflect database schema changes in `supabase/full_migration.sql`

### PR Description

A good PR description includes:

- **What** the change does
- **Why** the change is needed
- **How** the change works (if non-obvious)
- **Screenshots** for UI changes
- **Testing** steps the reviewer can follow
- **Breaking changes** (if any) and migration notes

### Branch Naming

```
feat/add-team-cards
fix/leaderboard-pagination
docs/update-api-reference
refactor/scoring-pipeline
test/verification-routes
```

---

## Commit Messages

DevMon uses [Conventional Commits](https://www.conventionalcommits.org/) as a recommendation, not a strict requirement.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Use for |
|------|---------|
| `feat` | New features |
| `fix` | Bug fixes |
| `docs` | Documentation changes |
| `refactor` | Code restructuring without behavior change |
| `test` | Adding or updating tests |
| `chore` | Build process, dependencies, tooling |
| `perf` | Performance improvements |

### Examples

```
feat(leaderboard): add company filter dropdown
fix(card): prevent duplicate generation on rapid clicks
docs(readme): update deployment section for Netlify
refactor(scoring): extract normalization into separate module
test(verification): add HMAC signature validation tests
```

### Rules

- Use imperative mood ("add feature" not "added feature")
- Keep the description under 72 characters
- Reference issue numbers in the footer when applicable (`Closes #42`)

---

## Code Review

All pull requests require review before merging. The project maintainer reviews each PR for correctness, quality, tests, security, performance, and documentation.

### Addressing Feedback

- Respond to every comment, even if just to acknowledge it
- Push additional commits to address feedback (do not force-push during review)
- If you disagree with feedback, explain your reasoning — discussion is expected

---

## Reporting Bugs

Search [existing issues](https://github.com/ShravanDeb/DevMon/issues) first, then open a new issue using the bug report template. Include:

- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (browser, OS, Node.js version)

---

## Feature Requests

Open a new issue with the title starting with `[Feature]`. Include:

- The problem you're trying to solve
- Your proposed solution
- Alternatives you considered
- The benefit to users

---

## Security Vulnerabilities

**Do not open a public GitHub issue for security vulnerabilities.**

Report responsibly via email:

- **Email:** shravandeb@gmail.com
- **Subject:** [Security] Brief description

See [SECURITY.md](./SECURITY.md) for the full security policy.

---

## Testing

For the complete testing guide — including when to write tests, how to run them, and manual verification checklists — see [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) Section 14.

```bash
npm test            # Run all tests
npm run test:watch  # Watch mode during development
```

**Always write tests when:**

- Adding new business logic (scoring functions, utilities, validators)
- Fixing a bug (write a regression test)

---

## Licensing

DevMon is licensed under [AGPL-3.0-or-later](./LICENSE). By submitting a pull request, you confirm that:

1. You have the right to contribute the code under AGPL-3.0
2. Your contributions will be distributed under AGPL-3.0
3. You retain copyright to your own contributions

If your contribution includes code from another project, ensure the original license is compatible with AGPL-3.0 and include the original license notice.

---

## Trademark Notice

Contributing code to DevMon does not grant you any rights to use the DevMon name, logo, card artwork, crowns, icons, visual identity, or other trademarks outside the terms described in [TRADEMARKS.md](./TRADEMARKS.md).

---

## Community Standards

All contributors are expected to abide by the [Code of Conduct](./CODE_OF_CONDUCT.md). Report instances of unacceptable behavior to shravandeb@gmail.com.

---

## Thank You

Contributions of all kinds make DevMon better. Whether you are fixing a typo, reporting a bug, improving documentation, or implementing a new feature, your work is appreciated.

Thank you for helping build a better credential platform for the developer community.
