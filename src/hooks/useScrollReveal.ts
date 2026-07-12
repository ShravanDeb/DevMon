"use client";

import { useEffect, useRef } from "react";

interface ScrollRevealOptions {
  direction?: "up" | "down" | "left" | "right" | "fade";
  delay?: number;
  duration?: number;
  stagger?: number;
  threshold?: number;
  once?: boolean;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>({
  direction = "up",
  delay = 0,
  duration = 0.6,
  stagger = 0,
  threshold = 0.15,
  once = true,
}: ScrollRevealOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const distance = 40;
      const from = {
        opacity: 0,
        y: direction === "up" ? distance : direction === "down" ? -distance : 0,
        x: direction === "left" ? distance : direction === "right" ? -distance : 0,
      };

      const to = {
        opacity: 1,
        y: 0,
        x: 0,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: `0% ${(1 - threshold) * 100}%`,
          toggleActions: once ? "play none none none" : "play none none reset",
        },
      };

      if (stagger && el.children.length) {
        (to as Record<string, unknown>).stagger = stagger;
        gsap.fromTo(el.children, from, to);
      } else {
        gsap.fromTo(el, from, to);
      }
    };

    init();
  }, [direction, delay, duration, stagger, threshold, once]);

  return ref;
}
