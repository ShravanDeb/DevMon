"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import { RARITY_COLORS, CLASS_SUBTITLES, STAT_LABELS } from "@/types";
import type { CardData } from "@/types";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";

interface VerifyResponse {
  verified: boolean;
  card: Omit<CardData, "avatarUrl" | "bio" | "achievements" | "className"> & {
    verification: CardData["verification"];
  };
}

function VerifiedBadge() {
  return (
    <div className="inline-flex items-center gap-2.5 mb-8">
      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <p className="text-[14px] font-semibold text-emerald-500">Verified</p>
        <p className="text-[11px] text-text-tertiary font-mono">
          Cryptographically signed credential
        </p>
      </div>
    </div>
  );
}

function StatBar({
  label,
  value,
  color,
  delay,
}: {
  label: string;
  value: number;
  color: string;
  delay: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-[120px] text-[12px] font-mono text-text-secondary shrink-0">
        {label}
      </span>
      <div className="flex-1 h-[5px] rounded-full surface-track overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <span className="w-8 text-[12px] font-mono text-text-primary text-right tabular-nums font-medium">
        {value}
      </span>
    </div>
  );
}

function DetailRow({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-border-hairline last:border-0">
      <span className="text-[12px] text-text-tertiary shrink-0">{label}</span>
      <span className={`text-[12px] text-text-primary text-right ${mono ? "font-mono" : ""}`}>
        {value}
      </span>
    </div>
  );
}

export default function VerifyPage() {
  const params = useParams();
  const cardId = params.cardId as string;
  const [data, setData] = useState<VerifyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copyUrl = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  useEffect(() => {
    fetch(`/api/verify/${cardId}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.error) setError(json.error);
        else setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [cardId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-0 flex items-center justify-center">
        <div className="fixed top-4 right-4 z-40"><ThemeToggle /></div>
        <div className="flex flex-col items-center gap-4">
          <div className="w-5 h-5 rounded-full border-2 border-text-tertiary border-t-transparent animate-spin" />
          <p className="text-[13px] text-text-tertiary">Verifying...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-surface-0 flex items-center justify-center px-4">
        <div className="fixed top-4 right-4 z-40"><ThemeToggle /></div>
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <h2 className="text-[24px] font-semibold text-text-primary mb-2">Not Found</h2>
          <p className="text-[14px] text-text-secondary">{error || "This credential could not be verified."}</p>
          <p className="text-[12px] text-text-tertiary font-mono mt-4">{cardId}</p>
        </div>
      </div>
    );
  }

  const { card } = data;
  const rarityColor = RARITY_COLORS[card.rarity];
  const verifyUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="min-h-screen bg-surface-0">
      <div className="fixed top-4 right-4 z-40"><ThemeToggle /></div>
      <div className="max-w-[600px] mx-auto px-5 py-16 sm:py-24">
        {/* Verified badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <VerifiedBadge />
        </motion.div>

        {/* Identity */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h1 className="text-[36px] sm:text-[42px] font-bold text-text-primary tracking-[-0.03em] leading-[1.1] mb-1.5">
            {card.displayName}
          </h1>
          <p className="text-[14px] text-text-secondary font-mono mb-4">
            @{card.username}
          </p>
          <div className="flex items-center gap-2.5">
            <span
              className="text-[11px] font-mono font-semibold uppercase tracking-wider px-2.5 py-1 rounded surface-badge"
              style={{
                color: rarityColor.hex,
                background: `${rarityColor.hex}10`,
              }}
            >
              {card.rarity}
            </span>
            <span className="text-[12px] text-text-tertiary">
              Score {card.rarityScore}/100
            </span>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="surface-divider mb-10" />

        {/* Class + Signature */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div>
            <p className="text-[11px] text-text-tertiary uppercase tracking-wider mb-2 font-mono">
              Class
            </p>
            <p className="text-[16px] font-semibold text-text-primary mb-0.5">
              {card.primaryClass}
            </p>
            <p className="text-[13px] text-text-secondary">
              {CLASS_SUBTITLES[card.primaryClass]}
            </p>
            {card.secondaryClass && (
              <p className="text-[12px] text-text-tertiary mt-1 font-mono">
                + {card.secondaryClass}
              </p>
            )}
          </div>
          <div>
            <p className="text-[11px] text-text-tertiary uppercase tracking-wider mb-2 font-mono">
              Signature Move
            </p>
            <p className="text-[16px] font-semibold text-text-primary mb-0.5">
              {card.signatureMove.name}
            </p>
            <p className="text-[13px] text-text-secondary leading-relaxed">
              {card.signatureMove.description}
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <p className="text-[11px] text-text-tertiary uppercase tracking-wider mb-4 font-mono">
            Attributes
          </p>
          <div className="space-y-3">
            {(Object.keys(STAT_LABELS) as (keyof typeof STAT_LABELS)[]).map(
              (key, i) => (
                <StatBar
                  key={key}
                  label={STAT_LABELS[key]}
                  value={card.stats[key]}
                  color={rarityColor.hex}
                  delay={0.35 + i * 0.05}
                />
              )
            )}
          </div>
        </motion.div>

        {/* Flavor Text */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <p className="text-[11px] text-text-tertiary uppercase tracking-wider mb-2 font-mono">
            Flavor Text
          </p>
          <p className="text-[14px] text-text-secondary italic leading-relaxed">
            &ldquo;{card.flavorText}&rdquo;
          </p>
        </motion.div>

        {/* Divider */}
        <div className="surface-divider mb-10" />

        {/* Verification Details */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <svg
              className="w-4 h-4 text-text-tertiary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
            <p className="text-[11px] text-text-tertiary uppercase tracking-wider font-mono">
              Verification Details
            </p>
          </div>
          <div className="rounded-lg surface-card">
            <div className="px-4 py-1">
              <DetailRow label="Card ID" value={card.verification.cardId} />
              <DetailRow
                label="Edition"
                value={`#${String(card.verification.edition).padStart(4, "0")}`}
              />
              <DetailRow label="Version" value={`v${card.verification.version}`} />
              <DetailRow
                label="Issued"
                value={new Date(card.verification.generatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              />
              <DetailRow label="SHA-256" value={card.verification.sha256Hash} />
              <DetailRow label="Signature" value={card.verification.digitalSignature} />
            </div>
          </div>
        </motion.div>

        {/* Share */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verifyUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0A66C2] text-white px-5 py-2.5 text-[13px] font-medium hover:bg-[#0958A8] transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Share on LinkedIn
          </a>
          <button
            onClick={copyUrl}
            className="inline-flex items-center justify-center gap-2 rounded-lg surface-btn text-text-primary px-5 py-2.5 text-[13px] font-medium"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3a2.25 2.25 0 00-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                </svg>
                Copy Link
              </>
            )}
          </button>
        </motion.div>

        {/* Footer */}
        <div className="mt-16 pt-6 surface-divider">
          <p className="text-[11px] text-text-tertiary">
            Generated by <span className="text-text-secondary font-medium">DevMon</span>. This credential is cryptographically signed and tamper-proof.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
