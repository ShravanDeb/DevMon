"use client";

import { motion } from "motion/react";
import type { Rarity } from "@/types";
import { RARITY_COLORS } from "@/types";

interface RarityBadgeProps {
  rarity: Rarity;
  score: number;
  delay?: number;
}

export function RarityBadge({ rarity, score, delay = 0 }: RarityBadgeProps) {
  const color = RARITY_COLORS[rarity].hex;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, delay }}
      className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.1em] font-mono overflow-hidden"
      style={{
        background: `${color}18`,
        border: `1px solid ${color}30`,
        color: color,
      }}
    >
      {/* Shimmer sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(105deg, transparent 30%, ${color}15 50%, transparent 70%)`,
          backgroundSize: "200% 100%",
        }}
        animate={{
          backgroundPosition: ["200% 0", "-200% 0"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
          delay: delay + 0.5,
        }}
      />
      <span className="relative z-10">{rarity}</span>
      <span className="relative z-10 opacity-60 tabular-nums font-medium">{score}</span>
    </motion.div>
  );
}
