"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, Suspense, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { CardData, FlavorTone, Rarity, RawGitHubStats } from "@/types";
import { RARITY_COLORS, CLASS_SUBTITLES } from "@/types";

import { CardFace } from "@/components/CardFace";
import { DownloadButton } from "@/components/DownloadButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";
import { LinkedInShareModal } from "@/components/LinkedInShareModal";

const LOADING_MESSAGES = [
  "Fetching GitHub data",
  "Calculating developer stats",
  "Generating card",
  "Signing credential",
  "Saving card",
];

function CardSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-0">
      <div className="flex flex-col items-center gap-6">
        <div className="w-[320px] h-[500px] md:w-[400px] md:h-[624px] rounded-[14px] surface-card-elevated overflow-hidden">
          <div className="flex flex-col h-full px-6 pt-6 pb-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-surface-2 animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="w-28 h-4 rounded bg-surface-2 animate-pulse" />
                <div className="w-16 h-3 rounded bg-surface-2 animate-pulse" />
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-16 h-[4px] rounded bg-surface-2 animate-pulse" />
                    <div className="flex-1 h-[4px] rounded bg-surface-2 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardContent() {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [flavorTone, setFlavorTone] = useState<FlavorTone>("hype");
  const [rarityOverride, setRarityOverride] = useState<Rarity | undefined>(undefined);
  const [rawStats, setRawStats] = useState<RawGitHubStats | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const downloadBtnRef = useRef<HTMLDivElement>(null);

  // §5: Race condition prevention
  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const loadingMsgRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startLoadingMessages = useCallback(() => {
    let idx = 0;
    setLoadingMessage(LOADING_MESSAGES[0]);
    loadingMsgRef.current = setInterval(() => {
      idx++;
      if (idx < LOADING_MESSAGES.length) {
        setLoadingMessage(LOADING_MESSAGES[idx]);
      } else {
        if (loadingMsgRef.current) clearInterval(loadingMsgRef.current);
      }
    }, 600);
  }, []);

  const stopLoadingMessages = useCallback(() => {
    if (loadingMsgRef.current) {
      clearInterval(loadingMsgRef.current);
      loadingMsgRef.current = null;
    }
  }, []);

  const regenerateWithTone = useCallback(async (tone: FlavorTone, rarity?: Rarity) => {
    if (!rawStats) return;
    setFlavorTone(tone);
    if (rarity !== undefined) setRarityOverride(rarity);
    const activeRarity = rarity !== undefined ? rarity : rarityOverride;

    // §5: Abort previous in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;
    const reqId = ++requestIdRef.current;

    setLoading(true);
    startLoadingMessages();

    try {
      const res = await fetch("/api/card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tone, rarity: activeRarity }),
        signal: controller.signal,
      });
      if (res.status === 401) {
        router.push("/");
        return;
      }
      const data = await res.json();
      // §5: Only apply if this is still the latest request
      if (reqId !== requestIdRef.current) return;
      if (data.error) setError(data.error);
      else setCard(data.card);
    } catch (err: unknown) {
      if (reqId !== requestIdRef.current) return;
      if (err instanceof DOMException && err.name === "AbortError") return;
      const message = err instanceof Error ? err.message : "Failed to regenerate";
      setError(message);
    } finally {
      if (reqId === requestIdRef.current) {
        setLoading(false);
        stopLoadingMessages();
      }
    }
  }, [rawStats, rarityOverride, router, startLoadingMessages, stopLoadingMessages]);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;
    const reqId = ++requestIdRef.current;

    startLoadingMessages();

    fetch("/api/card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
      signal: controller.signal,
    })
      .then((r) => {
        if (r.status === 401) {
          router.push("/");
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        if (reqId !== requestIdRef.current) return;
        if (data.error) setError(data.error);
        else { setCard(data.card); setRawStats(data.raw); setShowReveal(true); }
        setLoading(false);
        stopLoadingMessages();
      })
      .catch((err) => {
        if (reqId !== requestIdRef.current) return;
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err.message);
        setLoading(false);
        stopLoadingMessages();
      });

    return () => {
      controller.abort();
      stopLoadingMessages();
    };
  }, [router, startLoadingMessages, stopLoadingMessages]);

  const rarityColor = card ? RARITY_COLORS[card.rarity] : null;

  if (loading && !card) return <CardSkeleton />;
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-0 px-4">
        <div className="fixed top-4 right-4 z-40"><ThemeToggle /></div>
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full surface-card flex items-center justify-center">
            <svg className="w-8 h-8 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="font-display text-[28px] font-[600] tracking-[-0.01em] text-text-primary mb-3">Generation Failed</h2>
          <p className="text-[15px] text-text-secondary mb-8 leading-[1.6]">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 rounded-[10px] surface-btn-accent px-6 py-3 text-[13px] font-semibold"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }
  if (!card || !rarityColor) return null;

  const heroStat = card.heroStat;
  const verifyUrl = typeof window !== "undefined" ? `${window.location.origin}/verify/${card.verification.cardId}` : "";
  const homepageUrl = typeof window !== "undefined" ? window.location.origin : "";
  const shareText = `🚀 Just leveled up my dev profile! My verified GitHub credentials are now a shareable trading card on DevMon.\n\nCheck out the receipts 👇\n${verifyUrl}\n\nWant your own? Generate yours free 👇\n${homepageUrl}\n\n#DevMon #BuildInPublic #GitHub #DevCommunity`;

  return (
    <main className="min-h-screen bg-surface-0 relative overflow-hidden">
      {/* ── Reveal Flash ── */}
      <AnimatePresence>
        {showReveal && !cardReady && (
          <motion.div
            className="fixed inset-0 z-50 bg-surface-0 flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, times: [0, 0.4, 1] }}
              onAnimationComplete={() => setCardReady(true)}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${rarityColor.hex}20, transparent 60%)`,
                }}
              />
              <motion.div
                className="absolute left-0 right-0 h-[1px]"
                style={{ background: `${rarityColor.hex}50` }}
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
            </motion.div>
            <motion.div
              className="relative z-10 flex flex-col items-center gap-6"
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="w-[280px] h-[436px] rounded-[14px]"
                style={{
                  background: `linear-gradient(135deg, ${rarityColor.hex}10, ${rarityColor.hex}05)`,
                  border: `1px solid ${rarityColor.hex}18`,
                  boxShadow: `0 0 80px ${rarityColor.hex}12`,
                }}
              />
              <motion.p
                className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: rarityColor.hex }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.35 }}
              >
                Generating your credential...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-40"><ThemeToggle /></div>

      {/* Ambient background glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 45%, ${rarityColor.hex}10, transparent 65%)`,
        }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 grid-bg opacity-30" />

      {/* Desktop: side-by-side. Mobile: stacked */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-16 px-4 sm:px-8 pt-12 sm:pt-16 pb-16 lg:py-12 max-w-[1400px] mx-auto">

        {/* === LEFT: Card === */}
        <motion.div
          className="shrink-0"
          data-export-flatten
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={cardReady ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div ref={cardRef}>
            <CardFace card={card} rarityOverride={rarityOverride} />
          </div>
        </motion.div>

        {/* === RIGHT: Info Panel === */}
        <motion.div
          className="w-full max-w-[460px] lg:max-w-[420px] flex flex-col gap-5 lg:sticky lg:top-12 lg:self-start"
          initial="hidden"
          animate={cardReady ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } } }}
        >
          {/* Title Block */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
          >
            <div className="flex items-center gap-2.5 mb-3">
              <span
                className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] px-2.5 py-1 rounded-full"
                style={{
                  color: rarityColor.hex,
                  background: `${rarityColor.hex}10`,
                  border: `1px solid ${rarityColor.hex}20`,
                }}
              >
                {card.rarity}
              </span>
              <span className="w-[1px] h-3 bg-[var(--overlay-8)]" />
              <span className="font-mono text-[10px] text-text-tertiary tracking-wide">
                {heroStat.label} {heroStat.value}{heroStat.unit}
              </span>
            </div>
            <h1 className="font-display text-[32px] sm:text-[36px] font-[700] tracking-[-0.03em] text-text-primary leading-[1.1]">
              {card.displayName}&apos;s<br />Credential
            </h1>
            <p className="text-[14px] text-text-secondary mt-2 leading-[1.6]">
              {CLASS_SUBTITLES[card.primaryClass]}
            </p>
          </motion.div>

          {/* Flavor Text */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
          >
            <div className="rounded-[12px] surface-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">
                  Flavor Text
                </span>
                <button
                  onClick={() => regenerateWithTone(flavorTone === "hype" ? "roast" : "hype")}
                  disabled={loading}
                  className="font-mono text-[10px] text-text-tertiary hover:text-text-secondary transition-colors underline underline-offset-2 disabled:opacity-40"
                >
                  {flavorTone === "hype" ? "Want a roast?" : "Back to hype"}
                </button>
              </div>
              <p className="text-[13px] text-text-secondary italic leading-[1.7]">&ldquo;{card.flavorText}&rdquo;</p>
            </div>
          </motion.div>

          {/* Verification */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
          >
            <div className="rounded-[12px] surface-card p-4">
              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-text-tertiary block mb-1.5">
                Verification
              </span>
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-mono text-text-primary">{card.verification.cardId}</p>
                <a
                  href={`/verify/${card.verification.cardId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono underline underline-offset-2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  Verify
                </a>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div ref={downloadBtnRef}>
                <DownloadButton
                  cardRef={cardRef as unknown as React.RefObject<HTMLDivElement | null>}
                  filename={`devmon-${card.username}`}
                />
              </div>
              <button
                onClick={() => setShareModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-[10px] px-4 py-2.5 text-[12px] font-medium text-[#0A66C2] transition-all surface-btn"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Share on LinkedIn
              </button>
              <button
                onClick={() => { navigator.clipboard.writeText(verifyUrl); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                className="inline-flex items-center justify-center gap-2 rounded-[10px] surface-btn text-text-primary px-4 py-2.5 text-[12px] font-medium"
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.864-2.46a4.5 4.5 0 00-6.364 0l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                    </svg>
                    Copy Link
                  </>
                )}
              </button>
              <a
                href="/leaderboard"
                className="inline-flex items-center justify-center gap-2 rounded-[10px] surface-btn text-text-primary px-4 py-2.5 text-[12px] font-medium"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0116.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.015 6.015 0 01-2.77.665 6.015 6.015 0 01-2.77-.665" />
                </svg>
                Leaderboard
              </a>
            </div>
          </motion.div>

          {/* Footer attribution */}
          <motion.div
            className="text-center sm:text-left pt-2"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }}
          >
            <p className="font-mono text-[10px] text-text-tertiary tracking-wide">
              Generated with <span className="font-semibold text-text-secondary">DevMon</span> &bull; Verified Developer Credential
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* §6.3: Staged loading overlay (shown during regeneration) */}
      <AnimatePresence>
        {loading && card && (
          <motion.div
            className="fixed inset-0 z-40 bg-surface-0/60 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="w-5 h-5 rounded-full border-2 border-text-tertiary border-t-transparent animate-spin" />
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-text-tertiary">
                {loadingMessage}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />

      <LinkedInShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        shareText={shareText}
        imageUrl={`/api/og?username=${card.username}`}
        filename={`devmon-${card.username}`}
        onDownload={async () => {
          const btn = downloadBtnRef.current?.querySelector("button");
          if (btn) btn.click();
        }}
      />
    </main>
  );
}

export default function CardPage() {
  return (
    <Suspense fallback={<CardSkeleton />}>
      <CardContent />
    </Suspense>
  );
}
