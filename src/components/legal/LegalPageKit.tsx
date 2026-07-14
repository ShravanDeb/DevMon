export function LegalToc({ sections }: { sections: { id: string; title: string }[] }) {
  return (
    <>
      {/* Desktop TOC */}
      <nav className="hidden lg:block sticky top-24 w-56 shrink-0">
        <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-text-tertiary mb-4">
          On this page
        </p>
        <ul className="space-y-1">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="block text-[13px] text-text-tertiary hover:text-text-secondary transition-colors py-1"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile TOC */}
      <details className="lg:hidden mb-8 rounded-[10px] surface-card overflow-hidden">
        <summary className="px-5 py-3.5 cursor-pointer text-[13px] font-mono uppercase tracking-[0.08em] text-text-tertiary select-none list-none flex items-center justify-between">
          <span>On this page</span>
          <span className="text-[18px] font-light text-text-tertiary leading-none">+</span>
        </summary>
        <div className="px-5 pb-4 border-t border-border-hairline">
          <ul className="space-y-1 pt-3">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="block text-[13px] text-text-tertiary hover:text-text-secondary transition-colors py-1"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </details>
    </>
  );
}

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-[20px] font-[600] text-text-primary mt-8 sm:mt-12 mb-4">
      {children}
    </h2>
  );
}

export function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[15px] leading-[1.8] text-text-secondary mb-4">
      {children}
    </p>
  );
}

export function BulletList({ children }: { children: React.ReactNode }) {
  return (
    <ul className="list-disc list-inside text-[15px] leading-[1.8] text-text-secondary mb-4 space-y-1 ml-4">
      {children}
    </ul>
  );
}
