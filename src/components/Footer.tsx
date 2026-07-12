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
        <div className="flex items-center gap-3">
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
        <div className="flex items-center gap-6">
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
        <p className="text-[13px] text-text-tertiary">
          Not affiliated with GitHub.
        </p>
      </div>
    </footer>
  );
}
