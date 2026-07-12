import type { Metadata } from "next";
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
        <h1 className="font-display text-[32px] font-[600] text-text-primary mb-2">
          Contact
        </h1>
        <p className="text-[15px] text-text-secondary mb-10">
          Have a question, bug report, or feature request? We&apos;d love to hear
          from you.
        </p>

        <ContactForm />

        <div className="mt-10 text-center">
          <p className="text-[13px] text-text-tertiary">
            Or reach us directly at{" "}
            <a
              href="mailto:shravandeb@gmail.com"
              className="text-accent hover:underline"
            >
              shravandeb@gmail.com
            </a>
          </p>
          <p className="text-[13px] text-text-tertiary mt-2">
            Open an issue on{" "}
            <a
              href="https://github.com/ShravanDeb/DevMon/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
