import { motion } from "motion/react";

interface SectionHeaderProps {
  eyebrow: string;
  headline: string;
  className?: string;
}

export function SectionHeader({ eyebrow, headline, className = "" }: SectionHeaderProps) {
  return (
    <motion.div
      className={`flex flex-col items-center gap-2 ${className}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="font-mono text-[13px] font-medium uppercase tracking-[0.08em] text-text-tertiary">
        {eyebrow}
      </span>
      <h2 className="font-display text-[36px] leading-[1.1] font-[600] tracking-[-0.01em] text-text-primary md:text-[28px] text-center">
        {headline}
      </h2>
    </motion.div>
  );
}
