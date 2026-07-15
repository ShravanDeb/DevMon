import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { LegalToc, SectionHeading, Paragraph, BulletList } from "@/components/legal/LegalPageKit";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for DevMon under the Digital Personal Data Protection Act, 2023.",
};

const sections = [
  { id: "notice", title: "Notice Under DPDP Act" },
  { id: "data-fiduciary", title: "Data Fiduciary Information" },
  { id: "personal-data", title: "Personal Data We Process" },
  { id: "lawful-basis", title: "Lawful Basis for Processing" },
  { id: "how-we-use", title: "How We Use Your Personal Data" },
  { id: "github-data", title: "GitHub Data" },
  { id: "card-data", title: "Card Data & Public Verification" },
  { id: "cookies", title: "Cookies & Session Management" },
  { id: "data-processors", title: "Data Processors" },
  { id: "cross-border", title: "Cross-Border Data Transfers" },
  { id: "data-retention", title: "Data Retention" },
  { id: "data-security", title: "Data Security" },
  { id: "your-rights", title: "Your Rights as a Data Principal" },
  { id: "grievance-officer", title: "Grievance Officer" },
  { id: "breach-notification", title: "Data Breach Notification" },
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
                Last updated: July 15, 2026
              </p>

              <section id="notice" className="scroll-mt-24">
                <SectionHeading>Notice Under the Digital Personal Data Protection Act, 2023</SectionHeading>
                <div className="rounded-[10px] border border-accent/30 bg-accent/5 p-4 sm:p-6 mb-6">
                  <p className="text-[15px] leading-[1.8] text-text-secondary">
                    <strong className="text-text-primary">Please read this notice carefully.</strong> Before
                    you consent to the processing of your personal data by DevMon, this Privacy Policy
                    informs you, in clear and plain language, of:
                  </p>
                  <BulletList>
                    <li>The personal data DevMon collects and the purposes for which it is processed.</li>
                    <li>Your rights as a Data Principal under the DPDP Act, 2023.</li>
                    <li>The contact details of the Grievance Officer appointed under Section 13 of the DPDP Act.</li>
                    <li>How you may file a complaint with the Data Protection Board of India.</li>
                  </BulletList>
                  <p className="text-[15px] leading-[1.8] text-text-secondary mt-2">
                    This notice is provided in compliance with Section 5 of the Digital Personal Data
                    Protection Act, 2023.
                  </p>
                </div>
              </section>

              <div className="surface-divider my-8" />

              <section id="data-fiduciary" className="scroll-mt-24">
                <SectionHeading>Data Fiduciary Information</SectionHeading>
                <Paragraph>
                  <strong className="text-text-primary">Data Fiduciary:</strong> Shravan Deb
                </Paragraph>
                <Paragraph>
                  For the purposes of the Digital Personal Data Protection Act, 2023 (the &ldquo;DPDP
                  Act&rdquo;), Shravan Deb is the Data Fiduciary who determines the purpose and means of
                  processing your personal data.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="personal-data" className="scroll-mt-24">
                <SectionHeading>Personal Data We Process</SectionHeading>
                <Paragraph>
                  When you sign in with GitHub OAuth, DevMon processes the following personal data
                  from your public GitHub profile:
                </Paragraph>
                <BulletList>
                  <li>
                    <strong className="text-text-primary">Identity data:</strong>{" "}
                    GitHub username, display name, avatar URL, bio, and company.
                  </li>
                  <li>
                    <strong className="text-text-primary">Contribution data:</strong>{" "}
                    Total commits, recent commits, commit streak (current and longest), and
                    commit hour distribution.
                  </li>
                  <li>
                    <strong className="text-text-primary">Repository data:</strong>{" "}
                    Total repositories, original repos, forked repos, archived repos, zero-star
                    repos, total stars, total forks, and languages used.
                  </li>
                  <li>
                    <strong className="text-text-primary">Activity data:</strong>{" "}
                    Merged pull requests, closed issues, repositories contributed to, and
                    organizations.
                  </li>
                  <li>
                    <strong className="text-text-primary">Email address:</strong>{" "}
                    Requested via the{" "}
                    <code className="text-[13px] font-mono bg-surface-secondary px-1.5 py-0.5 rounded">
                      user:email
                    </code>{" "}
                    OAuth scope. This may include your primary email address on GitHub.
                  </li>
                </BulletList>
                <Paragraph>
                  We do not process private repository data, write permissions, or any data beyond
                  what the GitHub OAuth scope provides.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="lawful-basis" className="scroll-mt-24">
                <SectionHeading>Lawful Basis for Processing</SectionHeading>
                <Paragraph>
                  Under the DPDP Act, 2023, DevMon processes your personal data on the following
                  lawful bases:
                </Paragraph>
                <BulletList>
                  <li>
                    <strong className="text-text-primary">Consent (Section 6):</strong>{" "}
                    By signing in with GitHub OAuth and using DevMon to generate a card, you
                    provide your freely given, informed, specific, and unconditional consent to
                    the processing of your personal data for the purposes described in this
                    Policy. You may withdraw your consent at any time by contacting the
                    Grievance Officer.
                  </li>
                  <li>
                    <strong className="text-text-primary">Publicly available data (Section 7(2)(a)):</strong>{" "}
                    Your GitHub profile data (username, contributions, repositories, activity)
                    is personal data that you have voluntarily made publicly available on your
                    GitHub profile. The processing of such publicly available data may not
                    require separate consent under Section 7 of the DPDP Act. DevMon processes
                    this data in accordance with the purpose limitation and transparency
                    obligations under the Act.
                  </li>
                </BulletList>
                <Paragraph>
                  <strong className="text-text-primary">Note on email:</strong> Your email
                  address, if processed, may not be publicly available on your GitHub profile.
                  DevMon processes this email solely based on your consent given through the
                  OAuth flow.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="how-we-use" className="scroll-mt-24">
                <SectionHeading>How We Use Your Personal Data</SectionHeading>
                <Paragraph>
                  Your personal data is used solely for the following specified purposes:
                </Paragraph>
                <BulletList>
                  <li>
                    Computing the five stat categories (Merge Force, Code Velocity, Problem
                    Solving, Open Source, Consistency) that appear on your card.
                  </li>
                  <li>
                    Determining your rarity tier, developer class, flavor text, achievements,
                    and signature move.
                  </li>
                  <li>
                    Rendering the card image for you to download and share.
                  </li>
                  <li>
                    Displaying your entry on the public leaderboard.
                  </li>
                  <li>
                    Generating a cryptographic HMAC-SHA-256 signature for card verification.
                  </li>
                </BulletList>
                <Paragraph>
                  We do not sell, rent, or share your personal data with any third parties for
                  advertising or analytics purposes. Your personal data is not used to make
                  automated decisions that significantly affect you beyond the card generation
                  and leaderboard ranking described above.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="github-data" className="scroll-mt-24">
                <SectionHeading>GitHub Data</SectionHeading>
                <Paragraph>
                  DevMon fetches your public GitHub data via the GitHub GraphQL API using your
                  OAuth access token. This token is session-based and is not persisted after you
                  sign out. Your access token is used only for the duration of a card generation
                  request and is never stored in our database.
                </Paragraph>
                <Paragraph>
                  DevMon does not access private repositories, write to your repositories, or
                  perform any action on your behalf beyond reading public profile data.
                </Paragraph>
                <Paragraph>
                  GitHub is a registered trademark of GitHub, Inc. DevMon is an independent
                  project and is not affiliated with, endorsed by, or sponsored by GitHub, Inc.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="card-data" className="scroll-mt-24">
                <SectionHeading>Card Data &amp; Public Verification</SectionHeading>
                <Paragraph>
                  When you generate a card, the resulting card data is stored in our database
                  and associated with a unique card ID (e.g., DM-XXXXXX). This card ID forms
                  the URL of your public verification page (/verify/DM-XXXXXX).
                </Paragraph>
                <Paragraph>
                  <strong className="text-text-primary">
                    Verification pages are public.
                  </strong>{" "}
                  Anyone with the link can view the card and its associated stats &mdash; no
                  login required. This is by design, as verification links exist so you can
                  prove your card is authentic.
                </Paragraph>
                <Paragraph>
                  The stored card data includes your GitHub username, display name, avatar,
                  computed stats, rarity, class, flavor text, and a cryptographic
                  HMAC-SHA-256 signature. It does not include your GitHub access token.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="cookies" className="scroll-mt-24">
                <SectionHeading>Cookies &amp; Session Management</SectionHeading>
                <Paragraph>
                  DevMon uses minimal cookies and client-side storage:
                </Paragraph>
                <BulletList>
                  <li>
                    <strong className="text-text-primary">Authentication cookies:</strong>{" "}
                    Supabase Auth sets session cookies (JWT and refresh tokens) to keep you
                    signed in. These are strictly functional cookies necessary for the Service
                    to work. They expire upon session end and are not used for tracking or
                    analytics.
                  </li>
                  <li>
                    <strong className="text-text-primary">Theme preference:</strong>{" "}
                    Your light/dark mode preference is stored in your browser&apos;s localStorage.
                    This never leaves your device and is not sent to any server.
                  </li>
                </BulletList>
                <Paragraph>
                  DevMon does not use Google Analytics, advertising cookies, third-party
                  tracking scripts, or fingerprinting techniques. If we add analytics in the
                  future, this Policy will be updated accordingly.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="data-processors" className="scroll-mt-24">
                <SectionHeading>Data Processors</SectionHeading>
                <Paragraph>
                  DevMon engages the following Data Processors to process personal data on its
                  behalf, under valid contracts in compliance with Section 8(2) of the DPDP Act:
                </Paragraph>
                <BulletList>
                  <li>
                    <strong className="text-text-primary">GitHub, Inc.:</strong> OAuth
                    authentication and public profile data via the GitHub GraphQL API.
                    GitHub is a Data Fiduciary for the data you maintain on its platform.
                  </li>
                  <li>
                    <strong className="text-text-primary">Supabase, Inc.:</strong>{" "}
                    Authentication session management, database storage, and row-level
                    security policies. Hosted on Amazon Web Services (AWS) infrastructure.
                  </li>
                  <li>
                    <strong className="text-text-primary">Vercel, Inc.:</strong> Application
                    hosting and edge network. Vercel may collect standard server logs (IP
                    addresses, request timestamps) for operational purposes.
                  </li>
                  <li>
                    <strong className="text-text-primary">Upstash, Inc.:</strong> Redis-based
                    rate limiting. No personal data is stored in Upstash; only rate limit
                    counters are maintained.
                  </li>
                </BulletList>
                <Paragraph>
                  We do not sell or share your personal data with any other third parties.
                  Our Data Processors are contractually obligated to process your personal
                  data only in accordance with our instructions and to implement appropriate
                  security measures.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="cross-border" className="scroll-mt-24">
                <SectionHeading>Cross-Border Data Transfers</SectionHeading>
                <Paragraph>
                  To provide the Service, your personal data may be transferred to and
                  processed in countries outside India where our Data Processors operate,
                  including the United States and the European Union.
                </Paragraph>
                <Paragraph>
                  Under Section 16 of the DPDP Act, 2023, transfer of personal data outside
                  India is permitted except to countries that have been notified as restricted
                  by the Central Government. As of the date of this Policy, no countries have
                  been notified as restricted. We will comply with any such restrictions as
                  and when they are notified.
                </Paragraph>
                <Paragraph>
                  By using DevMon, you consent to the transfer of your personal data to
                  countries where our Data Processors operate, in accordance with the
                  provisions of the DPDP Act, 2023.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="data-retention" className="scroll-mt-24">
                <SectionHeading>Data Retention</SectionHeading>
                <Paragraph>
                  In compliance with Section 8(7) of the DPDP Act, 2023, DevMon retains your
                  personal data only as long as the specified purpose for processing is served:
                </Paragraph>
                <BulletList>
                  <li>
                    <strong className="text-text-primary">Card data:</strong> Retained while
                    your card remains active on the Service. If you withdraw consent by
                    requesting deletion, or if the purpose is no longer served, your personal
                    data will be erased within 30 days.
                  </li>
                  <li>
                    <strong className="text-text-primary">OAuth tokens:</strong> Session-based
                    and not stored after you sign out.
                  </li>
                  <li>
                    <strong className="text-text-primary">Server logs:</strong> Standard
                    operational logs (IP addresses, request timestamps) are retained for a
                    reasonable period for security and operational purposes, as per standard
                    Vercel practices.
                  </li>
                </BulletList>
                <Paragraph>
                  If DevMon is discontinued, all stored personal data will be erased within
                  30 days of the shutdown announcement, subject to any legal obligations to
                  retain certain records.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="data-security" className="scroll-mt-24">
                <SectionHeading>Data Security</SectionHeading>
                <Paragraph>
                  DevMon implements appropriate technical and organisational measures to
                  protect your personal data, in compliance with Section 8(5) of the DPDP Act:
                </Paragraph>
                <BulletList>
                  <li>
                    <strong className="text-text-primary">Cryptographic verification:</strong>{" "}
                    All cards are signed with HMAC-SHA-256. Verification pages display the
                    signature, allowing third parties to confirm a card&apos;s authenticity.
                  </li>
                  <li>
                    <strong className="text-text-primary">Row-level security:</strong> Database
                    access is restricted by RLS policies. Cards can only be created or updated
                    by the authenticated user who owns them, and read access is public by
                    design.
                  </li>
                  <li>
                    <strong className="text-text-primary">Rate limiting:</strong> API endpoints
                    are rate-limited via Upstash to prevent abuse.
                  </li>
                  <li>
                    <strong className="text-text-primary">HTTPS:</strong> All communication is
                    encrypted in transit.
                  </li>
                  <li>
                    <strong className="text-text-primary">Access controls:</strong> OAuth access
                    tokens are session-based and not stored.
                  </li>
                </BulletList>
              </section>

              <div className="surface-divider my-8" />

              <section id="your-rights" className="scroll-mt-24">
                <SectionHeading>Your Rights as a Data Principal</SectionHeading>
                <Paragraph>
                  Under the DPDP Act, 2023, you have the following rights regarding your
                  personal data:
                </Paragraph>
                <BulletList>
                  <li>
                    <strong className="text-text-primary">Right to access (Section 9(1)):</strong>{" "}
                    You have the right to know what personal data DevMon holds about you and
                    how it is being processed. Your card data is visible on your verification
                    page at all times.
                  </li>
                  <li>
                    <strong className="text-text-primary">Right to correction (Section 9(2)):</strong>{" "}
                    If any personal data we hold is inaccurate or misleading, you may request
                    correction by contacting the Grievance Officer.
                  </li>
                  <li>
                    <strong className="text-text-primary">Right to erasure (Section 9(3)):</strong>{" "}
                    You may request the erasure of your personal data by contacting the
                    Grievance Officer with your GitHub username. We will process erasure
                    requests within 30 days, unless retention is necessary for compliance
                    with law.
                  </li>
                  <li>
                    <strong className="text-text-primary">Right to grievance redressal (Section 9(4)):</strong>{" "}
                    You have the right to have your complaints addressed through the Grievance
                    Officer mechanism described below.
                  </li>
                  <li>
                    <strong className="text-text-primary">Right to nominate (Section 9(5)):</strong>{" "}
                    You have the right to nominate a person to exercise your rights under the
                    DPDP Act in the event of your death or incapacity. To make a nomination,
                    contact the Grievance Officer.
                  </li>
                  <li>
                    <strong className="text-text-primary">Right to withdraw consent:</strong>{" "}
                    You may withdraw your consent to processing at any time. Withdrawal does
                    not affect the lawfulness of processing carried out before withdrawal.
                    Contact the Grievance Officer to withdraw consent.
                  </li>
                </BulletList>
                <Paragraph>
                  To exercise any of these rights, contact the Grievance Officer at the
                  details provided below. We will respond to your request within the
                  timelines prescribed under the DPDP Rules, 2025.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="grievance-officer" className="scroll-mt-24">
                <SectionHeading>Grievance Officer</SectionHeading>
                <div className="rounded-[10px] surface-card p-4 sm:p-6 mb-6">
                  <p className="text-[15px] leading-[1.8] text-text-secondary">
                    <strong className="text-text-primary">Grievance Officer:</strong> Shravan Deb
                  </p>
                  <p className="text-[15px] leading-[1.8] text-text-secondary">
                    <strong className="text-text-primary">Email:</strong>{" "}
                    <a href="mailto:shravandeb@gmail.com" className="text-accent hover:underline">
                      shravandeb@gmail.com
                    </a>
                  </p>
                  <p className="text-[15px] leading-[1.8] text-text-secondary mt-2">
                    In compliance with Section 13 of the DPDP Act, 2023 and Rule 4 of the DPDP
                    Rules, 2025, the Grievance Officer shall:
                  </p>
                  <BulletList>
                    <li>Acknowledge your complaint within 48 hours of receipt.</li>
                    <li>Resolve your complaint within 7 days of receipt, or such extended period as may be permitted by the Data Protection Board of India.</li>
                  </BulletList>
                </div>
                <Paragraph>
                  If you are not satisfied with the resolution provided by the Grievance Officer,
                  you may file a complaint with the{' '}
                  <a
                    href="https://www.meity.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Data Protection Board of India
                  </a>
                  , the regulatory body constituted under Section 18 of the DPDP Act.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="breach-notification" className="scroll-mt-24">
                <SectionHeading>Data Breach Notification</SectionHeading>
                <Paragraph>
                  In the event of a personal data breach, DevMon shall comply with its
                  obligations under Section 8(6) of the DPDP Act, 2023 and Rule 7 of the DPDP
                  Rules, 2025. This includes:
                </Paragraph>
                <BulletList>
                  <li>
                    Notifying the{' '}
                    <strong className="text-text-primary">Data Protection Board of India</strong>{" "}
                    of the breach in the form and manner prescribed.
                  </li>
                  <li>
                    Notifying each{' '}
                    <strong className="text-text-primary">affected Data Principal</strong> of
                    the breach in the form and manner prescribed.
                  </li>
                </BulletList>
                <Paragraph>
                  The notification will include details of the nature of the breach, the
                  personal data affected, the potential impact, and the remedial measures
                  taken. Initial notification will be made without delay upon becoming aware
                  of the breach.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="children" className="scroll-mt-24">
                <SectionHeading>Children&apos;s Privacy</SectionHeading>
                <Paragraph>
                  DevMon is not directed at individuals under the age of 18, which is the age
                  of majority under the Indian Majority Act, 1875. We do not knowingly
                  process the personal data of individuals under 18.
                </Paragraph>
                <Paragraph>
                  In compliance with Section 9(1) of the DPDP Act, 2023, DevMon will not
                  engage in tracking or behavioural monitoring of children, nor will it
                  display targeted advertisements directed at children. If we become aware
                  that we have processed personal data of a person under 18 in violation of
                  this Policy, we will delete such data promptly.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="changes" className="scroll-mt-24">
                <SectionHeading>Changes to This Policy</SectionHeading>
                <Paragraph>
                  We may update this Privacy Policy from time to time. When we do, we will
                  update the &ldquo;Last updated&rdquo; date at the top of this page. Significant
                  changes will be communicated through a notice on the DevMon website or
                  through the Service.
                </Paragraph>
              </section>

              <div className="surface-divider my-8" />

              <section id="contact" className="scroll-mt-24">
                <SectionHeading>Contact</SectionHeading>
                <Paragraph>
                  Questions about this Policy, to exercise your rights under the DPDP Act, or
                  to report a privacy concern, please contact the Grievance Officer:
                </Paragraph>
                <Paragraph>
                  <strong className="text-text-primary">Email:</strong>{" "}
                  <a href="mailto:shravandeb@gmail.com" className="text-accent hover:underline">
                    shravandeb@gmail.com
                  </a>
                </Paragraph>
                <Paragraph>
                  You may also raise a concern by opening an issue on our{' '}
                  <a
                    href="https://github.com/ShravanDeb/DevMon/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    GitHub repository
                  </a>
                  .
                </Paragraph>
                <Paragraph>
                  The DevMon source code is licensed under the{' '}
                  <a
                    href="https://github.com/ShravanDeb/DevMon/blob/master/LICENSE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    GNU Affero General Public License, Version 3.0
                  </a>
                  . See{' '}
                  <a
                    href="https://github.com/ShravanDeb/DevMon/blob/master/CONTRIBUTING.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    CONTRIBUTING.md
                  </a>{' '}
                  for contribution guidelines and{' '}
                  <a
                    href="https://github.com/ShravanDeb/DevMon/blob/master/SECURITY.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    SECURITY.md
                  </a>{' '}
                  for the vulnerability disclosure policy.
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
