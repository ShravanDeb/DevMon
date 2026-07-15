import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { LegalToc, SectionHeading, Paragraph, BulletList } from "@/components/legal/LegalPageKit";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for DevMon under Indian law.",
};

const sections = [
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "definitions", title: "Definitions" },
  { id: "service", title: "Service Description" },
  { id: "eligibility", title: "Eligibility" },
  { id: "github-auth", title: "GitHub Authentication" },
  { id: "cards", title: "Developer Cards" },
  { id: "verification", title: "Verification & Public Nature" },
  { id: "leaderboard", title: "Leaderboard" },
  { id: "consent-data", title: "Consent & Data Processing" },
  { id: "acceptable-use", title: "Acceptable Use" },
  { id: "intellectual-property", title: "Intellectual Property" },
  { id: "rate-limiting", title: "Rate Limiting" },
  { id: "service-availability", title: "Service Availability" },
  { id: "disclaimer", title: "Disclaimer of Warranties" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "governing-law", title: "Governing Law & Disputes" },
  { id: "changes", title: "Changes to Terms" },
  { id: "grievance-contact", title: "Grievance & Contact" },
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
                Last updated: July 15, 2026
              </p>

              <section id="acceptance" className="scroll-mt-24">
                <SectionHeading>Acceptance of Terms</SectionHeading>
                <Paragraph>
                  By accessing or using DevMon (&ldquo;the Service&rdquo;), you agree to be
                  bound by these Terms of Service. If you do not agree, do not use the
                  Service. These Terms constitute a legally binding agreement between you
                  and Shravan Deb (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
                </Paragraph>
                <Paragraph>
                  Your use of DevMon is also governed by our Privacy Policy, which is
                  incorporated herein by reference and describes how we process your
                  personal data in compliance with the Digital Personal Data Protection
                  Act, 2023 (the &ldquo;DPDP Act&rdquo;).
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="definitions" className="scroll-mt-24">
                <SectionHeading>Definitions</SectionHeading>
                <Paragraph>
                  For the purposes of these Terms, the following definitions apply:
                </Paragraph>
                <BulletList>
                  <li>
                    <strong className="text-text-primary">&ldquo;Data Fiduciary&rdquo;</strong>{" "}
                    has the meaning assigned under Section 3 of the DPDP Act, 2023.
                    Shravan Deb is the Data Fiduciary who determines the purpose and
                    means of processing your personal data.
                  </li>
                  <li>
                    <strong className="text-text-primary">&ldquo;Data Principal&rdquo;</strong>{" "}
                    has the meaning assigned under Section 3 of the DPDP Act, 2023.
                    You are the Data Principal as the individual whose personal data
                    is being processed.
                  </li>
                  <li>
                    <strong className="text-text-primary">&ldquo;Personal Data&rdquo;</strong>{" "}
                    has the meaning assigned under Section 3 of the DPDP Act, 2023
                    and refers to any data about an individual who is identifiable
                    by or in relation to such data.
                  </li>
                  <li>
                    <strong className="text-text-primary">&ldquo;Grievance Officer&rdquo;</strong>{" "}
                    means the person appointed under Section 13 of the DPDP Act, 2023
                    to handle complaints and requests from Data Principals.
                  </li>
                </BulletList>
              </section>

              <div className="surface-divider my-8" />

              <section id="service" className="scroll-mt-24">
                <SectionHeading>Service Description</SectionHeading>
                <Paragraph>
                  DevMon is a web application that generates shareable developer
                  credentials based on your public GitHub activity. When you sign in
                  with GitHub OAuth, DevMon fetches your public profile data and runs
                  it through a scoring pipeline that computes five stat categories:
                  Merge Force, Code Velocity, Problem Solving, Open Source, and
                  Consistency.
                </Paragraph>
                <Paragraph>
                  Based on these stats, DevMon assigns a rarity tier (Common, Rare,
                  Epic, Legendary, or Mythic), a developer class, flavor text, and
                  achievements. The result is a downloadable card image that you can
                  share anywhere.
                </Paragraph>
                <Paragraph>
                  DevMon is free to use. There are no paid tiers, credits, or hidden
                  costs.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="eligibility" className="scroll-mt-24">
                <SectionHeading>Eligibility</SectionHeading>
                <Paragraph>
                  You must be at least 18 years of age, being the age of majority under
                  the Indian Majority Act, 1875, to use DevMon. By signing in with
                  GitHub and using the Service, you confirm that you meet this
                  requirement.
                </Paragraph>
                <Paragraph>
                  If you are under 18, you may not use DevMon. In compliance with
                  Section 9(1) of the DPDP Act, 2023, we do not process the personal
                  data of individuals under 18.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="github-auth" className="scroll-mt-24">
                <SectionHeading>GitHub Authentication</SectionHeading>
                <Paragraph>
                  DevMon uses GitHub OAuth to authenticate you and fetch your public
                  profile data. The OAuth scope requested is{" "}
                  <code className="text-[13px] font-mono bg-surface-secondary px-1.5 py-0.5 rounded">
                    user:email
                  </code>
                  , which grants read-only access to your public profile and email.
                  DevMon does not request access to private repositories, write
                  permissions, or any data beyond your public GitHub activity.
                </Paragraph>
                <Paragraph>
                  Your GitHub OAuth access token is session-based and is not stored
                  after you sign out. You may revoke DevMon&apos;s access at any time via{" "}
                  <a
                    href="https://github.com/settings/applications"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    GitHub Settings &rarr; Applications
                  </a>
                  .
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="cards" className="scroll-mt-24">
                <SectionHeading>Developer Cards</SectionHeading>
                <Paragraph>
                  Each developer may hold one active card at a time. Generating a new
                  card replaces your previous card with a new unique card ID. Card data
                  includes your GitHub username, display name, avatar, computed stats,
                  rarity tier, class, flavor text, achievements, and a cryptographic
                  signature.
                </Paragraph>
                <Paragraph>
                  Cards are generated by an algorithm. Stats, rarity, and class
                  assignments are computed and are not manually curated. The scoring
                  algorithm weighs factors like contribution volume, repository
                  diversity, pull request close rates, and commit streak consistency.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="verification" className="scroll-mt-24">
                <SectionHeading>Verification &amp; Public Nature</SectionHeading>
                <Paragraph>
                  Each card is assigned a unique card ID (e.g., DM-XXXXXX) and a public
                  verification URL (e.g., /verify/DM-XXXXXX). Verification pages are{" "}
                  <strong className="text-text-primary">public by design</strong>
                  &mdash; anyone with the link can view the card and its associated
                  stats without logging in. This exists so you can share your card and
                  others can confirm its authenticity.
                </Paragraph>
                <Paragraph>
                  Card verification data includes a cryptographic HMAC-SHA-256
                  signature that proves the card was generated by DevMon and has not
                  been tampered with. The signature covers your username, stats,
                  rarity, and card ID.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="leaderboard" className="scroll-mt-24">
                <SectionHeading>Leaderboard</SectionHeading>
                <Paragraph>
                  The leaderboard displays all generated cards ranked by rarity and
                  score. Leaderboard entries are public and include your GitHub
                  username, display name, avatar, stats, rarity tier, and class. By
                  generating a card, you consent to your entry appearing on the
                  public leaderboard.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="consent-data" className="scroll-mt-24">
                <SectionHeading>Consent &amp; Data Processing</SectionHeading>
                <Paragraph>
                  By signing in with GitHub OAuth and using the Service to generate a
                  card, you provide your freely given, informed, specific, and
                  unconditional consent to DevMon processing your personal data as
                  described in the Privacy Policy.
                </Paragraph>
                <Paragraph>
                  Your consent is clearly demonstrable through your affirmative action
                  of signing in with GitHub and using the card generation feature. You
                  may withdraw your consent at any time by contacting the Grievance
                  Officer and requesting data erasure.
                </Paragraph>
                <Paragraph>
                  Withdrawal of consent does not affect the lawfulness of processing
                  carried out before such withdrawal. Upon withdrawal, your personal
                  data will be erased within 30 days, unless retention is necessary for
                  compliance with any law for the time being in force.
                </Paragraph>
                <Paragraph>
                  In addition to consent, DevMon processes personal data that you have
                  voluntarily made publicly available on your GitHub profile. This
                  processing falls under the legitimate use exception under Section 7
                  of the DPDP Act, 2023.
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
                    false identity.
                  </li>
                  <li>
                    Abuse, overload, or attempt to circumvent rate limits, API
                    protections, or authentication mechanisms.
                  </li>
                  <li>
                    Use the Service for any purpose that violates applicable law,
                    including the DPDP Act, 2023, or the GitHub Terms of Service.
                  </li>
                  <li>
                    Reverse-engineer, decompile, or extract the scoring algorithm
                    for competitive purposes without permission.
                  </li>
                </BulletList>
              </section>

              <div className="surface-divider my-8" />

              <section id="intellectual-property" className="scroll-mt-24">
                <SectionHeading>Intellectual Property</SectionHeading>
                <Paragraph>
                  DevMon does not claim ownership of your underlying GitHub data. Your
                  contributions, commits, and repository data remain yours and are
                  governed by your GitHub profile settings.
                </Paragraph>
                <Paragraph>
                  Card images generated by DevMon are produced for you to share and
                  download. You are free to use, share, and distribute your own card.
                </Paragraph>
                <Paragraph>
                  The DevMon source code is licensed under the{" "}
                  <a
                    href="https://github.com/ShravanDeb/DevMon/blob/master/LICENSE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    GNU Affero General Public License, Version 3.0
                  </a>{" "}
                  (AGPL-3.0-or-later). You may use, modify, and distribute the
                  software under the terms of this license, including the requirement
                  to provide source code for modified versions used over a network.
                </Paragraph>
                <Paragraph>
                  The DevMon name, logo, card artwork, crowns, icons, and visual
                  identity are trademarks of Shravan Deb and are{" "}
                  <strong className="text-text-primary">not</strong> licensed under
                  AGPL-3.0. Use of the DevMon Marks is governed by the{" "}
                  <a
                    href="https://github.com/ShravanDeb/DevMon/blob/master/TRADEMARKS.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Trademark Policy
                  </a>
                  . See the{" "}
                  <a
                    href="https://github.com/ShravanDeb/DevMon/blob/master/TRADEMARKS.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    TRADEMARKS.md
                  </a>{" "}
                  for permitted use.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="rate-limiting" className="scroll-mt-24">
                <SectionHeading>Rate Limiting</SectionHeading>
                <Paragraph>
                  DevMon enforces rate limits to protect the Service. Card generation
                  is limited to 10 requests per minute per user. Read operations
                  (leaderboard, verification) are limited to 60 requests per minute.
                  OG image generation is limited to 5 requests per minute. Exceeding
                  these limits will result in temporary access restrictions.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="service-availability" className="scroll-mt-24">
                <SectionHeading>Service Availability</SectionHeading>
                <Paragraph>
                  We make reasonable efforts to keep DevMon available, but we do not
                  guarantee uninterrupted or error-free operation. The Service is
                  provided &ldquo;as is&rdquo; and may be modified, suspended, or discontinued at
                  any time without prior notice. We are not liable for any downtime or
                  data loss.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="disclaimer" className="scroll-mt-24">
                <SectionHeading>Disclaimer of Warranties</SectionHeading>
                <Paragraph>
                  DevMon is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties
                  of any kind, whether express or implied. We do not warrant that the
                  Service will be uninterrupted, error-free, or that the stats and
                  rarity scores are objectively accurate &mdash; they are generated by
                  an algorithm and are intended for entertainment purposes.
                </Paragraph>
                <Paragraph>
                  The information provided on DevMon does not constitute legal advice.
                  For legal advice regarding your rights under the DPDP Act, 2023, you
                  should consult a qualified legal professional.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="liability" className="scroll-mt-24">
                <SectionHeading>Limitation of Liability</SectionHeading>
                <Paragraph>
                  To the maximum extent permitted by applicable law, Shravan Deb shall
                  not be liable for any indirect, incidental, special, consequential,
                  or punitive damages arising from your use of DevMon, including but
                  not limited to loss of data, service interruptions, or inaccurate
                  card generations.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="governing-law" className="scroll-mt-24">
                <SectionHeading>Governing Law &amp; Disputes</SectionHeading>
                <Paragraph>
                  These Terms are governed by the laws of India, including the Digital
                  Personal Data Protection Act, 2023, without regard to its
                  conflict-of-law principles.
                </Paragraph>
                <Paragraph>
                  Any dispute arising out of or relating to these Terms or your use of
                  DevMon will be subject to the exclusive jurisdiction of the courts
                  of India. Additionally, complaints regarding the processing of your
                  personal data may be referred to the Data Protection Board of India,
                  constituted under Section 18 of the DPDP Act, 2023.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="changes" className="scroll-mt-24">
                <SectionHeading>Changes to Terms</SectionHeading>
                <Paragraph>
                  We may update these Terms from time to time. When we do, we will
                  update the &ldquo;Last updated&rdquo; date at the top of this page. Continued
                  use of DevMon after changes constitutes acceptance of the revised
                  Terms.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="grievance-contact" className="scroll-mt-24">
                <SectionHeading>Grievance &amp; Contact</SectionHeading>
                <Paragraph>
                  Questions about these Terms or the Service? Reach out to the
                  Grievance Officer:
                </Paragraph>
                <Paragraph>
                  <strong className="text-text-primary">Grievance Officer:</strong> Shravan Deb<br />
                  <strong className="text-text-primary">Email:</strong>{" "}
                  <a href="mailto:shravandeb@gmail.com" className="text-accent hover:underline">
                    shravandeb@gmail.com
                  </a>
                </Paragraph>
                <Paragraph>
                  The Grievance Officer will acknowledge your complaint within 48 hours
                  and resolve it within 7 days, in compliance with Section 13 of the
                  DPDP Act, 2023 and Rule 4 of the DPDP Rules, 2025.
                </Paragraph>
                <Paragraph>
                  You may also open an issue on{" "}
                  <a
                    href="https://github.com/ShravanDeb/DevMon/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    GitHub
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
