"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Footer } from "@/components/Footer";

const faqs = [
  {
    q: "How does DevMon compute my stats and rarity?",
    a: "DevMon fetches your public GitHub data (commits, PRs, repos, languages, contributions, streaks) and runs it through a scoring pipeline that computes five stat categories: Merge Force, Code Velocity, Problem Solving, Open Source, and Consistency. These stats are then mapped to a rarity tier — Common, Rare, Epic, Legendary, or Mythic — based on a composite rarity score. The algorithm weighs factors like contribution volume, repo diversity, PR close rates, and streak consistency.",
  },
  {
    q: "Is my GitHub data stored or shared publicly?",
    a: "Your GitHub data is stored in our database solely to render your card and power the verification page. It is not shared with third parties. However, your generated card — including your username, avatar, stats, rarity, and class — is publicly visible to anyone who has your verification link (/verify/DM-XXXXXX). This is by design: verification links exist so you can prove your card is authentic. You can request full deletion by contacting us.",
  },
  {
    q: "Can I delete my card or revoke access?",
    a: "Yes, on two fronts. To revoke DevMon's future access to your GitHub data, go to GitHub Settings → Applications and remove DevMon. To delete your stored card data and remove your leaderboard entry, email us at shravandeb@gmail.com with your GitHub username. We process deletion requests within 30 days.",
  },
  {
    q: "Can I regenerate my card with a different flavor tone?",
    a: "Yes. When you generate a card, you can choose between \"hype\" (celebratory) and \"roast\" (brutally honest) flavor tones. Each tone produces different flavor text, achievements, and a different signature move. You can regenerate as many times as you like — each generation produces a new unique card ID.",
  },
  {
    q: "Is DevMon free?",
    a: "Yes. DevMon is free to use. There are no paid tiers, no credits, and no hidden costs. Generate and share as many cards as you want.",
  },
  {
    q: "Is this an official GitHub product?",
    a: "No. DevMon is an independent project and is not affiliated with, endorsed by, or sponsored by GitHub, Inc. GitHub is a registered trademark of GitHub, Inc.",
  },
  {
    q: "How do I report a bug or contact support?",
    a: "You can reach us at shravandeb@gmail.com or open an issue on our GitHub repository at github.com/ShravanDeb/DevMon/issues. We'll get back to you as soon as we can.",
  },
];

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: (typeof faqs)[number];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-[10px] neu-raised overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
        type="button"
      >
        <span className="font-display text-[15px] font-[600] text-text-primary leading-snug">
          {item.q}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-text-tertiary text-[20px] leading-none shrink-0 font-light"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5">
              <p className="text-[14px] leading-[1.8] text-text-secondary">
                {item.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQContent() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <AccordionItem
          key={i}
          item={faq}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? null : i)}
        />
      ))}
    </div>
  );
}

export default function FAQPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 max-w-3xl mx-auto px-6 py-24 w-full">
        <h1 className="font-display text-[32px] font-[600] text-text-primary mb-2">
          Frequently Asked Questions
        </h1>
        <p className="text-[15px] text-text-secondary mb-10">
          Everything you need to know about DevMon.
        </p>

        <FAQContent />
      </div>

      <Footer />
    </main>
  );
}
