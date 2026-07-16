"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, useInView, useScroll, useTransform, useMotionValue } from "motion/react";
import { MagneticButton } from "@/components/MagneticButton";
import { RarityCrown } from "@/components/RarityCrown";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";
import { variants } from "@/lib/motion";
import { RARITY_COLORS } from "@/types";
import type { ClassName, Rarity, LeaderboardEntry } from "@/types";

// ─── AnimatedCounter ───────────────────────────────────────
function AnimatedCounter({ value, label }: { value: string | number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === "string" ? parseInt(value) || 0 : value;

  useEffect(() => {
    if (!isInView || numericValue === 0) return;
    const duration = 1400;
    const steps = 50;
    const increment = numericValue / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setDisplayValue(numericValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, numericValue]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-[36px] sm:text-[48px] font-display font-[600] tracking-[-0.02em] text-text-primary tabular-nums leading-none">
        {numericValue > 0 && isInView ? displayValue.toLocaleString() : value}
      </div>
      <div className="text-[13px] font-mono font-medium uppercase tracking-[0.08em] text-text-tertiary mt-3">
        {label}
      </div>
    </div>
  );
}

// ─── WordReveal ────────────────────────────────────────────
function RevealWord({ progress, start, end, word }: { progress: ReturnType<typeof useScroll>["scrollYProgress"]; start: number; end: number; word: string }) {
  const opacity = useTransform(progress, [start, end], [0.08, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.3em]">
      {word}
    </motion.span>
  );
}

function WordReveal({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.3"],
  });
  const words = text.split(" ");

  return (
    <div ref={ref} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <RevealWord key={i} progress={scrollYProgress} start={start} end={end} word={word} />
        );
      })}
    </div>
  );
}

