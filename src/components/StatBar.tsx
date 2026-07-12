"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface StatBarProps {
  label: string;
  value: number;
  color: string;
  delay?: number;
}

export function StatBar({ label, value, color, delay = 0 }: StatBarProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (value === 0) return;
    const duration = 700;
    const steps = 25;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="flex items-center gap-2 w-full">
      <span className="w-[52px] text-[10px] font-mono font-medium uppercase tracking-[0.1em] text-text-tertiary text-right shrink-0">
        {label}
      </span>
      <div className="flex-1 h-[6px] stat-bar-track">
        <motion.div
          className="h-full stat-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, value)}%` }}
          transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: `linear-gradient(90deg, ${color}90 0%, ${color} 100%)`,
            boxShadow: `0 0 8px ${color}40, 0 0 2px ${color}60`,
          }}
        />
      </div>
      <motion.span
        className="w-7 text-[10px] font-mono text-text-primary text-right tabular-nums font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, delay: delay + 0.3 }}
      >
        {count}
      </motion.span>
    </div>
  );
}
