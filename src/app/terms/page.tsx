import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { LegalToc, SectionHeading, Paragraph, BulletList } from "@/components/legal/LegalPageKit";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for DevMon — the developer trading card generator.",
};

const sections = [
  { id: "service", title: "Service Description" },
  { id: "eligibility", title: "Eligibility" },
  { id: "affiliation", title: "No GitHub Affiliation" },
  { id: "verification", title: "Public Verification Pages" },
  { id: "acceptable-use", title: "Acceptable Use" },
  { id: "intellectual-property", title: "Intellectual Property" },
  { id: "disclaimer", title: "Disclaimer of Warranties" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "indemnification", title: "Indemnification" },
  { id: "suspension", title: "Account Suspension" },
  { id: "modifications", title: "Service Modifications" },
  { id: "governing-law", title: "Governing Law & Disputes" },
  { id: "entire-agreement", title: "Severability & Entire Agreement" },
  { id: "changes", title: "Changes to Terms" },
  { id: "contact", title: "Contact" },
];

export default function TermsPage() {
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
                Terms of Service
              </h1>
              <p className="text-[13px] font-mono text-text-tertiary mb-8">
                Last updated: July 13, 2026
              </p>

              <section id="service" className="scroll-mt-24">
                <SectionHeading>Service Description</SectionHeading>
                <Paragraph>
                  DevMon is a web application that generates shareable &ldquo;developer
                  trading cards&rdquo; based on your public GitHub activity. When you sign in
                  with GitHub OAuth, DevMon fetches your public profile data — including
                  contributions, pull requests, repositories, languages, and commit
                  history — and runs it through a scoring pipeline that computes five
                  stat categories (Merge Force, Code Velocity, Problem Solving, Open
                  Source, and Consistency).
                </Paragraph>
                <Paragraph>
                  Based on these stats, DevMon assigns a rarity tier (Common, Rare,
                  Epic, Legendary, or Mythic), a developer class, flavor text, and
                  achievements. The result is a downloadable card image that you can
                  share anywhere.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="eligibility" className="scroll-mt-24">
                <SectionHeading>Eligibility</SectionHeading>
                <Paragraph>
                  You must be at least 13 years old, or the minimum age of digital
                  consent in your jurisdiction, to use DevMon. By signing in with
                  GitHub and using the service, you confirm that you meet this
                  requirement.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="affiliation" className="scroll-mt-24">
                <SectionHeading>No GitHub Affiliation</SectionHeading>
                <Paragraph>
                  <strong className="text-text-primary">
                    DevMon is not affiliated with, endorsed by, or sponsored by
                    GitHub, Inc.
                  </strong>{" "}
                  GitHub is a registered trademark of GitHub, Inc. DevMon uses the
                  GitHub API to access public data with your authorization. Any
                  reference to &ldquo;GitHub&rdquo; is solely to describe the data source and
                  does not imply any partnership or endorsement.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="verification" className="scroll-mt-24">
                <SectionHeading>Public Verification Pages</SectionHeading>
                <Paragraph>
                  Each generated card is assigned a unique card ID and a public
                  verification URL (e.g., /verify/DM-XXXXXX). Anyone with this
                  link can view the associated card and stats — no login required.
                  This is by design: verification pages exist so you can share
                  your card and others can confirm its authenticity.
                </Paragraph>
                <Paragraph>
                  Card verification data includes a cryptographic HMAC signature
                  that proves the card was generated by DevMon and has not been
                  tampered with.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="acceptable-use" className="scroll-mt-24">
                <SectionHeading>Acceptable Use</SectionHeading>
                <Paragraph>You agree not to:</Paragraph>
                <BulletList>
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
                </BulletList>
              </section>

              <div className="surface-divider my-8" />

              <section id="intellectual-property" className="scroll-mt-24">
                <SectionHeading>Intellectual Property</SectionHeading>
                <Paragraph>
                  DevMon does not claim ownership of your underlying GitHub
                  data. Your contributions, commits, and repository data remain
                  yours and are governed by your GitHub profile settings.
                </Paragraph>
                <Paragraph>
                  Card images generated by DevMon are produced for you to
                  share and download. You are free to use, share, and
                  distribute your own card. The DevMon name, logo, and
                  scoring algorithm remain the property of Shravan Deb.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="disclaimer" className="scroll-mt-24">
                <SectionHeading>Disclaimer of Warranties</SectionHeading>
                <Paragraph>
                  DevMon is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without
                  warranties of any kind, whether express or implied. We do
                  not warrant that the service will be uninterrupted,
                  error-free, or that the stats and rarity scores are
                  objectively accurate — they are generated by an algorithm
                  and are intended for entertainment purposes.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="liability" className="scroll-mt-24">
                <SectionHeading>Limitation of Liability</SectionHeading>
                <Paragraph>
                  To the maximum extent permitted by law, Shravan Deb shall
                  not be liable for any indirect, incidental, special,
                  consequential, or punitive damages arising from your use of
                  DevMon, including but not limited to loss of data, service
                  interruptions, or inaccurate card generations.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="indemnification" className="scroll-mt-24">
                <SectionHeading>Indemnification</SectionHeading>
                <Paragraph>
                  You agree to indemnify and hold harmless Shravan Deb from any
                  claims, losses, liabilities, damages, or expenses, including
                  reasonable legal fees, arising out of your violation of these
                  Terms or your misuse of DevMon.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="suspension" className="scroll-mt-24">
                <SectionHeading>Account Suspension</SectionHeading>
                <Paragraph>
                  We reserve the right to suspend or terminate your access to
                  DevMon at our discretion, without notice, if we believe you
                  are violating these Terms or abusing the service. You may
                  also discontinue your own use at any time by revoking the
                  GitHub OAuth connection.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="modifications" className="scroll-mt-24">
                <SectionHeading>Service Modifications</SectionHeading>
                <Paragraph>
                  We may modify, suspend, or discontinue DevMon (or any part
                  of it) at any time. We will make reasonable efforts to
                  notify users of significant changes, but we are not
                  obligated to provide advance notice.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="governing-law" className="scroll-mt-24">
                <SectionHeading>Governing Law &amp; Disputes</SectionHeading>
                <Paragraph>
                  These Terms are governed by the laws of India, without regard
                  to its conflict-of-law principles. Any dispute arising out of
                  or relating to these Terms or your use of DevMon will be
                  subject to the exclusive jurisdiction of the courts of India.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="entire-agreement" className="scroll-mt-24">
                <SectionHeading>Severability &amp; Entire Agreement</SectionHeading>
                <Paragraph>
                  If any provision of these Terms is found to be unenforceable
                  or invalid, that provision will be limited or eliminated to
                  the minimum extent necessary, and the remaining provisions
                  will remain in full force and effect. These Terms constitute
                  the entire agreement between you and DevMon regarding your
                  use of the service and supersede any prior agreements.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="changes" className="scroll-mt-24">
                <SectionHeading>Changes to These Terms</SectionHeading>
                <Paragraph>
                  We may update these Terms from time to time. When we do,
                  we will update the &ldquo;Last updated&rdquo; date at the top of this
                  page. Continued use of DevMon after changes constitutes
                  acceptance of the revised Terms.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="contact" className="scroll-mt-24">
                <SectionHeading>Contact</SectionHeading>
                <Paragraph>
                  Questions about these Terms? Reach out at{" "}
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
