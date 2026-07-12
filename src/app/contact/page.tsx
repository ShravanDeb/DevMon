import type { Metadata } from "next";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the DevMon team.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 max-w-2xl mx-auto px-6 py-24 w-full">
        <h1 className="font-display text-[32px] font-[600] text-text-primary mb-2">
          Contact
        </h1>
        <p className="text-[15px] text-text-secondary mb-10">
          Have a question, bug report, or feature request? We&apos;d love to hear
          from you.
        </p>

        <div className="rounded-[14px] neu-raised-lg p-8 md:p-10">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-[13px] font-mono text-text-tertiary uppercase tracking-[0.08em] mb-2"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                className="w-full rounded-[8px] neu-input px-4 py-3 text-[14px] text-text-primary placeholder:text-text-tertiary"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-[13px] font-mono text-text-tertiary uppercase tracking-[0.08em] mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-[8px] neu-input px-4 py-3 text-[14px] text-text-primary placeholder:text-text-tertiary"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-[13px] font-mono text-text-tertiary uppercase tracking-[0.08em] mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder="What's on your mind?"
                className="w-full rounded-[8px] neu-input px-4 py-3 text-[14px] text-text-primary placeholder:text-text-tertiary resize-none"
              />
            </div>

            <a
              href="mailto:[support@email.com]"
              className="inline-flex items-center gap-2 rounded-[8px] neu-btn-accent px-6 py-3 text-[13px] font-medium"
            >
              Send via Email
            </a>

            <p className="text-[12px] text-text-tertiary">
              This form opens your email client with a pre-filled message.
              We don&apos;t collect or store form submissions on a server.
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-[13px] text-text-tertiary">
            Or reach us directly at{" "}
            <a
              href="mailto:[support@email.com]"
              className="text-accent hover:underline"
            >
              [support@email.com]
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
