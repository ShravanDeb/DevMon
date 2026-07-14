"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toPng } from "html-to-image";

interface DownloadButtonProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  filename?: string;
}

/* ── colour helpers for canvas gradient ─────────────────────────── */

function parseRgb(color: string): [number, number, number] | null {
  const hex = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i);
  if (hex)
    return [parseInt(hex[1], 16), parseInt(hex[2], 16), parseInt(hex[3], 16)];
  const rgb = color.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/,
  );
  if (rgb)
    return [parseInt(rgb[1], 10), parseInt(rgb[2], 10), parseInt(rgb[3], 10)];
  return null;
}

function mixColor(c1: string, c2: string, ratio: number): string {
  const a = parseRgb(c1);
  const b = parseRgb(c2);
  if (!a || !b) return c1;
  const r = Math.round(a[0] * ratio + b[0] * (1 - ratio));
  const g = Math.round(a[1] * ratio + b[1] * (1 - ratio));
  const bl = Math.round(a[2] * ratio + b[2] * (1 - ratio));
  return `rgb(${r},${g},${bl})`;
}

/* ── canvas-render the hero stat (bypasses SVG foreignObject) ───── */

function renderHeroStatCanvas(
  span: HTMLSpanElement,
): { dataUrl: string; width: number; height: number } | null {
  const text = span.textContent?.trim();
  if (!text) return null;

  const computed = window.getComputedStyle(span);
  const fontSize = parseFloat(computed.fontSize);
  const fontFamily = computed.fontFamily;
  const fontWeight = computed.fontWeight;

  const ls = computed.letterSpacing;
  const letterSpacing = ls === "normal" ? 0 : parseFloat(ls);

  const root = window.getComputedStyle(document.documentElement);
  const textPrimary =
    root.getPropertyValue("--text-primary").trim() || "#F2F1EE";
  const heroRarity =
    root.getPropertyValue("--hero-rarity-color").trim() || textPrimary;

  const dpr = 2;

  const mc = document.createElement("canvas");
  const mctx = mc.getContext("2d")!;
  mctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

  let textWidth = 0;
  for (const ch of Array.from(text)) textWidth += mctx.measureText(ch).width;
  textWidth += (text.length - 1) * letterSpacing;

  const tm = mctx.measureText(text);
  const ascent = tm.actualBoundingBoxAscent || fontSize * 0.78;
  const descent = tm.actualBoundingBoxDescent || fontSize * 0.22;

  const padX = Math.ceil(fontSize * 0.15);
  const padTop = Math.ceil(ascent * 0.1);
  const padBottom = Math.ceil(descent * 0.1);

  const cssW = Math.ceil(textWidth + padX * 2);
  const cssH = Math.ceil(ascent + descent + padTop + padBottom);

  const canvas = document.createElement("canvas");
  canvas.width = cssW * dpr;
  canvas.height = cssH * dpr;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);

  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.textBaseline = "alphabetic";

  const rad = (135 * Math.PI) / 180;
  const cx = cssW / 2;
  const cy = cssH / 2;
  const len = Math.max(cssW, cssH);
  const grad = ctx.createLinearGradient(
    cx - Math.cos(rad) * len,
    cy - Math.sin(rad) * len,
    cx + Math.cos(rad) * len,
    cy + Math.sin(rad) * len,
  );
  grad.addColorStop(0.15, textPrimary);
  grad.addColorStop(0.75, heroRarity);
  grad.addColorStop(1.0, mixColor(heroRarity, "#FFFFFF", 0.6));

  ctx.fillStyle = grad;
  const baseY = padTop + ascent;
  let x = padX;
  for (const ch of Array.from(text)) {
    ctx.fillText(ch, x, baseY);
    x += mctx.measureText(ch).width + letterSpacing;
  }

  return { dataUrl: canvas.toDataURL("image/png"), width: cssW, height: cssH };
}

/* ── image helpers ──────────────────────────────────────────────── */

function imgToCanvasDataUrl(img: HTMLImageElement): string {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL("image/png");
}

function waitForImg(img: HTMLImageElement): Promise<void> {
  return new Promise((resolve) => {
    if (img.complete && img.naturalWidth > 0) return resolve();
    img.onload = () => resolve();
    img.onerror = () => resolve();
  });
}

/* ── component ──────────────────────────────────────────────────── */

