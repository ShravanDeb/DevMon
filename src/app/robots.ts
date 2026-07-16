import { MetadataRoute } from "next";

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://devmon.dev";
const siteUrl = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
