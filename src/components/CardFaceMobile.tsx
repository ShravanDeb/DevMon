"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import type { CardData, CardStats, Rarity } from "@/types";
import { RARITY_COLORS, STAT_LABELS, CLASS_SUBTITLES } from "@/types";
import { QRCodeSVG } from "qrcode.react";
import React from "react";

const PRIMARY_ACHIEVEMENTS = ["Stars", "Contributions", "Day Streak"];

interface CardFaceProps {
  card: CardData;
  rarityOverride?: Rarity;
}

function buildGradient(stops: string[]): string {
  return `linear-gradient(170deg, ${stops[0]} 0%, ${stops[1]} 25%, ${stops[2]} 50%, ${stops[3]} 75%, ${stops[4]} 100%)`;
}

function getRarityHue(r: Rarity): string {
  switch (r) {
    case "Common": return "0 0% 60%";
    case "Rare": return "215 55% 50%";
    case "Epic": return "265 45% 50%";
    case "Legendary": return "42 65% 50%";
    case "Mythic": return "350 55% 40%";
  }
}

function getRarityBarColors(r: Rarity, dark: boolean): { start: string; end: string } {
  if (dark) {
    switch (r) {
      case "Common": return { start: "#3A3A40", end: "#4A4A50" };
      case "Rare": return { start: "#1A3A6A", end: "#2A5A9A" };
      case "Epic": return { start: "#2A1A5A", end: "#4A2A8A" };
      case "Legendary": return { start: "#5A4A10", end: "#8A6A1A" };
      case "Mythic": return { start: "#5A1A2A", end: "#8A2A3A" };
    }
  } else {
    switch (r) {
      case "Common": return { start: "#B0B0B0", end: "#C8C8C8" };
      case "Rare": return { start: "#5A9AE0", end: "#7ABAE0" };
      case "Epic": return { start: "#7A52C0", end: "#9A72E0" };
      case "Legendary": return { start: "#D09820", end: "#E0B840" };
      case "Mythic": return { start: "#C83050", end: "#E85070" };
    }
  }
}

function getRarityFrameStyle(r: Rarity, dark: boolean): React.CSSProperties {
  if (dark) {
    switch (r) {
      case "Common": return {};
      case "Rare": return {
        background: "linear-gradient(160deg, rgba(74,124,201,0.08) 0%, rgba(74,124,201,0.03) 50%, rgba(74,124,201,0.08) 100%)",
      };
      case "Epic": return {
        background: "linear-gradient(125deg, rgba(124,92,184,0.08) 0%, rgba(124,92,184,0.03) 40%, rgba(124,92,184,0.08) 100%)",
      };
      case "Legendary": return {
        background: "linear-gradient(160deg, rgba(200,148,60,0.10) 0%, rgba(200,148,60,0.04) 50%, rgba(200,148,60,0.10) 100%)",
        boxShadow: "inset 0 0 0 1px rgba(200,148,60,0.08)",
      };
      case "Mythic": return {
        background: "linear-gradient(160deg, rgba(176,64,80,0.09) 0%, rgba(176,64,80,0.03) 45%, rgba(150,85,55,0.06) 55%, rgba(176,64,80,0.09) 100%)",
        boxShadow: "inset 0 0 0 1px rgba(176,64,80,0.08)",
      };
    }
  } else {
    switch (r) {
      case "Common": return {};
      case "Rare": return {
        background: "linear-gradient(160deg, rgba(74,124,201,0.06) 0%, rgba(74,124,201,0.02) 50%, rgba(74,124,201,0.06) 100%)",
      };
      case "Epic": return {
        background: "linear-gradient(125deg, rgba(124,92,184,0.06) 0%, rgba(124,92,184,0.02) 40%, rgba(124,92,184,0.06) 100%)",
      };
      case "Legendary": return {
        background: "linear-gradient(160deg, rgba(160,120,40,0.07) 0%, rgba(160,120,40,0.02) 50%, rgba(160,120,40,0.07) 100%)",
        boxShadow: "inset 0 0 0 1px rgba(160,120,40,0.06)",
      };
      case "Mythic": return {
        background: "linear-gradient(160deg, rgba(160,60,75,0.06) 0%, rgba(160,60,75,0.02) 45%, rgba(140,80,50,0.05) 55%, rgba(160,60,75,0.06) 100%)",
        boxShadow: "inset 0 0 0 1px rgba(160,60,75,0.06)",
      };
    }
  }
}

