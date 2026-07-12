import type { Metadata } from "next";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for DevMon — the developer trading card generator.",
};

const sections = [
  { id: "service", title: "Service Description" },
  { id: "affiliation", title: "No GitHub Affiliation" },
  { id: "verification", title: "Public Verification Pages" },
  { id: "acceptable-use", title: "Acceptable Use" },
  { id: "intellectual-property", title: "Intellectual Property" },
  { id: "disclaimer", title: "Disclaimer of Warranties" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "suspension", title: "Account Suspension" },
  { id: "modifications", title: "Service Modifications" },
  { id: "changes", title: "Changes to Terms" },
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

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="font-display text-[20px] font-[600] text-text-primary mt-12 mb-4 scroll-mt-24"
    >
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

export default function TermsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 max-w-5xl mx-auto px-6 py-24 w-full">
        <div className="flex gap-16">
          <TOC />

          <article className="flex-1 min-w-0">
            <div className="rounded-[14px] neu-raised-lg p-8 md:p-12">
              <h1 className="font-display text-[32px] font-[600] text-text-primary mb-2">
                Terms of Service
              </h1>
              <p className="text-[13px] font-mono text-text-tertiary mb-8">
                Last updated: [Date]
              </p>

              <section id="service">
                <H2 id="service">Service Description</H2>
                <P>
                  DevMon is a web application that generates shareable &ldquo;developer
                  trading cards&rdquo; based on your public GitHub activity. When you sign in
                  with GitHub OAuth, DevMon fetches your public profile data — including
                  contributions, pull requests, repositories, languages, and commit
                  history — and runs it through a scoring pipeline that computes five
                  stat categories (Merge Force, Code Velocity, Problem Solving, Open
                  Source, and Consistency).
                </P>
                <P>
                  Based on these stats, DevMon assigns a rarity tier (Common, Rare,
                  Epic, Legendary, or Mythic), a developer class, flavor text, and
                  achievements. The result is a downloadable card image that you can
                  share anywhere.
                </P>
              </section>

              <div className="neu-divider my-8" />

              <section id="affiliation">
                <H2 id="affiliation">No GitHub Affiliation</H2>
                <P>
                  <strong className="text-text-primary">
                    DevMon is not affiliated with, endorsed by, or sponsored by
                    GitHub, Inc.
                  </strong>{" "}
                  GitHub is a registered trademark of GitHub, Inc. DevMon uses the
                  GitHub API to access public data with your authorization. Any
                  reference to &ldquo;GitHub&rdquo; is solely to describe the data source and
                  does not imply any partnership or endorsement.
                </P>
              </section>

              <div className="neu-divider my-8" />

              <section id="verification">
                <H2 id="verification">Public Verification Pages</H2>
                <P>
                  Each generated card is assigned a unique card ID and a public
                  verification URL (e.g., /verify/DM-XXXXXX). Anyone with this
                  link can view the associated card and stats — no login required.
                  This is by design: verification pages exist so you can share
                  your card and others can confirm its authenticity.
                </P>
                <P>
                  Card verification data includes a cryptographic HMAC signature
                  that proves the card was generated by DevMon and has not been
                  tampered with.
                </P>
              </section>

              <div className="neu-divider my-8" />

              <section id="acceptable-use">
                <H2 id="acceptable-use">Acceptable Use</H2>
                <P>You agree not to:</P>
                <UList>
                  <li>
                    Systematically scrape, crawl, or harvest card data from
                    verification pages or the leaderboard.
                  </li>
                  <li>
                    Impersonate another developer by generating cards under a
                    false identity or manipulating displayed information.
                  </li>
                  <li>
                    Abuse, overload, or attempt to circumvent the API rate
                    limits or authentication mechanisms.
                  </li>
                  <li>
                    Use the service for any purpose that violates applicable
                    law or the GitHub Terms of Service.
                  </li>
                  <li>
                    Reverse-engineer, decompile, or extract the scoring
                    algorithm for competitive purposes without permission.
                  </li>
                </UList>
              </section>

              <div className="neu-divider my-8" />

              <section id="intellectual-property">
                <H2 id="intellectual-property">Intellectual Property</H2>
                <P>
                  DevMon does not claim ownership of your underlying GitHub
                  data. Your contributions, commits, and repository data remain
                  yours and are governed by your GitHub profile settings.
                </P>
                <P>
                  Card images generated by DevMon are produced for you to
                  share and download. You are free to use, share, and
                  distribute your own card. The DevMon name, logo, and
                  scoring algorithm remain the property of [Company/Entity
                  Name].
                </P>
              </section>

              <div className="neu-divider my-8" />

              <section id="disclaimer">
                <H2 id="disclaimer">Disclaimer of Warranties</H2>
                <P>
                  DevMon is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without
                  warranties of any kind, whether express or implied. We do
                  not warrant that the service will be uninterrupted,
                  error-free, or that the stats and rarity scores are
                  objectively accurate — they are generated by an algorithm
                  and are intended for entertainment purposes.
                </P>
              </section>

              <div className="neu-divider my-8" />

              <section id="liability">
                <H2 id="liability">Limitation of Liability</H2>
                <P>
                  To the maximum extent permitted by law, [Company/Entity
                  Name] shall not be liable for any indirect, incidental,
                  special, consequential, or punitive damages arising from
                  your use of DevMon, including but not limited to loss of
                  data, service interruptions, or inaccurate card
                  generations.
                </P>
              </section>

              <div className="neu-divider my-8" />

              <section id="suspension">
                <H2 id="suspension">Account Suspension</H2>
                <P>
                  We reserve the right to suspend or terminate your access to
                  DevMon at our discretion, without notice, if we believe you
                  are violating these Terms or abusing the service. You may
                  also discontinue your own use at any time by revoking the
                  GitHub OAuth connection.
                </P>
              </section>

              <div className="neu-divider my-8" />

              <section id="modifications">
                <H2 id="modifications">Service Modifications</H2>
                <P>
                  We may modify, suspend, or discontinue DevMon (or any part
                  of it) at any time. We will make reasonable efforts to
                  notify users of significant changes, but we are not
                  obligated to provide advance notice.
                </P>
              </section>

              <div className="neu-divider my-8" />

              <section id="changes">
                <H2 id="changes">Changes to These Terms</H2>
                <P>
                  We may update these Terms from time to time. When we do,
                  we will update the &ldquo;Last updated&rdquo; date at the top of this
                  page. Continued use of DevMon after changes constitutes
                  acceptance of the revised Terms.
                </P>
              </section>

              <div className="neu-divider my-8" />

              <section id="contact">
                <H2 id="contact">Contact</H2>
                <P>
                  Questions about these Terms? Reach out at{" "}
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
