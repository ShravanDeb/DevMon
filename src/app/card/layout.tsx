import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generate Card",
  description:
    "Generate your GitHub developer trading card with rarity, stats, and flavor text.",
};

export default function CardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
