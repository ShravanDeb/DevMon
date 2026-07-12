import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about DevMon — the developer trading card generator.",
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
