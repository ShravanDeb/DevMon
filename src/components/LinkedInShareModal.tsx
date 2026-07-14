"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LinkedInShareModalProps {
  open: boolean;
  onClose: () => void;
  shareText: string;
  imageUrl: string;
  filename: string;
}

type CopyStatus = "pending" | "ok" | "failed";
type DownloadStatus = "pending" | "ok" | "failed";

export function LinkedInShareModal({
  open,
  onClose,
  shareText,
  imageUrl,
  filename,
}: LinkedInShareModalProps) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("pending");
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>("pending");
  const hasTriggered = useRef(false);

  const doCopy = useCallback(async () => {
    try {
      // Safari quirk: clipboard.writeText must be called synchronously inside
      // a user-gesture handler (click). We call it directly in the button
      // onClick, not after an await.
      await navigator.clipboard.writeText(shareText);
      setCopyStatus("ok");
    } catch {
      setCopyStatus("failed");
    }
  }, [shareText]);

  const doDownload = useCallback(async () => {
    try {
      const res = await fetch(imageUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadStatus("ok");
    } catch {
      setDownloadStatus("failed");
    }
  }, [imageUrl, filename]);

  // Fire copy + download once when modal opens
  useEffect(() => {
    if (open && !hasTriggered.current) {
      hasTriggered.current = true;
      doCopy();
      doDownload();
    }
    if (!open) {
      hasTriggered.current = false;
    }
  }, [open, doCopy, doDownload]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-[520px] max-h-[90vh] overflow-y-auto surface-card-elevated p-6"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full surface-btn flex items-center justify-center text-text-tertiary hover:text-text-primary transition-colors"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <h2 className="font-display text-[20px] font-[600] text-text-primary tracking-[-0.01em] mb-4 pr-8">
              Share on LinkedIn
            </h2>

            {/* Status checks */}
            <div className="flex flex-col gap-2.5 mb-5">
              <StatusRow
                label="Text copied to clipboard"
                status={copyStatus}
                onRetry={doCopy}
                retryLabel="Copy Text Again"
              />
              <StatusRow
                label="Image downloaded"
                status={downloadStatus}
                onRetry={doDownload}
                retryLabel="Download Image Again"
              />
            </div>

            {/* Image preview */}
            <div className="mb-4">
              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-text-tertiary block mb-2">
                Image Preview
              </span>
              <div className="rounded-[10px] surface-inset overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Card preview"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Text preview */}
            <div className="mb-5">
              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-text-tertiary block mb-2">
                Copied Text
              </span>
              <textarea
                readOnly
                value={shareText}
                className="w-full rounded-[8px] surface-inset px-3 py-2.5 text-[12px] text-text-secondary font-mono leading-[1.7] resize-none h-[120px] focus:outline-none"
              />
            </div>

            {/* Steps */}
            <div className="mb-5">
              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-text-tertiary block mb-2.5">
                Remaining Steps
              </span>
              <ol className="space-y-1.5">
                {[
                  'Click "Open LinkedIn" below',
                  "Paste (Ctrl/Cmd+V) into your post",
                  "Attach the downloaded image (upload button in LinkedIn's composer)",
                  "Click Post",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13px] text-text-secondary leading-[1.5]">
                    <span className="shrink-0 w-5 h-5 rounded-full surface-badge flex items-center justify-center font-mono text-[10px] font-semibold text-text-tertiary">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <a
                href="https://www.linkedin.com/feed/?shareActive=true"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#0A66C2] text-white px-5 py-2.5 text-[13px] font-medium hover:bg-[#0958A8] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Open LinkedIn
              </a>
              <button
                onClick={doCopy}
                className="inline-flex items-center justify-center gap-2 rounded-[8px] surface-btn px-4 py-2.5 text-[12px] font-medium text-text-primary"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3a2.25 2.25 0 00-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                </svg>
                Copy Text Again
              </button>
              <button
                onClick={doDownload}
                className="inline-flex items-center justify-center gap-2 rounded-[8px] surface-btn px-4 py-2.5 text-[12px] font-medium text-text-primary"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Again
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatusRow({
  label,
  status,
  onRetry,
  retryLabel,
}: {
  label: string;
  status: CopyStatus | DownloadStatus;
  onRetry: () => void;
  retryLabel: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[8px] surface-inset px-3 py-2.5">
      <div className="flex items-center gap-2 min-w-0">
        {status === "pending" && (
          <motion.div
            className="w-4 h-4 rounded-full border-[1.5px] border-text-tertiary border-t-transparent shrink-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          />
        )}
        {status === "ok" && (
          <div className="w-4 h-4 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
            <svg className="w-2.5 h-2.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        {status === "failed" && (
          <div className="w-4 h-4 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0">
            <svg className="w-2.5 h-2.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
            </svg>
          </div>
        )}
        <span className="text-[13px] text-text-secondary truncate">{label}</span>
      </div>
      {status === "failed" && (
        <button
          onClick={onRetry}
          className="shrink-0 font-mono text-[10px] text-text-tertiary hover:text-text-secondary transition-colors underline underline-offset-2"
        >
          {retryLabel}
        </button>
      )}
      {status === "ok" && (
        <span className="shrink-0 font-mono text-[10px] text-emerald-500">Done</span>
      )}
    </div>
  );
}
