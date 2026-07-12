"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { toPng } from "html-to-image";

interface DownloadButtonProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  filename?: string;
}

export function DownloadButton({ cardRef, filename = "devmon-card" }: DownloadButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setState("loading");
    try {
      await document.fonts.ready;

      const imgs = cardRef.current.querySelectorAll("img");
      await Promise.all(
        Array.from(imgs).map(
          (img) =>
            new Promise<void>((resolve) => {
              if (img.complete && img.naturalWidth > 0) return resolve();
              img.onload = () => resolve();
              img.onerror = () => resolve();
            })
        )
      );

      document.documentElement.setAttribute("data-exporting", "");

      let dataUrl: string;
      try {
        dataUrl = await toPng(cardRef.current, {
          quality: 1,
          pixelRatio: 4,
          cacheBust: false,
          skipAutoScale: false,
          style: {
            transform: "none",
          },
        });
      } finally {
        document.documentElement.removeAttribute("data-exporting");
      }

      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
      setState("done");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      // Download failed — state is reset below
      document.documentElement.removeAttribute("data-exporting");
      setState("idle");
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={state === "loading"}
      className="neu-btn inline-flex items-center gap-2 rounded-[8px] px-5 py-2.5 text-[13px] font-medium text-text-primary disabled:opacity-40"
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
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )}
      <span>
        {state === "loading" ? "Rendering..." : state === "done" ? "Done!" : "Download PNG"}
      </span>
    </button>
  );
}
