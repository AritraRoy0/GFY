import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "./seo/site";

// Vercel sets VERCEL_ENV; outside Vercel (local builds) treat the build as production.
const isProduction = (process.env.VERCEL_ENV ?? "production") === "production";

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    // Preview deployments should never compete with the production site in search results.
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Private pages stay crawlable so their noindex tag is seen; only the sign-out action is blocked.
        disallow: ["/logout"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
