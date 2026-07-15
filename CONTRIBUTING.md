# Contributing to DevMon

Thank you for your interest in contributing to DevMon. Every contribution — whether a bug fix, a new feature, a documentation improvement, or a question that helps us identify a gap — makes the project better for the entire community.

DevMon is an open-source developer credential platform licensed under [AGPL-3.0](./LICENSE). It reads public GitHub activity, computes gameplay-style statistics, and produces a cryptographically signed credential. Community contributions help us improve the scoring engine, expand developer classes, strengthen security, and make the platform more useful for developers everywhere.

This guide explains how to contribute effectively while maintaining the project's engineering standards.

---

## Table of Contents

- [Before You Contribute](#before-you-contribute)
- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Commit Messages](#commit-messages)
- [Code Review](#code-review)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)
- [Security Vulnerabilities](#security-vulnerabilities)
- [Documentation Contributions](#documentation-contributions)
- [Testing Requirements](#testing-requirements)
- [Licensing](#licensing)
- [Trademark Notice](#trademark-notice)
- [Community Standards](#community-standards)

---

## Before You Contribute

Before opening an issue or submitting a pull request:

1. **Read the documentation.** Start with [README.md](./README.md) for a project overview, then [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details, and [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for development setup and conventions.

2. **Search existing issues.** Check [open issues](https://github.com/ShravanDeb/DevMon/issues) and [closed issues](https://github.com/ShravanDeb/DevMon/issues?q=is%3Aissue+is%3Aclosed) before opening a new one. Your question or report may already be addressed.

3. **Discuss large changes before implementation.** If you plan to modify the scoring engine, add new API endpoints, change the database schema, or alter the authentication flow, open an issue first to discuss the approach. This prevents wasted effort on changes that may not align with the project's direction.

4. **Keep pull requests focused.** A pull request that solves one logical problem is easier to review, easier to test, and less likely to introduce regressions. If you find an unrelated issue while working on a feature, submit it as a separate pull request.

---

## Ways to Contribute

DevMon welcomes contributions in many forms:

| Type | Description |
|------|-------------|
| **Bug reports** | Identify and document issues with clear reproduction steps |
| **Bug fixes** | Fix existing issues with minimal, focused changes |
| **Feature requests** | Propose new functionality with a clear problem statement |
| **Documentation improvements** | Fix errors, fill gaps, add examples, clarify explanations |
| **Accessibility improvements** | Improve keyboard navigation, screen reader support, color contrast |
| **Performance optimizations** | Reduce bundle size, improve rendering, optimize API responses |
| **Security improvements** | Identify and fix vulnerabilities, strengthen validation |
| **Refactoring** | Improve code structure without changing behavior |
| **Tests** | Add missing test coverage for algorithms, routes, or helpers |
| **Design improvements** | Enhance UI consistency, responsiveness, or visual polish |
| **Developer experience improvements** | Improve tooling, scripts, error messages, or setup process |

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

DevMon follows consistent conventions across the codebase. Deviating from these conventions makes reviews slower and increases the risk of inconsistencies.

### TypeScript

- **Strict mode** is enabled. No `any` — use `unknown` when the type is truly unknown.
- **Interface over type** for object shapes (project convention).
- **Path alias:** Use `@/` imports (`@/lib/scoring`) instead of relative paths (`../../lib/scoring`).
- **No unused imports or variables.** ESLint will catch these.

### React

- **Server Components** by default. Add `"use client"` only when the component uses hooks, browser APIs, or animations.
- **Functional components only.** No class components.
- **Props interfaces** defined above the component, exported when reused.

### Next.js

- **App Router** (`src/app/` directory). No `getServerSideProps` or `getStaticProps`.
- **Route Handlers** for API routes. Every API route must include `export const dynamic = "force-dynamic"` and `const NO_STORE = { "Cache-Control": "no-store" } as const`.
- **Error boundaries** via `error.tsx` files in each route directory.

### Naming Conventions

| Category | Convention | Example |
|----------|-----------|---------|
| Components | PascalCase | `CardFace.tsx`, `DownloadButton.tsx` |
| Pages | `page.tsx` inside kebab-case directory | `src/app/card/page.tsx` |
| API routes | `route.ts` or `route.tsx` | `src/app/api/card/route.ts` |
| Lib modules | kebab-case | `scoring.ts`, `rate-limit.ts`, `hero-stat.ts` |
| Types | PascalCase | `RawGitHubStats`, `CardStats`, `ClassName` |
| Constants | PascalCase | `RARITY_COLORS`, `STAT_LABELS` |
| Environment variables | UPPER_SNAKE_CASE | `SUPABASE_SERVICE_ROLE_KEY` |

### Folder Conventions

| Directory | Contents |
|-----------|----------|
| `src/app/` | Pages and API routes only |
| `src/components/` | Shared UI components used across pages |
| `src/lib/` | Business logic, utilities, third-party integrations |
| `src/types/` | TypeScript types and constants |
| `src/__tests__/` | Unit tests |

### Accessibility

- Use semantic HTML (`<button>`, `<nav>`, `<main>`, `<footer>`).
- Add `aria-label` to icon-only buttons.
- Ensure all interactive elements are keyboard-focusable.
- Maintain WCAG AA color contrast ratios.

### Performance

- No premature optimization — measure first.
- Use Next.js `<Image>` for GitHub avatars.
- Client-side PNG export via `html-to-image` (no server rendering).
- GSAP animations use hardware-accelerated `transform` and `opacity`.

### Security

- Never commit `.env.local` or expose secrets in client-side code.
- Validate all API inputs with Zod schemas.
- Apply rate limiting on write endpoints.
- Never trust client-provided signatures — verify server-side.

### Code Formatting

- Use the project's existing formatting style.
- No inline styles except for dynamic values.
- Tailwind CSS utility classes for all styling.
- Import order: React/Next.js, third-party, `@/` aliases, relative.

### Linting

```bash
npm run lint        # Must pass with zero errors
```

ESLint is configured with `next/core-web-vitals` and `next/typescript`. All new code must pass linting.

### Documentation

- Update [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) if your change affects development setup, architecture, or API behavior.
- Update [README.md](./README.md) if your change affects features, installation, or usage.
- Add JSDoc-style comments only for non-obvious logic. Do not comment on obvious code.

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

Use descriptive branch names:

```
feat/add-team-cards
fix/leaderboard-pagination
docs/update-api-reference
refactor/scoring-pipeline
test/verification-routes
```

---

## Commit Messages

DevMon uses [Conventional Commits](https://www.conventionalcommits.org/) as a recommendation, not a strict requirement. The goal is clear, scannable commit history.

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
| `style` | Formatting, missing semicolons, no code change |
| `refactor` | Code restructuring without behavior change |
| `test` | Adding or updating tests |
| `chore` | Build process, dependencies, tooling |
| `perf` | Performance improvements |
| `ci` | CI/CD configuration changes |

### Examples

```
feat(leaderboard): add company filter dropdown
fix(card): prevent duplicate generation on rapid clicks
docs(readme): update deployment section for Netlify
refactor(scoring): extract merge force into separate module
test(verification): add HMAC signature validation tests
chore(deps): update next to 14.2.5
```

### Rules

- Use imperative mood in the description ("add feature" not "added feature")
- Keep the description under 72 characters
- Use lowercase for the description
- Reference issue numbers in the footer when applicable (`Closes #42`)

---

## Code Review

### How Reviews Work

All pull requests require review before merging. The project maintainer reviews each PR for:

1. **Correctness** — Does the code do what it claims?
2. **Quality** — Does it follow the coding standards?
3. **Tests** — Are new behaviors covered by tests?
4. **Security** — Does it introduce any vulnerabilities?
5. **Performance** — Does it affect rendering or API response times?
6. **Documentation** — Are relevant docs updated?

### Expected Review Quality

Reviews focus on substance, not style. Reviewers will:

- Explain why a change is suggested, not just what to change
- Distinguish between blocking issues and suggestions
- Acknowledge what the PR does well
- Ask questions when intent is unclear

### Constructive Feedback

- Suggest alternatives when requesting changes
- Reference documentation or existing patterns when applicable
- Prioritize feedback (blocking vs. non-blocking)
- Be specific about what needs to change and why

### Addressing Feedback

- Respond to every comment, even if just to acknowledge it
- Push additional commits to address feedback (do not force-push during review)
- If you disagree with feedback, explain your reasoning — discussion is expected
- Mark resolved conversations as resolved

---

## Reporting Bugs

### Before Reporting

1. Search [existing issues](https://github.com/ShravanDeb/DevMon/issues) to check if the bug has already been reported.
2. Try reproducing the bug on the latest version.
3. Check the [FAQ](https://dev-mon.netlify.app/faq) for known issues.

### Bug Report Template

Open a new issue with the following structure:

```markdown
## Description

A clear and concise description of the bug.

## Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior

What you expected to happen.

## Actual Behavior

What actually happened.

## Screenshots

If applicable, add screenshots to help explain the problem.

## Environment

- **Browser:** Chrome 120, Firefox 121, Safari 17, etc.
- **Operating System:** Windows 11, macOS 14, Ubuntu 22.04, etc.
- **Node.js version:** (if relevant)
- **npm version:** (if relevant)
- **DevMon version:** (commit hash or release version)
```

### Tips

- Include the exact error message from the browser console or server logs.
- Specify whether the bug occurs in development, production, or both.
- Note any environment variables or configurations that might be relevant.

---

## Feature Requests

Feature requests are welcome. Before submitting one:

1. **Explain the problem.** What are you trying to do? What is the current limitation?
2. **Describe your proposed solution.** How would the feature work?
3. **Describe alternatives you considered.** What other approaches did you think about?
4. **Explain the benefit.** How does this feature improve DevMon for users?

Open a new issue with the title starting with `[Feature]`:

```markdown
[Feature] Add export to PDF format

## Problem

I want to share my DevMon card in professional documents, but PNG is the only export format. PDF would be more suitable for resumes and reports.

## Proposed Solution

Add a "Download as PDF" button alongside the existing PNG download. Use a client-side PDF library to generate the PDF from the card DOM node.

## Alternatives Considered

- Hosting a server-side PDF generator (adds complexity and cost)
- Using a third-party PDF API (introduces a dependency and privacy concerns)

## Benefit

Developers can share their credentials in a format suitable for professional contexts.
```

---

## Security Vulnerabilities

**Do not open a public GitHub issue for security vulnerabilities.**

If you discover a security vulnerability, please report it responsibly via email:

- **Email:** shravandeb@gmail.com
- **Subject:** [Security] Brief description of the vulnerability

Include in your report:

- Description of the vulnerability
- Steps to reproduce
- Affected version
- Potential impact
- Suggested fix (if applicable)

See [SECURITY.md](./SECURITY.md) for the full security policy, including scope, response timeline, and supported versions.

### What to Expect

- **Acknowledgment** within 48 hours
- **Assessment** of severity and impact
- **Resolution** with coordinated disclosure
- **Credit** in release notes (with your permission)

---

## Documentation Contributions

Documentation improvements are valuable and welcome. Areas where contributions help:

| Document | Current State | How to Improve |
|----------|--------------|----------------|
| [README.md](./README.md) | Project overview, quick start | Add screenshots, clarify setup steps, fix typos |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Technical specification | Add diagrams, clarify algorithms, document edge cases |
| [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) | Contributor handbook | Add examples, fill gaps, update outdated sections |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | This file | Improve clarity, add examples, fix outdated information |
| [SECURITY.md](./SECURITY.md) | Security policy | Add details, update scope, clarify process |

Other documentation contributions:

- **API documentation** — Improve endpoint descriptions, add request/response examples
- **Code comments** — Add comments for non-obvious logic (do not comment on obvious code)
- **Examples** — Create usage examples for the scoring engine, verification system, or API
- **Tutorials** — Write guides for common tasks (setting up a dev environment, adding a new developer class)

---

## Testing Requirements

### Unit Tests

All business logic in `src/lib/` should have unit tests in `src/__tests__/`. The current test suite covers:

| Test File | Coverage |
|-----------|----------|
| `scoring.test.ts` | Scoring algorithms, rarity calculation, card generation |
| `verification.test.ts` | Card ID format, HMAC signing, uniqueness |
| `validation.test.ts` | Zod schema validation |
| `card.test.ts` | Card API route (POST/GET) |
| `verify.test.ts` | Verification API route |
| `auth-helpers.test.ts` | Session extraction |

### When to Write Tests

- **Always:** When adding new business logic (scoring functions, utilities, validators)
- **Always:** When fixing a bug (write a regression test)
- **Recommended:** When modifying API routes
- **Optional:** When modifying UI components (no component testing framework is configured)

### Running Tests

```bash
npm test            # Run all tests once
npm run test:watch  # Run in watch mode during development
```

### Integration Tests

Integration tests are not yet implemented. The `.gitignore` references Playwright, indicating intent, but it is not installed. If you add integration tests, use Playwright.

### Regression Testing

After making changes, verify:

1. Card generation works end-to-end (sign in, generate, download)
2. Leaderboard displays correctly
3. Verification page loads and shows correct data
4. Dark and light themes render properly
5. Mobile layout is not broken

### Manual Verification

Before submitting a PR, manually test:

- [ ] Landing page loads correctly
- [ ] OAuth flow works (sign in and sign out)
- [ ] Card generation completes without errors
- [ ] Card displays correct stats, class, and rarity
- [ ] PNG download produces a valid image
- [ ] Leaderboard shows entries with correct sorting
- [ ] Verification page loads for a generated card
- [ ] FAQ, Terms, Privacy, and Contact pages render correctly
- [ ] Footer links work

---

## Licensing

### AGPL-3.0

DevMon is licensed under the [GNU Affero General Public License, Version 3.0](./LICENSE) (AGPL-3.0-or-later). This means:

- You may use, modify, and distribute the code under the AGPL-3.0 terms.
- If you run a modified version over a network, you must provide the Corresponding Source to users.
- You must include the original copyright notice and license in any distribution.

### Contribution License

By submitting a pull request, you confirm that:

1. You have the right to contribute the code under the project's AGPL-3.0 license.
2. Your contributions will be distributed under AGPL-3.0 as part of the DevMon project.
3. You retain copyright to your own contributions.

### No CLA or DCO

DevMon does not use a Contributor License Agreement (CLA) or Developer Certificate of Origin (DCO). Contributions are made under the project's existing AGPL-3.0 license. If a CLA or DCO is adopted in the future, this section will be updated.

### Third-Party Code

If your contribution includes code from another project:

- Ensure the original project's license is compatible with AGPL-3.0
- Include the original license and copyright notice
- Note the source in your PR description

---

## Trademark Notice

Contributing code to DevMon does not grant you any rights to use the DevMon name, logo, card artwork, crowns, icons, visual identity, or other trademarks outside the terms described in [TRADEMARKS.md](./TRADEMARKS.md).

The DevMon Marks are trademarks of Shravan Deb and are **not** licensed under AGPL-3.0. The AGPL-3.0 license covers the software code only.

If your contribution includes use of the DevMon Marks beyond what is permitted in [TRADEMARKS.md](./TRADEMARKS.md), the pull request will not be accepted until the trademark usage is resolved.

---

## Community Standards

All contributors are expected to abide by the [Code of Conduct](./CODE_OF_CONDUCT.md). By participating in this project, you agree to:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community

Report instances of unacceptable behavior to shravandeb@gmail.com.

---

## Thank You

Contributions of all kinds make DevMon better. Whether you are fixing a typo, reporting a bug, improving documentation, or implementing a new feature, your work is appreciated.

Thank you for helping build a better credential platform for the developer community.