export function DownloadButton({
  cardRef,
  filename = "devmon-card",
}: DownloadButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  const reset = useCallback(() => {
    setState("idle");
    setErrorMsg("");
  }, []);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setState("loading");
    setErrorMsg("");

    const savedStyles: { el: HTMLElement; cssText: string }[] = [];
    const savedSrcs: { img: HTMLImageElement; src: string }[] = [];
    let fontStyleEl: HTMLStyleElement | null = null;
    let heroStatSwap: {
      span: HTMLSpanElement;
      innerHTML: string;
      className: string;
      cssText: string;
    } | null = null;
    const card = cardRef.current;
    const isMobileCard = card?.querySelector(".w-\\[320px\\]") != null;
    const CARD_W = isMobileCard ? 320 : 540;
    const CARD_H = isMobileCard ? 500 : 840;
    const BUFFER = isMobileCard ? 6 : 8;

    try {
      await document.fonts.ready;

      const imgs = Array.from(card.querySelectorAll("img"));

      await Promise.all(imgs.map(waitForImg));

      for (const img of imgs) {
        if (img.naturalWidth === 0) continue;
        try {
          const dataUrl = imgToCanvasDataUrl(img);
          savedSrcs.push({ img, src: img.src });
          img.src = dataUrl;
          await waitForImg(img);
        } catch (e) {
          console.warn("DownloadButton: could not inline image", img.src, e);
        }
      }

      const flattenEls = Array.from(
        card.querySelectorAll<HTMLElement>("[data-export-flatten]"),
      );
      for (const el of flattenEls) {
        savedStyles.push({ el, cssText: el.style.cssText });
        el.style.transform = "none";
        el.style.perspective = "none";
        el.style.setProperty("rotateX", "none");
        el.style.setProperty("rotateY", "none");
        el.style.setProperty("transform-style", "flat");
        el.style.overflow = "visible";
      }

      const cardBody = flattenEls[1];
      if (cardBody) {
        savedStyles.push({ el: cardBody, cssText: cardBody.style.cssText });
        cardBody.style.width = `${CARD_W + BUFFER}px`;
        cardBody.style.minWidth = `${CARD_W + BUFFER}px`;
      }

      const heroNum = card.querySelector<HTMLElement>("[data-hero-number]");
      if (heroNum) {
        savedStyles.push({ el: heroNum, cssText: heroNum.style.cssText });
        heroNum.style.fontKerning = "none";
      }

      const heroStat = card.querySelector<HTMLElement>(".card-hero-stat");
      if (heroStat) {
        savedStyles.push({ el: heroStat, cssText: heroStat.style.cssText });
        heroStat.style.overflow = "visible";
      }

      const heroVal = card.querySelector<HTMLElement>(
        ".card-hero-stat-value",
      );
      if (heroVal) {
        savedStyles.push({ el: heroVal, cssText: heroVal.style.cssText });
        const computedSize = window.getComputedStyle(heroVal).fontSize;
        heroVal.style.fontSize = computedSize;
      }

      if (heroVal) {
        const heroContainer = heroVal.parentElement;
        if (heroContainer) {
          const availableWidth = heroContainer.clientWidth;
          const currentSize = parseFloat(
            window.getComputedStyle(heroVal).fontSize,
          );
          for (let size = currentSize; size >= 28; size -= 2) {
            heroVal.style.fontSize = `${size}px`;
            if (heroVal.scrollWidth <= availableWidth) break;
          }
        }
      }

      document.documentElement.setAttribute("data-exporting", "");

      try {
        let fontCss = "";
        for (const sheet of Array.from(document.styleSheets)) {
          try {
            for (const rule of Array.from(sheet.cssRules)) {
              if (rule instanceof CSSFontFaceRule) {
                fontCss += rule.cssText + "\n";
              }
            }
          } catch {
            /* cross-origin sheet, skip */
          }
        }
        if (fontCss) {
          fontStyleEl = document.createElement("style");
          fontStyleEl.textContent = fontCss;
          card.appendChild(fontStyleEl);
        }
      } catch {
        /* ignore */
      }

      /* ── canvas-swap the hero stat ─────────────────────────────── */
      if (heroVal) {
        try {
          const result = renderHeroStatCanvas(heroVal as HTMLSpanElement);
          if (result) {
            const span = heroVal as HTMLSpanElement;
            heroStatSwap = {
              span,
              innerHTML: span.innerHTML,
              className: span.className,
              cssText: span.style.cssText,
            };

            const img = document.createElement("img");
            img.src = result.dataUrl;
            img.style.cssText = `display:block;width:${result.width}px;height:${result.height}px;pointer-events:none;`;

            span.innerHTML = "";
            span.appendChild(img);
            span.className = span.className
              .replace(/card-hero-stat-gradient/g, "")
              .replace(/\s+/g, " ")
              .trim();
            span.style.width = `${result.width}px`;
            span.style.height = `${result.height}px`;
            span.style.display = "flex";
            span.style.alignItems = "center";
            span.style.justifyContent = "center";
          }
        } catch (e) {
          console.warn("DownloadButton: canvas hero-stat render failed", e);
        }
      }

      await new Promise((r) => setTimeout(r, 50));

      let dataUrl: string;
      try {
        dataUrl = await toPng(cardRef.current, {
          quality: 1,
          pixelRatio: 2,
          cacheBust: true,
          skipAutoScale: true,
          canvasWidth: CARD_W * 2,
          canvasHeight: CARD_H * 2,
        });
      } finally {
        document.documentElement.removeAttribute("data-exporting");
        if (fontStyleEl?.parentNode) fontStyleEl.remove();
        for (const { el, cssText } of savedStyles) {
          el.style.cssText = cssText;
        }
        for (const { img, src } of savedSrcs) {
          img.src = src;
        }
        /* restore canvas swap */
        if (heroStatSwap) {
          heroStatSwap.span.innerHTML = heroStatSwap.innerHTML;
          heroStatSwap.span.className = heroStatSwap.className;
          heroStatSwap.span.style.cssText = heroStatSwap.cssText;
          heroStatSwap = null;
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
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
      setState("error");
      setTimeout(() => reset(), 3000);
      document.documentElement.removeAttribute("data-exporting");
      if (fontStyleEl?.parentNode) fontStyleEl.remove();
      for (const { el, cssText } of savedStyles) {
        el.style.cssText = cssText;
      }
      for (const { img, src } of savedSrcs) {
        img.src = src;
      }
      if (heroStatSwap) {
        heroStatSwap.span.innerHTML = heroStatSwap.innerHTML;
        heroStatSwap.span.className = heroStatSwap.className;
        heroStatSwap.span.style.cssText = heroStatSwap.cssText;
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
            <circle
              cx="12"
              cy="12"
              r="10"
              strokeDasharray="30 70"
              strokeDashoffset="0"
            />
          </motion.svg>
        ) : state === "done" ? (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : state === "error" ? (
          <svg
            className="w-4 h-4 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
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
