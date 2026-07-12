import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "Top developer trading cards ranked by score and rarity.",
};

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
