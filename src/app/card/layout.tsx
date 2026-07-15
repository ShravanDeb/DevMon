import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generate Credential",
  description:
    "Generate your verified developer credential from public GitHub activity. Rarity, stats, class, and contribution profile.",
};

export default function CardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
