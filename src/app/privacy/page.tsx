import type { Metadata } from "next";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for DevMon — how we handle your GitHub data.",
};

const sections = [
  { id: "data-collected", title: "Data We Collect" },
  { id: "how-we-use", title: "How We Use Your Data" },
  { id: "card-storage", title: "Card Data & Public Verification" },
  { id: "cookies", title: "Cookies & Local Storage" },
  { id: "third-parties", title: "Third-Party Services" },
  { id: "data-retention", title: "Data Retention" },
  { id: "your-rights", title: "Your Rights" },
  { id: "children", title: "Children's Privacy" },
  { id: "changes", title: "Changes to This Policy" },
  { id: "contact", title: "Contact" },
];

function TOC() {
  return (
    <nav className="hidden lg:block sticky top-24 w-56 shrink-0">
      <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-text-tertiary mb-4">
        On this page
      </p>
      <ul className="space-y-1">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="block text-[13px] text-text-tertiary hover:text-text-secondary transition-colors py-1"
            >
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-[20px] font-[600] text-text-primary mt-12 mb-4">
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[15px] leading-[1.8] text-text-secondary mb-4">
      {children}
    </p>
  );
}

function UList({ children }: { children: React.ReactNode }) {
  return (
    <ul className="list-disc list-inside text-[15px] leading-[1.8] text-text-secondary mb-4 space-y-1 ml-4">
      {children}
    </ul>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 max-w-5xl mx-auto px-6 py-24 w-full">
        <div className="flex gap-16">
          <TOC />

          <article className="flex-1 min-w-0">
            <div className="rounded-[14px] neu-raised-lg p-8 md:p-12">
              <h1 className="font-display text-[32px] font-[600] text-text-primary mb-2">
                Privacy Policy
              </h1>
              <p className="text-[13px] font-mono text-text-tertiary mb-8">
                Last updated: [Date]
              </p>

              <section id="data-collected">
                <H2>Data We Collect</H2>
                <P>
                  When you sign in with GitHub OAuth, DevMon accesses the
                  following information from your public GitHub profile:
                </P>
                <UList>
                  <li>
                    <strong className="text-text-primary">Identity data:</strong>{" "}
                    GitHub username, display name, avatar URL, bio, and
                    company field.
                  </li>
                  <li>
                    <strong className="text-text-primary">
                      Contribution data:
                    </strong>{" "}
                    Total commits, recent commits, commit streak (current
                    and longest), and commit hour distribution.
                  </li>
                  <li>
                    <strong className="text-text-primary">Repository data:</strong>{" "}
                    Total repositories, original repos, forked repos,
                    archived repos, zero-star repos, total stars, total
                    forks, and languages used.
                  </li>
                  <li>
                    <strong className="text-text-primary">Activity data:</strong>{" "}
                    Merged pull requests, closed issues, repositories
                    contributed to, and organizations.
                  </li>
                </UList>
                <P>
                  We do not access private repositories, email addresses,
                  or any data beyond what the GitHub OAuth scope provides.
                </P>
              </section>

              <div className="neu-divider my-8" />

              <section id="how-we-use">
                <H2>How We Use Your Data</H2>
                <P>
                  Your GitHub data is used solely to:
                </P>
                <UList>
                  <li>
                    Compute the five stat categories (Merge Force, Code
                    Velocity, Problem Solving, Open Source, Consistency)
                    that appear on your card.
                  </li>
                  <li>
                    Determine your rarity tier, developer class, flavor
                    text, achievements, and signature move.
                  </li>
                  <li>
                    Render the card image for you to download and share.
                  </li>
                  <li>
                    Display your entry on the public leaderboard (if you
                    choose to submit it).
                  </li>
                </UList>
                <P>
                  We do not sell, rent, or share your GitHub data with any
                  third parties for advertising or analytics purposes.
                </P>
              </section>

              <div className="neu-divider my-8" />

              <section id="card-storage">
                <H2>Card Data &amp; Public Verification</H2>
                <P>
                  When you generate a card, the resulting card data is
                  stored in our database and associated with a unique card
                  ID (e.g., DM-XXXXXX). This card ID forms the URL of your
                  public verification page (/verify/DM-XXXXXX).
                </P>
                <P>
                  <strong className="text-text-primary">
                    Verification pages are public.
                  </strong>{" "}
                  Anyone with the link can view the card and its associated
                  stats — no login required. This is by design, as
                  verification links exist so you can prove your card is
                  authentic.
                </P>
                <P>
                  The stored card data includes your GitHub username,
                  display name, avatar, computed stats, rarity, class,
                  flavor text, and a cryptographic signature. It does not
                  include your GitHub access token.
                </P>
              </section>

              <div className="neu-divider my-8" />

              <section id="cookies">
                <H2>Cookies &amp; Local Storage</H2>
                <P>
                  DevMon uses the following cookies and local storage:
                </P>
                <UList>
                  <li>
                    <strong className="text-text-primary">
                      Authentication cookies:
                    </strong>{" "}
                    Supabase Auth sets session cookies to keep you signed
                    in. These are functional cookies necessary for the
                    service to work — they are not used for tracking or
                    analytics.
                  </li>
                  <li>
                    <strong className="text-text-primary">
                      Theme preference:
                    </strong>{" "}
                    Your light/dark mode preference is stored in your
                    browser&apos;s localStorage. This never leaves your device
                    and is not sent to any server.
                  </li>
                </UList>
                <P>
                  DevMon does not use Google Analytics, advertising
                  cookies, or any third-party tracking scripts. If we add
                  analytics in the future, this policy will be updated
                  accordingly.
                </P>
              </section>

              <div className="neu-divider my-8" />

              <section id="third-parties">
                <H2>Third-Party Services</H2>
                <P>DevMon uses the following third-party services:</P>
                <UList>
                  <li>
                    <strong className="text-text-primary">GitHub:</strong>{" "}
                    Used for OAuth authentication and fetching your public
                    profile data via the GitHub API.
                  </li>
                  <li>
                    <strong className="text-text-primary">Supabase:</strong>{" "}
                    Provides authentication, database storage, and row-level
                    security. Hosted on AWS infrastructure.
                  </li>
                  <li>
                    <strong className="text-text-primary">Vercel:</strong>{" "}
                    Hosts the DevMon application. Vercel may collect
                    standard server logs (IP addresses, request times) for
                    operational purposes.
                  </li>
                </UList>
                <P>
                  We do not sell or share your personal data with any other
                  third parties.
                </P>
              </section>

              <div className="neu-divider my-8" />

              <section id="data-retention">
                <H2>Data Retention</H2>
                <P>
                  Your card data is retained indefinitely unless you request
                  deletion. GitHub OAuth tokens are session-based and are
                  not stored after you sign out.
                </P>
                <P>
                  If DevMon is discontinued, all stored card data will be
                  deleted within 30 days of the shutdown announcement.
                </P>
              </section>

              <div className="neu-divider my-8" />

              <section id="your-rights">
                <H2>Your Rights</H2>
                <P>You have the right to:</P>
                <UList>
                  <li>
                    <strong className="text-text-primary">
                      Revoke OAuth access:
                    </strong>{" "}
                    You can revoke DevMon&apos;s access to your GitHub data at
                    any time by going to{" "}
                    <a
                      href="https://github.com/settings/applications"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      GitHub Settings → Applications
                    </a>{" "}
                    and removing DevMon. This prevents future data access
                    but does not delete your existing card.
                  </li>
                  <li>
                    <strong className="text-text-primary">
                      Request data deletion:
                    </strong>{" "}
                    To delete your card data and remove your leaderboard
                    entry, contact us at{" "}
                    <a
                      href="mailto:[support@email.com]"
                      className="text-accent hover:underline"
                    >
                      [support@email.com]
                    </a>{" "}
                    with your GitHub username. We will process deletion
                    requests within 30 days.
                  </li>
                </UList>
              </section>

              <div className="neu-divider my-8" />

              <section id="children">
                <H2>Children&apos;s Privacy</H2>
                <P>
                  DevMon is not directed at children under 13 (or the
                  applicable age of digital consent in your jurisdiction).
                  We do not knowingly collect personal information from
                  children.
                </P>
              </section>

              <div className="neu-divider my-8" />

              <section id="changes">
                <H2>Changes to This Policy</H2>
                <P>
                  We may update this Privacy Policy from time to time. When
                  we do, we will update the &ldquo;Last updated&rdquo; date at the top
                  of this page. Significant changes will be communicated
                  through a notice on the DevMon website.
                </P>
              </section>

              <div className="neu-divider my-8" />

              <section id="contact">
                <H2>Contact</H2>
                <P>
                  Questions about this policy or want to request data
                  deletion? Reach out at{" "}
                  <a
                    href="mailto:[support@email.com]"
                    className="text-accent hover:underline"
                  >
                    [support@email.com]
                  </a>
                  .
                </P>
              </section>
            </div>
          </article>
        </div>
      </div>

      <Footer />
    </main>
  );
}
