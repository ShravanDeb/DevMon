"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";

interface MagneticButtonProps {
  children: React.ReactNode;
  as?: "button" | "a";
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary";
}

export function MagneticButton({
  children,
  as = "button",
  href,
  onClick,
  disabled = false,
  className = "",
  variant = "primary",
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || disabled) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPos({ x: x * 0.2, y: y * 0.2 });
  };

  const handleMouseLeave = () => setPos({ x: 0, y: 0 });

  const base = variant === "primary"
    ? "surface-btn-accent font-medium"
    : "surface-btn text-text-primary";

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.97 }}
      animate={{ x: disabled ? 0 : pos.x, y: disabled ? 0 : pos.y }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`inline-flex items-center justify-center gap-2 rounded-[6px] px-5 py-2.5 text-[13px] leading-none transition-colors ${base} ${disabled ? "opacity-40 pointer-events-none" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );

  if (as === "a" && href) {
    return <a href={href} style={{ pointerEvents: disabled ? "none" : undefined }}>{content}</a>;
  }

  return <button onClick={onClick} disabled={disabled} type="button">{content}</button>;
}
