"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardData {
  id: number | string;
  image: string;
  alt?: string;
  glow?: string;
}

interface StickyCard002Props {
  cards: CardData[];
  heading?: ReactNode;
  className?: string;
}

const StickyCard002 = ({ cards, heading, className }: StickyCard002Props) => {
  const container = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const triggerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const els = cardRefs.current;
      const total = els.length;
      if (!els[0] || !triggerRef.current) return;

      gsap.set(els[0], { y: 0, scale: 1, rotation: 0 });
      for (let i = 1; i < total; i++) {
        if (els[i]) gsap.set(els[i], { y: "150%", scale: 1, rotation: 0 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "center center",
          end: `+=${window.innerHeight * (total - 1)}`,
          pin: true,
          scrub: 0.5,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      for (let i = 0; i < total - 1; i++) {
        const cur = els[i];
        const nxt = els[i + 1];
        if (!cur || !nxt) continue;
        tl.to(cur, { scale: 0.7, rotation: 5, duration: 1, ease: "none" }, i);
        tl.to(nxt, { y: "0%", duration: 1, ease: "none" }, i);
      }

      const ro = new ResizeObserver(() => ScrollTrigger.refresh());
      if (container.current) ro.observe(container.current);

      return () => {
        ro.disconnect();
        tl.kill();
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    },
    { scope: container },
  );

  return (
    <div ref={container} className={cn("relative", className)}>
      <div ref={triggerRef} className="relative flex items-center justify-center">
        {heading && (
          <div className="absolute top-0 left-0 right-0 text-center px-6 pt-10 z-10">
            {heading}
          </div>
        )}
        <div className="relative aspect-[9/14] w-[min(90vw,380px)] rounded-lg">
          {cards.map((card, i) => (
            <div
              key={card.id}
              className="absolute inset-0 overflow-hidden rounded-lg"
              style={
                card.glow
                  ? {
                      border: `1px solid ${card.glow}50`,
                      boxShadow: `0 0 12px ${card.glow}20, 0 0 40px ${card.glow}25, 0 0 80px ${card.glow}15, inset 0 1px 0 ${card.glow}20`,
                      borderRadius: "0.5rem",
                    }
                  : undefined
              }
              ref={(el) => { cardRefs.current[i] = el; }}
            >
              <img
                src={card.image}
                alt={card.alt || ""}
                className="h-full w-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { StickyCard002 };
