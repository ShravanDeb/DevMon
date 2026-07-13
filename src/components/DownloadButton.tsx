"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

interface DownloadButtonProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  filename?: string;
}

function inlineImage(img: HTMLImageElement): Promise<void> {
  return new Promise((resolve) => {
    if (img.complete && img.naturalWidth > 0) return resolve();
    img.onload = () => resolve();
    img.onerror = () => resolve();
  });
}

function canvasToDataUrl(img: HTMLImageElement): string {
  const c = document.createElement("canvas");
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  c.getContext("2d")!.drawImage(img, 0, 0);
  return c.toDataURL("image/png");
}

export function DownloadButton({ cardRef, filename = "devmon-card" }: DownloadButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const reset = useCallback(() => {
    setState("idle");
    setErrorMsg("");
  }, []);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setState("loading");
    setErrorMsg("");

    const originals: { img: HTMLImageElement; src: string }[] = [];

    try {
      await document.fonts.ready;

      const card = cardRef.current;

      const imgs = Array.from(card.querySelectorAll("img"));
      await Promise.all(imgs.map(inlineImage));

      for (const img of imgs) {
        if (img.naturalWidth === 0) continue;
        try {
          originals.push({ img, src: img.src });
          img.src = canvasToDataUrl(img);
          await inlineImage(img);
        } catch {
          // skip broken images
        }
      }

      const html2canvas = (await import("html2canvas")).default;

      const canvas = await html2canvas(card, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      setState("done");
      setTimeout(() => setState("idle"), 2000);
    } catch (err) {
      console.error("DevMon download failed:", err);
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setState("error");
      setTimeout(() => reset(), 3000);
    } finally {
      for (const { img, src } of originals) {
        img.src = src;
      }
    }
  };

  return (
    <div className="relative inline-flex flex-col items-start">
      <button
        onClick={handleDownload}
        disabled={state === "loading"}
        className="surface-btn inline-flex items-center gap-2 rounded-[8px] px-5 py-2.5 text-[13px] font-medium text-text-primary disabled:opacity-40"
      >
        {state === "loading" ? (
          <motion.svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <circle cx="12" cy="12" r="10" strokeDasharray="30 70" strokeDashoffset="0" />
          </motion.svg>
        ) : state === "done" ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : state === "error" ? (
          <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
        <span>
          {state === "loading"
            ? "Rendering..."
            : state === "done"
              ? "Done!"
              : state === "error"
                ? "Failed"
                : "Download PNG"}
        </span>
      </button>
      <AnimatePresence>
        {state === "error" && errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1.5 max-w-[260px] rounded-[6px] bg-red-500/10 border border-red-500/20 px-2.5 py-1.5 text-[11px] text-red-400 font-mono leading-tight break-all"
          >
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
