import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "Top developer credentials ranked by rarity score. Verified GitHub identities.",
};

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
