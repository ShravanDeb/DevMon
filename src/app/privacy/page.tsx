import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { LegalToc, SectionHeading, Paragraph, BulletList } from "@/components/legal/LegalPageKit";

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
  { id: "additional-rights", title: "Additional Rights (EEA, UK & California)" },
  { id: "children", title: "Children's Privacy" },
  { id: "changes", title: "Changes to This Policy" },
  { id: "contact", title: "Contact" },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 max-w-5xl mx-auto px-6 py-24 w-full">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-16">
          <LegalToc sections={sections} />

          <article className="flex-1 min-w-0">
            <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] font-mono text-text-tertiary hover:text-text-secondary transition-colors mb-6">
              <span className="text-[16px] leading-none">&larr;</span> Home
            </Link>
            <div className="rounded-[14px] surface-card-elevated p-5 sm:p-8 md:p-12">
              <h1 className="font-display text-[32px] font-[600] text-text-primary mb-2">
                Privacy Policy
              </h1>
              <p className="text-[13px] font-mono text-text-tertiary mb-8">
                Last updated: July 13, 2026
              </p>

              <section id="data-collected" className="scroll-mt-24">
                <SectionHeading>Data We Collect</SectionHeading>
                <Paragraph>
                  When you sign in with GitHub OAuth, DevMon accesses the
                  following information from your public GitHub profile:
                </Paragraph>
                <BulletList>
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
                </BulletList>
                <Paragraph>
                  We do not access private repositories, email addresses,
                  or any data beyond what the GitHub OAuth scope provides.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="how-we-use" className="scroll-mt-24">
                <SectionHeading>How We Use Your Data</SectionHeading>
                <Paragraph>
                  Your GitHub data is used solely to:
                </Paragraph>
                <BulletList>
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
                </BulletList>
                <Paragraph>
                  We do not sell, rent, or share your GitHub data with any
                  third parties for advertising or analytics purposes.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="card-storage" className="scroll-mt-24">
                <SectionHeading>Card Data &amp; Public Verification</SectionHeading>
                <Paragraph>
                  When you generate a card, the resulting card data is
                  stored in our database and associated with a unique card
                  ID (e.g., DM-XXXXXX). This card ID forms the URL of your
                  public verification page (/verify/DM-XXXXXX).
                </Paragraph>
                <Paragraph>
                  <strong className="text-text-primary">
                    Verification pages are public.
                  </strong>{" "}
                  Anyone with the link can view the card and its associated
                  stats — no login required. This is by design, as
                  verification links exist so you can prove your card is
                  authentic.
                </Paragraph>
                <Paragraph>
                  The stored card data includes your GitHub username,
                  display name, avatar, computed stats, rarity, class,
                  flavor text, and a cryptographic signature. It does not
                  include your GitHub access token.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="cookies" className="scroll-mt-24">
                <SectionHeading>Cookies &amp; Local Storage</SectionHeading>
                <Paragraph>
                  DevMon uses the following cookies and local storage:
                </Paragraph>
                <BulletList>
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
                </BulletList>
                <Paragraph>
                  DevMon does not use Google Analytics, advertising
                  cookies, or any third-party tracking scripts. If we add
                  analytics in the future, this policy will be updated
                  accordingly.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="third-parties" className="scroll-mt-24">
                <SectionHeading>Third-Party Services</SectionHeading>
                <Paragraph>DevMon uses the following third-party services:</Paragraph>
                <BulletList>
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
                </BulletList>
                <Paragraph>
                  We do not sell or share your personal data with any other
                  third parties. Our infrastructure providers (Supabase,
                  Vercel) may process and store data in regions outside your
                  own country, including the United States. By using DevMon,
                  you consent to this transfer.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="data-retention" className="scroll-mt-24">
                <SectionHeading>Data Retention</SectionHeading>
                <Paragraph>
                  Your card data is retained indefinitely unless you request
                  deletion. GitHub OAuth tokens are session-based and are
                  not stored after you sign out.
                </Paragraph>
                <Paragraph>
                  If DevMon is discontinued, all stored card data will be
                  deleted within 30 days of the shutdown announcement.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="your-rights" className="scroll-mt-24">
                <SectionHeading>Your Rights</SectionHeading>
                <Paragraph>You have the right to:</Paragraph>
                <BulletList>
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
                      href="mailto:shravandeb@gmail.com"
                      className="text-accent hover:underline"
                    >
                      shravandeb@gmail.com
                    </a>{" "}
                    with your GitHub username. We will process deletion
                    requests within 30 days.
                  </li>
                </BulletList>
              </section>

              <div className="surface-divider my-8" />

              <section id="additional-rights" className="scroll-mt-24">
                <SectionHeading>Additional Rights (EEA, UK &amp; California)</SectionHeading>
                <Paragraph>
                  If you are located in the European Economic Area, the
                  United Kingdom, or California, you may have additional rights
                  regarding your personal data, including the right to access
                  or export the data we hold about you, the right to request
                  correction of inaccurate data, the right to object to or
                  restrict certain processing, and the right to lodge a
                  complaint with your local data protection authority.
                  California residents are additionally entitled to know that
                  DevMon does not sell personal data to third parties. To
                  exercise any of these rights, contact us at{" "}
                  <a
                    href="mailto:shravandeb@gmail.com"
                    className="text-accent hover:underline"
                  >
                    shravandeb@gmail.com
                  </a>
                  .
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="children" className="scroll-mt-24">
                <SectionHeading>Children&apos;s Privacy</SectionHeading>
                <Paragraph>
                  DevMon is not directed at children under 13 (or the
                  applicable age of digital consent in your jurisdiction).
                  We do not knowingly collect personal information from
                  children.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="changes" className="scroll-mt-24">
                <SectionHeading>Changes to This Policy</SectionHeading>
                <Paragraph>
                  We may update this Privacy Policy from time to time. When
                  we do, we will update the &ldquo;Last updated&rdquo; date at the top
                  of this page. Significant changes will be communicated
                  through a notice on the DevMon website.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="contact" className="scroll-mt-24">
                <SectionHeading>Contact</SectionHeading>
                <Paragraph>
                  Questions about this policy or want to request data
                  deletion? Reach out at{" "}
                  <a
                    href="mailto:shravandeb@gmail.com"
                    className="text-accent hover:underline"
                  >
                    shravandeb@gmail.com
                  </a>
                  .
                </Paragraph>
              </section>
            </div>
          </article>
        </div>
      </div>

      <Footer />
    </main>
  );
}
