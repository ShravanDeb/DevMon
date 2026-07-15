"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { LeaderboardEntry, Rarity } from "@/types";
import { RARITY_COLORS } from "@/types";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";

type SortKey = "rarity" | "mergeForce" | "codeVelocity" | "problemSolving" | "openSource" | "consistency";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "rarity", label: "Rarity" },
  { value: "mergeForce", label: "Merge Force" },
  { value: "codeVelocity", label: "Code Velocity" },
  { value: "problemSolving", label: "Problem Solving" },
  { value: "openSource", label: "Open Source" },
  { value: "consistency", label: "Consistency" },
];

function EmptyState() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-24 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-20 h-20 rounded-[16px] surface-card flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.996.178-1.796.838-1.996 1.815a11.086 11.086 0 002.077 3.396c.273.518.537 1.06.784 1.622.247.562.48 1.172.693 1.833.118.36.223.728.312 1.102.09.374.157.753.203 1.138.046.385.07.775.07 1.172 0 .397-.024.787-.07 1.172-.046.385-.111.764-.203 1.138-.09.374-.195.742-.312 1.102-.213.661-.456 1.271-.693 1.833-.247.562-.51 1.104-.784 1.622a11.086 11.086 0 01-2.077 3.396c-.2.977-1.0 1.637-1.996 1.815" />
        </svg>
      </div>
      <h3 className="font-display text-[24px] font-[600] text-text-primary mb-2">
        No credentials yet
      </h3>
      <p className="text-[14px] text-text-secondary mb-6 max-w-sm">
        Be the first developer to generate a credential and claim your spot on the leaderboard.
      </p>
      <a
        href="/card"
        className="inline-flex items-center gap-2 rounded-[10px] surface-btn-accent px-6 py-3 text-[13px] font-semibold"
      >
        Generate Your Credential
      </a>
    </motion.div>
  );
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>("rarity");
  const [companyFilter, setCompanyFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("limit", "50");
    params.set("_t", Date.now().toString());
    if (companyFilter) params.set("company", companyFilter);

    fetch(`/api/leaderboard?${params}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setEntries(data.entries || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [companyFilter]);

  const sortedEntries = [...entries].sort((a, b) => {
    if (sortBy === "rarity") {
      const rarityOrder: Record<Rarity, number> = { Common: 0, Rare: 1, Epic: 2, Legendary: 3, Mythic: 4 };
      const rarityDiff = rarityOrder[b.rarity] - rarityOrder[a.rarity];
      if (rarityDiff !== 0) return rarityDiff;
      return b.rarityScore - a.rarityScore;
    }
    return (b.stats?.[sortBy] ?? 0) - (a.stats?.[sortBy] ?? 0);
  });

  return (
    <main className="min-h-screen bg-surface-0 flex flex-col items-center px-4 pt-20 pb-20 md:pt-16 md:pb-16">
      <div className="fixed top-4 right-4 z-40"><ThemeToggle /></div>
      <div className="w-full max-w-4xl">
        {/* Header */}
        <motion.div
          className="mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-mono text-[13px] font-medium uppercase tracking-[0.08em] text-text-tertiary">
            Rankings
          </span>
          <h1 className="font-display text-[28px] sm:text-[36px] md:text-[42px] leading-[1.1] font-[600] tracking-[-0.02em] text-text-primary mt-3">
            DevMon Leaderboard
          </h1>
          <p className="text-[15px] text-text-secondary mt-3 max-w-md">
            Top developer credentials ranked by rarity score. Every entry is a verified GitHub identity.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <input
            type="text"
            placeholder="Filter by company..."
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="flex-1 rounded-[10px] surface-input px-4 py-3 text-[13px] placeholder-text-tertiary font-mono"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="rounded-[10px] surface-input px-4 py-3 text-[13px] appearance-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-6 h-6 rounded-full border-2 border-text-primary border-t-transparent animate-spin"
            />
          </div>
        )}

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-4 rounded-[10px] surface-card text-[13px] text-text-secondary text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!loading && !error && sortedEntries.length === 0 && <EmptyState />}

        {/* Leaderboard entries */}
        {!loading && !error && sortedEntries.length > 0 && (
          <div className="space-y-3">
            {sortedEntries.map((entry, i) => {
              const rarityColor = RARITY_COLORS[entry.rarity];
              return (
                <motion.div
                  key={entry.username}
                  className="rounded-[12px] surface-card p-4 sm:p-5 flex items-center gap-3 sm:gap-6 group hover:scale-[1.005] transition-transform"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 + Math.min(i, 8) * 0.04 }}
                >
                  {/* Rank */}
                  <div className="shrink-0 w-10 text-center">
                    <span
                      className="font-display text-[24px] font-[800] tracking-[-0.02em] leading-none"
                      style={{ color: i < 3 ? rarityColor.hex : "var(--text-tertiary)" }}
                    >
                      {i + 1}
                    </span>
                  </div>

                  {/* Avatar */}
                  <div className="shrink-0">
                    <div
                      className="w-12 h-12 rounded-full overflow-hidden"
                      style={{ border: `2px solid ${rarityColor.hex}40` }}
                    >
                      <img
                        src={entry.avatarUrl}
                        alt={entry.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-[15px] font-semibold text-text-primary truncate">
                        {entry.displayName}
                      </h3>
                      <span
                        className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] px-2 py-[2px] rounded-full shrink-0"
                        style={{
                          color: rarityColor.hex,
                          background: `${rarityColor.hex}12`,
                          border: `1px solid ${rarityColor.hex}20`,
                        }}
                      >
                        {entry.rarity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                      <span className="text-[13px] font-mono text-text-tertiary truncate min-w-0">
                        @{entry.username}
                      </span>
                      <span className="w-[1px] h-3 bg-[var(--overlay-8)]" />
                      <span className="text-[12px] text-text-tertiary truncate">
                        {entry.primaryClass}
                      </span>
                    </div>
                  </div>

                  {/* Stats - desktop only */}
                  <div className="hidden md:flex items-center gap-6 shrink-0">
                    {(["mergeForce", "codeVelocity", "problemSolving", "openSource", "consistency"] as const).map((key) => (
                      <div key={key} className="text-center">
                        <span className="block font-mono text-[16px] font-semibold text-text-primary tabular-nums">
                          {entry.stats?.[key] ?? "-"}
                        </span>
                        <span className="block font-mono text-[9px] text-text-tertiary uppercase tracking-[0.06em]">
                          {key === "mergeForce" ? "MRG" : key === "codeVelocity" ? "VLK" : key === "problemSolving" ? "PRB" : key === "openSource" ? "OST" : "CON"}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Rarity score */}
                  <div className="shrink-0 text-right">
                    <span
                      className="font-display text-[18px] sm:text-[22px] font-[700] tracking-[-0.01em] leading-none"
                      style={{ color: rarityColor.hex }}
                    >
                      {entry.rarityScore}
                    </span>
                    <span className="block font-mono text-[9px] text-text-tertiary uppercase tracking-[0.06em] mt-1">
                      Score
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <a
            href="/card"
            className="inline-flex items-center gap-2 rounded-[10px] surface-btn-accent px-6 py-3 text-[13px] font-semibold"
          >
            Generate Your Credential
          </a>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
