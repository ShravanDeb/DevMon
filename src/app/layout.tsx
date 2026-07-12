import type { Metadata, Viewport } from "next";
import { Fraunces } from "next/font/google";
import { Providers } from "./providers";
import { CustomCursor } from "@/components/CustomCursor";
import { PageTransition } from "@/components/PageTransition";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://devmon.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DevMon — Your GitHub Profile. Upgraded.",
    template: "%s | DevMon",
  },
  description:
    "Turn your GitHub profile into a collectible developer trading card. Rarity, stats, class, and flavor text — all generated from your real code.",
  openGraph: {
    title: "DevMon — Your GitHub Profile. Upgraded.",
    description:
      "Turn your GitHub stats into a shareable developer trading card with rarity, class, and flavor text.",
    type: "website",
    siteName: "DevMon",
    images: [{ url: "/og", width: 1200, height: 630, alt: "DevMon" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevMon — Your GitHub Profile. Upgraded.",
    description:
      "Turn your GitHub stats into a shareable developer trading card.",
    images: ["/og"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable}`}>
      <body className="antialiased min-h-screen bg-surface-0 font-sans text-text-primary">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[9997]"
          style={{ mixBlendMode: "overlay", opacity: 0.03 }}
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <filter id="grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#grain)" />
          </svg>
        </div>
        <Providers>
          <CustomCursor />
          <PageTransition>{children}</PageTransition>
        </Providers>
      </body>
    </html>
  );
}
