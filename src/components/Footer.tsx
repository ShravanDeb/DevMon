import Link from "next/link";

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Leaderboard", href: "/leaderboard" },
      { label: "Support the Developer", href: "/support" },
      { label: "Star on GitHub", href: "https://github.com/ShravanDeb/DevMon" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Contributing", href: "https://github.com/ShravanDeb/DevMon/blob/master/CONTRIBUTING.md" },
      { label: "Source Code", href: "https://github.com/ShravanDeb/DevMon" },
      { label: "Report Issue", href: "https://github.com/ShravanDeb/DevMon/issues" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "License (AGPL-3.0)", href: "https://github.com/ShravanDeb/DevMon/blob/master/LICENSE" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "GitHub", href: "https://github.com/ShravanDeb" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/shravan-kumar-deb-577b1037a" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto">
      <div className="surface-divider" />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2.5">
            <img
              src="/favicon.svg"
              width={24}
              height={24}
              alt="DevMon"
              className="shrink-0"
            />
            <span className="text-[18px] font-display font-[600] tracking-[-0.02em] text-text-primary">
              DevMon
            </span>
          </div>
          <p className="text-[13px] font-mono text-text-tertiary leading-relaxed mt-1 max-w-xs">
            Verified developer credentials from your public GitHub activity.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-mono font-medium uppercase tracking-[0.1em] text-text-tertiary mb-3">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("http") ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[14px] text-text-secondary hover:text-text-primary transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-[14px] text-text-secondary hover:text-text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-2 text-[12px] font-mono text-text-tertiary">
            <span>&copy; 2026 DevMon</span>
            <span className="opacity-30">&middot;</span>
            <a
              href="https://github.com/ShravanDeb/DevMon/blob/master/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-secondary transition-colors"
            >
              AGPL-3.0
            </a>
            <span className="opacity-30">&middot;</span>
            <span>Built by developers</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ShravanDeb"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-tertiary hover:text-text-secondary transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/shravan-kumar-deb-577b1037a"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-tertiary hover:text-text-secondary transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
