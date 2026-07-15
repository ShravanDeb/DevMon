import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about DevMon, the verified developer credential platform.",
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
