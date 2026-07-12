"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/lib/theme";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const cursorColor = theme === "dark" ? "#F2F1EE" : "#1A1A1E";

  // Update cursor color when theme changes
  useEffect(() => {
    const cursor = cursorRef.current;
    const ghost = ghostRef.current;
    if (!cursor || !ghost) return;
    cursor.style.background = cursorColor;
    ghost.style.background = cursorColor;
  }, [cursorColor]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("ontouchstart" in window) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cursor = cursorRef.current;
    const ghost = ghostRef.current;
    if (!cursor || !ghost) return;

    const style = document.createElement("style");
    style.id = "blob-cursor-styles";
    style.textContent = `*, *::before, *::after { cursor: none !important; }`;
    document.head.appendChild(style);

    const mouse = { x: 999, y: 999 };
    const pos = { x: mouse.x, y: mouse.y };
    const last = { x: mouse.x, y: mouse.y };

    const ghostMouse = { x: 999, y: 999 };
    const ghostPos = { x: ghostMouse.x, y: ghostMouse.y };
    const ghostLast = { x: ghostMouse.x, y: ghostMouse.y };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      ghostMouse.x = e.clientX;
      ghostMouse.y = e.clientY;
    };

    const onMouseLeave = () => {
      mouse.x = 999;
      mouse.y = 999;
      ghostMouse.x = 999;
      ghostMouse.y = 999;
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    let destroyed = false;

    const init = async () => {
      const { default: gsap } = await import("gsap");
      if (destroyed) return;

      cursor.style.opacity = "1";
      ghost.style.opacity = "0.4";

      gsap.ticker.add(() => {
        pos.x += (mouse.x - pos.x) * 0.18;
        pos.y += (mouse.y - pos.y) * 0.18;
      });

      gsap.ticker.add(() => {
        const dx = pos.x - last.x;
        const dy = pos.y - last.y;
        const velocity = Math.sqrt(dx * dx + dy * dy);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        const stretch = Math.min(velocity * 0.7, 22);

        gsap.set(cursor, {
          x: pos.x,
          y: pos.y,
          xPercent: -50,
          yPercent: -50,
          rotation: angle,
          scaleX: 1 + stretch / 35,
          scaleY: 1 - stretch / 60,
        });

        last.x = pos.x;
        last.y = pos.y;
      });

      gsap.ticker.add(() => {
        ghostPos.x += (ghostMouse.x - ghostPos.x) * 0.08;
        ghostPos.y += (ghostMouse.y - ghostPos.y) * 0.08;
      });

      gsap.ticker.add(() => {
        const dx = ghostPos.x - ghostLast.x;
        const dy = ghostPos.y - ghostLast.y;
        const velocity = Math.sqrt(dx * dx + dy * dy);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        const stretch = Math.min(velocity * 0.5, 18);

        gsap.set(ghost, {
          x: ghostPos.x,
          y: ghostPos.y,
          xPercent: -50,
          yPercent: -50,
          rotation: angle,
          scaleX: 1 + stretch / 35,
          scaleY: 1 - stretch / 60,
        });

        ghostLast.x = ghostPos.x;
        ghostLast.y = ghostPos.y;
      });
    };

    init();

    return () => {
      destroyed = true;
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.getElementById("blob-cursor-styles")?.remove();
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        data-cursor
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 10,
          height: 10,
          background: cursorColor,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform",
          opacity: 0,
        }}
      />
      <div
        ref={ghostRef}
        data-cursor
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          background: cursorColor,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9997,
          willChange: "transform",
          opacity: 0,
        }}
      />
    </>
  );
}
