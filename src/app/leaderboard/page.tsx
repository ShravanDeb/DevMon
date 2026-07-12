"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { LeaderboardEntry, Rarity } from "@/types";
import { SectionHeader } from "@/components/SectionHeader";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";

const rarityOrder: Record<Rarity, number> = {
  Common: 0,
  Rare: 1,
  Epic: 2,
  Legendary: 3,
  Mythic: 4,
};

const rarityDotBg: Record<Rarity, string> = {
  Common: "bg-[#8A8F98]",
  Rare: "bg-[#3E6FE0]",
  Epic: "bg-[#6C4BA6]",
  Legendary: "bg-[#E0932E]",
  Mythic: "bg-[#B23A48]",
};

type SortKey = "rarity" | "mergeForce" | "codeVelocity" | "problemSolving" | "openSource" | "consistency";

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
    if (companyFilter) params.set("company", companyFilter);

    fetch(`/api/leaderboard?${params}`)
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
      const rarityDiff = rarityOrder[b.rarity] - rarityOrder[a.rarity];
      if (rarityDiff !== 0) return rarityDiff;
      return b.rarityScore - a.rarityScore;
    }
    return (b.stats?.[sortBy] ?? 0) - (a.stats?.[sortBy] ?? 0);
  });

  return (
    <main className="min-h-screen bg-surface-0 flex flex-col items-center px-4 pt-32 pb-32 md:pt-16 md:pb-16">
      <div className="fixed top-4 right-4 z-40"><ThemeToggle /></div>
      <div className="w-full max-w-4xl">
        <div className="mb-12">
          <SectionHeader eyebrow="Rankings" headline="DevMon Leaderboard" />
        </div>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <input
            type="text"
            placeholder="Filter by company..."
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="flex-1 rounded-[8px] neu-input px-4 py-2.5 text-[13px] placeholder-text-tertiary font-mono"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="rounded-[8px] neu-select px-4 py-2.5 text-[13px]"
          >
            <option value="rarity">Rarity</option>
            <option value="mergeForce">Merge Force</option>
            <option value="codeVelocity">Code Velocity</option>
            <option value="problemSolving">Problem Solving</option>
            <option value="openSource">Open Source</option>
            <option value="consistency">Consistency</option>
          </select>
        </motion.div>

        {loading && (
          <div className="flex justify-center py-16">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-6 h-6 rounded-[9999px] border-2 border-text-primary border-t-transparent animate-spin"
            />
          </div>
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-4 rounded-[8px] neu-inset text-[13px] text-text-secondary text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && !error && (
          <motion.div
            className="rounded-md overflow-hidden neu-raised"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-surface-1">
                  <th className="px-4 py-3 text-left text-text-tertiary font-mono text-[13px] uppercase tracking-[0.08em] font-medium">#</th>
                  <th className="px-4 py-3 text-left text-text-tertiary font-mono text-[13px] uppercase tracking-[0.08em] font-medium">Dev</th>
                  <th className="px-4 py-3 text-center text-text-tertiary font-mono text-[13px] uppercase tracking-[0.08em] font-medium">Class</th>
                  <th className="px-4 py-3 text-center text-text-tertiary font-mono text-[13px] uppercase tracking-[0.08em] font-medium">Rarity</th>
                  <th className="px-4 py-3 text-center text-text-tertiary font-mono text-[11px] uppercase tracking-[0.08em] font-medium">MRG</th>
                  <th className="px-4 py-3 text-center text-text-tertiary font-mono text-[11px] uppercase tracking-[0.08em] font-medium">VLK</th>
                  <th className="px-4 py-3 text-center text-text-tertiary font-mono text-[11px] uppercase tracking-[0.08em] font-medium">PRB</th>
                  <th className="px-4 py-3 text-center text-text-tertiary font-mono text-[11px] uppercase tracking-[0.08em] font-medium">OST</th>
                  <th className="px-4 py-3 text-center text-text-tertiary font-mono text-[11px] uppercase tracking-[0.08em] font-medium">CON</th>
                </tr>
              </thead>
              <tbody>
                {sortedEntries.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-16 text-center text-text-tertiary text-[13px]">
                      No credentials generated yet. Be the first!
                    </td>
                  </tr>
                )}
                {sortedEntries.map((entry, i) => (
                  <motion.tr
                    key={entry.username}
                    className="border-t border-border-hairline hover:bg-surface-1/50 transition-colors"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.25 + Math.min(i, 4) * 0.06 }}
                  >
                    <td className="px-4 py-3 text-text-tertiary font-mono text-[13px] tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={entry.avatarUrl}
                          alt={entry.username}
                          className="w-8 h-8 rounded-[9999px]"
                        />
                        <div>
                          <div className="text-text-primary font-medium text-[13px]">{entry.displayName}</div>
                          <div className="text-text-tertiary text-[13px] font-mono">@{entry.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-[13px] text-text-secondary font-mono">
                        {entry.primaryClass}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block w-2 h-2 rounded-[9999px] ${rarityDotBg[entry.rarity]}`} />
                      <span className="ml-1.5 text-[13px] font-mono font-medium text-text-primary tabular-nums">
                        {entry.rarity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-[13px] text-text-primary tabular-nums">{entry.stats?.mergeForce ?? "-"}</td>
                    <td className="px-4 py-3 text-center font-mono text-[13px] text-text-primary tabular-nums">{entry.stats?.codeVelocity ?? "-"}</td>
                    <td className="px-4 py-3 text-center font-mono text-[13px] text-text-primary tabular-nums">{entry.stats?.problemSolving ?? "-"}</td>
                    <td className="px-4 py-3 text-center font-mono text-[13px] text-text-primary tabular-nums">{entry.stats?.openSource ?? "-"}</td>
                    <td className="px-4 py-3 text-center font-mono text-[13px] text-text-primary tabular-nums">{entry.stats?.consistency ?? "-"}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        <div className="mt-10 text-center">
          <a
            href="/card"
            className="inline-flex items-center gap-2 rounded-[8px] neu-btn-accent px-5 py-2.5 text-[13px] font-medium"
          >
            Generate Your Credential
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
