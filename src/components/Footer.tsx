import Link from "next/link";

const footerLinks = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const authorLinks = [
  { label: "GitHub", href: "https://github.com/ShravanDeb" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/shravan-kumar-deb-577b1037a" },
];

export function Footer() {
  return (
    <footer className="mt-auto py-12 border-t border-border-hairline">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <span className="font-display text-[16px] font-[600] text-text-primary">DevMon</span>
          <span className="text-[13px] font-mono text-text-tertiary">·</span>
          <span className="text-[13px] font-mono text-text-secondary">by Shravan Deb</span>
          <span className="text-[13px] font-mono text-text-tertiary">·</span>
          {authorLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-mono text-text-tertiary hover:text-text-secondary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <a
            href="https://github.com/ShravanDeb/DevMon/blob/master/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-mono text-text-tertiary hover:text-text-secondary transition-colors"
          >
            AGPL-3.0
          </a>
          <a
            href="https://github.com/ShravanDeb/DevMon/blob/master/TRADEMARKS.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-mono text-text-tertiary hover:text-text-secondary transition-colors"
          >
            Trademarks
          </a>
          <a
            href="https://github.com/ShravanDeb/DevMon/blob/master/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-mono text-text-tertiary hover:text-text-secondary transition-colors"
          >
            Contributing
          </a>
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-mono text-text-tertiary hover:text-text-secondary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/ShravanDeb/DevMon"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-mono text-text-tertiary hover:text-text-secondary transition-colors"
          >
            Source
          </a>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 mt-4 flex flex-col sm:flex-row items-center justify-center gap-x-3 gap-y-1">
        <span className="text-[11px] font-mono text-text-tertiary">
          Copyright 2026 Shravan Deb
        </span>
        <span className="text-[11px] font-mono text-text-tertiary">·</span>
        <span className="text-[11px] font-mono text-text-tertiary">
          AGPL-3.0 Licensed
        </span>
        <span className="text-[11px] font-mono text-text-tertiary">·</span>
        <span className="text-[11px] font-mono text-text-tertiary">
          DevMon is a trademark of Shravan Deb
        </span>
      </div>
    </footer>
  );
}
