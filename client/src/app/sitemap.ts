import type { MetadataRoute } from "next";
import { absoluteUrl } from "./seo/site";

// Public, indexable pages only. Dashboard, profile, review, and logout pages are noindex.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/loanRequests"), lastModified, changeFrequency: "hourly", priority: 0.9 },
    { url: absoluteUrl("/about"), lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/auth"), lastModified, changeFrequency: "yearly", priority: 0.4 },
  ];
}