// ─── HorizontalMarquee ─────────────────────────────────────
function HorizontalMarquee() {
  const classes: ClassName[] = [
    "Merge Griffin", "Fork Warden", "Night Owl", "Bug Hunter", "Stack Guardian", "Commit Phantom",
    "Open Source Sentinel", "Polyglot Artisan", "Code Archivist", "Green Sprout", "PR Titan", "Zen Coder",
  ];
  const rarities: Rarity[] = ["Common", "Rare", "Epic", "Legendary", "Mythic"];

  const items = useMemo(() => {
    const merged: string[] = [];
    classes.forEach((c) => merged.push(c));
    rarities.forEach((r) => merged.push(r));
    return merged;
  }, []);

  const doubled = [...items, ...items, ...items];

  return (
    <div className="relative overflow-hidden py-8 border-y border-border-hairline">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-surface-0 to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-surface-0 to-transparent z-10" />
      <motion.div
        className="flex gap-14 whitespace-nowrap"
        animate={{ x: ["0%", "-33.333%"] }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      >
        {doubled.map((text, i) => (
          <span
            key={i}
            className="font-display text-[18px] font-[700] tracking-[0.06em] uppercase shrink-0 marquee-holo"
            style={{ "--shimmer-delay": `${(i % items.length) * 0.18}s` } as React.CSSProperties}
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── RarityShowcase ────────────────────────────────────────
function RarityShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const rarities: Rarity[] = ["Common", "Rare", "Epic", "Legendary", "Mythic"];
  const percentages = ["68%", "22%", "7%", "2.5%", "0.5%"];
  const descriptions = [
    "Baseline tier",
    "Above average activity",
    "Top 10% of developers",
    "Statistically rare",
    "Top 0.5% of all users",
  ];

  return (
    <div ref={ref} className="flex gap-3 max-w-lg mx-auto">
      {rarities.map((r, i) => (
        <motion.div
          key={r}
          className="flex-1 min-w-0"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="relative rounded-[10px] border overflow-hidden"
            style={{
              background: `linear-gradient(180deg, ${RARITY_COLORS[r].hex}12 0%, ${RARITY_COLORS[r].hex}04 100%)`,
              borderColor: `${RARITY_COLORS[r].hex}30`,
              boxShadow: `0 0 24px ${RARITY_COLORS[r].hex}10, inset 0 1px 0 ${RARITY_COLORS[r].hex}15`,
            }}
          >
            <div className="px-2 pt-5 pb-4 text-center space-y-3">
              {/* Percentage */}
              <span
                className="block font-display text-[22px] font-[700] tracking-[-0.02em] leading-none"
                style={{ color: RARITY_COLORS[r].hex }}
              >
                {percentages[i]}
              </span>
              {/* Name */}
              <span
                className="block text-[10px] font-mono font-medium uppercase tracking-[0.08em]"
                style={{ color: RARITY_COLORS[r].hex, opacity: 0.8 }}
              >
                {r}
              </span>
              {/* Description */}
              <span className="block text-[10px] font-mono text-text-tertiary leading-tight">
                {descriptions[i]}
              </span>
            </div>
            {/* Bottom accent bar */}
            <div
              className="h-[2px] w-full"
              style={{ background: `linear-gradient(90deg, transparent, ${RARITY_COLORS[r].hex}50, transparent)` }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── LeaderboardPreview ────────────────────────────────────
function LeaderboardPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/leaderboard?_t=${Date.now()}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        setEntries((d.entries || []).slice(0, 3));
      })
      .catch((err) => {
        console.error("Leaderboard fetch failed:", err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const sorted = [...entries].sort((a, b) => b.rarityScore - a.rarityScore);
  const display = sorted.slice(0, 3);

  return (
    <section ref={ref} className="py-20 md:py-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <motion.span
            className="font-mono text-[13px] font-medium uppercase tracking-[0.08em] text-text-tertiary"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            Leaderboard
          </motion.span>
          <motion.h2
            className="font-display text-[36px] md:text-[42px] leading-[1.1] font-[600] tracking-[-0.02em] text-text-primary mt-3"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            Top ranked developers.
          </motion.h2>
        </div>

        {display.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[15px] text-text-tertiary">
              {isLoading ? "Loading rankings..." : "No rankings yet. Generate the first credential."}
            </p>
          </motion.div>
        )}

        {/* Podium */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-center gap-6 sm:gap-4 mb-12 pt-8">
          {/* 2nd place */}
          {display[1] && (
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative group">
                <RarityCrown rank={2} />
                <div
                  className="rounded-t-[12px] rounded-b-[4px] border p-5 text-center space-y-3 overflow-hidden min-h-[260px]"
                  style={{
                    background: `linear-gradient(180deg, ${RARITY_COLORS[display[1].rarity].hex}12 0%, ${RARITY_COLORS[display[1].rarity].hex}04 100%)`,
                    borderColor: `${RARITY_COLORS[display[1].rarity].hex}30`,
                    boxShadow: `0 0 24px ${RARITY_COLORS[display[1].rarity].hex}0E, inset 0 1px 0 ${RARITY_COLORS[display[1].rarity].hex}15`,
                  }}
                >
                  <div className="w-[72px] h-[72px] rounded-full border mx-auto flex items-center justify-center" style={{ borderColor: `${RARITY_COLORS[display[1].rarity].hex}10`, boxShadow: `0 0 12px ${RARITY_COLORS[display[1].rarity].hex}0A` }}>
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2" style={{ borderColor: `${RARITY_COLORS[display[1].rarity].hex}30` }}>
                      <img src={display[1].avatarUrl} alt={display[1].displayName} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <p className={`font-medium text-text-primary max-w-full whitespace-normal ${display[1].displayName.length > 18 ? 'text-[11px]' : display[1].displayName.length > 12 ? 'text-[12px]' : 'text-[13px]'}`}>{display[1].displayName}</p>
                  <p className="text-[11px] font-mono text-text-tertiary truncate max-w-full">{display[1].primaryClass}</p>
                  <p className="font-display text-[24px] font-[700] tracking-[-0.01em]" style={{ color: RARITY_COLORS[display[1].rarity].hex }}>
                    {display[1].rarityScore}
                  </p>
                  <div className="w-full flex items-center justify-center" style={{ height: 28, background: `linear-gradient(180deg, ${RARITY_COLORS[display[1].rarity].hex}06 0%, ${RARITY_COLORS[display[1].rarity].hex}0A 100%)`, borderTop: `1px solid ${RARITY_COLORS[display[1].rarity].hex}10`, borderRadius: '0 0 4px 4px' }}>
                    <span className="text-[11px] font-mono font-medium uppercase tracking-[0.06em]" style={{ color: RARITY_COLORS[display[1].rarity].hex }}>2nd</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 1st place */}
          {display[0] && (
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative animate-float group">
                <RarityCrown rank={1} />
                <div
                  className="rounded-t-[12px] rounded-b-[4px] border p-6 text-center space-y-3 overflow-hidden min-h-[280px]"
                  style={{
                    background: `linear-gradient(180deg, ${RARITY_COLORS[display[0].rarity].hex}12 0%, ${RARITY_COLORS[display[0].rarity].hex}04 100%)`,
                    borderColor: `${RARITY_COLORS[display[0].rarity].hex}30`,
                    boxShadow: `0 0 32px ${RARITY_COLORS[display[0].rarity].hex}18, inset 0 1px 0 ${RARITY_COLORS[display[0].rarity].hex}15`,
                  }}
                >
                  <div className="w-[80px] h-[80px] rounded-full border mx-auto flex items-center justify-center animate-glow-pulse" style={{ borderColor: `${RARITY_COLORS[display[0].rarity].hex}12`, boxShadow: `0 0 20px ${RARITY_COLORS[display[0].rarity].hex}15` }}>
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2" style={{ borderColor: `${RARITY_COLORS[display[0].rarity].hex}50` }}>
                      <img src={display[0].avatarUrl} alt={display[0].displayName} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <p className={`font-medium text-text-primary max-w-full whitespace-normal ${display[0].displayName.length > 18 ? 'text-[11px]' : display[0].displayName.length > 12 ? 'text-[12px]' : 'text-[14px]'}`}>{display[0].displayName}</p>
                  <p className="text-[11px] font-mono text-text-tertiary truncate max-w-full">{display[0].primaryClass}</p>
                  <p className="font-display text-[28px] font-[700] tracking-[-0.01em]" style={{ color: RARITY_COLORS[display[0].rarity].hex }}>
                    {display[0].rarityScore}
                  </p>
                  <div className="w-full flex items-center justify-center" style={{ height: 32, background: `linear-gradient(180deg, ${RARITY_COLORS[display[0].rarity].hex}06 0%, ${RARITY_COLORS[display[0].rarity].hex}0A 100%)`, borderTop: `1px solid ${RARITY_COLORS[display[0].rarity].hex}12`, borderRadius: '0 0 4px 4px' }}>
                    <span className="text-[12px] font-mono font-medium uppercase tracking-[0.06em]" style={{ color: RARITY_COLORS[display[0].rarity].hex }}>1st</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 3rd place */}
          {display[2] && (
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative group">
                <RarityCrown rank={3} />
                <div
                  className="rounded-t-[12px] rounded-b-[4px] border p-5 text-center space-y-3 overflow-hidden min-h-[260px]"
                  style={{
                    background: `linear-gradient(180deg, ${RARITY_COLORS[display[2].rarity].hex}12 0%, ${RARITY_COLORS[display[2].rarity].hex}04 100%)`,
                    borderColor: `${RARITY_COLORS[display[2].rarity].hex}30`,
                    boxShadow: `0 0 20px ${RARITY_COLORS[display[2].rarity].hex}0A, inset 0 1px 0 ${RARITY_COLORS[display[2].rarity].hex}15`,
                  }}
                >
                  <div className="w-[68px] h-[68px] rounded-full border mx-auto flex items-center justify-center" style={{ borderColor: `${RARITY_COLORS[display[2].rarity].hex}0C`, boxShadow: `0 0 10px ${RARITY_COLORS[display[2].rarity].hex}08` }}>
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2" style={{ borderColor: `${RARITY_COLORS[display[2].rarity].hex}30` }}>
                      <img src={display[2].avatarUrl} alt={display[2].displayName} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <p className={`font-medium text-text-primary max-w-full whitespace-normal ${display[2].displayName.length > 18 ? 'text-[11px]' : display[2].displayName.length > 12 ? 'text-[12px]' : 'text-[13px]'}`}>{display[2].displayName}</p>
                  <p className="text-[11px] font-mono text-text-tertiary truncate max-w-full">{display[2].primaryClass}</p>
                  <p className="font-display text-[22px] font-[700] tracking-[-0.01em]" style={{ color: RARITY_COLORS[display[2].rarity].hex }}>
                    {display[2].rarityScore}
                  </p>
                  <div className="w-full flex items-center justify-center" style={{ height: 24, background: `linear-gradient(180deg, ${RARITY_COLORS[display[2].rarity].hex}06 0%, ${RARITY_COLORS[display[2].rarity].hex}0A 100%)`, borderTop: `1px solid ${RARITY_COLORS[display[2].rarity].hex}0C`, borderRadius: '0 0 4px 4px' }}>
                    <span className="text-[11px] font-mono font-medium uppercase tracking-[0.06em]" style={{ color: RARITY_COLORS[display[2].rarity].hex }}>3rd</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* View Leaderboard button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <a
            href="/leaderboard"
            className="inline-flex items-center gap-2 rounded-[6px] px-5 py-2.5 text-[13px] leading-none font-medium surface-btn text-text-primary"
          >
            View Leaderboard
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3l5 5-5 5" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ─── QuoteStrip ────────────────────────────────────────────
const quotes = [
  { text: "\"The scoring engine nailed my profile. My class and rarity matched exactly what I expected.\"", author: "Verified DevMon user" },
  { text: "\"I shared my credential on LinkedIn. The flavor text was more honest than my resume.\"", author: "Developer" },
  { text: "\"Most developer tools give you vanity metrics. DevMon gave me a class and a rarity tier that actually meant something.\"", author: "Open source contributor" },
  { text: "\"My PM saw my credential and said it was the most accurate representation of my work.\"", author: "Engineering lead" },
];

function QuoteStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="max-w-2xl mx-auto space-y-8">
      {quotes.map((q, i) => (
        <motion.div
          key={i}
          className="relative pl-6 border-l border-border-subtle"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 * i, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[18px] text-text-primary font-display font-[400] leading-[1.5]">
            {q.text}
          </p>
          <p className="text-[13px] font-mono text-text-tertiary mt-2">{q.author}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ─── FeatureSplit ──────────────────────────────────────────
function FeatureSplit({
  eyebrow,
  headline,
  description,
  bullets,
  visual,
  reverse = false,
}: {
  eyebrow: string;
  headline: string;
  description: string;
  bullets: string[];
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div
      ref={ref}
      className={`grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center ${reverse ? "md:direction-rtl" : ""}`}
    >
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, x: reverse ? 40 : -40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="font-mono text-[13px] font-medium uppercase tracking-[0.08em] text-text-tertiary">
          {eyebrow}
        </span>
        <h2 className="font-display text-[36px] md:text-[40px] leading-[1.1] font-[600] tracking-[-0.02em] text-text-primary">
          {headline}
        </h2>
        <p className="text-[16px] text-text-secondary leading-[1.7]">
          {description}
        </p>
        <ul className="space-y-3 pt-2">
          {bullets.map((b, i) => (
            <motion.li
              key={i}
              className="flex items-start gap-3 text-[15px] text-text-secondary"
              initial={{ opacity: 0, x: -12 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="mt-1 w-1 h-1 rounded-full bg-text-tertiary shrink-0" />
              {b}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        className="relative"
        initial={{ opacity: 0, x: reverse ? -40 : 40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {visual}
      </motion.div>
    </div>
  );
}

// ─── MiniStatBars ──────────────────────────────────────────
function MiniStatBars() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const stats = [
    { label: "EXECUTION", value: 82, color: "var(--text-primary)" },
    { label: "IMPACT", value: 67, color: "var(--text-primary)" },
    { label: "SYNERGY", value: 91, color: "var(--text-primary)" },
    { label: "MASTERY", value: 45, color: "var(--text-primary)" },
    { label: "CONSISTENCY", value: 58, color: "var(--text-primary)" },
  ];

  return (
    <div ref={ref} className="w-full max-w-xs space-y-3">
      {stats.map((s, i) => (
        <div key={s.label} className="flex items-center gap-3">
          <span className="w-20 sm:w-16 text-[11px] font-mono font-medium uppercase tracking-[0.06em] text-text-tertiary text-right shrink-0">
            {s.label}
          </span>
          <div className="flex-1 h-1.5 rounded-full surface-track overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: s.color }}
              initial={{ width: 0 }}
              animate={isInView ? { width: `${s.value}%` } : {}}
              transition={{ duration: 0.8, delay: 0.2 + 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <span className="w-8 text-[11px] font-mono text-text-tertiary tabular-nums shrink-0">
            {s.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── HowItWorksStep ────────────────────────────────────────
function HowItWorksStep({
  number,
  title,
  description,
  index,
}: {
  number: string;
  title: string;
  description: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="relative flex gap-6"
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.12 * index, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="shrink-0 w-10 h-10 rounded-[8px] surface-card flex items-center justify-center">
        <span className="font-mono text-[13px] font-medium text-text-tertiary">{number}</span>
      </div>
      <div>
        <h3 className="font-display text-[20px] font-[600] tracking-[-0.01em] text-text-primary mb-1">
          {title}
        </h3>
        <p className="text-[15px] text-text-secondary leading-[1.6]">{description}</p>
      </div>
    </motion.div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────
export default function LandingPage() {
  const [cardCount, setCardCount] = useState<number | null>(null);
  const [heroLoaded, setHeroLoaded] = useState(false);

  const heroRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.96]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, 60]);

  useEffect(() => {
    setTimeout(() => setHeroLoaded(true), 50);
  }, []);

  useEffect(() => {
    fetch("/api/card")
      .then((r) => r.json())
      .then((d) => setCardCount(d.count))
      .catch(() => setCardCount(0));
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches || !heroRef.current) return;

    let cleanup: (() => void) | undefined;
    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
      tl.fromTo(
        heroRef.current,
        { fontWeight: 640, letterSpacing: "-0.02em" },
        { fontWeight: 700, letterSpacing: "-0.04em", duration: 1 }
      );

      cleanup = () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    };
    init();
    return () => { cleanup?.(); };
  }, []);

  const handleSignIn = async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  return (
    <main ref={containerRef} className="min-h-screen flex flex-col">
      {/* ═══════ THEME TOGGLE ═══════ */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50">
        <ThemeToggle />
      </div>

      {/* ═══════ HERO ═══════ */}
      <motion.section
        className="relative min-h-screen flex flex-col items-center justify-center px-6 grid-bg overflow-hidden"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        {/* Mouse-tracking gradient orb */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            x: mouseX,
            y: mouseY,
            translateX: "-50%",
            translateY: "-50%",
            width: 600,
            height: 600,
            background: "radial-gradient(circle, var(--overlay-3) 0%, transparent 70%)",
          }}
        />

        {/* Corner accent lines */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[15%] left-[10%] w-px h-24 bg-gradient-to-b from-transparent via-[var(--overlay-5)] to-transparent" />
          <div className="absolute top-[25%] right-[12%] w-px h-16 bg-gradient-to-b from-transparent via-[var(--overlay-3)] to-transparent" />
          <div className="absolute bottom-[20%] left-[20%] w-px h-20 bg-gradient-to-b from-transparent via-[var(--overlay-4)] to-transparent" />
        </div>

        <motion.div
          className="relative z-10 flex flex-col items-center text-center max-w-4xl"
          initial="hidden"
          animate={heroLoaded ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }}
        >
          {/* Badge */}
          <motion.div
            variants={variants.fadeUp}
            className="mb-10 inline-flex items-center gap-2.5 px-4 py-2 rounded-full surface-badge"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-text-primary opacity-40 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-text-primary" />
            </span>
            <span className="font-mono text-[13px] font-medium tracking-[0.04em] text-text-secondary">
              v0.1 · Developer Credential Platform
            </span>
          </motion.div>

          {/* Massive title — word-by-word reveal */}
          <motion.div variants={variants.fadeUp} className="overflow-hidden">
            <h1
              ref={heroRef}
              className="font-display leading-[0.88] font-[640] tracking-[-0.02em] text-text-primary"
              style={{ fontSize: "clamp(4rem, 10vw, 9rem)" }}
            >
              DevMon
            </h1>
          </motion.div>

          {/* Subline with stagger */}
          <motion.p
            variants={variants.fadeUp}
            className="mt-8 text-[17px] text-text-secondary max-w-xl leading-[1.7]"
          >
            Generate a verified developer credential from your public GitHub activity.
            Repos, commits, pull requests, and community contributions scored into a single profile.
          </motion.p>

          {/* CTA */}
          <motion.div variants={variants.fadeUp} className="mt-12">
            <MagneticButton onClick={handleSignIn} variant="secondary" className="!text-text-primary">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Continue with GitHub
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={heroLoaded ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <span className="text-[11px] font-mono text-text-tertiary uppercase tracking-[0.12em]">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-text-tertiary to-transparent animate-scroll-hint" />
        </motion.div>
      </motion.section>

      {/* ═══════ MARQUEE ═══════ */}
      <HorizontalMarquee />

      {/* ═══════ MANIFESTO ═══════ */}
      <section className="py-20 md:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <WordReveal
            text="Your GitHub activity is a record of how you build software. Every commit, every pull request, every repository tells a story. DevMon turns that record into a verified credential with a class, rarity, and score."
            className="font-display text-[28px] md:text-[36px] leading-[1.3] font-[500] tracking-[-0.01em] text-text-primary"
          />
        </div>
      </section>

      {/* ═══════ STATS ═══════ */}
      <section className="py-24 md:py-16 px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          <AnimatedCounter value={cardCount !== null ? cardCount : 0} label="Credentials Generated" />
          <div className="w-px h-16 bg-border-subtle hidden sm:block" />
          <AnimatedCounter value={5} label="Rarity Tiers" />
          <div className="w-px h-16 bg-border-subtle hidden sm:block" />
          <AnimatedCounter value={12} label="Developer Classes" />
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="py-32 md:py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-24 items-start">
          <div>
            <span className="font-mono text-[13px] font-medium uppercase tracking-[0.08em] text-text-tertiary">
              How it works
            </span>
            <h2 className="font-display text-[36px] md:text-[42px] leading-[1.1] font-[600] tracking-[-0.02em] text-text-primary mt-3">
              Three steps.<br />One developer credential.
            </h2>
            <p className="text-[16px] text-text-secondary leading-[1.7] mt-6 max-w-md">
              No accounts to create, no configuration required. Sign in with GitHub and the scoring engine analyzes your public activity.
            </p>
          </div>
          <div className="space-y-10">
            <HowItWorksStep number="01" title="Connect GitHub" description="One click. DevMon requests read-only access to your public profile and repositories." index={0} />
            <HowItWorksStep number="02" title="Get scored" description="Your commits, pull requests, language diversity, and community activity are analyzed through a developer-focused scoring engine." index={1} />
            <HowItWorksStep number="03" title="Share" description="Download your credential. Share it on LinkedIn or X. Your verified developer profile, ready to present." index={2} />
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES — split layouts ═══════ */}
      <section className="py-20 md:py-24 px-6 space-y-20 md:space-y-24">
        {/* Feature 1 — Stats Engine */}
        <FeatureSplit
          eyebrow="Scoring Engine"
          headline="Five attributes. One developer profile."
          description="Execution, Impact, Synergy, Mastery, and Consistency. Five behavioural attributes computed from 15 normalized metrics, each measuring a different dimension of how you build software."
          bullets={[
            "Execution tracks commit output, repository building, and delivery cadence",
            "Impact measures star power, community reach, and adoption",
            "Synergy evaluates PR collaboration, issue engagement, and organisational presence",
            "Mastery covers language breadth, project diversity, and quality signal",
            "Consistency captures streak strength, activity regularity, and longevity",
          ]}
          visual={<MiniStatBars />}
        />

        {/* Feature 2 — Rarity */}
        <FeatureSplit
          eyebrow="Rarity"
          headline="Five tiers of developer rarity."
          description="Every credential is assigned a rarity tier based on your scoring percentile. Common to Mythic. The distribution is intentional. Most developers land in Common."
          bullets={[
            "Common: the baseline tier",
            "Rare: above average activity",
            "Epic: top 10% of developers",
            "Legendary: statistically rare",
            "Mythic: top 0.5% of all users",
          ]}
          visual={<RarityShowcase />}
          reverse
        />

        {/* Feature 3 — Flavor Text */}
        <FeatureSplit
          eyebrow="Flavor Text"
          headline="Unique credential text, generated per profile."
          description="Every credential includes a unique flavor text generated from your repository patterns and contribution behavior. Pattern-matched from real data, not generated by AI."
          bullets={[
            "Zero-star repositories are referenced by name",
            "Commit streaks influence the tone of the text",
            "PR merge ratios shape your credential narrative",
            "Each developer class has its own text style",
          ]}
          visual={
            <div className="rounded-[10px] surface-card-elevated p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-medium uppercase tracking-[0.06em] text-text-tertiary">Rare · Polyglot Artisan</span>
              </div>
              <p className="text-[15px] text-text-secondary leading-[1.6] italic">
                &ldquo;Your 14 languages are like a box of crayons where half are the same shade of gray.&rdquo;
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-border-hairline">
                <span className="text-[12px] font-mono text-text-tertiary">Flavor Text · Pattern-matched</span>
              </div>
            </div>
          }
        />
      </section>

      {/* ═══════ LEADERBOARD PREVIEW ═══════ */}
      <LeaderboardPreview />

      {/* ═══════ QUOTES ═══════ */}
      <section className="py-32 md:py-24 px-6">
        <div className="max-w-2xl mx-auto mb-16 text-center">
          <span className="font-mono text-[13px] font-medium uppercase tracking-[0.08em] text-text-tertiary">
            From users
          </span>
          <h2 className="font-display text-[36px] md:text-[42px] leading-[1.1] font-[600] tracking-[-0.02em] text-text-primary mt-3">
            Verified by developers.
          </h2>
        </div>
        <QuoteStrip />
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <motion.h2
            className="font-display text-[48px] md:text-[64px] leading-[0.95] font-[640] tracking-[-0.03em] text-text-primary"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Generate your developer credential.
          </motion.h2>
          <motion.p
            className="text-[17px] text-text-secondary max-w-md mx-auto leading-[1.7]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Connect your GitHub account. Get a verified developer profile scored from your public activity.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <MagneticButton onClick={handleSignIn} variant="secondary" className="!text-text-primary">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              Continue with GitHub
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      {/* ═══════ STAR ON GITHUB ═══════ */}
      <section className="py-24 md:py-16 px-6 relative overflow-hidden">
        {/* Subtle radial glow behind text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full max-w-[600px] sm:w-[600px] h-[200px] sm:h-[300px] rounded-full bg-gradient-to-b from-[var(--overlay-4)] to-transparent blur-3xl opacity-60" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center space-y-10">
          {/* Decorative line */}
          <motion.div
            className="mx-auto w-12 h-px bg-gradient-to-r from-transparent via-[var(--overlay-12)] to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Headline */}
          <motion.h2
            className="font-display text-[40px] md:text-[52px] leading-[1.05] font-[640] tracking-[-0.03em] text-text-primary"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Free and open source
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-[17px] text-text-secondary leading-[1.7] max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            DevMon is free and open source under AGPL-3.0.<br />
            The code is fully auditable. If you find it valuable, a star on GitHub helps other developers discover the project.
          </motion.p>

          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <a
              href="https://github.com/ShravanDeb/DevMon"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-[6px] px-6 py-3 text-[13px] leading-none font-medium surface-btn text-text-primary"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              Star on GitHub
            </a>
          </motion.div>

          {/* Counter line */}
          <motion.p
            className="text-[13px] font-mono text-text-tertiary"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            AGPL-3.0 · free forever · built by developers
          </motion.p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
