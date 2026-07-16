"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";
import { Footer } from "@/components/Footer";
import { UPI_PRIMARY, UPI_FALLBACK, buildUpiUri, copyToClipboard } from "@/lib/upi";
import { useToast } from "@/components/Toast";
import { variants } from "@/lib/motion";

const UPI_APPS = ["Google Pay", "PhonePe", "Paytm", "BHIM", "Amazon Pay"];

type SelectedId = "primary" | "fallback";

const isMobile = typeof navigator !== "undefined" && /Mobi|Android/i.test(navigator.userAgent);

const tabs: { key: SelectedId; label: string; id: string }[] = [
  { key: "primary", label: "Primary", id: UPI_PRIMARY },
  { key: "fallback", label: "Fallback", id: UPI_FALLBACK },
];

export default function SupportPage() {
  const [selected, setSelected] = useState<SelectedId>("primary");
  const [copied, setCopied] = useState<SelectedId | null>(null);
  const qrWrapperRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const currentUpiId = selected === "primary" ? UPI_PRIMARY : UPI_FALLBACK;
  const currentUri = buildUpiUri(currentUpiId);

  const handleCopy = useCallback(async (id: SelectedId) => {
    const text = id === "primary" ? UPI_PRIMARY : UPI_FALLBACK;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(id);
      showToast("UPI ID copied");
      setTimeout(() => setCopied(null), 2000);
    }
  }, [showToast]);

  const handleOpenApp = useCallback(() => {
    window.location.href = currentUri;
    showToast("Thank you for supporting DevMon");
  }, [currentUri, showToast]);

  const handleDownloadPng = useCallback(async () => {
    const el = qrWrapperRef.current?.querySelector("[data-qr-png]");
    if (!el) return;
    try {
      const dataUrl = await toPng(el as HTMLElement, { quality: 1, pixelRatio: 2 });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `devmon-upi-${selected}.png`;
      a.click();
      showToast("QR downloaded successfully");
    } catch {
      showToast("Failed to download QR");
    }
  }, [selected, showToast]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Support DevMon", url: window.location.href });
        showToast("Thank you for supporting DevMon");
        return;
      } catch {
        return;
      }
    }
    const ok = await copyToClipboard(window.location.href);
    if (ok) showToast("Support link copied");
  }, [showToast]);

  return (
    <main className="min-h-screen flex flex-col">
      {/* ═══════ HERO ═══════ */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-32 pb-20 grid-bg overflow-hidden">
        {/* Corner accent lines */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[15%] left-[10%] w-px h-24 bg-gradient-to-b from-transparent via-[var(--overlay-5)] to-transparent" />
          <div className="absolute top-[25%] right-[12%] w-px h-16 bg-gradient-to-b from-transparent via-[var(--overlay-3)] to-transparent" />
          <div className="absolute bottom-[20%] left-[20%] w-px h-20 bg-gradient-to-b from-transparent via-[var(--overlay-4)] to-transparent" />
        </div>

        <motion.div
          className="relative z-10 flex flex-col items-center text-center max-w-3xl"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }}
        >
          {/* Back link */}
          <motion.div variants={variants.fadeUp} className="mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[13px] font-mono text-text-tertiary hover:text-text-secondary transition-colors"
            >
              <span className="text-[16px] leading-none">&larr;</span> Home
            </Link>
          </motion.div>

          {/* Decorative line */}
          <motion.div
            variants={variants.fadeUp}
            className="mb-8 w-12 h-px bg-gradient-to-r from-transparent via-[var(--overlay-12)] to-transparent"
          />

          {/* Headline */}
          <motion.h1
            variants={variants.fadeUp}
            className="font-display text-[42px] sm:text-[52px] md:text-[64px] leading-[0.95] font-[640] tracking-[-0.03em] text-text-primary"
          >
            Support DevMon
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={variants.fadeUp}
            className="mt-6 text-[17px] text-text-secondary max-w-md leading-[1.7]"
          >
            DevMon is free and open source. Your support helps keep the project running.
            No fixed amount — contribute with whatever feels right.
          </motion.p>
        </motion.div>
      </section>

      {/* ═══════ QR HERO ═══════ */}
      <section className="relative flex flex-col items-center px-6 pb-20">
        {/* Radial glow behind QR */}
        <div className="support-qr-glow" />

        <motion.div
          className="relative z-10 flex flex-col items-center"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Tab selector with sliding pill */}
          <div className="relative flex w-[200px] rounded-[9px] p-[2px] mb-8" style={{ background: "var(--surface-1)", border: "1px solid var(--border-hairline)" }}>
            <AnimatePresence>
              {tabs.map((tab) =>
                selected === tab.key ? (
                  <motion.div
                    key="pill"
                    className="support-tab-pill"
                    layoutId="support-tab-pill"
                    initial={false}
                    animate={{ width: "calc(50% - 2px)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    style={{ left: tab.key === "primary" ? "2px" : "calc(50% + 0px)" }}
                  />
                ) : null
              )}
            </AnimatePresence>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelected(tab.key)}
                className={`relative z-10 flex-1 px-3 py-1.5 rounded-[7px] text-[12px] font-mono font-medium transition-colors duration-150 ${
                  selected === tab.key
                    ? "text-text-primary"
                    : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* QR Code — premium frame */}
          <div ref={qrWrapperRef} className="flex flex-col items-center">
            <div className="support-qr-frame" data-qr-png>
              {/* Corner accents */}
              <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-[var(--overlay-12)] rounded-tl-sm pointer-events-none" />
              <div className="absolute top-1 right-1 w-3 h-3 border-t border-r border-[var(--overlay-12)] rounded-tr-sm pointer-events-none" />
              <div className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-[var(--overlay-12)] rounded-bl-sm pointer-events-none" />
              <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-[var(--overlay-12)] rounded-br-sm pointer-events-none" />

              <div className="support-qr-card p-5">
                <QRCodeSVG
                  value={currentUri}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#1a1a2e"
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: "/favicon.svg",
                    height: 36,
                    width: 36,
                    excavate: true,
                  }}
                />
              </div>
            </div>

            {/* Scan label */}
            <span className="mt-4 font-mono text-[13px] font-medium text-text-secondary">
              Scan to Pay
            </span>

            {/* UPI app badges */}
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {UPI_APPS.map((app) => (
                <span
                  key={app}
                  className="px-3 py-1.5 rounded-full text-[11px] font-mono font-medium surface-badge text-text-secondary"
                >
                  {app}
                </span>
              ))}
            </div>

            {/* Transaction note */}
            <div className="mt-5 text-center">
              <p className="text-[12px] font-mono text-text-tertiary">
                Transaction note: &ldquo;Support DevMon&rdquo;
              </p>
              <p className="text-[11px] font-mono text-text-tertiary mt-1 italic">
                No fixed amount. Support with whatever feels right.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════ UPI IDs ═══════ */}
      <section className="px-6 pb-20">
        <motion.div
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-text-tertiary block mb-4 text-center">
            UPI ID
          </span>

          <div className="rounded-[14px] surface-card-elevated overflow-hidden">
            {tabs.map((tab, i) => (
              <div key={tab.key}>
                {i > 0 && <div className="surface-divider" />}
                <div
                  className="flex items-center justify-between gap-3 px-5 py-4 transition-colors duration-150"
                  style={{
                    background: selected === tab.key ? "var(--overlay-3)" : "transparent",
                  }}
                >
                  <div className="min-w-0">
                    <span className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-text-tertiary block mb-1">
                      {tab.label}
                    </span>
                    <span className="font-mono text-[14px] font-semibold text-text-primary break-all">
                      {tab.id}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(tab.key)}
                    className="shrink-0 rounded-[8px] px-3 py-2 text-[11px] font-mono font-medium surface-btn transition-all duration-150 flex items-center gap-1.5"
                    aria-label={`Copy ${tab.label} UPI ID`}
                  >
                    {copied === tab.key ? (
                      <>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span className="text-accent">Copied</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                        </svg>
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════ ACTIONS ═══════ */}
      <section className="px-6 pb-24">
        <motion.div
          className="max-w-md mx-auto space-y-2.5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {isMobile && (
            <button
              type="button"
              onClick={handleOpenApp}
              className="w-full rounded-[10px] px-5 py-3.5 text-[13px] font-mono font-medium transition-all duration-150 flex items-center justify-center gap-2.5 surface-btn-accent"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Open UPI App
            </button>
          )}

          <button
            type="button"
            onClick={handleDownloadPng}
            className="w-full rounded-[10px] px-5 py-3 text-[12px] font-mono font-medium transition-all duration-150 flex items-center justify-center gap-2 surface-btn"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            Download QR (PNG)
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="w-full rounded-[10px] px-5 py-3 text-[12px] font-mono font-medium transition-all duration-150 flex items-center justify-center gap-2 surface-btn"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Share Support Link
          </button>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
