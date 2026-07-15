import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/legal/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the DevMon team.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 max-w-3xl mx-auto px-6 py-24 w-full">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] font-mono text-text-tertiary hover:text-text-secondary transition-colors mb-6">
          <span className="text-[16px] leading-none">&larr;</span> Home
        </Link>
        <h1 className="font-display text-[26px] sm:text-[32px] font-[600] text-text-primary mb-2">
          Contact
        </h1>
        <p className="text-[15px] text-text-secondary mb-10">
          Have a question, bug report, or privacy concern? We&apos;d love to hear
          from you.
        </p>

        <ContactForm />

        <div className="mt-12 space-y-6">
          <div className="rounded-[14px] surface-card-elevated p-5 sm:p-8 md:p-8">
            <h2 className="font-display text-[18px] font-[600] text-text-primary mb-3">
              Grievance Officer (DPDP Act, 2023)
            </h2>
            <div className="space-y-3 text-[15px] leading-[1.8] text-text-secondary">
              <p>
                In compliance with <strong className="text-text-primary">Section 13</strong> of the
                Digital Personal Data Protection Act, 2023, DevMon&apos;s Grievance Officer handles
                all complaints and requests related to your personal data.
              </p>
              <p>
                <strong className="text-text-primary">Grievance Officer:</strong> Shravan Deb<br />
                <strong className="text-text-primary">Email:</strong>{" "}
                <a href="mailto:shravandeb@gmail.com" className="text-accent hover:underline">
                  shravandeb@gmail.com
                </a>
              </p>
              <p>
                <strong className="text-text-primary">Timelines:</strong> Complaints are
                acknowledged within <strong>48 hours</strong> and resolved within{" "}
                <strong>7 days</strong>, as required under Rule 4 of the DPDP Rules, 2025.
              </p>
              <p>
                If you are not satisfied with the resolution, you may escalate the matter to the{" "}
                <a
                  href="https://www.meity.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Data Protection Board of India
                </a>
                .
              </p>
            </div>
          </div>

          <div className="rounded-[14px] surface-card-elevated p-5 sm:p-8 md:p-8">
            <h2 className="font-display text-[18px] font-[600] text-text-primary mb-3">
              Contact by category
            </h2>
            <div className="space-y-3 text-[15px] leading-[1.8] text-text-secondary">
              <p>
                <strong className="text-text-primary">General inquiries:</strong>{" "}
                <a href="mailto:shravandeb@gmail.com" className="text-accent hover:underline">
                  shravandeb@gmail.com
                </a>
              </p>
              <p>
                <strong className="text-text-primary">DPDP data principal rights requests:</strong>{" "}
                Use the Grievance Officer email above with subject line &ldquo;DPDP Rights
                Request&rdquo; and include your GitHub username.
              </p>
              <p>
                <strong className="text-text-primary">Privacy &amp; data erasure:</strong>{" "}
                <a href="mailto:shravandeb@gmail.com?subject=Privacy%20Request" className="text-accent hover:underline">
                  shravandeb@gmail.com
                </a>
                {" "}(include your GitHub username)
              </p>
              <p>
                <strong className="text-text-primary">Security vulnerabilities:</strong>{" "}
                <a href="mailto:shravandeb@gmail.com?subject=Security%20Report" className="text-accent hover:underline">
                  shravandeb@gmail.com
                </a>
                {" "}(please use a descriptive subject line)
              </p>
              <p>
                <strong className="text-text-primary">Bug reports &amp; feature requests:</strong>{" "}
                <a
                  href="https://github.com/ShravanDeb/DevMon/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  GitHub Issues
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
