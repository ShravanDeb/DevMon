"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { toPng } from "html-to-image";

interface DownloadButtonProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  filename?: string;
}

async function imageToDataUrl(img: HTMLImageElement): Promise<string> {
  const res = await fetch(img.src);
  const blob = await res.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function DownloadButton({ cardRef, filename = "devmon-card" }: DownloadButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setState("loading");

    const savedStyles: { el: HTMLElement; cssText: string }[] = [];
    const savedSrcs: { img: HTMLImageElement; src: string }[] = [];

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

      for (const img of Array.from(imgs)) {
        try {
          const dataUrl = await imageToDataUrl(img);
          savedSrcs.push({ img, src: img.src });
          img.src = dataUrl;
        } catch {
          // leave as-is
        }
      }

      await new Promise((r) => setTimeout(r, 200));

      const card = cardRef.current;
      const allEls = [card, ...Array.from(card.querySelectorAll<HTMLElement>("*"))];

      for (const el of allEls) {
        const computed = window.getComputedStyle(el);
        if (computed.transform !== "none" || computed.perspective !== "none") {
          savedStyles.push({ el, cssText: el.style.cssText });
          el.style.transform = "none";
          el.style.perspective = "none";
        }
        if (computed.overflow === "hidden") {
          if (!savedStyles.some((s) => s.el === el)) {
            savedStyles.push({ el, cssText: el.style.cssText });
          }
          el.style.overflow = "visible";
        }
      }

      if (card.parentElement) {
        savedStyles.push({ el: card.parentElement, cssText: card.parentElement.style.cssText });
        card.parentElement.style.transform = "none";
      }

      document.documentElement.setAttribute("data-exporting", "");
      await new Promise((r) => setTimeout(r, 100));

      let dataUrl: string;
      try {
        dataUrl = await toPng(cardRef.current, {
          quality: 1,
          pixelRatio: 4,
          cacheBust: true,
        });
      } finally {
        document.documentElement.removeAttribute("data-exporting");
        for (const { el, cssText } of savedStyles) {
          el.style.cssText = cssText;
        }
        for (const { img, src } of savedSrcs) {
          img.src = src;
        }
      }

      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
      setState("done");
      setTimeout(() => setState("idle"), 2000);
    } catch (err) {
      console.error("DevMon download failed:", err);
      document.documentElement.removeAttribute("data-exporting");
      for (const { el, cssText } of savedStyles) {
        el.style.cssText = cssText;
      }
      for (const { img, src } of savedSrcs) {
        img.src = src;
      }
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
