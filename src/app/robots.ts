import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://devmon.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/leaderboard?sort=top"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
