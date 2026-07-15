import Link from "next/link";

const footerLinks = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Contributing", href: "https://github.com/ShravanDeb/DevMon/blob/master/CONTRIBUTING.md" },
  { label: "Source", href: "https://github.com/ShravanDeb/DevMon" },
];

export function Footer() {
  return (
    <footer className="mt-auto py-12 border-t border-border-hairline">
      <div className="max-w-5xl mx-auto px-6 flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {footerLinks.map((link) =>
            link.href.startsWith("http") ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-mono text-text-tertiary hover:text-text-secondary transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-mono text-text-tertiary hover:text-text-secondary transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-[11px] font-mono text-text-tertiary">
              &copy; 2026 Shravan Deb
            </span>
            <span className="text-[11px] font-mono text-text-tertiary">&middot;</span>
            <a
              href="https://github.com/ShravanDeb/DevMon/blob/master/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-text-tertiary hover:text-text-secondary transition-colors"
            >
              AGPL-3.0
            </a>
            <span className="text-[11px] font-mono text-text-tertiary">&middot;</span>
            <span className="text-[11px] font-mono text-text-tertiary">
              DevMon is a trademark of Shravan Deb
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/ShravanDeb"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] font-mono text-text-tertiary hover:text-text-secondary transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/shravan-kumar-deb-577b1037a"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] font-mono text-text-tertiary hover:text-text-secondary transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
