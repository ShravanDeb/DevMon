# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x   | Yes       |

## Reporting a Vulnerability

If you discover a security vulnerability in DevMon, please report it responsibly. **Do not open a public GitHub issue for security vulnerabilities.**

### How to Report

Email: shravandeb@gmail.com

Include:

- A description of the vulnerability
- Steps to reproduce
- Affected version
- Potential impact
- Any suggested fix (if applicable)

### What to Expect

- **Acknowledgment:** Within 48 hours of your report.
- **Assessment:** We will evaluate the severity and impact of the vulnerability.
- **Resolution:** We will work on a fix and coordinate disclosure with you.
- **Credit:** With your permission, we will credit you in the release notes.

### Scope

The following are in scope for security reports:

- Authentication bypass
- Authorization issues (RLS bypass, privilege escalation)
- Injection vulnerabilities (SQL, XSS, CSRF)
- Cryptographic weaknesses in HMAC signing
- Data exposure or leakage
- Rate limiting bypass
- Remote code execution

The following are out of scope:

- Denial of service (rate limiting is already applied)
- Social engineering attacks
- Third-party services (Supabase, GitHub, Upstash, Netlify)

## Security Measures

DevMon implements the following security measures:

- **Authentication:** GitHub OAuth with read-only scope via Supabase Auth
- **Cryptographic verification:** HMAC-SHA-256 signed credentials
- **Row-level security:** Database access controlled by RLS policies
- **Rate limiting:** Sliding window rate limiting via Upstash Redis
- **Input validation:** Zod schemas on all API inputs
- **Security headers:** CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- **No tracking:** No analytics, no third-party scripts, no fingerprinting

See [ARCHITECTURE.md](./ARCHITECTURE.md) Section 12 for the full security architecture.

## Contact

**Security contact:** shravandeb@gmail.com