export const CardFaceMobile = React.memo(function CardFaceMobile({ card, rarityOverride }: CardFaceProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const rarity = rarityOverride ?? card.rarity;
  const rarityColor = RARITY_COLORS[rarity];
  const gradient = buildGradient(rarityColor.gradientDark);
  const cardHue = getRarityHue(rarity);
  const frameStyle = getRarityFrameStyle(rarity, true);
  const barColors = getRarityBarColors(rarity, true);

  const heroStat = card.heroStat;
  const heroStatValueRef = useRef<HTMLSpanElement>(null);
  const [heroFontSize, setHeroFontSize] = useState(28);

  useEffect(() => {
    const el = heroStatValueRef.current;
    if (!el) return;

    const container = el.parentElement;
    if (!container) return;

    const measure = () => {
      const containerWidth = container.clientWidth;
      if (containerWidth === 0) return;

      const availableWidth = containerWidth;

      for (let size = 32; size >= 13; size -= 1) {
        el.style.fontSize = `${size}px`;
        if (el.scrollWidth <= availableWidth) {
          setHeroFontSize(size);
          return;
        }
      }
      setHeroFontSize(13);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, [heroStat.value]);

  const stats: { key: keyof CardStats; label: string }[] = useMemo(() => [
    { key: "mergeForce", label: STAT_LABELS.mergeForce },
    { key: "codeVelocity", label: STAT_LABELS.codeVelocity },
    { key: "problemSolving", label: STAT_LABELS.problemSolving },
    { key: "openSource", label: STAT_LABELS.openSource },
    { key: "consistency", label: STAT_LABELS.consistency },
  ], []);

  const heroStatKey = heroStat.key as keyof CardStats | null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://devmon.dev";
  const verifyUrl = `${siteUrl}/verify/${card.verification.cardId}`;

  const formattedDate = useMemo(() => {
    const d = new Date(card.verification.generatedAt);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  }, [card.verification.generatedAt]);

  const primaryAchievements = card.achievements.filter((a) => PRIMARY_ACHIEVEMENTS.includes(a.label));
  const secondaryAchievements = card.achievements.filter((a) => !PRIMARY_ACHIEVEMENTS.includes(a.label));

  return (
    <div className="flex flex-col items-center w-full card-mobile" data-theme="dark">
      <motion.div
        ref={cardRef}
        className="relative"
        style={{ perspective: "949px" }}
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={revealed ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      >
        <div
          className="relative rounded-[12px] p-[1px]"
          style={{
            ...frameStyle,
            boxShadow: "0 4px 16px rgba(0,0,0,0.14), 0 1px 4px rgba(0,0,0,0.1)",
            transition: "box-shadow 0.6s ease",
          }}
        >
          <motion.div
            className="relative w-[320px] h-[500px] rounded-[11px] overflow-hidden card-soft-reflection"
            style={{
              transformStyle: "preserve-3d",
              ["--card-hue" as string]: cardHue,
              ["--rarity-color" as string]: rarityColor.hex,
            } as React.CSSProperties}
          >
            <div className="absolute inset-0" style={{ background: gradient }} />

            {rarity === "Common" && <div className="absolute inset-0 card-surface-common" />}
            {rarity === "Rare" && <div className="absolute inset-0 card-surface-rare" />}
            {rarity === "Epic" && <div className="absolute inset-0 card-surface-epic" />}
            {rarity === "Legendary" && <div className="absolute inset-0 card-surface-legendary" />}
            {rarity === "Mythic" && <div className="absolute inset-0 card-surface-mythic" />}

            {rarity === "Epic" && <div className="card-engraved-emblem card-engraved-emblem-epic" />}
            {rarity === "Legendary" && <div className="card-engraved-emblem card-engraved-emblem-legendary" />}
            {rarity === "Mythic" && <div className="card-engraved-emblem card-engraved-emblem-mythic" />}

            {rarity === "Legendary" && <div className="card-foil-border card-foil-border-legendary rounded-[11px]" />}
            {rarity === "Mythic" && <div className="card-foil-border card-foil-border-mythic rounded-[11px]" />}

            <div className="card-accent-bar" style={{ ["--rarity-color" as string]: rarityColor.hex } as React.CSSProperties} />

            <div className="relative z-10 flex flex-col h-full px-3 pt-3 pb-3 min-h-0">

              {card.rank != null && (
                <motion.div
                  className="absolute top-2.5 right-2.5 text-center z-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={revealed ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div
                    className="rounded-[7px] px-[7px] py-[5px] flex flex-col items-center"
                    style={{
                      background: `linear-gradient(135deg, ${rarityColor.hex}18, ${rarityColor.hex}08)`,
                      border: `1px solid ${rarityColor.hex}30`,
                      boxShadow: `0 0 14px ${rarityColor.hex}15, inset 0 1px 0 ${rarityColor.hex}10`,
                    }}
                  >
                    <span
                      className="font-display block leading-none"
                      style={{
                        fontSize: "28px",
                        fontWeight: 900,
                        letterSpacing: "-0.04em",
                        color: rarityColor.hex,
                        textShadow: `0 0 18px ${rarityColor.hex}50, 0 1px 2px rgba(0,0,0,0.3)`,
                      }}
                    >
                      #{card.rank}
                    </span>
                    <span
                      className="font-mono block mt-px uppercase tracking-[0.2em]"
                      style={{
                        fontSize: "5px",
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.55)",
                      }}
                    >
                      Overall{card.totalCards != null ? ` of ${card.totalCards}` : ""}
                    </span>
                  </div>
                </motion.div>
              )}

              <div className="flex items-start gap-1.5 mb-1 shrink-0">
                <motion.div
                  className="relative shrink-0 card-avatar-ring"
                  style={{ ["--rarity-color" as string]: rarityColor.hex } as React.CSSProperties}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={revealed ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="w-[31px] h-[31px] rounded-full overflow-hidden">
                    <img
                      src={card.avatarUrl}
                      alt={card.displayName}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                </motion.div>

                <div className="flex-1 min-w-0 pt-px">
                  <motion.div
                    className="flex items-center gap-1.5 mb-1"
                    initial={{ opacity: 0, x: -6 }}
                    animate={revealed ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span
                      className="font-mono text-[6px] font-semibold uppercase tracking-[0.16em] px-[5px] py-[2px] rounded-[2px]"
                      style={{
                        color: rarityColor.hex,
                        background: `${rarityColor.hex}12`,
                        border: `1px solid ${rarityColor.hex}1A`,
                      }}
                    >
                      {rarity}
                    </span>
                  </motion.div>

                  <motion.div
                    className="flex items-center gap-1.5 mb-1"
                    initial={{ opacity: 0, x: -6 }}
                    animate={revealed ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <svg
                      className="shrink-0"
                      viewBox="0 0 16 16"
                      width="11"
                      height="11"
                      fill="rgba(255,255,255,0.85)"
                    >
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                    <span
                      className="font-mono font-semibold text-text-primary"
                      style={{ fontSize: "9px", letterSpacing: "0.01em" }}
                    >
                      {card.username}
                    </span>
                  </motion.div>

                  <motion.h1
                    className="font-display text-[17px] font-[800] tracking-[-0.01em] uppercase leading-[1.15] card-embossed text-text-primary"
                    initial={{ opacity: 0, y: 5 }}
                    animate={revealed ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {card.primaryClass}
                  </motion.h1>

                  <motion.p
                    className="text-[8px] text-text-secondary mt-0.5 italic leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={revealed ? { opacity: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    {CLASS_SUBTITLES[card.primaryClass]}
                  </motion.p>
                </div>
              </div>

              <motion.div
                className="card-hero-stat mb-1.5 flex flex-col justify-center relative shrink-0 w-full"
                initial={{ opacity: 0, y: 6 }}
                animate={revealed ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="relative flex items-baseline gap-1 w-full min-w-0">
                  <span
                    ref={heroStatValueRef}
                    className="card-hero-stat-value card-hero-stat-gradient text-text-primary"
                    data-hero-number
                    style={{ fontSize: `${heroFontSize}px` }}
                  >
                    {heroStat.value}
                  </span>
                  {heroStat.unit && (
                    <span className="card-hero-stat-unit text-text-secondary shrink-0">
                      {heroStat.unit}
                    </span>
                  )}
                </div>
                <span className="card-hero-stat-label text-text-secondary">
                  {heroStat.label}
                </span>
              </motion.div>

              <motion.div
                className="rounded-[6px] p-[6px] mb-1.5 flex items-center gap-1.5 relative overflow-hidden shrink-0 card-signature-border"
                style={{
                  background: `color-mix(in srgb, ${rarityColor.hex}08, #1C1C20)`,
                  border: `1px solid #28282C`,
                  ["--rarity-color" as string]: rarityColor.hex,
                } as React.CSSProperties}
                initial={{ opacity: 0, y: 4 }}
                animate={revealed ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <div
                  className="w-[21px] h-[21px] rounded-[5px] flex items-center justify-center text-[9px] font-mono font-semibold shrink-0"
                  style={{
                    background: "#26262A",
                    color: rarityColor.hex,
                    border: `1px solid #32323A`,
                  }}
                >
                  {card.signatureMove.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-[7px] font-medium uppercase tracking-[0.14em] text-text-tertiary block mb-px">
                    Signature Move
                  </span>
                  <p className="text-[9px] font-semibold text-text-primary leading-normal">
                    {card.signatureMove.name}
                  </p>
                  <p className="text-[8px] text-text-secondary mt-0.5 leading-normal line-clamp-1">
                    {card.signatureMove.description}
                  </p>
                </div>
              </motion.div>

              <div className="mb-1.5 shrink-0">
                <span className="font-mono text-[7px] font-semibold uppercase tracking-[0.16em] text-text-tertiary block mb-1">
                  Attributes
                </span>
                <div className="space-y-1">
                  {stats.map((s, i) => {
                    const isHero = heroStatKey === s.key;
                    return (
                      <motion.div
                        key={s.key}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -3 }}
                        animate={revealed ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.3, delay: 0.45 + i * 0.03, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <span className={`font-mono shrink-0 tracking-[0.02em] text-[8px] w-[65px] ${isHero ? "font-semibold text-text-primary" : "font-medium text-text-secondary"}`}>
                          {s.label}
                        </span>
                        <div className="flex-1 card-stat-bar-track">
                          <motion.div
                            className={isHero ? "card-stat-bar-fill-hero" : "card-stat-bar-fill"}
                            style={{
                              ["--bar-start" as string]: barColors.start,
                              ["--bar-end" as string]: barColors.end,
                              ["--rarity-color" as string]: rarityColor.hex,
                            } as React.CSSProperties}
                            initial={{ width: 0 }}
                            animate={revealed ? { width: `${card.stats[s.key]}%` } : {}}
                            transition={{ duration: 0.6, delay: 0.5 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </div>
                        <span className={`font-mono text-right tabular-nums text-[8px] w-[19px] ${isHero ? "font-semibold text-text-primary" : "font-medium text-text-secondary"}`}>
                          {card.stats[s.key]}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="mb-1.5 shrink-0">
                <span className="font-mono text-[7px] font-semibold uppercase tracking-[0.16em] text-text-tertiary block mb-1">
                  Achievements
                </span>
                <motion.div
                  className="flex flex-wrap gap-0.5"
                  initial={{ opacity: 0 }}
                  animate={revealed ? { opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  {primaryAchievements.map((a) => (
                    <span
                      key={a.label}
                      className="card-achievement-badge card-achievement-badge-accent"
                      style={{ ["--rarity-color" as string]: rarityColor.hex } as React.CSSProperties}
                    >
                      <span className="card-achievement-badge-icon">{a.icon}</span>
                      <span className="card-achievement-badge-value">{a.value}</span>
                      <span className="card-achievement-badge-label">{a.label}</span>
                    </span>
                  ))}
                  {secondaryAchievements.map((a) => (
                    <span key={a.label} className="card-achievement-badge">
                      <span className="card-achievement-badge-icon">{a.icon}</span>
                      <span className="card-achievement-badge-value">{a.value}</span>
                      <span className="card-achievement-badge-label">{a.label}</span>
                    </span>
                  ))}
                </motion.div>
              </div>

              <div className="card-divider mb-1 shrink-0" />

              <motion.div
                className="rounded-[5px] px-[7px] py-[5px] relative mb-1.5 shrink-0"
                style={{
                  background: `color-mix(in srgb, ${rarityColor.hex}06, #1C1C20)`,
                  border: `1px solid #26262A`,
                }}
                initial={{ opacity: 0 }}
                animate={revealed ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.65 }}
              >
                <div
                  className="absolute left-0 top-2 bottom-2 w-[1px] rounded-full"
                  style={{ background: rarityColor.hex }}
                />
                <p className="text-[8px] text-text-secondary italic leading-[1.6] pl-[5px] line-clamp-1">
                  &ldquo;{card.flavorText}&rdquo;
                </p>
              </motion.div>

              <motion.div
                className="mt-auto flex items-end justify-between gap-2 shrink-0"
                initial={{ opacity: 0, y: 2 }}
                animate={revealed ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <div className="flex flex-col gap-[2px]">
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-[6px] text-text-tertiary uppercase tracking-[0.1em]">Edition</span>
                    <span className="font-mono text-[7px] font-semibold tabular-nums text-text-secondary">
                      #{String(card.verification.edition).padStart(4, "0")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-[6px] text-text-tertiary uppercase tracking-[0.1em]">Generated</span>
                    <span className="font-mono text-[6px] text-text-tertiary">{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-[6px] text-text-tertiary uppercase tracking-[0.1em]">Card</span>
                    <span className="font-mono text-[6px] text-text-tertiary">{card.verification.cardId}</span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-0.5">
                  <div
                    className="w-[19px] h-[19px] rounded-[4px] flex items-center justify-center border"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      borderColor: "rgba(255,255,255,0.1)",
                    }}
                  >
                    <span className="font-display text-[8px] font-[800] tracking-tight" style={{ color: "rgba(255,255,255,0.85)" }}>
                      DM
                    </span>
                  </div>
                  <span className="font-display text-[7px] font-[700] uppercase tracking-[0.18em] text-text-primary">
                    DevMon
                  </span>
                </div>

                <div className="flex flex-col items-end">
                  <div className="card-qr-seal" style={{ ["--rarity-color" as string]: rarityColor.hex } as React.CSSProperties}>
                    <div className="p-[2px] rounded-[2px] bg-white">
                      <QRCodeSVG
                        value={verifyUrl}
                        size={43}
                        bgColor="#ffffff"
                        fgColor="#1A1A1E"
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                  </div>
                  <span className="font-mono text-[6px] text-text-tertiary mt-px tracking-wide">Verified Credential</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
});
